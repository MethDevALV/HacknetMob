
import { NetworkNode } from './NetworkNode';

export class FileSystemInitializer {
  static initializeNodeFileSystem(node: NetworkNode): void {
    // Root directory
    node.fileSystem.set('/', [
      { name: 'bin', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
      { name: 'home', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
      { name: 'var', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
      { name: 'etc', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() }
    ]);

    // /bin directory with tools
    const binFiles = [
      { name: 'system.log', type: 'file' as const, content: 'System startup completed successfully.', size: 35, permissions: 'rw-r--r--', modified: new Date().toLocaleString() }
    ];

    // Agregar SecurityTracer.exe para localhost (necesario para primera misión)
    if (node.ip === '127.0.0.1' || node.hostname === 'localhost') {
      binFiles.push(
        { name: 'SecurityTracer.exe', type: 'file' as const, content: 'Security tracing tool for monitoring network activities', size: 1024, permissions: 'rwxr-xr-x', modified: new Date().toLocaleString() }
      );
    }

    if (node.compromised) {
      binFiles.push(
        { name: 'SSHcrack.exe', type: 'file' as const, content: 'SSH exploitation tool', size: 2048, permissions: 'rwxr-xr-x', modified: new Date().toLocaleString() }
      );
    }

    node.fileSystem.set('/bin', binFiles);

    // /home directory
    const homeDir = node.os === 'Windows' ? [
      { name: 'Administrator', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
      { name: 'Guest', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() }
    ] : [
      { name: 'user', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
      { name: 'admin', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() }
    ];

    node.fileSystem.set('/home', homeDir);

    // /var directory
    node.fileSystem.set('/var', [
      { name: 'log', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
      { name: 'tmp', type: 'directory' as const, size: 0, permissions: 'drwxrwxrwx', modified: new Date().toLocaleString() }
    ]);

    // /var/log directory
    node.fileSystem.set('/var/log', [
      { name: 'access.log', type: 'file' as const, content: `Access log for ${node.hostname}\nConnection attempts logged here.`, size: 128, permissions: 'rw-r--r--', modified: new Date().toLocaleString() },
      { name: 'error.log', type: 'file' as const, content: 'Error log - No errors recorded.', size: 64, permissions: 'rw-r--r--', modified: new Date().toLocaleString() }
    ]);

    // /etc directory
    node.fileSystem.set('/etc', [
      { name: 'passwd', type: 'file' as const, content: 'root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000:admin:/home/admin:/bin/bash', size: 128, permissions: 'rw-r--r--', modified: new Date().toLocaleString() },
      { name: 'hosts', type: 'file' as const, content: '127.0.0.1 localhost\n' + node.ip + ' ' + node.hostname, size: 64, permissions: 'rw-r--r--', modified: new Date().toLocaleString() }
    ]);

    // User directories - Para localhost, inicializar con directorio user
    if (node.ip === '127.0.0.1' || node.hostname === 'localhost') {
      node.fileSystem.set('/home/user', [
        { name: 'Documents', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
        { name: 'Downloads', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
        { name: '.bashrc', type: 'file' as const, content: '# User bash configuration\nexport PATH=$PATH:/usr/local/bin', size: 128, permissions: 'rw-r--r--', modified: new Date().toLocaleString() },
        { name: 'readme.txt', type: 'file' as const, content: 'Welcome to HackNet. Use scan to find targets and complete missions.', size: 64, permissions: 'rw-r--r--', modified: new Date().toLocaleString() }
      ]);
    } else if (node.os === 'Windows') {
      node.fileSystem.set('/home/Administrator', [
        { name: 'Documents', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
        { name: 'desktop.ini', type: 'file' as const, content: '[.ShellClassInfo]\nIconResource=imageres.dll,183', size: 64, permissions: 'rw-r--r--', modified: new Date().toLocaleString() }
      ]);
    } else {
      node.fileSystem.set('/home/user', [
        { name: 'Documents', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
        { name: 'Downloads', type: 'directory' as const, size: 0, permissions: 'drwxr-xr-x', modified: new Date().toLocaleString() },
        { name: '.bashrc', type: 'file' as const, content: '# User bash configuration\nexport PATH=$PATH:/usr/local/bin', size: 128, permissions: 'rw-r--r--', modified: new Date().toLocaleString() }
      ]);
    }

    console.log(`[FileSystemInitializer] Initialized file system for ${node.hostname} (${node.ip})`);
  }

  static addHackingToolsToNode(node: NetworkNode): void {
    const binFiles = node.fileSystem.get('/bin') || [];
    
    // Add random hacking tools based on node type and security
    const availableTools = ['FTPBounce.exe', 'relaySMTP.exe', 'WebServerWorm.exe', 'SQLBufferOverflow.exe'];
    const toolsToAdd = Math.floor(Math.random() * 2) + 1; // 1-2 tools
    
    for (let i = 0; i < toolsToAdd; i++) {
      const tool = availableTools[Math.floor(Math.random() * availableTools.length)];
      if (!binFiles.find(f => f.name === tool)) {
        binFiles.push({
          name: tool,
          type: 'file' as const,
          content: `Hacking tool: ${tool}`,
          size: 4096,
          permissions: 'rwxr-xr-x',
          modified: new Date().toLocaleString()
        });
      }
    }
    
    node.fileSystem.set('/bin', binFiles);
  }
}
