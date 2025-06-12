
import React from 'react';
import { Mission } from '../../types/CoreTypes';

interface MissionDetailsProps {
  mission: Mission;
  gameState: any;
  onAccept: (missionId: string) => void;
  onAbandon: (missionId: string) => void;
  onClaimReward: (missionId: string) => void;
}

export const MissionDetails: React.FC<MissionDetailsProps> = ({
  mission,
  gameState,
  onAccept,
  onAbandon,
  onClaimReward
}) => {
  const isActive = gameState.activeMissions?.includes(mission.id);
  const isCompleted = gameState.completedMissions?.includes(mission.id);
  const isClaimed = gameState.claimedRewards?.includes(mission.id);

  return (
    <div className="mt-3 border border-matrix-green p-3 bg-matrix-green bg-opacity-5">
      <h4 className="text-matrix-cyan font-bold mb-2">MISSION BRIEFING</h4>
      <div className="text-sm mb-3 leading-relaxed">
        {mission.briefing}
      </div>
      <div className="text-sm mb-3 p-2 bg-black bg-opacity-30 border border-yellow-400">
        <strong className="text-yellow-400">Objective:</strong> {mission.objectives?.[0] || mission.description}
      </div>
      
      {mission.objectives && mission.objectives.length > 1 && (
        <div className="text-xs mb-3 text-matrix-green/70">
          Additional objectives: {mission.objectives.slice(1).join(', ')}
        </div>
      )}

      <div className="flex gap-2">
        {!isActive && !isCompleted && (
          <button 
            className="px-3 py-2 text-sm border border-matrix-cyan text-matrix-cyan bg-transparent hover:bg-matrix-cyan hover:bg-opacity-20 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onAccept(mission.id);
            }}
          >
            ACCEPT MISSION
          </button>
        )}
        
        {isActive && (
          <button 
            className="px-3 py-2 text-sm border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:bg-opacity-20 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onAbandon(mission.id);
            }}
          >
            ABANDON
          </button>
        )}
        
        {isCompleted && !isClaimed && (
          <button 
            className="px-3 py-2 text-sm border border-matrix-green text-matrix-green bg-transparent hover:bg-matrix-green hover:bg-opacity-20 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onClaimReward(mission.id);
            }}
          >
            CLAIM REWARD
          </button>
        )}
        
        {isClaimed && (
          <div className="px-3 py-2 text-sm text-gray-500 border border-gray-500">
            REWARD CLAIMED
          </div>
        )}
      </div>
    </div>
  );
};
