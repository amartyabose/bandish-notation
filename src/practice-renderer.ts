import { PracticeLine } from "./practice-parser";
import { renderSargamCell } from "./bandish-renderer";
import { Script } from "./swara-glyphs";

function renderPracticeLine(container: HTMLElement, line: PracticeLine, script: Script) {
  const lineEl = container.createDiv({ cls: "practice-line" });

  if (line.label) {
    lineEl.createSpan({ text: line.label, cls: "practice-line-label" });
  }

  const vibhagsEl = lineEl.createDiv({ cls: "practice-vibhags" });
  line.vibhags.forEach((tokens) => {
    const vibhagEl = vibhagsEl.createDiv({ cls: "practice-vibhag" });
    tokens.forEach((token) => {
      vibhagEl.appendChild(renderSargamCell(token, script));
    });
  });
}

export function renderPractice(container: HTMLElement, lines: PracticeLine[], script: Script): void {
  container.empty();
  container.addClass("practice-container");
  lines.forEach((line) => renderPracticeLine(container, line, script));
}
