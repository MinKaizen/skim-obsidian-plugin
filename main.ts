import { Plugin } from "obsidian";

export default class SkimPlugin extends Plugin {
  async onload() {
    console.log("Plugin loaded");
  }

  onunload() {
    console.log("Plugin unloaded");
  }
}