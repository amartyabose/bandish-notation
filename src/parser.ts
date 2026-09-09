export interface BandishLine {
  sargam: string[][];
  sahitya: string[][];
  startVibhag: number;
}
       
export interface BandishSection {
  name: string;
  lines: BandishLine[];
}

export interface Bandish {
  raga?: string;
  taal: string;
  composer?: string;
  sections: BandishSection[];
}

export function splitVibhags(line: string): string[][] {
  return line
    .split("|")
    .map(vibhag => vibhag.trim().split(/\s+/).filter(Boolean));
}

export function parseBandish(source: string, frontmatter?: Record<string, any>): Bandish {
  const dividerIdx = source.indexOf("---");
  if (dividerIdx === -1) {
    throw new Error('Missing "---" divider between header and body.');
  }
  const headerText = source.slice(0, dividerIdx);
  const bodyText = source.slice(dividerIdx + 3);

  const header: Record<string, string> = {};
  for (const rawLine of headerText.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;           // skip blank lines

    const colon = line.indexOf(":");
    if (colon === -1) continue;    // skip lines with no ":"

    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    header[key] = value;
  }

  const taal = frontmatter?.taal ?? header.taal;
  const raga = frontmatter?.raga ?? header.raga;
  const composer = frontmatter?.composer ?? header.composer;

  const sections: BandishSection[] = [];
  let currentSection: BandishSection | null = null;
  let pendingSargam: string[][] | null = null;
  let pendingStart = 0;

  for (const rawLine of bodyText.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const sectionMatch = line.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      currentSection = { name: sectionMatch[1].toLowerCase(), lines: [] };
      sections.push(currentSection);
      pendingSargam = null;
      continue;
    }

    if (!currentSection) continue;

    if (line.toLowerCase().startsWith("start:")) {
      const n = parseInt(line.slice(line.indexOf(":") + 1).trim(), 10);
      pendingStart = Number.isNaN(n) ? 0 : n;
      continue;
    }

    if (line.toLowerCase().startsWith("sargam:")) {
      pendingSargam = splitVibhags(line.slice(line.indexOf(":") + 1));
      continue;
    }

    if (line.toLowerCase().startsWith("sahitya:")) {
      const sahitya = splitVibhags(line.slice(line.indexOf(":") + 1));
      if (pendingSargam) {
	currentSection.lines.push({ sargam: pendingSargam, sahitya, startVibhag: pendingStart});
	pendingSargam = null;
      }
      continue;
    }
  }

  return {raga, taal, composer, sections,};
}
