import { WeatherProviderError, type WeatherProvider, type CurrentWeather, type HourlyForecast, type DailyForecast, type WeatherLocation, type WeatherUnits } from "@/types/weather";
import { conditionForCode } from "@/theme/tokens";
import { cache } from "@/storage";

const BASE = "https://api.open-meteo.com/v1/forecast";
const GEO = "https://geocoding-api.open-meteo.com/v1/search";
const CF = "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,uv_index,visibility";
const HF = "temperature_2m,precipitation_probability,weather_code";
const DF = "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max";

export function cToF(c: number) { return (c * 9) / 5 + 32; }
export function fToC(f: number) { return (f - 32) * 5 / 9; }
export function kmhToMs(k: number) { return k / 3.6; }
export function kmhToMph(k: number) { return k * 0.621371; }
export function mmToIn(m: number) { return m / 25.4; }

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  return Promise.race([p, new Promise<never>((_, r) => { t = setTimeout(() => r(new WeatherProviderError("network", "timeout")), ms); })]).then((v) => { clearTimeout(t); return v; });
}

async function fetchJson(url: string): Promise<any> {
  let last: unknown;
  for (let i = 0; i <= 2; i++) {
    try {
      const r = await withTimeout(fetch(url), 15000);
      if (!r.ok) throw new WeatherProviderError(r.status === 404 ? "not-found" : "network", `HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      last = e;
      if (e instanceof WeatherProviderError && e.code !== "network") throw e;
      if (i === 2) throw last;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw last;
}

function normLocation(name: string, lat: number, lon: number, country?: string, region?: string): WeatherLocation {
  return { id: `${lat.toFixed(4)}:${lon.toFixed(4)}`, name, region, country: country ?? "", lat, lon, isSaved: false, isDefault: false };
}

export class OpenMeteoProvider implements WeatherProvider {
  constructor(private units: WeatherUnits) {}
  async getLocationForecast(lat: number, lon: number) {
    const fk = `fc:${lat.toFixed(4)}:${lon.toFixed(4)}`;
    let raw = await cache.get<any>(fk, 30 * 60 * 1000);
    if (!raw) { raw = await fetchJson(`${BASE}?latitude=${lat}&longitude=${lon}&current=${CF}&hourly=${HF}&daily=${DF}&timezone=auto`); await cache.set(fk, raw); }
    const c = raw.current ?? {};
    const loc = normLocation(raw.location?.name ?? "Unknown", lat, lon, raw.location?.country, raw.location?.admin1);
    const current: CurrentWeather = {
      location: loc, temperature: Math.round((this.units.temperature === "fahrenheit" ? cToF(c.temperature_2m ?? 0) : (c.temperature_2m ?? 0)) * 10) / 10,
      feelsLike: Math.round((this.units.temperature === "fahrenheit" ? cToF(c.apparent_temperature ?? 0) : (c.apparent_temperature ?? 0)) * 10) / 10,
      high: 0, low: 0, conditionCode: c.weather_code ?? 3, conditionLabel: conditionForCode(c.weather_code ?? 3).label,
      isDay: c.is_day ?? 1, humidity: c.relative_humidity_2m ?? 0,
      windSpeed: this.units.wind === "ms" ? kmhToMs(c.wind_speed_10m ?? 0) : this.units.wind === "mph" ? kmhToMph(c.wind_speed_10m ?? 0) : (c.wind_speed_10m ?? 0),
      windDirection: c.wind_direction_10m ?? 0, pressure: c.pressure_msl ?? 0, visibility: c.visibility ?? 0, uvIndex: c.uv_index ?? 0,
      precipitation: this.units.precipitation === "in" ? mmToIn(c.precipitation ?? 0) : (c.precipitation ?? 0), precipProbability: 0,
      sunrise: new Date(), sunset: new Date(), updatedAt: new Date(),
    };
    const hourly = this.normHourly(raw.hourly ?? {}, raw);
    const daily = this.normDaily(raw.daily ?? {}, raw);
    const today = daily[0];
    if (today) { current.high = today.max; current.low = today.min; }
    if (raw.daily?.sunrise?.[0]) current.sunrise = new Date(raw.daily.sunrise[0]);
    if (raw.daily?.sunset?.[0]) current.sunset = new Date(raw.daily.sunset[0]);
    if (raw.hourly?.precipitation_probability?.[0] !== undefined) current.precipProbability = raw.hourly.precipitation_probability[0];
    return { current, hourly, daily };
  }
  async getCurrentWeather(lat: number, lon: number) { return (await this.getLocationForecast(lat, lon)).current; }
  async getHourlyForecast(lat: number, lon: number) { return (await this.getLocationForecast(lat, lon)).hourly; }
  async getDailyForecast(lat: number, lon: number) { return (await this.getLocationForecast(lat, lon)).daily; }
  private normHourly(h: any, _raw: any): HourlyForecast[] {
    const times: string[] = h.time ?? []; const temps: number[] = h.temperature_2m ?? []; const codes: number[] = h.weather_code ?? []; const probs: number[] = h.precipitation_probability ?? [];
    const now = Date.now(); const out: HourlyForecast[] = [];
    for (let i = 0; i < times.length; i++) {
      const t = new Date(times[i]); if (isNaN(t.getTime())) continue;
      out.push({ time: t, temperature: this.units.temperature === "fahrenheit" ? cToF(temps[i] ?? 0) : (temps[i] ?? 0), conditionCode: codes[i] ?? 3, precipProbability: probs[i] ?? 0, isCurrent: Math.abs(t.getTime() - now) < 45 * 60 * 1000 });
    }
    return out;
  }
  private normDaily(d: any, _raw: any): DailyForecast[] {
    const dates: string[] = d.time ?? []; const codes: number[] = d.weather_code ?? []; const maxes: number[] = d.temperature_2m_max ?? []; const mins: number[] = d.temperature_2m_min ?? []; const probs: number[] = d.precipitation_probability_max ?? [];
    const out: DailyForecast[] = [];
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]); if (isNaN(date.getTime())) continue;
      let max = maxes[i] ?? 0, min = mins[i] ?? 0;
      if (this.units.temperature === "fahrenheit") { max = cToF(max); min = cToF(min); }
      out.push({ date, day: this.dayLabel(i, date), conditionCode: codes[i] ?? 3, max: Math.round(max * 10) / 10, min: Math.round(min * 10) / 10, precipProbability: probs[i] ?? 0 });
    }
    return out;
  }
  private dayLabel(i: number, date: Date): string {
    const today = new Date(); today.setHours(0, 0, 0, 0); const d = new Date(date); d.setHours(0, 0, 0, 0);
    if (i === 0 || d.getTime() === today.getTime()) return "Today";
    if ((d.getTime() - today.getTime()) / 86400000 === 1) return "Tomorrow";
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }
  async searchLocations(q: string): Promise<WeatherLocation[]> {
    if (!q.trim()) return [];
    const raw = await fetchJson(`${GEO}?name=${encodeURIComponent(q)}&count=10&language=en&format=json`);
    const results: any[] = raw.results ?? [];
    return results.map((r) => normLocation(r.name, r.latitude, r.longitude, r.country, r.admin1));
  }
}
export { OpenMeteoProvider as default };
