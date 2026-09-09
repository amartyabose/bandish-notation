import { splitVibhags } from "./parser";

export interface PracticeLine {
  label?: string;
  vibhags: string[][];
}

export function parsePracticeBlock(source: string): PracticeLine[] {
  const lines: PracticeLine[] = [];

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    let label: string | undefined;
    let rest = line;

    // Optional "label:" prefix. Only treated as a label if the text
    // before the ":" looks like a plain word/phrase (letters, digits,
    // spaces, hyphens) — this stops a bare sargam line like
    // "S g m | g+m g '" from ever being misread as labeled, since a
    // swara sequence never matches that shape.
    const colon = line.indexOf(":");
    if (colon !== -1) {
      const maybeLabel = line.slice(0, colon).trim();
      if (/^[\w\s-]+$/.test(maybeLabel)) {
	label = maybeLabel;
	rest = line.slice(colon + 1).trim();
      }
    }

    lines.push({ label, vibhags: splitVibhags(rest) });
  }

  return lines;
}
