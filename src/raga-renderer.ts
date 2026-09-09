import { RagaData } from "./raga-parser";
import { parseSwaraToken, renderSwara, octaveClass, variantClass, stripTrailingComma, Script } from "./swara-glyphs";

function renderSwaraRow(container: HTMLElement, label: string, tokens: string[], script: Script) {
  const row = container.createDiv({ cls: "raga-row" });
  row.createSpan({ text: label, cls: "raga-row-label" });
  const swaraLine = row.createDiv({ cls: "raga-swara-line" });

  tokens.forEach((rawToken) => {
    const { token, hasComma } = stripTrailingComma(rawToken);
    const swara = parseSwaraToken(token);
    const cell = swaraLine.createSpan({ cls: "raga-swara-cell" });

    if (swara) {
      cell.setText(renderSwara(swara, script));
      const oc = octaveClass(swara.octave);
      if (oc) cell.addClass(oc);
      const vc = variantClass(swara.variant);
      if (vc) cell.addClass(vc);
    } else {
      cell.setText(token);
      cell.addClass("bandish-unknown");
    }

    if (hasComma) {
      swaraLine.createSpan({ text: ",", cls: "raga-comma" });
    }
  });
}

export function renderRaga(container: HTMLElement, data: RagaData, script: Script = "devanagari") {
  container.empty();
  container.addClass("raga-container");

  if (data.aroha.length) renderSwaraRow(container, "Aroha", data.aroha, script);
  if (data.avaroha.length) renderSwaraRow(container, "Avaroha", data.avaroha, script);
  if (data.chalan.length) renderSwaraRow(container, "Chalan", data.chalan, script);
  if (data.pakad.length) renderSwaraRow(container, "Pakad", data.pakad, script);
  if (data.vadi.length) renderSwaraRow(container, "Vadi", data.vadi, script);
  if (data.samvadi.length) renderSwaraRow(container, "Samvadi", data.samvadi, script);
  if (data.varjitAroha.length) renderSwaraRow(container, "Varjit (aroha)", data.varjitAroha, script);
  if (data.varjitAvaroha.length) renderSwaraRow(container, "Varjit (avaroha)", data.varjitAvaroha, script);
}
