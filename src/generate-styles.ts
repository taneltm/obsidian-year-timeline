import moment from "moment";
import Settings from "./models/settings";

export function generateStyles(settings: Settings) {
  const style = document.createElement('style');

  style.id = 'timeline-plugin-style';
  
  style.textContent = `
    ${generateBaseStyle(settings)}
  `;

  return style;
}

function generateBaseStyle(settings: Settings) {
  const range = Array.from({ length: Number(moment('2023-12-31').format('DDD') + 1) }, (_, i) => i);

  return `
    [data-timeline] {
      position: relative;
      display: inline-block;
      width: 100%;
      aspect-ratio: 18/1;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,${ generateMainSvg(settings) }");
    }

    [data-timeline]::after {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      background-repeat: no-repeat;
    }

    ${ range.map((dayIndex) => `
      [data-timeline="${dayIndex}"]::after {
        background-image: url("data:image/svg+xml,${ generateMarkers(dayIndex, settings) }");
      }
    `).join('') }
  `;
}

function generateMainSvg(settings: Settings) {
  switch (settings.timeline.style) {
    case 'solid': {
      return generateTimelineSolidSvg(settings);
    }
    case 'gradient': {
      return generateTimelineGradientSvg(settings);
    }
    case 'custom': {
      return generateTimelineCustomSvg(settings);
    }
  }
}

function generateTimelineSolidSvg(settings: Settings) {
  const computedBodyStyle = getComputedStyle(document.body);
  const textNormal = computedBodyStyle.getPropertyValue("--text-normal");

  return encodeURIComponent(`
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 -100 3760 200'>
      <title>Timeline 2022</title>
      <defs>
        <style>
          .labels text {
            fill: ${textNormal};
            font-size: 50px;
          }
        </style>
      </defs>
      <g class='bars'>
        <rect fill='${ settings.timeline.solid.january.color }' x='0' width='310' height='25'></rect>
        <rect fill='${ settings.timeline.solid.february.color }' x='320' width='280' height='25'></rect>
        <rect fill='${ settings.timeline.solid.march.color }' x='610' width='310' height='25'></rect>
        <rect fill='${ settings.timeline.solid.april.color }' x='930' width='300' height='25'></rect>
        <rect fill='${ settings.timeline.solid.may.color }' x='1240' width='310' height='25'></rect>
        <rect fill='${ settings.timeline.solid.june.color }' x='1560' width='300' height='25'></rect>
        <rect fill='${ settings.timeline.solid.july.color }' x='1870' width='310' height='25'></rect>
        <rect fill='${ settings.timeline.solid.august.color }' x='2190' width='310' height='25'></rect>
        <rect fill='${ settings.timeline.solid.september.color }' x='2510' width='300' height='25'></rect>
        <rect fill='${ settings.timeline.solid.october.color }' x='2820' width='310' height='25'></rect>
        <rect fill='${ settings.timeline.solid.november.color }' x='3140' width='300' height='25'></rect>
        <rect fill='${ settings.timeline.solid.december.color }' x='3450' width='310' height='25'></rect>
      </g>
      <g class='labels' style='font-size:50px;' text-anchor='start'>
        <text fill='#CCE0E2' x='0' y='80'>${ settings.timeline.solid.january.name }</text>
        <text fill='#CCE0E2' x='320' y='80'>${ settings.timeline.solid.february.name }</text>
        <text fill='#CCE0E2' x='610' y='80'>${ settings.timeline.solid.march.name }</text>
        <text fill='#CCE0E2' x='930' y='80'>${ settings.timeline.solid.april.name }</text>
        <text fill='#CCE0E2' x='1240' y='80'>${ settings.timeline.solid.may.name }</text>
        <text fill='#CCE0E2' x='1560' y='80'>${ settings.timeline.solid.june.name }</text>
        <text fill='#CCE0E2' x='1870' y='80'>${ settings.timeline.solid.july.name }</text>
        <text fill='#CCE0E2' x='2190' y='80'>${ settings.timeline.solid.august.name }</text>
        <text fill='#CCE0E2' x='2510' y='80'>${ settings.timeline.solid.september.name }</text>
        <text fill='#CCE0E2' x='2820' y='80'>${ settings.timeline.solid.october.name }</text>
        <text fill='#CCE0E2' x='3140' y='80'>${ settings.timeline.solid.november.name }</text>
        <text fill='#CCE0E2' x='3450' y='80'>${ settings.timeline.solid.december.name }</text>
      </g>
    </svg>
  `);
}

function generateTimelineGradientSvg(settings: Settings) {
  return encodeURIComponent(`
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 -100 3760 200'>
      <title>Timeline 2022</title>
      <defs>
        <linearGradient id="year-timeline-gradient">
          ${ settings.timeline.gradient.colors.map(({ offset, color }) => `
            <stop offset="${offset}%" stop-color="${color}" />
          `)}
        </linearGradient>
      </defs>
      <g class='bars'>
        <rect fill='url(#year-timeline-gradient' x='0' width='100%' height='25'></rect>
      </g>
    </svg>
  `);
}
function generateTimelineCustomSvg(settings: Settings) {
  return encodeURIComponent(settings.timeline.custom);
}

function generateMarkers(dayIndex: number, settings: Settings) {
  switch (settings.dayMarker.style) {
    case 'line': {
      return encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -100 3760 200'>
          ${ generateCustomMarkers(settings) }
          <g transform='translate(${dayIndex * 10.30},0)'>
            <line
              stroke="${settings.dayMarker.line.color}"
              x1="0" y1="0" x2="0" y2="25"
              stroke-width="${settings.dayMarker.line.width * 10}"
            >${ settings.dayMarker.emoji.character }</line>
          </g>
        </svg>
      `);
    }
    
    case 'circle': {
      return encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -100 3760 200'>
          ${ generateCustomMarkers(settings) }
          <g transform='translate(${dayIndex * 10.30},12)'>
            <circle
              fill="${settings.dayMarker.circle.color}"
              stroke="${settings.dayMarker.circle.border}"
              stroke-width="${settings.dayMarker.circle.borderWidth}"
              cx="0" cy="0" r="${settings.dayMarker.circle.radius}"
            >${ settings.dayMarker.emoji.character }</circle>
          </g>
        </svg>
      `);
    }

    case 'emoji': {
      return encodeURIComponent(`
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='${settings.dayMarker.emoji.offsetX * -1 + 75} ${settings.dayMarker.emoji.offsetY * -1 - 100} 3760 200'
        >
          <g transform='translate(${dayIndex * 10.30},0)'>
            <text fill="red" style="font-size: 100px" transform="scale(${settings.dayMarker.emoji.scale})" transform-origin="50 50">${
              settings.dayMarker.emoji.character
            }</text>
          </g>
        </svg>
      `);
    }
  }

  function generateCustomMarkers(settings: Settings) {
    return `
      <g style="font-size:100px;" text-anchor="middle">
        ${ settings.customMarkers.map(({date, character}) => `
          <text fill="white" x="${ Number(moment(date).format('DDD')) * 10.30}" y="-5">${character}</text>
        `) }
      </g>
    `
  }
}
