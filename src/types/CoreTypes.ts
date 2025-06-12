
export interface FileEntry {
  name: string;
  type: 'file' | 'directory';
  size: number;
  permissions: string;
  content?: string;
  lastModified: Date;
  encrypted?: boolean;
  hidden?: boolean;
  modified?: string;
  path?: string;
}

export interface ResourceStat {
  current: number;
  max: number;
}

export interface ResourceStats {
  cpu: ResourceStat;
  ram: ResourceStat;
  memory: ResourceStat;
  network: ResourceStat;
  temperature: ResourceStat;
  disk?: ResourceStat;
  activeProcesses: number;
}

export interface ProcessInfo {
  id: string;
  name: string;
  cpu: number;
  cpuUsage: number;
  memory: number;
  ramUsage?: number;
  networkUsage?: number;
  status: 'running' | 'stopped' | 'sleeping';
  startTime?: number;
  duration?: number;
  progress?: number;
  priority?: number;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  hostname: string;
  type: 'server' | 'workstation' | 'router' | 'database' | 'firewall' | 'personal';
  os?: string;
  security: 'low' | 'medium' | 'high';
  openPorts: number[];
  services: string[];
  compromised: boolean;
  discovered: boolean;
  connections: string[];
  x: number;
  y: number;
  files?: FileEntry[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  organization?: string;
  ports: Array<{
    number: number;
    service: string;
    open: boolean;
    cracked: boolean;
    version: string;
  }>;
  links: string[];
}

export interface HackingTool {
  id: string;
  name: string;
  type: 'port_scanner' | 'exploit' | 'defense' | 'utility';
  description: string;
  targetPort?: number;
  targetPorts?: number[];
  executionTime: number;
  successRate: number;
  ramUsage: number;
  ramCost: number;
  cpuUsage: number;
  unlocked: boolean;
  level: number;
  acquired?: boolean;
}

export interface MissionReward {
  credits: number;
  experience: number;
  tools?: string[];
  reputation?: { [faction: string]: number };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  briefing: string;
  objective: string;
  objectives: string[];
  reward: MissionReward;
  difficulty: 'tutorial' | 'easy' | 'medium' | 'hard';
  completed: boolean;
  faction: 'bit' | 'entropy' | 'naix' | 'csec' | 'el' | 'final';
  sender: string;
  prerequisites?: string[];
  timeLimit?: number;
  missionFiles?: string[];
  completionConditions?: Array<{
    type: string;
    target?: string;
    port?: string;
    file?: string;
  }>;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'warning' | 'system' | 'success';
  content: string;
  timestamp: Date;
}

export interface DefenseResult {
  success: boolean;
  message: string;
  ramCost?: number;
  type: string;
  timestamp: Date;
  blocked?: boolean;
  counterAttack?: boolean;
  damage?: number;
}

export interface DefenseSystem {
  id: string;
  name: string;
  active: boolean;
  ramCost: number;
  effectiveness: number;
}

export interface ActiveDefense {
  id: string;
  name: string;
  active: boolean;
  ramCost: number;
  effectiveness: number;
}

export interface EventLogEntry {
  id?: string;
  timestamp: Date;
  type: string;
  title: string;
  message: string;
  description?: string;
  severity?: string;
  read?: boolean;
}

export interface SystemLogEntry {
  timestamp: Date;
  source: string;
  action: string;
  details: string;
}

export interface SystemLog {
  timestamp: Date;
  source: string;
  action: string;
  details: string;
}

export interface ConsequenceResult {
  traceIncrease: number;
  forceDisconnect: boolean;
  ramPenalty?: number;
  creditsPenalty?: number;
  lockout?: number;
}

export interface GameEvent {
  id: string;
  type: string;
  timestamp: Date;
  title?: string;
  data: any;
}

export interface GameState {
  currentNode: string;
  currentDirectory: string;
  homeDirectory: string;
  discoveredDevices: NetworkNode[];
  compromisedNodes: string[];
  traceLevel: number;
  traceMultiplier: number;
  activeTraces: string[];
  totalRAM: number;
  usedRAM: number;
  cpuUsage: number;
  networkActivity: number;
  credits: number;
  experience: number;
  level: number;
  reputation: { [faction: string]: number };
  activeMissions: string[];
  completedMissions: string[];
  claimedRewards: string[];
  executedCommands: string[];
  crackedPorts: string[];
  connectedNodes: string[];
  scannedNodes: string[];
  downloadedFiles: string[];
  deletedFiles: string[];
  uploadedFiles: string[];
  modifiedFiles: string[];
  unlockedTools: string[];
  availableTools: HackingTool[];
  currentFaction: string | null;
  factionStandings: { [faction: string]: number };
  eventLog: EventLogEntry[];
  systemLogs: SystemLogEntry[];
  activeDefenses: DefenseSystem[];
  defenseHistory: DefenseResult[];
  tutorialStep: number;
  tutorialCompleted: boolean;
  hintsEnabled: boolean;
  systemLockout?: number;
}

export const HACKNET_TOOLS: Record<string, HackingTool> = {
  ssh_crack: {
    id: 'ssh_crack',
    name: 'SSH Crack',
    type: 'port_scanner',
    description: 'Cracks SSH authentication on port 22',
    targetPort: 22,
    executionTime: 5000,
    successRate: 0.8,
    ramUsage: 50,
    ramCost: 50,
    cpuUsage: 25,
    unlocked: true,
    level: 1
  },
  ftp_bounce: {
    id: 'ftp_bounce',
    name: 'FTP Bounce',
    type: 'port_scanner',
    description: 'Exploits FTP bounce vulnerability on port 21',
    targetPort: 21,
    executionTime: 3000,
    successRate: 0.9,
    ramUsage: 30,
    ramCost: 30,
    cpuUsage: 15,
    unlocked: false,
    level: 1
  },
  web_server_worm: {
    id: 'web_server_worm',
    name: 'Web Server Worm',
    type: 'exploit',
    description: 'Exploits web server vulnerabilities on port 80',
    targetPort: 80,
    executionTime: 8000,
    successRate: 0.7,
    ramUsage: 80,
    ramCost: 80,
    cpuUsage: 35,
    unlocked: false,
    level: 2
  }
};
