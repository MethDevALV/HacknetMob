
export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  contents: string;
  content?: string; // For backward compatibility
  parentId?: string;
  lastModified: Date;
  size: number;
  permissions?: string;
  modified?: string;
  encrypted?: boolean;
}

export interface FileSystemValidation {
  isValid: boolean;
  errors: string[];
}

export class FileSystemManager {
  private static instance: FileSystemManager;
  private fileSystem: Map<string, FileSystemItem> = new Map();
  private listeners: Array<(items: FileSystemItem[]) => void> = [];
  private deviceFileSystems: Map<string, Map<string, FileSystemItem[]>> = new Map();

  static getInstance(): FileSystemManager {
    if (!FileSystemManager.instance) {
      FileSystemManager.instance = new FileSystemManager();
      FileSystemManager.instance.initializeDefaultFileSystems();
    }
    return FileSystemManager.instance;
  }

  private initializeDefaultFileSystems() {
    // Initialize localhost file system
    this.addFile('localhost', '/home/user', {
      name: 'readme.txt',
      type: 'file',
      content: 'Welcome to the hacker simulation. Use the terminal to explore the network.',
      permissions: 'rw-r--r--',
      modified: new Date().toLocaleString()
    });

    this.addFile('localhost', '/home/user', {
      name: 'profile.txt',
      type: 'file',
      content: 'User: hacker\nLevel: Beginner\nTarget: Complete all missions',
      permissions: 'rw-r--r--',
      modified: new Date().toLocaleString()
    });

    // Add directories
    this.addFile('localhost', '/home/user', {
      name: 'Documents',
      type: 'directory',
      content: '',
      permissions: 'drwxr-xr-x',
      modified: new Date().toLocaleString()
    });

    this.addFile('localhost', '/home/user', {
      name: 'Downloads',
      type: 'directory',
      content: '',
      permissions: 'drwxr-xr-x',
      modified: new Date().toLocaleString()
    });
  }

