import { systemResourcesEnhanced } from '../SystemResourcesEnhanced';

export class SystemCommandsEnhanced {
  static ps(): string[] {
    const processes = systemResourcesEnhanced.getAllProcesses();
    return [
      'PID   CPU%  RAM    Name',
      '-------------------------',
      ...processes.map(proc => `${proc.id}   ${proc.cpuUsage.toFixed(1)}   ${proc.ramUsage.toFixed(0)}   ${proc.name}`)
    ];
  }

  static top(): string[] {
    const cpuUsage = systemResourcesEnhanced.getCpuUsage();
    const ramUsage = systemResourcesEnhanced.getRamUsage();
    return [
      `CPU Usage: ${cpuUsage.toFixed(1)}%`,
      `RAM Usage: ${ramUsage.toFixed(1)}%`
    ];
  }

  static handlePs(): string[] {
    return SystemCommandsEnhanced.ps();
  }

  static handleKill(args: string[]): string[] {
    const pid = args[0];
    if (!pid) {
      return ['Usage: kill <pid>'];
    }
    
    const success = systemResourcesEnhanced.killProcess(pid);
    if (success) {
      return [`Process ${pid} terminated.`];
    } else {
      return [`Failed to terminate process ${pid}.`];
    }
  }

  netstat(): string[] {
    return [
      'Active Network Connections:',
      'Proto  Local Address          Foreign Address        State',
      'TCP    0.0.0.0:22            0.0.0.0:0              LISTENING',
      'TCP    127.0.0.1:3000        0.0.0.0:0              LISTENING',
      'UDP    0.0.0.0:53            *:*                    LISTENING'
    ];
  }
}
