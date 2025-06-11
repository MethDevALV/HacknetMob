
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Book, X, CheckCircle, Terminal, Mouse, Keyboard } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  expectedResult?: string;
  tip?: string;
  interactive?: boolean;
  validationFn?: () => boolean;
}

interface TutorialSystemProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
  currentGameState?: any;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenido a HackNet',
    description: 'HackNet es un simulador de hacking realista. Aprenderás a usar comandos de terminal auténticos para navegar por redes, hackear sistemas y completar misiones.',
    tip: 'Este tutorial te enseñará todo lo que necesitas saber para convertirte en un hacker experto.'
  },
  {
    id: 'terminal_basics',
    title: 'Conceptos Básicos de Terminal',
    description: 'La terminal es tu herramienta principal. Aquí escribirás comandos para interactuar con sistemas. Cada comando tiene una sintaxis específica.',
    command: 'help',
    expectedResult: 'Lista de comandos disponibles',
    tip: 'Siempre puedes usar "help" para ver los comandos disponibles.'
  },
  {
    id: 'navigation',
    title: 'Navegación del Sistema',
    description: 'Usa "ls" para listar archivos y directorios, "cd" para cambiar de directorio.',
    command: 'ls',
    expectedResult: 'Lista de archivos en el directorio actual',
    interactive: true,
    tip: 'Prueba "ls -la" para ver archivos ocultos y permisos.'
  },
  {
    id: 'file_operations',
    title: 'Operaciones con Archivos',
    description: 'Puedes ver archivos con "cat", moverlos con "mv", y eliminarlos con "rm".',
    command: 'cat readme.txt',
    expectedResult: 'Contenido del archivo readme.txt',
    tip: 'Ten cuidado con "rm" - ¡no hay papelera de reciclaje en el terminal!'
  },
  {
    id: 'networking',
    title: 'Comandos de Red',
    description: 'Para hackear otros sistemas, usa "scan" para encontrar objetivos y "connect" para conectarte.',
    command: 'scan',
    expectedResult: 'Lista de dispositivos en la red',
    tip: 'Cada dispositivo tiene una dirección IP única que necesitarás para conectarte.'
  },
  {
    id: 'hacking_basics',
    title: 'Fundamentos de Hacking',
    description: 'Para hackear un sistema: 1) Escanea la red, 2) Sondea el objetivo, 3) Usa herramientas de hacking, 4) Conéctate.',
    command: 'probe 192.168.1.50',
    expectedResult: 'Información detallada del objetivo',
    tip: 'Diferentes sistemas requieren diferentes herramientas. ¡Estudia bien tu objetivo!'
  },
  {
    id: 'tools_introduction',
    title: 'Herramientas de Hacking',
    description: 'Las herramientas como SSHcrack.exe te permiten hackear puertos específicos. Cada herramienta consume RAM.',
    command: 'SSHcrack.exe 192.168.1.50',
    expectedResult: 'Intento de hackeo en puerto SSH',
    tip: 'Monitorea tu RAM - si se llena, no podrás ejecutar más herramientas.'
  },
  {
    id: 'defense_systems',
    title: 'Sistemas de Defensa',
    description: 'Los sistemas pueden rastrearte. Usa defensas como "firewall" y "proxy" para protegerte.',
    command: 'firewall',
    expectedResult: 'Activación del firewall',
    tip: 'Las defensas consumen recursos pero pueden salvarte de contraataques.'
  },
  {
    id: 'missions',
    title: 'Sistema de Misiones',
    description: 'Las misiones te guían a través de la historia y te dan objetivos específicos. Revisa tu correo regularmente.',
    tip: 'Completar misiones te da créditos, experiencia y acceso a nuevas herramientas.'
  },
  {
    id: 'advanced_tips',
    title: 'Consejos Avanzados',
    description: 'Usa "ps" para ver procesos activos, "kill" para terminarlos. Siempre mantén copias de seguridad de archivos importantes.',
    tip: 'El tiempo es crucial - algunos objetivos tienen defensas que se activan si tardas demasiado.'
  }
];

