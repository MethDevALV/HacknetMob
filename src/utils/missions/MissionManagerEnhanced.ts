
import { Mission } from '../../types/CoreTypes';
import { missionDatabaseComplete } from './MissionDataComplete';

export class MissionManagerEnhanced {
  static getProgressText(mission: Mission, gameState: any): string {
    if (!mission.completionConditions) {
      return 'No progress available';
    }

    const completedGoals = mission.completionConditions.filter(goal => {
      switch (goal.type) {
        case 'connect':
          return gameState.connectedNodes?.includes(goal.target);
        case 'hack':
          return gameState.compromisedNodes?.includes(goal.target);
        case 'download':
          return gameState.downloadedFiles?.includes(goal.file);
        case 'upload':
          return gameState.uploadedFiles?.includes(goal.file);
        case 'delete':
          return gameState.deletedFiles?.includes(`${gameState.currentNode}:${gameState.currentDirectory}/${goal.file}`);
        case 'modify':
          return gameState.modifiedFiles?.includes(goal.file);
        case 'scan':
          return gameState.scannedNodes?.includes(goal.target);
        default:
          return false;
      }
    });

    return `${completedGoals.length} / ${mission.completionConditions.length} goals completed`;
  }

  static getMissionById(missionId: string): Mission | undefined {
    return missionDatabaseComplete.find(mission => mission.id === missionId);
  }

  static getAvailableMissions(completedMissionIds: string[]): Mission[] {
    return missionDatabaseComplete.filter(mission => {
      if (completedMissionIds.includes(mission.id)) return false;
      
      if (mission.prerequisites && mission.prerequisites.length > 0) {
        return mission.prerequisites.every(prereq => completedMissionIds.includes(prereq));
      }
      
      return true;
    });
  }

  static checkMissionCompletion(mission: Mission, gameState: any): boolean {
    if (!mission.completionConditions) return false;

    return mission.completionConditions.every(goal => {
      switch (goal.type) {
        case 'connect':
          return gameState.connectedNodes?.includes(goal.target);
        case 'hack':
          return gameState.compromisedNodes?.includes(goal.target);
        case 'download':
          return gameState.downloadedFiles?.includes(goal.file);
        case 'upload':
          return gameState.uploadedFiles?.includes(goal.file);
        case 'delete':
          return gameState.deletedFiles?.includes(`${gameState.currentNode}:${gameState.currentDirectory}/${goal.file}`);
        case 'modify':
          return gameState.modifiedFiles?.includes(goal.file);
        case 'scan':
          return gameState.scannedNodes?.includes(goal.target);
        default:
          return false;
      }
    });
  }

  static plantMissionFiles(missionId: string): void {
    const mission = this.getMissionById(missionId);
    if (mission && mission.missionFiles) {
      // Implementation for planting mission files
      console.log(`[MissionManagerEnhanced] Planting files for mission: ${missionId}`);
    }
  }

  static createMissionNodes(missionId: string): void {
    const mission = this.getMissionById(missionId);
    if (mission) {
      // Implementation for creating mission nodes
      console.log(`[MissionManagerEnhanced] Creating nodes for mission: ${missionId}`);
    }
  }
}
