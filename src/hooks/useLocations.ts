import { useCallback, useState, useEffect } from "react";
import { storage } from "@/storage";
import type { WeatherLocation } from "@/types/weather";
const KEY = "locations";
export function useLocations() {
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  useEffect(() => { storage.get<WeatherLocation[]>(KEY).then((l) => { if (l) setLocations(l); }); }, []);
  const save = useCallback((loc: WeatherLocation) => {
    setLocations((prev) => { if (prev.some((l) => l.id === loc.id)) return prev; const next = [...prev, { ...loc, isSaved: true }]; storage.set(KEY, next); return next; });
  }, []);
  const remove = useCallback((id: string) => {
    setLocations((prev) => { const next = prev.filter((l) => l.id !== id); storage.set(KEY, next); return next; });
  }, []);
  const reorder = useCallback((from: number, to: number) => {
    setLocations((prev) => { const next = [...prev]; const [r] = next.splice(from, 1); next.splice(to, 0, r); storage.set(KEY, next); return next; });
  }, []);
  const setDefault = useCallback((id: string) => {
    setLocations((prev) => { const next = prev.map((l) => ({ ...l, isDefault: l.id === id })); storage.set(KEY, next); return next; });
  }, []);
  const defaultLocation = locations.find((l) => l.isDefault) ?? locations[0] ?? null;
  return { locations, save, remove, reorder, setDefault, defaultLocation };
}
