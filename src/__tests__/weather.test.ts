/// <reference types="jest" />
import { cToF, fToC, kmhToMs, kmhToMph, mmToIn } from "@/services/weather/openmeteo";
import { conditionForCode } from "@/theme/tokens";

jest.mock("@react-native-async-storage/async-storage", () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((k: string) => Promise.resolve(store[k] ?? null)),
    setItem: jest.fn((k: string, v: string) => { store[k] = v; return Promise.resolve(); }),
    removeItem: jest.fn((k: string) => { delete store[k]; return Promise.resolve(); }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  };
});

describe("temperature conversion", () => {
  it("c to f", () => { expect(cToF(0)).toBe(32); expect(cToF(100)).toBe(212); expect(cToF(28)).toBeCloseTo(82.4, 1); });
  it("f to c", () => { expect(fToC(32)).toBe(0); expect(fToC(212)).toBe(100); });
});

describe("wind speed conversion", () => {
  it("kmh to ms", () => { expect(kmhToMs(3.6)).toBe(1); expect(kmhToMs(0)).toBe(0); });
  it("kmh to mph", () => { expect(kmhToMph(1.60934)).toBeCloseTo(1, 1); expect(kmhToMph(0)).toBe(0); });
});

describe("precipitation conversion", () => {
  it("mm to in", () => { expect(mmToIn(25.4)).toBe(1); expect(mmToIn(0)).toBe(0); });
});

describe("weather condition mapping", () => {
  it("clear", () => { expect(conditionForCode(0)).toMatchObject({ wash: "clear", icon: "sun", label: "Clear" }); });
  it("overcast", () => { expect(conditionForCode(3)).toMatchObject({ wash: "cloudy", icon: "cloud", label: "Overcast" }); });
  it("rain", () => { expect(conditionForCode(61)).toMatchObject({ wash: "rain", icon: "rain", label: "Slight rain" }); });
  it("storm", () => { expect(conditionForCode(95)).toMatchObject({ wash: "storm", icon: "storm", label: "Thunderstorm" }); });
  it("unknown fallback", () => { expect(conditionForCode(999)).toMatchObject({ wash: "cloudy", icon: "cloud" }); });
});
