export type Month
  = 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december';

export interface MonthSettings {
  name: string;
  color: string;
}

export default interface Settings {
  dayMarker: {
    style: 'line' | 'circle' | 'emoji';

    line: {
      color: string;
      width: number;
    };

    circle: {
      color: string;
      border: string;
      borderWidth: number;
      radius: number;
    };

    emoji: {
      character: string;
      offsetX: number;
      offsetY: number;
      scale: number;
    }
  };

  timeline: {
    style: 'solid' | 'gradient' | 'custom';

    solid: {
      [key in Month]: MonthSettings;
    };

    gradient: {
      angle: number;
      colors: Array<{
        offset: number;
        color: string;
      }>;
    };

    custom: string;
  };

  customMarkers: Array<{
    character: string;
    date: string;
  }>;

  dailyNoteIntegration: {
    format: string;
    directory: string;
  }
}


