
export interface HackingTool {
  name: string;
  description: string;
  command: string;
  cpuUsage: number;
  ramUsage: number;
  executionTime: number; // in seconds
  successRate: number; // 0-1
  requiredPorts?: number[];
  targetSecurity?: string[];
}

export const HACKING_TOOLS: { [key: string]: HackingTool } = {
  sshcrack: {
    name: 'SSHcrack',
    description: 'Cracks SSH passwords using dictionary attacks',
    command: 'sshcrack',
    cpuUsage: 25,
    ramUsage: 512,
    executionTime: 15,
    successRate: 0.8,
    requiredPorts: [22],
    targetSecurity: ['low', 'medium']
  },
  ftpbounce: {
    name: 'FTPBounce',
    description: 'Exploits FTP bounce vulnerabilities',
    command: 'ftpbounce',
    cpuUsage: 15,
    ramUsage: 256,
    executionTime: 10,
    successRate: 0.9,
    requiredPorts: [21],
    targetSecurity: ['low']
  },
  webserverworm: {
    name: 'WebServerWorm',
    description: 'Exploits web server vulnerabilities',
    command: 'webserverworm',
    cpuUsage: 35,
    ramUsage: 1024,
    executionTime: 20,
    successRate: 0.7,
    requiredPorts: [80, 443],
    targetSecurity: ['low', 'medium', 'high']
  },
  porthack: {
    name: 'PortHack',
    description: 'Generic port exploitation tool',
    command: 'porthack',
    cpuUsage: 20,
    ramUsage: 384,
    executionTime: 12,
    successRate: 0.6,
    targetSecurity: ['low', 'medium']
  }
};

export class HackingToolExecutor {
  private activeTools: Map<string, { startTime: number; tool: HackingTool; target: string }> = new Map();

  startTool(toolName: string, target: string): boolean {
    const tool = HACKING_TOOLS[toolName];
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
    const progress = Math.min(elapsed / activeTool.tool.executionTime, 1);
    
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

    const success = Math.random() < activeTool.tool.successRate;
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
      totalCpu += tool.cpuUsage;
      totalRam += tool.ramUsage;
    }

    return { cpu: totalCpu, ram: totalRam };
  }
}
