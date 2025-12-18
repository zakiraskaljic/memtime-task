import { dayjs } from "../utils/DayjsConfig";

type LocalStorageEntry<T> = {
  data: T;
  expiry: number;
};

export class LocalStorageCache {
  private defaultTTL: number;

  constructor(defaultTTL: number = 180_000) {
    this.defaultTTL = defaultTTL;
  }

  get<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    if (!item) return undefined;

    try {
      const entry: LocalStorageEntry<T> = JSON.parse(item);
      if (entry.expiry < dayjs().valueOf()) {
        localStorage.removeItem(key);
        return undefined;
      }
      return entry.data;
    } catch {
      localStorage.removeItem(key);
      return undefined;
    }
  }

  set<T>(key: string, data: T, ttl?: number) {
    const expiry = dayjs()
      .add(ttl ?? this.defaultTTL, "milliseconds")
      .valueOf();
    const entry: LocalStorageEntry<T> = { data, expiry };
    localStorage.setItem(key, JSON.stringify(entry));
  }

  clear(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }
}

export const cache = new LocalStorageCache(180_000);
