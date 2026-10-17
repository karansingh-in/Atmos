import { Text, View, ScrollView, Pressable } from "react-native";
import { useThemePreference } from "@/theme/themeStore";
import { useUnits } from "@/hooks/useUnits";
import { fontFamily, space } from "@/theme/styles";

export default function SettingsScreen({ onNavigate: _onNavigate }: { onNavigate: (s: string, p?: any) => void }) {
  const { preference, setPreference } = useThemePreference();
  const { units, setTemperatureUnit } = useUnits();

  const Row = ({ label, value, onPress }: { label: string; value: string; onPress: () => void }) => (
    <Pressable style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#323239" }} onPress={onPress}>
      <Text style={{ fontSize: 15, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>{label}</Text>
      <Text style={{ fontSize: 14, fontFamily: fontFamily("400"), color: "#A1A1AA" }}>{value}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0E0E12" }} contentContainerStyle={{ paddingHorizontal: space.l, paddingBottom: space.xxxl }}>
      <Text style={{ fontSize: 20, fontFamily: fontFamily("600"), color: "#FFFFFF", marginTop: space.xl, marginBottom: space.l }}>Settings</Text>

      <View style={{ marginTop: space.l }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>APPEARANCE</Text>
        <Row label="Theme" value={preference === "system" ? "System" : preference === "dark" ? "Dark" : "Light"} onPress={() => setPreference(preference === "system" ? "light" : preference === "light" ? "dark" : "system")} />
        <Row label="Temperature" value={units.temperature === "celsius" ? "Celsius" : "Fahrenheit"} onPress={() => setTemperatureUnit(units.temperature === "celsius" ? "fahrenheit" : "celsius")} />
      </View>

      <View style={{ marginTop: space.l }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>DATA</Text>
        <Row label="Saved locations" value="Manage cities" onPress={() => _onNavigate("search")} />
      </View>

      <View style={{ marginTop: space.l }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>ABOUT</Text>
        <Row label="Weather data" value="Open-Meteo" onPress={() => {}} />
        <Row label="Privacy" value="No tracking, no ads" onPress={() => {}} />
        <Row label="Version" value="1.0.0" onPress={() => {}} />
      </View>

      <View style={{ marginTop: space.xxl }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>PRIVACY</Text>
        <Text style={{ fontSize: 13, fontFamily: fontFamily("400"), color: "#A1A1AA", lineHeight: 20 }}>Location is used only to fetch weather, is never transmitted anywhere, and the app works fully with location permission denied.</Text>
      </View>
    </ScrollView>
  );
}
