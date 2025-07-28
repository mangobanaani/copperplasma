import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

// Optimized TypeScript interfaces
interface ColorPalette {
  readonly name: string;
  readonly colors: readonly [number, number, number][];
}

// Type-safe effect mode union
type EffectMode = 
  | 'plasma' | 'copper' | 'both' | 'tunnel' | 'metaballs' | 'rotozoomer' 
  | 'fire' | 'ripples' | 'fractals' | 'starfield' | 'twister' | 'grid' | 'noise';

// Surface wave overlay types
type SurfaceWaveMode = 'none' | 'gentle' | 'moderate' | 'intense' | 'storm';

// Performance monitoring types
interface FPSCounter {
  frameCount: number;
  lastTime: number;
}

// Buffer management types
type BufferMode = 'double' | 'triple';

// Optimized utility functions
const clamp = (value: number, min: number, max: number): number => 
  Math.min(Math.max(value, min), max);

// Optimized palette creation with memoization
const createPalette = (name: string, generator: (t: number) => [number, number, number]): ColorPalette => ({
  name,
  colors: Array.from({ length: 64 }, (_, i) => generator(i / 63))
});

// Build palettes as RGB arrays for faster access with proper typing
const PALETTES: readonly ColorPalette[] = [
  createPalette("Fire", (t) => {
    if (t < 0.5) {
      return [255, Math.floor(t * 2 * 255), 0];
    } else {
      return [255, 255, Math.floor((t - 0.5) * 2 * 255)];
    }
  }),
  
  createPalette("Ocean", (t) => [
    Math.floor(t * 100),
    Math.floor(100 + t * 155),
    Math.floor(150 + t * 105)
  ]),
  
  createPalette("Rainbow", (t) => {
    const hue = t * 360;
    return [
      Math.floor(127.5 * (1 + Math.sin((hue + 0) * Math.PI / 180))),
      Math.floor(127.5 * (1 + Math.sin((hue + 120) * Math.PI / 180))),
      Math.floor(127.5 * (1 + Math.sin((hue + 240) * Math.PI / 180)))
    ];
  }),
  
  createPalette("Copper", (t) => [
    Math.floor(64 + t * 191),
    Math.floor(32 + t * 127),
    Math.floor(t * 64)
  ]),
  
  createPalette("Plasma", (t) => [
    Math.floor(255 * Math.pow(Math.sin(t * Math.PI), 2)),
    Math.floor(255 * Math.pow(Math.sin(t * Math.PI + Math.PI / 3), 2)),
    Math.floor(255 * Math.pow(Math.sin(t * Math.PI + 2 * Math.PI / 3), 2))
  ]),
  
  createPalette("Ocean Depths", (t) => [
    Math.floor(t * 50),
    Math.floor(50 + t * 150),
    Math.floor(100 + t * 155)
  ]),
  
  createPalette("Forest Glow", (t) => [
    Math.floor(t * 100),
    Math.floor(80 + t * 175),
    Math.floor(20 + t * 120)
  ]),
  
  createPalette("Purple Haze", (t) => [
    Math.floor(100 + t * 155),
    Math.floor(20 + t * 100),
    Math.floor(150 + t * 105)
  ]),
  
  createPalette("Neon Cyber", (t) => [
    Math.floor(255 * Math.pow(t, 2)),
    Math.floor(255 * Math.sin(t * Math.PI)),
    Math.floor(255 * Math.pow(t, 0.5))
  ]),
  
  createPalette("Arctic Ice", (t) => [
    Math.floor(200 + t * 55),
    Math.floor(240 + t * 15),
    255
  ]),
  
  createPalette("Sunset Blaze", (t) => {
    if (t < 0.33) {
      return [
        Math.floor(255 * (0.5 + 0.5 * (t / 0.33))),
        Math.floor(100 * (t / 0.33)),
        0
      ];
    } else if (t < 0.66) {
      const localT = (t - 0.33) / 0.33;
      return [
        255,
        Math.floor(100 + 155 * localT),
        Math.floor(50 * localT)
      ];
    } else {
      const localT = (t - 0.66) / 0.34;
      return [
        Math.floor(255 - 100 * localT),
        255,
        Math.floor(50 + 205 * localT)
      ];
    }
  }),
  
  createPalette("Electric Blue", (t) => [
    Math.floor(t * 100),
    Math.floor(100 + t * 100),
    Math.floor(200 + t * 55)
  ]),
  
  createPalette("Toxic Waste", (t) => [
    Math.floor(150 + 105 * Math.sin(t * Math.PI * 3)),
    Math.floor(200 + 55 * Math.sin(t * Math.PI * 2 + 1)),
    Math.floor(50 + 100 * t)
  ]),
  
  createPalette("Gold Rush", (t) => [
    Math.floor(255 * Math.min(1, 0.3 + t * 1.2)),
    Math.floor(215 * Math.min(1, 0.2 + t * 1.1)),
    Math.floor(50 * t)
  ]),
  
  createPalette("Midnight Storm", (t) => [
    Math.floor(20 + t * 80),
    Math.floor(30 + t * 120),
    Math.floor(80 + t * 175)
  ]),
  
  createPalette("Retro Synthwave", (t) => {
    if (t < 0.5) {
      return [
        Math.floor(255 * (t * 2)),
        0,
        Math.floor(255 * (1 - t * 2))
      ];
    } else {
      const localT = (t - 0.5) * 2;
      return [
        255,
        Math.floor(100 * localT),
        Math.floor(255 * (1 - localT))
      ];
    }
  }),
  
  createPalette("Emerald Dreams", (t) => [
    Math.floor(20 + t * 100),
    Math.floor(150 + t * 105),
    Math.floor(50 + t * 150)
  ]),
  
  createPalette("Binary Matrix", (t) => {
    const intensity = Math.floor(255 * Math.pow(t, 0.7));
    return [
      Math.floor(intensity * 0.1),
      intensity,
      Math.floor(intensity * 0.3)
    ];
  }),
  
  createPalette("Lava Flow", (t) => {
    if (t < 0.4) {
      return [
        Math.floor(100 + (t / 0.4) * 155),
        0,
        0
      ];
    } else if (t < 0.7) {
      const localT = (t - 0.4) / 0.3;
      return [
        255,
        Math.floor(localT * 200),
        0
      ];
    } else {
      const localT = (t - 0.7) / 0.3;
      return [
        255,
        Math.floor(200 + localT * 55),
        Math.floor(localT * 100)
      ];
    }
  })
] as const;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tripleBufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Core state with strict typing
  const [time, setTime] = useState<number>(0);
  const [paletteIndex, setPaletteIndex] = useState<number>(0);
  const [xFreq, setXFreq] = useState<number>(8);
  const [yFreq, setYFreq] = useState<number>(6);
  const [speed, setSpeed] = useState<number>(1.0);
  const [complexity, setComplexity] = useState<number>(0.5);
  const [effectMode, setEffectMode] = useState<EffectMode>('plasma');
  const [copperSpeed, setCopperSpeed] = useState<number>(1.0);
  const [copperCount, setCopperCount] = useState<number>(8);
  
  // Performance settings
  const [bufferMode, setBufferMode] = useState<BufferMode>('double');
  
  // Surface wave overlay settings
  const [surfaceWaveMode, setSurfaceWaveMode] = useState<SurfaceWaveMode>('none');
  const [waveAmplitude, setWaveAmplitude] = useState<number>(0.02);
  const [waveFrequency, setWaveFrequency] = useState<number>(8.0);
  const [waveSpeed, setWaveSpeed] = useState<number>(1.5);
  
  // Effect parameters with type safety
  const [tunnelDepth, setTunnelDepth] = useState<number>(5.0);
  const [tunnelSpeed, setTunnelSpeed] = useState<number>(1.0);
  const [metaballCount, setMetaballCount] = useState<number>(4);
  const [metaballSize, setMetaballSize] = useState<number>(0.15);
  const [rotozoomerAngle, setRotozoomerAngle] = useState<number>(0);
  const [rotozoomerZoom, setRotozoomerZoom] = useState<number>(1.0);
  const [fireIntensity, setFireIntensity] = useState<number>(0.8);
  const [rippleCount, setRippleCount] = useState<number>(3);
  const [fractalIterations, setFractalIterations] = useState<number>(32);
  const [starCount, setStarCount] = useState<number>(200);
  const [twisterStrength, setTwisterStrength] = useState<number>(0.5);
  const [gridSize, setGridSize] = useState<number>(20);
  const [noiseScale, setNoiseScale] = useState<number>(0.1);
  
  // Post-processing with typed options
  const [bloomIntensity, setBloomIntensity] = useState<number>(0.3);
  const [chromaticAberration, setChromaticAberration] = useState<number>(0.002);
  
  // Performance monitoring with typed FPS counter
  const [fps, setFps] = useState<number>(60);
  const fpsCounterRef = useRef<FPSCounter>({ frameCount: 0, lastTime: performance.now() });

  // Memoized palette access for better performance
  const currentPalette = useMemo(() => 
    PALETTES[clamp(paletteIndex, 0, PALETTES.length - 1)].colors, 
    [paletteIndex]
  );

  // Optimized render functions with memoized palette
  const renderCopper = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      for (let i = 0; i < copperCount; i++) {
        const barHeight = height / copperCount;
        const y = (i * barHeight + Math.sin(time * copperSpeed + i) * 20) % height;
        const colorIndex = clamp(Math.floor((i / copperCount) * 63), 0, 63);
        const [r, g, b] = currentPalette[colorIndex];
        
        // Create gradient for each copper bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
        gradient.addColorStop(0.5, `rgb(${r},${g},${b})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, width, barHeight + 10);
      }
    } catch (error) {
      console.error('Copper render error:', error);
    }
  }, [currentPalette, copperCount, time, copperSpeed]);

  const renderPlasma = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    try {
      // Pre-calculate complexity factors to avoid branching in inner loop
      const useComplexity1 = complexity > 0.3;
      const useComplexity2 = complexity > 0.6;
      const useComplexity3 = complexity > 0.8;
      
      // Pre-calculate normalization factor
      let maxValue = 4;
      if (useComplexity1) maxValue += 1;
      if (useComplexity2) maxValue += 0.6;
      if (useComplexity3) maxValue += 0.4;
      const normFactor = 1 / (maxValue * 2);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4;

          // Use faster division with multiplication
          const nx = x * (1 / width);
          const ny = y * (1 / height);

          // Enhanced plasma calculation with complexity
          let plasma = 0;
          
          // Basic plasma patterns
          plasma += Math.sin(nx * xFreq + time);
          plasma += Math.sin(ny * yFreq + time);
          plasma += Math.sin((nx + ny) * (xFreq + yFreq) * 0.25 + time);
          plasma += Math.sin(Math.sqrt(nx * nx + ny * ny) * (xFreq + yFreq) * 0.5 + time);

          // Additional complexity layers (pre-calculated conditions)
          if (useComplexity1) {
            plasma += Math.sin(nx * xFreq * 2 + time * 1.3) * 0.5;
            plasma += Math.sin(ny * yFreq * 2 + time * 0.7) * 0.5;
          }
          
          if (useComplexity2) {
            plasma += Math.sin((nx - ny) * xFreq * 0.3 + time * 2) * 0.3;
            plasma += Math.sin(Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.5) * (ny - 0.5)) * yFreq * 3 + time) * 0.3;
          }

          if (useComplexity3) {
            plasma += Math.sin(nx * xFreq * 0.5 + ny * yFreq * 1.5 + time * 0.8) * 0.2;
            plasma += Math.sin((nx * nx + ny * ny) * (xFreq + yFreq) + time * 1.5) * 0.2;
          }

          // Optimized normalization
          plasma = (plasma + maxValue) * normFactor;
          plasma = clamp(plasma, 0, 1);

          const colorIndex = Math.floor(plasma * 63);
          const [r, g, b] = currentPalette[colorIndex];

          data[pixelIndex] = r;
          data[pixelIndex + 1] = g;
          data[pixelIndex + 2] = b;
          data[pixelIndex + 3] = 255;
        }
      }
    } catch (error) {
      console.error('Plasma render error:', error);
    }
  }, [currentPalette, complexity, xFreq, yFreq, time]);

  // Tunnel Effect - Classic demoscene perspective tunnel
  const renderTunnel = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Tunnel depth calculation
        const depth = tunnelDepth / (distance + 0.1) + time * tunnelSpeed;
        const textureX = (angle / Math.PI + 1) * 32;
        const textureY = depth * 16;

        // Create tunnel pattern
        let tunnelValue = Math.sin(textureX) + Math.sin(textureY);
        tunnelValue = (tunnelValue + 2) * 0.25;

        const colorIndex = Math.floor(tunnelValue * 63);
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, tunnelDepth, tunnelSpeed]);

  // Metaballs - Organic flowing shapes
  const renderMetaballs = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        let metaValue = 0;
        for (let i = 0; i < metaballCount; i++) {
          const ballX = width * 0.5 + Math.sin(time * 0.5 + i * 2) * width * 0.3;
          const ballY = height * 0.5 + Math.cos(time * 0.7 + i * 1.5) * height * 0.3;
          
          const dx = x - ballX;
          const dy = y - ballY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          metaValue += metaballSize * width / (distance + 1);
        }

        metaValue = Math.min(1, metaValue * 0.01);
        const colorIndex = Math.floor(metaValue * 63);
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, metaballCount, metaballSize]);

  // Rotozoomer - Rotating and zooming texture
  const renderRotozoomer = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const angle = rotozoomerAngle + time * 0.5;
    const zoom = rotozoomerZoom + Math.sin(time) * 0.5;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        const dx = (x - centerX) / zoom;
        const dy = (y - centerY) / zoom;

        // Rotate coordinates
        const rotX = dx * Math.cos(angle) - dy * Math.sin(angle);
        const rotY = dx * Math.sin(angle) + dy * Math.cos(angle);

        // Create checkerboard pattern
        const textureX = Math.floor(rotX * 0.1) % 2;
        const textureY = Math.floor(rotY * 0.1) % 2;
        let checkerValue = (textureX + textureY) % 2;

        // Add some plasma for variety
        checkerValue += Math.sin(rotX * 0.05 + time) * 0.5;
        checkerValue = Math.abs(checkerValue);

        const colorIndex = Math.floor(checkerValue * 63) % 64;
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, rotozoomerAngle, rotozoomerZoom]);

  // Fire Effect - Particle-based fire simulation
  const renderFire = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        const nx = x / width;
        const ny = y / height;

        // Fire rises from bottom
        let fireValue = (1 - ny) * fireIntensity;
        
        // Add turbulence
        fireValue += Math.sin(nx * 20 + time * 3) * 0.1;
        fireValue += Math.sin(nx * 40 + time * 5) * 0.05;
        fireValue += Math.sin(ny * 10 + time * 2) * 0.1;
        
        // Add flickering
        fireValue *= (0.8 + 0.2 * Math.sin(time * 10 + nx * 100));
        
        fireValue = Math.max(0, Math.min(1, fireValue));
        const colorIndex = Math.floor(fireValue * 63);
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, fireIntensity]);

  // Water Ripples - Interference patterns
  const renderRipples = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        let rippleValue = 0;
        for (let i = 0; i < rippleCount; i++) {
          const sourceX = width * (0.2 + 0.6 * Math.sin(time * 0.3 + i));
          const sourceY = height * (0.2 + 0.6 * Math.cos(time * 0.4 + i * 1.5));
          
          const dx = x - sourceX;
          const dy = y - sourceY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          rippleValue += Math.sin(distance * 0.1 - time * 2) / (distance * 0.01 + 1);
        }

        rippleValue = (rippleValue + rippleCount) / (rippleCount * 2);
        const colorIndex = Math.floor(rippleValue * 63);
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, rippleCount]);

  // Fractal - Mandelbrot/Julia set
  const renderFractals = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;
    const zoom = 0.5 + Math.sin(time * 0.1) * 0.3;
    const offsetX = Math.sin(time * 0.05) * 0.5;
    const offsetY = Math.cos(time * 0.07) * 0.5;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        const cx = (x / width - 0.5) * zoom + offsetX;
        const cy = (y / height - 0.5) * zoom + offsetY;

        let zx = 0, zy = 0;
        let iterations = 0;

        while (zx * zx + zy * zy < 4 && iterations < fractalIterations) {
          const temp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = temp;
          iterations++;
        }

        const fractalValue = iterations / fractalIterations;
        const colorIndex = Math.floor(fractalValue * 63);
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, fractalIterations]);

  // Starfield - 3D flying through stars
  const renderStarfield = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    for (let i = 0; i < starCount; i++) {
      const starZ = ((time * 50 + i * 100) % 1000) / 1000;
      const starX = (Math.sin(i * 0.1) * width) / (starZ + 0.1);
      const starY = (Math.cos(i * 0.1) * height) / (starZ + 0.1);

      const screenX = centerX + starX;
      const screenY = centerY + starY;

      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        const brightness = 1 - starZ;
        const size = Math.max(1, 3 * brightness);
        
        // Use brighter palette colors for stars (map brightness to upper palette range)
        const colorIndex = Math.floor(32 + brightness * 31); // Use colors 32-63 (brighter range)
        const [r, g, b] = palette[colorIndex];
        
        // Ensure minimum brightness for visibility
        const minBrightness = 0.3;
        const finalR = Math.max(r * brightness, r * minBrightness);
        const finalG = Math.max(g * brightness, g * minBrightness);
        const finalB = Math.max(b * brightness, b * minBrightness);

        ctx.fillStyle = `rgb(${Math.floor(finalR)},${Math.floor(finalG)},${Math.floor(finalB)})`;
        ctx.fillRect(Math.floor(screenX - size/2), Math.floor(screenY - size/2), Math.ceil(size), Math.ceil(size));
        
        // Add glow effect for brighter stars
        if (brightness > 0.7) {
          ctx.fillStyle = `rgba(${Math.floor(finalR)},${Math.floor(finalG)},${Math.floor(finalB)},0.3)`;
          const glowSize = size * 2;
          ctx.fillRect(Math.floor(screenX - glowSize/2), Math.floor(screenY - glowSize/2), Math.ceil(glowSize), Math.ceil(glowSize));
        }
      }
    }
  }, [paletteIndex, time, starCount]);

  // Twister - Spiral distortion effect
  const renderTwister = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Twist effect
        const twist = twisterStrength * distance * 0.01 + time;
        const twistX = Math.cos(angle + twist) * distance + centerX;
        const twistY = Math.sin(angle + twist) * distance + centerY;

        // Sample from twisted coordinates
        const sampleValue = Math.sin(twistX * 0.1) + Math.sin(twistY * 0.1) + Math.sin(distance * 0.05 + time);
        const normalizedValue = (sampleValue + 3) / 6;

        const colorIndex = Math.floor(normalizedValue * 63);
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, twisterStrength]);

  // Grid - Animated geometric grid
  const renderGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const cellSize = gridSize;
    
    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        const cellX = x / width;
        const cellY = y / height;
        
        const gridValue = Math.sin(cellX * 10 + time) + Math.sin(cellY * 8 + time * 1.2);
        const normalizedValue = (gridValue + 2) / 4;
        
        const colorIndex = Math.floor(normalizedValue * 63);
        const [r, g, b] = palette[colorIndex];
        
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  }, [paletteIndex, time, gridSize]);

  // Noise - Perlin-like noise effect
  const renderNoise = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    const palette = PALETTES[paletteIndex].colors;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        const nx = x * noiseScale;
        const ny = y * noiseScale;

        // Multi-octave noise
        let noiseValue = 0;
        let amplitude = 1;
        let frequency = 1;

        for (let i = 0; i < 4; i++) {
          noiseValue += Math.sin(nx * frequency + time) * Math.sin(ny * frequency + time * 1.1) * amplitude;
          amplitude *= 0.5;
          frequency *= 2;
        }

        noiseValue = (noiseValue + 2) / 4;
        const colorIndex = Math.floor(noiseValue * 63);
        const [r, g, b] = palette[colorIndex];

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }, [paletteIndex, time, noiseScale]);

  // Post-processing effects
  const applyBloom = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    if (bloomIntensity <= 0) return;

    const tempData = new Uint8ClampedArray(data);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const pixelIndex = (y * width + x) * 4;
        
        let r = 0, g = 0, b = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighborIndex = ((y + dy) * width + (x + dx)) * 4;
            r += tempData[neighborIndex];
            g += tempData[neighborIndex + 1];
            b += tempData[neighborIndex + 2];
          }
        }
        
        r /= 9;
        g /= 9;
        b /= 9;
        
        data[pixelIndex] = Math.min(255, data[pixelIndex] + r * bloomIntensity);
        data[pixelIndex + 1] = Math.min(255, data[pixelIndex + 1] + g * bloomIntensity);
        data[pixelIndex + 2] = Math.min(255, data[pixelIndex + 2] + b * bloomIntensity);
      }
    }
  }, [bloomIntensity]);

  const applyChromaticAberration = useCallback((data: Uint8ClampedArray, width: number, height: number) => {
    if (chromaticAberration <= 0) return;

    const tempData = new Uint8ClampedArray(data);
    const offset = Math.floor(chromaticAberration * width);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        
        // Red channel - shift left
        const redX = Math.max(0, x - offset);
        const redIndex = (y * width + redX) * 4;
        data[pixelIndex] = tempData[redIndex];
        
        // Green channel - no shift
        data[pixelIndex + 1] = tempData[pixelIndex + 1];
        
        // Blue channel - shift right
        const blueX = Math.min(width - 1, x + offset);
        const blueIndex = (y * width + blueX) * 4;
        data[pixelIndex + 2] = tempData[blueIndex + 2];
      }
    }
  }, [chromaticAberration]);

  // Surface wave distortion effect - applies ripple overlay to any rendered content
  const applySurfaceWave = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (surfaceWaveMode === 'none') return;
    
    // Configure wave parameters based on mode
    let amplitude = waveAmplitude;
    let frequency = waveFrequency;
    let waveSpeedMult = waveSpeed;
    
    switch (surfaceWaveMode) {
      case 'gentle':
        amplitude *= 0.5;
        frequency *= 0.7;
        waveSpeedMult *= 0.8;
        break;
      case 'moderate':
        amplitude *= 1.0;
        frequency *= 1.0;
        waveSpeedMult *= 1.0;
        break;
      case 'intense':
        amplitude *= 1.8;
        frequency *= 1.4;
        waveSpeedMult *= 1.3;
        break;
      case 'storm':
        amplitude *= 2.5;
        frequency *= 2.0;
        waveSpeedMult *= 1.6;
        break;
    }

    // Get the current canvas content
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    
    // Apply wave distortion
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        
        // Calculate wave displacement
        const waveX = Math.sin((y * frequency * 0.01) + (time * waveSpeedMult)) * amplitude * width;
        const waveY = Math.sin((x * frequency * 0.008) + (time * waveSpeedMult * 0.7)) * amplitude * height;
        
        // Add circular ripples for more complex wave pattern
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
        const ripple = Math.sin((distance * frequency * 0.02) - (time * waveSpeedMult * 2)) * amplitude * 0.3;
        
        // Calculate source pixel with wave distortion
        const sourceX = clamp(Math.round(x + waveX + ripple * width), 0, width - 1);
        const sourceY = clamp(Math.round(y + waveY + ripple * height), 0, height - 1);
        const sourceIndex = (sourceY * width + sourceX) * 4;
        
        // Copy distorted pixel
        data[pixelIndex] = tempData[sourceIndex];
        data[pixelIndex + 1] = tempData[sourceIndex + 1];
        data[pixelIndex + 2] = tempData[sourceIndex + 2];
        data[pixelIndex + 3] = tempData[sourceIndex + 3];
      }
    }
    
    // Apply the distorted image back to canvas
    ctx.putImageData(imageData, 0, 0);
  }, [surfaceWaveMode, waveAmplitude, waveFrequency, waveSpeed, time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 800;

    // Create offscreen canvas for double buffering (optimized creation)
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
      offscreenCanvasRef.current.width = width;
      offscreenCanvasRef.current.height = height;
    }

    // Create third buffer for triple buffering if enabled
    if (bufferMode === 'triple' && !tripleBufferCanvasRef.current) {
      tripleBufferCanvasRef.current = document.createElement('canvas');
      tripleBufferCanvasRef.current.width = width;
      tripleBufferCanvasRef.current.height = height;
    }

    const offscreenCanvas = offscreenCanvasRef.current;
    const offscreenCtx = offscreenCanvas.getContext('2d', { 
      alpha: false,  // Disable alpha for better performance
      desynchronized: true  // Allow faster rendering
    });
    if (!offscreenCtx) return;

    // Get work buffer context for triple buffering
    const workCanvas = bufferMode === 'triple' ? tripleBufferCanvasRef.current : offscreenCanvas;
    const workCtx = bufferMode === 'triple' ? 
      workCanvas?.getContext('2d', { alpha: false, desynchronized: true }) : 
      offscreenCtx;
    if (!workCtx) return;

    // Clear work canvas
    workCtx.fillStyle = '#000000';
    workCtx.fillRect(0, 0, width, height);

    // Render based on selected effect mode (render to work buffer)
    if (effectMode === 'plasma' || effectMode === 'both') {
      const imageData = workCtx.createImageData(width, height);
      renderPlasma(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'tunnel') {
      const imageData = workCtx.createImageData(width, height);
      renderTunnel(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'metaballs') {
      const imageData = workCtx.createImageData(width, height);
      renderMetaballs(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'rotozoomer') {
      const imageData = workCtx.createImageData(width, height);
      renderRotozoomer(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'fire') {
      const imageData = workCtx.createImageData(width, height);
      renderFire(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'ripples') {
      const imageData = workCtx.createImageData(width, height);
      renderRipples(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'fractals') {
      const imageData = workCtx.createImageData(width, height);
      renderFractals(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'starfield') {
      renderStarfield(workCtx, width, height);
    }

    if (effectMode === 'twister') {
      const imageData = workCtx.createImageData(width, height);
      renderTwister(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'grid') {
      renderGrid(workCtx, width, height);
    }

    if (effectMode === 'noise') {
      const imageData = workCtx.createImageData(width, height);
      renderNoise(imageData.data, width, height);
      if (bloomIntensity > 0) applyBloom(imageData.data, width, height);
      if (chromaticAberration > 0) applyChromaticAberration(imageData.data, width, height);
      workCtx.putImageData(imageData, 0, 0);
    }

    if (effectMode === 'copper' || effectMode === 'both') {
      // Render copper bars (with blend mode for 'both')
      if (effectMode === 'both') {
        workCtx.globalCompositeOperation = 'screen';
      }
      renderCopper(workCtx, width, height);
      workCtx.globalCompositeOperation = 'source-over';
    }

    // Apply surface wave distortion as overlay effect (after all base effects)
    if (surfaceWaveMode !== 'none') {
      applySurfaceWave(workCtx, width, height);
    }

    // Triple buffer management: copy work buffer to back buffer, then back buffer to front buffer
    if (bufferMode === 'triple' && workCanvas && workCanvas !== offscreenCanvas) {
      // Copy work buffer to back buffer
      offscreenCtx.clearRect(0, 0, width, height);
      offscreenCtx.drawImage(workCanvas, 0, 0);
    }

    // Apply surface wave to final buffer if in double buffer mode
    if (bufferMode === 'double' && surfaceWaveMode !== 'none') {
      applySurfaceWave(offscreenCtx, width, height);
    }

    // Copy back buffer to visible canvas (final buffer flip)
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(offscreenCanvas, 0, 0);

  }, [time, paletteIndex, xFreq, yFreq, complexity, effectMode, copperSpeed, copperCount, bufferMode, surfaceWaveMode,
      renderCopper, renderPlasma, renderTunnel, renderMetaballs, renderRotozoomer, 
      renderFire, renderRipples, renderFractals, renderStarfield, renderTwister, 
      renderGrid, renderNoise, applyBloom, applyChromaticAberration, bloomIntensity, chromaticAberration, applySurfaceWave]);

  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number): void => {
      try {
        const deltaTime = currentTime - lastTime;
        
        // FPS calculation with type safety
        const fpsCounter = fpsCounterRef.current;
        fpsCounter.frameCount++;
        
        const timeSinceLastFpsUpdate = currentTime - fpsCounter.lastTime;
        if (timeSinceLastFpsUpdate >= 1000) { // Update every second
          const currentFps = clamp(
            Math.round(fpsCounter.frameCount / (timeSinceLastFpsUpdate / 1000)),
            0,
            120 // Cap at reasonable maximum
          );
          setFps(currentFps);
          fpsCounter.frameCount = 0;
          fpsCounter.lastTime = currentTime;
        }
        
        // Target 60fps with smooth timing
        if (deltaTime >= 16.67) { // ~60fps
          setTime(t => t + (0.1 * clamp(speed, 0.1, 3.0) * (deltaTime / 50)));
          lastTime = currentTime;
        }
        
        animationFrame = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation loop error:', error);
        // Attempt to restart animation loop after error
        setTimeout(() => {
          animationFrame = requestAnimationFrame(animate);
        }, 100);
      }
    };
    
    try {
      animationFrame = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Failed to start animation:', error);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [speed, setFps]);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)', 
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'monospace',
      padding: '20px',
      gap: '20px',
      overflow: 'auto'
    }}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        padding: '20px'
      }}>
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          style={{ 
            border: '2px solid rgba(100, 200, 255, 0.3)',
            borderRadius: '12px',
            imageRendering: 'pixelated',
            boxShadow: '0 0 40px rgba(100, 200, 255, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
            width: '1200px',
            height: '800px',
            display: 'block'
          }}
        />
      </div>
      
      <div style={{ 
        width: '380px',
        flexShrink: 0,
        padding: '24px', 
        background: 'rgba(15, 25, 35, 0.92)',
        backdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(100, 200, 255, 0.15)',
        borderRadius: '12px',
        color: '#e8f4f8',
        fontSize: '13px',
        fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          color: '#b3e5fc', 
          marginTop: 0, 
          fontSize: '18px',
          fontWeight: '300',
          letterSpacing: '0.5px',
          textShadow: '0 0 20px rgba(179, 229, 252, 0.3)',
          marginBottom: '8px'
        }}>COPPER + PLASMA STUDIO</h3>
        
        <div style={{
          fontSize: '10px',
          color: 'rgba(179, 229, 252, 0.6)',
          marginBottom: '16px',
          textAlign: 'center',
          fontFamily: 'monospace',
          letterSpacing: '0.5px'
        }}>
          (c) mangobanaani 2025
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '8px 12px',
          background: 'rgba(0, 255, 100, 0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(0, 255, 100, 0.2)'
        }}>
          <span style={{ 
            color: '#00ff64', 
            fontSize: '12px',
            fontWeight: '500',
            fontFamily: 'monospace'
          }}>FPS: {fps}</span>
          <span style={{ 
            color: '#64ffda', 
            fontSize: '10px',
            fontFamily: 'monospace'
          }}>REALTIME</span>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            color: '#90caf9',
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '0.3px'
          }}>Effect Mode</label>
          <select 
            value={effectMode} 
            onChange={(e) => setEffectMode(e.target.value as 'plasma' | 'copper' | 'both')}
            style={{ 
              width: '100%', 
              background: 'rgba(30, 50, 70, 0.8)', 
              color: '#e8f4f8', 
              border: '1px solid rgba(100, 200, 255, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '13px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <option value="plasma">Plasma Field</option>
            <option value="copper">Copper Bars</option>
            <option value="both">Combined Effect</option>
            <option value="tunnel">Tunnel</option>
            <option value="metaballs">Metaballs</option>
            <option value="rotozoomer">Rotozoomer</option>
            <option value="fire">Fire</option>
            <option value="ripples">Water Ripples</option>
            <option value="fractals">Fractals</option>
            <option value="starfield">Starfield</option>
            <option value="twister">Twister</option>
            <option value="grid">Grid</option>
            <option value="noise">Noise</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            color: '#90caf9',
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '0.3px'
          }}>Color Palette</label>
          <select 
            value={paletteIndex} 
            onChange={(e) => setPaletteIndex(Number(e.target.value))}
            style={{ 
              width: '100%', 
              background: 'rgba(30, 50, 70, 0.8)', 
              color: '#e8f4f8', 
              border: '1px solid rgba(100, 200, 255, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '13px',
              backdropFilter: 'blur(4px)'
            }}
          >
            {PALETTES.map((palette, idx) => (
              <option key={idx} value={idx}>{palette.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            color: '#90caf9',
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '0.3px'
          }}>Buffer Mode</label>
          <select 
            value={bufferMode} 
            onChange={(e) => setBufferMode(e.target.value as BufferMode)}
            style={{ 
              width: '100%', 
              background: 'rgba(30, 50, 70, 0.8)', 
              color: '#e8f4f8', 
              border: '1px solid rgba(100, 200, 255, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '13px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <option value="double">Double Buffer (Standard)</option>
            <option value="triple">Triple Buffer (Reduced Latency)</option>
          </select>
          <div style={{ 
            fontSize: '10px', 
            color: 'rgba(144, 202, 249, 0.7)', 
            marginTop: '4px',
            lineHeight: '1.3'
          }}>
            Triple buffering may improve smoothness on high refresh rate displays
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            color: '#90caf9',
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '0.3px'
          }}>Surface Wave Overlay</label>
          <select 
            value={surfaceWaveMode} 
            onChange={(e) => setSurfaceWaveMode(e.target.value as SurfaceWaveMode)}
            style={{ 
              width: '100%', 
              background: 'rgba(30, 50, 70, 0.8)', 
              color: '#e8f4f8', 
              border: '1px solid rgba(100, 200, 255, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '13px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <option value="none">None (Default)</option>
            <option value="gentle">Gentle Ripples</option>
            <option value="moderate">Moderate Waves</option>
            <option value="intense">Intense Distortion</option>
            <option value="storm">Storm Effect</option>
          </select>
          <div style={{ 
            fontSize: '10px', 
            color: 'rgba(144, 202, 249, 0.7)', 
            marginTop: '4px',
            lineHeight: '1.3'
          }}>
            Applies water-like distortion overlay on top of any effect
          </div>
        </div>

        {surfaceWaveMode !== 'none' && (
          <div style={{ 
            background: 'rgba(0, 150, 200, 0.08)', 
            borderLeft: '3px solid rgba(0, 200, 255, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              color: '#81d4fa',
              fontSize: '14px',
              fontWeight: '600'
            }}>Wave Parameters</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '11px',
                color: '#b3e5fc'
              }}>
                Amplitude: {waveAmplitude.toFixed(3)}
              </label>
              <input 
                type="range" 
                min="0.005" 
                max="0.1" 
                step="0.005" 
                value={waveAmplitude} 
                onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '11px',
                color: '#b3e5fc'
              }}>
                Frequency: {waveFrequency.toFixed(1)}
              </label>
              <input 
                type="range" 
                min="2.0" 
                max="20.0" 
                step="0.5" 
                value={waveFrequency} 
                onChange={(e) => setWaveFrequency(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '0' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '11px',
                color: '#b3e5fc'
              }}>
                Wave Speed: {waveSpeed.toFixed(1)}x
              </label>
              <input 
                type="range" 
                min="0.2" 
                max="3.0" 
                step="0.1" 
                value={waveSpeed} 
                onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {(effectMode === 'plasma' || effectMode === 'both') && (
          <div style={{ 
            background: 'rgba(0, 100, 150, 0.08)', 
            borderLeft: '3px solid rgba(100, 200, 255, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              color: '#64b5f6', 
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.4px'
            }}>PLASMA CONTROLS</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#90caf9',
                fontSize: '11px'
              }}>X Frequency: {xFreq.toFixed(1)}</label>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5" 
                value={xFreq}
                onChange={(e) => setXFreq(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#64b5f6' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#90caf9',
                fontSize: '11px'
              }}>Y Frequency: {yFreq.toFixed(1)}</label>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5" 
                value={yFreq}
                onChange={(e) => setYFreq(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#64b5f6' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#90caf9',
                fontSize: '11px'
              }}>Complexity: {complexity.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={complexity}
                onChange={(e) => setComplexity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#64b5f6' }}
              />
            </div>
          </div>
        )}

        {(effectMode === 'copper' || effectMode === 'both') && (
          <div style={{ 
            background: 'rgba(150, 100, 0, 0.08)', 
            borderLeft: '3px solid rgba(255, 193, 7, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              color: '#ffcc02', 
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.4px'
            }}>COPPER CONTROLS</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#fff3a0',
                fontSize: '11px'
              }}>Copper Speed: {copperSpeed.toFixed(1)}x</label>
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1" 
                value={copperSpeed}
                onChange={(e) => setCopperSpeed(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ffcc02' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#fff3a0',
                fontSize: '11px'
              }}>Copper Bars: {copperCount}</label>
              <input 
                type="range" 
                min="3" 
                max="20" 
                step="1" 
                value={copperCount}
                onChange={(e) => setCopperCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ffcc02' }}
              />
            </div>
          </div>
        )}

        {effectMode === 'tunnel' && (
          <div style={{ 
            background: 'rgba(100, 0, 150, 0.08)', 
            borderLeft: '3px solid rgba(186, 104, 200, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              color: '#ba68c8', 
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.4px'
            }}>TUNNEL CONTROLS</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#ce93d8',
                fontSize: '11px'
              }}>Tunnel Depth: {tunnelDepth.toFixed(1)}</label>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5" 
                value={tunnelDepth}
                onChange={(e) => setTunnelDepth(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ba68c8' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#ce93d8',
                fontSize: '11px'
              }}>Tunnel Speed: {tunnelSpeed.toFixed(1)}x</label>
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1" 
                value={tunnelSpeed}
                onChange={(e) => setTunnelSpeed(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ba68c8' }}
              />
            </div>
          </div>
        )}

        {effectMode === 'metaballs' && (
          <div style={{ 
            background: 'rgba(0, 150, 100, 0.08)', 
            borderLeft: '3px solid rgba(76, 175, 80, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              color: '#4caf50', 
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.4px'
            }}>METABALL CONTROLS</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#81c784',
                fontSize: '11px'
              }}>Ball Count: {metaballCount}</label>
              <input 
                type="range" 
                min="2" 
                max="8" 
                step="1" 
                value={metaballCount}
                onChange={(e) => setMetaballCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4caf50' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#81c784',
                fontSize: '11px'
              }}>Ball Size: {metaballSize.toFixed(2)}</label>
              <input 
                type="range" 
                min="0.05" 
                max="0.5" 
                step="0.01" 
                value={metaballSize}
                onChange={(e) => setMetaballSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4caf50' }}
              />
            </div>
          </div>
        )}

        {effectMode === 'rotozoomer' && (
          <div style={{ 
            background: 'rgba(150, 50, 0, 0.08)', 
            borderLeft: '3px solid rgba(255, 87, 34, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              color: '#ff5722', 
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.4px'
            }}>ROTOZOOMER CONTROLS</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#ff8a65',
                fontSize: '11px'
              }}>Rotation: {rotozoomerAngle.toFixed(1)}°</label>
              <input 
                type="range" 
                min="0" 
                max="360" 
                step="1" 
                value={rotozoomerAngle}
                onChange={(e) => setRotozoomerAngle(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ff5722' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                color: '#ff8a65',
                fontSize: '11px'
              }}>Zoom: {rotozoomerZoom.toFixed(1)}x</label>
              <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.1" 
                value={rotozoomerZoom}
                onChange={(e) => setRotozoomerZoom(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ff5722' }}
              />
            </div>
          </div>
        )}

        {(effectMode === 'fire' || effectMode === 'ripples' || effectMode === 'fractals' || effectMode === 'twister' || effectMode === 'noise') && (
          <div style={{ 
            background: 'rgba(100, 50, 150, 0.08)', 
            borderLeft: '3px solid rgba(156, 39, 176, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              color: '#9c27b0', 
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.4px'
            }}>EFFECT CONTROLS</h4>
            
            {effectMode === 'fire' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  color: '#ce93d8',
                  fontSize: '11px'
                }}>Fire Intensity: {fireIntensity.toFixed(1)}</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2" 
                  step="0.1" 
                  value={fireIntensity}
                  onChange={(e) => setFireIntensity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#9c27b0' }}
                />
              </div>
            )}

            {effectMode === 'ripples' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  color: '#ce93d8',
                  fontSize: '11px'
                }}>Ripple Sources: {rippleCount}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  step="1" 
                  value={rippleCount}
                  onChange={(e) => setRippleCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#9c27b0' }}
                />
              </div>
            )}

            {effectMode === 'fractals' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  color: '#ce93d8',
                  fontSize: '11px'
                }}>Iterations: {fractalIterations}</label>
                <input 
                  type="range" 
                  min="16" 
                  max="128" 
                  step="8" 
                  value={fractalIterations}
                  onChange={(e) => setFractalIterations(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#9c27b0' }}
                />
              </div>
            )}

            {effectMode === 'twister' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  color: '#ce93d8',
                  fontSize: '11px'
                }}>Twist Strength: {twisterStrength.toFixed(1)}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="0.1" 
                  value={twisterStrength}
                  onChange={(e) => setTwisterStrength(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#9c27b0' }}
                />
              </div>
            )}

            {effectMode === 'noise' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  color: '#ce93d8',
                  fontSize: '11px'
                }}>Noise Scale: {noiseScale.toFixed(3)}</label>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.5" 
                  step="0.01" 
                  value={noiseScale}
                  onChange={(e) => setNoiseScale(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#9c27b0' }}
                />
              </div>
            )}
          </div>
        )}

        {(effectMode === 'starfield' || effectMode === 'grid') && (
          <div style={{ 
            background: 'rgba(50, 100, 150, 0.08)', 
            borderLeft: '3px solid rgba(33, 150, 243, 0.4)', 
            borderRadius: '4px',
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(4px)'
          }}>
            <h4 style={{ 
              color: '#2196f3', 
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.4px'
            }}>SPATIAL CONTROLS</h4>
            
            {effectMode === 'starfield' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  color: '#64b5f6',
                  fontSize: '11px'
                }}>Star Count: {starCount}</label>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="10" 
                  value={starCount}
                  onChange={(e) => setStarCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2196f3' }}
                />
              </div>
            )}

            {effectMode === 'grid' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  color: '#64b5f6',
                  fontSize: '11px'
                }}>Grid Size: {gridSize}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="1" 
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2196f3' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Post-processing Effects */}
        <div style={{ 
          background: 'rgba(150, 150, 0, 0.08)', 
          borderLeft: '3px solid rgba(255, 235, 59, 0.4)', 
          borderRadius: '4px',
          padding: '16px', 
          marginBottom: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <h4 style={{ 
            color: '#ffeb3b', 
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '0.4px'
          }}>POST-PROCESSING</h4>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              color: '#fff176',
              fontSize: '11px'
            }}>Bloom Intensity: {bloomIntensity.toFixed(2)}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={bloomIntensity}
              onChange={(e) => setBloomIntensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ffeb3b' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              color: '#fff176',
              fontSize: '11px'
            }}>Chromatic Aberration: {chromaticAberration.toFixed(3)}</label>
            <input 
              type="range" 
              min="0" 
              max="0.01" 
              step="0.001" 
              value={chromaticAberration}
              onChange={(e) => setChromaticAberration(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ffeb3b' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            color: '#90caf9',
            fontSize: '11px'
          }}>Animation Speed: {speed.toFixed(1)}x</label>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1" 
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#64b5f6' }}
          />
        </div>

        <div style={{ 
          marginTop: '24px', 
          fontSize: '11px', 
          color: 'rgba(179, 229, 252, 0.7)',
          background: 'rgba(179, 229, 252, 0.03)',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid rgba(179, 229, 252, 0.1)'
        }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#64b5f6' }}>Mode:</span> {
              effectMode === 'plasma' ? 'Plasma Field' :
              effectMode === 'copper' ? 'Copper Bars' :
              effectMode === 'both' ? 'Combined Effect' :
              effectMode === 'tunnel' ? 'Tunnel' :
              effectMode === 'metaballs' ? 'Metaballs' :
              effectMode === 'rotozoomer' ? 'Rotozoomer' :
              effectMode === 'fire' ? 'Fire' :
              effectMode === 'ripples' ? 'Water Ripples' :
              effectMode === 'fractals' ? 'Fractals' :
              effectMode === 'starfield' ? 'Starfield' :
              effectMode === 'twister' ? 'Twister' :
              effectMode === 'grid' ? 'Grid' :
              effectMode === 'noise' ? 'Noise' : effectMode
            }
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#64b5f6' }}>Palette:</span> {PALETTES[paletteIndex].name}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#64b5f6' }}>Time:</span> {time.toFixed(1)}s
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#64b5f6' }}>FPS:</span> {fps} / 60 target
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#64b5f6' }}>Rendering:</span> {bufferMode === 'triple' ? 'Triple-buffered' : 'Double-buffered'} {fps > 50 ? '✓' : '⚠'}
          </div>
          <div style={{ 
            marginTop: '8px', 
            paddingTop: '8px', 
            borderTop: '1px solid rgba(179, 229, 252, 0.1)',
            fontSize: '9px',
            color: 'rgba(179, 229, 252, 0.5)',
            textAlign: 'center'
          }}>
            Classic Demoscene Effects Studio<br/>
            Built with React + TypeScript + Canvas API
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
