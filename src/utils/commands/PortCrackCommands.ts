
import { GameState } from '../../types/CoreTypes';

export class PortCrackCommands {
  private gameState: GameState | null = null;
  private updateGameState: ((updates: Partial<GameState>) => void) | null = null;

  setGameState(gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    this.gameState = gameState;
    this.updateGameState = updateGameState;
  }

  async crackSSH(target: string): Promise<string[]> {
    if (!this.gameState) {
      return ['Error: Game state not initialized.'];
    }

    if (!target) {
      return ['Usage: sshcrack <target_ip>'];
    }

    const messages = [`Attempting SSH crack on ${target}...`];
    
    // Simulate cracking process
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      messages.push(`SSH port (22) cracked successfully on ${target}`);
      
      if (this.updateGameState) {
        const crackedPorts = [...(this.gameState.crackedPorts || []), `${target}:22`];
        this.updateGameState({ crackedPorts });
      }
    } else {
      messages.push(`SSH crack failed on ${target}`);
    }

    return messages;
  }

  async crackFTP(target: string): Promise<string[]> {
    if (!this.gameState) {
      return ['Error: Game state not initialized.'];
    }

    if (!target) {
      return ['Usage: ftpbounce <target_ip>'];
    }

    const messages = [`Attempting FTP crack on ${target}...`];
    
    const success = Math.random() > 0.4; // 60% success rate
    
    if (success) {
      messages.push(`FTP port (21) cracked successfully on ${target}`);
      
      if (this.updateGameState) {
        const crackedPorts = [...(this.gameState.crackedPorts || []), `${target}:21`];
        this.updateGameState({ crackedPorts });
      }
    } else {
      messages.push(`FTP crack failed on ${target}`);
    }

    return messages;
  }

  async crackWebServer(target: string): Promise<string[]> {
    if (!this.gameState) {
      return ['Error: Game state not initialized.'];
    }

    if (!target) {
      return ['Usage: webserverworm <target_ip>'];
    }

    const messages = [`Attempting HTTP crack on ${target}...`];
    
    const success = Math.random() > 0.5; // 50% success rate
    
    if (success) {
      messages.push(`HTTP port (80) cracked successfully on ${target}`);
      
      if (this.updateGameState) {
        const crackedPorts = [...(this.gameState.crackedPorts || []), `${target}:80`];
        this.updateGameState({ crackedPorts });
      }
    } else {
      messages.push(`HTTP crack failed on ${target}`);
    }

    return messages;
  }

  async portHack(target: string): Promise<string[]> {
    if (!this.gameState) {
      return ['Error: Game state not initialized.'];
    }

    if (!target) {
      return ['Usage: porthack <target_ip>'];
    }

    const messages = [`Attempting to hack ${target}...`];
    
    const success = Math.random() > 0.6; // 40% success rate
    
    if (success) {
      messages.push(`Successfully compromised ${target}`);
      
      if (this.updateGameState) {
        const compromisedNodes = [...(this.gameState.compromisedNodes || []), target];
        this.updateGameState({ compromisedNodes });
      }
    } else {
      messages.push(`Failed to compromise ${target}`);
    }

    return messages;
  }
}
