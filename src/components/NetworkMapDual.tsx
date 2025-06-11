import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Monitor, Server, Shield, Wifi, Lock, Unlock, Grid, List, Eye, EyeOff } from 'lucide-react';
import { t } from '../utils/i18n';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  ip: string;
  hostname: string;
  type: string;
  security: string;
  os: string;
  compromised: boolean;
  connections: string[];
}

export const NetworkMapDual: React.FC = () => {
  const { getVisibleDevices, gameState } = useGameState();
  const [viewMode, setViewMode] = useState<'graphical' | 'list'>('graphical');
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load view preference
    const savedView = localStorage.getItem('hacknet-network-view');
    if (savedView === 'graphical' || savedView === 'list') {
      setViewMode(savedView);
    }
  }, []);

  useEffect(() => {
    // Save view preference
    localStorage.setItem('hacknet-network-view', viewMode);
  }, [viewMode]);

  useEffect(() => {
    // Convert devices to network nodes for graphical view
    const visibleDevices = getVisibleDevices();
    const networkNodes: NetworkNode[] = visibleDevices.map((device, index) => {
      // Create a circular layout
      const angle = (index * 2 * Math.PI) / Math.max(visibleDevices.length - 1, 1);
      const radius = Math.min(120, 50 + visibleDevices.length * 10);
      
      return {
        id: device.ip,
        x: 200 + (index === 0 ? 0 : Math.cos(angle) * radius),
        y: 150 + (index === 0 ? 0 : Math.sin(angle) * radius),
        ip: device.ip,
        hostname: device.hostname,
        type: device.type,
        security: device.security,
        os: device.os,
        compromised: device.compromised,
        connections: index === 0 ? [] : [visibleDevices[0].ip] // Connect to localhost
      };
    });

    setNodes(networkNodes);
  }, [getVisibleDevices()]);

  // Draw connections on canvas
  useEffect(() => {
    if (viewMode !== 'graphical' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw connections
    nodes.forEach(node => {
      node.connections.forEach(connId => {
        const connectedNode = nodes.find(n => n.id === connId);
        if (!connectedNode) return;
        
        ctx.strokeStyle = node.compromised && connectedNode.compromised ? '#00FFFF' : '#00FF41';
        ctx.lineWidth = 2;
        ctx.setLineDash(node.compromised && connectedNode.compromised ? [] : [5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(node.x + 30, node.y + 30);
        ctx.lineTo(connectedNode.x + 30, connectedNode.y + 30);
        ctx.stroke();
      });
    });

    // Add scan lines effect
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    
    const time = Date.now() * 0.001;
    for (let i = 0; i < 3; i++) {
      const y = ((time * 50 + i * 100) % (canvas.height + 100)) - 50;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [nodes, viewMode]);

  const getDeviceIcon = (type: string, compromised: boolean) => {
    const iconProps = { 
      size: viewMode === 'graphical' ? 20 : 16, 
      className: compromised ? 'text-matrix-cyan' : 'text-matrix-green' 
    };
    
    switch (type.toLowerCase()) {
      case 'server':
        return <Server {...iconProps} />;
      case 'router':
        return <Wifi {...iconProps} />;
      case 'firewall':
        return <Shield {...iconProps} />;
      default:
        return <Monitor {...iconProps} />;
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-matrix-green';
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const renderGraphicalView = () => {
    const visibleDevices = getVisibleDevices();

    if (visibleDevices.length <= 1) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <Wifi size={48} className="mx-auto mb-4 opacity-30 text-matrix-green" />
            </div>
            <p className="text-lg mb-2 text-matrix-green">{t('network.scanRequired')}</p>
            <p className="text-sm text-matrix-green/70">{t('network.scanHint')}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 relative overflow-hidden bg-black">
        {/* Canvas for background grid and connections */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Network nodes */}
        <div className="absolute inset-0">
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute cursor-pointer transition-all duration-300 ${
                selectedNode === node.id ? 'z-20' : 'z-10'
              }`}
              style={{ 
                left: `${(node.x / 800) * 100}%`, 
                top: `${(node.y / 600) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleNodeClick(node.id)}
            >
              {/* Node circle */}
              <div className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm ${
                node.compromised 
                  ? 'border-matrix-cyan bg-matrix-cyan/20 shadow-lg shadow-matrix-cyan/50' 
                  : 'border-matrix-green bg-black/80'
              } ${selectedNode === node.id ? 'ring-2 ring-yellow-400 scale-110' : 'hover:scale-105'}`}>
                
                {/* Node icon */}
                {getDeviceIcon(node.type, node.compromised)}
                
                {/* Security indicator */}
                <div className="absolute -top-1 -right-1">
                  {node.compromised ? (
                    <Unlock size={12} className="text-matrix-cyan" />
                  ) : (
                    <Lock size={12} className="text-matrix-green" />
                  )}
                </div>

                {/* Current node indicator */}
                {gameState.currentNode === node.ip && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Pulsing effect for active nodes */}
                {node.compromised && (
                  <div className="absolute inset-0 rounded-full border-2 border-matrix-cyan animate-ping opacity-50" />
                )}
              </div>

              {/* Node label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center">
                <div className="text-xs font-mono text-matrix-cyan bg-black/80 px-1 rounded">
                  {node.hostname}
                </div>
                <div className="text-xs font-mono text-matrix-green/70 bg-black/80 px-1 rounded">
                  {node.ip}
                </div>
              </div>

              {/* Detailed info popup */}
              {selectedNode === node.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 z-30 
                                bg-black/95 border border-matrix-green p-3 rounded-lg min-w-48
                                backdrop-blur-md shadow-lg shadow-matrix-green/20">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-matrix-green/70">{t('common.type')}:</span>
                      <span className="text-matrix-green">{node.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-matrix-green/70">OS:</span>
                      <span className="text-matrix-green">{node.os}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-matrix-green/70">{t('network.security')}:</span>
                      <span className={getSecurityColor(node.security)}>{node.security}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-matrix-green/70">{t('common.status')}:</span>
                      <span className={node.compromised ? 'text-matrix-cyan' : 'text-yellow-400'}>
                        {node.compromised ? t('network.compromised') : t('network.secured')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/90 border border-matrix-green/30 p-3 rounded backdrop-blur-sm">
          <div className="text-xs text-matrix-green/70 mb-2">Legend:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-matrix-cyan bg-matrix-cyan/20 rounded-full"></div>
              <span className="text-matrix-cyan">{t('network.compromised')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-matrix-green bg-black rounded-full"></div>
              <span className="text-matrix-green">{t('network.secured')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-400">{t('network.currentNode')}</span>
            </div>
          </div>
        </div>

        {/* Network info overlay */}
        <div className="absolute top-4 right-4 bg-black/90 border border-matrix-green/30 p-2 rounded backdrop-blur-sm">
          <div className="text-xs text-matrix-green">
            <div>Nodes: {nodes.length}</div>
            <div>Compromised: {nodes.filter(n => n.compromised).length}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const visibleDevices = getVisibleDevices();

    if (visibleDevices.length <= 1) {
      return (
        <div className="text-center py-8 text-matrix-green/60">
          <div className="mb-4">
            <Wifi size={48} className="mx-auto mb-2 opacity-30" />
          </div>
          <p className="text-lg mb-2">{t('network.scanRequired')}</p>
          <p className="text-sm">{t('network.scanHint')}</p>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {visibleDevices.map((device) => (
          <div
            key={device.ip}
            className={`p-3 border rounded transition-all ${
              device.compromised
                ? 'border-matrix-cyan bg-matrix-cyan/10'
                : 'border-matrix-green/30 hover:border-matrix-green/60'
            } ${gameState.currentNode === device.ip ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getDeviceIcon(device.type, device.compromised)}
                <span className="font-mono text-sm">
                  {device.hostname} ({device.ip})
                </span>
                {gameState.currentNode === device.ip && (
                  <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                    CURRENT
                  </span>
                )}
              </div>
              {device.compromised ? (
                <Unlock size={16} className="text-matrix-cyan" />
              ) : (
                <Lock size={16} className="text-matrix-green" />
              )}
            </div>
            
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-matrix-green/70">{t('common.type')}:</span>
                <span>{device.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-matrix-green/70">OS:</span>
                <span>{device.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-matrix-green/70">{t('network.security')}:</span>
                <span className={getSecurityColor(device.security)}>{device.security}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-matrix-green/70">{t('common.status')}:</span>
                <span className={device.compromised ? 'text-matrix-cyan' : 'text-yellow-400'}>
                  {device.compromised ? t('network.compromised') : t('network.secured')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const visibleDevices = getVisibleDevices();

  return (
    <div className="h-full flex flex-col bg-black text-matrix-green">
      {/* Header */}
      <div className="p-3 border-b border-matrix-green/30 bg-black/90">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-matrix-cyan font-bold text-lg">{t('network.title')}</h2>
          
          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-matrix-green/70">{t('network.viewMode')}:</span>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border rounded transition-all ${
                viewMode === 'list'
                  ? 'border-matrix-cyan text-matrix-cyan bg-matrix-cyan/20'
                  : 'border-matrix-green/30 text-matrix-green hover:border-matrix-green'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('graphical')}
              className={`p-2 border rounded transition-all ${
                viewMode === 'graphical'
                  ? 'border-matrix-cyan text-matrix-cyan bg-matrix-cyan/20'
                  : 'border-matrix-green/30 text-matrix-green hover:border-matrix-green'
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-matrix-green/70">
          {t('network.currentNode')}: {gameState.currentNode} | {t('network.discovered')}: {visibleDevices.length}
        </div>
      </div>

      {/* Main content */}
      {viewMode === 'graphical' ? renderGraphicalView() : renderListView()}
    </div>
  );
};
