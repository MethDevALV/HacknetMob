
import React, { useState } from 'react';
import { Play, Clock, CheckCircle, DollarSign, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameState } from '../hooks/useGameStateNative';
import { cyberpunkStyles } from '../styles/cyberpunkTheme';

interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  reward: {
    credits: number;
    experience: number;
    tools?: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'available' | 'active' | 'completed';
  progress: number;
}

const MissionsNative: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  const missions: Mission[] = [
    {
      id: 'tutorial_scan',
      title: 'First Steps',
      description: 'Learn the basics of network reconnaissance by discovering nearby devices.',
      objectives: [
        'Use the "scan" command to discover network devices',
        'Use "probe" to analyze at least one target',
        'Identify devices with different security levels'
      ],
      reward: {
        credits: 100,
        experience: 50
      },
      difficulty: 'easy',
      status: 'available',
      progress: 0
    },
    {
      id: 'first_breach',
      title: 'Digital Intrusion',
      description: 'Compromise your first target system using available exploitation tools.',
      objectives: [
        'Successfully compromise a low-security device',
        'Connect to the compromised system',
        'Navigate the remote file system'
      ],
      reward: {
        credits: 250,
        experience: 100,
        tools: ['FTPBounce']
      },
      difficulty: 'medium',
      status: 'available',
      progress: 0
    },
    {
      id: 'data_extraction',
      title: 'Intelligence Gathering',
      description: 'Extract sensitive information from compromised systems.',
      objectives: [
        'Compromise at least 2 different systems',
        'Find and read system log files',
        'Locate password databases',
        'Extract at least 3 pieces of sensitive data'
      ],
      reward: {
        credits: 500,
        experience: 200,
        tools: ['WebServerWorm']
      },
      difficulty: 'hard',
      status: 'available',
      progress: 0
    },
    {
      id: 'ghost_protocol',
      title: 'Stealth Operations',
      description: 'Complete objectives while maintaining low trace levels.',
      objectives: [
        'Complete 5 successful attacks',
        'Keep trace level below 25%',
        'Use at least 3 different attack tools',
        'Avoid detection for 24 hours'
      ],
      reward: {
        credits: 1000,
        experience: 500,
        tools: ['AdvancedPortHack', 'Stealth']
      },
      difficulty: 'hard',
      status: 'available',
      progress: 0
    }
  ];

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '#00ff41';
      case 'medium': return '#ffff00';
      case 'hard': return '#ff0040';
    }
  };

  const getStatusIcon = (status: Mission['status']) => {
    switch (status) {
      case 'available': return Play;
      case 'active': return Clock;
      case 'completed': return CheckCircle;
    }
  };

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'available': return '#00ff41';
      case 'active': return '#ffff00';
      case 'completed': return '#00ffff';
    }
  };

  const acceptMission = (missionId: string) => {
    console.log(`Mission ${missionId} accepted`);
  };

  const renderMissionCard = (mission: Mission) => {
    const StatusIcon = getStatusIcon(mission.status);
    
    return (
      <div
        key={mission.id}
        style={{
          ...cyberpunkStyles.glowBox,
          marginBottom: '12px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: selectedMission === mission.id ? 'rgba(0, 255, 65, 0.15)' : 'rgba(0, 255, 65, 0.05)',
          cursor: 'pointer'
        }}
        onClick={() => setSelectedMission(selectedMission === mission.id ? null : mission.id)}
      >
        {/* Mission Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <StatusIcon 
            size={24} 
            color={getStatusColor(mission.status)} 
            style={{ marginRight: '12px' }}
          />
          
          <div style={{ flex: 1 }}>
            <div style={{ ...cyberpunkStyles.systemText, fontSize: '16px', fontWeight: 'bold' }}>
              {mission.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginRight: '8px',
                color: getDifficultyColor(mission.difficulty)
              }}>
                {mission.difficulty.toUpperCase()}
              </span>
              <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', opacity: 0.7 }}>
                {mission.status.toUpperCase()}
              </span>
            </div>
          </div>

          {selectedMission === mission.id ? 
            <ChevronUp size={20} color="#00ff41" /> : 
            <ChevronDown size={20} color="#00ff41" />
          }
        </div>

        {/* Mission Description */}
        <div style={{ ...cyberpunkStyles.matrixText, fontSize: '13px', marginBottom: '8px', lineHeight: '18px' }}>
          {mission.description}
        </div>

        {/* Rewards */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <DollarSign size={16} color="#ffff00" style={{ marginRight: '4px' }} />
          <span style={{ ...cyberpunkStyles.warningText, fontSize: '12px', marginRight: '16px' }}>
            {mission.reward.credits} Credits
          </span>
          <Star size={16} color="#00ffff" style={{ marginRight: '4px' }} />
          <span style={{ ...cyberpunkStyles.systemText, fontSize: '12px' }}>
            {mission.reward.experience} XP
          </span>
        </div>

        {/* Expanded Details */}
        {selectedMission === mission.id && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #00ff4130' }}>
            <div style={{ ...cyberpunkStyles.systemText, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              OBJECTIVES:
            </div>
            
            {mission.objectives.map((objective, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', marginRight: '8px' }}>
                  •
                </span>
                <span style={{ ...cyberpunkStyles.matrixText, fontSize: '12px', flex: 1, lineHeight: '16px' }}>
                  {objective}
                </span>
              </div>
            ))}

            {mission.reward.tools && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ ...cyberpunkStyles.systemText, fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  TOOL REWARDS:
                </div>
                {mission.reward.tools.map((tool, index) => (
                  <div key={index} style={{ ...cyberpunkStyles.successText, fontSize: '12px', marginLeft: '16px' }}>
                    • {tool}
                  </div>
                ))}
              </div>
            )}

            {mission.status === 'available' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  acceptMission(mission.id);
                }}
                style={{
                  ...cyberpunkStyles.cyberpunkButton,
                  marginTop: '12px',
                  padding: '10px',
                  borderRadius: '4px',
                  width: '100%',
                  backgroundColor: 'rgba(0, 255, 65, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ ...cyberpunkStyles.matrixText, fontSize: '14px', fontWeight: 'bold' }}>
                  ACCEPT MISSION
                </span>
              </button>
            )}

            {mission.status === 'active' && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <div style={{ ...cyberpunkStyles.warningText, fontSize: '12px', marginBottom: '4px' }}>
                  MISSION IN PROGRESS
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  backgroundColor: '#333', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${mission.progress}%`, 
                    height: '100%', 
                    backgroundColor: '#ffff00' 
                  }} />
                </div>
                <div style={{ ...cyberpunkStyles.matrixText, fontSize: '10px', marginTop: '2px' }}>
                  {mission.progress}% Complete
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-black flex flex-col" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ ...cyberpunkStyles.glowBox, padding: '12px', marginBottom: '16px', borderRadius: '8px' }}>
        <div style={{ ...cyberpunkStyles.systemText, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          MISSION CONTROL
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...cyberpunkStyles.warningText, fontSize: '12px' }}>Credits</div>
            <div style={{ ...cyberpunkStyles.warningText, fontSize: '16px', fontWeight: 'bold' }}>
              ${gameState.credits}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...cyberpunkStyles.systemText, fontSize: '12px' }}>Experience</div>
            <div style={{ ...cyberpunkStyles.systemText, fontSize: '16px', fontWeight: 'bold' }}>
              {gameState.experience} XP
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...cyberpunkStyles.matrixText, fontSize: '12px' }}>Completed</div>
            <div style={{ ...cyberpunkStyles.matrixText, fontSize: '16px', fontWeight: 'bold' }}>
              {gameState.completedMissions?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Mission List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {missions.map(renderMissionCard)}
      </div>
    </div>
  );
};

export default MissionsNative;
