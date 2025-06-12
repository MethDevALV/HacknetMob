
import { BrowserEventEmitter } from '../utils/BrowserEventEmitter';
import { FileEntry } from '../types/CoreTypes';

export class FileSystemManager extends BrowserEventEmitter {
  private fileSystems: Map<string, Map<string, FileEntry[]>> = new Map(); // nodeIp -> path -> files

  getFiles(nodeIp: string, directory: string): FileEntry[] {
    const nodeFS = this.fileSystems.get(nodeIp);
    if (!nodeFS) return [];
    
    return nodeFS.get(directory) || [];
  }

  readFile(nodeIp: string, filePath: string): string | null {
    const parts = filePath.split('/');
    const fileName = parts.pop();
    const directory = parts.join('/') || '/';
    
    const files = this.getFiles(nodeIp, directory);
    const file = files.find(f => f.name === fileName);
    
    return file?.content || null;
  }

  deleteFile(nodeIp: string, filePath: string): boolean {
    const parts = filePath.split('/');
    const fileName = parts.pop();
    const directory = parts.join('/') || '/';
    
    const nodeFS = this.fileSystems.get(nodeIp);
    if (!nodeFS) return false;
    
    const files = nodeFS.get(directory);
    if (!files) return false;
    
    const fileIndex = files.findIndex(f => f.name === fileName);
    if (fileIndex === -1) return false;
    
    files.splice(fileIndex, 1);
    this.emit('fileDeleted', { nodeIp, filePath });
    return true;
  }

  createFile(nodeIp: string, directory: string, fileName: string, content: string, metadata: Partial<FileEntry> = {}): boolean {
    let nodeFS = this.fileSystems.get(nodeIp);
    if (!nodeFS) {
      nodeFS = new Map();
      this.fileSystems.set(nodeIp, nodeFS);
    }
    
    let files = nodeFS.get(directory);
    if (!files) {
      files = [];
      nodeFS.set(directory, files);
    }
    
    const newFile: FileEntry = {
      name: fileName,
      type: 'file',
      size: content.length,
      permissions: 'rw-r--r--',
      lastModified: new Date(),
      content,
      hidden: false,
      ...metadata
    };
    
    files.push(newFile);
    this.emit('fileCreated', { nodeIp, directory, fileName });
    return true;
  }

  listDirectory(nodeIp: string, directory: string): FileEntry[] {
    return this.getFiles(nodeIp, directory);
  }

  changeDirectory(currentDir: string, targetDir: string): string {
    if (targetDir.startsWith('/')) {
      return targetDir;
    }
    
    if (targetDir === '..') {
      const parts = currentDir.split('/').filter(p => p);
      parts.pop();
      return '/' + parts.join('/');
    }
    
    if (targetDir === '.') {
      return currentDir;
    }
    
    return currentDir + (currentDir.endsWith('/') ? '' : '/') + targetDir;
  }

  fileExists(nodeIp: string, filePath: string): boolean {
    return this.readFile(nodeIp, filePath) !== null;
  }

  getFileInfo(nodeIp: string, filePath: string): FileEntry | null {
    const parts = filePath.split('/');
    const fileName = parts.pop();
    const directory = parts.join('/') || '/';
    
    const files = this.getFiles(nodeIp, directory);
    return files.find(f => f.name === fileName) || null;
  }
}
