
import { missionDatabase, Mission } from './MissionData';
import { networkSystemEnhanced } from '../../systems/NetworkSystemEnhanced';
import { gameCore } from '../../core/GameCore';

export class MissionManager {
  static getMissionsByFaction(faction: string): Mission[] {
    return missionDatabase.filter(mission => mission.faction === faction);
  }

  static getMissionById(id: string): Mission | undefined {
    return missionDatabase.find(mission => mission.id === id);
  }

  static getAvailableMissions(completedMissions: string[]): Mission[] {
    return missionDatabase.filter(mission => {
      if (completedMissions.includes(mission.id)) {
        return false;
      }

      if (mission.prerequisites) {
        return mission.prerequisites.every(prereq => completedMissions.includes(prereq));
      }

      return mission.status === 'available';
    });
  }

  static checkMissionCompletion(mission: Mission, gameState: any): boolean {
    console.log(`[MissionManager] Checking completion for mission: ${mission.id}`);
    console.log(`[MissionManager] Game state:`, {
      currentNode: gameState.currentNode,
      deletedFiles: gameState.deletedFiles,
      scannedNodes: gameState.scannedNodes,
      compromisedNodes: gameState.compromisedNodes
    });
    
    return mission.completionConditions.every(condition => {
      console.log(`[MissionManager] Checking condition:`, condition);
      
      switch (condition.type) {
        case 'scan_nodes':
          const scannedCount = gameState.scannedNodes?.length || 0;
          const required = condition.count || 1;
          console.log(`[MissionManager] Scan condition: ${scannedCount} >= ${required}`);
          return scannedCount >= required;
          
        case 'connect_to':
          const currentNode = gameState.currentNode;
          const targetNode = condition.target;
          
          // Mejorar detección de localhost
          const isConnected = this.checkNodeConnection(currentNode, targetNode);
          console.log(`[MissionManager] Connect condition: current=${currentNode}, target=${targetNode}, connected=${isConnected}`);
          return isConnected;
          
        case 'hack_node':
          const isCompromised = gameState.compromisedNodes?.includes(condition.target || '');
          console.log(`[MissionManager] Hack condition: ${condition.target} compromised = ${isCompromised}`);
          return isCompromised;
          
        case 'find_file':
          const fileName = condition.file;
          console.log(`[MissionManager] Looking for file: ${fileName}`);
          
          // Buscar archivo en todos los nodos descubiertos
          const fileFound = this.searchFileInNodes(fileName);
          console.log(`[MissionManager] File ${fileName} found: ${fileFound}`);
          return fileFound;
          
        case 'delete_file':
          const deletedFiles = gameState.deletedFiles || [];
          const targetFile = condition.file;
          const targetLocation = condition.location || condition.target;
          
          console.log(`[MissionManager] Checking file deletion - target: ${targetFile}, location: ${targetLocation}`);
          console.log(`[MissionManager] Deleted files:`, deletedFiles);
          
          // Buscar archivo eliminado
          const isFileDeleted = this.checkFileDeleted(deletedFiles, targetFile, targetLocation);
          console.log(`[MissionManager] Delete condition result: ${isFileDeleted}`);
          return isFileDeleted;
          
        case 'download_file':
          const downloadedFiles = gameState.downloadedFiles || [];
          const isDownloaded = downloadedFiles.includes(condition.file);
          console.log(`[MissionManager] Download condition: ${condition.file} downloaded = ${isDownloaded}`);
          return isDownloaded;
          
        default:
          console.log(`[MissionManager] Unknown condition type: ${condition.type}`);
          return false;
      }
    });
  }

  private static checkNodeConnection(currentNode: string, targetNode: string): boolean {
    if (!currentNode || !targetNode) return false;
    
    // Variantes de localhost
    const localhostVariants = ['127.0.0.1', 'localhost'];
    
    const currentIsLocalhost = localhostVariants.includes(currentNode);
    const targetIsLocalhost = localhostVariants.includes(targetNode);
    
    // Si ambos son localhost, están conectados
    if (currentIsLocalhost && targetIsLocalhost) {
      return true;
    }
    
    // Comparación exacta
    return currentNode === targetNode;
  }

