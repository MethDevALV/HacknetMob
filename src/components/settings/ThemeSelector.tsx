
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Palette, Check, Monitor, Zap, Minimize, Code, Sparkles } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, themeName, setTheme, availableThemes } = useTheme();

  const getThemeIcon = (name: string) => {
    switch (name) {
      case 'terminal-classic': return Monitor;
      case 'cyberpunk-neon': return Zap;
      case 'hacker-minimal': return Minimize;
      case 'matrix-code': return Code;
      case 'holographic': return Sparkles;
      default: return Monitor;
    }
  };

  const getNavigationDescription = (navigationType: string) => {
    switch (navigationType) {
      case 'horizontal-top': return 'Navegación horizontal superior';
      case 'vertical-left': return 'Navegación vertical izquierda';
      case 'dock-bottom': return 'Dock flotante inferior';
      case 'slider-right': return 'Panel deslizante derecho';
      case 'circular-corner': return 'Menú circular esquina';
      default: return 'Navegación estándar';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette size={24} className="text-theme-primary" />
        <h3 className="font-bold text-xl" style={{ color: 'var(--theme-primary)' }}>
          Temas de Interfaz
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {availableThemes.map((theme) => {
          const ThemeIcon = getThemeIcon(theme.name);
          return (
            <div
              key={theme.name}
              className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                themeName === theme.name
                  ? 'border-theme-primary bg-theme-primary/10 scale-105'
                  : 'border-theme-border/30 bg-theme-surface/50 hover:border-theme-primary/50 hover:scale-102'
              }`}
              onClick={() => setTheme(theme.name)}
            >
              {/* Theme Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ThemeIcon 
                    size={28} 
                    style={{ color: theme.colors.primary }}
                    className={themeName === theme.name ? 'animate-pulse' : ''}
                  />
                  <div>
                    <h4 
                      className="font-bold text-lg"
                      style={{ color: theme.colors.primary }}
                    >
                      {theme.displayName}
                    </h4>
                    <p className="text-sm text-theme-textSecondary">
                      {getNavigationDescription(theme.navigationType)}
                    </p>
                  </div>
                </div>
                {themeName === theme.name && (
                  <Check size={24} style={{ color: theme.colors.primary }} className="animate-bounce" />
                )}
              </div>

              {/* Color Palette Preview */}
              <div className="flex gap-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-white/20"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary"
                />
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-white/20"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary"
                />
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-white/20"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent"
                />
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-white/20"
                  style={{ backgroundColor: theme.colors.background }}
                  title="Background"
                />
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-gray-400"
                  style={{ backgroundColor: theme.colors.surface }}
                  title="Surface"
                />
              </div>

              {/* Terminal Preview */}
              <div 
                className="p-4 rounded-lg text-sm mb-4"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.mono,
                  border: `2px solid ${theme.colors.border}`,
                  borderRadius: theme.layout.borderRadius
                }}
              >
                <div style={{ color: theme.colors.primary }} className="mb-1">
                  user@hacknet:~$ <span style={{ color: theme.colors.secondary }}>scan</span>
                </div>
                <div style={{ color: theme.colors.textSecondary }} className="mb-1">
                  Scanning network...
                </div>
                <div style={{ color: theme.colors.success }}>
                  [OK] Found 3 devices
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-medium text-theme-text">Efectos:</span>
                  <div className="text-theme-textSecondary space-y-1">
                    {theme.effects.glow && <div>✨ Glow Effects</div>}
                    {theme.effects.glitch && <div>⚡ Glitch Effects</div>}
                    {theme.effects.holographic && <div>🔮 Holographic</div>}
                    {theme.effects.typewriter && <div>⌨️ Typewriter</div>}
                    {theme.effects.particles && <div>✨ Particles</div>}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-theme-text">Fuentes:</span>
                  <div className="text-theme-textSecondary space-y-1">
                    <div style={{ fontFamily: theme.fonts.mono }}>
                      Mono: {theme.fonts.mono.split(',')[0].replace(/"/g, '')}
                    </div>
                    <div style={{ fontFamily: theme.fonts.sans }}>
                      Sans: {theme.fonts.sans.split(',')[0].replace(/"/g, '')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {themeName === theme.name && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-primary/20 to-transparent pointer-events-none rounded-lg" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-lg border" style={{ 
        borderColor: 'var(--theme-border)', 
        backgroundColor: 'var(--theme-surface)' 
      }}>
        <p className="text-sm mb-2" style={{ color: 'var(--theme-text)' }}>
          <strong>Tema actual:</strong> {currentTheme.displayName}
        </p>
        <p className="text-sm mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
          <strong>Navegación:</strong> {getNavigationDescription(currentTheme.navigationType)}
        </p>
        <p className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>
          Los temas se guardan automáticamente y se aplican en toda la aplicación. Cada tema incluye su propio estilo de navegación único.
        </p>
      </div>
    </div>
  );
};
