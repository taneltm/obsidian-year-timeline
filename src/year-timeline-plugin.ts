import { Plugin } from 'obsidian';

import Settings from './models/settings';
import { SettingsTabComponent } from './components/settings-tab-component';
import { DEFAULT_SETTINGS } from './constants';
import { generateStyles } from './generate-styles';
import * as dailyNotesIntegration from './daily-notes-integration';

export default class YearTimelinePlugin extends Plugin {
  settings: Settings;

  async onload() {
    this.addSettingTab(new SettingsTabComponent(this.app, this));
    await this.loadSettings();
    document.head.appendChild(generateStyles(this.settings));
    
    let cssChangeTimer: NodeJS.Timeout;
    
    this.app.workspace.on("css-change", () => {
      cssChangeTimer && clearTimeout(cssChangeTimer);
      cssChangeTimer = setTimeout(() => this.reload(), 1000);
    });
    
    dailyNotesIntegration.setup(this.app, this);
    dailyNotesIntegration.registerEventListeners(this.app, this);
  }
  
  onunload() {
    document.getElementById('timeline-plugin-style')?.remove();
  }
  
  reload() {
    this.onunload();
    document.head.appendChild(generateStyles(this.settings));
    dailyNotesIntegration.setup(this.app, this);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
