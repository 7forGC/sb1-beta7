import React, { useState } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useDeviceLocation } from '../hooks/useDeviceLocation';

interface LanguageSelectorProps {
  white?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ white = false }) => {
  const { user, updateSettings } = useAuth();
  const { t, i18n } = useTranslation();
  const { locationInfo } = useDeviceLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const LANGUAGES = [
    { code: 'en', name: 'English', flag: 'gb', nativeName: 'English' },
    { code: 'sr', name: 'Serbian', flag: 'rs', nativeName: 'Српски' },
    { code: 'es', name: 'Spanish', flag: 'es', nativeName: 'Español' },
    { code: 'fr', name: 'French', flag: 'fr', nativeName: 'Français' },
    { code: 'de', name: 'German', flag: 'de', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', flag: 'it', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', flag: 'pt', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', flag: 'ru', nativeName: 'Русский' },
    { code: 'zh', name: 'Chinese', flag: 'cn', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', flag: 'jp', nativeName: '日本語' }
  ];

  const handleLanguageChange = async (languageCode: string) => {
    try {
      if (user) {
        await updateSettings({ language: languageCode });
      } else {
        localStorage.setItem('preferredLanguage', languageCode);
      }
      await i18n.changeLanguage(languageCode);
      
      const isRTL = ['ar', 'he', 'fa'].includes(languageCode);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      
      setShowDropdown(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  };

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentLanguage = LANGUAGES.find(lang => 
    lang.code === (user?.settings?.language || localStorage.getItem('preferredLanguage') || 'en')
  ) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          white 
            ? 'text-white hover:bg-white/20' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <img
          src={`https://flagcdn.com/24x18/${currentLanguage.flag}.png`}
          alt={currentLanguage.name}
          className="w-6"
        />
        <Globe className={`w-5 h-5 ${white ? 'text-white' : 'text-gray-600'}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {locationInfo && (
            <div className="p-3 bg-gray-50 border-b">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>
                  {locationInfo.city && `${locationInfo.city}, `}
                  {locationInfo.country}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder={t('common.searchLanguages')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredLanguages.map(({ code, name, flag, nativeName }) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center space-x-3
                  ${code === currentLanguage.code ? 'bg-gray-50' : ''}
                `}
              >
                <img
                  src={`https://flagcdn.com/24x18/${flag}.png`}
                  alt={name}
                  className="w-6"
                />
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-gray-500">{nativeName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};