import { useState, useEffect } from 'react';

interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const useMobileDetect = (): MobileInfo => {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    deviceType: 'desktop'
  });

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isMobile = isIOS || isAndroid || /mobile/.test(ua);
    const isTablet = /ipad/.test(ua) || (/android/.test(ua) && !/mobile/.test(ua));
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (isTablet) deviceType = 'tablet';
    else if (isMobile) deviceType = 'mobile';

    setMobileInfo({
      isMobile,
      isTablet,
      isIOS,
      isAndroid,
      isStandalone,
      deviceType
    });
  }, []);

  return mobileInfo;
};