export interface Taal {
  name: string;
  vibhagMatras: number[];
  markers: string[];
}

export const TAALS: Record<string, Taal> = {
  teentaal: { name: "Teentaal", vibhagMatras: [4, 4, 4, 4], markers: ["X", "2", "0", "3"] },
  ektaal: { name: "Ektaal", vibhagMatras: [2, 2, 2, 2, 2, 2], markers: ["X", "0", "2", "0", "3", "4"] },
  jhaptaal: { name: "Jhaptaal", vibhagMatras: [2, 3, 2, 3], markers: ["X", "2", "0", "3"] },
  rupak: { name: "Rupak", vibhagMatras: [3, 2, 2], markers: ["X", "2", "3"] },
  kaherva: { name: "Kaherva", vibhagMatras: [4, 4], markers: ["X", "0"] },
  dadra: { name: "Dadra", vibhagMatras: [3, 3], markers: ["X", "0"] },
};

export function getTaal(name: string): Taal {
  const taal = TAALS[name.trim().toLowerCase()];
  if (!taal) {
    throw new Error(`Unknown taal "${name}". Known: ${Object.keys(TAALS).join(", ")}`);
  }
  return taal;
}
