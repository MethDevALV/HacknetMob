
// Core HackNet game types - Complete recreation
export interface GameState {
  // Core system
  currentNode: string;
  currentDirectory: string;
  homeDirectory: string;
  
  // Resources and performance
  totalRAM: number;
  usedRAM: number;
  cpuUsage: number;
  networkActivity: number;
  
  // Security and traces
  traceLevel: number;
  traceMultiplier: number;
  activeTraces: ActiveTrace[];
  
  // Network and nodes
  scannedNodes: string[];
  compromisedNodes: string[];
  discoveredDevices: NetworkNode[];
  connectedNodes: string[];
  
  // Player progression
  credits: number;
  experience: number;
  level: number;
  reputation: Record<string, number>;
  
  // Tools and files
  unlockedTools: string[];
  availableTools: HackingTool[];
  downloadedFiles: string[];
  deletedFiles: string[];
  uploadedFiles: string[];
  crackedPorts: string[];
  
  // Missions and story
  activeMissions: Mission[];
  completedMissions: string[];
  claimedRewards: string[];
  currentFaction: string | null;
  factionStandings: Record<string, FactionStanding>;
  
  // Events and logs
  eventLog: GameEvent[];
  systemLogs: SystemLog[];
  
  // Defense systems
  activeDefenses: ActiveDefense[];
  defenseHistory: DefenseAction[];
  
  // Tutorial progress
  tutorialStep: number;
  tutorialCompleted: boolean;
  hintsEnabled: boolean;
}

export interface NetworkNode {
  ip: string;
  hostname: string;
  type: NodeType;
  security: SecurityLevel;
  os: string;
  ports: Port[];
  files: FileEntry[];
  services: Service[];
  discovered: boolean;
  compromised: boolean;
  adminPassword?: string;
  firewallSolution?: string;
  proxyClocks?: number;
  links: string[];
}

export interface Port {
  number: number;
  service: string;
  open: boolean;
  cracked: boolean;
  version?: string;
}

export interface Service {
  name: string;
  port: number;
  vulnerable: boolean;
  exploitRequired?: string;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  encrypted?: boolean;
  password?: string;
  size: number;
  permissions: string;
  hidden?: boolean;
}

export interface HackingTool {
  id: string;
  name: string;
  displayName: string;
  description: string;
  usage: string;
  ramCost: number;
  executionTime: number;
  targetPort?: number;
  category: ToolCategory;
  unlockLevel: number;
  acquired: boolean;
  version: string;
}

export interface Mission {
  id: string;
  title: string;
  sender: string;
  subject: string;
  content: string;
  faction: string;
  difficulty: number;
  timeLimit?: number;
  goals: MissionGoal[];
  rewards: MissionReward;
  prerequisites: string[];
  status: 'available' | 'active' | 'completed' | 'failed';
  startTime?: number;
}

export interface MissionGoal {
  id: string;
  type: GoalType;
  description: string;
  target?: string;
  file?: string;
  value?: string | number;
  completed: boolean;
}

export interface MissionReward {
  credits: number;
  experience: number;
  tools?: string[];
  reputation?: Record<string, number>;
}

export interface ActiveTrace {
  id: string;
  source: string;
  strength: number;
  progress: number;
  startTime: number;
  type: 'passive' | 'active' | 'admin';
}

export interface ActiveDefense {
  id: string;
  type: DefenseType;
  strength: number;
  duration: number;
  startTime: number;
  cost: ResourceCost;
}

export interface DefenseAction {
  timestamp: number;
  type: DefenseType;
  success: boolean;
  cost: ResourceCost;
  effectiveness: number;
}

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  message: string;
  timestamp: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  read: boolean;
}

export interface SystemLog {
  timestamp: number;
  source: string;
  action: string;
  target?: string;
  success: boolean;
  details?: string;
}

export interface FactionStanding {
  name: string;
  reputation: number;
  rank: string;
  joined: boolean;
  hostility: number;
}

export interface ResourceCost {
  ram: number;
  cpu: number;
  time: number;
}

// Enums and type unions
export type NodeType = 
  | 'personal' 
  | 'corporate' 
  | 'government' 
  | 'academic' 
  | 'medical' 
  | 'military' 
  | 'banking' 
  | 'router' 
  | 'server' 
  | 'mainframe';

export type SecurityLevel = 
  | 'none' 
  | 'basic' 
  | 'standard' 
  | 'high' 
  | 'maximum' 
  | 'unhackable';

export type ToolCategory = 
  | 'port_hack' 
  | 'file_ops' 
  | 'analysis' 
  | 'defense' 
  | 'stealth' 
  | 'social';

export type GoalType = 
  | 'connect' 
  | 'hack' 
  | 'delete' 
  | 'download' 
  | 'upload' 
  | 'modify' 
  | 'scan' 
  | 'acquire_tool';

