import React from 'react';
import type { EffectControls, CopperBarConfig, PlasmaConfig } from '../types';
import { CLASSIC_PALETTES } from '../palettes';

interface ControlPanelProps {
  controls: EffectControls;
  onControlsChange: (controls: EffectControls) => void;
  currentEffect: 'copper' | 'plasma' | 'both';
  onEffectChange: (effect: 'copper' | 'plasma' | 'both') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  controls,
  onControlsChange,
  currentEffect,
  onEffectChange
}) => {
  const updateCopperBar = (index: number, updates: Partial<CopperBarConfig>) => {
    const newCopperBars = [...controls.copperBars];
    newCopperBars[index] = { ...newCopperBars[index], ...updates };
    onControlsChange({ ...controls, copperBars: newCopperBars });
  };

  const updatePlasmaLayer = (index: number, updates: Partial<PlasmaConfig>) => {
    const newPlasmaLayers = [...controls.plasmaLayers];
    newPlasmaLayers[index] = { ...newPlasmaLayers[index], ...updates };
    onControlsChange({ 
      ...controls, 
      plasmaLayers: newPlasmaLayers
    });
  };

  const addPlasmaLayer = () => {
    const newLayer: PlasmaConfig = {
      time: 0,
      xOffset: Math.random() * 100 - 50,
      yOffset: Math.random() * 100 - 50,
      xFreq: 3 + Math.random() * 8,
      yFreq: 3 + Math.random() * 8,
      complexity: 0.5 + Math.random() * 0.5,
      paletteIndex: Math.floor(Math.random() * CLASSIC_PALETTES.length),
      opacity: 0.7 + Math.random() * 0.3,
      blendMode: (['normal', 'multiply', 'screen', 'overlay', 'add'][Math.floor(Math.random() * 5)] as 'normal' | 'multiply' | 'screen' | 'overlay' | 'add'),
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    };
    onControlsChange({
      ...controls,
      plasmaLayers: [...controls.plasmaLayers, newLayer]
    });
  };

  const removePlasmaLayer = (index: number) => {
    const newPlasmaLayers = controls.plasmaLayers.filter((_, i) => i !== index);
    onControlsChange({ ...controls, plasmaLayers: newPlasmaLayers });
  };

  const addCopperBar = () => {
    const newBar: CopperBarConfig = {
      y: Math.random() * 300 + 50,
      height: 30,
      colorIndex: Math.floor(Math.random() * CLASSIC_PALETTES[controls.selectedPalette].colors.length),
      speed: Math.random() * 0.02 + 0.01
    };
    onControlsChange({
      ...controls,
      copperBars: [...controls.copperBars, newBar]
    });
  };

  const removeCopperBar = (index: number) => {
    const newCopperBars = controls.copperBars.filter((_, i) => i !== index);
    onControlsChange({ ...controls, copperBars: newCopperBars });
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#222', 
      color: '#fff', 
      fontFamily: 'monospace',
      minWidth: '300px',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <h2>Amiga Demo Controls</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Effect Type</h3>
        <div>
          <label>
            <input
              type="radio"
              value="copper"
              checked={currentEffect === 'copper'}
              onChange={(e) => onEffectChange(e.target.value as 'copper')}
            />
            Copper Bars
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="plasma"
              checked={currentEffect === 'plasma'}
              onChange={(e) => onEffectChange(e.target.value as 'plasma')}
            />
            Plasma Field
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="both"
              checked={currentEffect === 'both'}
              onChange={(e) => onEffectChange(e.target.value as 'both')}
            />
            Both (Layered)
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Palette</h3>
        <select
          value={controls.selectedPalette}
          onChange={(e) => onControlsChange({ 
            ...controls, 
            selectedPalette: parseInt(e.target.value) 
          })}
          style={{ width: '100%', padding: '5px' }}
        >
          {CLASSIC_PALETTES.map((palette, index) => (
            <option key={index} value={index}>
              {palette.name}
            </option>
          ))}
        </select>
        
        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          {CLASSIC_PALETTES[controls.selectedPalette].colors.slice(0, 16).map((color, index) => (
            <div
              key={index}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: color,
                border: '1px solid #444'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Animation Speed</h3>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={controls.animationSpeed}
          onChange={(e) => onControlsChange({ 
            ...controls, 
            animationSpeed: parseFloat(e.target.value) 
          })}
          style={{ width: '100%' }}
        />
        <div>Speed: {controls.animationSpeed.toFixed(1)}x</div>
      </div>

      {(currentEffect === 'copper' || currentEffect === 'both') && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Copper Bars</h3>
          <button onClick={addCopperBar} style={{ marginBottom: '10px' }}>
            Add Copper Bar
          </button>
          
          {controls.copperBars.map((bar, index) => (
            <div key={index} style={{ 
              border: '1px solid #444', 
              padding: '10px', 
              marginBottom: '10px',
              backgroundColor: '#333'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Bar {index + 1}</h4>
                <button onClick={() => removeCopperBar(index)}>Remove</button>
              </div>
              
              <div>
                <label>Y Position: {Math.round(bar.y)}</label>
                <input
                  type="range"
                  min="0"
                  max="400"
                  value={bar.y}
                  onChange={(e) => updateCopperBar(index, { y: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Height: {bar.height}</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={bar.height}
                  onChange={(e) => updateCopperBar(index, { height: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Color: {bar.colorIndex}</label>
                <input
                  type="range"
                  min="0"
                  max={CLASSIC_PALETTES[controls.selectedPalette].colors.length - 1}
                  value={bar.colorIndex}
                  onChange={(e) => updateCopperBar(index, { colorIndex: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Speed: {bar.speed.toFixed(3)}</label>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.001"
                  value={bar.speed}
                  onChange={(e) => updateCopperBar(index, { speed: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {(currentEffect === 'plasma' || currentEffect === 'both') && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Plasma Layers</h3>
          <button onClick={addPlasmaLayer} style={{ marginBottom: '10px' }}>
            Add Plasma Layer
          </button>
          
          {controls.plasmaLayers.map((layer, index) => (
            <div key={index} style={{ 
              border: '1px solid #444', 
              padding: '10px', 
              marginBottom: '10px',
              backgroundColor: '#333'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Layer {index + 1}</h4>
                <button onClick={() => removePlasmaLayer(index)}>Remove</button>
              </div>
              
              <div>
                <label>Palette: {CLASSIC_PALETTES[layer.paletteIndex]?.name || 'Unknown'}</label>
                <select
                  value={layer.paletteIndex}
                  onChange={(e) => updatePlasmaLayer(index, { paletteIndex: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
                >
                  {CLASSIC_PALETTES.map((palette, pIndex) => (
                    <option key={pIndex} value={pIndex}>
                      {palette.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label>Blend Mode:</label>
                <select
                  value={layer.blendMode}
                  onChange={(e) => updatePlasmaLayer(index, { blendMode: e.target.value as PlasmaConfig['blendMode'] })}
                  style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="add">Add (Lighter)</option>
                  <option value="xor">XOR</option>
                </select>
              </div>
              
              <div>
                <label>Opacity: {layer.opacity.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={layer.opacity}
                  onChange={(e) => updatePlasmaLayer(index, { opacity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Speed: {layer.speed.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={layer.speed}
                  onChange={(e) => updatePlasmaLayer(index, { speed: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>X Frequency: {layer.xFreq.toFixed(1)}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={layer.xFreq}
                  onChange={(e) => updatePlasmaLayer(index, { xFreq: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Y Frequency: {layer.yFreq.toFixed(1)}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={layer.yFreq}
                  onChange={(e) => updatePlasmaLayer(index, { yFreq: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>X Offset: {Math.round(layer.xOffset)}</label>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={layer.xOffset}
                  onChange={(e) => updatePlasmaLayer(index, { xOffset: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Y Offset: {Math.round(layer.yOffset)}</label>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={layer.yOffset}
                  onChange={(e) => updatePlasmaLayer(index, { yOffset: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Complexity: {layer.complexity.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={layer.complexity}
                  onChange={(e) => updatePlasmaLayer(index, { complexity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label>Phase: {layer.phase.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 2}
                  step="0.01"
                  value={layer.phase}
                  onChange={(e) => updatePlasmaLayer(index, { phase: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
