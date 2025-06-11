
import { GameState } from '../types/GameTypes';

interface LevelRequirement {
  level: number;
  experienceRequired: number;
  unlockedTools: string[];
}

const LEVEL_PROGRESSION: LevelRequirement[] = [
  { level: 1, experienceRequired: 0, unlockedTools: ['scan', 'probe', 'connect'] },
  { level: 2, experienceRequired: 100, unlockedTools: ['SSHcrack'] },
  { level: 3, experienceRequired: 250, unlockedTools: ['FTPBounce'] },
  { level: 4, experienceRequired: 500, unlockedTools: ['WebServerWorm'] },
  { level: 5, experienceRequired: 1000, unlockedTools: ['PortHack'] },
  { level: 6, experienceRequired: 2000, unlockedTools: ['SQLInject'] },
  { level: 7, experienceRequired: 4000, unlockedTools: ['TraceKill'] },
  { level: 8, experienceRequired: 8000, unlockedTools: ['DecHead'] },
  { level: 9, experienceRequired: 15000, unlockedTools: ['DECypher'] },
  { level: 10, experienceRequired: 30000, unlockedTools: ['Memforensics'] }
];

export class ProgressionSystem {
  static calculateLevel(experience: number): number {
    for (let i = LEVEL_PROGRESSION.length - 1; i >= 0; i--) {
      if (experience >= LEVEL_PROGRESSION[i].experienceRequired) {
        return LEVEL_PROGRESSION[i].level;
      }
    }
    return 1;
  }

  static getProgressToNextLevel(gameState: GameState) {
    const currentLevel = gameState.level || this.calculateLevel(gameState.experience);
    const nextLevelData = LEVEL_PROGRESSION.find(l => l.level === currentLevel + 1);
    
    if (!nextLevelData) {
      return {
        currentLevel,
        nextLevel: currentLevel,
        currentXP: gameState.experience,
        requiredXP: gameState.experience,
        progress: 1.0,
        isMaxLevel: true
      };
    }

    const currentLevelData = LEVEL_PROGRESSION.find(l => l.level === currentLevel) || LEVEL_PROGRESSION[0];
    
    return {
      currentLevel,
      nextLevel: nextLevelData.level,
      currentXP: gameState.experience - currentLevelData.experienceRequired,
      requiredXP: nextLevelData.experienceRequired - currentLevelData.experienceRequired,
      progress: (gameState.experience - currentLevelData.experienceRequired) / 
                (nextLevelData.experienceRequired - currentLevelData.experienceRequired),
      isMaxLevel: false
    };
  }

  static getUnlockedTools(gameState: GameState): string[] {
    const level = gameState.level || this.calculateLevel(gameState.experience);
    const unlockedTools: string[] = [];
    
    LEVEL_PROGRESSION.forEach(levelData => {
      if (levelData.level <= level) {
        unlockedTools.push(...levelData.unlockedTools);
      }
    });
    
    return unlockedTools;
  }

  static awardExperience(amount: number, gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    const newExperience = gameState.experience + amount;
    const newLevel = this.calculateLevel(newExperience);
    const oldLevel = gameState.level || this.calculateLevel(gameState.experience);
    
    const updates: Partial<GameState> = {
      experience: newExperience,
      level: newLevel
    };

    // Check for level up
    if (newLevel > oldLevel) {
      const newTools = this.getUnlockedTools({ ...gameState, level: newLevel, experience: newExperience });
      updates.unlockedTools = [...new Set([...(gameState.unlockedTools || []), ...newTools])];
      
      // Add level up event
      updates.eventLog = [
        ...(gameState.eventLog || []),
        {
          id: `level_up_${Date.now()}`,
          title: `Level Up! Level ${newLevel}`,
          description: `You've reached level ${newLevel}! New tools unlocked.`,
          timestamp: Date.now(),
          type: 'system' as const,
          severity: 'medium' as const
        }
      ];
    }

    updateGameState(updates);
  }
}
