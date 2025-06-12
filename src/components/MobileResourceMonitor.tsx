
import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Thermometer } from 'lucide-react';
import { systemResourcesEnhanced } from '../utils/SystemResourcesEnhanced';
import { ResourceStats } from '../types/CoreTypes';

export const MobileResourceMonitor: React.FC = () => {
  const [resources, setResources] = useState<ResourceStats>({
    cpu: { current: 0, max: 100 },
    ram: { current: 0, max: 8192 },
    memory: { current: 0, max: 8192 },
    network: { current: 0, max: 1000 },
    temperature: { current: 35, max: 85 },
    activeProcesses: 0
  });

  useEffect(() => {
    const updateResources = () => {
      setResources(systemResourcesEnhanced.getResources());
    };

    updateResources();
    const unsubscribe = systemResourcesEnhanced.onResourceChange(updateResources);
    
    return unsubscribe;
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const getStatusColor = (current: number, max: number): string => {
    const percentage = (current / max) * 100;
    if (percentage < 30) return 'text-green-400';
    if (percentage < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-2 gap-2 p-2 bg-gray-900 rounded border border-cyan-500">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <div className="flex-1">
          <div className="text-xs text-gray-300">CPU</div>
          <div className={`text-sm font-mono ${getStatusColor(resources.cpu.current, resources.cpu.max)}`}>
            {resources.cpu.current.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <HardDrive className="w-4 h-4 text-cyan-400" />
        <div className="flex-1">
          <div className="text-xs text-gray-300">RAM</div>
          <div className={`text-sm font-mono ${getStatusColor(resources.ram.current, resources.ram.max)}`}>
            {formatBytes(resources.ram.current)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <div className="flex-1">
          <div className="text-xs text-gray-300">NET</div>
          <div className={`text-sm font-mono ${getStatusColor(resources.network.current, resources.network.max)}`}>
            {resources.network.current.toFixed(0)}kb/s
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-cyan-400" />
        <div className="flex-1">
          <div className="text-xs text-gray-300">TEMP</div>
          <div className={`text-sm font-mono ${getStatusColor(resources.temperature.current, resources.temperature.max)}`}>
            {resources.temperature.current.toFixed(0)}°C
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileResourceMonitor;
