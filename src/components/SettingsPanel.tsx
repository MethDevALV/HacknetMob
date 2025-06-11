
import React, { useState } from 'react';
import { AudioSettings } from './settings/AudioSettings';
import { LanguageSettings } from './settings/LanguageSettings';
import { GameManagement } from './settings/GameManagement';
import { PatchNotes } from './settings/PatchNotes';
import { useGameState } from '../hooks/useGameState';
import { Settings, Volume2, Globe, Save, FileText } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'audio' | 'language' | 'game' | 'patches'>('audio');
  const { gameState } = useGameState();

  const sections = [
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'language', label: 'Idioma', icon: Globe },
    { id: 'game', label: 'Partida', icon: Save },
    { id: 'patches', label: 'Actualizaciones', icon: FileText }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'audio':
        return <AudioSettings />;
      case 'language':
        return <LanguageSettings />;
      case 'game':
        return <GameManagement />;
      case 'patches':
        return <PatchNotes />;
      default:
        return <AudioSettings />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-matrix-green">
      {/* Header */}
      <div className="p-3 border-b border-matrix-green/30">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={20} className="text-matrix-cyan" />
          <h2 className="text-matrix-cyan font-bold text-lg">CONFIGURACIÓN</h2>
        </div>
        <div className="text-sm text-matrix-green/70">
          Usuario: {gameState.currentNode} | Créditos: ${gameState.credits}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-matrix-green/30">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex flex-col items-center justify-center p-3 border-r border-matrix-green/30 last:border-r-0 transition-all min-h-[60px] touch-action-manipulation ${
                  activeSection === section.id
                    ? 'bg-matrix-green/20 text-matrix-cyan border-b-2 border-matrix-cyan'
                    : 'hover:bg-matrix-green/10 text-matrix-green'
                }`}
              >
                <Icon size={18} className="mb-1" />
                <span className="text-xs font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {renderActiveSection()}
      </div>
    </div>
  );
};
