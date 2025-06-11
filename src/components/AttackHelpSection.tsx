
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Shield, AlertTriangle, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface AttackHelpSectionProps {
  attackCommands: string[];
}

export const AttackHelpSection: React.FC<AttackHelpSectionProps> = ({
  attackCommands
}) => {
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);

  const commandHelp = {
    firewall: {
      description: 'Activate firewall protection against network attacks',
      usage: 'firewall',
      effectiveness: 'High against reconnaissance, medium against DDoS',
      resourceCost: 'CPU: 15, RAM: 256MB',
      cooldown: '60 seconds',
      tips: [
        'Use early when under reconnaissance',
        'Combine with other defenses for maximum effect',
        'Monitor resource usage during activation'
      ]
    },
    isolate: {
      description: 'Isolate compromised systems to prevent spread',
      usage: 'isolate',
      effectiveness: 'High against logic bombs and reverse intrusion',
      resourceCost: 'CPU: 30, RAM: 512MB',
      cooldown: 'No cooldown',
      tips: [
        'Use immediately when malware is detected',
        'Temporarily disables some functionality',
        'Can be reversed with restore command'
      ]
    },
    trace_block: {
      description: 'Block incoming trace attempts',
      usage: 'trace_block',
      effectiveness: 'Very high against trace attacks',
      resourceCost: 'CPU: 20, RAM: 128MB, Network: 30',
      cooldown: '90 seconds',
      tips: [
        'Essential when trace level is high',
        'Use proxy servers for additional protection',
        'Monitor network bandwidth usage'
      ]
    },
    counter_hack: {
      description: 'Launch offensive counter-attack',
      usage: 'counter_hack',
      effectiveness: 'High against all attack types',
      resourceCost: 'CPU: 40, RAM: 2GB, Network: 30',
      cooldown: '180 seconds',
      tips: [
        'High risk, high reward defense',
        'Can backfire if not timed correctly',
        'Use only when other defenses are insufficient'
      ]
    },
    deflect: {
      description: 'Deflect DDoS attacks back to source',
      usage: 'deflect',
      effectiveness: 'Very high against DDoS attacks',
      resourceCost: 'CPU: 25, RAM: 1GB, Network: 50',
      cooldown: '120 seconds',
      tips: [
        'Specialized anti-DDoS tool',
        'High network bandwidth requirement',
        'Most effective against sustained attacks'
      ]
    },
    scramble: {
      description: 'Scramble network traffic to confuse attackers',
      usage: 'scramble',
      effectiveness: 'High against reconnaissance',
      resourceCost: 'CPU: 20, RAM: 512MB',
      cooldown: '45 seconds',
      tips: [
        'Makes your system harder to analyze',
        'Useful in early attack phases',
        'Can slow down your own operations slightly'
      ]
    },
    panic: {
      description: 'Emergency disconnect - last resort',
      usage: 'panic',
      effectiveness: 'Stops all attacks immediately',
      resourceCost: 'None',
      cooldown: '300 seconds',
      tips: [
        'Use only as absolute last resort',
        'Disconnects you from all networks',
        'Resets current location to localhost',
        'Long cooldown period'
      ]
    }
  };

  const toggleExpanded = (command: string) => {
    setExpandedCommand(expandedCommand === command ? null : command);
  };

  const getCommandIcon = (command: string) => {
    switch (command) {
      case 'firewall':
      case 'isolate':
      case 'trace_block':
        return <Shield size={20} className="text-blue-400" />;
      case 'counter_hack':
        return <Zap size={20} className="text-red-400" />;
      case 'panic':
        return <AlertTriangle size={20} className="text-yellow-400" />;
      default:
        return <Shield size={20} className="text-matrix-green" />;
    }
  };

  return (
    <div className="bg-black border border-matrix-green/30 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <Shield size={24} className="text-matrix-cyan" />
        <h2 className="text-lg font-bold text-matrix-cyan">Defense Command Help</h2>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3 mb-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Info size={16} />
          <span className="font-semibold">Quick Defense Guide</span>
        </div>
        <p className="text-blue-300 text-sm">
          Use these commands in the terminal to defend against cyber attacks. 
          Each command has different effectiveness, resource costs, and cooldowns.
        </p>
      </div>

      <div className="space-y-2">
        {attackCommands.map((command) => {
          const help = commandHelp[command as keyof typeof commandHelp];
          const isExpanded = expandedCommand === command;
          
          if (!help) return null;

          return (
            <div
              key={command}
              className="border border-matrix-green/20 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(command)}
                className="w-full p-3 bg-gray-900/50 hover:bg-gray-800/50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {getCommandIcon(command)}
                  <div className="text-left">
                    <div className="font-mono font-bold text-matrix-green">
                      {command}
                    </div>
                    <div className="text-sm text-matrix-green/70">
                      {help.description}
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} className="text-matrix-green" />
                ) : (
                  <ChevronDown size={20} className="text-matrix-green" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 bg-black/30 border-t border-matrix-green/20">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-matrix-cyan mb-2">Command Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-matrix-green/70">Usage:</span>
                          <code className="ml-2 bg-black/50 px-2 py-1 rounded text-matrix-green">
                            {help.usage}
                          </code>
                        </div>
                        <div>
                          <span className="text-matrix-green/70">Effectiveness:</span>
                          <span className="ml-2 text-matrix-green">{help.effectiveness}</span>
                        </div>
                        <div>
                          <span className="text-matrix-green/70">Resource Cost:</span>
                          <span className="ml-2 text-yellow-400">{help.resourceCost}</span>
                        </div>
                        <div>
                          <span className="text-matrix-green/70">Cooldown:</span>
                          <span className="ml-2 text-red-400">{help.cooldown}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-matrix-cyan mb-2">Tips & Strategies</h4>
                      <ul className="space-y-1 text-sm">
                        {help.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-matrix-green/50 mt-1">•</span>
                            <span className="text-matrix-green/80">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      // Copy command to clipboard or execute
                      navigator.clipboard?.writeText(command);
                    }}
                    variant="outline"
                    className="mt-4 border-matrix-green text-matrix-green hover:bg-matrix-green/20"
                  >
                    Copy Command
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <AlertTriangle size={16} />
          <span className="font-semibold">Emergency Procedures</span>
        </div>
        <p className="text-red-300 text-sm">
          If overwhelmed by attacks, use the <code className="bg-black/50 px-1 rounded">panic</code> command 
          to immediately disconnect and stop all attacks. This should be used as a last resort.
        </p>
      </div>
    </div>
  );
};
