export interface RagaData {
  aroha: string[];
  avaroha: string[];
  chalan: string[];
  vadi: string[];
  samvadi: string[];
  pakad: string[];
  varjitAroha: string[];
  varjitAvaroha: string[];
}

export function parseRagaBlock(source: string): RagaData {
  const lines: Record<string, string[]> = {};

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    lines[key] = value.split(/\s+/).filter(Boolean);
  }

  return {
    aroha: lines.aroha ?? [],
    avaroha: lines.avaroha ?? [],
    chalan: lines.chalan ?? [],
    vadi: lines.vadi ?? [],
    samvadi: lines.samvadi ?? [],
    pakad: lines.pakad ?? [],
    varjitAroha: lines["varjit_aroha"] ?? [],
    varjitAvaroha: lines["varjit_avaroha"] ?? [],
  };
}
