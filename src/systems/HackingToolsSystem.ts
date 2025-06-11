
// Complete hacking tools system matching HackNet
import { HackingTool, HACKNET_TOOLS } from '../types/HackNetTypes';

export class HackingToolsSystem {
  private static instance: HackingToolsSystem;
  private activeProcesses: Map<string, ToolProcess> = new Map();

  static getInstance(): HackingToolsSystem {
    if (!HackingToolsSystem.instance) {
      HackingToolsSystem.instance = new HackingToolsSystem();
    }
    return HackingToolsSystem.instance;
  }

  async executeTool(toolName: string, args: string[], targetIp?: string): Promise<ToolResult> {
    const tool = HACKNET_TOOLS[toolName];
    if (!tool) {
      return {
        success: false,
        message: `Tool '${toolName}' not found`,
        output: [`Error: ${toolName} is not a recognized tool`]
      };
    }

    if (!tool.acquired) {
      return {
        success: false,
        message: `Tool '${toolName}' not acquired`,
        output: [`Error: You don't have ${toolName}. Find it on a compromised system.`]
      };
    }

    // Check if tool is already running
    if (this.activeProcesses.has(toolName)) {
      return {
        success: false,
        message: `${toolName} is already running`,
        output: [`Error: ${toolName} is already executing. Use 'ps' to check process status.`]
      };
    }

    // Validate arguments based on tool type
    if (tool.category === 'port_hack' && !targetIp) {
      return {
        success: false,
        message: `Missing target IP`,
        output: [`Usage: ${tool.usage}`]
      };
    }

    // Start tool execution
    const processId = this.startToolProcess(tool, args, targetIp);
    
    return {
      success: true,
      message: `${tool.displayName} started`,
      output: [
        `Executing ${tool.name}...`,
        `Target: ${targetIp || 'localhost'}`,
        `RAM Usage: ${tool.ramCost}MB`,
        `Estimated time: ${tool.executionTime / 1000}s`,
        '',
        `Use 'ps' to monitor progress or 'kill ${processId}' to abort.`
      ],
      processId
    };
  }

  private startToolProcess(tool: HackingTool, args: string[], targetIp?: string): string {
    const processId = `${tool.id}_${Date.now()}`;
    const process: ToolProcess = {
      id: processId,
      tool,
      args,
      targetIp,
      startTime: Date.now(),
      progress: 0,
      status: 'running'
    };

    this.activeProcesses.set(processId, process);

    // Simulate tool execution
    setTimeout(() => {
      this.completeToolProcess(processId);
    }, tool.executionTime);

    return processId;
  }

  private completeToolProcess(processId: string): void {
    const process = this.activeProcesses.get(processId);
    if (!process) return;

    process.status = 'completed';
    process.progress = 100;

    // Determine success based on tool and target
    const success = this.calculateToolSuccess(process);
    process.success = success;

    // Remove process after a delay
    setTimeout(() => {
      this.activeProcesses.delete(processId);
    }, 5000);
  }

  private calculateToolSuccess(process: ToolProcess): boolean {
    // Base success rate varies by tool and target security
    const baseSuccess = 0.8; // 80% base success rate
    
    // Add randomness and security considerations
    const roll = Math.random();
    return roll < baseSuccess;
  }

  getActiveProcesses(): ToolProcess[] {
    return Array.from(this.activeProcesses.values());
  }

  getProcessById(processId: string): ToolProcess | undefined {
    return this.activeProcesses.get(processId);
  }

  killProcess(processId: string): boolean {
    const process = this.activeProcesses.get(processId);
    if (!process) return false;

    process.status = 'killed';
    this.activeProcesses.delete(processId);
    return true;
  }

  getToolByName(name: string): HackingTool | undefined {
    return HACKNET_TOOLS[name];
  }

  getAvailableTools(): HackingTool[] {
    return Object.values(HACKNET_TOOLS).filter(tool => tool.acquired);
  }

  acquireTool(toolName: string): boolean {
    const tool = HACKNET_TOOLS[toolName];
    if (!tool) return false;

    tool.acquired = true;
    return true;
  }

  getTotalRAMUsage(): number {
    return Array.from(this.activeProcesses.values())
      .filter(p => p.status === 'running')
      .reduce((total, p) => total + p.tool.ramCost, 0);
  }
}

interface ToolProcess {
  id: string;
  tool: HackingTool;
  args: string[];
  targetIp?: string;
  startTime: number;
  progress: number;
  status: 'running' | 'completed' | 'failed' | 'killed';
  success?: boolean;
}

interface ToolResult {
  success: boolean;
  message: string;
  output: string[];
  processId?: string;
}

export const hackingToolsSystem = HackingToolsSystem.getInstance();
