/**
 * StorageProvider interface — swap LocalStorage for Firestore without touching UI.
 */

export interface StorageProvider<T> {
  get(id: string): T | null;
  list(): T[];
  save(item: T): void;
  delete(id: string): void;
  clear(): void;
}

const STORAGE_VERSION = 1;

/**
 * LocalStorage implementation of StorageProvider.
 */
export class LocalStorageProvider<T extends { id: string }> implements StorageProvider<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = `blindspot_v${STORAGE_VERSION}_${key}`;
  }

  private readAll(): T[] {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as T[];
    } catch {
      console.warn(`[Storage] Corrupt data in key "${this.key}" — resetting.`);
      localStorage.removeItem(this.key);
      return [];
    }
  }

  private writeAll(items: T[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (err) {
      console.error('[Storage] Failed to write:', err);
    }
  }

  get(id: string): T | null {
    return this.readAll().find((item) => item.id === id) ?? null;
  }

  list(): T[] {
    return this.readAll();
  }

  save(item: T): void {
    const items = this.readAll();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.unshift(item);
    }
    this.writeAll(items);
  }

  delete(id: string): void {
    const items = this.readAll().filter((i) => i.id !== id);
    this.writeAll(items);
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}

// Settings storage (single object)
export class LocalSettingsProvider<T> {
  private readonly key: string;
  private readonly defaults: T;

  constructor(key: string, defaults: T) {
    this.key = `blindspot_v${STORAGE_VERSION}_${key}`;
    this.defaults = defaults;
  }

  get(): T {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return { ...this.defaults };
      return { ...this.defaults, ...(JSON.parse(raw) as Partial<T>) };
    } catch {
      return { ...this.defaults };
    }
  }

  set(value: Partial<T>): void {
    try {
      const current = this.get();
      localStorage.setItem(this.key, JSON.stringify({ ...current, ...value }));
    } catch (err) {
      console.error('[Settings] Failed to save:', err);
    }
  }
}
