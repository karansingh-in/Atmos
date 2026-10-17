import { useCallback, useState, useEffect } from "react";
import { storage } from "@/storage";
import type { WeatherUnits } from "@/types/weather";
import { DEFAULT_UNITS } from "@/types/weather";

const KEY = "units";
export function useUnits() {
  const [units, setUnitsState] = useState<WeatherUnits>(DEFAULT_UNITS);
  useEffect(() => { storage.get<WeatherUnits>(KEY).then((u) => { if (u) setUnitsState(u); }); }, []);
  const setTemperatureUnit = useCallback((u: WeatherUnits["temperature"]) => {
    setUnitsState((prev) => ({ ...prev, temperature: u }));
    storage.set(KEY, { ...units, temperature: u });
  }, [units]);
  return { units, setTemperatureUnit };
}
