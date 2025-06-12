
import React, { useState } from 'react';
import { Bug, Monitor, Edit, Database, Terminal as TerminalIcon, Settings } from 'lucide-react';
import { DebugConsole } from './DebugConsole';
import { LogsViewer } from './LogsViewer';
import { GameStateInspector } from './GameStateInspector';
import { LevelEditor } from './LevelEditor';

type DevToolTab = 'debug' | 'logs' | 'inspector' | 'editor';

export const DevToolsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DevToolTab>('debug');

  const tabs = [
    { id: 'debug' as DevToolTab, label: 'Debug Console', icon: TerminalIcon },
    { id: 'logs' as DevToolTab, label: 'Logs Viewer', icon: Monitor },
    { id: 'inspector' as DevToolTab, label: 'Game Inspector', icon: Database },
    { id: 'editor' as DevToolTab, label: 'Level Editor', icon: Edit },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'debug':
        return <DebugConsole />;
      case 'logs':
        return <LogsViewer />;
      case 'inspector':
        return <GameStateInspector />;
      case 'editor':
        return <LevelEditor />;
      default:
        return <DebugConsole />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-theme-background text-theme-text">
      {/* Header */}
      <div className="p-4 bg-theme-surface border-b border-theme-border">
        <div className="flex items-center gap-2 mb-4">
          <Bug className="text-theme-primary" size={24} />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--theme-font-mono)' }}>
            Developer Tools
          </h2>
          <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">
            DEV
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-theme-background rounded-lg p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-theme-primary text-white'
                    : 'text-theme-textSecondary hover:bg-theme-surface hover:text-theme-text'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};
