import { App, ColorComponent, PluginSettingTab, Setting, TextComponent } from "obsidian";
import moment from "moment";

import YearTimelinePlugin from "../year-timeline-plugin";
import { DEFAULT_SETTINGS, snippets } from "../constants";
import { Month, MonthSettings } from "src/models/settings";

export class SettingsTabComponent extends PluginSettingTab {
  plugin: YearTimelinePlugin;

  previewDate: string;

  constructor(app: App, plugin: YearTimelinePlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.previewDate = moment().format("YYYY-06-01");
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();

    this.displaySnippet();
    this.displayTimelineSettings();
    this.displayPreview();
    this.displayDayMarkerSettings();
    this.displayCustomMarkerSettings();
    this.displayDailyNotesIntegrationSettings();
  }

  displayPreview() {
    const {containerEl} = this;

    containerEl.createEl('h2', {text: 'Preview'});
  
    containerEl
    .createDiv({
      attr: {
        style: `
          outline: 1px solid var(--background-modifier-border);
          overflow: hidden;
          margin-bottom: 1rem;
        `,
      }
    })
    .createEl('i', {
      attr: {
        'data-timeline': moment(this.previewDate).format('DDD'),
        style: 'min-width: 600px',
      }
    });

    
    containerEl
    .createDiv({
      attr: {
        style: `
          display: flex;
          justify-content: flex-end;
          gap: 0.25rem;
          flex-wrap: wrap;
          padding: 0.25rem 0;
        `
      }
    })
    .createEl('input', {
      attr: {
        type: 'date',
        value: this.previewDate
      }
    })
    .addEventListener('change', (event) => {
      const date = (event.currentTarget as HTMLInputElement).value;
      
      this.previewDate = moment(date).format('YYYY-MM-DD');
      this.display();
    })
  }

  displaySnippet() {
    const {containerEl} = this;

    containerEl.createEl('h2', {text: 'Snippet'});
    
    const snippetFor = containerEl.createDiv({
      attr: {
        style: `
          display: flex;
          justify-content: flex-end;
          gap: 0.25rem;
          flex-wrap: wrap;
          padding: 0.25rem 0;
        `
      }
    });

    
    const snippet = containerEl.createEl('textarea', {
      attr: {
        rows: 3,
        placeholder: 'Pick a snippet type, copy-paste to MD file',
        readonly: true,
        style: `
          resize: none;
          width: 100%;
        `,
      }
    })

    snippets.forEach(({buttonLabel, code}) => {
      snippetFor.createEl('input', { value: buttonLabel, type: 'button'}).onclick = () => {
        snippet.value = code;
      }
    })
  }

