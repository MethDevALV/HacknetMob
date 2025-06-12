
import React, { useState } from 'react';
import { Folder, File, ArrowUp, FileText, Settings, Database, ScrollText } from 'lucide-react';
import { useGameState } from '../hooks/useGameStateNative';
import { cyberpunkStyles } from '../styles/cyberpunkTheme';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size?: string;
  modified: string;
  content?: string;
}

const FileSystemNative: React.FC = () => {
  const { gameState } = useGameState();
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showContent, setShowContent] = useState<string | null>(null);

  const getDirectoryContents = (path: string): FileItem[] => {
    if (gameState.currentNode === 'localhost') {
      switch (path) {
        case '/home/user':
          return [
            { name: '..', type: 'directory', modified: '2024-01-15' },
            { name: 'Desktop', type: 'directory', modified: '2024-01-15' },
            { name: 'Documents', type: 'directory', modified: '2024-01-14' },
            { name: 'Downloads', type: 'directory', modified: '2024-01-13' },
            { name: 'hacknet_tools', type: 'directory', modified: '2024-01-12' },
            { name: 'readme.txt', type: 'file', size: '1.2KB', modified: '2024-01-15', content: 'Welcome to HackNet Mobile\n\nThis is your personal computer. Use the terminal to navigate and explore the network.\n\nTip: Start with the "scan" command to discover nearby devices.' },
            { name: 'login.txt', type: 'file', size: '0.8KB', modified: '2024-01-14', content: 'SSH Login Credentials Found:\n\nServer: 192.168.1.10\nUsername: admin\nPassword: password123\n\nNote: Default credentials - should be changed immediately.' }
          ];
        case '/home/user/hacknet_tools':
          return [
            { name: '..', type: 'directory', modified: '2024-01-15' },
            { name: 'scanner.exe', type: 'file', size: '2.1MB', modified: '2024-01-12' },
            { name: 'probe.exe', type: 'file', size: '1.8MB', modified: '2024-01-12' },
            { name: 'config.ini', type: 'file', size: '0.5KB', modified: '2024-01-12', content: '[Scanner Settings]\nTimeout=5000\nMaxThreads=10\n\n[Probe Settings]\nPortRange=1-1000\nVerbose=true' }
          ];
        default:
          return [
            { name: '..', type: 'directory', modified: '2024-01-15' }
          ];
      }
    } else {
      // Remote system files
      return [
        { name: '..', type: 'directory', modified: '2024-01-10' },
        { name: 'bin', type: 'directory', modified: '2024-01-08' },
        { name: 'etc', type: 'directory', modified: '2024-01-09' },
        { name: 'home', type: 'directory', modified: '2024-01-07' },
        { name: 'var', type: 'directory', modified: '2024-01-10' },
        { name: 'shadow.db', type: 'file', size: '4.2KB', modified: '2024-01-10', content: 'root:$6$salt$hashedpassword123...\nadmin:$6$salt$hashedpassword456...\nuser:$6$salt$hashedpassword789...\n\n[ENCRYPTED PASSWORD DATABASE]' },
        { name: 'system.log', type: 'file', size: '12.5KB', modified: '2024-01-10', content: '[2024-01-10 14:23] SSH connection from 192.168.1.100\n[2024-01-10 14:24] Login successful: admin\n[2024-01-10 14:25] File access: /etc/passwd\n[2024-01-10 14:26] Command executed: ls -la\n[2024-01-10 14:27] Connection closed\n\n[SYSTEM ACCESS LOG]' }
      ];
    }
  };

  const navigateToDirectory = (dirName: string) => {
    if (dirName === '..') {
      const pathParts = currentPath.split('/');
      if (pathParts.length > 2) {
        pathParts.pop();
        setCurrentPath(pathParts.join('/'));
      }
    } else {
      setCurrentPath(`${currentPath}/${dirName}`);
    }
    setSelectedFile(null);
  };

  const viewFile = (file: FileItem) => {
    if (file.content) {
      setShowContent(file.content);
    } else {
      alert(`Cannot display binary file: ${file.name}`);
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'directory') {
      return file.name === '..' ? ArrowUp : Folder;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'txt':
        return FileText;
      case 'exe':
        return File;
      case 'ini':
        return Settings;
      case 'db':
        return Database;
      case 'log':
        return ScrollText;
      default:
        return File;
    }
  };

  const files = getDirectoryContents(currentPath);

  if (showContent) {
    return (
      <div className="h-full bg-black flex flex-col" style={{ padding: '16px' }}>
        <div style={{ ...cyberpunkStyles.glowBox, padding: '12px', marginBottom: '16px', borderRadius: '8px' }}>
          <div style={{ ...cyberpunkStyles.systemText, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
            FILE VIEWER
          </div>
        </div>
        
        <div style={{ ...cyberpunkStyles.glowBox, flex: 1, padding: '16px', borderRadius: '8px' }}>
          <pre style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {showContent}
          </pre>
        </div>
        
        <button
          onClick={() => setShowContent(null)}
          style={{
            ...cyberpunkStyles.cyberpunkButton,
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          <span style={{ ...cyberpunkStyles.matrixText, fontSize: '14px', fontWeight: 'bold' }}>
            CLOSE
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-black flex flex-col" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ ...cyberpunkStyles.glowBox, padding: '12px', marginBottom: '16px', borderRadius: '8px' }}>
        <div style={{ ...cyberpunkStyles.systemText, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          FILE SYSTEM
        </div>
        <div style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
          {gameState.currentNode} : {currentPath}
        </div>
      </div>

      {/* File List */}
      <div style={{ ...cyberpunkStyles.glowBox, flex: 1, borderRadius: '8px' }}>
        <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
          {files.map((file, index) => {
            const IconComponent = getFileIcon(file);
            return (
              <button
                key={index}
                onClick={() => {
                  if (file.type === 'directory') {
                    navigateToDirectory(file.name);
                  } else {
                    viewFile(file);
                  }
                }}
                onDoubleClick={() => setSelectedFile(selectedFile === file.name ? null : file.name)}
                style={{
                  ...cyberpunkStyles.cyberpunkButton,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  marginBottom: '2px',
                  borderRadius: '4px',
                  backgroundColor: selectedFile === file.name ? 'rgba(0, 255, 65, 0.3)' : 'rgba(0, 255, 65, 0.1)',
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                <IconComponent 
                  size={20} 
                  color={file.type === 'directory' ? '#00ffff' : '#00ff41'} 
                  style={{ marginRight: '12px' }}
                />
                
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{
                    ...cyberpunkStyles.matrixText,
                    fontSize: '14px', 
                    fontWeight: file.type === 'directory' ? 'bold' : 'normal',
                    color: file.type === 'directory' ? '#00ffff' : '#00ff41'
                  }}>
                    {file.name}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{ ...cyberpunkStyles.matrixText, fontSize: '10px', opacity: 0.7 }}>
                      {file.modified}
                    </span>
                    {file.size && (
                      <span style={{ ...cyberpunkStyles.matrixText, fontSize: '10px', opacity: 0.7 }}>
                        {file.size}
                      </span>
                    )}
                  </div>
                </div>

                {file.type === 'directory' && (
                  <ArrowUp size={16} color="#00ff41" style={{ opacity: 0.5, transform: 'rotate(90deg)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ ...cyberpunkStyles.glowBox, padding: '8px', marginTop: '16px', borderRadius: '8px' }}>
        <div style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', textAlign: 'center' }}>
          {files.length - 1} items | Click folders to navigate • Click files to view • Double click to select
        </div>
      </div>
    </div>
  );
};

export default FileSystemNative;
