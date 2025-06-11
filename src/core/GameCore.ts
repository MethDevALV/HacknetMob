
import { GameState } from '../types/HackNetTypes';

type EventType = 'scan_completed' | 'node_compromised' | 'file_system_changed' | 'mission_updated' | 'network_updated' | 'tool_started' | 'tool_completed' | 'file_deleted' | 'file_downloaded';

interface GameEvent {
  type: EventType;
  data?: any;
  timestamp: number;
}

type EventListener = (event: GameEvent) => void;

export class GameCore {
  private static instance: GameCore;
  private listeners: Map<EventType, EventListener[]> = new Map();
  private gameState: GameState | null = null;
  private gameStateUpdater: ((updates: Partial<GameState>) => void) | null = null;

  static getInstance(): GameCore {
    if (!GameCore.instance) {
      GameCore.instance = new GameCore();
    }
    return GameCore.instance;
  }

  setGameState(gameState: GameState, updater: (updates: Partial<GameState>) => void) {
    this.gameState = gameState;
    this.gameStateUpdater = updater;
    console.log('[GameCore] Game state initialized');
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  updateGameState(updates: Partial<GameState>) {
    if (this.gameStateUpdater) {
      this.gameStateUpdater(updates);
      this.emit('file_system_changed', updates);
    }
  }

  on(eventType: EventType, listener: EventListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  off(eventType: EventType, listener: EventListener) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(eventType: EventType, data?: any) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const event: GameEvent = {
        type: eventType,
        data,
        timestamp: Date.now()
      };
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`[GameCore] Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  // Enhanced event methods
  notifyScanCompleted(discoveredDevices: any[]) {
    this.emit('scan_completed', { discoveredDevices });
  }

  notifyNodeCompromised(nodeIp: string) {
    this.emit('node_compromised', { nodeIp });
  }

  notifyFileSystemChanged(nodeIp: string, path: string) {
    this.emit('file_system_changed', { nodeIp, path });
  }

  notifyMissionUpdated(missionId: string, status: string) {
    this.emit('mission_updated', { missionId, status });
  }

  notifyNetworkUpdated() {
    this.emit('network_updated', {});
  }

  notifyToolStarted(toolName: string, targetIp: string, processId: string) {
    this.emit('tool_started', { toolName, targetIp, processId });
  }

  notifyToolCompleted(toolName: string, targetIp: string, success: boolean, processId: string) {
    this.emit('tool_completed', { toolName, targetIp, success, processId });
  }

  notifyFileDeleted(nodeIp: string, path: string, fileName: string) {
    this.emit('file_deleted', { nodeIp, path, fileName });
  }

  notifyFileDownloaded(fileName: string, nodeIp: string) {
    this.emit('file_downloaded', { fileName, nodeIp });
  }
}

export const gameCore = GameCore.getInstance();
