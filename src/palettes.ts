import type { Palette } from './types';

// Generate smooth gradient palettes with specified number of colors
const generateFirePalette = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    let r, g, b;
    
    if (t < 0.25) {
      // Black to dark red
      const factor = t * 4;
      r = Math.floor(factor * 64);
      g = 0;
      b = 0;
    } else if (t < 0.5) {
      // Dark red to bright red
      const factor = (t - 0.25) * 4;
      r = Math.floor(64 + factor * 191);
      g = 0;
      b = 0;
    } else if (t < 0.75) {
      // Bright red to orange/yellow
      const factor = (t - 0.5) * 4;
      r = 255;
      g = Math.floor(factor * 255);
      b = 0;
    } else {
      // Orange to white
      const factor = (t - 0.75) * 4;
      r = 255;
      g = 255;
      b = Math.floor(factor * 255);
    }
    
    colors.push(rgbToHex(r, g, b));
  }
  return colors;
};

const generateOceanPalette = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    let r, g, b;
    
    if (t < 0.33) {
      // Deep blue to medium blue
      const factor = t * 3;
      r = Math.floor(factor * 32);
      g = Math.floor(factor * 64);
      b = Math.floor(64 + factor * 128);
    } else if (t < 0.66) {
      // Medium blue to cyan
      const factor = (t - 0.33) * 3;
      r = Math.floor(32 + factor * 32);
      g = Math.floor(64 + factor * 191);
      b = Math.floor(192 + factor * 63);
    } else {
      // Cyan to white
      const factor = (t - 0.66) * 3;
      r = Math.floor(64 + factor * 191);
      g = 255;
      b = 255;
    }
    
    colors.push(rgbToHex(r, g, b));
  }
  return colors;
};

const generateRainbowPalette = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360;
    const [r, g, b] = hslToRgb(hue, 100, 50);
    colors.push(rgbToHex(r, g, b));
  }
  return colors;
};

const generateCopperPalette = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    let r, g, b;
    
    if (t < 0.5) {
      // Black to dark orange
      const factor = t * 2;
      r = Math.floor(factor * 128);
      g = Math.floor(factor * 64);
      b = 0;
    } else {
      // Dark orange to bright yellow
      const factor = (t - 0.5) * 2;
      r = Math.floor(128 + factor * 127);
      g = Math.floor(64 + factor * 191);
      b = Math.floor(factor * 128);
    }
    
    colors.push(rgbToHex(r, g, b));
  }
  return colors;
};

const generatePlasmaPalette = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const hue = (t * 720) % 360; // Two full rotations
    const saturation = 80 + Math.sin(t * Math.PI * 4) * 20;
    const lightness = 30 + Math.sin(t * Math.PI * 6) * 30;
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    colors.push(rgbToHex(r, g, b));
  }
  return colors;
};

// HSL to RGB conversion
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= h && h < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= h && h < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h < 1) {
    r = c; g = 0; b = x;
  }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
};

export const CLASSIC_PALETTES: Palette[] = [
  {
    name: "Fire",
    colors: generateFirePalette(64)
  },
  {
    name: "Ocean",
    colors: generateOceanPalette(64)
  },
  {
    name: "Rainbow",
    colors: generateRainbowPalette(64)
  },
  {
    name: "Copper",
    colors: generateCopperPalette(64)
  },
  {
    name: "Plasma",
    colors: generatePlasmaPalette(64)
  }
];

export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  return rgbToHex(r, g, b);
};
