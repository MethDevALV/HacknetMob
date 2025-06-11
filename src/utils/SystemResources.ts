export interface SystemResource {
  current: number;
  max: number;
  unit: string;
}

export interface SystemResources {
  cpu: SystemResource;
  ram: SystemResource;
  network: SystemResource;
  storage: SystemResource;
  temperature: SystemResource;
}

export interface ProcessInfo {
  id: string;
  name: string;
  cpuUsage: number;
  ramUsage: number;
  networkUsage: number;
  startTime: number;
  duration?: number;
  target?: string;
}

export class SystemResourceManager {
  private resources: SystemResources;
  private processes: Map<string, ProcessInfo> = new Map();
  private callbacks: Array<(resources: SystemResources) => void> = [];
  private reservedResources = { cpu: 0, ram: 0, network: 0 };

  constructor() {
    this.resources = {
      cpu: { current: 5, max: 100, unit: '%' },
      ram: { current: 1200, max: 8192, unit: 'MB' },
      network: { current: 0, max: 1000, unit: 'Mbps' },
      storage: { current: 2500, max: 500000, unit: 'MB' },
      temperature: { current: 35, max: 85, unit: '°C' }
    };

    // Start resource monitoring
    this.startMonitoring();
  }

  private startMonitoring() {
    setInterval(() => {
      this.updateResources();
      this.notifyCallbacks();
    }, 1000);
  }

  private updateResources() {
    // Calculate current usage from active processes
    let totalCpu = 5; // Base system usage
    let totalRam = 1200; // Base system usage
    let totalNetwork = 0;
    let totalTemp = 35; // Base temperature

    for (const [, process] of this.processes) {
      totalCpu += process.cpuUsage;
      totalRam += process.ramUsage;
      totalNetwork += process.networkUsage;
      
      // Temperature increases with CPU usage
      totalTemp += process.cpuUsage * 0.1;
    }

    // Add reserved resources
    totalCpu += this.reservedResources.cpu;
    totalRam += this.reservedResources.ram;
    totalNetwork += this.reservedResources.network;

    // Apply realistic fluctuations
    totalCpu += Math.random() * 2 - 1; // ±1% fluctuation
    totalTemp += Math.random() * 2 - 1; // ±1°C fluctuation

    this.resources.cpu.current = Math.max(5, Math.min(totalCpu, 100));
    this.resources.ram.current = Math.max(1200, Math.min(totalRam, this.resources.ram.max));
    this.resources.network.current = Math.max(0, Math.min(totalNetwork, this.resources.network.max));
    this.resources.temperature.current = Math.max(25, Math.min(totalTemp, this.resources.temperature.max));

    // Check for thermal throttling
    if (this.resources.temperature.current > 75) {
      // Reduce CPU performance
      this.resources.cpu.current *= 0.8;
    }
  }

  startProcess(processInfo: ProcessInfo): boolean {
    // Check if we have enough resources
    const futureRam = this.resources.ram.current + processInfo.ramUsage;
    const futureCpu = this.resources.cpu.current + processInfo.cpuUsage;
    
    if (futureRam > this.resources.ram.max) {
      return false; // Not enough RAM
    }

    if (futureCpu > 95) {
      return false; // CPU would be overloaded
    }

    this.processes.set(processInfo.id, {
      ...processInfo,
      startTime: Date.now()
    });

    return true;
  }

  stopProcess(processId: string): boolean {
    return this.processes.delete(processId);
  }

  getProcess(processId: string): ProcessInfo | undefined {
    return this.processes.get(processId);
  }

  getAllProcesses(): ProcessInfo[] {
    return Array.from(this.processes.values());
  }

  getProcessProgress(processId: string): number {
    const process = this.processes.get(processId);
    if (!process || !process.duration) return 0;

    const elapsed = Date.now() - process.startTime;
    return Math.min(elapsed / (process.duration * 1000), 1);
  }

  isProcessComplete(processId: string): boolean {
    return this.getProcessProgress(processId) >= 1;
  }

  getResources(): SystemResources {
    return { ...this.resources };
  }

  onResourceChange(callback: (resources: SystemResources) => void) {
    this.callbacks.push(callback);
  }

  removeResourceCallback(callback: (resources: SystemResources) => void) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.getResources()));
  }

  // Upgrade system resources
  upgradeRAM(newCapacity: number) {
    this.resources.ram.max = newCapacity;
  }

  // System stress simulation
  simulateStress(intensity: number) {
    const stressId = `stress_${Date.now()}`;
    this.startProcess({
      id: stressId,
      name: 'System Stress',
      cpuUsage: intensity * 20,
      ramUsage: intensity * 500,
      networkUsage: intensity * 100,
      startTime: Date.now(),
      duration: 30 // 30 seconds
    });

    // Remove after duration
    setTimeout(() => {
      this.stopProcess(stressId);
    }, 30000);
  }

  // New methods needed by CounterAttackSystemEnhanced
  reserveResources(cpu: number, ram: number, network: number = 0): boolean {
    const availableCpu = this.resources.cpu.max - this.resources.cpu.current;
    const availableRam = this.resources.ram.max - this.resources.ram.current;
    const availableNetwork = this.resources.network.max - this.resources.network.current;

    if (cpu > availableCpu || ram > availableRam || network > availableNetwork) {
      return false;
    }

    this.reservedResources.cpu += cpu;
    this.reservedResources.ram += ram;
    this.reservedResources.network += network;
    return true;
  }

  releaseResources(cpu: number, ram: number, network: number = 0) {
    this.reservedResources.cpu = Math.max(0, this.reservedResources.cpu - cpu);
    this.reservedResources.ram = Math.max(0, this.reservedResources.ram - ram);
    this.reservedResources.network = Math.max(0, this.reservedResources.network - network);
  }

  clearStress() {
    // Remove all stress-related processes
    const stressProcesses = Array.from(this.processes.entries())
      .filter(([, process]) => process.name.includes('Stress'))
      .map(([id]) => id);
    
    stressProcesses.forEach(id => this.stopProcess(id));
    
    // Clear reserved resources
    this.reservedResources = { cpu: 0, ram: 0, network: 0 };
  }
}

export const systemResourceManager = new SystemResourceManager();
