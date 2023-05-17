import { Plugin, TFile, TFolder, Vault, normalizePath } from 'obsidian';

import Settings from './models/settings';

import { SettingsTabComponent } from './components/settings-tab-component';
import { DEFAULT_SETTINGS } from './constants';
import { generateStyles } from './generate-styles';
import moment from 'moment';

export default class YearTimelinePlugin extends Plugin {
  settings: Settings;
  isHovering = false;
  timelineTooltipEl?: HTMLElement;

  async onload() {
    this.addSettingTab(new SettingsTabComponent(this.app, this));
    await this.loadSettings();
    document.head.appendChild(generateStyles(this.settings));
    
    let cssChangeTimer: NodeJS.Timeout;
    let mouseMoveTimer: NodeJS.Timeout;

    this.app.workspace.on("css-change", () => {
      cssChangeTimer && clearTimeout(cssChangeTimer);
      cssChangeTimer = setTimeout(() => this.reload(), 1000);
    });

    this.registerDomEvent(document, "mousemove", (e) => {
      if (this.isHovering) this.endHover();
      mouseMoveTimer && clearTimeout(mouseMoveTimer);
      mouseMoveTimer = setTimeout(() => this.startHover(e), 100);
    })

    this.registerDomEvent(document, "click", (e) => {
      if ((e.target as HTMLElement)?.matches('div[data-timeline]')) {
        e.preventDefault();

        const date = moment(String(this.getMouseDayOfYear(e)), "DDD").format('YYYY-MM-DD');

        const dailyNotesFolder = app.vault.getAbstractFileByPath(
          normalizePath('Daily log')
        ) as TFolder;

        let dailyNote: TFile | null = null;

        Vault.recurseChildren(dailyNotesFolder, (note) => {
          if (note instanceof TFile) {
            if (note.name.includes(date)) {
              return dailyNote = note;
            }
          }
        });
        
        if (dailyNote) {
          app.workspace.getLeaf().openFile(dailyNote);
        } else {
          this.hideTooltip();
          this.isHovering = true;
          this.showTooltip("No note for date " + date, e);
        }
      }
    })
  }
  
  onunload() {
    document.getElementById('timeline-plugin-style')?.remove();
  }

  startHover(e: MouseEvent) {
    if (!this.isHovering && (e.target as HTMLElement)?.matches('div[data-timeline]')) {
      this.hideTooltip();
      this.isHovering = true;
      const dayOfYear = moment(this.getMouseDayOfYear(e), "DDD");

      if (dayOfYear.isValid()) {
        this.showTooltip(dayOfYear.format('YYYY-MM-DD'), e);
      }

    }
  }

  endHover() {
    this.isHovering = false;
    this.hideTooltip();
  }

  showTooltip(message: string, e: MouseEvent) {
    this.timelineTooltipEl = document.createElement('div');
    this.timelineTooltipEl.textContent = message;
    this.timelineTooltipEl.style.position = 'fixed';
    this.timelineTooltipEl.style.left = e.clientX + 'px';
    this.timelineTooltipEl.style.top = e.clientY + 'px';
    this.timelineTooltipEl.style.color = '#000';
    this.timelineTooltipEl.style.background = '#F0F0F0';
    this.timelineTooltipEl.style.padding = '8px';
    this.timelineTooltipEl.style.borderRadius = '4px';
    this.timelineTooltipEl.style.fontSize = '10px';
    this.timelineTooltipEl.style.fontWeight = '600';
    this.timelineTooltipEl.style.zIndex = '100';
    document.body.appendChild(this.timelineTooltipEl);
  }

  hideTooltip() {
    this.timelineTooltipEl?.remove();
  }

  getMouseDayOfYear(e: MouseEvent) {
    const rect = (e.target as HTMLElement)?.getBoundingClientRect();
    const yearWidth = rect.width;
    const x = e.clientX - rect.left;

    const daysInYear = 365;

    return Math.floor((x / yearWidth) * daysInYear) + 1;
  }
  
  reload() {
    this.onunload();
    document.head.appendChild(generateStyles(this.settings));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
