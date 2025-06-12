
import { BrowserEventEmitter } from '../utils/BrowserEventEmitter';
import { Mission, HackingTool, GameState } from '../types/CoreTypes';
import { NetworkManager } from './NetworkManager';
import { FileSystemManager } from './FileSystemManager';
import { MissionEngine } from './MissionEngine';
import { ToolsManager } from './ToolsManager';
import { DetectionSystem } from './DetectionSystem';
import { hackNetCommands } from './HackNetCommands';
import { systemResourcesEnhanced } from '../utils/SystemResourcesEnhanced';

export class HackNetEngine extends BrowserEventEmitter {
  private static instance: HackNetEngine;
  private networkManager: NetworkManager;
  private fileSystemManager: FileSystemManager;
  private missionEngine: MissionEngine;
  private toolsManager: ToolsManager;
  private detectionSystem: DetectionSystem;
  private gameState: GameState | null = null;
  private updateGameState: ((updates: Partial<GameState>) => void) | null = null;
  private gameLoop: number | null = null;

  private constructor() {
    super();
    this.networkManager = new NetworkManager();
    this.fileSystemManager = new FileSystemManager();
    this.missionEngine = new MissionEngine();
    this.toolsManager = new ToolsManager();
    this.detectionSystem = new DetectionSystem();
    
    this.setupEventHandlers();
  }

  static getInstance(): HackNetEngine {
    if (!HackNetEngine.instance) {
      HackNetEngine.instance = new HackNetEngine();
    }
    return HackNetEngine.instance;
  }

  initialize(gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    this.gameState = gameState;
    this.updateGameState = updateGameState;
    
    // Initialize command system
    hackNetCommands.setContext({
      gameState,
      updateGameState,
      currentDirectory: gameState.currentDirectory,
      currentNode: gameState.currentNode,
      resourceManager: systemResourcesEnhanced
    });
    
    // Initialize subsystems
    this.networkManager.initialize(gameState.discoveredDevices || []);
    this.missionEngine.initialize(gameState.activeMissions || []);
    this.detectionSystem.initialize(gameState.traceLevel || 0);
    
    // Start game loop
    this.startGameLoop();
    
    console.log('[HackNetEngine] Initialized successfully');
  }

  private setupEventHandlers() {
    this.networkManager.on('nodeCompromised', (nodeIp: string) => {
      this.emit('nodeCompromised', nodeIp);
      this.detectionSystem.onNodeCompromised(nodeIp);
    });

    this.detectionSystem.on('traceComplete', () => {
      this.emit('traceComplete');
      this.handleTraceComplete();
    });

    this.missionEngine.on('missionCompleted', (mission: Mission) => {
      this.emit('missionCompleted', mission);
      this.handleMissionCompleted(mission);
    });
  }

  private startGameLoop() {
    if (this.gameLoop) return;
    
    this.gameLoop = setInterval(() => {
      this.tick();
    }, 1000) as unknown as number;
  }

  private tick() {
    if (!this.gameState || !this.updateGameState) return;

    // Update detection system
    const traceLevel = this.detectionSystem.tick();
    
    // Update tools
    this.toolsManager.tick();
    
    // Check mission objectives
    this.missionEngine.tick(this.gameState);
    
    // Update command context
    hackNetCommands.setContext({
      gameState: this.gameState,
      updateGameState: this.updateGameState,
      currentDirectory: this.gameState.currentDirectory,
      currentNode: this.gameState.currentNode,
      resourceManager: systemResourcesEnhanced
    });
    
    // Update game state if needed
    if (traceLevel !== this.gameState.traceLevel) {
      this.updateGameState({ traceLevel });
    }
  }

  // Command execution interface
  async executeCommand(command: string): Promise<string[]> {
    if (!this.gameState || !this.updateGameState) {
      return ['Error: HackNet engine not initialized'];
    }

    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    try {
      const result = await hackNetCommands.executeCommand(cmd, args);
      return result.output;
    } catch (error) {
      console.error('Command execution error:', error);
      return [`Error executing command: ${error}`];
    }
  }

  // Network operations
  scanNetwork(fromNodeIp: string) {
    const discoveredNodes = this.networkManager.scanNetwork(fromNodeIp);
    if (this.updateGameState) {
      this.updateGameState({
        discoveredDevices: this.networkManager.getAllNodes(),
        scannedNodes: discoveredNodes.map(n => n.ip)
      });
    }
    return discoveredNodes;
  }

  connectToNode(targetIp: string): boolean {
    const success = this.networkManager.connectToNode(targetIp);
    if (success && this.updateGameState) {
      this.updateGameState({ currentNode: targetIp });
      this.detectionSystem.onConnectionEstablished(targetIp);
    }
    return success;
  }

  // Tool operations
  executeHackingTool(toolName: string, targetIp: string): Promise<boolean> {
    return this.toolsManager.executeTool(toolName, targetIp);
  }

  getAvailableTools(): HackingTool[] {
    return this.toolsManager.getAvailableTools();
  }

  // File operations
  getFiles(nodeIp: string, directory: string) {
    return this.fileSystemManager.getFiles(nodeIp, directory);
  }

  readFile(nodeIp: string, filePath: string): string | null {
    return this.fileSystemManager.readFile(nodeIp, filePath);
  }

  deleteFile(nodeIp: string, filePath: string): boolean {
    const success = this.fileSystemManager.deleteFile(nodeIp, filePath);
    if (success) {
      this.emit('fileDeleted', { nodeIp, filePath });
    }
    return success;
  }

  // Mission operations - Convert EnhancedMission to Mission format
  getActiveMissions(): Mission[] {
    const enhancedMissions = this.missionEngine.getActiveMissions();
    return enhancedMissions.map(enhancedMission => ({
      id: enhancedMission.id,
      title: enhancedMission.title,
      description: enhancedMission.description,
      briefing: enhancedMission.description, // Use description as briefing
      objective: enhancedMission.objectives[0]?.description || 'Complete mission objectives',
      objectives: enhancedMission.objectives.map(obj => obj.description),
      faction: 'bit' as const, // Default faction
      sender: 'system', // Default sender
      difficulty: enhancedMission.difficulty,
      completed: enhancedMission.completed,
      reward: enhancedMission.reward,
      completionConditions: enhancedMission.objectives.map(obj => ({
        type: obj.type,
        target: obj.target
      }))
    }));
  }

  checkMissionObjectives(): void {
    this.missionEngine.checkObjectives(this.gameState!);
  }

  private handleTraceComplete() {
    console.log('[HackNetEngine] Trace completed - player detected!');
    // Reset to localhost and clear compromised nodes
    if (this.updateGameState) {
      this.updateGameState({
        currentNode: 'localhost',
        currentDirectory: '/home/user',
        traceLevel: 0,
        compromisedNodes: ['localhost']
      });
    }
  }

  private handleMissionCompleted(mission: Mission) {
    console.log('[HackNetEngine] Mission completed:', mission.title);
    if (this.updateGameState && this.gameState) {
      this.updateGameState({
        completedMissions: [...this.gameState.completedMissions, mission.id],
        credits: this.gameState.credits + mission.reward.credits,
        experience: this.gameState.experience + mission.reward.experience
      });
    }
  }

  destroy() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.removeAllListeners();
  }
}

export const hackNetEngine = HackNetEngine.getInstance();
