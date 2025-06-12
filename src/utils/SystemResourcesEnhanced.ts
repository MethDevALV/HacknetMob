
import { ProcessInfo, ResourceStats } from '../types/CoreTypes';

interface ProcessConfig {
  name: string;
  cpuUsage?: number;
  ramUsage?: number;
  networkUsage?: number;
  duration?: number;
  priority?: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export class SystemResourceManager {
  private runningProcesses: ProcessInfo[] = [];
  private listeners: ((resources: ResourceStats) => void)[] = [];

  constructor() {
    // Initialize some base processes
    this.startProcess({ name: 'System Monitor', cpuUsage: 2, ramUsage: 50 });
    this.startProcess({ name: 'Network Service', cpuUsage: 1, ramUsage: 30 });
    this.startProcess({ name: 'Firewall', cpuUsage: 3, ramUsage: 80 });
    
    // Update resources periodically
    setInterval(() => {
      this.updateResources();
    }, 1000);
  }

  getAllProcesses(): ProcessInfo[] {
    return this.runningProcesses;
  }

  getProcess(pid: string): ProcessInfo | undefined {
    return this.runningProcesses.find(p => p.id === pid);
  }

  killProcess(pid: string): boolean {
    const index = this.runningProcesses.findIndex(p => p.id === pid);
    if (index === -1) {
      return false;
    }
    this.runningProcesses.splice(index, 1);
    return true;
  }

  startProcess(config: ProcessConfig): string {
    const processId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newProcess: ProcessInfo = {
      id: processId,
      name: config.name,
      status: 'running',
      priority: config.priority || 1,
      startTime: Date.now(),
      cpuUsage: config.cpuUsage || Math.random() * 10,
      ramUsage: config.ramUsage || Math.random() * 100 + 50,
      networkUsage: config.networkUsage || Math.random() * 50,
      duration: config.duration || 0,
      progress: 0,
      onProgress: config.onProgress,
      onComplete: config.onComplete,
      cpu: config.cpuUsage || Math.random() * 10,
      memory: config.ramUsage || Math.random() * 100 + 50
    };
    
    this.runningProcesses.push(newProcess);

    // If duration is set, auto-complete after duration
    if (config.duration && config.duration > 0) {
      setTimeout(() => {
        this.completeProcess(processId);
      }, config.duration);
    }

    return processId;
  }

  private completeProcess(processId: string) {
    const process = this.getProcess(processId);
    if (process && process.onComplete) {
      process.onComplete();
    }
    this.killProcess(processId);
  }

  getResources(): ResourceStats {
    const cpu = this.runningProcesses.reduce((acc, p) => acc + p.cpuUsage, 0);
    const ram = this.runningProcesses.reduce((acc, p) => acc + (p.ramUsage || 0), 0);
    const network = this.runningProcesses.reduce((acc, p) => acc + (p.networkUsage || 0), 0);
    
    return {
      cpu: { current: Math.min(cpu, 100), max: 100 },
      ram: { current: Math.min(ram, 8192), max: 8192 },
      memory: { current: Math.min(ram, 8192), max: 8192 },
      network: { current: Math.min(network, 1000), max: 1000 },
      temperature: { current: 35 + (cpu * 0.5), max: 85 },
      activeProcesses: this.runningProcesses.length
    };
  }

  getCpuUsage(): number {
    const resources = this.getResources();
    return resources.cpu.current;
  }

  getRamUsage(): number {
    const resources = this.getResources();
    return (resources.ram.current / resources.ram.max) * 100;
  }

  onResourceChange(callback: (resources: ResourceStats) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private updateResources(): void {
    const resources = this.getResources();
    this.listeners.forEach(callback => callback(resources));
  }
}

export const systemResourcesEnhanced = new SystemResourceManager();
export const systemResourceManager = systemResourcesEnhanced;
