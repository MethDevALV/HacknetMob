
import React, { useState, useEffect } from 'react';
import { useGameStateEnhanced } from '../hooks/useGameStateEnhanced';
import { networkSystemEnhanced } from '../systems/NetworkSystemEnhanced';
import { gameCore } from '../core/GameCore';
import { Wifi, Shield, Lock, Unlock, Server, Monitor, HardDrive, FolderOpen, File } from 'lucide-react';

export const NetworkMap: React.FC = () => {
  const { gameState, updateGameState } = useGameStateEnhanced();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [discoveredNodes, setDiscoveredNodes] = useState<any[]>([]);

  useEffect(() => {
    // Load discovered nodes from the network system
    const nodes = networkSystemEnhanced.getDiscoveredNodes();
    console.log('[NetworkMap] Loaded discovered nodes:', nodes);
    setDiscoveredNodes(nodes);

    // Listen to GameCore events for real-time updates
    const handleScanCompleted = (event: any) => {
      console.log('[NetworkMap] Scan completed event received:', event.data);
      const updatedNodes = networkSystemEnhanced.getDiscoveredNodes();
      setDiscoveredNodes(updatedNodes);
    };

    const handleNetworkUpdated = () => {
      console.log('[NetworkMap] Network updated - refreshing nodes');
      const updatedNodes = networkSystemEnhanced.getDiscoveredNodes();
      setDiscoveredNodes(updatedNodes);
    };

    const handleNodeCompromised = (event: any) => {
      console.log('[NetworkMap] Node compromised:', event.data);
      const updatedNodes = networkSystemEnhanced.getDiscoveredNodes();
      setDiscoveredNodes(updatedNodes);
    };

    gameCore.on('scan_completed', handleScanCompleted);
    gameCore.on('network_updated', handleNetworkUpdated);
    gameCore.on('node_compromised', handleNodeCompromised);

    return () => {
      gameCore.off('scan_completed', handleScanCompleted);
      gameCore.off('network_updated', handleNetworkUpdated);
      gameCore.off('node_compromised', handleNodeCompromised);
    };
  }, []);

  const getNodeIcon = (node: any) => {
    if (node.type === 'Server') return <Server className="text-matrix-cyan" size={24} />;
    if (node.type === 'Workstation') return <Monitor className="text-matrix-green" size={24} />;
    return <HardDrive className="text-matrix-green" size={24} />;
  };

  const getSecurityIcon = (node: any) => {
    if (node.compromised) return <Unlock className="text-green-400" size={16} />;
    if (node.security === 'high') return <Shield className="text-red-400" size={16} />;
    if (node.security === 'medium') return <Lock className="text-yellow-400" size={16} />;
    return <Lock className="text-green-400" size={16} />;
  };

  const getNodeFiles = (nodeIp: string) => {
    const commonPaths = ['/home/user', '/home/admin', '/etc', '/bin'];
    const files: any[] = [];
    
    for (const path of commonPaths) {
      const pathFiles = networkSystemEnhanced.getFiles(nodeIp, path);
      files.push(...pathFiles.map(f => ({ ...f, path })));
    }
    
    return files.slice(0, 10); // Limit to first 10 files
  };

  const selectedNodeData = selectedNode ? discoveredNodes.find(n => n.ip === selectedNode) : null;
  const selectedNodeFiles = selectedNode ? getNodeFiles(selectedNode) : [];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-black text-matrix-green border border-matrix-green/30 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-matrix-green/10 to-matrix-cyan/10 p-3 border-b border-matrix-green/30">
        <div className="flex items-center justify-between">
          <h3 className="text-matrix-cyan font-bold">Network Map</h3>
          <div className="flex items-center gap-2 text-matrix-green/70 text-sm">
            <Wifi size={16} />
            <span>{discoveredNodes.length} devices discovered</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Node List */}
        <div className="w-1/2 border-r border-matrix-green/30 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-matrix-cyan font-semibold mb-3">Discovered Devices</h4>
            <div className="space-y-2">
              {discoveredNodes.length === 0 ? (
                <div className="text-center text-matrix-green/60 py-8">
                  <Wifi size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No devices discovered</p>
                  <p className="text-sm">Use 'scan' command in terminal</p>
                </div>
              ) : (
                discoveredNodes.map((node) => (
                  <div
                    key={node.ip}
                    onClick={() => setSelectedNode(node.ip === selectedNode ? null : node.ip)}
                    className={`p-3 border rounded cursor-pointer transition-all duration-200 ${
                      selectedNode === node.ip
                        ? 'border-matrix-cyan bg-matrix-cyan/10'
                        : 'border-matrix-green/30 hover:border-matrix-green/50 hover:bg-matrix-green/5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getNodeIcon(node)}
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-sm text-matrix-cyan">
                            {node.hostname}
                          </div>
                          <div className="font-mono text-xs text-matrix-green/70">
                            {node.ip}
                          </div>
                          <div className="text-xs text-matrix-green/60">
                            {node.type} • {node.os}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getSecurityIcon(node)}
                        <span className="text-xs text-matrix-green/60">
                          {node.security}
                        </span>
                      </div>
                    </div>
                    
                    {/* Port Status */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(node.ports || []).map((port: any, index: number) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded font-mono ${
                            port.cracked
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'bg-red-500/20 text-red-400 border border-red-500/50'
                          }`}
                        >
                          {port.number}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Node Details */}
        <div className="w-1/2 overflow-y-auto">
          <div className="p-4">
            {selectedNodeData ? (
              <>
                <h4 className="text-matrix-cyan font-semibold mb-3">
                  {selectedNodeData.hostname} Details
                </h4>
                
                {/* Basic Info */}
                <div className="bg-black/30 border border-matrix-green/20 rounded p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-matrix-green/60">IP:</span>
                      <span className="ml-2 font-mono text-matrix-cyan">{selectedNodeData.ip}</span>
                    </div>
                    <div>
                      <span className="text-matrix-green/60">OS:</span>
                      <span className="ml-2">{selectedNodeData.os}</span>
                    </div>
                    <div>
                      <span className="text-matrix-green/60">Type:</span>
                      <span className="ml-2">{selectedNodeData.type}</span>
                    </div>
                    <div>
                      <span className="text-matrix-green/60">Security:</span>
                      <span className="ml-2">{selectedNodeData.security}</span>
                    </div>
                  </div>
                </div>

                {/* Port Details */}
                <div className="bg-black/30 border border-matrix-green/20 rounded p-3 mb-4">
                  <h5 className="text-matrix-cyan font-semibold mb-2">Ports</h5>
                  <div className="space-y-1">
                    {(selectedNodeData.ports || []).map((port: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-mono">{port.number}/{port.service}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          port.cracked
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {port.cracked ? 'CRACKED' : 'SECURED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Files (if compromised) */}
                {selectedNodeData.compromised && (
                  <div className="bg-black/30 border border-matrix-green/20 rounded p-3">
                    <h5 className="text-matrix-cyan font-semibold mb-2 flex items-center gap-2">
                      <FolderOpen size={16} />
                      Files ({selectedNodeFiles.length})
                    </h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {selectedNodeFiles.length === 0 ? (
                        <p className="text-matrix-green/60 text-sm">No files accessible</p>
                      ) : (
                        selectedNodeFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm py-1">
                            <File size={14} className="text-matrix-green/60" />
                            <span className="font-mono text-matrix-green">{file.name}</span>
                            <span className="text-matrix-green/60 text-xs">
                              ({file.path})
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-matrix-green/60 py-8">
                <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a device to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;
