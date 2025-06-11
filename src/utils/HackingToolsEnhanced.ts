
export interface HackingTool {
  id: string;
  name: string;
  type: 'port_cracking' | 'mobile_scanning' | 'defense' | 'file_processing' | 'forensics' | 'advanced_attack';
  target?: string;
  port?: number;
  executionTime: number;
  ramUsage: number;
  unlockLevel: number;
  acquired: boolean;
  acquisitionSource?: string;
  function?: string;
}

export const HACKNET_TOOLS: { [key: string]: HackingTool } = {
  // Básicas - Tutorial
  'SSHcrack.exe': {
    id: 'sshcrack',
    name: 'SSH Crack',
    type: 'port_cracking',
    target: 'SSH',
    port: 22,
    executionTime: 2000,
    ramUsage: 50,
    unlockLevel: 1,
    acquired: true, // Empezamos con esta
    acquisitionSource: 'Viper-Battlestation'
  },
  
  'FTPBounce.exe': {
    id: 'ftpbounce',
    name: 'FTP Bounce',
    type: 'port_cracking',
    target: 'FTP',
    port: 21,
    executionTime: 1500,
    ramUsage: 40,
    unlockLevel: 1,
    acquired: false,
    acquisitionSource: 'Entropy Asset Server'
  },

  'SMTPoverflow.exe': {
    id: 'smtpoverflow',
    name: 'SMTP Overflow',
    type: 'port_cracking',
    target: 'SMTP',
    port: 25,
    executionTime: 2500,
    ramUsage: 60,
    unlockLevel: 2,
    acquired: false,
    acquisitionSource: 'Entropy Asset Server'
  },

  // Intermedias
  'WebServerWorm.exe': {
    id: 'webserverworm',
    name: 'Web Server Worm',
    type: 'port_cracking',
    target: 'HTTP',
    port: 80,
    executionTime: 3000,
    ramUsage: 80,
    unlockLevel: 3,
    acquired: false,
    acquisitionSource: 'Naix Root Gateway'
  },

  'SQLBufferOverflow.exe': {
    id: 'sqlbufferoverflow',
    name: 'SQL Buffer Overflow',
    type: 'port_cracking',
    target: 'SQL',
    port: 1433,
    executionTime: 4000,
    ramUsage: 120,
    unlockLevel: 4,
    acquired: false,
    acquisitionSource: 'Head of the Polar Star'
  },

  // Avanzadas
  'SSLTrojan.exe': {
    id: 'ssltrojan',
    name: 'SSL Trojan',
    type: 'port_cracking',
    target: 'HTTPS',
    port: 443,
    executionTime: 5000,
    ramUsage: 150,
    unlockLevel: 5,
    acquired: false
  },

  'TorrentStreamInjector.exe': {
    id: 'torrentstreaminjector',
    name: 'Torrent Stream Injector',
    type: 'port_cracking',
    target: 'TORRENT',
    port: 6881,
    executionTime: 3500,
    ramUsage: 100,
    unlockLevel: 4,
    acquired: false
  },

  'PacificPortCrusher.exe': {
    id: 'pacificportcrusher',
    name: 'Pacific Port Crusher',
    type: 'port_cracking',
    target: 'PACIFIC',
    port: 22747,
    executionTime: 4500,
    ramUsage: 130,
    unlockLevel: 5,
    acquired: false
  },

  // Especiales
  'eosDeviceScan.exe': {
    id: 'eosdevicescan',
    name: 'eOS Device Scanner',
    type: 'mobile_scanning',
    executionTime: 1000,
    ramUsage: 30,
    unlockLevel: 2,
    acquired: false,
    acquisitionSource: 'Entropy Asset Server'
  },

  'TraceKill.exe': {
    id: 'tracekill',
    name: 'Trace Killer',
    type: 'defense',
    function: 'stop_all_traces',
    executionTime: 500,
    ramUsage: 100,
    unlockLevel: 6,
    acquired: false,
    acquisitionSource: 'CSEC Assets Server'
  },

  'Decypher.exe': {
    id: 'decypher',
    name: 'Decypherer',
    type: 'file_processing',
    function: 'decrypt_dec_files',
    executionTime: 3000,
    ramUsage: 90,
    unlockLevel: 5,
    acquired: false,
    acquisitionSource: 'DEC Solutions Mainframe'
  },

  'MemDumpGenerator.exe': {
    id: 'memdumpgenerator',
    name: 'Memory Dump Generator',
    type: 'forensics',
    function: 'create_memory_dump',
    executionTime: 2000,
    ramUsage: 120,
    unlockLevel: 6,
    acquired: false
  },

  'MemForensics.exe': {
    id: 'memforensics',
    name: 'Memory Forensics',
    type: 'forensics',
    function: 'analyze_memory_dump',
    executionTime: 4000,
    ramUsage: 140,
    unlockLevel: 6,
    acquired: false
  },

  'Sequencer.exe': {
    id: 'sequencer',
    name: 'Sequencer',
    type: 'advanced_attack',
    function: 'sequence_attack',
    executionTime: 6000,
    ramUsage: 200,
    unlockLevel: 8,
    acquired: false,
    acquisitionSource: 'CSEC Assets Server'
  }
};

export class HackingToolExecutor {
  private activeTools: Map<string, { startTime: number; tool: HackingTool; target: string }> = new Map();

  startTool(toolName: string, target: string): boolean {
    const tool = HACKNET_TOOLS[toolName];
    if (!tool) return false;

    // Check if tool is already running
    if (this.activeTools.has(toolName)) {
      return false;
    }

    this.activeTools.set(toolName, {
      startTime: Date.now(),
      tool,
      target
    });

    return true;
  }

  getToolProgress(toolName: string): number {
    const activeTool = this.activeTools.get(toolName);
    if (!activeTool) return 0;

    const elapsed = (Date.now() - activeTool.startTime) / 1000;
    const progress = Math.min(elapsed / (activeTool.tool.executionTime / 1000), 1);
    
    return progress;
  }

  isToolComplete(toolName: string): boolean {
    return this.getToolProgress(toolName) >= 1;
  }

  getToolResult(toolName: string): { success: boolean; message: string } | null {
    const activeTool = this.activeTools.get(toolName);
    if (!activeTool || !this.isToolComplete(toolName)) {
      return null;
    }

    const success = Math.random() < 0.85; // 85% success rate
    this.activeTools.delete(toolName);

    return {
      success,
      message: success 
        ? `${activeTool.tool.name} completed successfully on ${activeTool.target}`
        : `${activeTool.tool.name} failed on ${activeTool.target}`
    };
  }

  getActiveTools(): string[] {
    return Array.from(this.activeTools.keys());
  }

  getTotalResourceUsage(): { cpu: number; ram: number } {
    let totalCpu = 0;
    let totalRam = 0;

    for (const [, { tool }] of this.activeTools) {
      totalCpu += 25; // Default CPU usage
      totalRam += tool.ramUsage;
    }

    return { cpu: totalCpu, ram: totalRam };
  }
}

export const hackingToolExecutor = new HackingToolExecutor();
