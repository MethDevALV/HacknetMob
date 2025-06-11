
import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { missionDatabase, Mission } from '../utils/missions/MissionData';
import { MissionManager } from '../utils/missions/MissionManager';
import { MissionList } from './missions/MissionList';
import { MissionDetails } from './missions/MissionDetails';
import { gameCore } from '../core/GameCore';

export const MissionPanel: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');

  // Get missions by status
  const availableMissions = MissionManager.getAvailableMissions(gameState.completedMissions || []);
  const activeMissions = missionDatabase.filter(m => gameState.activeMissions?.includes(m.id));
  const completedMissions = missionDatabase.filter(m => gameState.completedMissions?.includes(m.id));

  // Enhanced mission completion check with more frequent updates
  useEffect(() => {
    const checkMissions = () => {
      if (gameState.activeMissions) {
        gameState.activeMissions.forEach((missionId: string) => {
          const mission = MissionManager.getMissionById(missionId);
          if (mission && MissionManager.checkMissionCompletion(mission, gameState)) {
            if (!gameState.completedMissions?.includes(missionId)) {
              console.log(`[MissionPanel] Mission ${missionId} completed!`);
              updateGameState({
                completedMissions: [...(gameState.completedMissions || []), missionId],
                activeMissions: gameState.activeMissions.filter((id: string) => id !== missionId)
              });
              
              // Notify GameCore
              gameCore.notifyMissionUpdated(missionId, 'completed');
            }
          }
        });
      }
    };

    // Check immediately
    checkMissions();

    // Set up interval for regular checks
    const interval = setInterval(checkMissions, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [gameState, updateGameState]);

  // Listen to GameCore events for real-time updates
  useEffect(() => {
    const handleFileDeleted = (event: any) => {
      console.log('[MissionPanel] File deleted event received:', event.data);
      // Mission completion will be checked in the main useEffect
    };

    const handleFileSystemChange = (event: any) => {
      console.log('[MissionPanel] File system changed event received:', event.data);
      // Mission completion will be checked in the main useEffect
    };

    const handleNodeCompromised = (event: any) => {
      console.log('[MissionPanel] Node compromised event received:', event.data);
      // Mission completion will be checked in the main useEffect
    };

    const handleNetworkUpdated = (event: any) => {
      console.log('[MissionPanel] Network updated event received');
      // Mission completion will be checked in the main useEffect
    };

    gameCore.on('file_deleted', handleFileDeleted);
    gameCore.on('file_system_changed', handleFileSystemChange);
    gameCore.on('node_compromised', handleNodeCompromised);
    gameCore.on('network_updated', handleNetworkUpdated);

    return () => {
      gameCore.off('file_deleted', handleFileDeleted);
      gameCore.off('file_system_changed', handleFileSystemChange);
      gameCore.off('node_compromised', handleNodeCompromised);
      gameCore.off('network_updated', handleNetworkUpdated);
    };
  }, []);

  const handleMissionClick = (missionId: string) => {
    setSelectedMission(missionId === selectedMission ? null : missionId);
  };

  const handleAcceptMission = (missionId: string) => {
    if (!gameState.activeMissions?.includes(missionId)) {
      MissionManager.plantMissionFiles(missionId);
      
      updateGameState({
        activeMissions: [...(gameState.activeMissions || []), missionId]
      });
      
      // Notify GameCore
      gameCore.notifyMissionUpdated(missionId, 'accepted');
      
      console.log(`[MissionPanel] Mission ${missionId} accepted and files planted`);
    }
  };

  const handleAbandonMission = (missionId: string) => {
    updateGameState({
      activeMissions: (gameState.activeMissions || []).filter((id: string) => id !== missionId)
    });
    
    // Notify GameCore
    gameCore.notifyMissionUpdated(missionId, 'abandoned');
  };

  const handleClaimReward = (missionId: string) => {
    const mission = MissionManager.getMissionById(missionId);
    if (mission && !gameState.claimedRewards?.includes(missionId)) {
      updateGameState({
        credits: gameState.credits + mission.reward.credits,
        experience: gameState.experience + mission.reward.experience,
        claimedRewards: [...(gameState.claimedRewards || []), missionId]
      });

      if (mission.reward.tools) {
        updateGameState({
          unlockedTools: [...new Set([...gameState.unlockedTools, ...mission.reward.tools])]
        });
      }
      
      // Notify GameCore
      gameCore.notifyMissionUpdated(missionId, 'rewarded');
    }
  };

  const selectedMissionData = selectedMission ? MissionManager.getMissionById(selectedMission) : null;

  return (
    <div className="h-full flex flex-col p-3 text-matrix-green">
      {/* Header */}
      <div className="mb-3 pb-2 border-b border-matrix-green">
        <h3 className="text-matrix-cyan font-bold text-lg mb-2">MISSION CONTROL</h3>
        
        {/* Tab navigation */}
        <div className="flex gap-1">
          {[
            { key: 'available', label: 'Available', count: availableMissions.length },
            { key: 'active', label: 'Active', count: activeMissions.length },
            { key: 'completed', label: 'Completed', count: completedMissions.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1 text-sm border transition-all ${
                activeTab === tab.key
                  ? 'border-matrix-cyan text-matrix-cyan bg-matrix-cyan/20'
                  : 'border-matrix-green/30 text-matrix-green hover:border-matrix-green'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Mission list */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'available' && (
          <MissionList
            missions={availableMissions}
            gameState={gameState}
            selectedMission={selectedMission}
            onMissionClick={handleMissionClick}
          />
        )}
        {activeTab === 'active' && (
          <MissionList
            missions={activeMissions}
            gameState={gameState}
            selectedMission={selectedMission}
            onMissionClick={handleMissionClick}
          />
        )}
        {activeTab === 'completed' && (
          <MissionList
            missions={completedMissions}
            gameState={gameState}
            selectedMission={selectedMission}
            onMissionClick={handleMissionClick}
          />
        )}
      </div>

      {/* Mission details */}
      {selectedMissionData && (
        <MissionDetails
          mission={selectedMissionData}
          gameState={gameState}
          onAccept={handleAcceptMission}
          onAbandon={handleAbandonMission}
          onClaimReward={handleClaimReward}
        />
      )}
    </div>
  );
};
