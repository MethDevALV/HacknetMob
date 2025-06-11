
import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../utils/i18n';
import { Globe, Check, Download } from 'lucide-react';

export const LanguageSettingsEnhanced: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    setIsChanging(true);
    
    // Simulate language loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    changeLanguage(languageCode);
    
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
        border-radius: 4px;
        backdrop-filter: blur(10px);
      ">
        ${t('settings.languageChanged')}<br>
        <small>${t('settings.changesApplied')}</small>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
    
    setIsChanging(false);
  };

  const getLanguageProgress = (langCode: string) => {
    // Simulate translation completeness
    const progress = {
      'es': 100,
      'en': 100,
      'fr': 95,
      'de': 90,
      'pt': 95,
      'it': 85
    };
    return progress[langCode as keyof typeof progress] || 0;
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-matrix-cyan font-bold mb-2">{t('settings.languageConfig')}</h3>
        <p className="text-sm text-matrix-green/70 mb-4">
          {t('settings.selectLanguage')}
        </p>

        {/* Current Language Display */}
        <div className="mb-4 p-3 border border-matrix-green/30 rounded bg-matrix-green/5">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-matrix-cyan" />
            <span className="text-sm font-medium">{t('settings.currentLanguage')}:</span>
            <span className="text-matrix-cyan font-bold">
              {availableLanguages.find(l => l.code === currentLanguage)?.flag}{' '}
              {availableLanguages.find(l => l.code === currentLanguage)?.nativeName}
            </span>
          </div>
          <div className="mt-2 text-xs text-matrix-green/70">
            {t('settings.translationComplete')}: {getLanguageProgress(currentLanguage)}%
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-matrix-green mb-3">{t('settings.availableLanguages')}:</h4>
          
          {availableLanguages.map(language => {
            const progress = getLanguageProgress(language.code);
            const isSelected = currentLanguage === language.code;
            
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isChanging}
                className={`w-full p-3 border rounded transition-all flex items-center justify-between group ${
                  isSelected
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
                
                <div className="flex items-center gap-3">
                  {/* Progress indicator */}
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1 bg-gray-800 border border-matrix-green/30 rounded overflow-hidden">
                      <div 
                        className="h-full bg-matrix-green transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-matrix-green/70 w-8">{progress}%</span>
                  </div>
                  
                  {isSelected && (
                    <Check size={16} className="text-matrix-cyan" />
                  )}
                  
                  {!isSelected && !isChanging && (
                    <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('common.select')}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isChanging && (
          <div className="mt-4 p-3 border border-yellow-500/30 rounded bg-yellow-500/5">
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="animate-spin">⟳</div>
              <span className="text-sm">{t('settings.applyingLanguageChange')}</span>
            </div>
          </div>
        )}

        {/* Language Features */}
        <div className="mt-6 p-3 border border-matrix-green/30 rounded">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Download size={14} />
            {t('settings.languageFeatures')}:
          </h4>
          <ul className="text-xs text-matrix-green/70 space-y-1">
            <li>• {t('settings.feature1')}</li>
            <li>• {t('settings.feature2')}</li>
            <li>• {t('settings.feature3')}</li>
            <li>• {t('settings.feature4')}</li>
            <li>• {t('settings.feature5')}</li>
          </ul>
        </div>

        {/* Translation Status */}
        <div className="mt-4 p-3 border border-matrix-cyan/30 rounded bg-matrix-cyan/5">
          <h4 className="text-sm font-medium mb-2 text-matrix-cyan">{t('settings.translationStatus')}:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {availableLanguages.map(lang => (
              <div key={lang.code} className="flex justify-between">
                <span className="text-matrix-green/70">{lang.flag} {lang.nativeName}:</span>
                <span className={`font-bold ${getLanguageProgress(lang.code) === 100 ? 'text-matrix-green' : 'text-yellow-400'}`}>
                  {getLanguageProgress(lang.code)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
