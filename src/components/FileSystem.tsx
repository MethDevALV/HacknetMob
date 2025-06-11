
import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  size: string;
  content?: string;
}

interface FileSystemNode {
  [key: string]: FileSystemItem[];
}

const fileSystemByNode: { [node: string]: FileSystemNode } = {
  'localhost': {
    '/': [
      { name: 'home', type: 'directory', size: '' },
      { name: 'bin', type: 'directory', size: '' },
      { name: 'var', type: 'directory', size: '' }
    ],
    '/home': [
      { name: 'user', type: 'directory', size: '' }
    ],
    '/home/user': [
      { name: 'Desktop', type: 'directory', size: '' },
      { name: 'notes.txt', type: 'file', size: '2KB', content: 'Remember to check the network for vulnerabilities.' }
    ],
    '/bin': [
      { name: 'ls', type: 'file', size: '12KB' },
      { name: 'cd', type: 'file', size: '8KB' },
      { name: 'scan', type: 'file', size: '15KB' }
    ]
  },
  '192.168.1.1': {
    '/': [
      { name: 'etc', type: 'directory', size: '' },
      { name: 'var', type: 'directory', size: '' },
      { name: 'tmp', type: 'directory', size: '' }
    ],
    '/etc': [
      { name: 'passwd', type: 'file', size: '1KB', content: 'root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000:admin:/home/admin:/bin/bash' },
      { name: 'shadow', type: 'file', size: '1KB', content: 'root:$6$encrypted$hash:18000:0:99999:7:::' }
    ],
    '/var': [
      { name: 'log', type: 'directory', size: '' },
      { name: 'cache', type: 'directory', size: '' }
    ],
    '/var/log': [
      { name: 'access.log', type: 'file', size: '156KB', content: '192.168.1.100 - - [10/Jun/2025:10:30:00] "GET / HTTP/1.1" 200 1024' },
      { name: 'error.log', type: 'file', size: '23KB', content: '[error] Failed login attempt from 192.168.1.200' }
    ]
  },
  '10.0.0.1': {
    '/': [
      { name: 'var', type: 'directory', size: '' },
      { name: 'home', type: 'directory', size: '' },
      { name: 'tools', type: 'directory', size: '' }
    ],
    '/var': [
      { name: 'www', type: 'directory', size: '' },
      { name: 'mail', type: 'directory', size: '' }
    ],
    '/var/www': [
      { name: 'index.html', type: 'file', size: '5KB', content: '<html><body><h1>Corporate Server</h1></body></html>' },
      { name: 'admin.php', type: 'file', size: '12KB', content: '<?php if($_POST["pass"]=="admin123") { echo "Access granted"; } ?>' }
    ],
    '/tools': [
      { name: 'SQLInjector.exe', type: 'file', size: '2MB', content: 'TOOL_UNLOCK:SQLInjector' },
      { name: 'AdvancedPortHack.exe', type: 'file', size: '3MB', content: 'TOOL_UNLOCK:AdvancedPortHack' }
    ]
  }
};

export const FileSystem: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const currentNode = gameState.currentNode || 'localhost';
  const nodeFileSystem = fileSystemByNode[currentNode] || fileSystemByNode['localhost'];

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
    setFileContent('');
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = '/' + pathParts.join('/');
    setCurrentPath(newPath || '/');
    setSelectedFile(null);
    setFileContent('');
  };

  const getDirectoryContents = (path: string): FileSystemItem[] => {
    return nodeFileSystem[path] || [];
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'directory') {
      navigateTo(currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`);
    } else {
      setSelectedFile(item.name);
      if (item.content) {
        setFileContent(item.content);
        
        // Check for tool unlocks
        if (item.content.startsWith('TOOL_UNLOCK:')) {
          const toolName = item.content.replace('TOOL_UNLOCK:', '');
          if (!gameState.unlockedTools.includes(toolName)) {
            updateGameState({
              unlockedTools: [...gameState.unlockedTools, toolName]
            });
            alert(`New tool unlocked: ${toolName}!`);
          }
        }
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-3 text-matrix-green">
      <div className="mb-3 pb-2 border-b border-matrix-green">
        <h3 className="text-matrix-cyan font-bold text-lg">FILE SYSTEM</h3>
        <div className="text-sm text-yellow-400">
          {currentNode}:{currentPath}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {/* Navigation */}
        {currentPath !== '/' && (
          <div 
            className="flex items-center gap-2 p-2 hover:bg-matrix-green hover:bg-opacity-10 cursor-pointer border border-transparent hover:border-matrix-green"
            onClick={() => navigateUp()}
          >
            <span className="text-matrix-cyan">📁</span>
            <span className="text-matrix-cyan">..</span>
          </div>
        )}

        {/* Directories and files */}
        {getDirectoryContents(currentPath).map(item => (
          <div
            key={item.name}
            className={`flex items-center gap-2 p-2 cursor-pointer border transition-all ${
              selectedFile === item.name 
                ? 'border-matrix-green bg-matrix-green bg-opacity-20' 
                : 'border-transparent hover:border-matrix-green hover:bg-matrix-green hover:bg-opacity-10'
            }`}
            onClick={() => handleItemClick(item)}
          >
            <span className={item.type === 'directory' ? 'text-matrix-cyan' : 'text-yellow-400'}>
              {item.type === 'directory' ? '📁' : '📄'}
            </span>
            <span className="text-matrix-green text-sm flex-1">{item.name}</span>
            <span className="text-xs text-gray-500">{item.size}</span>
          </div>
        ))}
      </div>

      {/* File content */}
      {selectedFile && fileContent && (
        <div className="mt-3 border border-matrix-green p-3 bg-matrix-green bg-opacity-5">
          <h4 className="text-matrix-cyan font-bold text-sm mb-2">FILE CONTENT: {selectedFile}</h4>
          <div className="text-xs bg-black p-2 border border-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {fileContent}
          </div>
        </div>
      )}
    </div>
  );
};
