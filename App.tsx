import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Pressable, Text } from "react-native";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { useThemePreference } from "@/theme/themeStore";
import { dark, light } from "@/theme/tokens";
import HomeScreen from "@/screens/HomeScreen";
import DetailScreen from "@/screens/DetailScreen";
import SearchScreen from "@/screens/SearchScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import AboutScreen from "@/screens/AboutScreen";
import { fontFamily } from "@/theme/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  const [fontsLoaded] = useFonts({ Inter: Inter_400Regular, "Inter-Bold": Inter_600SemiBold });
  const { resolved } = useThemePreference();
  const theme = resolved === "dark" ? dark : light;
  const [screen, setScreen] = useState("home");
  const [params, setParams] = useState<any>(null);

  const navigate = (s: string, p?: any) => { setParams(p ?? null); setScreen(s); };

  if (!fontsLoaded) return null;

  const tabs = [
    { key: "home", label: "Home", icon: "home-outline" },
    { key: "search", label: "Search", icon: "magnify" },
    { key: "settings", label: "Settings", icon: "cog-outline" },
  ];

  const isSubScreen = screen === "detail" || screen === "about";

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
      <View style={{ flex: 1 }}>
        {screen === "home" && <HomeScreen onNavigate={navigate} />}
        {screen === "detail" && <DetailScreen onNavigate={navigate} params={params} />}
        {screen === "search" && <SearchScreen onNavigate={navigate} />}
        {screen === "settings" && <SettingsScreen onNavigate={navigate} />}
        {screen === "about" && <AboutScreen />}
      </View>
      {!isSubScreen && (
        <View style={{ flexDirection: "row", backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.divider, paddingBottom: 8, paddingTop: 8 }}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4, minHeight: 44 }}
              onPress={() => navigate(tab.key)}
            >
              <MaterialCommunityIcons name={tab.icon as any} size={22} color={screen === tab.key ? theme.accent : theme.muted} />
              <Text style={{ fontSize: 10, fontFamily: fontFamily("500"), color: screen === tab.key ? theme.accent : theme.muted, marginTop: 2 }}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
