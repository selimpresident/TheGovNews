import { Capacitor } from '@capacitor/core';

interface SecureStorageOptions {
  key: string;
  value: string;
}

class SecureStorage {
  private isNative: boolean;
  
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }
  
  async setItem({ key, value }: SecureStorageOptions): Promise<void> {
    if (this.isNative) {
      if (Capacitor.getPlatform() === 'ios') {
        // Use iOS Keychain
        await this.setItemIOS(key, value);
      } else if (Capacitor.getPlatform() === 'android') {
        // Use Android EncryptedSharedPreferences
        await this.setItemAndroid(key, value);
      }
    } else {
      // For web, use localStorage with encryption
      this.setItemWeb(key, value);
    }
  }
  
  async getItem(key: string): Promise<string | null> {
    if (this.isNative) {
      if (Capacitor.getPlatform() === 'ios') {
        // Use iOS Keychain
        return await this.getItemIOS(key);
      } else if (Capacitor.getPlatform() === 'android') {
        // Use Android EncryptedSharedPreferences
        return await this.getItemAndroid(key);
      }
    } else {
      // For web, use localStorage with decryption
      return this.getItemWeb(key);
    }
    
    return null;
  }
  
  async removeItem(key: string): Promise<void> {
    if (this.isNative) {
      if (Capacitor.getPlatform() === 'ios') {
        // Use iOS Keychain
        await this.removeItemIOS(key);
      } else if (Capacitor.getPlatform() === 'android') {
        // Use Android EncryptedSharedPreferences
        await this.removeItemAndroid(key);
      }
    } else {
      // For web, use localStorage
      localStorage.removeItem(key);
    }
  }
  
  // Platform-specific implementations
  private async setItemIOS(key: string, value: string): Promise<void> {
    // Implementation using Capacitor plugins for iOS Keychain
    // This would use a plugin like @capacitor-community/secure-storage
  }
  
  private async getItemIOS(key: string): Promise<string | null> {
    // Implementation using Capacitor plugins for iOS Keychain
    return null;
  }
  
  private async removeItemIOS(key: string): Promise<void> {
    // Implementation using Capacitor plugins for iOS Keychain
  }
  
  private async setItemAndroid(key: string, value: string): Promise<void> {
    // Implementation using Capacitor plugins for Android EncryptedSharedPreferences
  }
  
  private async getItemAndroid(key: string): Promise<string | null> {
    // Implementation using Capacitor plugins for Android EncryptedSharedPreferences
    return null;
  }
  
  private async removeItemAndroid(key: string): Promise<void> {
    // Implementation using Capacitor plugins for Android EncryptedSharedPreferences
  }
  
  private setItemWeb(key: string, value: string): void {
    // Simple encryption for web storage (not truly secure, just obfuscation)
    const encryptedValue = btoa(value); // Base64 encoding
    localStorage.setItem(key, encryptedValue);
  }
  
  private getItemWeb(key: string): string | null {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;
    
    try {
      // Decrypt (decode from Base64)
      return atob(encryptedValue);
    } catch (e) {
      console.error('Error decrypting value:', e);
      return null;
    }
  }
}

export const secureStorage = new SecureStorage();