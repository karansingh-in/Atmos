import { Text, View } from "react-native";
import { conditionForCode } from "@/theme/tokens";
import { fontFamily, space } from "@/theme/styles";
import { WeatherIcon } from "@/components/WeatherIcon";
type Props = { temperature: number; feelsLike: number; high: number; low: number; conditionCode: number; sentence: string };
export function TempDisplay({ temperature, feelsLike, high, low, conditionCode, sentence }: Props) {
  const { icon } = conditionForCode(conditionCode);
  return (
    <View style={{ marginTop: space.xxxl }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center" }}>
        <Text style={{ fontSize: 120, lineHeight: 124, fontFamily: fontFamily("300"), color: "#FFFFFF", letterSpacing: -4 }}>{Math.round(temperature)}</Text>
        <Text style={{ fontSize: 40, lineHeight: 44, fontFamily: fontFamily("300"), color: "#FFFFFF", letterSpacing: -4 }}>°</Text>
        <WeatherIcon name={icon} size={44} color="#FFFFFF" />
      </View>
      <Text style={{ fontSize: 16, lineHeight: 24, fontFamily: fontFamily("400"), color: "#FFFFFF", marginTop: 10, textAlign: "center" }}>{sentence}</Text>
      <Text style={{ fontSize: 13, lineHeight: 18, fontFamily: fontFamily("400"), color: "#FFFFFF", opacity: 0.65, marginTop: 6, textAlign: "center" }}>H {Math.round(high)}°  L {Math.round(low)}°  ·  Feels {Math.round(feelsLike)}°</Text>
    </View>
  );
}
