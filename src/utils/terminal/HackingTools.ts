
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { intrusionDetectionSystem } from '../../systems/IntrusionDetectionSystem';
import { terminalCore } from './TerminalCore';
import { gameCore } from '../../core/GameCore';

interface ToolProcess {
  id: string;
  toolName: string;
  targetIp: string;
  startTime: number;
  duration: number;
  progress: number;
  status: 'running' | 'completed' | 'failed';
}

export class HackingTools {
  private static activeProcesses: Map<string, ToolProcess> = new Map();

  static async executeHackingTool(toolName: string, args: string[]): Promise<string[]> {
    console.log(`[HackingTools] Executing tool: ${toolName} with args:`, args);
    
    const gameState = terminalCore.getGameState();
    
    // Lista de herramientas disponibles al inicio
    const availableTools = ['sshcrack', 'SSHcrack.exe', 'ftpbounce', 'FTPBounce.exe'];
    
    // Normalizar nombre de herramienta
    const normalizedTool = toolName.toLowerCase().replace('.exe', '');
    
    if (!availableTools.some(tool => tool.toLowerCase().replace('.exe', '') === normalizedTool)) {
      return [
        `Tool ${toolName} not found.`,
        'Available tools: SSHcrack.exe, FTPBounce.exe',
        'Usage: sshcrack <target_ip>'
      ];
    }

    // SSHcrack implementation
    if (normalizedTool === 'sshcrack') {
      if (args.length === 0) {
        return ['Usage: sshcrack <target_ip>'];
      }

      const targetIp = args[0];
      
      // Verificar que el nodo existe
      const targetNode = networkSystemEnhanced.getNode(targetIp);
      if (!targetNode) {
        return [`Target ${targetIp} not found. Use 'scan' to discover targets.`];
      }

      if (!targetNode.discovered) {
        return [`Target ${targetIp} not discovered. Use 'scan' first.`];
      }

      // Verificar si ya está ejecutándose
      const existingProcess = Array.from(HackingTools.activeProcesses.values())
        .find(p => p.toolName === 'sshcrack' && p.targetIp === targetIp && p.status === 'running');
      
      if (existingProcess) {
        const elapsed = Date.now() - existingProcess.startTime;
        const remaining = Math.max(0, existingProcess.duration - elapsed);
        return [
          `SSHcrack already running on ${targetIp}`,
          `Time remaining: ${Math.ceil(remaining / 1000)}s`
        ];
      }

      // Iniciar el proceso
      const processId = `sshcrack_${targetIp}_${Date.now()}`;
      const duration = 5000; // 5 segundos
      
      const process: ToolProcess = {
        id: processId,
        toolName: 'sshcrack',
        targetIp,
        startTime: Date.now(),
        duration,
        progress: 0,
        status: 'running'
      };

      HackingTools.activeProcesses.set(processId, process);
      
      // Ejecutar el proceso
      HackingTools.executeSSHCrack(processId, targetNode);

      return [
        `SSHcrack started on ${targetIp}`,
        `Attempting to crack SSH port 22...`,
        `Estimated time: ${duration / 1000}s`,
        'Use "ps" to monitor progress'
      ];
    }

    // FTPBounce implementation
    if (normalizedTool === 'ftpbounce') {
      if (args.length === 0) {
        return ['Usage: ftpbounce <target_ip>'];
      }

      const targetIp = args[0];
      const targetNode = networkSystemEnhanced.getNode(targetIp);
      
      if (!targetNode || !targetNode.discovered) {
        return [`Target ${targetIp} not found or not discovered.`];
      }

      return [
        `FTPBounce started on ${targetIp}`,
        `Attempting to exploit FTP service...`,
        'This tool is under development.'
      ];
    }

    return [`${toolName} executed (functionality pending)`];
  }

  private static async executeSSHCrack(processId: string, targetNode: any) {
    const process = HackingTools.activeProcesses.get(processId);
    if (!process) return;

    // Simular progreso
    const updateInterval = 1000;
    const totalSteps = process.duration / updateInterval;
    
    for (let step = 0; step < totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, updateInterval));
      
      const currentProcess = HackingTools.activeProcesses.get(processId);
      if (!currentProcess || currentProcess.status !== 'running') {
        return;
      }

      currentProcess.progress = ((step + 1) / totalSteps) * 100;
    }

    // Completar el proceso
    const success = Math.random() > 0.3; // 70% de éxito
    process.status = success ? 'completed' : 'failed';
    process.progress = 100;

    if (success) {
      // Crackear puerto SSH (22)
      const crackSuccess = networkSystemEnhanced.crackPort(targetNode.ip, 22);
      
      if (crackSuccess) {
        const canCompromise = networkSystemEnhanced.canCompromiseNode(targetNode.ip);
        if (canCompromise) {
          networkSystemEnhanced.compromiseNode(targetNode.ip);
          
          // Actualizar estado del juego
          const gameStateUpdater = terminalCore.getGameStateUpdater();
          if (gameStateUpdater) {
            const compromisedNodes = networkSystemEnhanced.getAllNodes()
              .filter(n => n.compromised)
              .map(n => n.ip);
            
            gameStateUpdater({
              compromisedNodes,
              crackedPorts: [...(terminalCore.getGameState().crackedPorts || []), `${targetNode.ip}:22`]
            });
          }

          // Notificar GameCore
          gameCore.notifyNodeCompromised(targetNode.ip);
        }
      }
    }

    // Limpiar proceso después de un delay
    setTimeout(() => {
      HackingTools.activeProcesses.delete(processId);
    }, 3000);
  }

  static getActiveProcesses(): ToolProcess[] {
    return Array.from(HackingTools.activeProcesses.values());
  }

  static killProcess(processId: string): boolean {
    const process = HackingTools.activeProcesses.get(processId);
    if (!process) return false;

    process.status = 'failed';
    HackingTools.activeProcesses.delete(processId);
    return true;
  }

  static isValidTool(command: string): boolean {
    const validTools = ['sshcrack', 'SSHcrack.exe', 'ftpbounce', 'FTPBounce.exe'];
    return validTools.some(tool => 
      tool.toLowerCase() === command.toLowerCase() || 
      tool.toLowerCase().replace('.exe', '') === command.toLowerCase()
    );
  }
}