  subscribe(listener: (items: FileSystemItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const items = Array.from(this.fileSystem.values());
    this.listeners.forEach(listener => listener(items));
  }

  validateFile(name: string, contents: string): FileSystemValidation {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('File name cannot be empty');
    }

    if (name.includes('/') || name.includes('\\')) {
      errors.push('File name cannot contain path separators');
    }

    if (contents === undefined || contents === null) {
      errors.push('File contents cannot be null or undefined');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  createFile(name: string, contents: string, parentId?: string): FileSystemItem | null {
    try {
      const validation = this.validateFile(name, contents);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const file: FileSystemItem = {
        id,
        name: name.trim(),
        type: 'file',
        contents,
        content: contents, // For backward compatibility
        parentId,
        lastModified: new Date(),
        size: contents.length,
        permissions: 'rw-r--r--',
        modified: new Date().toLocaleString()
      };

      this.fileSystem.set(id, file);
      this.notifyListeners();
      return file;
    } catch (error) {
      console.error('Failed to create file:', error);
      return null;
    }
  }

  updateFile(id: string, updates: Partial<FileSystemItem>): boolean {
    try {
      const existingFile = this.fileSystem.get(id);
      if (!existingFile) {
        throw new Error(`File with id ${id} not found`);
      }

      if (updates.name !== undefined && updates.contents !== undefined) {
        const validation = this.validateFile(updates.name, updates.contents);
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
      }

      const updatedFile: FileSystemItem = {
        ...existingFile,
        ...updates,
        content: updates.contents || existingFile.contents, // For backward compatibility
        lastModified: new Date(),
        size: updates.contents !== undefined ? updates.contents.length : existingFile.size,
        modified: new Date().toLocaleString()
      };

      this.fileSystem.set(id, updatedFile);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to update file:', error);
      return false;
    }
  }

  deleteFile(id: string): boolean {
    try {
      if (!this.fileSystem.has(id)) {
        throw new Error(`File with id ${id} not found`);
      }

      this.fileSystem.delete(id);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }

  getFile(deviceIp: string, path: string, fileName: string): FileSystemItem | null;
  getFile(id: string): FileSystemItem | null;
  getFile(deviceIpOrId: string, path?: string, fileName?: string): FileSystemItem | null {
    if (path && fileName) {
      // Multi-parameter version for backward compatibility
      const deviceFiles = this.deviceFileSystems.get(deviceIpOrId);
      if (!deviceFiles) return null;
      
      const pathFiles = deviceFiles.get(path);
      if (!pathFiles) return null;
      
      return pathFiles.find(f => f.name === fileName) || null;
    } else {
      // Single parameter version
      return this.fileSystem.get(deviceIpOrId) || null;
    }
  }

  getAllFiles(): FileSystemItem[] {
    return Array.from(this.fileSystem.values());
  }

  getFilesByParent(parentId?: string): FileSystemItem[] {
    return Array.from(this.fileSystem.values())
      .filter(item => item.parentId === parentId);
  }

  // Legacy methods for backward compatibility
  getFileSystem(deviceIp: string, path: string): FileSystemItem[] {
    const deviceFiles = this.deviceFileSystems.get(deviceIp);
    if (!deviceFiles) {
      // Initialize empty file system for device
      this.deviceFileSystems.set(deviceIp, new Map());
      return [];
    }
    
    return deviceFiles.get(path) || [];
  }

  addFile(deviceIp: string, path: string, file: any): boolean {
    try {
      let deviceFiles = this.deviceFileSystems.get(deviceIp);
      if (!deviceFiles) {
        deviceFiles = new Map();
        this.deviceFileSystems.set(deviceIp, deviceFiles);
      }

      let pathFiles = deviceFiles.get(path);
      if (!pathFiles) {
        pathFiles = [];
        deviceFiles.set(path, pathFiles);
      }

      // Convert file format for compatibility
      const fileSystemItem: FileSystemItem = {
        id: `${deviceIp}_${path}_${file.name}_${Date.now()}`,
        name: file.name,
        type: file.type || 'file',
        contents: file.content || file.contents || '',
        content: file.content || file.contents || '', // For backward compatibility
        lastModified: new Date(),
        size: (file.content || file.contents || '').length,
        permissions: file.permissions || 'rw-r--r--',
        modified: file.modified || new Date().toLocaleString(),
        encrypted: file.encrypted || false
      };

      // Remove existing file with same name
      const existingIndex = pathFiles.findIndex(f => f.name === file.name);
      if (existingIndex !== -1) {
        pathFiles[existingIndex] = fileSystemItem;
      } else {
        pathFiles.push(fileSystemItem);
      }

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to add file:', error);
      return false;
    }
  }

  removeFile(deviceIp: string, path: string, fileName: string): boolean {
    try {
      const deviceFiles = this.deviceFileSystems.get(deviceIp);
      if (!deviceFiles) return false;

      const pathFiles = deviceFiles.get(path);
      if (!pathFiles) return false;

      const fileIndex = pathFiles.findIndex(f => f.name === fileName);
      if (fileIndex === -1) return false;

      pathFiles.splice(fileIndex, 1);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to remove file:', error);
      return false;
    }
  }

  getAllDeviceIPs(): string[] {
    return Array.from(this.deviceFileSystems.keys());
  }

  isValidDirectory(deviceIp: string, path: string): boolean {
    const deviceFiles = this.deviceFileSystems.get(deviceIp);
    if (!deviceFiles) return false;
    
    return deviceFiles.has(path);
  }

  plantMissionFiles(missionId: string): void {
    console.log(`[FileSystemManager] Planting files for mission: ${missionId}`);
    
    // Mission-specific file planting logic
    switch (missionId) {
      case 'first_scan':
        this.addFile('192.168.1.50', '/home/admin', {
          name: 'secret.txt',
          type: 'file',
          content: 'This is confidential information.',
          permissions: 'r--r-----',
          modified: new Date().toLocaleString()
        });
        break;
        
      case 'medium_security_hack':
        this.addFile('10.0.0.25', '/var/log', {
          name: 'security.log',
          type: 'file',
          content: 'Security breach detected at 14:32:15\nUnauthorized access attempt blocked.',
          permissions: 'r--r--r--',
          modified: new Date().toLocaleString()
        });
        break;
        
      default:
        console.log(`[FileSystemManager] No files to plant for mission: ${missionId}`);
    }
  }
}

export const fileSystemManager = FileSystemManager.getInstance();
