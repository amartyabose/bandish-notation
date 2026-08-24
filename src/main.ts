import { Plugin, TFile } from 'obsidian';
import { BandishPluginSettings, DEFAULT_SETTINGS } from "./settings";
import { BandishSettingTab } from "./settings-tab";
import { parseBandish } from './parser';
import { NewBandishModal, NewBandishResult } from "./new-bandish-modal";
import { parseRagaBlock } from "./raga-parser";
import { NewRagaModal, NewRagaResult } from "./new-raga-modal";
import { renderRaga } from "./raga-renderer";
import { renderBandish } from "./bandish-renderer";

function toYamlList(spaceSeparated: string): string {
  const items = spaceSeparated.trim().split(/\s+/).filter(Boolean);
  return `[${items.join(", ")}]`;
}

export default class BandishNotationPlugin extends Plugin {
  settings: BandishPluginSettings;

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
  
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new BandishSettingTab(this.app, this)); 

    this.registerMarkdownCodeBlockProcessor("bandish", (source, el, ctx) => {
      try {
	const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
	const frontmatter = file instanceof TFile
	  ? this.app.metadataCache.getFileCache(file)?.frontmatter
	  : undefined;
	const bandish = parseBandish(source, frontmatter);
	renderBandish(el, bandish, this.settings.script);
      } catch (err) {
	el.createEl("div", { text: `Error: ${err instanceof Error ? err.message : String(err)}` });
      }
    });

    this.addCommand({
      id: "new-bandish",
      name: "New bandish",
      callback: () => {
	new NewBandishModal(this.app, (result) => {
	  this.createBandishNote(result);
	}).open();
      },
    });

    this.registerMarkdownCodeBlockProcessor("raga", (source, el) => {
      try {
	const data = parseRagaBlock(source);
	renderRaga(el, data, this.settings.script);
      } catch (err) {
	el.createEl("div", { text: `Error: ${err instanceof Error ? err.message : String(err)}` });
      }
    });

    this.addCommand({
      id: "new-raga",
      name: "New raga",
      callback: () => {
	new NewRagaModal(this.app, (result) => this.createRagaNote(result)).open();
      },
    });
  }

  async createBandishNote(result: NewBandishResult) {
    const safeName = `${result.raga} - ${result.taal}`.replace(/[\\/:*?"<>|]/g, "");
    let fileName = `${safeName}.md`;
    let counter = 1;
    while (this.app.vault.getAbstractFileByPath(fileName)) {
      fileName = `${safeName} ${++counter}.md`;
    }

    const content = `---
raga: "[[${result.raga}]]"
taal: ${result.taal}
composer: ${result.composer}
tags: [bandish]
---

\`\`\`bandish
---
[sthayi]
sargam: 
sahitya: 

[antara]
sargam: 
sahitya: 
\`\`\`
`;

    const file = (await this.app.vault.create(fileName, content)) as TFile;
    await this.app.workspace.getLeaf(false).openFile(file);
  }

  async createRagaNote(result: NewRagaResult) {
    const safeName = result.name.replace(/[\\/:*?"<>|]/g, "");
    let fileName = `${safeName}.md`;
    let counter = 1;
    while (this.app.vault.getAbstractFileByPath(fileName)) {
      fileName = `${safeName} ${++counter}.md`;
    }

    const content = `---
thaat: ${result.thaat}
tags: [raga]
---

\`\`\`raga
vadi: ${result.vadi}
samvadi: ${result.samvadi}
pakad: ${result.pakad}
varjit_aroha: ${toYamlList(result.varjitAroha)}
varjit_avaroha: ${toYamlList(result.varjitAvaroha)}
aroha: ${result.aroha}
avaroha: ${result.avaroha}
chalan: 
\`\`\`
`;

    const file = (await this.app.vault.create(fileName, content)) as any;
    await this.app.workspace.getLeaf(false).openFile(file);
  }

  onunload() {
  }
}
