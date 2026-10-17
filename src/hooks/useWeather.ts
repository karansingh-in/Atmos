import { useEffect, useState, useCallback } from "react";
import { OpenMeteoProvider } from "@/services/weather/openmeteo";
import type { WeatherUnits, CurrentWeather, HourlyForecast, DailyForecast } from "@/types/weather";
import { cache } from "@/storage";
const TTL_CURRENT = 10 * 60 * 1000;
const TTL_FORECAST = 30 * 60 * 1000;
export function useWeather(lat: number | null, lon: number | null, units: WeatherUnits) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [freshness, setFreshness] = useState<"cached" | "fresh" | null>(null);
  const fetchForecast = useCallback(async (force = false) => {
    if (lat == null || lon == null) return;
    setError(null);
    if (!force) {
      const cur = await cache.get<CurrentWeather>(`weather:current:${lat.toFixed(4)}:${lon.toFixed(4)}`, TTL_CURRENT);
      const hr = await cache.get<HourlyForecast[]>(`weather:hourly:${lat.toFixed(4)}:${lon.toFixed(4)}`, TTL_FORECAST);
      const dy = await cache.get<DailyForecast[]>(`weather:daily:${lat.toFixed(4)}:${lon.toFixed(4)}`, TTL_FORECAST);
      if (cur || hr?.length || dy?.length) { if (cur) setCurrent(cur); if (hr) setHourly(hr); if (dy) setDaily(dy); setFreshness("cached"); }
    }
    try {
      const provider = new OpenMeteoProvider(units);
      const { current: c, hourly: h, daily: d } = await provider.getLocationForecast(lat, lon);
      setCurrent(c); setHourly(h); setDaily(d); setFreshness("fresh"); setLoading(false);
    } catch (e) {
      setLoading(false);
      setError({ code: "unknown", message: String(e) });
    }
  }, [lat, lon, units]);
  useEffect(() => { setLoading(true); fetchForecast(); }, [lat, lon, units, fetchForecast]);
  const refresh = useCallback(() => fetchForecast(true), [fetchForecast]);
  return { current, hourly, daily, loading, error, freshness, refresh };
}
export { OpenMeteoProvider as default } from "@/services/weather/openmeteo";
