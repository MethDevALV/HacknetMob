
import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Thermometer, Zap } from 'lucide-react';
import { systemResourcesEnhanced } from '../utils/SystemResourcesEnhanced';
import { ResourceStats, ProcessInfo } from '../types/CoreTypes';

export const ResourceMonitorEnhanced: React.FC = () => {
  const [resources, setResources] = useState<ResourceStats>({
    cpu: { current: 0, max: 100 },
    ram: { current: 0, max: 8192 },
    memory: { current: 0, max: 8192 },
    network: { current: 0, max: 1000 },
    temperature: { current: 35, max: 85 },
    activeProcesses: 0
  });
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  useEffect(() => {
    const updateData = () => {
      setResources(systemResourcesEnhanced.getResources());
      setProcesses(systemResourcesEnhanced.getAllProcesses());
    };

    updateData();
    const unsubscribe = systemResourcesEnhanced.onResourceChange(updateData);
    
    return unsubscribe;
  }, []);

  const getPercentage = (current: number, max: number): number => {
    return Math.min((current / max) * 100, 100);
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage < 30) return 'text-green-400 border-green-400';
    if (percentage < 70) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const ResourceBar: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    current: number; 
    max: number; 
    unit?: string;
  }> = ({ icon, label, current, max, unit = '' }) => {
    const percentage = getPercentage(current, max);
    const colorClass = getStatusColor(percentage);
    
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-gray-300">{label}</span>
          </div>
          <span className={`text-sm font-mono ${colorClass.split(' ')[0]}`}>
            {current.toFixed(1)}{unit}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${colorClass.includes('green') ? 'bg-green-400' : colorClass.includes('yellow') ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 border rounded-lg" style={{
      backgroundColor: 'var(--theme-surface)',
      borderColor: 'var(--theme-border)',
      color: 'var(--theme-text)'
    }}>
      {/* Header */}
      <div className="mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <h3 className="cyber-heading text-lg">SYSTEM RESOURCES</h3>
      </div>

      {/* Resource Bars */}
      <div className="flex-1 space-y-4">
        <ResourceBar
          icon={<Cpu className="w-4 h-4 text-cyan-400" />}
          label="CPU Usage"
          current={resources.cpu.current}
          max={resources.cpu.max}
          unit="%"
        />
        
        <ResourceBar
          icon={<HardDrive className="w-4 h-4 text-cyan-400" />}
          label="RAM Usage"
          current={resources.ram.current}
          max={resources.ram.max}
          unit="MB"
        />
        
        <ResourceBar
          icon={<Activity className="w-4 h-4 text-cyan-400" />}
          label="Network"
          current={resources.network.current}
          max={resources.network.max}
          unit="kb/s"
        />
        
        <ResourceBar
          icon={<Thermometer className="w-4 h-4 text-cyan-400" />}
          label="Temperature"
          current={resources.temperature.current}
          max={resources.temperature.max}
          unit="°C"
        />

        {/* Process Count */}
        <div className="flex items-center justify-between p-2 border rounded" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Active Processes</span>
          </div>
          <span className="text-sm font-mono text-cyan-400">
            {resources.activeProcesses}
          </span>
        </div>

        {/* Top Processes */}
        {processes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Running Processes</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {processes.slice(0, 5).map((process) => (
                <div key={process.id} className="flex justify-between text-xs">
                  <span className="text-gray-400 truncate">{process.name}</span>
                  <span className="text-cyan-400">{process.cpuUsage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceMonitorEnhanced;
