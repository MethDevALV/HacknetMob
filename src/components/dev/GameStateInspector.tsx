
import React, { useState } from 'react';
import { Edit, Save, RotateCcw, Copy, Eye, EyeOff } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export const GameStateInspector: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [editMode, setEditMode] = useState(false);
  const [editedState, setEditedState] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return value.toString();
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const startEdit = () => {
    setEditedState(JSON.stringify(gameState, null, 2));
    setEditMode(true);
  };

  const saveEdit = () => {
    try {
      const newState = JSON.parse(editedState);
      updateGameState(newState);
      setEditMode(false);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditedState('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(gameState, null, 2));
  };

  const resetState = () => {
    if (confirm('Are you sure you want to reset the game state?')) {
      updateGameState({
        credits: 1000,
        experience: 0,
        level: 1,
        traceLevel: 0,
        currentDirectory: '/home/user',
        currentNode: 'localhost',
        discoveredDevices: [],
        scannedNodes: [],
        connectedNodes: [],
        activeMissions: [],
        completedMissions: [],
        compromisedNodes: [],
        crackedPorts: [],
      });
    }
  };

  const sections = [
    {
      id: 'basic',
      title: 'Basic Stats',
      data: {
        credits: gameState.credits,
        experience: gameState.experience,
        level: gameState.level,
        traceLevel: gameState.traceLevel,
      }
    },
    {
      id: 'location',
      title: 'Current Location',
      data: {
        currentNode: gameState.currentNode,
        currentDirectory: gameState.currentDirectory,
      }
    },
    {
      id: 'network',
      title: 'Network State',
      data: {
        discoveredDevices: gameState.discoveredDevices,
        scannedNodes: gameState.scannedNodes,
        connectedNodes: gameState.connectedNodes,
        compromisedNodes: gameState.compromisedNodes,
        crackedPorts: gameState.crackedPorts,
      }
    },
    {
      id: 'missions',
      title: 'Missions',
      data: {
        activeMissions: gameState.activeMissions,
        completedMissions: gameState.completedMissions,
        tutorialStep: gameState.tutorialStep,
        tutorialCompleted: gameState.tutorialCompleted,
      }
    },
    {
      id: 'files',
      title: 'File Operations',
      data: {
        downloadedFiles: gameState.downloadedFiles,
        deletedFiles: gameState.deletedFiles,
        uploadedFiles: gameState.uploadedFiles,
        modifiedFiles: gameState.modifiedFiles,
      }
    },
    {
      id: 'tools',
      title: 'Tools & Equipment',
      data: {
        unlockedTools: gameState.unlockedTools,
        availableTools: gameState.availableTools,
      }
    }
  ];

  if (editMode) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 bg-theme-surface border-b border-theme-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Edit Game State</h3>
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <Save size={14} />
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <textarea
            value={editedState}
            onChange={(e) => setEditedState(e.target.value)}
            className="w-full h-full bg-black text-green-400 font-mono text-sm p-4 border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
            spellCheck={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 bg-theme-surface border-b border-theme-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Game State Inspector</h3>
          <div className="flex gap-2">
            <button
              onClick={startEdit}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Edit size={14} />
              Edit
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              <Copy size={14} />
              Copy
            </button>
            <button
              onClick={resetState}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
        
        <div className="text-sm text-theme-textSecondary">
          Real-time view of the current game state. Click sections to expand/collapse.
        </div>
      </div>

      {/* State Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sections.map(section => (
          <div key={section.id} className="bg-theme-surface border border-theme-border rounded-lg">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-theme-background/50 transition-colors"
            >
              <h4 className="font-medium text-theme-text">{section.title}</h4>
              {expandedSections.has(section.id) ? (
                <EyeOff size={16} className="text-theme-textSecondary" />
              ) : (
                <Eye size={16} className="text-theme-textSecondary" />
              )}
            </button>
            
            {expandedSections.has(section.id) && (
              <div className="px-3 pb-3">
                <div className="bg-black rounded border border-gray-600 p-3">
                  <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(section.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
