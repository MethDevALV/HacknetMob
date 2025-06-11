
// Complete HackNet mission recreation
import { Mission } from '../types/HackNetTypes';

export const HACKNET_MISSIONS: Mission[] = [
  // Bit's Introduction Arc
  {
    id: 'first_contact',
    title: 'First Contact',
    sender: 'bit',
    subject: 'Getting Started',
    content: `Welcome to the network.

Your first task is simple - connect to your home computer and delete the file 'SecurityTracer.exe' from the /bin directory. This will remove the monitoring software that's been tracking your activities.

Use the 'connect' command to connect to localhost (127.0.0.1), then navigate to /bin and use 'rm SecurityTracer.exe' to delete it.

Good luck.

-bit`,
    faction: 'bit',
    difficulty: 1,
    goals: [
      {
        id: 'connect_localhost',
        type: 'connect',
        description: 'Connect to localhost',
        target: '127.0.0.1',
        completed: false
      },
      {
        id: 'delete_tracer',
        type: 'delete',
        description: 'Delete SecurityTracer.exe',
        file: 'SecurityTracer.exe',
        target: '/bin',
        completed: false
      }
    ],
    rewards: {
      credits: 50,
      experience: 25,
      reputation: { bit: 10 }
    },
    prerequisites: [],
    status: 'available'
  },
  {
    id: 'getting_tools',
    title: 'Getting some Tools',
    sender: 'bit',
    subject: 'Your First Hack',
    content: `Good work on that first task. Now it's time to get you some proper tools.

I've found a low-security machine that should be perfect for practice. Connect to 192.168.1.50 and grab the SSHcrack.exe file from their /bin directory.

You'll need to hack in first - use the 'probe' command to see what ports are open, then use 'scan' to find vulnerabilities. Most basic systems have SSH running on port 22.

The file is: SSHcrack.exe
Location: /bin

Download it with the 'scp' command.

-bit`,
    faction: 'bit',
    difficulty: 2,
    goals: [
      {
        id: 'hack_target',
        type: 'hack',
        description: 'Hack into 192.168.1.50',
        target: '192.168.1.50',
        completed: false
      },
      {
        id: 'download_sshcrack',
        type: 'download',
        description: 'Download SSHcrack.exe',
        file: 'SSHcrack.exe',
        target: '/bin',
        completed: false
      }
    ],
    rewards: {
      credits: 100,
      experience: 50,
      tools: ['SSHcrack.exe'],
      reputation: { bit: 20 }
    },
    prerequisites: ['first_contact'],
    status: 'available'
  },
  {
    id: 'maiden_flight',
    title: 'Maiden Flight',
    sender: 'bit',
    subject: 'Test Your Skills',
    content: `Time for a real test. I want you to hack into the machine at 10.0.0.25.

This is a standard corporate workstation with basic security. Use your new SSHcrack tool to break in. Remember:

1. Scan the target first
2. Probe for open ports  
3. Use SSHcrack.exe on port 22
4. Connect once you've cracked it

Show me you can handle this level of intrusion.

-bit`,
    faction: 'bit',
    difficulty: 2,
    goals: [
      {
        id: 'scan_target',
        type: 'scan',
        description: 'Scan 10.0.0.25',
        target: '10.0.0.25',
        completed: false
      },
      {
        id: 'hack_workstation',
        type: 'hack',
        description: 'Successfully hack 10.0.0.25',
        target: '10.0.0.25',
        completed: false
      }
    ],
    rewards: {
      credits: 150,
      experience: 75,
      reputation: { bit: 30 }
    },
    prerequisites: ['getting_tools'],
    status: 'available'
  },
  {
    id: 'something_in_return',
    title: 'Something in Return',
    sender: 'bit',
    subject: 'Your First Real Job',
    content: `I need a favor. There's a machine belonging to someone who's been causing me trouble - 172.16.0.10.

I need you to break in and delete ALL the log files in the /log directory. Every single one. This will cover our tracks and send a message.

Target: 172.16.0.10
Task: Delete everything in /log
Payment: 200 credits

This is real work now. Be careful - more secure systems might have traces.

-bit`,
    faction: 'bit',
    difficulty: 3,
    timeLimit: 300, // 5 minutes
    goals: [
      {
        id: 'hack_target_system',
        type: 'hack',
        description: 'Hack into 172.16.0.10',
        target: '172.16.0.10',
        completed: false
      },
      {
        id: 'clear_logs',
        type: 'delete',
        description: 'Delete all files in /log directory',
        target: '/log',
        file: '*',
        completed: false
      }
    ],
    rewards: {
      credits: 200,
      experience: 100,
      reputation: { bit: 50 }
    },
    prerequisites: ['maiden_flight'],
    status: 'available'
  },

  // Entropy Arc
  {
    id: 'entropy_invitation',
    title: 'Where to go from here?',
    sender: 'entropy',
    subject: 'An Invitation',
    content: `Greetings.

We represent a collective of like-minded individuals who have been observing your recent activities. Your skills show promise, but you lack direction.

We are Entropy. We offer knowledge, tools, and purpose to those worthy of our trust.

If you wish to join us, complete our initiation test. Connect to our server at 203.0.113.15 and download the file 'Entropy_Test.exe' from /home/test.

Consider this an opportunity.

-Entropy`,
    faction: 'entropy',
    difficulty: 4,
    goals: [
      {
        id: 'connect_entropy',
        type: 'connect',
        description: 'Connect to Entropy server',
        target: '203.0.113.15',
        completed: false
      },
      {
        id: 'download_test',
        type: 'download',
        description: 'Download Entropy_Test.exe',
        file: 'Entropy_Test.exe',
        target: '/home/test',
        completed: false
      }
    ],
    rewards: {
      credits: 300,
      experience: 150,
      reputation: { entropy: 100 },
      tools: ['FTPBounce.exe']
    },
    prerequisites: ['something_in_return'],
    status: 'available'
  }
];

// Mission reward interface
export interface MissionReward {
  credits: number;
  experience: number;
  tools?: string[];
  reputation?: Record<string, number>;
}
