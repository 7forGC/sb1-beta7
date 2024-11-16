import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { useDeviceLocation } from './useDeviceLocation';

// Language mapping for countries
const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  US: 'en',
  GB: 'en',
  RS: 'sr',
  HR: 'sr',
  BA: 'sr',
  ME: 'sr',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  FR: 'fr',
  DE: 'de',
  AT: 'de',
  CH: 'de',
  IT: 'it',
  PT: 'pt',
  BR: 'pt',
  RU: 'ru',
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  JP: 'ja',
  KR: 'ko'
};

const LANGUAGE_CACHE_KEY = 'preferredLanguage';

export const useAutoLanguage = () => {
  const { i18n } = useTranslation();
  const { user, updateSettings } = useAuth();
  const { locationInfo, loading } = useDeviceLocation();

  useEffect(() => {
    const setLanguage = async () => {
      try {
        // Priority order:
        // 1. User's saved preference
        // 2. Cached language preference
        // 3. Location-based language
        // 4. Browser language
        // 5. Default (en)
        let detectedLanguage = 'en';

        if (user?.settings?.language) {
          detectedLanguage = user.settings.language;
        } else {
          const cachedLanguage = localStorage.getItem(LANGUAGE_CACHE_KEY);
          if (cachedLanguage) {
            detectedLanguage = cachedLanguage;
          } else if (!loading && locationInfo) {
            const countryCode = locationInfo.country.toUpperCase();
            if (COUNTRY_LANGUAGE_MAP[countryCode]) {
              detectedLanguage = COUNTRY_LANGUAGE_MAP[countryCode];
            } else {
              const browserLang = navigator.language.split('-')[0];
              if (Object.values(COUNTRY_LANGUAGE_MAP).includes(browserLang)) {
                detectedLanguage = browserLang;
              }
            }
          }
        }

        // Save detected language
        if (user && !user.settings?.language) {
          await updateSettings({ 
            language: detectedLanguage,
            timezone: locationInfo?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        } else {
          localStorage.setItem(LANGUAGE_CACHE_KEY, detectedLanguage);
        }

        // Update language if different
        if (i18n.language !== detectedLanguage) {
          await i18n.changeLanguage(detectedLanguage);
          document.documentElement.lang = detectedLanguage;
          
          // Update HTML dir attribute for RTL languages
          const isRTL = ['ar', 'he', 'fa'].includes(detectedLanguage);
          document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        }
      } catch (error) {
        console.warn('Language detection fallback:', error);
        // Fallback to English if something goes wrong
        if (i18n.language !== 'en') {
          await i18n.changeLanguage('en');
          document.documentElement.lang = 'en';
          document.documentElement.dir = 'ltr';
        }
      }
    };

    setLanguage();
  }, [i18n, user, locationInfo, loading, updateSettings]);

  return { 
    currentLanguage: i18n.language,
    locationInfo,
    loading
  };
};