import { BrowserEventEmitter } from '../utils/BrowserEventEmitter';
import { Mission, GameState } from '../types/CoreTypes';

interface MissionObjective {
  id: string;
  type: 'command_executed' | 'port_cracked' | 'node_connected' | 'node_compromised' | 'file_downloaded';
  description: string;
  target: string;
  completed: boolean;
  required: boolean;
}

interface MissionReward {
  credits: number;
  experience: number;
  tools?: string[];
  reputation?: { [faction: string]: number };
}

interface EnhancedMission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
  reward: MissionReward;
  difficulty: 'easy' | 'medium' | 'hard';
  unlockLevel: number;
  completed: boolean;
}

export class MissionEngine extends BrowserEventEmitter {
  private missions: Map<string, EnhancedMission> = new Map();
  private activeMissions: string[] = [];

  constructor() {
    super();
    this.initializeDefaultMissions();
  }

  private initializeDefaultMissions() {
    const defaultMissions: EnhancedMission[] = [
      {
        id: 'tutorial_01',
        title: 'First Steps',
        description: 'Learn basic commands and scan the network',
        objectives: [
          {
            id: 'scan_network',
            type: 'command_executed',
            description: 'Execute scan command to discover devices',
            target: 'scan',
            completed: false,
            required: true
          },
          {
            id: 'connect_device',
            type: 'node_connected',
            description: 'Connect to any discovered device',
            target: 'any',
            completed: false,
            required: true
          }
        ],
        reward: {
          credits: 100,
          experience: 50
        },
        difficulty: 'easy',
        unlockLevel: 1,
        completed: false
      },
      {
        id: 'first_hack',
        title: 'First Hack',
        description: 'Compromise your first target',
        objectives: [
          {
            id: 'crack_ssh',
            type: 'port_cracked',
            description: 'Crack SSH port on any device',
            target: '22',
            completed: false,
            required: true
          },
          {
            id: 'compromise_node',
            type: 'node_compromised',
            description: 'Successfully compromise a device',
            target: 'any',
            completed: false,
            required: true
          }
        ],
        reward: {
          credits: 250,
          experience: 100
        },
        difficulty: 'medium',
        unlockLevel: 1,
        completed: false
      }
    ];

    defaultMissions.forEach(mission => {
      this.missions.set(mission.id, mission);
    });
  }

  initialize(activeMissions: string[]) {
    this.activeMissions = activeMissions;
    console.log('[MissionEngine] Initialized with missions:', this.activeMissions);
  }

  tick(gameState: GameState) {
    // Check objectives for active missions
    this.activeMissions.forEach(missionId => {
      const mission = this.missions.get(missionId);
      if (mission && !mission.completed) {
        this.checkMissionObjectives(mission, gameState);
      }
    });
  }

  private checkMissionObjectives(mission: EnhancedMission, gameState: GameState) {
    let missionCompleted = true;

    mission.objectives.forEach(objective => {
      if (!objective.completed) {
        const completed = this.checkObjective(objective, gameState);
        objective.completed = completed;
      }
      
      if (objective.required && !objective.completed) {
        missionCompleted = false;
      }
    });

    if (missionCompleted && !mission.completed) {
      mission.completed = true;
      this.emit('missionCompleted', mission);
    }
  }

  private checkObjective(objective: MissionObjective, gameState: GameState): boolean {
    switch (objective.type) {
      case 'command_executed':
        return gameState.executedCommands?.includes(objective.target) || false;
      
      case 'port_cracked':
        return gameState.crackedPorts?.some(port => port.includes(`:${objective.target}`)) || false;
      
      case 'node_connected':
        return gameState.connectedNodes?.length > 0 || false;
      
      case 'node_compromised':
        return gameState.compromisedNodes?.length > 1 || false; // More than localhost
      
      case 'file_downloaded':
        return gameState.downloadedFiles?.includes(objective.target) || false;
      
      default:
        return false;
    }
  }

  checkObjectives(gameState: GameState) {
    this.tick(gameState);
  }

  getMission(missionId: string): EnhancedMission | undefined {
    return this.missions.get(missionId);
  }

  getActiveMissions(): EnhancedMission[] {
    return this.activeMissions.map(id => this.missions.get(id)).filter(Boolean) as EnhancedMission[];
  }
}
