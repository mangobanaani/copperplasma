import React, { useRef, useEffect } from 'react';
import type { PlasmaConfig, Palette } from '../types';

interface MultiPlasmaFieldProps {
  width: number;
  height: number;
  plasmaLayers: PlasmaConfig[];
  palettes: Palette[];
}

export const MultiPlasmaField: React.FC<MultiPlasmaFieldProps> = ({
  width,
  height,
  plasmaLayers,
  palettes
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If no layers, just show black
    if (plasmaLayers.length === 0) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Start with the first layer using the original working logic
    const firstLayer = plasmaLayers[0];
    const palette = palettes[firstLayer.paletteIndex] || palettes[0];
    
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const { time, xOffset, yOffset, xFreq, yFreq, complexity, speed, phase } = firstLayer;
    const animatedTime = time * speed + phase;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        // Normalize coordinates
        const nx = (x + xOffset) / width;
        const ny = (y + yOffset) / height;

        // Calculate plasma value using multiple sine waves (original working logic)
        let plasmaValue = 0;
        
        // Primary plasma patterns
        plasmaValue += Math.sin(nx * xFreq + animatedTime);
        plasmaValue += Math.sin(ny * yFreq + animatedTime);
        plasmaValue += Math.sin((nx + ny) * xFreq * 0.5 + animatedTime);
        plasmaValue += Math.sin(Math.sqrt(nx * nx + ny * ny) * yFreq + animatedTime);
        
        // Additional complexity
        if (complexity > 0.5) {
          plasmaValue += Math.sin(nx * xFreq * 2 + animatedTime * 1.3) * 0.5;
          plasmaValue += Math.sin(ny * yFreq * 2 + animatedTime * 0.7) * 0.5;
        }
        
        if (complexity > 0.8) {
          plasmaValue += Math.sin((nx - ny) * xFreq * 0.3 + animatedTime * 2) * 0.3;
          plasmaValue += Math.sin(Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.5) * (ny - 0.5)) * yFreq * 3 + animatedTime) * 0.3;
        }

        // Normalize plasma value to [0, 1] (original working normalization)
        plasmaValue = (plasmaValue + 4) / 8;
        plasmaValue = Math.max(0, Math.min(1, plasmaValue));

        // Map to palette
        const colorIndex = Math.floor(plasmaValue * (palette.colors.length - 1));
        const color = palette.colors[colorIndex];

        // Parse hex color
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        data[pixelIndex] = r;     // R
        data[pixelIndex + 1] = g; // G
        data[pixelIndex + 2] = b; // B
        data[pixelIndex + 3] = 255; // A
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // TODO: Add multi-layer blending once single layer is confirmed working

  }, [width, height, plasmaLayers, palettes]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
};
