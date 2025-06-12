
import { BrowserEventEmitter } from '../utils/BrowserEventEmitter';
import { HackingTool, HACKNET_TOOLS } from '../types/CoreTypes';

export class ToolsManager extends BrowserEventEmitter {
  private tools: Map<string, HackingTool> = new Map();
  private activeTools: Map<string, { startTime: number; duration: number; target: string }> = new Map();

  constructor() {
    super();
    this.initializeTools();
  }

  private initializeTools() {
    // Use tools from CoreTypes
    Object.values(HACKNET_TOOLS).forEach(tool => {
      this.tools.set(tool.id, tool);
    });
  }

  async executeTool(toolId: string, targetIp: string): Promise<boolean> {
    const tool = this.tools.get(toolId);
    if (!tool || !tool.unlocked) return false;

    if (this.activeTools.has(toolId)) return false; // Tool already running

    this.activeTools.set(toolId, {
      startTime: Date.now(),
      duration: tool.executionTime,
      target: targetIp
    });

    this.emit('toolStarted', { tool, target: targetIp });

    // Simulate tool execution
    await new Promise(resolve => setTimeout(resolve, tool.executionTime));

    this.activeTools.delete(toolId);

    const success = Math.random() < tool.successRate;
    this.emit('toolCompleted', { tool, target: targetIp, success });

    return success;
  }

  tick() {
    // Update active tool progress
    const now = Date.now();
    for (const [toolId, execution] of this.activeTools.entries()) {
      const progress = (now - execution.startTime) / execution.duration;
      if (progress >= 1) {
        // Tool completed, will be handled by executeTool promise
        continue;
      }
      this.emit('toolProgress', { toolId, progress, target: execution.target });
    }
  }

  getAvailableTools(): HackingTool[] {
    return Array.from(this.tools.values()).filter(tool => tool.unlocked);
  }

  getAllTools(): HackingTool[] {
    return Array.from(this.tools.values());
  }

  unlockTool(toolId: string): boolean {
    const tool = this.tools.get(toolId);
    if (!tool) return false;

    tool.unlocked = true;
    this.emit('toolUnlocked', tool);
    return true;
  }

  getActiveTools(): string[] {
    return Array.from(this.activeTools.keys());
  }

  isToolRunning(toolId: string): boolean {
    return this.activeTools.has(toolId);
  }

  getToolProgress(toolId: string): number {
    const execution = this.activeTools.get(toolId);
    if (!execution) return 0;

    const progress = (Date.now() - execution.startTime) / execution.duration;
    return Math.min(progress, 1);
  }
}
