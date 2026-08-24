import { App, PluginSettingTab, Setting } from "obsidian";
import BandishNotationPlugin from "./main";

export class BandishSettingTab extends PluginSettingTab {
  plugin: BandishNotationPlugin;

  constructor(app: App, plugin: BandishNotationPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Script")
      .setDesc("Script used to render swaras across raga and bandish notes.")
      .addDropdown((dropdown) =>
	dropdown
	  .addOption("devanagari", "Devanagari")
	  .addOption("bengali", "Bengali")
	  .addOption("roman", "Roman")
	  .setValue(this.plugin.settings.script)
	  .onChange(async (value) => {
	  this.plugin.settings.script = value as "devanagari" | "bengali" | "roman";
	  await this.plugin.saveSettings();
	})
      );
  }
}
