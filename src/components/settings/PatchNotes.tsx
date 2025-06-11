
import React, { useState } from 'react';
import { FileText, Calendar, Bug, Plus, Wrench, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface PatchNote {
  version: string;
  date: string;
  changes: {
    fixes: string[];
    features: string[];
    improvements: string[];
    breaking: string[];
  };
}

const patchNotes: PatchNote[] = [
  {
    version: '1.2.0',
    date: '2024-06-10',
    changes: {
      fixes: [
        'Corregido el comando "clear" que no funcionaba correctamente',
        'Eliminado control de volumen flotante que obstruía la navegación',
        'Solucionada explotación económica en el sistema de misiones',
        'Reparada la funcionalidad de gestos táctiles en terminal'
      ],
      features: [
        'Añadido sistema completo de configuración',
        'Implementado soporte multi-idioma (ES/EN)',
        'Sistema de gestión de partidas con guardado manual',
        'Autocompletado inteligente con gestos táctiles',
        'Sistema automático de patch notes'
      ],
      improvements: [
        'Diseño completamente responsivo para dispositivos móviles',
        'Optimización de la interfaz táctil',
        'Mejor gestión del estado de misiones',
        'Navegación mejorada en pestañas principales',
        'Sistema de persistencia de datos optimizado'
      ],
      breaking: [
        'Misiones ya no pueden ser explotadas para créditos infinitos',
        'Eliminado acceso directo al control de volumen (ahora en ajustes)'
      ]
    }
  },
  {
    version: '1.1.0',
    date: '2024-06-05',
    changes: {
      fixes: [
        'Corregidos problemas de visualización en dispositivos pequeños',
        'Solucionados errores de conexión entre nodos',
        'Reparado el sistema de trace level'
      ],
      features: [
        'Sistema básico de misiones implementado',
        'Mapa de red interactivo',
        'Panel de herramientas de hacking',
        'Sistema de recursos y RAM'
      ],
      improvements: [
        'Mejor feedback visual en comandos',
        'Optimización de rendimiento general',
        'Interfaz de terminal mejorada'
      ],
      breaking: []
    }
  },
  {
    version: '1.0.0',
    date: '2024-06-01',
    changes: {
      fixes: [],
      features: [
        'Lanzamiento inicial de HackNet Mobile',
        'Terminal interactivo con comandos básicos',
        'Sistema de navegación por pestañas',
        'Comandos de hacking básicos (scan, probe, connect)',
        'Interfaz temática cyberpunk'
      ],
      improvements: [],
      breaking: []
    }
  }
];

export const PatchNotes: React.FC = () => {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['1.2.0']));

  const toggleVersion = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'fixes': return <Bug size={14} className="text-red-400" />;
      case 'features': return <Plus size={14} className="text-matrix-green" />;
      case 'improvements': return <Wrench size={14} className="text-yellow-400" />;
      case 'breaking': return <AlertCircle size={14} className="text-orange-500" />;
      default: return null;
    }
  };

  const getChangeLabel = (type: string) => {
    switch (type) {
      case 'fixes': return 'CORRECCIONES';
      case 'features': return 'NUEVAS CARACTERÍSTICAS';
      case 'improvements': return 'MEJORAS';
      case 'breaking': return 'CAMBIOS IMPORTANTES';
      default: return type.toUpperCase();
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-matrix-cyan font-bold mb-2">HISTORIAL DE ACTUALIZACIONES</h3>
        <p className="text-sm text-matrix-green/70 mb-4">
          Registro completo de cambios, mejoras y correcciones implementadas en el sistema.
        </p>

        {/* Current Version Info */}
        <div className="mb-6 p-3 border border-matrix-cyan/30 rounded bg-matrix-cyan/5">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-matrix-cyan" />
            <span className="text-sm font-medium">Versión Actual:</span>
            <span className="text-matrix-cyan font-bold">v{patchNotes[0].version}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-matrix-green/70">
            <Calendar size={12} />
            <span>Actualizado: {new Date(patchNotes[0].date).toLocaleDateString('es-ES')}</span>
          </div>
        </div>

        {/* Patch Notes List */}
        <div className="space-y-4">
          {patchNotes.map((patch) => {
            const isExpanded = expandedVersions.has(patch.version);
            const totalChanges = 
              patch.changes.fixes.length + 
              patch.changes.features.length + 
              patch.changes.improvements.length + 
              patch.changes.breaking.length;

            return (
              <div key={patch.version} className="border border-matrix-green/30 rounded">
                {/* Version Header */}
                <button
                  onClick={() => toggleVersion(patch.version)}
                  className="w-full p-3 flex items-center justify-between hover:bg-matrix-green/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <div className="text-left">
                      <div className="font-bold text-matrix-cyan">v{patch.version}</div>
                      <div className="text-xs text-matrix-green/70">
                        {new Date(patch.date).toLocaleDateString('es-ES')} • {totalChanges} cambios
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {patch.changes.fixes.length > 0 && (
                      <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                        {patch.changes.fixes.length} fix
                      </span>
                    )}
                    {patch.changes.features.length > 0 && (
                      <span className="px-2 py-1 text-xs bg-matrix-green/20 text-matrix-green rounded">
                        {patch.changes.features.length} new
                      </span>
                    )}
                    {patch.changes.improvements.length > 0 && (
                      <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                        {patch.changes.improvements.length} imp
                      </span>
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-matrix-green/30 p-3 bg-black/30">
                    {Object.entries(patch.changes).map(([type, changes]) => {
                      if (changes.length === 0) return null;
                      
                      return (
                        <div key={type} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getChangeIcon(type)}
                            <h4 className="text-sm font-medium">{getChangeLabel(type)}</h4>
                          </div>
                          <ul className="space-y-1 ml-4">
                            {changes.map((change, index) => (
                              <li key={index} className="text-sm text-matrix-green/80 flex items-start gap-2">
                                <span className="text-matrix-green/50 mt-1">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Auto-Update Info */}
        <div className="mt-6 p-3 border border-matrix-green/30 rounded">
          <h4 className="text-sm font-medium mb-2">ACTUALIZACIÓN AUTOMÁTICA:</h4>
          <ul className="text-xs text-matrix-green/70 space-y-1">
            <li>• Los patch notes se generan automáticamente con cada actualización</li>
            <li>• El historial se mantiene permanentemente en tu dispositivo</li>
            <li>• Los cambios se categorizan automáticamente por tipo</li>
            <li>• Las versiones siguen el estándar semántico (mayor.menor.parche)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
