
interface MissionObjective {
  type: 'execute_command' | 'connect_to' | 'crack_port' | 'download_file' | 'scan_devices' | 'hack_eos_device' | 'complete_trial' | 'crack_all_ports' | 'find_file' | 'decrypt_file';
  command?: string;
  target?: string;
  port?: string;
  file?: string;
  count?: number;
  trial?: string;
  completed: boolean;
}

interface HacknetMission {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  objectives: MissionObjective[];
  rewards: {
    experience: number;
    credits: number;
    tools?: string[];
    unlocks?: string[];
  };
  unlocks?: string[];
  faction?: string;
  prerequisites?: string[];
}

export const HACKNET_MISSIONS: { [category: string]: HacknetMission[] } = {
  // Tutorial - Primeros Pasos
  tutorial: [
    {
      id: 'first_contact',
      title: 'First Contact',
      description: 'Aprende los comandos básicos del sistema.',
      difficulty: 1,
      objectives: [
        { type: 'execute_command', command: 'help', completed: false },
        { type: 'execute_command', command: 'ls', completed: false },
        { type: 'execute_command', command: 'cat readme.txt', completed: false }
      ],
      rewards: { experience: 50, credits: 100 },
      unlocks: ['getting_tools_together']
    },
    
    {
      id: 'getting_tools_together',
      title: 'Getting Some Tools Together',
      description: 'Hackea tu primer objetivo y obtén herramientas básicas.',
      difficulty: 1,
      objectives: [
        { type: 'connect_to', target: 'viper_battlestation', completed: false },
        { type: 'execute_command', command: 'probe', completed: false },
        { type: 'crack_port', port: 'SSH', target: 'viper_battlestation', completed: false },
        { type: 'execute_command', command: 'PortHack', completed: false },
        { type: 'download_file', file: 'SSHcrack.exe', completed: false }
      ],
      rewards: { 
        experience: 100, 
        credits: 200,
        tools: ['SSHcrack.exe']
      },
      unlocks: ['welcome_to_entropy']
    }
  ],

  // Entropy Arc - Nivel Básico
  entropy: [
    {
      id: 'welcome_to_entropy',
      title: 'Welcome to Entropy',
      description: 'Únete a Entropy y obtén herramientas básicas.',
      difficulty: 2,
      faction: 'entropy',
      objectives: [
        { type: 'connect_to', target: 'entropy_asset_server', completed: false },
        { type: 'download_file', file: 'FTPBounce.exe', completed: false },
        { type: 'scan_devices', count: 3, completed: false }
      ],
      rewards: { 
        experience: 150, 
        credits: 300,
        tools: ['FTPBounce.exe']
      },
      unlocks: ['eos_device_scanning']
    },

    {
      id: 'eos_device_scanning',
      title: 'eOS Device Scanning',
      description: 'Aprende a hackear dispositivos móviles.',
      difficulty: 3,
      faction: 'entropy',
      objectives: [
        { type: 'download_file', file: 'eosDeviceScan.exe', completed: false },
        { type: 'connect_to', target: 'anderson_bedroom_pc', completed: false },
        { type: 'execute_command', command: 'eosDeviceScan.exe', completed: false },
        { type: 'hack_eos_device', target: 'jason_ephone_4s', completed: false }
      ],
      rewards: { 
        experience: 200, 
        credits: 400,
        tools: ['eosDeviceScan.exe']
      }
    }
  ],

  // Polar Star Arc - Nivel Intermedio
  polarStar: [
    {
      id: 'shrine_of_polar_star',
      title: 'Shrine of the Polar Star',
      description: 'Enfrenta el primer desafío de Polar Star.',
      difficulty: 4,
      faction: 'polar_star',
      objectives: [
        { type: 'connect_to', target: 'polar_star_shrine', completed: false },
        { type: 'complete_trial', trial: 'patience', completed: false },
        { type: 'complete_trial', trial: 'haste', completed: false },
        { type: 'complete_trial', trial: 'diligence', completed: false }
      ],
      rewards: { 
        experience: 300, 
        credits: 600,
        tools: ['SQLBufferOverflow.exe']
      },
      unlocks: ['head_of_polar_star']
    }
  ],

  // CSEC Arc - Nivel Avanzado
  csec: [
    {
      id: 'csec_invitation',
      title: 'CSEC Invitation',
      description: 'Completa el gauntlet para unirte a CSEC.',
      difficulty: 6,
      faction: 'csec',
      objectives: [
        { type: 'connect_to', target: 'csec_invitation_gauntlet', completed: false },
        { type: 'crack_all_ports', target: 'csec_invitation_gauntlet', completed: false },
        { type: 'download_file', file: 'invitation_code.txt', completed: false },
        { type: 'connect_to', target: 'csec_gauntlet_02', completed: false },
        { type: 'connect_to', target: 'csec_gauntlet_03', completed: false }
      ],
      rewards: { 
        experience: 500, 
        credits: 1000,
        tools: ['WebServerWorm.exe'],
        unlocks: ['csec_member_access']
      }
    },

    {
      id: 'csec_congratulations',
      title: 'CSEC Invitation - Congratulations',
      description: 'Accede a los recursos de CSEC.',
      difficulty: 7,
      faction: 'csec',
      prerequisites: ['csec_invitation'],
      objectives: [
        { type: 'connect_to', target: 'csec_assets_server', completed: false },
        { type: 'download_file', file: 'SQL_MemCorrupt.exe', completed: false },
        { type: 'download_file', file: 'Sequencer.exe', completed: false },
        { type: 'decrypt_file', file: 'TraceKill.exe.enc', completed: false }
      ],
      rewards: { 
        experience: 600, 
        credits: 1200,
        tools: ['SQL_MemCorrupt.exe', 'Sequencer.exe', 'TraceKill.exe']
      }
    }
  ],

  // Corporate Arc - Nivel Experto
  corporate: [
    {
      id: 'project_junebug',
      title: 'Project Junebug',
      description: 'Infiltra Kellis Biotech y descubre Project Junebug.',
      difficulty: 8,
      objectives: [
        { type: 'connect_to', target: 'kellis_biotech_client', completed: false },
        { type: 'connect_to', target: 'kellis_biotech_production', completed: false },
        { type: 'download_file', file: 'KBT_PortTest.exe', completed: false },
        { type: 'find_file', file: 'junebug_data.enc', completed: false },
        { type: 'decrypt_file', file: 'junebug_data.enc', completed: false }
      ],
      rewards: { 
        experience: 800, 
        credits: 1600,
        tools: ['KBT_PortTest.exe']
      }
    }
  ]
};

