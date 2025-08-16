import { App } from '@capacitor/app';

export const setupAndroidBackButton = (customHandler?: () => boolean) => {
  // Only run on Android
  if (!/android/i.test(navigator.userAgent)) return;

  App.addListener('backButton', ({ canGoBack }) => {
    // If custom handler returns true, exit early
    if (customHandler && customHandler()) {
      return;
    }
    
    // Default behavior
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
};

export const isAndroid = () => /android/i.test(navigator.userAgent);
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
export const isNative = () => isAndroid() || isIOS();