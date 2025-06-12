
import React, { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { NetworkNode } from '../types/CoreTypes';
import { Monitor, Server, Wifi, Smartphone, Shield } from 'lucide-react';

interface NetworkMapDualProps {
  onNodeConnect: (nodeIp: string) => void;
}

const NetworkMapDual: React.FC<NetworkMapDualProps> = ({ onNodeConnect }) => {
  const { gameState } = useGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'router': return Wifi;
      case 'device': return Smartphone;
      case 'workstation': 
      default: return Monitor;
    }
  };

  const getSecurityColor = (security: string, compromised: boolean) => {
    if (compromised) return '#00ff41';
    switch (security) {
      case 'low': return '#ffff00';
      case 'medium': return '#ff8c00';
      case 'high': return '#ff0000';
      default: return '#ffffff';
    }
  };

  const redistributeNodes = (nodes: NetworkNode[]): NetworkNode[] => {
    const canvas = canvasRef.current;
    if (!canvas) return nodes;

    const { width, height } = canvas;
    const padding = 80;
    const minDistance = 120; // Minimum distance between nodes

    return nodes.map((node, index) => {
      // Create a more distributed layout
      const cols = Math.ceil(Math.sqrt(nodes.length));
      const rows = Math.ceil(nodes.length / cols);
      
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const cellWidth = (width - 2 * padding) / cols;
      const cellHeight = (height - 2 * padding) / rows;
      
      // Add some randomness to avoid perfect grid
      const randomX = (Math.random() - 0.5) * (cellWidth * 0.3);
      const randomY = (Math.random() - 0.5) * (cellHeight * 0.3);
      
      return {
        ...node,
        x: padding + col * cellWidth + cellWidth / 2 + randomX,
        y: padding + row * cellHeight + cellHeight / 2 + randomY
      };
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const discoveredNodes = gameState.discoveredDevices || [];
    if (discoveredNodes.length === 0) return;

    // Redistribute nodes for better spacing
    const redistributedNodes = redistributeNodes(discoveredNodes);

    // Draw connections first (so they appear behind nodes)
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 1;
    redistributedNodes.forEach(node => {
      if (node.connections) {
        node.connections.forEach(connectedIp => {
          const connectedNode = redistributedNodes.find(n => n.ip === connectedIp);
          if (connectedNode && connectedNode.discovered) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
          }
        });
      }
    });

    // Draw nodes
    redistributedNodes.forEach(node => {
      const color = getSecurityColor(node.security, node.compromised);
      const isSelected = selectedNode === node.ip;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isSelected ? 25 : 20, 0, 2 * Math.PI);
      ctx.fillStyle = node.compromised ? '#00ff41' : color;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.hostname, node.x, node.y - 35);
      ctx.fillText(node.ip, node.x, node.y + 45);

      // Security indicator
      if (!node.compromised) {
        ctx.beginPath();
        ctx.arc(node.x + 15, node.y - 15, 8, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

  }, [gameState.discoveredDevices, selectedNode]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const discoveredNodes = gameState.discoveredDevices || [];
    const redistributedNodes = redistributeNodes(discoveredNodes);

    // Check if click is on a node
    const clickedNode = redistributedNodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 25;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.ip);
      if (clickedNode.compromised) {
        onNodeConnect(clickedNode.ip);
      }
    } else {
      setSelectedNode(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/90 border border-green-400/30 rounded-lg">
      {/* Header */}
      <div className="p-3 border-b border-green-400/30 bg-gradient-to-r from-black to-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="text-cyan-400 font-bold text-lg font-mono">NETWORK MAP</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-400">Compromised</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-400">Low Security</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-red-400">High Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
        />
        
        {selectedNode && (
          <div className="absolute top-4 left-4 bg-gray-900/90 border border-green-400/50 rounded-lg p-3 max-w-64">
            {(() => {
              const node = gameState.discoveredDevices?.find(n => n.ip === selectedNode);
              if (!node) return null;
              
              return (
                <div className="text-sm">
                  <div className="text-cyan-400 font-bold mb-2">{node.hostname}</div>
                  <div className="space-y-1 text-green-400/80">
                    <div>IP: {node.ip}</div>
                    <div>Type: {node.type}</div>
                    <div>OS: {node.os}</div>
                    <div>Security: <span className={`${
                      node.security === 'low' ? 'text-yellow-400' :
                      node.security === 'medium' ? 'text-orange-400' : 'text-red-400'
                    }`}>{node.security.toUpperCase()}</span></div>
                    <div>Status: <span className={node.compromised ? 'text-green-400' : 'text-red-400'}>
                      {node.compromised ? 'COMPROMISED' : 'SECURED'}
                    </span></div>
                  </div>
                  {node.compromised && (
                    <button
                      onClick={() => onNodeConnect(node.ip)}
                      className="mt-2 w-full px-3 py-1 bg-green-400/20 border border-green-400 rounded text-green-400 hover:bg-green-400/30 transition-colors text-xs"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-2 border-t border-green-400/30 bg-black/50">
        <div className="text-xs text-green-400/60 text-center">
          Click nodes to select • Use scan command to discover devices • Compromise nodes to connect
        </div>
      </div>
    </div>
  );
};

export default NetworkMapDual;