export const getAllHacknetMissions = (): HacknetMission[] => {
  return Object.values(HACKNET_MISSIONS).flat();
};

export const getMissionById = (id: string): HacknetMission | undefined => {
  const allMissions = getAllHacknetMissions();
  return allMissions.find(mission => mission.id === id);
};

export const getMissionsByFaction = (faction: string): HacknetMission[] => {
  const allMissions = getAllHacknetMissions();
  return allMissions.filter(mission => mission.faction === faction);
};

export const getAvailableMissions = (completedMissions: string[], playerLevel: number): HacknetMission[] => {
  const allMissions = getAllHacknetMissions();
  
  return allMissions.filter(mission => {
    // Check if mission is already completed
    if (completedMissions.includes(mission.id)) {
      return false;
    }

    // Check if prerequisites are met
    if (mission.prerequisites) {
      const prereqsMet = mission.prerequisites.every(prereq => completedMissions.includes(prereq));
      if (!prereqsMet) return false;
    }

    // Check if player level is sufficient
    if (mission.difficulty > playerLevel + 2) {
      return false;
    }

    return true;
  });
};

export const checkMissionObjectiveCompletion = (
  objective: MissionObjective, 
  gameState: any
): boolean => {
  switch (objective.type) {
    case 'execute_command':
      return gameState.executedCommands?.includes(objective.command || '') || false;
    
    case 'connect_to':
      return gameState.currentNode === objective.target;
    
    case 'crack_port':
      const crackedPorts = gameState.crackedPorts || [];
      return crackedPorts.some((entry: string) => 
        entry.includes(objective.target || '') && entry.includes(objective.port || '')
      );
    
    case 'download_file':
      return gameState.downloadedFiles?.includes(objective.file || '') || false;
    
    case 'scan_devices':
      return (gameState.scannedNodes?.length || 0) >= (objective.count || 1);
    
    default:
      return false;
  }
};
