
import { systemResourceManager } from '../SystemResources';

export class SystemCommands {
  handlePs(): string[] {
    const processes = systemResourceManager.getAllProcesses();
    if (processes.length === 0) {
      return ['No active processes'];
    }

    const output = ['PID    NAME                 CPU%   TIME    STATUS'];
    processes.forEach((process, index) => {
      const progress = systemResourceManager.getProcessProgress(process.id);
      const status = progress >= 1 ? 'COMPLETE' : 'RUNNING';
      const runtime = Math.floor((Date.now() - process.startTime) / 1000);
      
      output.push(
        `${(index + 1).toString().padEnd(6)} ${process.name.padEnd(20)} ${process.cpuUsage.toString().padEnd(6)} ${runtime}s     ${status}`
      );
    });

    return output;
  }
}
