import { useState, useEffect } from 'react';

interface LocationInfo {
  country: string;
  city?: string;
  region?: string;
  language: string;
  timezone: string;
}

const LOCATION_CACHE_KEY = 'locationInfo';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useDeviceLocation = () => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(() => {
    // Try to get cached location on init
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
      localStorage.removeItem(LOCATION_CACHE_KEY);
    }
    return null;
  });
  const [loading, setLoading] = useState(!locationInfo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      // Skip if we already have cached location
      if (locationInfo) return;

      try {
        // First try IP-based location as it's faster and doesn't require permission
        const ipResponse = await Promise.race([
          fetch('https://ipapi.co/json/'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('IP lookup timeout')), 3000)
          )
        ]);

        if (ipResponse instanceof Response && ipResponse.ok) {
          const data = await ipResponse.json();
          const info = {
            country: data.country_code,
            city: data.city,
            region: data.region,
            language: data.languages.split(',')[0],
            timezone: data.timezone
          };
          setLocationInfo(info);
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
            data: info,
            timestamp: Date.now()
          }));
          setLoading(false);
          return;
        }

        // Fallback to geolocation if IP lookup fails
        if ('geolocation' in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false, // Use low accuracy for faster response
              timeout: 3000,
              maximumAge: CACHE_DURATION
            });
          });

          const geoResponse = await Promise.race([
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            ),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Geocoding timeout')), 3000)
            )
          ]);

          if (geoResponse instanceof Response && geoResponse.ok) {
            const data = await geoResponse.json();
            const info = {
              country: data.countryCode,
              city: data.city,
              region: data.principalSubdivision,
              language: navigator.language.split('-')[0],
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            setLocationInfo(info);
            localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
              data: info,
              timestamp: Date.now()
            }));
            setLoading(false);
            return;
          }
        }

        // Final fallback to browser info
        const fallbackInfo = {
          country: navigator.language.split('-')[1] || 'US',
          language: navigator.language.split('-')[0],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        setLocationInfo(fallbackInfo);
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
          data: fallbackInfo,
          timestamp: Date.now()
        }));

      } catch (err) {
        console.warn('Location detection fallback:', err);
        // Use browser info as final fallback
        const fallbackInfo = {
          country: navigator.language.split('-')[1] || 'US',
          language: navigator.language.split('-')[0],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        setLocationInfo(fallbackInfo);
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
          data: fallbackInfo,
          timestamp: Date.now()
        }));
        setError('Using approximate location');
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, [locationInfo]);

  return { locationInfo, loading, error };
};