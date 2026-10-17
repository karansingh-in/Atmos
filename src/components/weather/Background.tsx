import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { weatherWash } from "@/theme/tokens";

export function Background({ wash, rain, night }: { wash: string; rain?: boolean; night?: boolean }) {
  const [top, bottom] = weatherWash[wash] ?? weatherWash.cloudy;
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={[top, bottom]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={["#0000004B", "#00000000", "#00000052"]} locations={[0, 0.35, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      {rain && (
        <View style={StyleSheet.absoluteFill}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={{ position: "absolute", width: 1, height: 36, left: i * 28, top: 120 + (i % 3) * 24, backgroundColor: "rgba(255,255,255,0.06)", transform: [{ rotate: "12deg" }] }} />
          ))}
        </View>
      )}
      {night && <View style={{ position: "absolute", width: 48, height: 48, borderRadius: 24, left: 286, top: 118, backgroundColor: "#E8EAF2", opacity: 0.95 }} />}
      {!night && !rain && <View style={{ position: "absolute", width: 88, height: 88, borderRadius: 44, left: 136, top: 450, backgroundColor: "#FFE9A8", opacity: 0.9 }} />}
    </View>
  );
}
