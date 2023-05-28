import moment from 'moment';
import { App, TFile, TFolder, Vault, normalizePath } from 'obsidian';
import YearTimelinePlugin from './year-timeline-plugin';

let dailyNotesSettings: {folder: string, format: string} = {
  folder: '',
  format: 'YYYY-MM-DD',
}

let isHovering = false;
let timelineTooltipEl: HTMLElement | undefined;

export function registerEventListeners(app: App, plugin: YearTimelinePlugin) {
  let mouseMoveTimer: NodeJS.Timeout;

  plugin.registerDomEvent(document, 'mousemove', (e) => {
    if (!plugin.settings.dailyNoteIntegration.enabled) return;
    
    if (isHovering) endHover();
    mouseMoveTimer && clearTimeout(mouseMoveTimer);
    mouseMoveTimer = setTimeout(() => startHover(e), 100);
  });

  plugin.registerDomEvent(document, 'click', (e) => {
    if (!plugin.settings.dailyNoteIntegration.enabled) return;

    if ((e.target as HTMLElement)?.matches('[data-timeline]')) {
      e.preventDefault();

      const activeDate = moment(
        app.workspace.getActiveFile()?.name.replace(/.md$/, ''),
        dailyNotesSettings.format
      );

      const newDate = (
        moment(activeDate, 'DDD')
        .dayOfYear(getMouseDayOfYear(e))
        .format(dailyNotesSettings.format)
      );

      const dailyNotesFolder = app.vault.getAbstractFileByPath(
        normalizePath(dailyNotesSettings.folder)
      ) as TFolder;

      let dailyNote: TFile | null = null;

      Vault.recurseChildren(dailyNotesFolder, (note) => {
        if (note instanceof TFile) {
          if (note.path.includes(dailyNotesSettings.folder) && note.name.includes(newDate)) {

            console.log('Settings folder:', dailyNotesSettings.folder)
            console.log('Note:', note)
            
            return dailyNote = note;
          }
        }
      });
      
      if (dailyNote) {
        app.workspace.getLeaf().openFile(dailyNote);
      } else {
        hideTooltip();
        isHovering = true;
        showTooltip('No note for date ' + newDate, e);
      }
    }
  })
}

export async function setup(app: App, plugin: YearTimelinePlugin) {
  if (!plugin.settings.dailyNoteIntegration.enabled) return;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { folder, format } = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.app as any).internalPlugins?.getPluginById('daily-notes')?.instance?.options || {}
  );

  dailyNotesSettings = {
    folder: folder ?? '',
    format: format ?? 'YYYY-MM-DD',
  } as typeof dailyNotesSettings;

  console.log({ dailyNotesSettings })
}

function startHover(e: MouseEvent) {
  if (!isHovering && (e.target as HTMLElement)?.matches('[data-timeline]')) {
    hideTooltip();
    isHovering = true;
    const dayOfYear = moment(getMouseDayOfYear(e), "DDD");

    if (dayOfYear.isValid()) {
      showTooltip(dayOfYear.format('YYYY-MM-DD'), e);
    }

  }
}

function endHover() {
  isHovering = false;
  hideTooltip();
}

function showTooltip(message: string, e: MouseEvent) {
  timelineTooltipEl = document.createElement('div');
  timelineTooltipEl.textContent = message;
  timelineTooltipEl.style.position = 'fixed';
  timelineTooltipEl.style.left = e.clientX + 'px';
  timelineTooltipEl.style.top = e.clientY + 'px';
  timelineTooltipEl.style.color = '#000';
  timelineTooltipEl.style.background = '#F0F0F0';
  timelineTooltipEl.style.padding = '8px';
  timelineTooltipEl.style.borderRadius = '4px';
  timelineTooltipEl.style.fontSize = '10px';
  timelineTooltipEl.style.fontWeight = '600';
  timelineTooltipEl.style.zIndex = '100';
  document.body.appendChild(timelineTooltipEl);
}

function hideTooltip() {
  timelineTooltipEl?.remove();
}

function getMouseDayOfYear(e: MouseEvent) {
  const rect = (e.target as HTMLElement)?.getBoundingClientRect();
  const yearWidth = rect.width;
  const x = e.clientX - rect.left;

  const daysInYear = 365;

  return Math.floor((x / yearWidth) * daysInYear) + 1;
}
