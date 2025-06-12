
import { networkSystemEnhanced } from '../systems/NetworkSystemEnhanced';

export class LocalhostInitializer {
  static initializeLocalhostFiles() {
    const localhost = '127.0.0.1';
    
    // /home/user directory - User files
    networkSystemEnhanced.addFile(localhost, '/home/user', 'readme.txt', {
      type: 'file',
      content: 'Welcome to HackNet Terminal!\n\nBasic Commands:\n- scan: Discover network devices\n- connect <ip>: Connect to a device\n- ls: List files\n- cat <file>: View file contents\n- sshcrack <ip>: Crack SSH on target\n\nGood luck, hacker!',
      size: 256,
      permissions: 'rw-r--r--'
    });

    networkSystemEnhanced.addFile(localhost, '/home/user', '.bash_history', {
      type: 'file',
      content: 'ls\nps\nwhoami\nscan\nhelp\ncat readme.txt\nls /bin\n',
      size: 64,
      permissions: 'rw-------'
    });

    networkSystemEnhanced.addFile(localhost, '/home/user', '.bashrc', {
      type: 'file',
      content: '# User bashrc\nexport PS1="\\u@\\h:\\w$ "\nalias ll="ls -la"\nalias la="ls -A"\nexport PATH=$PATH:/usr/local/bin:/home/user/tools\n',
      size: 128,
      permissions: 'rw-r--r--'
    });

    networkSystemEnhanced.addFile(localhost, '/home/user', 'personal_notes.txt', {
      type: 'file',
      content: 'Personal Hacking Notes:\n\n1. Always scan before connecting\n2. SSH is usually on port 22\n3. Look for weak passwords\n4. Check /etc/passwd for users\n5. Corporate networks = higher security\n\nTarget IPs to investigate:\n- 192.168.1.50 (looks like workstation)\n- 10.0.0.25 (corporate server?)\n',
      size: 312,
      permissions: 'rw-------'
    });

    // /bin directory - System tools
    networkSystemEnhanced.addFile(localhost, '/bin', 'SSHcrack.exe', {
      type: 'file',
      content: 'SSH Crack Tool v2.1\nUsage: sshcrack <target_ip>\nCracks SSH authentication on port 22',
      size: 2048,
      permissions: 'rwxr-xr-x'
    });

    networkSystemEnhanced.addFile(localhost, '/bin', 'PortScanner.exe', {
      type: 'file',
      content: 'Advanced Port Scanner\nUsage: portscan <target_ip>\nScans all open ports on target',
      size: 1536,
      permissions: 'rwxr-xr-x'
    });

    networkSystemEnhanced.addFile(localhost, '/bin', 'NetworkMapper.exe', {
      type: 'file',
      content: 'Network Topology Mapper\nUsage: netmap\nCreates visual map of network connections',
      size: 1024,
      permissions: 'rwxr-xr-x'
    });

    // /etc directory - System configuration
    networkSystemEnhanced.addFile(localhost, '/etc', 'passwd', {
      type: 'file',
      content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\n',
      size: 256,
      permissions: 'rw-r--r--'
    });

    networkSystemEnhanced.addFile(localhost, '/etc', 'hosts', {
      type: 'file',
      content: '127.0.0.1\tlocalhost\n127.0.1.1\thacknet-terminal\n192.168.1.1\trouter.local\n10.0.0.1\tgateway.corp\n',
      size: 128,
      permissions: 'rw-r--r--'
    });

    networkSystemEnhanced.addFile(localhost, '/etc', 'ssh_config', {
      type: 'file',
      content: '# SSH Client Configuration\nHost *\n    StrictHostKeyChecking no\n    UserKnownHostsFile /dev/null\n    ConnectTimeout 30\n    ServerAliveInterval 60\n',
      size: 192,
      permissions: 'rw-r--r--'
    });

    // /var/log directory - System logs
    networkSystemEnhanced.addFile(localhost, '/var/log', 'auth.log', {
      type: 'file',
      content: 'Jan 15 10:23:45 localhost sshd[1234]: Accepted password for user from 127.0.0.1\nJan 15 10:24:12 localhost sudo: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/bin/ls\nJan 15 10:25:33 localhost sshd[1235]: Failed password for root from 192.168.1.100\n',
      size: 384,
      permissions: 'rw-r-----'
    });

    networkSystemEnhanced.addFile(localhost, '/var/log', 'syslog', {
      type: 'file',
      content: 'Jan 15 10:23:30 localhost kernel: [    0.000000] Linux version 5.4.0-hacknet\nJan 15 10:23:31 localhost systemd[1]: Started OpenSSH server daemon.\nJan 15 10:23:45 localhost NetworkManager[567]: <info> device (eth0): link connected\n',
      size: 512,
      permissions: 'rw-r-----'
    });

    networkSystemEnhanced.addFile(localhost, '/var/log', 'network.log', {
      type: 'file',
      content: '10:20:15 - Network scan initiated from 127.0.0.1\n10:20:16 - Discovered device: 192.168.1.1 (Router)\n10:20:17 - Discovered device: 192.168.1.50 (Workstation)\n10:21:33 - Connection attempt to 192.168.1.50 failed - authentication required\n',
      size: 256,
      permissions: 'rw-r-----'
    });

    // /tmp directory - Temporary files
    networkSystemEnhanced.addFile(localhost, '/tmp', 'scan_results.tmp', {
      type: 'file',
      content: 'Latest Network Scan Results:\n192.168.1.1 - ONLINE - Router\n192.168.1.50 - ONLINE - Windows PC\n10.0.0.25 - ONLINE - Linux Server\n',
      size: 128,
      permissions: 'rw-rw-rw-'
    });

    console.log('[LocalhostInitializer] Localhost file system populated with realistic files');
  }

  static addHackingTools() {
    const localhost = '127.0.0.1';
    
    // Advanced hacking tools in /home/user/tools
    networkSystemEnhanced.createDirectory(localhost, '/home/user', 'tools');
    
    networkSystemEnhanced.addFile(localhost, '/home/user/tools', 'FTPBounce.exe', {
      type: 'file',
      content: 'FTP Bounce Attack Tool\nExploits FTP bounce vulnerability on port 21\nUsage: ftpbounce <target_ip>',
      size: 1024,
      permissions: 'rwxr-xr-x'
    });

    networkSystemEnhanced.addFile(localhost, '/home/user/tools', 'SQLInject.exe', {
      type: 'file',
      content: 'SQL Injection Tool\nExploits SQL databases on port 1433\nUsage: sqlinject <target_ip>',
      size: 1536,
      permissions: 'rwxr-xr-x'
    });

    networkSystemEnhanced.addFile(localhost, '/home/user/tools', 'WebCrawler.exe', {
      type: 'file',
      content: 'Web Server Vulnerability Scanner\nScans HTTP/HTTPS services for exploits\nUsage: webcrawl <target_ip>',
      size: 2048,
      permissions: 'rwxr-xr-x'
    });
  }
}
