import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { missionDatabaseComplete } from '../utils/missions/MissionDataComplete';
import { MissionManagerEnhanced } from '../utils/missions/MissionManagerEnhanced';
import { MissionList } from './missions/MissionList';
import { MissionDetails } from './missions/MissionDetails';
import { gameCore } from '../core/GameCore';
import { Mission } from '../types/CoreTypes';

export const MissionPanelEnhanced: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');
  const { gameState, updateGameState } = useGameState();

  // Helper function to convert mission IDs to Mission objects
  const getMissionObjectsFromIds = (missionIds: string[]): Mission[] => {
    return missionIds
      .map(id => MissionManagerEnhanced.getMissionById(id))
      .filter((mission): mission is Mission => mission !== undefined);
  };

  // Get missions by status using mission IDs correctly
  const availableMissions = MissionManagerEnhanced.getAvailableMissions(gameState.completedMissions || []);
  const activeMissions = getMissionObjectsFromIds(gameState.activeMissions || []);
  const completedMissions = getMissionObjectsFromIds(gameState.completedMissions || []);

  // Enhanced mission completion check
  useEffect(() => {
    const checkMissions = () => {
      if (gameState.activeMissions && gameState.activeMissions.length > 0) {
        gameState.activeMissions.forEach((missionId: string) => {
          const mission = MissionManagerEnhanced.getMissionById(missionId);
          if (mission && MissionManagerEnhanced.checkMissionCompletion(mission, gameState)) {
            if (!(gameState.completedMissions || []).includes(missionId)) {
              console.log(`[MissionPanelEnhanced] Mission ${missionId} completed!`);
              updateGameState({
                completedMissions: [...(gameState.completedMissions || []), missionId],
                activeMissions: (gameState.activeMissions || []).filter((id: string) => id !== missionId)
              });
              
              gameCore.notifyMissionUpdated(missionId, 'completed');
            }
          }
        });
      }
    };

    checkMissions();
    const interval = setInterval(checkMissions, 2000);
    return () => clearInterval(interval);
  }, [gameState, updateGameState]);

  // Listen to GameCore events
  useEffect(() => {
    const handleFileDeleted = () => {
      console.log('[MissionPanelEnhanced] File deleted event received');
    };

    const handleNodeCompromised = () => {
      console.log('[MissionPanelEnhanced] Node compromised event received');
    };

    const handleNetworkUpdated = () => {
      console.log('[MissionPanelEnhanced] Network updated event received');
    };

    gameCore.on('file_deleted', handleFileDeleted);
    gameCore.on('node_compromised', handleNodeCompromised);
    gameCore.on('network_updated', handleNetworkUpdated);

    return () => {
      gameCore.off('file_deleted', handleFileDeleted);
      gameCore.off('node_compromised', handleNodeCompromised);
      gameCore.off('network_updated', handleNetworkUpdated);
    };
  }, []);

  const handleMissionClick = (missionId: string) => {
    setSelectedMission(missionId === selectedMission ? null : missionId);
  };

  const handleAcceptMission = (missionId: string) => {
    console.log(`[MissionPanelEnhanced] Accepting mission: ${missionId}`);
    
    if (!(gameState.activeMissions || []).includes(missionId)) {
      // Plant mission files first
      MissionManagerEnhanced.plantMissionFiles(missionId);
      
      // Create any required mission nodes
      MissionManagerEnhanced.createMissionNodes(missionId);
      
      // Update game state to include the mission ID
      const newActiveMissions = [...(gameState.activeMissions || []), missionId];
      
      updateGameState({
        activeMissions: newActiveMissions
      });
      
      // Notify GameCore
      gameCore.notifyMissionUpdated(missionId, 'accepted');
      
      // Switch to active tab to show the newly accepted mission
      setActiveTab('active');
      
      console.log(`[MissionPanelEnhanced] Mission ${missionId} accepted successfully`);
      console.log(`[MissionPanelEnhanced] Active missions now:`, newActiveMissions);
    } else {
      console.log(`[MissionPanelEnhanced] Mission ${missionId} already active`);
    }
  };

  const handleAbandonMission = (missionId: string) => {
    console.log(`[MissionPanelEnhanced] Abandoning mission: ${missionId}`);
    
    updateGameState({
      activeMissions: (gameState.activeMissions || []).filter((id: string) => id !== missionId)
    });
    
    gameCore.notifyMissionUpdated(missionId, 'abandoned');
  };

  const handleClaimReward = (missionId: string) => {
    const mission = MissionManagerEnhanced.getMissionById(missionId);
    if (mission && !(gameState.claimedRewards || []).includes(missionId)) {
      console.log(`[MissionPanelEnhanced] Claiming reward for mission: ${missionId}`);
      
      const currentCredits = typeof gameState.credits === 'number' ? gameState.credits : 0;
      const currentExperience = typeof gameState.experience === 'number' ? gameState.experience : 0;
      
      const updates: any = {
        credits: currentCredits + mission.reward.credits,
        experience: currentExperience + mission.reward.experience,
        claimedRewards: [...(gameState.claimedRewards || []), missionId]
      };

      if (mission.reward.tools) {
        updates.unlockedTools = [...new Set([...gameState.unlockedTools, ...mission.reward.tools])];
      }

      if (mission.reward.reputation) {
        const newReputation = { ...gameState.reputation };
        Object.entries(mission.reward.reputation).forEach(([faction, points]) => {
          const currentPoints = typeof newReputation[faction] === 'number' ? newReputation[faction] : 0;
          newReputation[faction] = currentPoints + (typeof points === 'number' ? points : 0);
        });
        updates.reputation = newReputation;
      }
      
      updateGameState(updates);
      gameCore.notifyMissionUpdated(missionId, 'rewarded');
    }
  };

  const selectedMissionData = selectedMission ? MissionManagerEnhanced.getMissionById(selectedMission) : null;

  return (
    <div className="h-full flex flex-col p-3 border rounded-lg" style={{
      backgroundColor: 'var(--theme-surface)',
      borderColor: 'var(--theme-border)',
      color: 'var(--theme-text)'
    }}>
      {/* Header */}
      <div className="mb-3 pb-2 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <h3 className="cyber-heading text-lg mb-2">MISSION CONTROL</h3>
        
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
              className={`px-3 py-1 text-sm border transition-all cyber-button ${
                activeTab === tab.key ? 'bg-theme-primary text-theme-background' : ''
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
        <div className="mt-3 pt-3 border-t max-h-64 overflow-y-auto" style={{ borderColor: 'var(--theme-border)' }}>
          <MissionDetails
            mission={selectedMissionData}
            gameState={gameState}
            onAccept={handleAcceptMission}
            onAbandon={handleAbandonMission}
            onClaimReward={handleClaimReward}
          />
        </div>
      )}
    </div>
  );
};

export default MissionPanelEnhanced;
