import { MaterialCommunityIcons } from "@expo/vector-icons";

const icons: Record<string, string> = {
  sun: "weather-sunny",
  "partly-cloudy": "weather-partly-cloudy",
  cloud: "weather-cloudy",
  rain: "weather-rainy",
  snow: "weather-snowy",
  storm: "weather-lightning",
  fog: "weather-fog",
};

export function WeatherIcon({ name, size = 24, color = "#FFFFFF" }: { name: string; size?: number; color?: string }) {
  return <MaterialCommunityIcons name={(icons[name] ?? "weather-cloudy") as any} size={size} color={color} />;
}
