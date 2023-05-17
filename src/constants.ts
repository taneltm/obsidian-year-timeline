import Settings from "./models/settings";

export const DEFAULT_SETTINGS: Settings = {
  dayMarker: {
    style: 'line',

    line: {
      color: '#CC0000',
      width: 2,
    },

    circle: {
      color: '#EE9900',
      border: '#000000',
      borderWidth: 2,
      radius: 20,
    },

    emoji: {
      character: '🔻',
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    }
  },

  customMarkers: [],

  timeline: {
    style: "solid",
    solid: {
      january: {
        name: 'January',
        color: '#A7BFD4',
      },
      february: {
        name: 'February',
        color: '#B3D1E6',
      },
      march: {
        name: 'March',
        color: '#A5D5CD',
      },
      april: {
        name: 'April',
        color: '#C4E1B9',
      },
      may: {
        name: 'May',
        color: '#B8DCB6',
      },
      june: {
        name: 'June',
        color: '#DBE5B6',
      },
      july: {
        name: 'July',
        color: '#FFE080',
      },
      august: {
        name: 'August',
        color: '#F6DAA1',
      },
      september: {
        name: 'September',
        color: '#F5CDA7',
      },
      october: {
        name: 'October',
        color: '#F5B57C',
      },
      november: {
        name: 'November',
        color: '#CBAE99',
      },
      december: {
        name: 'December',
        color: '#C7D8E6',
      },
    },

    gradient: {
      angle: 0,
      colors: [],
    },

    custom: `<svg
  xmlns='http://www.w3.org/2000/svg'
  viewBox='0 -100 3760 200'>
  <title>Timeline 2022</title>
  <defs>
    <style>
      .labels text {
        font-size: 50px;
      }
    </style>
  </defs>
  <g class='bars'>
    <rect fill='#A7BFD4' x='0' width='310' height='25'></rect>
    <rect fill='#B3D1E6' x='320' width='280' height='25'></rect>
    <rect fill='#A5D5CD' x='610' width='310' height='25'></rect>
    <rect fill='#C4E1B9' x='930' width='300' height='25'></rect>
    <rect fill='#B8DCB6' x='1240' width='310' height='25'></rect>
    <rect fill='#DBE5B6' x='1560' width='300' height='25'></rect>
    <rect fill='#FFE080' x='1870' width='310' height='25'></rect>
    <rect fill='#F6DAA1' x='2190' width='310' height='25'></rect>
    <rect fill='#F5CDA7' x='2510' width='300' height='25'></rect>
    <rect fill='#F5B57C' x='2820' width='310' height='25'></rect>
    <rect fill='#CBAE99' x='3140' width='300' height='25'></rect>
    <rect fill='#C7D8E6' x='3450' width='310' height='25'></rect>
  </g>
  <g class='labels' style='font-size:50px;' text-anchor='start'>
    <text fill='#CCE0E2' x='0' y='80'>January</text>
    <text fill='#CCE0E2' x='320' y='80'>February</text>
    <text fill='#CCE0E2' x='610' y='80'>March</text>
    <text fill='#CCE0E2' x='930' y='80'>April</text>
    <text fill='#CCE0E2' x='1240' y='80'>May</text>
    <text fill='#CCE0E2' x='1560' y='80'>June</text>
    <text fill='#CCE0E2' x='1870' y='80'>July</text>
    <text fill='#CCE0E2' x='2190' y='80'>August</text>
    <text fill='#CCE0E2' x='2510' y='80'>September</text>
    <text fill='#CCE0E2' x='2820' y='80'>October</text>
    <text fill='#CCE0E2' x='3140' y='80'>November</text>
    <text fill='#CCE0E2' x='3450' y='80'>December</text>
  </g>
</svg>`,
  }
}

export const snippets = [
  {
    buttonLabel: 'For Daily Notes template',
    code: '<i data-timeline-year="{{date:YYYY}}" data-timeline-day="{{date:DDD}}"></i>',
  },
  {
    buttonLabel: 'For Templater template',
    code: '<i data-timeline-year="<% tp.date.now("YYYY", 0, tp.file.title) %>" data-timeline-day="<% tp.date.now("DDD", 0, tp.file.title) %>"></i>',
  },
  {
    buttonLabel: 'For DataView (JavaScript)',
    code: '```dataviewjs\ndv.el("div", "", { attr: {\n  "data-timeline-year": moment().format("YYYY"),\n  "data-timeline-day": moment().format("DDD"),\n}})\n```',
  },
]
