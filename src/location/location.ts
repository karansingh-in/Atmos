import * as Location from "expo-location";
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync();
  if (status === "granted") return true;
  const r = await Location.requestForegroundPermissionsAsync();
  return r.status === "granted";
}
export async function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
  const ok = await requestLocationPermission();
  if (!ok) throw new Error("location-permission-denied");
  const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: p.coords.latitude, longitude: p.coords.longitude };
}
