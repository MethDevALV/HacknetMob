
export interface Mission {
  id: string;
  title: string;
  description: string;
  briefing: string;
  sender: string;
  faction: 'bit' | 'entropy' | 'naix' | 'csec' | 'el' | 'final';
  status: 'locked' | 'available' | 'active' | 'completed' | 'claimed';
  objective: string;
  reward: {
    credits: number;
    experience: number;
    tools?: string[];
  };
  difficulty: 'tutorial' | 'easy' | 'medium' | 'hard' | 'extreme';
  timeLimit?: number;
  prerequisites?: string[];
  completionConditions: {
    type: 'scan_nodes' | 'connect_to' | 'hack_node' | 'delete_file' | 'download_file' | 'upload_file' | 'find_file' | 'execute_command' | 'login_as' | 'modify_file';
    target?: string;
    file?: string;
    command?: string;
    user?: string;
    count?: number;
    location?: string;
  }[];
}

export const missionDatabase: Mission[] = [
  // Misión Tutorial
  {
    id: 'bit_001_first_contact',
    title: 'Primer Contacto',
    description: 'Aprende los comandos básicos del sistema. Conecta a tu PC principal y elimina el archivo de seguridad.',
    briefing: 'Bienvenido al mundo del hacking. Tu primer objetivo es simple: conectarte a tu propio sistema y eliminar el SecurityTracer.exe que está monitoreando tu actividad.',
    sender: 'Bit',
    faction: 'bit',
    status: 'available',
    objective: 'Conectarse a localhost y eliminar SecurityTracer.exe',
    reward: { credits: 50, experience: 25 },
    difficulty: 'tutorial',
    completionConditions: [
      { type: 'connect_to', target: 'localhost' },
      { type: 'delete_file', file: 'SecurityTracer.exe', location: '/bin' }
    ]
  },
  {
    id: 'bit_002_getting_tools',
    title: 'Consiguiendo algunas herramientas',
    description: 'Usa scan para encontrar dispositivos, luego hackea tu primer sistema externo.',
    briefing: 'Ahora que controlas tu sistema, es hora de expandir tus capacidades. Usa el comando "scan" para encontrar otros sistemas en la red.',
    sender: 'Bit',
    faction: 'bit',
    status: 'locked',
    objective: 'Escanea la red para encontrar al menos 3 dispositivos',
    reward: { credits: 100, experience: 50 },
    difficulty: 'tutorial',
    prerequisites: ['bit_001_first_contact'],
    completionConditions: [
      { type: 'scan_nodes', count: 3 }
    ]
  },
  {
    id: 'bit_003_first_hack',
    title: 'Primer Hackeo',
    description: 'Usa SSHcrack para hackear tu primer sistema remoto.',
    briefing: 'Es hora de probar lo que has aprendido. Usa la herramienta SSHcrack para hackear un sistema remoto. Primero encuentra un objetivo con "scan", luego usa "sshcrack <ip>" para atacar.',
    sender: 'Bit',
    faction: 'bit',
    status: 'locked',
    objective: 'Hackear cualquier sistema usando SSHcrack',
    reward: { credits: 150, experience: 75, tools: ['FTPBounce.exe'] },
    difficulty: 'easy',
    prerequisites: ['bit_002_getting_tools'],
    completionConditions: [
      { type: 'hack_node', target: 'any' }
    ]
  }
];
