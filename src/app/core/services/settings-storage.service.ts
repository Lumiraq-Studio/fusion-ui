import { Injectable } from '@angular/core';

export interface AppSettings {
  isLocked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsStorageService {
  private dbName = 'ProductionTrackerDB';
  private storeName = 'settings';
  private version = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'key' });

          objectStore.add({
            key: 'appSettings',
            value: { isLocked: false } as AppSettings
          });
        }
      };
    });
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.put({
        key: 'appSettings',
        value: settings
      });

      request.onerror = () => {
        console.error('Error saving settings:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async loadSettings(): Promise<AppSettings> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve({ isLocked: false });
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.get('appSettings');

      request.onerror = () => {
        console.error('Error loading settings:', request.error);
        resolve({ isLocked: false });
      };

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.value as AppSettings);
        } else {
          resolve({ isLocked: false });
        }
      };
    });
  }

  async clearSettings(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.clear();

      request.onerror = () => {
        console.error('Error clearing settings:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }
}