  displayDayMarkerSettings() {
    const {containerEl} = this;

    containerEl.createEl('h2', {text: 'Day marker settings'});

    new Setting(containerEl)
    .setName('Marker')
    .addDropdown((component) => component
      .addOption('line', 'Line')
      .addOption('circle', 'Circle')
      .addOption('emoji', 'Emoji or symbol')
      .setValue(this.plugin.settings.dayMarker.style)

      .onChange(async (value: 'line' | 'circle' | 'emoji') => {
        this.plugin.settings.dayMarker.style = value;
        await this.plugin.saveSettings();
        this.plugin.reload();
        this.display();
      })
    )

    switch (this.plugin.settings.dayMarker.style) {
      case 'line': {
        new Setting(containerEl)
        .setName('Line color')
        .addColorPicker((component) => component
          .setValue(this.plugin.settings.dayMarker.line.color)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.line.color = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.line.color = DEFAULT_SETTINGS.dayMarker.line.color;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        new Setting(containerEl)
        .setName('Line width')
        .addSlider((component) => component
          .setLimits(1, 50, 0.5)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.dayMarker.line.width)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.line.width = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.line.width = DEFAULT_SETTINGS.dayMarker.line.width;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        break;
      }
      case 'circle': {
        new Setting(containerEl)
        .setName('Circle color')
        .addColorPicker((component) => component
          .setValue(this.plugin.settings.dayMarker.circle.color)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.circle.color = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.circle.color = DEFAULT_SETTINGS.dayMarker.circle.color;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        new Setting(containerEl)
        .setName('Circle border color')
        .addColorPicker((component) => component
          .setValue(this.plugin.settings.dayMarker.circle.border)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.circle.border = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.circle.border = DEFAULT_SETTINGS.dayMarker.circle.border;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        new Setting(containerEl)
        .setName('Circle border thickness')
        .addSlider((component) => component
        .setLimits(1, 50, 0.5)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.dayMarker.circle.borderWidth)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.circle.borderWidth = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.circle.borderWidth = DEFAULT_SETTINGS.dayMarker.circle.borderWidth;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        new Setting(containerEl)
        .setName('Circle radius')
        .addSlider((component) => component
          .setLimits(1, 200, 1)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.dayMarker.circle.radius)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.circle.radius = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.circle.radius = DEFAULT_SETTINGS.dayMarker.circle.radius;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        break;
      }
      case 'emoji': {
        new Setting(containerEl)
        .setName('Emoji or symbol character')
        .addText((component) => component
          .setValue(this.plugin.settings.dayMarker.emoji.character)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.emoji.character = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.emoji.character = DEFAULT_SETTINGS.dayMarker.emoji.character;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        new Setting(containerEl)
        .setName('Adjust emoji or symbol size')
        .addSlider((component) => component
          .setLimits(0.15, 3, 0.05)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.dayMarker.emoji.scale)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.emoji.scale = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.emoji.scale = DEFAULT_SETTINGS.dayMarker.emoji.scale;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        new Setting(containerEl)
        .setName('Adjust emoji or symbol X offset')
        .addSlider((component) => component
          .setLimits(-100, 100, 1)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.dayMarker.emoji.offsetX)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.emoji.offsetX = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.emoji.offsetX = DEFAULT_SETTINGS.dayMarker.emoji.offsetX;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        new Setting(containerEl)
        .setName('Adjust emoji or symbol Y offset')
        .addSlider((component) => component
          .setLimits(-100, 100, 1)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.dayMarker.emoji.offsetY)
          .onChange(async (value) => {
            this.plugin.settings.dayMarker.emoji.offsetY = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-rotate-ccw')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.dayMarker.emoji.offsetY = DEFAULT_SETTINGS.dayMarker.emoji.offsetY;
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );

        break;
      }
    }
  }

  displayTimelineSettings() {
    const {containerEl} = this;

    containerEl.createEl('h2', {text: 'Timeline settings'});

    new Setting(containerEl)
    .setName('Timeline style')
    .addDropdown((component) => component
      .addOption('solid', 'Solid months')
      .addOption('gradient', 'Gradient')
      .addOption('custom', 'Custom SVG')
      .setValue(this.plugin.settings.timeline.style)
      .onChange(async (value: 'solid' | 'gradient' | 'custom') => {
        this.plugin.settings.timeline.style = value;
        await this.plugin.saveSettings();
        this.plugin.reload();
        this.display();
      })
    );

    switch (this.plugin.settings.timeline.style) {
      case 'solid': {
        return this.displayTimelineMonthSettings();
      }
      case 'gradient': {
        return this.displayTimelineGradientSettings();
      }
      case 'custom': {
        return this.displayTimelineCustomSettings();
      }
    }
  }
  
  displayTimelineMonthSettings() {
    const {containerEl} = this;
  
    const { solid: monthSettings } = this.plugin.settings.timeline;
  
    Object.entries(monthSettings).forEach(async ([month, { name, color }]: [month: Month, setting: MonthSettings]) => {
      let colorPicker: ColorComponent;
      let nameField: TextComponent;
  
      new Setting(containerEl)
      .setName(name)
      .addText((component) => nameField = component
        .setValue(name)
        .onChange(async (value) => {
          this.plugin.settings.timeline.solid[month].name = value;
          await this.plugin.saveSettings();
          this.plugin.reload();
        })
      )
      .addColorPicker((colorComponent) => colorPicker = colorComponent
        .setValue(color)
        .onChange(async (value) => {
          this.plugin.settings.timeline.solid[month].color = value;
          await this.plugin.saveSettings();
          this.plugin.reload();
        })
      )
      .addExtraButton((component) => component
        .setIcon('lucide-rotate-ccw')
        .setTooltip('Reset to default')
        .onClick(() => {
          this.plugin.settings.timeline.solid[month] = {
            name: DEFAULT_SETTINGS.timeline.solid[month].name,
            color: DEFAULT_SETTINGS.timeline.solid[month].color,
          };
          nameField.setValue(this.plugin.settings.timeline.solid[month].name);
          colorPicker.setValue(this.plugin.settings.timeline.solid[month].color);
        })
      );
    })
  }

  displayTimelineGradientSettings() {
    const {containerEl} = this;
  
    const { gradient } = this.plugin.settings.timeline;

    if (gradient.colors.length) {
      gradient.colors.forEach((colorSettings, index) => {
        const {offset, color} = colorSettings;

        new Setting(containerEl)
        .setName("#" + (index + 1))
        .addColorPicker((component) => component
          .setValue(color)
          .onChange(async (value) => {
            this.plugin.settings.timeline.gradient.colors[index].color = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addSlider((component) => component
          .setValue(offset)
          .setDynamicTooltip()
          .setLimits(0, 100, 0.5)
          .onChange(async (value) => {
            this.plugin.settings.timeline.gradient.colors[index].offset = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addExtraButton((component) => component
          .setIcon('lucide-trash-2')
          .setTooltip('Remove')
          .onClick(async () => {
            this.plugin.settings.timeline.gradient.colors = (
              this.plugin.settings.timeline.gradient.colors.filter((someSettings) => someSettings != colorSettings)
            );
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );
      })
    } else {
      containerEl.createEl('p', {
        text: 'No gradient colors. Try to add one!',
      });
    }

    containerEl
    .createDiv({
      attr: {
        style: `
          display: flex;
          justify-content: flex-end;
          gap: 0.25rem;
          flex-wrap: wrap;
          padding: 0.25rem 0;
        `
      }
    })
    .createEl('input', {
      attr: {
        type: 'button',
        value: 'Add gradient color!'
      }
    })
    .addEventListener('click', async (event) => {
      
      const offset = 50;
      const color = '#FF0000';

      this.plugin.settings.timeline.gradient.colors = [
        ...this.plugin.settings.timeline.gradient.colors,
        { offset, color }
      ];

      await this.plugin.saveSettings();
      this.plugin.reload();
      this.display();
    })
  }

  displayTimelineCustomSettings() {
    const {containerEl} = this;

    new Setting(containerEl)
    .addTextArea((component) => {
      component.inputEl.style.width = '100%';
      component.inputEl.style.resize = 'none';
      component.inputEl.rows = 10;

      component.inputEl.parentElement?.parentElement?.querySelector('.setting-item-info')?.remove();

      component
      .setValue(this.plugin.settings.timeline.custom)
      .onChange(async (value) => {
        this.plugin.settings.timeline.custom = value;
        await this.plugin.saveSettings();
        this.plugin.reload();
      })
    })
    .addExtraButton((component) => component
      .setIcon('lucide-rotate-ccw')
      .setTooltip('Reset to default')
      .onClick(async () => {
        this.plugin.settings.timeline.custom = DEFAULT_SETTINGS.timeline.custom;
        await this.plugin.saveSettings();
        this.plugin.reload();
        this.display();
      })
    );
    
  }

  displayCustomMarkerSettings() {
    const {containerEl} = this;

    containerEl.createEl('h2', {text: 'Custom markers'});

    if (this.plugin.settings.dayMarker.style === 'emoji') {
      containerEl.createDiv({
        attr: {
          style: `
            white-space: pre-line;
          `
        },
        text: (
          `Day marker is set to 'Emoji or symbol'.
          Currently, custom markers only work when the 'Marker' in 'Day marker settings' is set to 'Circle' or 'Line'.
          Support for this combination will be added later.`
        ),
      });
      return;
    }

    if (this.plugin.settings.customMarkers.length) {
      this.plugin.settings.customMarkers.forEach((marker, index) => {
        const {date, character} = marker;

        new Setting(containerEl)
        .setName("#" + (index + 1))
        .addText((component) => component
          .setValue(character)
          .onChange(async (value) => {
            this.plugin.settings.customMarkers[index].character = value;
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        )
        .addText((component) => {
          component.inputEl.type = 'date';

          component
          .setValue(date)
          .onChange(async (value) => {
            this.plugin.settings.customMarkers[index].date = moment(value).format('YYYY-MM-DD');
            await this.plugin.saveSettings();
            this.plugin.reload();
          })
        })
        .addExtraButton((component) => component
          .setIcon('lucide-trash-2')
          .setTooltip('Remove')
          .onClick(async () => {
            this.plugin.settings.customMarkers = (
              this.plugin.settings.customMarkers.filter((someMarker) => someMarker != marker)
            );
            await this.plugin.saveSettings();
            this.plugin.reload();
            this.display();
          })
        );
      })
    } else {
      containerEl.createEl('p', {
        text: 'No markers. Try to create one!',
      });
    }

    containerEl
    .createDiv({
      attr: {
        style: `
          display: flex;
          justify-content: flex-end;
          gap: 0.25rem;
          flex-wrap: wrap;
          padding: 0.25rem 0;
        `
      }
    })
    .createEl('input', {
      attr: {
        type: 'button',
        value: 'Create new marker!'
      }
    })
    .addEventListener('click', async (event) => {
      
      const date = moment().format('YYYY-MM-DD');
      const character = '🎉';

      this.plugin.settings.customMarkers = [
        ...this.plugin.settings.customMarkers,
        { date, character }
      ];

      await this.plugin.saveSettings();
      this.plugin.reload();
      this.display();
    })
  }

  displayDailyNotesIntegrationSettings() {
    const {containerEl} = this;

    containerEl.createEl('h2', {text: 'Daily Notes integration'});

    new Setting(containerEl)
    .setName('Daily Notes integration')
    .setDesc('Navigate between daily notes by clicking on the timeline')
    .addToggle((component) => component
      .setValue(this.plugin.settings.dailyNoteIntegration.enabled)
      .onChange(async (value) => {
        this.plugin.settings.dailyNoteIntegration.enabled = value;
        await this.plugin.saveSettings();
        this.plugin.reload();
      })
    )
  }
}

