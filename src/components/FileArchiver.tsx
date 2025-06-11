import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { X, Save, Download, Trash2, Edit, FolderOpen, Play } from 'lucide-react';
import { FileSystemManager } from '../utils/FileSystemManager';

interface FileArchiverProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    content?: string;
    size?: number;
    permissions: string;
    encrypted?: boolean;
  } | null;
  filePath: string;
  deviceIp: string;
  onAction: (action: string) => void;
}

export const FileArchiver: React.FC<FileArchiverProps> = ({ 
  isOpen, 
  onClose, 
  file, 
  filePath, 
  deviceIp, 
  onAction 
}) => {
  const { gameState, updateGameState } = useGameState();
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [renameMode, setRenameMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [showExecuteWith, setShowExecuteWith] = useState(false);

  if (!isOpen || !file) return null;

  const fileSystemManager = FileSystemManager.getInstance();
  const isTextFile = file.name.endsWith('.txt') || file.name.endsWith('.log') || file.name.endsWith('.json');
  const isExecutable = file.name.endsWith('.exe') || file.name.endsWith('.py');
  const canEdit = isTextFile && !file.encrypted && file.permissions.includes('w');
  const canDelete = file.permissions.includes('w');
  const canRename = file.permissions.includes('w');
  const isRemoteFile = deviceIp !== 'localhost' && deviceIp !== '127.0.0.1';

  const handleEdit = () => {
    if (canEdit && file.content) {
      setEditContent(file.content);
      setEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    if (file && filePath) {
      const updatedFile = { 
        ...file, 
        content: editContent, 
        modified: new Date().toLocaleString(),
        type: 'file' as const
      };
      fileSystemManager.addFile(deviceIp, filePath, updatedFile);
      setEditMode(false);
      onAction('file_modified');
    }
  };

  const handleRename = () => {
    setNewName(file.name);
    setRenameMode(true);
  };

  const handleSaveRename = () => {
    if (newName && newName !== file.name && filePath) {
      // Remove old file and add with new name
      fileSystemManager.removeFile(deviceIp, filePath, file.name);
      const renamedFile = { 
        ...file, 
        name: newName,
        type: 'file' as const,
        modified: new Date().toLocaleString()
      };
      fileSystemManager.addFile(deviceIp, filePath, renamedFile);
      setRenameMode(false);
      onAction('file_renamed');
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (filePath) {
      const deleted = fileSystemManager.removeFile(deviceIp, filePath, file.name);
      if (deleted) {
        updateGameState({
          deletedFiles: [...(gameState.deletedFiles || []), `${deviceIp}:${filePath}/${file.name}`]
        });
        onAction('file_deleted');
      }
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleMove = () => {
    setNewPath(filePath);
    setMoveMode(true);
  };

  const handleSaveMove = () => {
    if (newPath && newPath !== filePath) {
      // Remove from old location
      fileSystemManager.removeFile(deviceIp, filePath, file.name);
      // Add to new location
      const movedFile = {
        ...file,
        type: 'file' as const,
        modified: new Date().toLocaleString()
      };
      fileSystemManager.addFile(deviceIp, newPath, movedFile);
      setMoveMode(false);
      onAction('file_moved');
    }
  };

  const handleExecuteWith = () => {
    if (isExecutable) {
      setShowExecuteWith(true);
    }
  };

  const executeWithTool = (tool: string) => {
    console.log(`Executing ${file.name} with ${tool}`);
    // Here you would implement the actual execution logic
    setShowExecuteWith(false);
    onAction('file_executed');
  };

  const handleDownload = () => {
    if (isRemoteFile && file.content) {
      // Download file to localhost
      const localPath = '/home/user/Downloads';
      fileSystemManager.addFile('127.0.0.1', localPath, {
        ...file,
        modified: new Date().toLocaleString(),
        type: 'file' as const
      });
      
      updateGameState({
        downloadedFiles: [...(gameState.downloadedFiles || []), file.name]
      });
      
      onAction('file_downloaded');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-matrix-green rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-matrix-green/30">
          <h3 className="text-matrix-cyan font-bold">File Archiver - {file.name}</h3>
          <button
            onClick={onClose}
            className="text-matrix-green hover:text-red-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* File Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-matrix-cyan">Name:</span>
              <span className="text-matrix-green ml-2">{file.name}</span>
            </div>
            <div>
              <span className="text-matrix-cyan">Size:</span>
              <span className="text-matrix-green ml-2">
                {file.size ? `${file.size} bytes` : 'Unknown'}
              </span>
            </div>
            <div>
              <span className="text-matrix-cyan">Permissions:</span>
              <span className="text-matrix-green ml-2">{file.permissions}</span>
            </div>
            <div>
              <span className="text-matrix-cyan">Location:</span>
              <span className="text-matrix-green ml-2">{deviceIp}:{filePath}</span>
            </div>
          </div>

          {/* Edit Mode */}
          {editMode && (
            <div className="space-y-3">
              <h4 className="text-matrix-cyan font-semibold">Edit File Content</h4>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-40 bg-black border border-matrix-green/30 text-matrix-green p-3 rounded font-mono text-sm resize-none focus:border-matrix-cyan focus:outline-none"
                placeholder="File content..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500 rounded hover:bg-red-500/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Rename Mode */}
          {renameMode && (
            <div className="space-y-3">
              <h4 className="text-matrix-cyan font-semibold">Rename File</h4>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-black border border-matrix-green/30 text-matrix-green p-3 rounded focus:border-matrix-cyan focus:outline-none"
                placeholder="New file name..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveRename}
                  className="px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => setRenameMode(false)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500 rounded hover:bg-red-500/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Move Mode */}
          {moveMode && (
            <div className="space-y-3">
              <h4 className="text-matrix-cyan font-semibold">Move File</h4>
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="w-full bg-black border border-matrix-green/30 text-matrix-green p-3 rounded focus:border-matrix-cyan focus:outline-none"
                placeholder="New path (e.g., /home/user/Documents)..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveMove}
                  className="px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors"
                >
                  Move
                </button>
                <button
                  onClick={() => setMoveMode(false)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500 rounded hover:bg-red-500/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Execute With Mode */}
          {showExecuteWith && (
            <div className="space-y-3">
              <h4 className="text-matrix-cyan font-semibold">Execute With Tool</h4>
              <div className="grid grid-cols-2 gap-2">
                {gameState.unlockedTools.filter(tool => tool.endsWith('.exe')).map(tool => (
                  <button
                    key={tool}
                    onClick={() => executeWithTool(tool)}
                    className="px-3 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors text-sm"
                  >
                    {tool}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowExecuteWith(false)}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500 rounded hover:bg-red-500/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="space-y-3 bg-red-500/10 border border-red-500/30 rounded p-4">
              <h4 className="text-red-400 font-semibold">¿Estás seguro de eliminar este archivo?</h4>
              <p className="text-red-300 text-sm">Esta acción no se puede deshacer.</p>
              <div className="flex gap-2">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500 rounded hover:bg-red-500/30 transition-colors"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* File Content Preview (when not editing) */}
          {!editMode && !renameMode && !moveMode && !showExecuteWith && !showDeleteConfirm && file.content && (
            <div className="space-y-3">
              <h4 className="text-matrix-cyan font-semibold">File Content</h4>
              <div className="bg-black border border-matrix-green/30 rounded p-3 max-h-40 overflow-y-auto">
                <pre className="text-matrix-green text-sm whitespace-pre-wrap font-mono">
                  {file.encrypted ? '*** ENCRYPTED FILE ***\nThis file requires decryption tools to view.' : file.content}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!editMode && !renameMode && !moveMode && !showExecuteWith && !showDeleteConfirm && (
          <div className="p-4 border-t border-matrix-green/30">
            <div className="grid grid-cols-2 gap-2">
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="px-3 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors flex items-center gap-2 justify-center text-sm"
                >
                  <Edit size={16} />
                  Editar
                </button>
              )}
              
              {canRename && (
                <button
                  onClick={handleRename}
                  className="px-3 py-2 bg-matrix-cyan/20 text-matrix-cyan border border-matrix-cyan rounded hover:bg-matrix-cyan/30 transition-colors flex items-center gap-2 justify-center text-sm"
                >
                  <Edit size={16} />
                  Renombrar
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500 rounded hover:bg-red-500/30 transition-colors flex items-center gap-2 justify-center text-sm"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              )}
              
              <button
                onClick={handleMove}
                className="px-3 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500 rounded hover:bg-yellow-500/30 transition-colors flex items-center gap-2 justify-center text-sm"
              >
                <FolderOpen size={16} />
                Mover
              </button>
              
              {isExecutable && (
                <button
                  onClick={handleExecuteWith}
                  className="px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500 rounded hover:bg-purple-500/30 transition-colors flex items-center gap-2 justify-center text-sm"
                >
                  <Play size={16} />
                  Ejecutar con
                </button>
              )}
              
              {isRemoteFile && (
                <button
                  onClick={handleDownload}
                  className="px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500 rounded hover:bg-blue-500/30 transition-colors flex items-center gap-2 justify-center text-sm"
                >
                  <Download size={16} />
                  Descargar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
