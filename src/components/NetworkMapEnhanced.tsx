
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useGameState } from '../hooks/useGameState';
import { Network, Zap, Shield, AlertTriangle } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  connections: string[];
  x: number;
  y: number;
  security: 'low' | 'medium' | 'high';
  compromised: boolean;
}

interface NetworkMapEnhancedProps {
  nodes: NetworkNode[];
  onConnect: (nodeId: string) => void;
}

export const NetworkMapEnhanced: React.FC<NetworkMapEnhancedProps> = ({
  nodes,
  onConnect
}) => {
  const { gameState } = useGameState();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeColor = (node: NetworkNode) => {
    if (node.compromised) return '#00FF41';
    if (node.id === gameState.currentNode) return '#00FFFF';
    switch (node.security) {
      case 'low': return '#FFFF00';
      case 'medium': return '#FFA500';
      case 'high': return '#FF0000';
      default: return '#FFFFFF';
    }
  };

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'low': return <Shield size={16} className="text-yellow-400" />;
      case 'medium': return <AlertTriangle size={16} className="text-orange-400" />;
      case 'high': return <Zap size={16} className="text-red-400" />;
      default: return <Shield size={16} className="text-gray-400" />;
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const handleConnect = () => {
    if (selectedNode) {
      onConnect(selectedNode);
      setSelectedNode(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-matrix-green font-mono">
      <div className="p-4 border-b border-matrix-green/30">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Network size={20} />
          Network Map
        </h2>
        <p className="text-sm text-matrix-green/70 mt-1">
          Click nodes to select, then connect
        </p>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          style={{ background: 'radial-gradient(circle, rgba(0,255,65,0.05) 0%, rgba(0,0,0,0.95) 100%)' }}
        >
          {/* Render connections */}
          {nodes.map(node =>
            node.connections.map(connectionId => {
              const targetNode = nodes.find(n => n.id === connectionId);
              if (!targetNode) return null;
              
              return (
                <line
                  key={`${node.id}-${connectionId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={node.compromised && targetNode.compromised ? '#00FF41' : '#00FF4150'}
                  strokeWidth="2"
                  strokeDasharray={node.compromised && targetNode.compromised ? '0' : '5,5'}
                />
              );
            })
          )}

          {/* Render nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={hoveredNode === node.id ? 25 : 20}
                fill={getNodeColor(node)}
                stroke={selectedNode === node.id ? '#00FFFF' : 'transparent'}
                strokeWidth="3"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                fill={getNodeColor(node)}
                fontSize="12"
                className="font-mono font-bold pointer-events-none"
              >
                {node.name}
              </text>
              {node.id === gameState.currentNode && (
                <text
                  x={node.x}
                  y={node.y + 50}
                  textAnchor="middle"
                  fill="#00FFFF"
                  fontSize="10"
                  className="font-mono pointer-events-none"
                >
                  [CURRENT]
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Node details panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-black/90 border border-matrix-green/50 rounded-lg p-4 min-w-[200px]">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              return (
                <div>
                  <h3 className="font-bold text-matrix-cyan mb-2">{node.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getSecurityIcon(node.security)}
                      <span className="text-sm">Security: {node.security}</span>
                    </div>
                    <div className="text-sm">
                      Status: {node.compromised ? 
                        <span className="text-matrix-green">Compromised</span> : 
                        <span className="text-red-400">Secured</span>
                      }
                    </div>
                    <div className="text-sm">
                      Connections: {node.connections.length}
                    </div>
                  </div>
                  
                  {node.id !== gameState.currentNode && (
                    <Button
                      onClick={handleConnect}
                      className="w-full mt-3 bg-matrix-green/20 border-matrix-green text-matrix-green hover:bg-matrix-green/30"
                      variant="outline"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
