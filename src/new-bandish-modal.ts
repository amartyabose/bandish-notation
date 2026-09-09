import { App, Modal, Setting } from "obsidian";

export const KNOWN_TAALS = ["Teentaal", "Ektaal", "Jhaptaal", "Rupak", "Kaherva", "Dadra"];

export interface NewBandishResult {
  raga: string;
  taal: string;
  composer: string;
}

export class NewBandishModal extends Modal {
  private raga = "";
  private taal = KNOWN_TAALS[0];
  private composer = "";
  private onSubmit: (result: NewBandishResult) => void;

  constructor(app: App, onSubmit: (result: NewBandishResult) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "New bandish" });

    new Setting(contentEl)
      .setName("Raga")
      .addText((text) =>
	text.setPlaceholder("e.g. Yaman").onChange((value) => (this.raga = value))
      );

    new Setting(contentEl)
      .setName("Taal")
      .addDropdown((dropdown) => {
      KNOWN_TAALS.forEach((t) => {
	dropdown.addOption(t, t);
      });
      dropdown.setValue(this.taal ?? "");
      dropdown.onChange((value) => (this.taal = value));
    });

    new Setting(contentEl)
      .setName("Composer")
      .addText((text) =>
	text.setPlaceholder("optional").onChange((value) => (this.composer = value))
      );

    new Setting(contentEl).addButton((btn) =>
      btn
	.setButtonText("Create")
	.setCta()
	.onClick(() => {
	if (!this.raga.trim()) {
	  return; // simplest possible validation for now
	}
	this.close();
	this.onSubmit({ raga: this.raga, taal: this.taal ?? "", composer: this.composer });
      })
    );
  }

  onClose() {
    this.contentEl.empty();
  }
}
