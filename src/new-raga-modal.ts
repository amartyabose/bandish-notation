import { App, Modal, Setting } from "obsidian";

export interface NewRagaResult {
  name: string;
  thaat: string;
  vadi: string;
  samvadi: string;
  pakad: string;
  aroha: string;
  avaroha: string;
  varjitAroha: string;
  varjitAvaroha: string;
}

export class NewRagaModal extends Modal {
  private result: NewRagaResult = {
    name: "", thaat: "", vadi: "", samvadi: "", pakad: "",
    aroha: "", avaroha: "", varjitAroha: "", varjitAvaroha: "",
  };
  private onSubmit: (result: NewRagaResult) => void;

  constructor(app: App, onSubmit: (result: NewRagaResult) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "New raga" });

    new Setting(contentEl).setName("Name").addText((t) =>
      t.setPlaceholder("e.g. Yaman").onChange((v) => (this.result.name = v))
    );
    new Setting(contentEl).setName("Thaat").addText((t) =>
      t.onChange((v) => (this.result.thaat = v))
    );
    new Setting(contentEl).setName("Vadi").addText((t) =>
      t.onChange((v) => (this.result.vadi = v))
    );
    new Setting(contentEl).setName("Samvadi").addText((t) =>
      t.onChange((v) => (this.result.samvadi = v))
    );
    new Setting(contentEl)
      .setName("Aroha")
      .setDesc("Space-separated, e.g. S R G M P D N S^")
      .addText((t) => t.onChange((v) => (this.result.aroha = v)));
    new Setting(contentEl)
      .setName("Avaroha")
      .setDesc("Space-separated, e.g. S^ N D P M G R S")
      .addText((t) => t.onChange((v) => (this.result.avaroha = v)));
    new Setting(contentEl).setName("Pakad").addText((t) =>
      t.setPlaceholder("e.g. N R G, M' D N S^").onChange((v) => (this.result.pakad = v))
    );

    new Setting(contentEl).addButton((btn) =>
      btn
	.setButtonText("Create")
	.setCta()
	.onClick(() => {
	if (!this.result.name.trim()) return;
	this.close();
	this.onSubmit(this.result);
      })
    );
  }

  onClose() {
    this.contentEl.empty();
  }
}
