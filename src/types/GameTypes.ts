
// Core game types for HackNet Mobile
export interface GameState {
  // Core system
  currentNode: string;
  currentDirectory: string;
  
  // Resources
  totalRAM: number;
  usedRAM: number;
  cpuUsage: number;
  networkActivity: number;
  
  // Security & traces
  traceLevel: number;
  traceMultiplier: number;
  
  // Network
  scannedNodes: string[];
  compromisedNodes: string[];
  discoveredDevices: Device[];
  
  // Player progress
  credits: number;
  experience: number;
  level: number;
  unlockedTools: string[];
  
  // Missions & story
  activeMissions: string[];
  completedMissions: string[];
  claimedRewards: string[];
  
  // Files & operations
  downloadedFiles: string[];
  deletedFiles: string[];
  uploadedFiles: string[];
  executedCommands: string[];
  modifiedFiles: string[];
  
  // Factions & events
  factions: Record<string, FactionData>;
  eventLog: GameEvent[];
  
  // Mobile-specific
  adaptiveUI?: AdaptiveUIConfig;
  lastEventCheck?: number;
  systemLockout?: number;
}

export interface Device {
  ip: string;
  hostname: string;
  type: string;
  security: string;
  os: string;
  discovered: boolean;
  compromised: boolean;
  ports?: number[];
  files?: string[];
}

export interface FactionData {
  reputation: number;
  joined: boolean;
  rank?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  type: 'security' | 'story' | 'system';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  active?: boolean;
}

export interface AdaptiveUIConfig {
  terminalRows: number;
  maxVisibleDevices: number;
  compactPanels: boolean;
  fontSize: string;
  buttonSize: 'small' | 'medium' | 'large';
  spacing: 'tight' | 'normal' | 'comfortable';
}

export interface DefenseResult {
  success: boolean;
  message: string;
  duration?: number;
  resourceCost?: {
    cpu: number;
    ram: number;
  };
  effectiveness?: number;
  cooldown?: number;
}

export interface ConsequenceResult {
  traceIncrease: number;
  forceDisconnect: boolean;
  ramPenalty?: number;
  creditsPenalty?: number;
  lockout?: number;
}
