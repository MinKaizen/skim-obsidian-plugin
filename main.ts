import { Plugin } from "obsidian";

export default class SkimPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "skim-down",
      name: "Skim down",
      editorCallback: (editor) => {
        const currentCursor = editor.getCursor();
        const maxLine = editor.lineCount() - 1;
        const newLine = Math.min(currentCursor.line + 7, maxLine);
        editor.setCursor({ line: newLine, ch: currentCursor.ch });
      },
    });
    this.addCommand({
      id: "skim-up",
      name: "Skim up",
      editorCallback: (editor) => {
        const currentCursor = editor.getCursor();
        const newLine = Math.max(0, currentCursor.line - 7);
        editor.setCursor({ line: newLine, ch: currentCursor.ch });
      },
    });
  }
}