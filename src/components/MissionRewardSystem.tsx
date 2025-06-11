
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useGameState } from '../hooks/useGameState';
import { Trophy, Gift, Star, CheckCircle } from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  reward: string;
  description: string;
  completed: boolean;
  rewardClaimed: boolean;
  experience: number;
  credits: number;
}

interface MissionRewardSystemProps {
  mission: Mission;
  onRewardClaim: (missionId: string) => void;
}

export const MissionRewardSystem: React.FC<MissionRewardSystemProps> = ({
  mission,
  onRewardClaim
}) => {
  const { gameState, updateGameState } = useGameState();
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);

  const handleClaimReward = () => {
    if (!mission.completed || mission.rewardClaimed) return;

    setShowRewardAnimation(true);
    
    // Update game state with rewards
    updateGameState({
      credits: gameState.credits + mission.credits,
      experience: gameState.experience + mission.experience,
      completedMissions: [...gameState.completedMissions, mission.id],
      claimedRewards: [...gameState.claimedRewards, mission.id]
    });

    onRewardClaim(mission.id);

    // Reset animation after delay
    setTimeout(() => {
      setShowRewardAnimation(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-matrix-green/30 rounded-lg p-4 relative overflow-hidden">
      {/* Reward animation overlay */}
      {showRewardAnimation && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 animate-pulse z-10 flex items-center justify-center">
          <div className="text-center">
            <Trophy size={48} className="text-yellow-400 mx-auto animate-bounce" />
            <div className="text-xl font-bold text-yellow-400 mt-2">Reward Claimed!</div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {mission.completed ? (
            <CheckCircle size={24} className="text-matrix-green" />
          ) : (
            <Star size={24} className="text-yellow-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-matrix-cyan mb-2">{mission.name}</h3>
          <p className="text-sm text-matrix-green/80 mb-3">{mission.description}</p>

          {/* Reward details */}
          <div className="bg-black/50 border border-matrix-green/20 rounded p-3 mb-3">
            <h4 className="font-semibold text-matrix-green mb-2 flex items-center gap-2">
              <Gift size={16} />
              Rewards
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-yellow-400">
                Credits: +{mission.credits}
              </div>
              <div className="text-blue-400">
                Experience: +{mission.experience}
              </div>
              <div className="col-span-2 text-matrix-green">
                {mission.reward}
              </div>
            </div>
          </div>

          {/* Action button */}
          {mission.completed && !mission.rewardClaimed ? (
            <Button
              onClick={handleClaimReward}
              className="w-full bg-gradient-to-r from-yellow-600/20 to-green-600/20 border-yellow-400 text-yellow-400 hover:from-yellow-600/30 hover:to-green-600/30"
              variant="outline"
            >
              <Trophy size={16} className="mr-2" />
              Claim Reward
            </Button>
          ) : mission.rewardClaimed ? (
            <div className="w-full text-center py-2 text-matrix-green border border-matrix-green/30 rounded">
              <CheckCircle size={16} className="inline mr-2" />
              Reward Claimed
            </div>
          ) : (
            <div className="w-full text-center py-2 text-gray-500 border border-gray-600 rounded">
              Complete mission to claim reward
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
