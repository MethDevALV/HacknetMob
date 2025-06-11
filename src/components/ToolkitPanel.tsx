
import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';

interface Tool {
  name: string;
  description: string;
  category: 'scanning' | 'exploitation' | 'maintenance';
  ramUsage: number;
  targetPorts: number[];
  unlocked: boolean;
  price?: number;
}

interface Hardware {
  name: string;
  description: string;
  type: 'ram' | 'cpu' | 'hdd';
  improvement: string;
  price: number;
  owned: boolean;
}

export const ToolkitPanel: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedHardware, setSelectedHardware] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tools' | 'hardware'>('tools');

  const tools: Tool[] = [
    {
      name: 'SSHcrack',
      description: 'Exploits SSH vulnerabilities to gain remote access.',
      category: 'exploitation',
      ramUsage: 1.2,
      targetPorts: [22],
      unlocked: gameState.unlockedTools.includes('SSHcrack')
    },
    {
      name: 'FTPBounce',
      description: 'Bypasses FTP security to upload malicious payloads.',
      category: 'exploitation',
      ramUsage: 0.8,
      targetPorts: [21],
      unlocked: gameState.unlockedTools.includes('FTPBounce')
    },
    {
      name: 'WebServerWorm',
      description: 'Spreads through web servers, creating backdoors.',
      category: 'exploitation',
      ramUsage: 2.1,
      targetPorts: [80, 443],
      unlocked: gameState.unlockedTools.includes('WebServerWorm')
    },
    {
      name: 'PortHack',
      description: 'Universal port exploitation tool.',
      category: 'exploitation',
      ramUsage: 1.5,
      targetPorts: [21, 22, 80, 443, 3306],
      unlocked: gameState.unlockedTools.includes('PortHack')
    },
    {
      name: 'Scanner',
      description: 'Scans network for active nodes.',
      category: 'scanning',
      ramUsage: 0.3,
      targetPorts: [],
      unlocked: gameState.unlockedTools.includes('scanner')
    },
    {
      name: 'Probe',
      description: 'Analyzes target ports and services.',
      category: 'scanning',
      ramUsage: 0.5,
      targetPorts: [],
      unlocked: gameState.unlockedTools.includes('probe')
    },
    {
      name: 'SQLInjector',
      description: 'Advanced SQL injection tool for databases.',
      category: 'exploitation',
      ramUsage: 2.5,
      targetPorts: [3306, 5432],
      unlocked: gameState.unlockedTools.includes('SQLInjector'),
      price: 1500
    },
    {
      name: 'AdvancedPortHack',
      description: 'Enhanced version with faster execution.',
      category: 'exploitation',
      ramUsage: 1.0,
      targetPorts: [21, 22, 80, 443, 3306],
      unlocked: gameState.unlockedTools.includes('AdvancedPortHack'),
      price: 2000
    }
  ];

  const hardware: Hardware[] = [
    {
      name: 'RAM Upgrade 16GB',
      description: 'Doubles your available RAM capacity.',
      type: 'ram',
      improvement: '+8GB RAM',
      price: 800,
      owned: gameState.totalRAM > 8
    },
    {
      name: 'RAM Upgrade 32GB',
      description: 'Professional grade memory for heavy operations.',
      type: 'ram',
      improvement: '+16GB RAM',
      price: 2000,
      owned: gameState.totalRAM > 16
    },
    {
      name: 'CPU Overclock',
      description: 'Increases processing speed and reduces trace time.',
      type: 'cpu',
      improvement: '+50% CPU Speed',
      price: 1200,
      owned: false
    },
    {
      name: 'SSD Upgrade',
      description: 'Faster file operations and improved performance.',
      type: 'hdd',
      improvement: '+100% File Speed',
      price: 600,
      owned: false
    }
  ];

  const getCategoryColor = (category: Tool['category']) => {
    switch (category) {
      case 'scanning': return 'text-matrix-cyan';
      case 'exploitation': return 'text-red-500';
      case 'maintenance': return 'text-yellow-400';
      default: return 'text-gray-500';
    }
  };

  const getHardwareIcon = (type: Hardware['type']) => {
    switch (type) {
      case 'ram': return '🧠';
      case 'cpu': return '⚡';
      case 'hdd': return '💾';
      default: return '🔧';
    }
  };

  const handlePurchaseTool = (tool: Tool) => {
    if (!tool.price || gameState.credits < tool.price) {
      alert('Insufficient credits!');
      return;
    }

    updateGameState({
      credits: gameState.credits - tool.price,
      unlockedTools: [...gameState.unlockedTools, tool.name]
    });
    alert(`${tool.name} purchased successfully!`);
  };

  const handlePurchaseHardware = (hardware: Hardware) => {
    if (gameState.credits < hardware.price || hardware.owned) {
      alert('Insufficient credits or already owned!');
      return;
    }

    const updates: any = {
      credits: gameState.credits - hardware.price
    };

    switch (hardware.type) {
      case 'ram':
        if (hardware.name.includes('16GB')) {
          updates.totalRAM = 16;
        } else if (hardware.name.includes('32GB')) {
          updates.totalRAM = 32;
        }
        break;
      // Add other hardware effects here
    }

    updateGameState(updates);
    alert(`${hardware.name} purchased successfully!`);
  };

  return (
    <div className="h-full flex flex-col p-3 text-matrix-green">
      <div className="mb-3 pb-2 border-b border-matrix-green">
        <h3 className="text-matrix-cyan font-bold text-lg">TOOLKIT</h3>
        <div className="text-sm text-yellow-400 mb-2">
          Credits: ${gameState.credits}
        </div>
        
        {/* Tab selector */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm border transition-all ${
              activeTab === 'tools' 
                ? 'border-matrix-cyan text-matrix-cyan bg-matrix-cyan bg-opacity-20' 
                : 'border-matrix-green text-matrix-green hover:bg-matrix-green hover:bg-opacity-10'
            }`}
            onClick={() => setActiveTab('tools')}
          >
            TOOLS
          </button>
          <button
            className={`px-3 py-1 text-sm border transition-all ${
              activeTab === 'hardware' 
                ? 'border-matrix-cyan text-matrix-cyan bg-matrix-cyan bg-opacity-20' 
                : 'border-matrix-green text-matrix-green hover:bg-matrix-green hover:bg-opacity-10'
            }`}
            onClick={() => setActiveTab('hardware')}
          >
            HARDWARE
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {activeTab === 'tools' && tools.map(tool => (
          <div
            key={tool.name}
            className={`border p-3 cursor-pointer transition-all ${
              tool.unlocked 
                ? 'border-matrix-green hover:bg-matrix-green hover:bg-opacity-10' 
                : tool.price 
                  ? 'border-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                  : 'border-gray-600 opacity-50'
            } ${selectedTool === tool.name ? 'bg-matrix-green bg-opacity-20' : ''}`}
            onClick={() => tool.unlocked && setSelectedTool(tool.name === selectedTool ? null : tool.name)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`font-bold ${
                tool.unlocked ? 'text-matrix-cyan' : 
                tool.price ? 'text-yellow-400' : 'text-gray-500'
              }`}>
                {tool.name}
              </span>
              <span className={`text-xs ${getCategoryColor(tool.category)}`}>
                {tool.category.toUpperCase()}
              </span>
            </div>
            <div className="text-sm mb-2">{tool.description}</div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-yellow-400">
                RAM: {tool.ramUsage}GB | Port: {tool.targetPorts.join(', ')}
              </span>
              {tool.price && !tool.unlocked && (
                <button
                  className="px-2 py-1 text-xs border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchaseTool(tool);
                  }}
                >
                  ${tool.price}
                </button>
              )}
            </div>
          </div>
        ))}

        {activeTab === 'hardware' && hardware.map(hw => (
          <div
            key={hw.name}
            className={`border p-3 cursor-pointer transition-all ${
              hw.owned 
                ? 'border-matrix-green bg-matrix-green bg-opacity-10' 
                : 'border-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
            } ${selectedHardware === hw.name ? 'bg-matrix-green bg-opacity-20' : ''}`}
            onClick={() => setSelectedHardware(hw.name === selectedHardware ? null : hw.name)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getHardwareIcon(hw.type)}</span>
                <span className={`font-bold ${hw.owned ? 'text-matrix-green' : 'text-yellow-400'}`}>
                  {hw.name}
                </span>
              </div>
              <span className="text-xs text-matrix-cyan">
                {hw.improvement}
              </span>
            </div>
            <div className="text-sm mb-2">{hw.description}</div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${hw.owned ? 'text-matrix-green' : 'text-yellow-400'}`}>
                {hw.owned ? 'OWNED' : `$${hw.price}`}
              </span>
              {!hw.owned && (
                <button
                  className="px-2 py-1 text-xs border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchaseHardware(hw);
                  }}
                >
                  BUY
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
