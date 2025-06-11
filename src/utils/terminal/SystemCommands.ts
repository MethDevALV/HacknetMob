
import { intrusionDetectionSystem } from '../../systems/IntrusionDetectionSystem';
import { terminalCore } from './TerminalCore';

export class SystemCommands {
  private static activeProcesses: Map<string, any> = new Map();

  static handlePs(): string[] {
    const output = ['Active Processes:', ''];
    
    if (SystemCommands.activeProcesses.size === 0) {
      output.push('No active processes');
    } else {
      output.push('PID  COMMAND               STATUS   TIME');
      output.push('---  --------------------  -------  ----');
      
      let pid = 1;
      for (const [processId, process] of SystemCommands.activeProcesses.entries()) {
        const command = process.name.padEnd(20);
        const status = process.status.toUpperCase().padEnd(7);
        const time = Math.floor((Date.now() - process.startTime) / 1000) + 's';
        output.push(`${pid.toString().padEnd(3)}  ${command}  ${status}  ${time}`);
        pid++;
      }
    }

    const traces = intrusionDetectionSystem.getActiveTraces();
    if (traces.length > 0) {
      output.push('', 'Active Traces:');
      traces.forEach((trace, index) => {
        output.push(`T${index + 1}  Trace from ${trace.source}    ${Math.round(trace.progress)}%    ${trace.type.toUpperCase()}`);
      });
    }

    return output;
  }

  static handleKill(args: string[]): string[] {
    if (args.length === 0) {
      return ['Usage: kill <process_id>'];
    }

    const processId = args[0];
    
    if (SystemCommands.activeProcesses.delete(processId)) {
      return [`Process ${processId} terminated`];
    } else {
      return [`kill: ${processId}: No such process`];
    }
  }

  static handleReboot(): string[] {
    SystemCommands.activeProcesses.clear();
    return [
      'System rebooting...',
      'All processes terminated',
      'System online'
    ];
  }

  static handleTraceKill(): string[] {
    const gameState = terminalCore.getGameState();
    const acquiredTools = gameState.unlockedTools || ['SSHcrack.exe'];
    
    if (!acquiredTools.includes('TraceKill.exe')) {
      return [
        'TraceKill.exe not found',
        'You need to acquire this tool first'
      ];
    }

    const killed = intrusionDetectionSystem.killAllTraces();
    
    if (killed) {
      return [
        'TraceKill.exe executed successfully',
        'All active traces terminated',
        'Security systems neutralized'
      ];
    } else {
      return [
        'TraceKill.exe executed',
        'No active traces found'
      ];
    }
  }

  static handleHelp(): string[] {
    return [
      '=== HackNet Terminal Commands ===',
      '',
      'Network Commands:',
      '  scan              - Scan for connected devices',
      '  probe <ip>        - Probe target for open ports',
      '  connect <ip>      - Connect to target system',
      '  disconnect        - Disconnect from current system',
      '',
      'File System:',
      '  ls [path]         - List directory contents',
      '  cd <path>         - Change directory',
      '  cat <file>        - Display file contents',
      '  rm <file>         - Delete file',
      '  scp <file>        - Download file to home system',
      '',
      'Process Management:',
      '  ps                - List running processes',
      '  kill <pid>        - Terminate process',
      '  reboot            - Reboot current system',
      '',
      'Hacking Tools:',
      '  SSHcrack.exe <ip> - Crack SSH (port 22)',
      '  FTPBounce.exe <ip>- Crack FTP (port 21)',
      '  relaySMTP.exe <ip>- Crack SMTP (port 25)',
      '  WebServerWorm.exe <ip> - Crack HTTP (port 80)',
      '  SQLBufferOverflow.exe <ip> - Crack SQL (port 1433)',
      '  SSLTrojan.exe <ip> - Crack HTTPS (port 443)',
      '',
      'Analysis & Defense:',
      '  analyze <file>    - Analyze file structure',
      '  tracekill         - Kill all active traces',
      '  Decypher.exe <file> - Decrypt .dec files',
      '  DECHead.exe <file>  - View .dec headers',
      '',
      'Advanced Tools:',
      '  Sequencer.exe <sequence> - Bypass sequence locks',
      '',
      'Type command name for detailed usage.'
    ];
  }
}
