export type TempUnit = "celsius" | "fahrenheit";
export type WindUnit = "ms" | "kmh" | "mph";
export type PrecipUnit = "mm" | "in";

export interface WeatherLocation { id: string; name: string; region?: string; country: string; lat: number; lon: number; isSaved: boolean; isDefault: boolean; }
export interface CurrentWeather { location: WeatherLocation; temperature: number; feelsLike: number; high: number; low: number; conditionCode: number; conditionLabel: string; isDay: boolean; humidity: number; windSpeed: number; windDirection: number; pressure: number; visibility: number; uvIndex: number; precipitation: number; precipProbability: number; sunrise: Date; sunset: Date; updatedAt: Date; }
export interface HourlyForecast { time: Date; temperature: number; conditionCode: number; precipProbability: number; isCurrent: boolean; }
export interface DailyForecast { date: Date; day: string; conditionCode: number; min: number; max: number; precipProbability: number; }
export interface WeatherAlert { id: string; title: string; description: string; severity: "minor" | "moderate" | "severe" | "extreme"; startsAt: Date; endsAt: Date; }
export interface WeatherUnits { temperature: TempUnit; wind: WindUnit; precipitation: PrecipUnit; }
export const DEFAULT_UNITS: WeatherUnits = { temperature: "celsius", wind: "kmh", precipitation: "mm" };
export class WeatherProviderError extends Error { readonly code: "network" | "not-found" | "permission" | "unknown"; constructor(code: WeatherProviderError["code"], message: string) { super(message); this.code = code; this.name = "WeatherProviderError"; } }
export interface WeatherProvider { getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather>; getHourlyForecast(lat: number, lon: number): Promise<HourlyForecast[]>; getDailyForecast(lat: number, lon: number): Promise<DailyForecast[]>; searchLocations(q: string): Promise<WeatherLocation[]>; getLocationForecast(lat: number, lon: number): Promise<{ current: CurrentWeather; hourly: HourlyForecast[]; daily: DailyForecast[] }>; }
