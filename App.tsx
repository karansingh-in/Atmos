import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { useThemePreference } from "@/theme/themeStore";
import { dark, light } from "@/theme/tokens";
import HomeScreen from "@/screens/HomeScreen";
import DetailScreen from "@/screens/DetailScreen";
import SearchScreen from "@/screens/SearchScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import AboutScreen from "@/screens/AboutScreen";

export default function App() {
  const [fontsLoaded] = useFonts({ Inter: Inter_400Regular, "Inter-Bold": Inter_600SemiBold });
  const { resolved } = useThemePreference();
  const theme = resolved === "dark" ? dark : light;
  const [screen, setScreen] = useState("home");
  const [params, setParams] = useState<any>(null);

  const navigate = (s: string, p?: any) => { setParams(p ?? null); setScreen(s); };

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
      {screen === "home" && <HomeScreen onNavigate={navigate} />}
      {screen === "detail" && <DetailScreen onNavigate={navigate} params={params} />}
      {screen === "search" && <SearchScreen onNavigate={navigate} />}
      {screen === "settings" && <SettingsScreen onNavigate={navigate} />}
      {screen === "about" && <AboutScreen />}
    </View>
  );
}
