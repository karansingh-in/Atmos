import { Text, View } from "react-native";
import { conditionForCode } from "@/theme/tokens";
import { fontFamily } from "@/theme/styles";
import { WeatherIcon } from "@/components/WeatherIcon";
import type { DailyForecast } from "@/types/weather";
export function DailyRow({ item, weekMin, weekMax, isToday }: { item: DailyForecast; weekMin: number; weekMax: number; isToday?: boolean }) {
  const { icon } = conditionForCode(item.conditionCode);
  const span = Math.max(1, weekMax - weekMin);
  const minPos = ((item.min - weekMin) / span) * 170;
  const maxPos = ((item.max - weekMin) / span) * 170;
  const width = Math.max(20, maxPos - minPos);
  const ink = isToday ? "#FFFFFF" : "rgba(255,255,255,0.6)";
  return (
    <View style={{ flexDirection: "row", alignItems: "center", height: 44 }}>
      <Text style={{ fontSize: 13, lineHeight: 18, fontFamily: fontFamily("400"), color: "#FFFFFF", width: 56, ...(isToday ? { fontWeight: "600" } : {}) }}>{item.day}</Text>
      <WeatherIcon name={icon} size={16} color={ink} />
      <View style={{ flex: 1, height: 2, marginHorizontal: 8, position: "relative" }}>
        <View style={{ position: "absolute", top: -0.75, height: 1.5, backgroundColor: "rgba(255,255,255,0.22)", left: minPos, width }} />
        <View style={{ position: "absolute", width: 7, height: 7, borderRadius: 4, top: -2.5, left: maxPos - 3.5, backgroundColor: isToday ? "#0A84FF" : "#FFFFFF" }} />
      </View>
      <Text style={{ fontSize: 13, lineHeight: 18, fontFamily: fontFamily("500"), color: "#FFFFFF", width: 34, textAlign: "right", ...(isToday ? { fontWeight: "600" } : {}) }}>{Math.round(item.max)}°</Text>
      <Text style={{ fontSize: 12, lineHeight: 16, fontFamily: fontFamily("400"), color: "rgba(255,255,255,0.5)", width: 34, textAlign: "right" }}>{Math.round(item.min)}°</Text>
      {item.precipProbability > 0 && <Text style={{ fontSize: 10, lineHeight: 14, fontFamily: fontFamily("600"), color: "#7FD4FF" }}>{item.precipProbability}%</Text>}
    </View>
  );
}
