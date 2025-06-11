import React, { useState, useEffect } from 'react';

interface AudioManagerProps {}

export const AudioManager: React.FC<AudioManagerProps> = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.value = volume / 100;
    
    setAudioContext(context);
    setGainNode(gain);

    // Expose audio functions globally
    (window as any).hacknetAudio = {
      playKeystroke: () => playSound('keystroke', 0.2),
      playNotification: () => playSound('notification', 0.5),
      playError: () => playSound('error', 0.4),
      playSuccess: () => playSound('success', 0.4),
      playHack: () => playSound('hack', 0.6),
    };

    return () => {
      context.close();
      delete (window as any).hacknetAudio;
    };
  }, []);

  useEffect(() => {
    if (gainNode) {
      gainNode.gain.value = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, gainNode]);

  const playSound = async (type: string, volumeMultiplier: number = 1) => {
    if (!audioContext || !gainNode || isMuted) return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const soundGain = audioContext.createGain();
      
      oscillator.connect(soundGain);
      soundGain.connect(gainNode);
      
      // Different sound types
      switch (type) {
        case 'keystroke':
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          soundGain.gain.setValueAtTime(0.05 * volumeMultiplier, audioContext.currentTime);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.02);
          break;
          
        case 'notification':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
          soundGain.gain.setValueAtTime(0.2 * volumeMultiplier, audioContext.currentTime);
          oscillator.start();
          oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.1);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
          
        case 'error':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
          soundGain.gain.setValueAtTime(0.2 * volumeMultiplier, audioContext.currentTime);
          oscillator.start();
          oscillator.frequency.setValueAtTime(110, audioContext.currentTime + 0.1);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'success':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          soundGain.gain.setValueAtTime(0.2 * volumeMultiplier, audioContext.currentTime);
          oscillator.start();
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'hack':
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
          soundGain.gain.setValueAtTime(0.3 * volumeMultiplier, audioContext.currentTime);
          oscillator.start();
          
          // Create a glitch effect
          for (let i = 0; i < 10; i++) {
            const time = audioContext.currentTime + (i * 0.05);
            oscillator.frequency.setValueAtTime(110 + (Math.random() * 220), time);
          }
          
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
      }
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {isEnabled && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black bg-opacity-80 border border-matrix-green p-2 rounded">
          <button
            onClick={toggleMute}
            className="text-matrix-green hover:text-matrix-cyan transition-colors"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </>
  );
};
