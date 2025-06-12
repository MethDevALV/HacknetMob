import React, { useState } from 'react';
import { Plus, Save, Upload, Trash2, Settings } from 'lucide-react';

interface NodeTemplate {
  id: string;
  name: string;
  ip: string;
  hostname: string;
  type: 'router' | 'server' | 'workstation' | 'database' | 'mainframe' | 'personal';
  os: string;
  security: 'low' | 'medium' | 'high';
  x: number;
  y: number;
  ports: number[];
  files: string[];
}

export const LevelEditor: React.FC = () => {
  const [nodes, setNodes] = useState<NodeTemplate[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const nodeTypes = ['router', 'server', 'workstation', 'database', 'mainframe', 'personal'];
  const securityLevels = ['low', 'medium', 'high'];
  const operatingSystems = [
    'Linux Ubuntu 20.04',
    'Windows 10',
    'Windows Server 2019',
    'macOS Big Sur',
    'RouterOS',
    'FreeBSD 13.0'
  ];

  const addNode = () => {
    const newNode: NodeTemplate = {
      id: `node-${Date.now()}`,
      name: 'New Node',
      ip: '192.168.1.' + (100 + nodes.length),
      hostname: `node-${nodes.length + 1}`,
      type: 'server',
      os: 'Linux Ubuntu 20.04',
      security: 'medium',
      x: Math.random() * 400,
      y: Math.random() * 300,
      ports: [22, 80],
      files: []
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
    setIsEditing(true);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      setIsEditing(false);
    }
  };

  const updateNode = (updatedNode: NodeTemplate) => {
    setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n));
    setSelectedNode(updatedNode);
  };

  const saveLevel = () => {
    const levelData = {
      name: `Level-${Date.now()}`,
      nodes: nodes,
      createdAt: new Date().toISOString()
    };
    
    const data = JSON.stringify(levelData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hacknet-level-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadLevel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const levelData = JSON.parse(e.target?.result as string);
            setNodes(levelData.nodes || []);
            setSelectedNode(null);
            setIsEditing(false);
          } catch (error) {
            alert('Invalid level file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex">
      {/* Node List */}
      <div className="w-1/3 bg-theme-surface border-r border-theme-border">
        {/* Header */}
        <div className="p-4 border-b border-theme-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Network Nodes</h3>
            <div className="flex gap-1">
              <button
                onClick={addNode}
                className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={saveLevel}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
              </button>
              <button
                onClick={loadLevel}
                className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                <Upload size={16} />
              </button>
            </div>
          </div>
          <div className="text-sm text-theme-textSecondary">
            {nodes.length} nodes in level
          </div>
        </div>

        {/* Nodes */}
        <div className="overflow-y-auto">
          {nodes.map(node => (
            <div
              key={node.id}
              onClick={() => {
                setSelectedNode(node);
                setIsEditing(false);
              }}
              className={`p-3 border-b border-theme-border cursor-pointer hover:bg-theme-background/50 transition-colors ${
                selectedNode?.id === node.id ? 'bg-theme-primary/10 border-l-4 border-l-theme-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{node.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="text-xs text-theme-textSecondary">
                {node.ip} | {node.type} | {node.security}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNode ? (
          <>
            {/* Editor Header */}
            <div className="p-4 bg-theme-surface border-b border-theme-border">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">
                  {isEditing ? 'Edit Node' : 'Node Details'}
                </h3>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Settings size={14} />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={selectedNode.name}
                      onChange={(e) => updateNode({ ...selectedNode, name: e.target.value })}
                      className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">IP Address</label>
                    <input
                      type="text"
                      value={selectedNode.ip}
                      onChange={(e) => updateNode({ ...selectedNode, ip: e.target.value })}
                      className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Hostname</label>
                    <input
                      type="text"
                      value={selectedNode.hostname}
                      onChange={(e) => updateNode({ ...selectedNode, hostname: e.target.value })}
                      className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={selectedNode.type}
                      onChange={(e) => updateNode({ ...selectedNode, type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                    >
                      {nodeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Operating System</label>
                    <select
                      value={selectedNode.os}
                      onChange={(e) => updateNode({ ...selectedNode, os: e.target.value })}
                      className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                    >
                      {operatingSystems.map(os => (
                        <option key={os} value={os}>{os}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Security Level</label>
                    <select
                      value={selectedNode.security}
                      onChange={(e) => updateNode({ ...selectedNode, security: e.target.value as any })}
                      className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                    >
                      {securityLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">X Position</label>
                      <input
                        type="number"
                        value={selectedNode.x}
                        onChange={(e) => updateNode({ ...selectedNode, x: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Y Position</label>
                      <input
                        type="number"
                        value={selectedNode.y}
                        onChange={(e) => updateNode({ ...selectedNode, y: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Open Ports (comma-separated)</label>
                    <input
                      type="text"
                      value={selectedNode.ports.join(', ')}
                      onChange={(e) => {
                        const ports = e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
                        updateNode({ ...selectedNode, ports });
                      }}
                      placeholder="22, 80, 443"
                      className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:border-theme-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-theme-textSecondary">Name:</span>
                      <p className="font-medium">{selectedNode.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-theme-textSecondary">IP:</span>
                      <p className="font-medium font-mono">{selectedNode.ip}</p>
                    </div>
                    <div>
                      <span className="text-sm text-theme-textSecondary">Type:</span>
                      <p className="font-medium">{selectedNode.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-theme-textSecondary">Security:</span>
                      <p className="font-medium">{selectedNode.security}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-theme-textSecondary">Operating System:</span>
                    <p className="font-medium">{selectedNode.os}</p>
                  </div>

                  <div>
                    <span className="text-sm text-theme-textSecondary">Position:</span>
                    <p className="font-medium">({selectedNode.x}, {selectedNode.y})</p>
                  </div>

                  <div>
                    <span className="text-sm text-theme-textSecondary">Open Ports:</span>
                    <p className="font-medium font-mono">{selectedNode.ports.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-theme-textSecondary">
            <div className="text-center">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a node to view or edit its properties</p>
              <p className="text-sm mt-2">Or click the + button to add a new node</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
