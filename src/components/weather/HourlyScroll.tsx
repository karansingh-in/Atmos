import { FlatList, Text, View } from "react-native";
import { conditionForCode } from "@/theme/tokens";
import { fontFamily, space } from "@/theme/styles";
import { WeatherIcon } from "@/components/WeatherIcon";
import type { HourlyForecast } from "@/types/weather";

export function HourlyScroll({ items }: { items: HourlyForecast[] }) {
  return (
    <View style={{ paddingTop: space.s }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: space.l }}
        renderItem={({ item }) => {
          const label = item.time.toLocaleTimeString(undefined, { hour: "numeric" }).replace(":00", "");
          return (
            <View style={{ width: 72, alignItems: "center", marginRight: space.m }}>
              <WeatherIcon name={conditionForCode(item.conditionCode).icon} size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 12, lineHeight: 16, fontFamily: fontFamily("400"), color: "#FFFFFF", opacity: 0.8, marginTop: 6, ...(item.isCurrent ? { color: "#0A84FF", fontWeight: "600" } : {}) }}>{label}</Text>
              <Text style={{ fontSize: 16, lineHeight: 20, fontFamily: fontFamily("500"), color: "#FFFFFF", marginTop: 2, ...(item.isCurrent ? { color: "#0A84FF", fontWeight: "600" } : {}) }}>{Math.round(item.temperature)}°</Text>
              {item.precipProbability > 0 && <Text style={{ fontSize: 10, lineHeight: 14, fontFamily: fontFamily("600"), color: "#7FD4FF", marginTop: 4 }}>{item.precipProbability}%</Text>}
            </View>
          );
        }}
      />
    </View>
  );
}
