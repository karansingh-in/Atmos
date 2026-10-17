export { OpenMeteoProvider } from "./openmeteo";
import type { WeatherUnits } from "@/types/weather";
import { OpenMeteoProvider } from "./openmeteo";
export function getProvider(units: WeatherUnits) { return new OpenMeteoProvider(units); }
