
import { Mission } from '../types/CoreTypes';

export const HACKNET_MISSIONS: Mission[] = [
  {
    id: 'tutorial_001',
    title: 'First Steps',
    sender: 'bit',
    briefing: 'Welcome to HackNet. This is your first mission to get familiar with the basic commands.',
    objective: 'Learn to use the basic terminal commands',
    objectives: [
      'Type "help" to see available commands',
      'Use "scan" to discover network devices',
      'Connect to a discovered device'
    ],
    description: 'Introduction to HackNet basics - learn the fundamental commands for navigation and network discovery.',
    faction: 'bit',
    difficulty: 'tutorial',
    completed: false,
    reward: {
      credits: 100,
      experience: 50
    },
    completionConditions: [
      { type: 'command_executed', target: 'help' },
      { type: 'command_executed', target: 'scan' }
    ]
  },
  {
    id: 'tutorial_002', 
    title: 'Network Discovery',
    sender: 'bit',
    briefing: 'Now that you know the basics, let\'s explore the network and find some targets.',
    objective: 'Discover and probe network targets',
    objectives: [
      'Scan the network to find devices',
      'Probe at least one discovered device',
      'Attempt to connect to a target'
    ],
    description: 'Learn network reconnaissance techniques by scanning and probing targets.',
    faction: 'bit',
    difficulty: 'tutorial',
    completed: false,
    reward: {
      credits: 200,
      experience: 100
    },
    completionConditions: [
      { type: 'command_executed', target: 'scan' },
      { type: 'command_executed', target: 'probe' }
    ]
  },
  {
    id: 'mission_001',
    title: 'First Hack',
    sender: 'bit',
    briefing: 'Time for your first real hack. Use the SSHcrack tool to compromise a target system.',
    objective: 'Successfully compromise a network device',
    objectives: [
      'Use SSHcrack.exe on a discovered target',
      'Successfully compromise the system',
      'Access the target\'s file system'
    ],
    description: 'Your first real hacking mission. Compromise a system using the SSHcrack tool.',
    faction: 'bit',
    difficulty: 'easy',
    completed: false,
    reward: {
      credits: 500,
      experience: 250
    },
    completionConditions: [
      { type: 'tool_used', target: 'sshcrack' },
      { type: 'node_compromised' }
    ]
  }
];
