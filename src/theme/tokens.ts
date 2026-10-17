/* Axiom design tokens + weather condition mapping. */
export const dark = {
  canvas: "#0E0E12", surface: "#17171C", elevated: "#232229",
  text: "#FFFFFF", muted: "#A1A1AA", faint: "#71717A",
  divider: "#323239", accent: "#0A84FF",
} as const;
export const light = {
  canvas: "#F2F2F6", surface: "#FFFFFF", elevated: "#E9E9EE",
  text: "#000000", muted: "#6E6E73", faint: "#636366",
  divider: "#E2E2E8", accent: "#0A84FF",
} as const;
export type Theme = typeof dark;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 12, md: 18, lg: 24 } as const;

export const weatherWash: Record<string, [string, string]> = {
  clear: ["#1E3A5F", "#C99A4A"], cloudy: ["#1E242F", "#6B788C"],
  rain: ["#060D1D", "#1D4A5E"], storm: ["#1A102E", "#3B2A5E"],
  snow: ["#E3EAF7", "#B8C6DB"], fog: ["#6E7A83", "#9AA3AC"],
  night: ["#000000", "#1B1D42"],
} as const;

export const conditionMap: Record<number, { wash: string; icon: string; label: string }> = {
  0: { wash: "clear", icon: "sun", label: "Clear" },
  1: { wash: "clear", icon: "sun", label: "Mainly clear" },
  2: { wash: "cloudy", icon: "partly-cloudy", label: "Partly cloudy" },
  3: { wash: "cloudy", icon: "cloud", label: "Overcast" },
  45: { wash: "fog", icon: "fog", label: "Fog" },
  48: { wash: "fog", icon: "fog", label: "Depositing rime fog" },
  51: { wash: "rain", icon: "rain", label: "Light drizzle" },
  53: { wash: "rain", icon: "rain", label: "Moderate drizzle" },
  55: { wash: "rain", icon: "rain", label: "Dense drizzle" },
  56: { wash: "rain", icon: "rain", label: "Light freezing drizzle" },
  57: { wash: "rain", icon: "rain", label: "Dense freezing drizzle" },
  61: { wash: "rain", icon: "rain", label: "Slight rain" },
  63: { wash: "rain", icon: "rain", label: "Moderate rain" },
  65: { wash: "rain", icon: "rain", label: "Heavy rain" },
  66: { wash: "rain", icon: "rain", label: "Light freezing rain" },
  67: { wash: "rain", icon: "rain", label: "Heavy freezing rain" },
  71: { wash: "snow", icon: "snow", label: "Slight snow fall" },
  73: { wash: "snow", icon: "snow", label: "Moderate snow fall" },
  75: { wash: "snow", icon: "snow", label: "Heavy snow fall" },
  77: { wash: "snow", icon: "snow", label: "Snow grains" },
  80: { wash: "rain", icon: "rain", label: "Slight rain showers" },
  81: { wash: "rain", icon: "rain", label: "Moderate rain showers" },
  82: { wash: "rain", icon: "rain", label: "Violent rain showers" },
  85: { wash: "snow", icon: "snow", label: "Slight snow showers" },
  86: { wash: "snow", icon: "snow", label: "Heavy snow showers" },
  95: { wash: "storm", icon: "storm", label: "Thunderstorm" },
  96: { wash: "storm", icon: "storm", label: "Thunderstorm with slight hail" },
  99: { wash: "storm", icon: "storm", label: "Thunderstorm with heavy hail" },
} as const;

export function conditionForCode(code: number) {
  return conditionMap[code] ?? conditionMap[3];
}
export function isNight(isDay: number | null | undefined) {
  return isDay === 0;
}

export function fontFamily(weight: string) {
  return weight === "600" ? "Inter-Bold" : weight === "500" ? "Inter-Medium" : "Inter";
}
export const fontSizes = {
  display: 120, headline: 20, title: 17, body: 14, caption: 12, micro: 10,
} as const;
