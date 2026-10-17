import { Text, View, Pressable, ScrollView } from "react-native";
import { Background } from "@/components/weather/Background";
import { TempDisplay } from "@/components/weather/TempDisplay";
import { useWeather } from "@/hooks/useWeather";
import { useLocations } from "@/hooks/useLocations";
import { useUnits } from "@/hooks/useUnits";
import { conditionForCode } from "@/theme/tokens";
import { fontFamily, space } from "@/theme/styles";

export default function HomeScreen({ onNavigate: _onNavigate }: { onNavigate: (s: string, params?: any) => void }) {
  const { locations, defaultLocation } = useLocations();
  const { units } = useUnits();
  const loc = defaultLocation ?? locations[0];
  const weather = useWeather(loc?.lat ?? null, loc?.lon ?? null, units);

  if (!loc) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0E0E12" }}>
        <Text style={{ fontSize: 32, fontFamily: fontFamily("600"), color: "#FFFFFF", marginTop: space.xxxl }}>Atmos</Text>
        <Text style={{ fontSize: 15, fontFamily: fontFamily("400"), color: "#A1A1AA", marginTop: space.s }}>Set your location to see today's weather.</Text>
        <View style={{ marginTop: space.xxl, flexDirection: "row", gap: space.m }}>
          <Pressable style={{ backgroundColor: "#0A84FF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: space.s, alignItems: "center", width: 150 }} onPress={() => _onNavigate("search")}>
            <Text style={{ fontSize: 14, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>Search cities</Text>
          </Pressable>
          <Pressable style={{ borderWidth: 1, borderColor: "#323239", paddingVertical: 12, paddingHorizontal: 20, borderRadius: space.s, alignItems: "center", width: 150 }} onPress={() => {}}>
            <Text style={{ fontSize: 14, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>Use device location</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const sentence = weather.current
    ? `${weather.current.conditionLabel}. ${weather.current.precipProbability >= 60 ? "Bring cover." : weather.current.precipitation > 0 ? "Rain in the air." : !weather.current.isDay ? "Cool air tonight." : "Lowkey perfect tbh."}`
    : "Loading today…";

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: space.l, paddingBottom: space.xxxl }}>
      <Background wash={conditionForCode(weather.current?.conditionCode ?? 3).wash} rain={weather.current?.conditionCode ? weather.current.conditionCode >= 50 && weather.current.conditionCode <= 67 : false} night={!weather.current?.isDay} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.xl }}>
        <Text style={{ fontSize: 15, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>{loc.name}</Text>
        <Text style={{ fontSize: 12, fontFamily: fontFamily("400"), color: "#A1A1AA" }}>{new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</Text>
      </View>
      <TempDisplay temperature={weather.current?.temperature ?? 0} feelsLike={weather.current?.feelsLike ?? 0} high={weather.current?.high ?? 0} low={weather.current?.low ?? 0} conditionCode={weather.current?.conditionCode ?? 3} sentence={sentence} />
      <Pressable style={{ marginTop: space.m }} onPress={() => _onNavigate("detail", { lat: loc.lat, lon: loc.lon, name: loc.name })}>
        <Text style={{ fontSize: 14, fontFamily: fontFamily("500"), color: "#0A84FF" }}>Forecast →</Text>
      </Pressable>
      {weather.error && <Text style={{ marginTop: space.m, fontSize: 13, color: "#FF453A" }}>{weather.error.code === "network" ? "Unable to reach weather service." : "Couldn't load weather."}</Text>}
    </ScrollView>
  );
}
