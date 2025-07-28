import React, { useRef, useEffect } from 'react';
import type { CopperBarConfig, Palette } from '../types';
import { interpolateColor } from '../palettes';

interface CopperBarsProps {
  width: number;
  height: number;
  copperBars: CopperBarConfig[];
  palette: Palette;
  time: number;
}

export const CopperBars: React.FC<CopperBarsProps> = ({
  width,
  height,
  copperBars,
  palette,
  time
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Create scanlines effect
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        
        // Default to black
        let r = 0, g = 0, b = 0;

        // Check which copper bar affects this pixel
        for (const bar of copperBars) {
          const barY = bar.y + Math.sin(time * bar.speed) * 20;
          const distance = Math.abs(y - barY);
          
          if (distance < bar.height) {
            const intensity = 1 - (distance / bar.height);
            const colorIndex = Math.min(bar.colorIndex, palette.colors.length - 1);
            const nextColorIndex = Math.min(colorIndex + 1, palette.colors.length - 1);
            
            // Interpolate between colors for smooth gradients
            const color = interpolateColor(
              palette.colors[colorIndex],
              palette.colors[nextColorIndex],
              intensity
            );
            
            // Parse color
            const hex = color.replace('#', '');
            const colorR = parseInt(hex.substr(0, 2), 16);
            const colorG = parseInt(hex.substr(2, 2), 16);
            const colorB = parseInt(hex.substr(4, 2), 16);
            
            // Apply intensity
            r = Math.max(r, colorR * intensity);
            g = Math.max(g, colorG * intensity);
            b = Math.max(b, colorB * intensity);
          }
        }

        // Apply scanline effect
        const scanlineIntensity = y % 2 === 0 ? 1.0 : 0.7;
        
        data[pixelIndex] = r * scanlineIntensity;     // R
        data[pixelIndex + 1] = g * scanlineIntensity; // G
        data[pixelIndex + 2] = b * scanlineIntensity; // B
        data[pixelIndex + 3] = 255;                   // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [width, height, copperBars, palette, time]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
};
