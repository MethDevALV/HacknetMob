
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'terminal-classic' | 'cyberpunk-neon' | 'hacker-minimal' | 'matrix-code' | 'holographic';

export type NavigationType = 'horizontal-top' | 'vertical-left' | 'dock-bottom' | 'slider-right' | 'circular-corner';

export interface Theme {
  name: ThemeName;
  displayName: string;
  navigationType: NavigationType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    mono: string;
    sans: string;
  };
  effects: {
    glow: boolean;
    glitch: boolean;
    holographic: boolean;
    typewriter: boolean;
    particles: boolean;
  };
  layout: {
    borderRadius: string;
    spacing: string;
    shadows: boolean;
    animations: boolean;
  };
}

const themes: Record<ThemeName, Theme> = {
  'terminal-classic': {
    name: 'terminal-classic',
    displayName: 'Terminal Clásico',
    navigationType: 'horizontal-top',
    colors: {
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#00aa00',
      background: '#000000',
      surface: '#001100',
      text: '#00ff00',
      textSecondary: '#00cc00',
      border: '#00ff00',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff',
    },
    fonts: {
      mono: '"Courier New", "Monaco", "Lucida Console", monospace',
      sans: '"Courier New", "Monaco", "Lucida Console", monospace',
    },
    effects: {
      glow: true,
      glitch: false,
      holographic: false,
      typewriter: true,
      particles: false,
    },
    layout: {
      borderRadius: '0px',
      spacing: '8px',
      shadows: false,
      animations: true,
    },
  },
  'cyberpunk-neon': {
    name: 'cyberpunk-neon',
    displayName: 'Cyberpunk Neón',
    navigationType: 'vertical-left',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#0a0a0a',
      surface: '#1a0a1a',
      text: '#ff00ff',
      textSecondary: '#00ffff',
      border: '#ff00ff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0040',
      info: '#0080ff',
    },
    fonts: {
      mono: '"Orbitron", "Rajdhani", monospace',
      sans: '"Rajdhani", "Orbitron", sans-serif',
    },
    effects: {
      glow: true,
      glitch: true,
      holographic: false,
      typewriter: false,
      particles: true,
    },
    layout: {
      borderRadius: '8px',
      spacing: '12px',
      shadows: true,
      animations: true,
    },
  },
  'hacker-minimal': {
    name: 'hacker-minimal',
    displayName: 'Hacker Minimalista',
    navigationType: 'dock-bottom',
    colors: {
      primary: '#0066cc',
      secondary: '#004499',
      accent: '#0080ff',
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8',
    },
    fonts: {
      mono: '"SF Mono", "Monaco", "Inconsolata", monospace',
      sans: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    },
    effects: {
      glow: false,
      glitch: false,
      holographic: false,
      typewriter: false,
      particles: false,
    },
    layout: {
      borderRadius: '12px',
      spacing: '16px',
      shadows: true,
      animations: true,
    },
  },
  'matrix-code': {
    name: 'matrix-code',
    displayName: 'Matrix Code',
    navigationType: 'slider-right',
    colors: {
      primary: '#00ff41',
      secondary: '#00cc33',
      accent: '#00aa28',
      background: '#000000',
      surface: '#001a00',
      text: '#00ff41',
      textSecondary: '#00cc33',
      border: '#00ff41',
      success: '#00ff41',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff',
    },
    fonts: {
      mono: '"Matrix Code NFI", "Courier New", monospace',
      sans: '"Matrix Code NFI", "Courier New", monospace',
    },
    effects: {
      glow: true,
      glitch: true,
      holographic: false,
      typewriter: true,
      particles: true,
    },
    layout: {
      borderRadius: '0px',
      spacing: '8px',
      shadows: false,
      animations: true,
    },
  },
  'holographic': {
    name: 'holographic',
    displayName: 'Interfaz Holográfica',
    navigationType: 'circular-corner',
    colors: {
      primary: '#4dc8ff',
      secondary: '#80d4ff',
      accent: '#b3e0ff',
      background: '#f0f8ff',
      surface: 'rgba(255, 255, 255, 0.8)',
      text: '#1a5490',
      textSecondary: '#4d7db8',
      border: '#4dc8ff',
      success: '#00d4aa',
      warning: '#ffb347',
      error: '#ff6b6b',
      info: '#4dc8ff',
    },
    fonts: {
      mono: '"Roboto Mono", "Source Code Pro", monospace',
      sans: '"Roboto", "Open Sans", sans-serif',
    },
    effects: {
      glow: true,
      glitch: false,
      holographic: true,
      typewriter: false,
      particles: true,
    },
    layout: {
      borderRadius: '16px',
      spacing: '20px',
      shadows: true,
      animations: true,
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('terminal-classic');

  useEffect(() => {
    const savedTheme = localStorage.getItem('hacknet-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  useEffect(() => {
    const theme = themes[themeName];
    const root = document.documentElement;

    // Set CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    root.style.setProperty('--theme-font-mono', theme.fonts.mono);
    root.style.setProperty('--theme-font-sans', theme.fonts.sans);
    root.style.setProperty('--theme-border-radius', theme.layout.borderRadius);
    root.style.setProperty('--theme-spacing', theme.layout.spacing);

    // Add theme classes
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${themeName}`);

    localStorage.setItem('hacknet-theme', themeName);
  }, [themeName]);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  const currentTheme = themes[themeName];
  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeName,
        setTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