export type DefenseType = 
  | 'firewall' 
  | 'proxy' 
  | 'killer' 
  | 'trace_killer' 
  | 'decryptor' 
  | 'sequencer';

export type EventType = 
  | 'mission' 
  | 'trace' 
  | 'hack_success' 
  | 'hack_failure' 
  | 'defense' 
  | 'story';

// Tool definitions matching HackNet exactly
export const HACKNET_TOOLS: Record<string, HackingTool> = {
  'SSHcrack.exe': {
    id: 'sshcrack',
    name: 'SSHcrack.exe',
    displayName: 'SSH Crack',
    description: 'Cracks open SSH ports (port 22)',
    usage: 'SSHcrack.exe [target_ip]',
    ramCost: 50,
    executionTime: 2000,
    targetPort: 22,
    category: 'port_hack',
    unlockLevel: 1,
    acquired: true,
    version: '1.0'
  },
  'FTPBounce.exe': {
    id: 'ftpbounce',
    name: 'FTPBounce.exe',
    displayName: 'FTP Bounce',
    description: 'Cracks open FTP ports (port 21)',
    usage: 'FTPBounce.exe [target_ip]',
    ramCost: 40,
    executionTime: 1500,
    targetPort: 21,
    category: 'port_hack',
    unlockLevel: 1,
    acquired: false,
    version: '1.0'
  },
  'relaySMTP.exe': {
    id: 'relaysmtp',
    name: 'relaySMTP.exe',
    displayName: 'SMTP Relay',
    description: 'Cracks open SMTP ports (port 25)',
    usage: 'relaySMTP.exe [target_ip]',
    ramCost: 60,
    executionTime: 2500,
    targetPort: 25,
    category: 'port_hack',
    unlockLevel: 2,
    acquired: false,
    version: '1.0'
  },
  'WebServerWorm.exe': {
    id: 'webserverworm',
    name: 'WebServerWorm.exe',
    displayName: 'Web Server Worm',
    description: 'Cracks open HTTP ports (port 80)',
    usage: 'WebServerWorm.exe [target_ip]',
    ramCost: 80,
    executionTime: 3000,
    targetPort: 80,
    category: 'port_hack',
    unlockLevel: 3,
    acquired: false,
    version: '1.0'
  },
  'SQLBufferOverflow.exe': {
    id: 'sqlbufferoverflow',
    name: 'SQLBufferOverflow.exe',
    displayName: 'SQL Buffer Overflow',
    description: 'Cracks open SQL ports (port 1433)',
    usage: 'SQLBufferOverflow.exe [target_ip]',
    ramCost: 120,
    executionTime: 4000,
    targetPort: 1433,
    category: 'port_hack',
    unlockLevel: 4,
    acquired: false,
    version: '1.0'
  },
  'SSLTrojan.exe': {
    id: 'ssltrojan',
    name: 'SSLTrojan.exe',
    displayName: 'SSL Trojan',
    description: 'Cracks open HTTPS ports (port 443)',
    usage: 'SSLTrojan.exe [target_ip]',
    ramCost: 150,
    executionTime: 5000,
    targetPort: 443,
    category: 'port_hack',
    unlockLevel: 5,
    acquired: false,
    version: '1.0'
  },
  'Decypher.exe': {
    id: 'decypher',
    name: 'Decypher.exe',
    displayName: 'Decypherer',
    description: 'Decrypts .dec files',
    usage: 'Decypher.exe [filename]',
    ramCost: 90,
    executionTime: 3000,
    category: 'file_ops',
    unlockLevel: 5,
    acquired: false,
    version: '1.0'
  },
  'DECHead.exe': {
    id: 'dechead',
    name: 'DECHead.exe',
    displayName: 'DEC Head',
    description: 'Views encrypted .dec file headers',
    usage: 'DECHead.exe [filename]',
    ramCost: 50,
    executionTime: 1000,
    category: 'analysis',
    unlockLevel: 4,
    acquired: false,
    version: '1.0'
  },
  'TraceKill.exe': {
    id: 'tracekill',
    name: 'TraceKill.exe',
    displayName: 'Trace Killer',
    description: 'Removes all active traces',
    usage: 'TraceKill.exe',
    ramCost: 100,
    executionTime: 500,
    category: 'defense',
    unlockLevel: 6,
    acquired: false,
    version: '1.0'
  },
  'Sequencer.exe': {
    id: 'sequencer',
    name: 'Sequencer.exe',
    displayName: 'Sequencer',
    description: 'Bypasses sequence locks',
    usage: 'Sequencer.exe [sequence]',
    ramCost: 200,
    executionTime: 6000,
    category: 'stealth',
    unlockLevel: 8,
    acquired: false,
    version: '1.0'
  }
};
