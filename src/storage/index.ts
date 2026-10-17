import AsyncStorage from "@react-native-async-storage/async-storage";

const P = "atmos:";
export const storage = {
  async get<T>(k: string): Promise<T | null> {
    const r = await AsyncStorage.getItem(P + k);
    if (!r) return null;
    try { return JSON.parse(r) as T; } catch { return null; }
  },
  async set<T>(k: string, v: T) { await AsyncStorage.setItem(P + k, JSON.stringify(v)); },
  async remove(k: string) { await AsyncStorage.removeItem(P + k); },
};
export const cache = {
  async get<T>(k: string, ttl: number): Promise<T | null> {
    const e = await storage.get<{ d: T; t: number }>(k);
    if (!e || Date.now() - e.t > ttl) return null;
    return e.d;
  },
  async set<T>(k: string, v: T) { await storage.set(k, { d: v, t: Date.now() }); },
};
