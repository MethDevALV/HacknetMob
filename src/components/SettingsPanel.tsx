
import React, { useState } from 'react';
import { AudioSettings } from './settings/AudioSettings';
import { LanguageSettings } from './settings/LanguageSettings';
import { GameManagement } from './settings/GameManagement';
import { PatchNotes } from './settings/PatchNotes';
import { DeveloperPanel } from './settings/DeveloperPanel';
import { ThemeSelector } from './settings/ThemeSelector';
import { useGameState } from '../hooks/useGameState';
import { Settings, Volume2, Globe, Save, FileText, Bug, Palette } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'audio' | 'language' | 'themes' | 'game' | 'patches' | 'devs'>('themes');
  const { gameState } = useGameState();

  const sections = [
    { id: 'themes', label: 'Temas', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'language', label: 'Idioma', icon: Globe },
    { id: 'game', label: 'Partida', icon: Save },
    { id: 'patches', label: 'Notas', icon: FileText },
    { id: 'devs', label: 'Devs', icon: Bug }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'themes':
        return <ThemeSelector />;
      case 'audio':
        return <AudioSettings />;
      case 'language':
        return <LanguageSettings />;
      case 'game':
        return <GameManagement />;
      case 'patches':
        return <PatchNotes />;
      case 'devs':
        return <DeveloperPanel />;
      default:
        return <ThemeSelector />;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ 
      backgroundColor: 'var(--theme-background)', 
      color: 'var(--theme-text)' 
    }}>
      {/* Header */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Settings size={20} style={{ color: 'var(--theme-secondary)' }} />
          <h2 className="font-bold text-lg cyber-heading">
            CONFIGURACIÓN
          </h2>
        </div>
        <div className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
          Usuario: {gameState.currentNode} | Créditos: ${gameState.credits}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="grid grid-cols-3 sm:grid-cols-6">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex flex-col items-center justify-center p-3 border-r last:border-r-0 transition-all min-h-[60px] touch-action-manipulation ${
                  activeSection === section.id
                    ? 'border-b-2'
                    : 'hover:opacity-80'
                }`}
                style={{
                  borderColor: 'var(--theme-border)',
                  ...(activeSection === section.id ? {
                    backgroundColor: 'var(--theme-primary)' + '20',
                    color: 'var(--theme-primary)',
                    borderBottomColor: 'var(--theme-primary)'
                  } : {
                    color: 'var(--theme-text)'
                  })
                }}
              >
                <Icon size={18} className="mb-1" />
                <span className="text-xs font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderActiveSection()}
      </div>
    </div>
  );
};