export const TutorialSystem: React.FC<TutorialSystemProps> = ({
  isVisible,
  onClose,
  onComplete,
  currentGameState
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const currentTutorialStep = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isStepCompleted = completedSteps.has(currentStep);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setCompletedSteps(new Set());
      setUserInput('');
      setShowHint(false);
    }
  }, [isVisible]);

  const handleNextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(currentStep + 1);
      setUserInput('');
      setShowHint(false);
    } else {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setUserInput('');
      setShowHint(false);
    }
  };

  const handleCommandInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      // Validate command if it's an interactive step
      if (currentTutorialStep.interactive && currentTutorialStep.command) {
        if (userInput.trim().toLowerCase() === currentTutorialStep.command.toLowerCase()) {
          setCompletedSteps(prev => new Set(prev).add(currentStep));
        }
      }
    }
  };

  const handleStepJump = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setUserInput('');
    setShowHint(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black border-2 border-matrix-green rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-matrix-green/30 bg-gradient-to-r from-matrix-green/10 to-matrix-cyan/10">
          <div className="flex items-center gap-3">
            <Book size={28} className="text-matrix-cyan" />
            <div>
              <h2 className="text-xl font-bold text-matrix-cyan">Tutorial Interactivo HackNet</h2>
              <p className="text-sm text-matrix-green/70">Aprende las mecánicas fundamentales del juego</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-matrix-green hover:bg-matrix-green/20"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="p-4 border-b border-matrix-green/20 bg-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-matrix-green">
              Paso {currentStep + 1} de {TUTORIAL_STEPS.length}
            </span>
            <span className="text-sm text-matrix-cyan">
              {Math.round(((completedSteps.size) / TUTORIAL_STEPS.length) * 100)}% Completado
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-matrix-green via-matrix-cyan to-blue-400 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step navigation */}
        <div className="p-4 border-b border-matrix-green/20 bg-black/10">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TUTORIAL_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepJump(index)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                  completedSteps.has(index)
                    ? 'bg-matrix-green border-matrix-green text-black shadow-lg'
                    : currentStep === index
                    ? 'border-matrix-cyan text-matrix-cyan bg-matrix-cyan/10'
                    : 'border-gray-600 text-gray-400 hover:border-matrix-green hover:text-matrix-green'
                }`}
              >
                {completedSteps.has(index) ? (
                  <CheckCircle size={14} />
                ) : (
                  `${index + 1}`
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Step title and description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-matrix-cyan flex items-center gap-3">
                {currentTutorialStep.title}
                {isStepCompleted && <CheckCircle size={24} className="text-matrix-green" />}
              </h3>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-matrix-green leading-relaxed text-lg">
                  {currentTutorialStep.description}
                </p>
              </div>
            </div>

            {/* Command demonstration */}
            {currentTutorialStep.command && (
              <div className="space-y-4">
                <div className="bg-black/70 border border-matrix-green/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal size={16} className="text-matrix-cyan" />
                    <h4 className="text-sm font-semibold text-matrix-cyan">Comando a ejecutar:</h4>
                  </div>
                  <div className="bg-black border border-matrix-green/50 rounded p-3 font-mono">
                    <span className="text-matrix-cyan">user@hacknet:~$ </span>
                    <span className="text-matrix-green">{currentTutorialStep.command}</span>
                  </div>
                  {currentTutorialStep.expectedResult && (
                    <div className="mt-3 text-sm text-matrix-green/70">
                      <strong>Resultado esperado:</strong> {currentTutorialStep.expectedResult}
                    </div>
                  )}
                </div>

                {/* Interactive input */}
                {currentTutorialStep.interactive && (
                  <div className="bg-gray-900/50 border border-matrix-cyan/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Keyboard size={16} className="text-matrix-cyan" />
                      <h4 className="text-sm font-semibold text-matrix-cyan">Pruébalo tú mismo:</h4>
                    </div>
                    <div className="flex items-center bg-black border border-matrix-green/50 rounded p-2">
                      <span className="text-matrix-cyan font-mono text-sm mr-2">user@hacknet:~$ </span>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleCommandInput}
                        className="flex-1 bg-transparent text-matrix-green font-mono text-sm outline-none"
                        placeholder="Escribe el comando aquí..."
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-matrix-green/60 mt-2">
                      Presiona Enter para ejecutar el comando
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tip section */}
            {currentTutorialStep.tip && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 mt-1">💡</div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Consejo:</h4>
                    <p className="text-blue-300 text-sm leading-relaxed">{currentTutorialStep.tip}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hint button */}
            {currentTutorialStep.command && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="outline"
                  size="sm"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                >
                  {showHint ? 'Ocultar Ayuda' : 'Mostrar Ayuda Extra'}
                </Button>
              </div>
            )}

            {/* Extended hint */}
            {showHint && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">Ayuda Detallada:</h4>
                <div className="text-yellow-300 text-sm space-y-2">
                  <p>• Asegúrate de escribir el comando exactamente como se muestra</p>
                  <p>• Los comandos son sensibles a mayúsculas y minúsculas</p>
                  <p>• Si algo no funciona, verifica que estés en el directorio correcto</p>
                  <p>• Usa "help" en cualquier momento para ver comandos disponibles</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between p-6 border-t border-matrix-green/30 bg-gradient-to-r from-black/50 to-gray-900/50">
          <Button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            variant="outline"
            className="border-matrix-green text-matrix-green hover:bg-matrix-green/20 disabled:opacity-50"
          >
            <ChevronLeft size={16} className="mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-matrix-green/70">
              Paso {currentStep + 1} de {TUTORIAL_STEPS.length}
            </span>
            {isStepCompleted && (
              <CheckCircle size={16} className="text-matrix-green" />
            )}
          </div>

          <Button
            onClick={handleNextStep}
            className="bg-gradient-to-r from-matrix-green to-matrix-cyan text-black hover:from-matrix-green/80 hover:to-matrix-cyan/80 font-medium"
          >
            {isLastStep ? (
              'Completar Tutorial'
            ) : (
              <>
                Siguiente
                <ChevronRight size={16} className="ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorialSystem;
