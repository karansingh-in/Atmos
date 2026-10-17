import { Appearance } from "react-native";
import { useState, useEffect } from "react";

export type ThemeName = "light" | "dark" | "system";
export const themeStore = {
  value: (Appearance.getColorScheme() ?? "dark") as ThemeName,
  listeners: new Set<() => void>(),
  subscribe(l: () => void) { this.listeners.add(l); return () => { this.listeners.delete(l); }; },
  set(v: ThemeName) { this.value = v; for (const l of this.listeners) l(); },
};
export function resolveTheme(p: ThemeName) { return p === "system" ? (Appearance.getColorScheme() ?? "dark") : p; }
export function useThemePreference() {
  const [pref, setPref] = useState<ThemeName>(themeStore.value);
  useEffect(() => { const unsub = themeStore.subscribe(() => setPref(themeStore.value)); return () => unsub(); }, []);
  const resolved = resolveTheme(pref);
  return { preference: pref, setPreference: themeStore.set.bind(themeStore), resolved };
}
