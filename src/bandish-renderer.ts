import { Bandish, BandishLine } from "./parser";
import { getTaal, Taal } from "./taal-data";
import {
  parseSwaraToken,
  renderSwara,
  renderAvagraha,
  octaveClass,
  variantClass,
  stripTrailingComma,
  Script,
} from "./swara-glyphs";

export function renderSargamCell(rawToken: string, script: Script): HTMLElement {
  const cell = createDiv() as HTMLElement;
  cell.addClass("bandish-sargam-cell");

  if (rawToken === "-") {
    cell.setText("–");
    cell.addClass("bandish-rest");
    return cell;
  }

  if (rawToken === "'") {
    cell.setText(renderAvagraha(script));
    cell.addClass("bandish-avagraha");
    return cell;
  }

  const { token, hasComma } = stripTrailingComma(rawToken);

  if (token.includes("+")) {
    cell.addClass("bandish-cluster");
    token.split("+").forEach((part) => {
      const swara = parseSwaraToken(part);
      const sub = createSpan();
      sub.addClass("bandish-cluster-note");
      if (swara) {
	sub.setText(renderSwara(swara, script));
	const oc = octaveClass(swara.octave);
	if (oc) sub.addClass(oc);
	const vc = variantClass(swara.variant);
	if (vc) sub.addClass(vc);
      } else {
	sub.setText(part);
	sub.addClass("bandish-unknown");
      }
      cell.appendChild(sub);
    });
    if (hasComma) cell.appendChild(document.createTextNode(","));
    return cell;
  }

  const swara = parseSwaraToken(token);
  if (swara) {
    cell.setText(renderSwara(swara, script) + (hasComma ? "," : ""));
    const oc = octaveClass(swara.octave);
    if (oc) cell.addClass(oc);
    const vc = variantClass(swara.variant);
    if (vc) cell.addClass(vc);
  } else {
    cell.setText(token + (hasComma ? "," : ""));
    cell.addClass("bandish-unknown");
    cell.setAttr("title", `Unrecognised swara token: "${token}"`);
  }

  return cell;
}

function renderVibhag(
  sargamTokens: string[],
  sahityaTokens: string[],
  marker: string,
  script: Script
): HTMLElement {
  const vibhagEl = createDiv() as HTMLElement;
  vibhagEl.addClass("bandish-vibhag");
  vibhagEl.style.gridTemplateColumns = `repeat(${sargamTokens.length}, minmax(2em, 1fr))`;

  const markerEl = createDiv() as HTMLElement;
  markerEl.addClass("bandish-marker");
  markerEl.setText(marker);
  markerEl.style.gridColumn = `1 / span ${sargamTokens.length}`;
  vibhagEl.appendChild(markerEl);

  sargamTokens.forEach((token) => {
    vibhagEl.appendChild(renderSargamCell(token, script));
  });

  sahityaTokens.forEach((token) => {
    const cell = createDiv() as HTMLElement;
    cell.addClass("bandish-sahitya-cell");
    cell.setText(token === "-" ? "–" : token);
    vibhagEl.appendChild(cell);
  });

  return vibhagEl;
}

function renderLine(line: BandishLine, taal: Taal, script: Script): HTMLElement {
  const lineEl = createDiv() as HTMLElement;
  lineEl.addClass("bandish-line");

  const vibhagCount = Math.max(line.sargam.length, line.sahitya.length);
  for (let v = 0; v < vibhagCount; v++) {
    const sargamTokens = line.sargam[v] ?? [];
    const sahityaTokens = line.sahitya[v] ?? [];
    const marker = taal.markers[(line.startVibhag + v) % taal.markers.length] ?? String(v + 1);
    lineEl.appendChild(renderVibhag(sargamTokens, sahityaTokens, marker, script));
  }

  return lineEl;
}

export function renderBandish(container: HTMLElement, bandish: Bandish, script: Script): void {
  container.empty();
  container.addClass("bandish-container");

  const taal = getTaal(bandish.taal);

  const meta = container.createDiv({ cls: "bandish-meta" });
  if (bandish.raga) meta.createSpan({ text: `Raga: ${bandish.raga}`, cls: "bandish-meta-item" });
  meta.createSpan({ text: `Taal: ${taal.name}`, cls: "bandish-meta-item" });
  if (bandish.composer)
    meta.createSpan({ text: bandish.composer, cls: "bandish-meta-item bandish-composer" });

  for (const section of bandish.sections) {
    container.createDiv({
      text: section.name.charAt(0).toUpperCase() + section.name.slice(1),
      cls: "bandish-section-title",
    });
    const sectionEl = container.createDiv({ cls: "bandish-section" });
    for (const line of section.lines) {
      sectionEl.appendChild(renderLine(line, taal, script));
    }
  }
}
