
import { Mission } from '../../types/CoreTypes';

export const missionDatabaseComplete: Mission[] = [
  {
    id: 'tutorial_001',
    title: 'First Steps',
    sender: 'bit',
    briefing: 'Welcome to HackNet. This is your first mission.',
    objective: 'Learn the basics of network hacking',
    objectives: ['Use the scan command to discover nearby devices'],
    description: 'Use the scan command to discover nearby devices.',
    faction: 'bit',
    difficulty: 'tutorial',
    completed: false,
    reward: {
      credits: 500,
      experience: 100
    },
    completionConditions: [
      { type: 'scan', target: '192.168.1.1' }
    ]
  },
  {
    id: 'tutorial_002',
    title: 'Port Scanning',
    sender: 'bit',
    briefing: 'Now learn about port scanning.',
    objective: 'Scan and crack your first port',
    objectives: ['Use probe command to scan ports', 'Crack SSH using sshcrack'],
    description: 'Use probe command to scan ports, then crack SSH.',
    faction: 'bit',
    difficulty: 'tutorial',
    completed: false,
    reward: {
      credits: 750,
      experience: 150
    },
    completionConditions: [
      { type: 'crack_port', target: '192.168.1.100', port: '22' }
    ]
  },
  {
    id: 'bit_001',
    title: 'Data Recovery',
    sender: 'bit',
    briefing: 'We need you to recover some important data.',
    objective: 'Download the target file',
    objectives: ['Connect to the target system', 'Download the specified file'],
    description: 'Connect to the target system and download the specified file.',
    faction: 'bit',
    difficulty: 'easy',
    completed: false,
    reward: {
      credits: 1000,
      experience: 200
    },
    completionConditions: [
      { type: 'download', file: 'data.txt' }
    ]
  }
];
