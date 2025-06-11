
import React from 'react';
import { Mission } from '../../utils/missions/MissionData';
import { MissionManager } from '../../utils/missions/MissionManager';

interface MissionListProps {
  missions: Mission[];
  gameState: any;
  selectedMission: string | null;
  onMissionClick: (missionId: string) => void;
}

export const MissionList: React.FC<MissionListProps> = ({
  missions,
  gameState,
  selectedMission,
  onMissionClick
}) => {
  const getFactionColor = (faction: Mission['faction']) => {
    const colors = {
      'bit': 'text-matrix-cyan',
      'entropy': 'text-purple-400',
      'naix': 'text-red-400',
      'csec': 'text-blue-400',
      'el': 'text-yellow-400',
      'final': 'text-orange-400'
    };
    return colors[faction] || 'text-matrix-green';
  };

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    const colors = {
      'tutorial': 'text-green-400',
      'easy': 'text-matrix-green',
      'medium': 'text-yellow-400',
      'hard': 'text-orange-500',
      'extreme': 'text-red-500'
    };
    return colors[difficulty] || 'text-matrix-green';
  };

  if (missions.length === 0) {
    return (
      <div className="text-center py-8 text-matrix-green/60">
        <p>No missions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {missions.map(mission => {
        const isSelected = selectedMission === mission.id;
        const isClaimed = gameState.claimedRewards?.includes(mission.id);
        
        return (
          <div
            key={mission.id}
            className={`border border-matrix-green p-3 cursor-pointer transition-all duration-300 hover:bg-matrix-green hover:bg-opacity-10 ${
              isSelected ? 'bg-matrix-green bg-opacity-20 shadow-lg shadow-matrix-green' : ''
            } ${isClaimed ? 'opacity-60' : ''}`}
            onClick={() => onMissionClick(mission.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-matrix-cyan font-bold text-sm">{mission.title}</span>
              <div className="flex gap-2">
                <span className={`text-xs font-bold ${getFactionColor(mission.faction)}`}>
                  {mission.faction.toUpperCase()}
                </span>
                <span className={`text-xs font-bold ${getDifficultyColor(mission.difficulty)}`}>
                  {mission.difficulty.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="text-sm mb-2">
              <span className="text-matrix-green/70">From: </span>
              <span className={getFactionColor(mission.faction)}>{mission.sender}</span>
            </div>
            
            <div className="text-xs text-matrix-green/80 mb-2">
              {mission.description}
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-yellow-400">
                ${mission.reward.credits} + {mission.reward.experience} XP
                {mission.reward.tools && (
                  <span className="text-blue-400 ml-2">
                    +{mission.reward.tools.join(', ')}
                  </span>
                )}
              </span>
              {mission.timeLimit && (
                <span className="text-orange-500">{mission.timeLimit}s</span>
              )}
            </div>

            {gameState.activeMissions?.includes(mission.id) && (
              <div className="mt-2 text-xs text-yellow-400">
                Progress: {MissionManager.getProgressText(mission, gameState)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
