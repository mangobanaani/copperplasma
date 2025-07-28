import React, { useRef, useEffect } from 'react';
import type { PlasmaConfig, Palette } from '../types';

interface PlasmaFieldProps {
  width: number;
  height: number;
  config: PlasmaConfig;
  palette: Palette;
}

export const PlasmaField: React.FC<PlasmaFieldProps> = ({
  width,
  height,
  config,
  palette
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const { time, xOffset, yOffset, xFreq, yFreq, complexity } = config;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;

        // Normalize coordinates
        const nx = (x + xOffset) / width;
        const ny = (y + yOffset) / height;

        // Calculate plasma value using multiple sine waves
        let plasmaValue = 0;
        
        // Primary plasma patterns
        plasmaValue += Math.sin(nx * xFreq + time);
        plasmaValue += Math.sin(ny * yFreq + time);
        plasmaValue += Math.sin((nx + ny) * xFreq * 0.5 + time);
        plasmaValue += Math.sin(Math.sqrt(nx * nx + ny * ny) * yFreq + time);
        
        // Additional complexity
        if (complexity > 0.5) {
          plasmaValue += Math.sin(nx * xFreq * 2 + time * 1.3) * 0.5;
          plasmaValue += Math.sin(ny * yFreq * 2 + time * 0.7) * 0.5;
        }
        
        if (complexity > 0.8) {
          plasmaValue += Math.sin((nx - ny) * xFreq * 0.3 + time * 2) * 0.3;
          plasmaValue += Math.sin(Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.5) * (ny - 0.5)) * yFreq * 3 + time) * 0.3;
        }

        // Normalize plasma value to [0, 1]
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
  }, [width, height, config, palette]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
};
