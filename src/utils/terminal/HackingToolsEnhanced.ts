
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { systemResourcesEnhanced } from '../SystemResourcesEnhanced';
import { terminalCore } from './TerminalCore';
import { gameCore } from '../../core/GameCore';

export class HackingToolsEnhanced {
  private static activeTools: Map<string, { 
    processId: string; 
    targetIp: string; 
    toolName: string;
    onComplete: (success: boolean) => void;
  }> = new Map();

  static async executeHackingTool(toolName: string, args: string[]): Promise<string[]> {
    console.log(`[HackingToolsEnhanced] Executing tool: ${toolName} with args:`, args);
    
    const gameState = terminalCore.getGameState();
    const normalizedTool = toolName.toLowerCase().replace('.exe', '');
    
    // Check if tool is available
    const availableTools = ['sshcrack', 'ftpbounce', 'webserverworm', 'relaysmtp', 'ssltrojan', 'sqlbufferoverflow'];
    if (!availableTools.includes(normalizedTool)) {
      return [
        `Tool ${toolName} not found.`,
        'Available tools: SSHcrack.exe, FTPBounce.exe, WebServerWorm.exe',
        'Usage: sshcrack <target_ip>'
      ];
    }

    // SSHcrack implementation with resources
    if (normalizedTool === 'sshcrack') {
      return await this.executeSSHCrack(args);
    }

    // FTPBounce implementation
    if (normalizedTool === 'ftpbounce') {
      return await this.executeFTPBounce(args);
    }

    // WebServerWorm implementation
    if (normalizedTool === 'webserverworm') {
      return await this.executeWebServerWorm(args);
    }

    return [`${toolName} functionality is being implemented...`];
  }

  private static async executeSSHCrack(args: string[]): Promise<string[]> {
    if (args.length === 0) {
      return ['Usage: sshcrack <target_ip>'];
    }

    const targetIp = args[0];
    const targetNode = networkSystemEnhanced.getNode(targetIp);
    
    if (!targetNode) {
      return [`Target ${targetIp} not found. Use 'scan' to discover targets.`];
    }

    if (!targetNode.discovered) {
      return [`Target ${targetIp} not discovered. Use 'scan' first.`];
    }

    if (targetNode.compromised) {
      return [`Target ${targetIp} is already compromised.`];
    }

    // Check if already running
    const existingTool = Array.from(this.activeTools.values())
      .find(t => t.toolName === 'sshcrack' && t.targetIp === targetIp);
    
    if (existingTool) {
      const process = systemResourcesEnhanced.getProcess(existingTool.processId);
      if (process && process.status === 'running') {
        return [
          `SSHcrack already running on ${targetIp}`,
          `Progress: ${Math.round(process.progress)}%`,
          `CPU: ${process.cpuUsage}% | RAM: ${process.ramUsage}MB`
        ];
      }
    }

    try {
      // Start resource-intensive process
      const processId = systemResourcesEnhanced.startProcess({
        name: `SSHcrack ${targetIp}`,
        cpuUsage: 25,
        ramUsage: 512,
        networkUsage: 30,
        duration: 8000, // 8 seconds
        onProgress: (progress) => {
          console.log(`[SSHcrack] Progress: ${Math.round(progress)}%`);
        },
        onComplete: () => {
          this.completeSSHCrack(targetIp);
        }
      });

      this.activeTools.set(`sshcrack_${targetIp}`, {
        processId,
        targetIp,
        toolName: 'sshcrack',
        onComplete: (success) => {
          this.notifyToolCompletion('sshcrack', targetIp, success);
        }
      });

      return [
        `SSHcrack started on ${targetIp}`,
        `Attempting to crack SSH port 22...`,
        `CPU Usage: 25% | RAM Usage: 512MB`,
        `Estimated time: 8 seconds`,
        '',
        'Use "ps" to monitor progress',
        'Process will complete automatically'
      ];

    } catch (error) {
      return [
        'Error: Insufficient system resources',
        'Close other processes or wait for them to complete',
        'Use "ps" to see running processes',
        'Use "kill <pid>" to terminate processes'
      ];
    }
  }

