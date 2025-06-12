
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, Trash2, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  details?: any;
}

export const LogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsRef = useRef<HTMLDivElement>(null);

  // Mock log generation for demo
  useEffect(() => {
    const generateMockLogs = () => {
      const sources = ['Terminal', 'Network', 'FileSystem', 'Security', 'GameCore'];
      const levels = ['info', 'warning', 'error', 'debug'] as const;
      const messages = [
        'System initialized successfully',
        'Network scan completed',
        'File access granted',
        'Security protocol activated',
        'Connection established',
        'Warning: High trace level detected',
        'Error: Failed to connect to node',
        'Debug: Variable state changed',
        'Mission completed successfully',
        'Tool unlocked: SSHcrack.exe'
      ];

      const newLogs: LogEntry[] = [];
      for (let i = 0; i < 50; i++) {
        newLogs.push({
          id: `log-${Date.now()}-${i}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
          level: levels[Math.floor(Math.random() * levels.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          details: Math.random() > 0.7 ? { nodeId: 'test', userId: 'player' } : undefined
        });
      }

      setLogs(newLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    };

    generateMockLogs();

    // Simulate real-time logs
    const interval = setInterval(() => {
      const sources = ['Terminal', 'Network', 'FileSystem', 'Security', 'GameCore'];
      const levels = ['info', 'warning', 'error', 'debug'] as const;
      const messages = [
        'Real-time log entry',
        'Network activity detected',
        'System monitoring active',
        'Background process running'
      ];

      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs(prev => [newLog, ...prev]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, sourceFilter]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logsRef.current) {
      logsRef.current.scrollTop = 0;
    }
  }, [filteredLogs, autoScroll]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      case 'debug': return 'text-gray-400';
      default: return 'text-theme-text';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500/10';
      case 'warning': return 'bg-yellow-500/10';
      case 'info': return 'bg-blue-500/10';
      case 'debug': return 'bg-gray-500/10';
      default: return 'bg-theme-surface';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const data = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hacknet-logs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const refreshLogs = () => {
    // In a real implementation, this would fetch fresh logs
    console.log('Refreshing logs...');
  };

  const uniqueSources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 bg-theme-surface border-b border-theme-border space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-textSecondary" size={16} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text placeholder-theme-textSecondary focus:outline-none focus:border-theme-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text focus:outline-none focus:border-theme-primary"
          >
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text focus:outline-none focus:border-theme-primary"
          >
            <option value="all">All Sources</option>
            {uniqueSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 px-3 py-2">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="w-4 h-4 text-theme-primary"
            />
            <span className="text-sm text-theme-text">Auto-scroll</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={refreshLogs}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>

        {/* Stats */}
        <div className="text-sm text-theme-textSecondary">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </div>

      {/* Logs */}
      <div ref={logsRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className={`p-3 rounded-lg border border-theme-border/30 ${getLevelBg(log.level)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-sm font-medium text-theme-text">
                  {log.source}
                </span>
              </div>
              <span className="text-xs text-theme-textSecondary">
                {log.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <p className="text-sm text-theme-text font-mono">
              {log.message}
            </p>
            
            {log.details && (
              <div className="mt-2 p-2 bg-theme-background/50 rounded text-xs font-mono">
                <pre className="text-theme-textSecondary">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
