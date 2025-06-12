import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, Download, Trash2, Eye, Settings, ArrowLeft, Home } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { networkSystemEnhanced } from '../systems/NetworkSystemEnhanced';
import { hackNetEngine } from '../core/HackNetEngine';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size: number;
  permissions: string;
  content?: string;
  encrypted?: boolean;
  modified?: string;
  path?: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  item: FileItem | null;
}

export const FileSystemEnhanced: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    item: null
  });
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [lastTap, setLastTap] = useState<{ time: number; item: string }>({ time: 0, item: '' });
  const [loading, setLoading] = useState(false);
  
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const DOUBLE_TAP_DELAY = 300; // ms

  useEffect(() => {
    loadFiles();
  }, [gameState.currentNode, gameState.currentDirectory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ visible: false, x: 0, y: 0, item: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    
    try {
      // Use the command system to list files
      const result = await hackNetEngine.executeCommand('ls');
      console.log('[FileSystemEnhanced] ls result:', result);
      
      // Parse the ls output to create file objects
      const fileList: FileItem[] = [];
      
      // Add parent directory option if not at root
      if (gameState.currentDirectory !== '/' && gameState.currentDirectory !== '/home/user') {
        fileList.push({
          name: '..',
          type: 'directory',
          size: 0,
          permissions: 'drwxr-xr-x',
          modified: '',
        });
      }

      // Parse each line of output (skip headers and empty lines)
      result.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('total') && !trimmed.includes('permissions')) {
          // Try to parse a typical ls -la output format
          const parts = trimmed.split(/\s+/);
          if (parts.length >= 4) {
            const permissions = parts[0];
            const size = parseInt(parts[4]) || 0;
            const name = parts.slice(8).join(' ') || parts[parts.length - 1];
            
            if (name && name !== '.' && name !== '..') {
              fileList.push({
                name,
                type: permissions.startsWith('d') ? 'directory' : 'file',
                size,
                permissions,
                modified: `${parts[5]} ${parts[6]} ${parts[7]}`,
              });
            }
          } else if (trimmed.length > 0) {
            // Simple filename without details
            fileList.push({
              name: trimmed,
              type: trimmed.includes('.') ? 'file' : 'directory',
              size: 0,
              permissions: 'rw-r--r--',
              modified: new Date().toLocaleDateString(),
            });
          }
        }
      });

      // If no files found through ls, try to get from network system
      if (fileList.length === 0) {
        const systemFiles = networkSystemEnhanced.getFiles(gameState.currentNode, gameState.currentDirectory);
        systemFiles.forEach(file => {
          fileList.push({
            name: file.name,
            type: file.type,
            size: file.size,
            permissions: file.permissions,
            content: file.content,
            encrypted: file.encrypted,
            modified: file.modified || file.lastModified?.toLocaleDateString(),
          });
        });
      }

      setFiles(fileList);
      console.log('[FileSystemEnhanced] Loaded files:', fileList);
      
    } catch (error) {
      console.error('[FileSystemEnhanced] Error loading files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: FileItem, event: React.MouseEvent) => {
    event.preventDefault();
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTap.time;
    
    // Check for double tap
    if (lastTap.item === item.name && timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // Double tap - open item
      handleDoubleClick(item);
      setLastTap({ time: 0, item: '' }); // Reset
      return;
    }
    
    // Single tap - show context menu after delay
    setTimeout(() => {
      if (Date.now() - currentTime >= DOUBLE_TAP_DELAY) {
        showContextMenu(item, event);
      }
    }, DOUBLE_TAP_DELAY);
    
    setLastTap({ time: currentTime, item: item.name });
    setSelectedFile(item.name);
  };

  const handleDoubleClick = async (item: FileItem) => {
    if (item.type === 'directory') {
      if (item.name === '..') {
        navigateUp();
      } else {
        navigateToDirectory(item.name);
      }
    } else {
      await openFile(item);
    }
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const showContextMenu = (item: FileItem, event: React.MouseEvent) => {
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      item
    });
  };

  const navigateToDirectory = async (dirName: string) => {
    const result = await hackNetEngine.executeCommand(`cd ${dirName}`);
    console.log('[FileSystemEnhanced] cd result:', result);
    // The cd command should update the game state automatically
    setTimeout(() => loadFiles(), 100);
  };

  const navigateUp = async () => {
    const result = await hackNetEngine.executeCommand('cd ..');
    console.log('[FileSystemEnhanced] cd .. result:', result);
    setTimeout(() => loadFiles(), 100);
  };

  const navigateHome = async () => {
    const result = await hackNetEngine.executeCommand('cd /home/user');
    console.log('[FileSystemEnhanced] cd home result:', result);
    setTimeout(() => loadFiles(), 100);
  };

  const openFile = async (file: FileItem) => {
    console.log(`[FileSystemEnhanced] Opening file: ${file.name}`);
    const result = await hackNetEngine.executeCommand(`cat ${file.name}`);
    console.log(`[FileSystemEnhanced] File content:`, result);
    // Could implement file viewer here
  };

  const downloadFile = (file: FileItem) => {
    console.log(`[FileSystemEnhanced] Downloading file: ${file.name}`);
    const downloadedFiles = gameState.downloadedFiles || [];
    updateGameState({
      downloadedFiles: [...downloadedFiles, file.name]
    });
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const deleteFile = async (file: FileItem) => {
    const result = await hackNetEngine.executeCommand(`rm ${file.name}`);
    console.log(`[FileSystemEnhanced] Delete result:`, result);
    
    const deletedFiles = gameState.deletedFiles || [];
    const fileEntry = `${gameState.currentNode}:${gameState.currentDirectory}/${file.name}`;
    
    updateGameState({
      deletedFiles: [...deletedFiles, fileEntry]
    });
    
    setTimeout(() => loadFiles(), 100); // Reload file list
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'directory') {
      return <Folder size={20} className="text-cyan-400" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['exe', 'bin'].includes(extension || '')) {
      return <Settings size={20} className="text-red-400" />;
    }
    
    return <File size={20} className="text-green-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-black/90 border border-green-400/30 rounded-lg">
      {/* Header */}
      <div className="p-3 border-b border-green-400/30 bg-gradient-to-r from-black to-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-cyan-400 font-bold text-lg font-mono">FILE SYSTEM</h3>
          <div className="flex gap-2">
            <button
              onClick={navigateUp}
              className="p-1 text-green-400 hover:text-cyan-400 transition-colors"
              disabled={gameState.currentDirectory === '/'}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={navigateHome}
              className="p-1 text-green-400 hover:text-cyan-400 transition-colors"
            >
              <Home size={20} />
            </button>
          </div>
        </div>
        
        {/* Current path */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-400 font-mono">{gameState.currentNode}:</span>
          <span className="text-green-400 font-mono">{gameState.currentDirectory}</span>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 ? (
          <div className="text-center text-green-400/60 mt-8">
            <Folder size={48} className="mx-auto mb-2 opacity-50" />
            <p>Directory is empty</p>
          </div>
        ) : (
          <div className="space-y-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={`flex items-center gap-3 p-2 rounded border transition-all cursor-pointer ${
                  selectedFile === file.name
                    ? 'bg-green-400/20 border-green-400'
                    : 'border-transparent hover:bg-green-400/10 hover:border-green-400/30'
                }`}
                onClick={(e) => handleItemClick(file, e)}
              >
                {getFileIcon(file)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-sm truncate ${
                      file.type === 'directory' ? 'text-cyan-400' : 'text-green-400'
                    }`}>
                      {file.name}
                      {file.encrypted && <span className="text-red-400 ml-1">[ENCRYPTED]</span>}
                    </span>
                    <span className="text-green-400/60 text-xs ml-2">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-green-400/60 mt-1">
                    {file.permissions} | {file.modified || 'Unknown'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Context menu */}
      {contextMenu.visible && contextMenu.item && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-gray-900 border border-green-400 rounded shadow-lg py-2 min-w-48"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 200),
            top: Math.min(contextMenu.y, window.innerHeight - 200)
          }}
        >
          {contextMenu.item.type === 'directory' ? (
            <button
              className="w-full px-4 py-2 text-left text-green-400 hover:bg-green-400/20 flex items-center gap-2"
              onClick={() => handleDoubleClick(contextMenu.item!)}
            >
              <Folder size={16} />
              Open Directory
            </button>
          ) : (
            <>
              <button
                className="w-full px-4 py-2 text-left text-green-400 hover:bg-green-400/20 flex items-center gap-2"
                onClick={() => openFile(contextMenu.item!)}
              >
                <Eye size={16} />
                View File
              </button>
              <button
                className="w-full px-4 py-2 text-left text-green-400 hover:bg-green-400/20 flex items-center gap-2"
                onClick={() => downloadFile(contextMenu.item!)}
              >
                <Download size={16} />
                Download
              </button>
            </>
          )}
          
          <hr className="border-green-400/30 my-2" />
          
          <button
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-400/20 flex items-center gap-2"
            onClick={() => deleteFile(contextMenu.item!)}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="p-2 border-t border-green-400/30 bg-black/50">
        <div className="text-xs text-green-400/60 text-center">
          Single tap: Context menu • Double tap: Open
        </div>
      </div>
    </div>
  );
};

export default FileSystemEnhanced;