  private static searchFileInNodes(fileName: string): boolean {
    const allNodes = networkSystemEnhanced.getAllNodes();
    
    for (const node of allNodes) {
      if (!node.discovered) continue;
      
      const commonPaths = ['/bin', '/home/user', '/home/admin', '/etc', '/var/log', '/sys'];
      
      for (const path of commonPaths) {
        try {
          const files = networkSystemEnhanced.getFiles(node.ip, path);
          const foundFile = files.find(f => f.name === fileName);
          if (foundFile) {
            console.log(`[MissionManager] File found: ${fileName} at ${node.ip}:${path}`);
            return true;
          }
        } catch (error) {
          // Continuar buscando en otros paths
        }
      }
    }
    
    return false;
  }

  private static checkFileDeleted(deletedFiles: string[], targetFile: string, targetLocation?: string): boolean {
    if (!targetFile) return false;
    
    return deletedFiles.some((deletedEntry: string) => {
      const includesFile = deletedEntry.includes(targetFile);
      
      // Si no hay ubicación específica, solo verificar el archivo
      if (!targetLocation) {
        return includesFile;
      }
      
      // Verificar ubicación específica
      const includesLocation = deletedEntry.includes(targetLocation) || 
                              this.checkLocalhostInPath(deletedEntry, targetLocation);
      
      console.log(`[MissionManager] Checking deleted entry: ${deletedEntry}, includesFile: ${includesFile}, includesLocation: ${includesLocation}`);
      return includesFile && includesLocation;
    });
  }

  private static checkLocalhostInPath(path: string, target: string): boolean {
    if (target === 'localhost') {
      return path.includes('127.0.0.1') || path.includes('localhost');
    }
    if (target === '127.0.0.1') {
      return path.includes('127.0.0.1') || path.includes('localhost');
    }
    return false;
  }

  static getProgressText(mission: Mission, gameState: any): string {
    const completed = mission.completionConditions.filter(condition => {
      switch (condition.type) {
        case 'scan_nodes':
          return (gameState.scannedNodes?.length || 0) >= (condition.count || 1);
        case 'connect_to':
          return this.checkNodeConnection(gameState.currentNode, condition.target);
        case 'hack_node':
          return gameState.compromisedNodes?.includes(condition.target || '');
        case 'find_file':
          return this.searchFileInNodes(condition.file || '');
        case 'delete_file':
          return this.checkFileDeleted(
            gameState.deletedFiles || [], 
            condition.file || '', 
            condition.location || condition.target
          );
        case 'download_file':
          return (gameState.downloadedFiles || []).includes(condition.file);
        default:
          return false;
      }
    }).length;

    return `${completed}/${mission.completionConditions.length} objetivos completados`;
  }

  static getNextMissions(currentMission: string): Mission[] {
    return missionDatabase.filter(mission => 
      mission.prerequisites?.includes(currentMission)
    );
  }

  static plantMissionFiles(missionId: string) {
    console.log(`[MissionManager] Planted files for mission: ${missionId}`);
    
    // Para la primera misión, asegurar que SecurityTracer.exe esté en /bin
    if (missionId === 'bit_001_first_contact') {
      const localhostNode = networkSystemEnhanced.getNode('127.0.0.1');
      if (localhostNode) {
        // Plantar el archivo SecurityTracer.exe en /bin
        networkSystemEnhanced.addFile('127.0.0.1', '/bin', {
          name: 'SecurityTracer.exe',
          type: 'file',
          content: 'Security monitoring executable',
          size: 2048,
          permissions: 'rwxr--r--',
          modified: new Date().toISOString()
        });
        console.log('[MissionManager] SecurityTracer.exe planted in /bin');
      }
    }
  }
}
