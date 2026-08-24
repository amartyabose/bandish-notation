export type Script = "devanagari" | "bengali" | "roman";
export type Note = "S" | "R" | "G" | "M" | "P" | "D" | "N";
export type Variant = "shuddha" | "komal" | "tivra";
export type Octave = "mandra" | "madhya" | "taar";

interface GlyphSet {
  devanagari: string;
  bengali: string;
  roman: string;
}

const BASE_GLYPHS: Record<Note, GlyphSet> = {
  S: { devanagari: "सा", bengali: "সা", roman: "S" },
  R: { devanagari: "रे", bengali: "রে", roman: "R" },
  G: { devanagari: "ग", bengali: "গ", roman: "G" },
  M: { devanagari: "म", bengali: "ম", roman: "M" },
  P: { devanagari: "प", bengali: "প", roman: "P" },
  D: { devanagari: "ध", bengali: "ধ", roman: "D" },
  N: { devanagari: "नि", bengali: "নি", roman: "N" },
};

const AVAGRAHA: Record<Script, string> = {
  devanagari: "ऽ",
  bengali: "ऽ",
  roman: "'",
};

export function renderAvagraha(script: Script): string {
  return AVAGRAHA[script];
}

export interface ParsedSwara {
  note: Note;
  variant: Variant;
  octave: Octave;
}

export function parseSwaraToken(token: string): ParsedSwara | null {
  let t = token;
  let octave: Octave = "madhya";
  if (t.startsWith(".")) {
    octave = "mandra";
    t = t.slice(1);
  } else if (t.endsWith("^")) {
    octave = "taar";
    t = t.slice(0, -1);
  }

  const noteChar = t.toUpperCase() as Note;
  if (!(noteChar in BASE_GLYPHS)) return null;

  let variant: Variant = "shuddha";
  if (noteChar === "M") {
    variant = t === "M" ? "tivra" : "shuddha"; // m = shuddha, M = tivra
  } else if (noteChar === "R" || noteChar === "G" || noteChar === "D" || noteChar === "N") {
    variant = t === t.toLowerCase() ? "komal" : "shuddha"; // lowercase = komal
  }
  // S and P: always shuddha, no variant possible

  return { note: noteChar, variant, octave };
}

export function renderSwara(swara: ParsedSwara, script: Script): string {
  return BASE_GLYPHS[swara.note][script];
}

export function variantClass(variant: Variant): string {
  if (variant === "komal") return "bandish-komal";
  if (variant === "tivra") return "bandish-tivra";
  return "";
}

export function octaveClass(octave: Octave): string {
  if (octave === "taar") return "bandish-octave-taar";
  if (octave === "mandra") return "bandish-octave-mandra";
  return "";
}

export function stripTrailingComma(token: string): { token: string; hasComma: boolean } {
  if (token.endsWith(",")) {
    return { token: token.slice(0, -1), hasComma: true };
  }
  return { token, hasComma: false };
}
