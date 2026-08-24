import { Script } from "./swara-glyphs";

export interface BandishPluginSettings {
  script: Script;
}

export const DEFAULT_SETTINGS: BandishPluginSettings = {
  script: "devanagari",
};
