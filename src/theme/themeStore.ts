import { Appearance } from "react-native";

export type ThemeName = "light" | "dark" | "system";

export const themeStore = {
  value: (Appearance.getColorScheme() ?? "dark") as ThemeName,
  listeners: new Set<() => void>(),
  subscribe(l: () => void) { this.listeners.add(l); return () => { this.listeners.delete(l); }; },
  set(v: ThemeName) { this.value = v; for (const l of this.listeners) l(); },
};

export function resolveTheme(p: ThemeName) {
  if (p === "system") return Appearance.getColorScheme() ?? "dark";
  return p;
}

import { useState, useEffect } from "react";
export function useThemePreference() {
  const [pref, setPref] = useState<ThemeName>(themeStore.value);
  useEffect(() => {
    const unsub = themeStore.subscribe(() => setPref(themeStore.value));
    return () => unsub();
  }, []);
  const resolved = resolveTheme(pref);
  return { preference: pref, setPreference: themeStore.set.bind(themeStore), resolved };
}
