import { Text, View, ScrollView, Pressable, Linking } from "react-native";
import { fontFamily, space } from "@/theme/styles";

export default function AboutScreen() {
  const Link = ({ label, sub, url }: { label: string; sub: string; url: string }) => (
    <Pressable style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#17171C", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 18, marginBottom: space.s }} onPress={() => Linking.openURL(url)}>
      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#0A84FF", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
        <Text style={{ fontSize: 14, fontFamily: fontFamily("600"), color: "#FFFFFF" }}>{label[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>{label}</Text>
        <Text style={{ fontSize: 12, fontFamily: fontFamily("400"), color: "#A1A1AA" }}>{sub}</Text>
      </View>
      <Text style={{ fontSize: 14, color: "#A1A1AA" }}>↗</Text>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0E0E12" }} contentContainerStyle={{ paddingHorizontal: space.l, paddingBottom: space.xxxl }}>
      <View style={{ alignItems: "center", marginTop: space.xxxl }}>
        <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: "#0A84FF", alignItems: "center", justifyContent: "center", marginBottom: space.l }}>
          <Text style={{ fontSize: 32, fontFamily: fontFamily("600"), color: "#FFFFFF" }}>A</Text>
        </View>
        <Text style={{ fontSize: 26, fontFamily: fontFamily("600"), color: "#FFFFFF", textAlign: "center" }}>Atmos</Text>
        <Text style={{ fontSize: 14, fontFamily: fontFamily("400"), color: "#A1A1AA", marginTop: 5, textAlign: "center" }}>Calm weather, no tracking.</Text>
        <Text style={{ fontSize: 12, fontFamily: fontFamily("400"), color: "#71717A", marginTop: 10, textAlign: "center" }}>Version 1.0.0 · Axiom Personal OS</Text>
      </View>
      <View style={{ marginTop: space.xxl }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>ABOUT THE APP</Text>
        <Text style={{ fontSize: 13, fontFamily: fontFamily("400"), color: "#A1A1AA", lineHeight: 20 }}>Atmos is a privacy-first weather app. No ads, no tracking, no accounts. Clean, hourly and daily forecasts with rain radar.</Text>
      </View>
      <View style={{ marginTop: space.xxl }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14, marginBottom: space.s }}>CONNECT</Text>
        <Link label="GitHub" sub="Source code and projects" url="https://github.com/karansingh-in" />
        <Link label="Follow on X" sub="Updates, projects and thoughts" url="https://x.com/karansingh_ind" />
        <Link label="Get in touch" sub="karannsinggh.work@gmail.com" url="mailto:karannsinggh.work@gmail.com" />
      </View>
      <View style={{ marginTop: space.xxxl, alignItems: "center" }}>
        <Text style={{ fontSize: 11, fontFamily: fontFamily("400"), color: "#71717A", textAlign: "center" }}>Made with care · © karansingh-in</Text>
      </View>
    </ScrollView>
  );
}
