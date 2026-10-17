import { Text, View, ScrollView } from "react-native";
import { Background } from "@/components/weather/Background";
import { TempDisplay } from "@/components/weather/TempDisplay";
import { HourlyScroll } from "@/components/weather/HourlyScroll";
import { DailyRow } from "@/components/weather/DailyRow";
import { useWeather } from "@/hooks/useWeather";
import { useUnits } from "@/hooks/useUnits";
import { conditionForCode } from "@/theme/tokens";
import { fontFamily, space } from "@/theme/styles";

export default function DetailScreen({ params }: { onNavigate: (s: string, p?: any) => void; params: any }) {
  const { units } = useUnits();
  const lat = params?.lat ? parseFloat(params.lat) : null;
  const lon = params?.lon ? parseFloat(params.lon) : null;
  const name = params?.name ?? "";
  const weather = useWeather(lat, lon, units);

  if (weather.loading && !weather.current) return <View style={{ flex: 1, backgroundColor: "#0E0E12", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 20, fontFamily: fontFamily("600"), color: "#FFFFFF" }}>Loading…</Text></View>;
  if (!weather.current) return <View style={{ flex: 1, backgroundColor: "#0E0E12", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 20, fontFamily: fontFamily("600"), color: "#FFFFFF" }}>Unable to load forecast.</Text></View>;

  const weekMin = Math.min(...weather.daily.map((d) => d.min));
  const weekMax = Math.max(...weather.daily.map((d) => d.max));
  const sentence = `${weather.current.conditionLabel}. ${weather.current.temperature}° today.`;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: space.l, paddingBottom: space.xxxl }}>
      <Background wash={conditionForCode(weather.current.conditionCode).wash} rain={weather.current.conditionCode >= 50 && weather.current.conditionCode <= 67} night={!weather.current.isDay} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.xl }}>
        <Text style={{ fontSize: 15, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>{name || weather.current.location.name}</Text>
        <Text style={{ fontSize: 12, fontFamily: fontFamily("400"), color: "#A1A1AA" }}>{new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</Text>
      </View>
      <TempDisplay temperature={weather.current.temperature} feelsLike={weather.current.feelsLike} high={weather.current.high} low={weather.current.low} conditionCode={weather.current.conditionCode} sentence={sentence} />
      <View style={{ marginTop: space.l, paddingHorizontal: space.l }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>HOURLY</Text>
        <HourlyScroll items={weather.hourly} />
      </View>
      <View style={{ marginTop: space.l, paddingHorizontal: space.l }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>THIS WEEK</Text>
        {weather.daily.map((day) => <DailyRow key={day.date.toISOString()} item={day} weekMin={weekMin} weekMax={weekMax} isToday={day.day === "Today"} />)}
      </View>
    </ScrollView>
  );
}
