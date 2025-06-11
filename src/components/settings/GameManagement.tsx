
import React, { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { Save, Upload, Trash2, RotateCcw, HardDrive, AlertTriangle } from 'lucide-react';

export const GameManagement: React.FC = () => {
  const { gameState, updateGameState, resetGameState } = useGameState();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveGame = () => {
    const timestamp = new Date().toISOString();
    const saveData = {
      ...gameState,
      savedAt: timestamp,
      saveVersion: '1.0.0'
    };
    
    localStorage.setItem('hacknet-manual-save', JSON.stringify(saveData));
    
    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background: rgba(0, 255, 65, 0.2); 
        border: 1px solid #00FF41; 
        color: #00FF41; 
        padding: 1rem; 
        z-index: 9999; 
        font-family: monospace;
      ">
        Partida guardada exitosamente
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 2000);
  };

  const loadGame = () => {
    const savedData = localStorage.getItem('hacknet-manual-save');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        updateGameState(parsedData);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="
            position: fixed; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            background: rgba(0, 255, 65, 0.2); 
            border: 1px solid #00FF41; 
            color: #00FF41; 
            padding: 1rem; 
            z-index: 9999; 
            font-family: monospace;
          ">
            Partida cargada exitosamente
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 2000);
      } catch (error) {
        console.error('Error loading game:', error);
      }
    }
  };

  const handleReset = () => {
    resetGameState();
    setShowResetConfirm(false);
    
    // Show reset notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background: rgba(255, 165, 0, 0.2); 
        border: 1px solid #FFA500; 
        color: #FFA500; 
        padding: 1rem; 
        z-index: 9999; 
        font-family: monospace;
      ">
        Partida reiniciada
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 2000);
  };

  const deleteAllData = () => {
    localStorage.removeItem('hacknet-mobile-state');
    localStorage.removeItem('hacknet-manual-save');
    localStorage.removeItem('hacknet-audio-config');
    localStorage.removeItem('hacknet-language');
    resetGameState();
    setShowDeleteConfirm(false);
    
    // Show deletion notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background: rgba(255, 0, 0, 0.2); 
        border: 1px solid #FF0000; 
        color: #FF0000; 
        padding: 1rem; 
        z-index: 9999; 
        font-family: monospace;
      ">
        Todos los datos eliminados
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 2000);
  };

  const getSaveInfo = () => {
    const savedData = localStorage.getItem('hacknet-manual-save');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        return {
          exists: true,
          date: new Date(data.savedAt).toLocaleString(),
          credits: data.credits,
          missions: data.completedMissions?.length || 0
        };
      } catch {
        return { exists: false };
      }
    }
    return { exists: false };
  };

  const saveInfo = getSaveInfo();

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-matrix-cyan font-bold mb-2">GESTIÓN DE PARTIDA</h3>
        <p className="text-sm text-matrix-green/70 mb-4">
          Administra tu progreso, guarda tu partida y gestiona los datos del juego.
        </p>

        {/* Current Game Status */}
        <div className="mb-6 p-3 border border-matrix-green/30 rounded bg-matrix-green/5">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <HardDrive size={16} />
            ESTADO ACTUAL
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-matrix-green/70">Nodo:</span>
              <span className="text-matrix-cyan ml-2">{gameState.currentNode}</span>
            </div>
            <div>
              <span className="text-matrix-green/70">Créditos:</span>
              <span className="text-yellow-400 ml-2">${gameState.credits}</span>
            </div>
            <div>
              <span className="text-matrix-green/70">Experiencia:</span>
              <span className="text-matrix-cyan ml-2">{gameState.experience} XP</span>
            </div>
            <div>
              <span className="text-matrix-green/70">Misiones:</span>
              <span className="text-matrix-green ml-2">{gameState.completedMissions.length} completadas</span>
            </div>
          </div>
        </div>

        {/* Save/Load Section */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-medium text-matrix-green">GUARDAR Y CARGAR:</h4>
          
          <button
            onClick={saveGame}
            className="w-full p-3 border border-matrix-green text-matrix-green hover:bg-matrix-green/20 transition-all flex items-center gap-2 justify-center"
          >
            <Save size={16} />
            Guardar Partida Manual
          </button>

          {saveInfo.exists && (
            <div className="p-3 border border-matrix-cyan/30 rounded bg-matrix-cyan/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Partida Guardada Disponible:</span>
              </div>
              <div className="text-xs text-matrix-green/70 mb-2">
                Guardado: {saveInfo.date}<br/>
                Créditos: ${saveInfo.credits} | Misiones: {saveInfo.missions}
              </div>
              <button
                onClick={loadGame}
                className="w-full p-2 border border-matrix-cyan text-matrix-cyan hover:bg-matrix-cyan/20 transition-all flex items-center gap-2 justify-center"
              >
                <Upload size={16} />
                Cargar Partida
              </button>
            </div>
          )}
        </div>

        {/* Reset Section */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-medium text-matrix-green">REINICIO:</h4>
          
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full p-3 border border-orange-500 text-orange-500 hover:bg-orange-500/20 transition-all flex items-center gap-2 justify-center"
            >
              <RotateCcw size={16} />
              Reiniciar Partida
            </button>
          ) : (
            <div className="p-3 border border-orange-500/30 rounded bg-orange-500/5">
              <div className="flex items-center gap-2 mb-2 text-orange-400">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">¿Confirmar reinicio?</span>
              </div>
              <p className="text-xs text-orange-300/70 mb-3">
                Esto restaurará el juego al estado inicial. El progreso se perderá.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 p-2 border border-orange-500 text-orange-500 hover:bg-orange-500/20 transition-all"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 p-2 border border-matrix-green text-matrix-green hover:bg-matrix-green/20 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete All Data Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-red-400">ELIMINACIÓN COMPLETA:</h4>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-3 border border-red-500 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-2 justify-center"
            >
              <Trash2 size={16} />
              Eliminar Todos los Datos
            </button>
          ) : (
            <div className="p-3 border border-red-500/30 rounded bg-red-500/5">
              <div className="flex items-center gap-2 mb-2 text-red-400">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">¡PELIGRO!</span>
              </div>
              <p className="text-xs text-red-300/70 mb-3">
                Esto eliminará TODOS los datos incluyendo partidas guardadas, configuraciones y progreso. Esta acción NO se puede deshacer.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={deleteAllData}
                  className="flex-1 p-2 border border-red-500 text-red-500 hover:bg-red-500/20 transition-all"
                >
                  ELIMINAR TODO
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 p-2 border border-matrix-green text-matrix-green hover:bg-matrix-green/20 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="mt-6 p-3 border border-matrix-green/30 rounded">
          <h4 className="text-sm font-medium mb-2">INFORMACIÓN DE ALMACENAMIENTO:</h4>
          <ul className="text-xs text-matrix-green/70 space-y-1">
            <li>• El progreso se guarda automáticamente cada cambio</li>
            <li>• Las partidas manuales son independientes del guardado automático</li>
            <li>• Las configuraciones se almacenan por separado</li>
            <li>• Todos los datos se almacenan localmente en tu dispositivo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
