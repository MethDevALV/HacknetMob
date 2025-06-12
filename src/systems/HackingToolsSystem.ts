import { HackingTool, HACKNET_TOOLS } from '../types/CoreTypes';

export class HackingToolsSystem {
  private static instance: HackingToolsSystem;
  private availableTools: Record<string, HackingTool> = {};

  private constructor() {
    this.availableTools = { ...HACKNET_TOOLS };
  }

  public static getInstance(): HackingToolsSystem {
    if (!HackingToolsSystem.instance) {
      HackingToolsSystem.instance = new HackingToolsSystem();
    }
    return HackingToolsSystem.instance;
  }

  getTool(toolId: string): HackingTool | undefined {
    return this.availableTools[toolId];
  }

  getAllTools(): HackingTool[] {
    return Object.values(this.availableTools);
  }

  getAvailableTools(): HackingTool[] {
    return Object.values(this.availableTools).filter(tool => tool.acquired);
  }

  setToolAcquired(toolId: string, acquired: boolean): void {
    const tool = this.availableTools[toolId];
    if (tool) {
      tool.acquired = acquired;
      this.availableTools[toolId] = { ...tool };
    }
  }

  canExecute(toolId: string, ramAvailable: number): boolean {
    const tool = this.getTool(toolId);
    if (!tool) return false;
    return tool.ramCost <= ramAvailable;
  }

  executeTool(toolId: string, target: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const tool = this.getTool(toolId);
      if (!tool) {
        reject(`Tool ${toolId} not found`);
        return;
      }

      // Simulate tool execution
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% chance of success
        if (success) {
          resolve(`Tool ${tool.name} executed successfully on ${target}`);
        } else {
          reject(`Tool ${tool.name} failed to execute on ${target}`);
        }
      }, tool.executionTime);
    });
  }
}

export const hackingToolsSystem = HackingToolsSystem.getInstance();