  private static async executeFTPBounce(args: string[]): Promise<string[]> {
    if (args.length === 0) {
      return ['Usage: ftpbounce <target_ip>'];
    }

    const targetIp = args[0];
    const targetNode = networkSystemEnhanced.getNode(targetIp);
    
    if (!targetNode || !targetNode.discovered) {
      return [`Target ${targetIp} not found or not discovered.`];
    }

    try {
      const processId = systemResourcesEnhanced.startProcess({
        name: `FTPBounce ${targetIp}`,
        cpuUsage: 15,
        ramUsage: 256,
        networkUsage: 20,
        duration: 5000,
        onComplete: () => {
          this.completeFTPBounce(targetIp);
        }
      });

      this.activeTools.set(`ftpbounce_${targetIp}`, {
        processId,
        targetIp,
        toolName: 'ftpbounce',
        onComplete: (success) => {
          this.notifyToolCompletion('ftpbounce', targetIp, success);
        }
      });

      return [
        `FTPBounce started on ${targetIp}`,
        `Exploiting FTP service on port 21...`,
        `CPU Usage: 15% | RAM Usage: 256MB`,
        `Estimated time: 5 seconds`
      ];

    } catch (error) {
      return ['Error: Insufficient system resources'];
    }
  }

  private static async executeWebServerWorm(args: string[]): Promise<string[]> {
    if (args.length === 0) {
      return ['Usage: webserverworm <target_ip>'];
    }

    const targetIp = args[0];
    const targetNode = networkSystemEnhanced.getNode(targetIp);
    
    if (!targetNode || !targetNode.discovered) {
      return [`Target ${targetIp} not found or not discovered.`];
    }

    try {
      const processId = systemResourcesEnhanced.startProcess({
        name: `WebServerWorm ${targetIp}`,
        cpuUsage: 20,
        ramUsage: 384,
        networkUsage: 40,
        duration: 12000,
        onComplete: () => {
          this.completeWebServerWorm(targetIp);
        }
      });

      return [
        `WebServerWorm started on ${targetIp}`,
        `Exploiting HTTP service on port 80...`,
        `CPU Usage: 20% | RAM Usage: 384MB`,
        `Estimated time: 12 seconds`
      ];

    } catch (error) {
      return ['Error: Insufficient system resources'];
    }
  }

  private static completeSSHCrack(targetIp: string) {
    const success = Math.random() > 0.25; // 75% success rate
    
    if (success) {
      const crackSuccess = networkSystemEnhanced.crackPort(targetIp, 22);
      
      if (crackSuccess) {
        const canCompromise = networkSystemEnhanced.canCompromiseNode(targetIp);
        if (canCompromise) {
          networkSystemEnhanced.compromiseNode(targetIp);
          
          const gameStateUpdater = terminalCore.getGameStateUpdater();
          if (gameStateUpdater) {
            const compromisedNodes = networkSystemEnhanced.getAllNodes()
              .filter(n => n.compromised)
              .map(n => n.ip);
            
            gameStateUpdater({
              compromisedNodes,
              crackedPorts: [...(terminalCore.getGameState()?.crackedPorts || []), `${targetIp}:22`]
            });
          }

          gameCore.notifyNodeCompromised(targetIp);
          console.log(`[SSHcrack] Successfully compromised ${targetIp}`);
        }
      }
    }

    this.activeTools.delete(`sshcrack_${targetIp}`);
  }

  private static completeFTPBounce(targetIp: string) {
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      networkSystemEnhanced.crackPort(targetIp, 21);
    }

    this.activeTools.delete(`ftpbounce_${targetIp}`);
  }

  private static completeWebServerWorm(targetIp: string) {
    const success = Math.random() > 0.4; // 60% success rate
    
    if (success) {
      networkSystemEnhanced.crackPort(targetIp, 80);
    }

    this.activeTools.delete(`webserverworm_${targetIp}`);
  }

  private static notifyToolCompletion(toolName: string, targetIp: string, success: boolean) {
    console.log(`[HackingToolsEnhanced] ${toolName} completed on ${targetIp}: ${success ? 'SUCCESS' : 'FAILED'}`);
  }

  static getActiveTools(): Array<{ processId: string; targetIp: string; toolName: string }> {
    return Array.from(this.activeTools.values());
  }

  static killTool(targetIp: string, toolName: string): boolean {
    const toolKey = `${toolName}_${targetIp}`;
    const tool = this.activeTools.get(toolKey);
    
    if (tool) {
      systemResourcesEnhanced.killProcess(tool.processId);
      this.activeTools.delete(toolKey);
      return true;
    }
    
    return false;
  }

  static isValidTool(command: string): boolean {
    const validTools = ['sshcrack', 'SSHcrack.exe', 'ftpbounce', 'FTPBounce.exe', 'webserverworm', 'WebServerWorm.exe'];
    return validTools.some(tool => 
      tool.toLowerCase() === command.toLowerCase() || 
      tool.toLowerCase().replace('.exe', '') === command.toLowerCase()
    );
  }
}

export const hackingToolsEnhanced = new HackingToolsEnhanced();
