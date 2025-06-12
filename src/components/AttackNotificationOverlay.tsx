
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Timer, Zap } from 'lucide-react';
import { DefenseCommandInterface } from './DefenseCommandInterface';

interface AttackNotificationOverlayProps {
  attack: any;
  onDefenseActivated: () => void;
}

export const AttackNotificationOverlay: React.FC<AttackNotificationOverlayProps> = ({
  attack,
  onDefenseActivated
}) => {
  const [timeRemaining, setTimeRemaining] = useState(attack.timeToRespond || 30000);
  const [showDefenseInterface, setShowDefenseInterface] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          setIsVisible(false);
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const getAttackIcon = () => {
    switch (attack.type) {
      case 'reconnaissance': return <Shield className="text-yellow-500" size={24} />;
      case 'ddos': return <Zap className="text-red-500" size={24} />;
      case 'reverse_intrusion': return <AlertTriangle className="text-orange-500" size={24} />;
      case 'logic_bomb': return <AlertTriangle className="text-purple-500" size={24} />;
      case 'trace_attack': return <Timer className="text-red-600" size={24} />;
      default: return <AlertTriangle className="text-red-500" size={24} />;
    }
  };

  const getSeverityColor = () => {
    switch (attack.severity) {
      case 'low': return 'border-yellow-500 bg-yellow-500/10';
      case 'medium': return 'border-orange-500 bg-orange-500/10';
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'critical': return 'border-red-600 bg-red-600/20 animate-pulse';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getRecommendedDefenses = () => {
    const defenseDescriptions = {
      firewall: 'Cortafuegos - Bloquea reconocimiento',
      proxy: 'Proxy - Oculta tu ubicación',
      scramble: 'Ofuscar - Cifra tu tráfico',
      deflect: 'Deflector - Redirige DDoS',
      counterhack: 'Contraataque - Ataca al atacante',
      isolate: 'Aislar - Contiene el daño',
      restore: 'Restaurar - Repara herramientas',
      panic: 'PÁNICO - Desconexión total'
    };

    const defenseOptions = attack.defenseOptions || ['firewall', 'proxy'];
    return defenseOptions.map((defense: string) => 
      defenseDescriptions[defense as keyof typeof defenseDescriptions] || defense
    );
  };

  if (!isVisible) return null;

  // Ensure attack.effects exists with default values
  const effects = attack.effects || {};
  const initialTimeToRespond = attack.timeToRespond || 30000;

  return (
    <>
      {/* Attack Notification */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className={`
          border-2 rounded-lg p-6 backdrop-blur-sm max-w-md w-full mx-4
          ${getSeverityColor()}
        `}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            {getAttackIcon()}
            <div>
              <h2 className="text-red-400 font-bold text-lg">
                {attack.severity === 'critical' ? '🚨 ATAQUE CRÍTICO' : 
                 attack.severity === 'high' ? '⚠️ ATAQUE SEVERO' :
                 attack.severity === 'medium' ? '⚠️ ATAQUE DETECTADO' :
                 '🔍 ACTIVIDAD SOSPECHOSA'}
              </h2>
              <p className="text-red-300 text-sm">{attack.message || 'Actividad maliciosa detectada'}</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 font-semibold">Tiempo para responder:</span>
              <span className={`font-bold ${timeRemaining < 3000 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                {Math.ceil(timeRemaining / 1000)}s
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${
                  timeRemaining / initialTimeToRespond > 0.5 ? 'bg-green-500' :
                  timeRemaining / initialTimeToRespond > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(timeRemaining / initialTimeToRespond) * 100}%` }}
              />
            </div>
          </div>

          {/* Attack Effects */}
          <div className="mb-4 p-3 bg-black/50 rounded border border-gray-600">
            <h4 className="text-matrix-cyan font-semibold text-sm mb-2">Efectos del Ataque:</h4>
            <div className="text-xs text-matrix-green space-y-1">
              {effects.commandDelay && (
                <div>• Comandos {Math.round(effects.commandDelay * 100)}% más lentos</div>
              )}
              {effects.falseResults && (
                <div>• {Math.round(effects.falseResults * 100)}% resultados falsos</div>
              )}
              {effects.networkInterference && (
                <div>• Interferencia de red: {Math.round(effects.networkInterference * 100)}%</div>
              )}
              {effects.resourceDrain && (
                <div>• Drenaje de recursos: {Math.round(effects.resourceDrain * 100)}%</div>
              )}
              {effects.toolsLost && effects.toolsLost.length > 0 && (
                <div>• Riesgo de pérdida de herramientas</div>
              )}
              {effects.traceIncrease && (
                <div>• Aumento de rastreo: +{effects.traceIncrease}%</div>
              )}
              {!effects.commandDelay && !effects.falseResults && !effects.networkInterference && 
               !effects.resourceDrain && !effects.toolsLost && !effects.traceIncrease && (
                <div>• Efectos del ataque no especificados</div>
              )}
            </div>
          </div>

          {/* Recommended Defenses */}
          <div className="mb-4">
            <h4 className="text-green-400 font-semibold text-sm mb-2">Defensas Recomendadas:</h4>
            <div className="space-y-1">
              {getRecommendedDefenses().slice(0, 3).map((defense, index) => (
                <div key={index} className="text-xs text-green-300">
                  • {defense}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowDefenseInterface(true)}
              className="bg-green-500/20 text-green-400 border border-green-500 rounded p-2 hover:bg-green-500/30 transition-colors font-semibold"
            >
              🛡️ DEFENDERSE
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="bg-red-500/20 text-red-400 border border-red-500 rounded p-2 hover:bg-red-500/30 transition-colors"
            >
              Ignorar
            </button>
          </div>

          {/* Critical Warning */}
          {attack.severity === 'critical' && (
            <div className="mt-3 p-2 bg-red-600/20 border border-red-600 rounded text-center">
              <div className="text-red-300 text-xs font-bold animate-pulse">
                ⚠️ ATAQUE CRÍTICO - ACTÚA INMEDIATAMENTE ⚠️
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Defense Interface */}
      <DefenseCommandInterface
        isVisible={showDefenseInterface}
        onClose={() => {
          setShowDefenseInterface(false);
          onDefenseActivated();
        }}
        activeAttacks={[attack]}
      />
    </>
  );
};
