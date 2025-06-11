
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Zap } from 'lucide-react';

interface IntrusionAlertProps {
  isActive: boolean;
  timeRemaining: number;
  securityLevel: string;
  targetNode: string;
  onTimeExpired: () => void;
}

export const IntrusionAlert: React.FC<IntrusionAlertProps> = ({
  isActive,
  timeRemaining,
  securityLevel,
  targetNode,
  onTimeExpired
}) => {
  const [flashState, setFlashState] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const flashInterval = setInterval(() => {
      setFlashState(prev => !prev);
    }, 500);

    return () => clearInterval(flashInterval);
  }, [isActive]);

  useEffect(() => {
    if (isActive && timeRemaining <= 0) {
      onTimeExpired();
    }
  }, [isActive, timeRemaining, onTimeExpired]);

  if (!isActive) return null;

  const getAlertColor = () => {
    if (timeRemaining <= 10) return 'bg-red-500';
    if (timeRemaining <= 30) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${flashState ? 'bg-red-900/50' : 'bg-black/90'} transition-all duration-300`}>
      <div className="flex items-center justify-center p-4 border-b border-red-500">
        <div className="flex items-center gap-4 text-red-400">
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} className="animate-pulse" />
            <span className="font-bold text-lg">INTRUSION DETECTED</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <span className="text-sm">Target: {targetNode}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap size={20} />
            <span className="text-sm">Security: {securityLevel}</span>
          </div>
          
          <div className={`px-4 py-2 rounded font-mono text-xl font-bold ${getAlertColor()}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>
      
      {timeRemaining <= 10 && (
        <div className="bg-red-500/20 p-2 text-center">
          <span className="text-red-300 font-bold animate-pulse">
            CONNECTION WILL BE TERMINATED IN {timeRemaining} SECONDS!
          </span>
        </div>
      )}
    </div>
  );
};
