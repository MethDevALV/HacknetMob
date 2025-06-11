
import React, { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const availableLanguages: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

export const LanguageSettings: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('hacknet-language') || 'es';
    setCurrentLanguage(savedLanguage);
  }, []);

  const changeLanguage = async (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    setIsChanging(true);
    
    // Simulate language loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentLanguage(languageCode);
    localStorage.setItem('hacknet-language', languageCode);
    
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
        text-align: center;
      ">
        Idioma cambiado a ${availableLanguages.find(l => l.code === languageCode)?.nativeName}<br>
        <small>Los cambios se aplicarán en la próxima sesión</small>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
    
    setIsChanging(false);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-matrix-cyan font-bold mb-2">CONFIGURACIÓN DE IDIOMA</h3>
        <p className="text-sm text-matrix-green/70 mb-4">
          Selecciona tu idioma preferido para la interfaz del sistema.
        </p>

        {/* Current Language Display */}
        <div className="mb-4 p-3 border border-matrix-green/30 rounded bg-matrix-green/5">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-matrix-cyan" />
            <span className="text-sm font-medium">Idioma Actual:</span>
            <span className="text-matrix-cyan font-bold">
              {availableLanguages.find(l => l.code === currentLanguage)?.flag}{' '}
              {availableLanguages.find(l => l.code === currentLanguage)?.nativeName}
            </span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-matrix-green mb-3">IDIOMAS DISPONIBLES:</h4>
          
          {availableLanguages.map(language => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              disabled={isChanging}
              className={`w-full p-3 border rounded transition-all flex items-center justify-between group ${
                currentLanguage === language.code
                  ? 'border-matrix-cyan bg-matrix-cyan/10 text-matrix-cyan'
                  : 'border-matrix-green/30 hover:border-matrix-green hover:bg-matrix-green/10 text-matrix-green'
              } ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-sm opacity-70">{language.name}</div>
                </div>
              </div>
              
              {currentLanguage === language.code && (
                <Check size={16} className="text-matrix-cyan" />
              )}
              
              {currentLanguage !== language.code && !isChanging && (
                <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Seleccionar
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isChanging && (
          <div className="mt-4 p-3 border border-yellow-500/30 rounded bg-yellow-500/5">
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="animate-spin">⟳</div>
              <span className="text-sm">Aplicando cambio de idioma...</span>
            </div>
          </div>
        )}

        {/* Language Info */}
        <div className="mt-6 p-3 border border-matrix-green/30 rounded">
          <h4 className="text-sm font-medium mb-2">INFORMACIÓN:</h4>
          <ul className="text-xs text-matrix-green/70 space-y-1">
            <li>• Los cambios se aplican inmediatamente en los menús</li>
            <li>• Los comandos de terminal soportan aliases en todos los idiomas</li>
            <li>• El contenido de las misiones se traduce automáticamente</li>
            <li>• La configuración se guarda permanentemente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
