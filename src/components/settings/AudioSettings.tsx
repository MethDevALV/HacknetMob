
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface AudioConfig {
  masterVolume: number;
  effectsVolume: number;
  musicVolume: number;
  notificationsVolume: number;
  muted: boolean;
}

export const AudioSettings: React.FC = () => {
  const [audioConfig, setAudioConfig] = useState<AudioConfig>({
    masterVolume: 70,
    effectsVolume: 80,
    musicVolume: 50,
    notificationsVolume: 90,
    muted: false
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('hacknet-audio-config');
    if (savedConfig) {
      try {
        setAudioConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading audio config:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hacknet-audio-config', JSON.stringify(audioConfig));
    
    // Apply audio settings globally
    if ((window as any).hacknetAudio) {
      (window as any).hacknetAudio.updateVolume(audioConfig);
    }
  }, [audioConfig]);

  const updateVolume = (key: keyof AudioConfig, value: number) => {
    setAudioConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleMute = () => {
    setAudioConfig(prev => ({ ...prev, muted: !prev.muted }));
  };

  const VolumeSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon?: React.ReactNode;
  }> = ({ label, value, onChange, icon }) => {
    const getVolumeIcon = () => {
      if (audioConfig.muted || value === 0) return <VolumeX size={16} />;
      if (value < 50) return <Volume1 size={16} />;
      return <Volume2 size={16} />;
    };

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon || getVolumeIcon()}
            <span className="text-sm font-medium">{label}</span>
          </div>
          <span className="text-sm text-matrix-cyan">{value}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
            disabled={audioConfig.muted}
          />
          <div 
            className="absolute top-0 left-0 h-2 bg-matrix-green rounded-lg pointer-events-none transition-all"
            style={{ width: `${audioConfig.muted ? 0 : value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-matrix-cyan font-bold mb-2">CONTROL DE AUDIO</h3>
        <p className="text-sm text-matrix-green/70 mb-4">
          Ajusta los niveles de volumen para diferentes tipos de sonido en el sistema.
        </p>

        {/* Master Mute Toggle */}
        <div className="mb-4 p-3 border border-matrix-green/30 rounded">
          <button
            onClick={toggleMute}
            className={`flex items-center gap-2 w-full p-2 rounded transition-all ${
              audioConfig.muted 
                ? 'bg-red-500/20 border border-red-500 text-red-400' 
                : 'bg-matrix-green/10 border border-matrix-green text-matrix-green'
            }`}
          >
            {audioConfig.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            <span className="font-medium">
              {audioConfig.muted ? 'AUDIO SILENCIADO' : 'AUDIO ACTIVO'}
            </span>
          </button>
        </div>

        {/* Volume Controls */}
        <VolumeSlider
          label="Volumen General"
          value={audioConfig.masterVolume}
          onChange={(value) => updateVolume('masterVolume', value)}
        />

        <VolumeSlider
          label="Efectos de Sonido"
          value={audioConfig.effectsVolume}
          onChange={(value) => updateVolume('effectsVolume', value)}
        />

        <VolumeSlider
          label="Música de Fondo"
          value={audioConfig.musicVolume}
          onChange={(value) => updateVolume('musicVolume', value)}
        />

        <VolumeSlider
          label="Notificaciones"
          value={audioConfig.notificationsVolume}
          onChange={(value) => updateVolume('notificationsVolume', value)}
        />

        {/* Audio Test */}
        <div className="mt-6 p-3 border border-matrix-green/30 rounded">
          <h4 className="text-sm font-medium mb-2">PRUEBA DE AUDIO</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 text-xs border border-matrix-green text-matrix-green hover:bg-matrix-green/20 transition-all">
              Probar Efectos
            </button>
            <button className="p-2 text-xs border border-matrix-green text-matrix-green hover:bg-matrix-green/20 transition-all">
              Probar Notificación
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00FF41;
          cursor: pointer;
          border: 2px solid #000;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00FF41;
          cursor: pointer;
          border: 2px solid #000;
        }

        .slider:disabled::-webkit-slider-thumb {
          background: #666;
        }

        .slider:disabled::-moz-range-thumb {
          background: #666;
        }
      `}</style>
    </div>
  );
};
