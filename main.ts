import { App, Plugin, Setting, Editor, PluginSettingTab } from "obsidian";

interface SkimPluginSettings {
	linesUp: number;
	linesDown: number;
}

const DEFAULT_SETTINGS: SkimPluginSettings = {
	linesUp: 7,
	linesDown: 7,
}

export default class SkimPlugin extends Plugin {
  settings: SkimPluginSettings;

  moveCursor(editor: Editor, offset: number) {
    const cursor = editor.getCursor()
    const currentLine = cursor.line
    const targetLine = currentLine + offset
    const minLine = 0
    const maxLine = editor.lineCount() - 1;
    const newLine = Math.clamp(targetLine, minLine, maxLine)
    editor.setCursor({ line: newLine, ch: cursor.ch });
  }

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "skim-down",
      name: "Skim down",
      editorCallback: (editor) => {
        this.moveCursor(editor, this.settings.linesDown)
      },
    });

    this.addCommand({
      id: "skim-up",
      name: "Skim up",
      editorCallback: (editor) => {
        this.moveCursor(editor, (-1) * this.settings.linesUp)
      },
    });

    this.addSettingTab(new SkimPluginSettingsTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SkimPluginSettingsTab extends PluginSettingTab {
  plugin: SkimPlugin;

  constructor(app: App, plugin: SkimPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Number of Lines (down)')
      .setDesc('Number of lines to skim when skimming downwards')
      .addText(text => {
        text.inputEl.type = 'number';
        text.inputEl.min = '1';
        text.setValue(this.plugin.settings.linesDown.toString());
        text.onChange(async (value) => {
          const newValue = parseInt(value);
          if (!isNaN(newValue) && newValue > 0) {
            this.plugin.settings.linesDown = newValue;
            await this.plugin.saveSettings();
          }
        })
      });

    new Setting(containerEl)
      .setName('Number of Lines (up)')
      .setDesc('Number of lines to skim when skimming upwards')
      .addText(text => {
        text.inputEl.type = 'number';
        text.inputEl.min = '1';
        text.setValue(this.plugin.settings.linesUp.toString());
        text.onChange(async (value) => {
          const newValue = parseInt(value);
          if (!isNaN(newValue) && newValue > 0) {
            this.plugin.settings.linesUp = newValue;
            await this.plugin.saveSettings();
          }
        })
      });

    
  }
}