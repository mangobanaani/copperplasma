export interface Palette {
  name: string;
  colors: string[];
}

export interface CopperBarConfig {
  y: number;
  height: number;
  colorIndex: number;
  speed: number;
}

export interface PlasmaConfig {
  time: number;
  xOffset: number;
  yOffset: number;
  xFreq: number;
  yFreq: number;
  complexity: number;
  paletteIndex: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'add' | 'xor';
  speed: number;
  phase: number;
}

export interface EffectControls {
  copperBars: CopperBarConfig[];
  plasmaLayers: PlasmaConfig[];
  selectedPalette: number;
  animationSpeed: number;
}
