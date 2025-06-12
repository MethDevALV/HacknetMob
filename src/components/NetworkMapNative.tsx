
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useGameState } from '../hooks/useGameStateNative';
import { NetworkNode } from '../types/CoreTypes';
import { cyberpunkStyles } from '../styles/cyberpunkTheme';

const NetworkMapNative: React.FC = () => {
  const { gameState } = useGameState();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const mapWidth = 400;
  const mapHeight = 300;

  const getNodeColor = (node: NetworkNode) => {
    if (node.compromised) return '#00FF41';
    if (node.ip === gameState.currentNode) return '#00FFFF';
    switch (node.security) {
      case 'low': return '#FFFF00';
      case 'medium': return '#FFA500';
      case 'high': return '#FF0000';
      default: return '#FFFFFF';
    }
  };

  const redistributeNodes = (nodes: NetworkNode[]): NetworkNode[] => {
    const padding = 60;

    return nodes.map((node, index) => {
      const cols = Math.ceil(Math.sqrt(nodes.length));
      const rows = Math.ceil(nodes.length / cols);
      
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const cellWidth = (mapWidth - 2 * padding) / cols;
      const cellHeight = (mapHeight - 2 * padding) / rows;
      
      const randomX = (Math.random() - 0.5) * (cellWidth * 0.3);
      const randomY = (Math.random() - 0.5) * (cellHeight * 0.3);
      
      return {
        ...node,
        x: padding + col * cellWidth + cellWidth / 2 + randomX,
        y: padding + row * cellHeight + cellHeight / 2 + randomY
      };
    });
  };

  const handleNodePress = (nodeIp: string) => {
    setSelectedNode(selectedNode === nodeIp ? null : nodeIp);
  };

  const discoveredNodes = gameState.discoveredDevices || [];
  const redistributedNodes = redistributeNodes(discoveredNodes);

  return (
    <div className="h-full bg-black flex flex-col" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ ...cyberpunkStyles.glowBox, padding: '12px', marginBottom: '16px', borderRadius: '8px' }}>
        <div style={{ ...cyberpunkStyles.systemText, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          NETWORK TOPOLOGY
        </div>
        <div style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
          Click nodes to inspect • Use terminal to discover and compromise
        </div>
      </div>

      {/* Legend */}
      <div style={{ ...cyberpunkStyles.glowBox, padding: '8px', marginBottom: '16px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#00FF41', marginRight: '4px' }} />
            <span style={{ ...cyberpunkStyles.matrixText, fontSize: '10px' }}>Compromised</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#FFFF00', marginRight: '4px' }} />
            <span style={{ ...cyberpunkStyles.matrixText, fontSize: '10px' }}>Low Security</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#FFA500', marginRight: '4px' }} />
            <span style={{ ...cyberpunkStyles.matrixText, fontSize: '10px' }}>Medium Security</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#FF0000', marginRight: '4px' }} />
            <span style={{ ...cyberpunkStyles.matrixText, fontSize: '10px' }}>High Security</span>
          </div>
        </div>
      </div>

      {/* Network Map */}
      {discoveredNodes.length > 0 ? (
        <div style={{ ...cyberpunkStyles.glowBox, flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ flex: 1, minHeight: `${mapHeight}px` }}>
            <svg width={mapWidth} height={mapHeight} style={{ backgroundColor: 'rgba(0,0,0,0.8)', width: '100%' }}>
              {/* Render connections */}
              {redistributedNodes.map(node =>
                node.connections?.map(connectionId => {
                  const targetNode = redistributedNodes.find(n => n.ip === connectionId);
                  if (!targetNode) return null;
                  
                  return (
                    <line
                      key={`${node.ip}-${connectionId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={node.compromised && targetNode.compromised ? '#00FF41' : '#00FF4130'}
                      strokeWidth="2"
                      strokeDasharray={node.compromised && targetNode.compromised ? '0' : '5,5'}
                    />
                  );
                })
              )}

              {/* Render nodes */}
              {redistributedNodes.map(node => (
                <g key={node.ip}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={selectedNode === node.ip ? 25 : 20}
                    fill={getNodeColor(node)}
                    stroke={selectedNode === node.ip ? '#FFFFFF' : 'transparent'}
                    strokeWidth="3"
                    onClick={() => handleNodePress(node.ip)}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 35}
                    textAnchor="middle"
                    fill={getNodeColor(node)}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.hostname}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 48}
                    textAnchor="middle"
                    fill={getNodeColor(node)}
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {node.ip}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      ) : (
        <div style={{ ...cyberpunkStyles.glowBox, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
          <WifiOff size={64} color="#00ff4150" />
          <div style={{ ...cyberpunkStyles.matrixText, fontSize: '16px', marginTop: '16px', textAlign: 'center' }}>
            No devices discovered
          </div>
          <div style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', marginTop: '8px', textAlign: 'center', opacity: 0.7 }}>
            Use 'scan' command in terminal to discover network devices
          </div>
        </div>
      )}

      {/* Node Details */}
      {selectedNode && (
        <div style={{ ...cyberpunkStyles.glowBox, marginTop: '16px', padding: '12px', borderRadius: '8px' }}>
          {(() => {
            const node = discoveredNodes.find(n => n.ip === selectedNode);
            if (!node) return null;
            
            return (
              <div>
                <div style={{ ...cyberpunkStyles.systemText, fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {node.hostname}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>IP Address:</span>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>{node.ip}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>Type:</span>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>{node.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>OS:</span>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>{node.os}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>Security:</span>
                  <span style={{
                    fontSize: '12px',
                    color: node.security === 'low' ? '#ffff00' : 
                           node.security === 'medium' ? '#FFA500' : '#ff0040'
                  }}>
                    {node.security.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>Status:</span>
                  <span style={node.compromised ? cyberpunkStyles.successText : cyberpunkStyles.errorText}>
                    {node.compromised ? 'COMPROMISED' : 'SECURED'}
                  </span>
                </div>
                
                <button
                  onClick={() => setSelectedNode(null)}
                  style={{
                    ...cyberpunkStyles.cyberpunkButton,
                    padding: '8px',
                    borderRadius: '4px',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', fontWeight: 'bold' }}>
                    CLOSE
                  </span>
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default NetworkMapNative;
