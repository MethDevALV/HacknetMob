
interface HacknetDevice {
  id: string;
  name: string;
  ip: string;
  type: string;
  difficulty: number;
  ports: string[];
  security: {
    firewall: boolean;
    proxy: boolean;
    trace: boolean;
    firewallPassword?: string;
  };
  files?: string[];
  missionRelevant?: string[];
  proxyBypass?: {
    shellsRequired: number;
  };
  parentDevice?: string;
  credentials?: {
    user: string;
    password: string;
  };
  interface?: string;
  functions?: string[];
  specialCommands?: string[];
  requiresSequencer?: boolean;
}

export const HACKNET_DEVICES = {
  // Básicos - Tutorial y Nivel 1-2
  basicWorkstations: [
    {
      id: 'viper_battlestation',
      name: 'Viper-Battlestation',
      ip: '192.168.1.100',
      type: 'workstation',
      difficulty: 1,
      ports: ['SSH'],
      security: { firewall: false, proxy: false, trace: false },
      files: ['SSHcrack.exe', 'readme.txt'],
      missionRelevant: ['getting_tools_together']
    },
    {
      id: 'bitwise_test_pc',
      name: 'Bitwise Test PC',
      ip: '10.0.0.15',
      type: 'test_machine',
      difficulty: 1,
      ports: ['SSH', 'FTP'],
      security: { firewall: false, proxy: false, trace: true },
      files: ['test_data.txt', 'user_info.db']
    }
  ],

  // Servidores Intermedios - Nivel 3-5
  corporateServers: [
    {
      id: 'entropy_asset_server',
      name: 'Entropy Asset Server',
      ip: '172.16.254.1',
      type: 'corporate_server',
      difficulty: 3,
      ports: ['SSH', 'FTP', 'HTTP', 'SMTP'],
      security: { firewall: false, proxy: true, trace: true },
      files: ['FTPBounce.exe', 'SMTPoverflow.exe', 'eosDeviceScan.exe'],
      proxyBypass: { shellsRequired: 3 }
    },
    {
      id: 'naix_root_gateway',
      name: 'Naix Root Gateway',
      ip: '203.0.113.50',
      type: 'gateway_server',
      difficulty: 4,
      ports: ['SSH', 'FTP', 'HTTP', 'SQL'],
      security: { firewall: true, proxy: false, trace: true },
      files: ['WebServerWorm.exe', 'classified_docs.enc']
    }
  ],

  // Dispositivos Móviles eOS - Agregando IP y ports requeridos
  eosDevices: [
    {
      id: 'jason_ephone_4s',
      name: "Jason's ePhone 4S",
      ip: '192.168.1.110', // Agregada IP requerida
      type: 'eos_device',
      difficulty: 2,
      ports: ['MOBILE'], // Agregados ports requeridos
      security: { firewall: false, proxy: false, trace: false }, // Agregada security requerida
      parentDevice: 'anderson_bedroom_pc',
      credentials: { user: 'admin', password: 'alpine' },
      files: ['contacts.db', 'messages.txt', 'photos/']
    },
    {
      id: 'mica_ephone_4s',
      name: "Mica's ePhone 4S",
      ip: '192.168.1.111', // Agregada IP requerida
      type: 'eos_device',
      difficulty: 3,
      ports: ['MOBILE'], // Agregados ports requeridos
      security: { firewall: false, proxy: false, trace: false }, // Agregada security requerida
      parentDevice: 'entropy_test_server',
      credentials: { user: 'admin', password: 'alpine' },
      files: ['encrypted_messages.enc', 'banking_app.db']
    }
  ],

  // Sistemas Especializados
  specializedSystems: [
    {
      id: 'universal_medical_db',
      name: 'Universal Medical Database',
      ip: '198.51.100.10',
      type: 'medical_database',
      difficulty: 6,
      ports: ['SSH', 'HTTP', 'SQL'],
      security: { firewall: true, proxy: true, trace: true },
      interface: 'medical_records',
      functions: ['search_patient', 'send_records', 'modify_records']
    },
    {
      id: 'death_row_records',
      name: 'Death Row Records Database',
      ip: '203.0.113.100',
      type: 'criminal_database',
      difficulty: 7,
      ports: ['SSH', 'SQL', 'HTTPS'],
      security: { firewall: true, proxy: true, trace: true },
      interface: 'criminal_records',
      functions: ['search_inmate', 'delete_record', 'modify_sentence']
    },
    {
      id: 'academic_database',
      name: 'International Academic Database',
      ip: '192.0.2.50',
      type: 'academic_database',
      difficulty: 5,
      ports: ['SSH', 'HTTP', 'SQL'],
      security: { firewall: true, proxy: false, trace: true },
      interface: 'academic_records',
      functions: ['add_degree', 'remove_degree', 'modify_gpa']
    }
  ],

  // Sistemas Nortron (Avanzados)
  nortronSystems: [
    {
      id: 'nortron_web_server',
      name: 'Nortron Security Web Server',
      ip: '10.10.10.10',
      type: 'corporate_web',
      difficulty: 6,
      ports: ['SSH', 'HTTP', 'HTTPS', 'SQL'],
      security: { firewall: true, proxy: true, trace: true }
    },
    {
      id: 'nortron_mainframe',
      name: 'Nortron Mainframe',
      ip: '10.10.10.1',
      type: 'mainframe',
      difficulty: 8,
      ports: ['SSH', 'FTP', 'HTTP', 'SQL', 'SMTP'],
      security: { 
        firewall: true, 
        proxy: true, 
        trace: true,
        firewallPassword: 'login'
      },
      specialCommands: ['solve login']
    }
  ],

  // Sistemas CSEC (Finales)
  csecSystems: [
    {
      id: 'csec_invitation_gauntlet',
      name: 'CSEC Invitation Gauntlet',
      ip: '172.31.255.1',
      type: 'csec_challenge',
      difficulty: 7,
      ports: ['SSH', 'FTP', 'HTTP', 'SQL', 'TORRENT'],
      security: { firewall: true, proxy: true, trace: true },
      files: ['WebServerWorm.exe', 'invitation_code.txt']
    },
    {
      id: 'csec_assets_server',
      name: 'CSEC Assets Server',
      ip: '172.31.255.10',
      type: 'csec_assets',
      difficulty: 8,
      ports: ['SSH', 'HTTP', 'SQL', 'HTTPS', 'TORRENT'],
      security: { firewall: true, proxy: true, trace: true },
      files: ['SQL_MemCorrupt.exe', 'TraceKill.exe.enc', 'Sequencer.exe']
    }
  ]
};

export const getAllHacknetDevices = (): HacknetDevice[] => {
  return Object.values(HACKNET_DEVICES).flat();
};

export const getDeviceById = (id: string): HacknetDevice | undefined => {
  const allDevices = getAllHacknetDevices();
  return allDevices.find(device => device.id === id);
};

export const getDeviceByIp = (ip: string): HacknetDevice | undefined => {
  const allDevices = getAllHacknetDevices();
  return allDevices.find(device => device.ip === ip);
};

export const getDevicesByDifficulty = (maxDifficulty: number): HacknetDevice[] => {
  const allDevices = getAllHacknetDevices();
  return allDevices.filter(device => device.difficulty <= maxDifficulty);
};
