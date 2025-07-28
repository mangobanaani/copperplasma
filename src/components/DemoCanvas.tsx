import React, { useState, useEffect, useRef } from 'react';
import type { EffectControls } from '../types';
import { CLASSIC_PALETTES } from '../palettes';
import { CopperBars } from './CopperBars';
import { MultiPlasmaField } from './MultiPlasmaField';
import { ControlPanel } from './ControlPanel';

export const DemoCanvas: React.FC = () => {
  const [time, setTime] = useState(0);
  const [currentEffect, setCurrentEffect] = useState<'copper' | 'plasma' | 'both'>('plasma');
  const animationRef = useRef<number | undefined>(undefined);
  
  const [controls, setControls] = useState<EffectControls>({
    copperBars: [
      { y: 100, height: 40, colorIndex: 8, speed: 0.02 },
      { y: 200, height: 30, colorIndex: 16, speed: 0.015 },
      { y: 300, height: 50, colorIndex: 24, speed: 0.025 }
    ],
    plasmaLayers: [
      {
        time: 0,
        xOffset: 0,
        yOffset: 0,
        xFreq: 6,
        yFreq: 4,
        complexity: 0.7,
        paletteIndex: 0,
        opacity: 1.0,
        blendMode: 'normal' as const,
        speed: 1.0,
        phase: 0
      }
    ],
    selectedPalette: 0,
    animationSpeed: 1.0
  });

  const canvasWidth = 640;
  const canvasHeight = 400;

  useEffect(() => {
    const animate = () => {
      setTime(prevTime => {
        const newTime = prevTime + 0.016 * controls.animationSpeed; // ~60fps
        setControls(prev => ({
          ...prev,
          plasmaLayers: prev.plasmaLayers.map(layer => ({
            ...layer,
            time: newTime
          }))
        }));
        return newTime;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [controls.animationSpeed]);

  const selectedPalette = CLASSIC_PALETTES[controls.selectedPalette];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#111' }}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'relative' }}>
          {/* Multi-layer plasma background */}
          {(currentEffect === 'plasma' || currentEffect === 'both') && (
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <MultiPlasmaField
                width={canvasWidth}
                height={canvasHeight}
                plasmaLayers={controls.plasmaLayers}
                palettes={CLASSIC_PALETTES}
              />
            </div>
          )}
          
          {/* Copper bars foreground layer */}
          {(currentEffect === 'copper' || currentEffect === 'both') && (
            <div style={{ 
              position: currentEffect === 'both' ? 'absolute' : 'relative', 
              top: 0, 
              left: 0,
              mixBlendMode: currentEffect === 'both' ? 'screen' : 'normal'
            }}>
              <CopperBars
                width={canvasWidth}
                height={canvasHeight}
                copperBars={controls.copperBars}
                palette={selectedPalette}
                time={time}
              />
            </div>
          )}
          
          {/* Show black canvas when only copper is selected but background layer is needed */}
          {currentEffect === 'copper' && (
            <canvas
              width={canvasWidth}
              height={canvasHeight}
              style={{ 
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -1,
                backgroundColor: '#000'
              }}
            />
          )}
        </div>
        
        {/* Info overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '14px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          zIndex: 10
        }}>
          <div>Multi-Layer Plasma Demo</div>
          <div>Effect: {currentEffect}</div>
          <div>Plasma Layers: {controls.plasmaLayers.length}</div>
          <div>Speed: {controls.animationSpeed.toFixed(1)}x</div>
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            Add layers with different palettes and blend modes
          </div>
          <div style={{ fontSize: '12px' }}>
            Press F11 for fullscreen
          </div>
        </div>
      </div>
      
      <ControlPanel
        controls={controls}
        onControlsChange={setControls}
        currentEffect={currentEffect}
        onEffectChange={setCurrentEffect}
      />
    </div>
  );
};
