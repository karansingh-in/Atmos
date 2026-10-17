import React from "react";
import { Text, View, ScrollView, Pressable, TextInput } from "react-native";
import { useLocations } from "@/hooks/useLocations";
import { useUnits } from "@/hooks/useUnits";
import { getProvider } from "@/services/weather";
import { fontFamily, space } from "@/theme/styles";
import type { WeatherLocation } from "@/types/weather";

export default function SearchScreen({ onNavigate: _onNavigate }: { onNavigate: (s: string, p?: any) => void }) {
  const { units } = useUnits();
  const { locations, save } = useLocations();
  const provider = getProvider(units);

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<WeatherLocation[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const search = React.useCallback(async () => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true); setError(null);
    try { setResults(await provider.searchLocations(query)); }
    catch { setError("Search failed. Try again."); setResults([]); }
    finally { setLoading(false); }
  }, [query, provider]);

  React.useEffect(() => { const t = setTimeout(search, 300); return () => clearTimeout(t); }, [search]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0E0E12" }} contentContainerStyle={{ paddingHorizontal: space.l, paddingBottom: space.xxxl }}>
      <Text style={{ fontSize: 20, fontFamily: fontFamily("600"), color: "#FFFFFF", marginTop: space.xl, marginBottom: space.l }}>Search cities</Text>
      <TextInput style={{ backgroundColor: "#17171C", color: "#FFFFFF", paddingVertical: 12, paddingHorizontal: 14, borderRadius: space.s, fontSize: 15, fontFamily: fontFamily("400"), marginBottom: space.l }} placeholder="City name" value={query} onChangeText={setQuery} autoCapitalize="words" returnKeyType="search" onSubmitEditing={search} />
      {error && <Text style={{ color: "#FF453A", fontSize: 13, marginBottom: space.s }}>{error}</Text>}
      {loading && <Text style={{ color: "#71717A", fontSize: 13, marginBottom: space.m }}>Searching…</Text>}
      {results.length > 0 && (
        <View style={{ marginBottom: space.xl }}>
          {results.map((loc) => (
            <Pressable key={loc.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#17171C", paddingVertical: 10, paddingHorizontal: 14, borderRadius: space.s, marginBottom: space.s }} onPress={() => { save(loc); _onNavigate("home"); }}>
              <View><Text style={{ fontSize: 15, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>{loc.name}</Text><Text style={{ fontSize: 12, fontFamily: fontFamily("400"), color: "#A1A1AA" }}>{[loc.region, loc.country].filter(Boolean).join(", ")}</Text></View>
              <Text style={{ fontSize: 13, fontFamily: fontFamily("500"), color: "#0A84FF" }}>Add</Text>
            </Pressable>
          ))}
        </View>
      )}
      {results.length === 0 && query.trim() && !loading && <Text style={{ color: "#71717A", fontSize: 13, marginBottom: space.m }}>No results for “{query}”.</Text>}
      <View style={{ marginTop: space.xxl, marginBottom: space.s }}>
        <Text style={{ fontSize: 10, fontFamily: fontFamily("600"), color: "#71717A", letterSpacing: 14 }}>SAVED LOCATIONS</Text>
      </View>
      {locations.length === 0 ? (
        <Text style={{ color: "#71717A", fontSize: 13, marginBottom: space.m }}>No saved locations yet.</Text>
      ) : (
        locations.map((loc) => (
          <Pressable key={loc.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#17171C", paddingVertical: 10, paddingHorizontal: 14, borderRadius: space.s, marginBottom: space.s }} onPress={() => _onNavigate("home")}>
            <View><Text style={{ fontSize: 15, fontFamily: fontFamily("500"), color: "#FFFFFF" }}>{loc.name}</Text><Text style={{ fontSize: 12, fontFamily: fontFamily("400"), color: "#A1A1AA" }}>{[loc.region, loc.country].filter(Boolean).join(", ")}</Text></View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
