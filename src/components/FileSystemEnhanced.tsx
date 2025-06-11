
import React, { useState, useEffect } from 'react';
import { useGameStateEnhanced } from '../hooks/useGameStateEnhanced';
import { networkSystemEnhanced } from '../systems/NetworkSystemEnhanced';
import { gameCore } from '../core/GameCore';
import { FileArchiver } from './FileArchiver';
import { FolderOpen, File, Lock, Trash2, Edit, Download, RotateCcw } from 'lucide-react';

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  size: number;
  permissions: string;
  modified: string;
  encrypted?: boolean;
}

export const FileSystemEnhanced: React.FC = () => {
  const { gameState, updateGameState } = useGameStateEnhanced();
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [files, setFiles] = useState<FileSystemItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null);
  const [showArchiver, setShowArchiver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentNode = gameState.currentNode || '127.0.0.1';

  useEffect(() => {
    loadFiles();
    
    // Listen to GameCore events for real-time updates
    const handleFileSystemChange = (event: any) => {
      console.log('[FileSystemEnhanced] File system changed event:', event.data);
      if (!event.data || event.data.nodeIp === currentNode) {
        loadFiles();
      }
    };

    const handleFileDeleted = (event: any) => {
      console.log('[FileSystemEnhanced] File deleted event:', event.data);
      if (event.data.nodeIp === currentNode && event.data.path === currentPath) {
        loadFiles();
      }
    };

    gameCore.on('file_system_changed', handleFileSystemChange);
    gameCore.on('file_deleted', handleFileDeleted);

    return () => {
      gameCore.off('file_system_changed', handleFileSystemChange);
      gameCore.off('file_deleted', handleFileDeleted);
    };
  }, [currentNode, currentPath]);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const nodeFiles = networkSystemEnhanced.getFiles(currentNode, currentPath);
      console.log(`[FileSystemEnhanced] Loaded ${nodeFiles.length} files from ${currentNode}:${currentPath}`);
      setFiles(nodeFiles || []);
    } catch (error) {
      console.error('[FileSystemEnhanced] Error loading files:', error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileAction = (action: string, fileName?: string) => {
    console.log(`[FileSystemEnhanced] File action: ${action} on ${fileName}`);
    
    if (action === 'delete' && fileName) {
      console.log(`[FileSystemEnhanced] Attempting to delete: ${fileName} from ${currentNode}:${currentPath}`);
      
      const success = networkSystemEnhanced.deleteFile(currentNode, currentPath, fileName);
      console.log(`[FileSystemEnhanced] Delete result: ${success}`);
      
      if (success) {
        // Update game state with deleted file immediately
        const deletedFiles = gameState.deletedFiles || [];
        const deletedEntry = `${currentNode}:${currentPath}/${fileName}`;
        
        console.log(`[FileSystemEnhanced] Adding to deleted files: ${deletedEntry}`);
        updateGameState({
          deletedFiles: [...deletedFiles, deletedEntry]
        });
        
        // Notify GameCore for mission system
        gameCore.notifyFileDeleted(currentNode, currentPath, fileName);
        
        // Force immediate reload of files
        setTimeout(() => {
          loadFiles();
        }, 100);
      }
    } else if (action === 'download' && fileName) {
      const fileData = networkSystemEnhanced.downloadFile(currentNode, fileName);
      if (fileData) {
        const downloadedFiles = gameState.downloadedFiles || [];
        updateGameState({
          downloadedFiles: [...downloadedFiles, fileName]
        });
        
        // Notify GameCore
        gameCore.notifyFileDownloaded(fileName, currentNode);
      }
    }
    
    setShowArchiver(false);
    setSelectedFile(null);
  };

  const navigateToDirectory = (dirName: string) => {
    if (dirName === '..') {
      if (currentPath !== '/') {
        const pathParts = currentPath.split('/').filter(p => p);
        pathParts.pop();
        const newPath = '/' + pathParts.join('/');
        setCurrentPath(newPath === '/' ? '/' : newPath);
      }
    } else {
      const newPath = currentPath === '/' ? `/${dirName}` : `${currentPath}/${dirName}`;
      setCurrentPath(newPath);
    }
  };

  const openFile = (file: FileSystemItem) => {
    if (file.type === 'directory') {
      navigateToDirectory(file.name);
    } else {
      setSelectedFile(file);
      setShowArchiver(true);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileSystemItem) => {
    e.preventDefault();
    setSelectedFile(file);
    setShowArchiver(true);
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${Math.round(size / (1024 * 1024))} MB`;
  };

  const getFileIcon = (file: FileSystemItem) => {
    if (file.type === 'directory') {
      return <FolderOpen className="text-matrix-cyan" size={20} />;
    }
    if (file.encrypted) {
      return <Lock className="text-red-400" size={20} />;
    }
    return <File className="text-matrix-green" size={20} />;
  };

  const canDelete = (file: FileSystemItem) => {
    return file.permissions.includes('w') && file.type === 'file';
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-slate-900 to-black text-matrix-green border border-matrix-green/30 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-matrix-green/10 to-matrix-cyan/10 p-3 border-b border-matrix-green/30">
        <div className="flex items-center justify-between">
          <h3 className="text-matrix-cyan font-bold">File System Explorer</h3>
          <div className="text-matrix-green/70 text-xs">
            {currentNode}:{currentPath}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-black/50 p-2 border-b border-matrix-green/20 flex items-center gap-2">
        <button
          onClick={() => navigateToDirectory('..')}
          disabled={currentPath === '/'}
          className="px-3 py-1 bg-matrix-green/20 text-matrix-green border border-matrix-green/50 rounded hover:bg-matrix-green/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          ← Back
        </button>
        <span className="text-matrix-cyan text-sm font-mono">{currentPath}</span>
        <button
          onClick={loadFiles}
          disabled={isLoading}
          className="ml-auto px-3 py-1 bg-matrix-cyan/20 text-matrix-cyan border border-matrix-cyan/50 rounded hover:bg-matrix-cyan/30 text-sm flex items-center gap-2"
        >
          <RotateCcw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center text-matrix-green/60 mt-8">
            <RotateCcw size={32} className="mx-auto mb-4 animate-spin" />
            <p>Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center text-matrix-green/60 mt-8">
            <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>Directory is empty or access denied</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                onClick={() => openFile(file)}
                onContextMenu={(e) => handleContextMenu(e, file)}
                className="flex items-center gap-3 p-3 bg-black/30 border border-matrix-green/20 rounded hover:bg-matrix-green/10 hover:border-matrix-green/40 cursor-pointer transition-all duration-200 group"
              >
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-matrix-green/60">
                    {file.type === 'file' ? formatFileSize(file.size) : 'Directory'} • {file.modified}
                  </div>
                </div>
                <div className="text-xs text-matrix-green/60 font-mono">
                  {file.permissions}
                </div>
                {file.type === 'file' && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.permissions.includes('w') && (
                      <Edit size={16} className="text-matrix-cyan/60" />
                    )}
                    {canDelete(file) && (
                      <Trash2 
                        size={16} 
                        className="text-red-400/60 hover:text-red-400 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`[FileSystemEnhanced] Delete button clicked for: ${file.name}`);
                          handleFileAction('delete', file.name);
                        }}
                      />
                    )}
                    <Download 
                      size={16} 
                      className="text-matrix-green/60 hover:text-matrix-green cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('download', file.name);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Archiver Modal */}
      <FileArchiver
        isOpen={showArchiver}
        onClose={() => {
          setShowArchiver(false);
          setSelectedFile(null);
        }}
        file={selectedFile}
        filePath={currentPath}
        deviceIp={currentNode}
        onAction={handleFileAction}
      />
    </div>
  );
};

export default FileSystemEnhanced;
