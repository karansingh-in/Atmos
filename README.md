# Atmos

Premium, minimalist, privacy-first weather app for Android. Built with React Native, Expo, and TypeScript.

## Screens

- **Home** — today's weather: giant temperature, conditions sentence, high/low, feels-like, adaptive background
- **Forecast** — hourly timeline, seven-day range, AQI, humidity, wind, sunrise/sunset
- **Search** — city search with debounced input, saved locations
- **Settings** — theme (system/light/dark), temperature units (C/F), about

## Tech Stack

- React Native 0.88 + Expo SDK 58
- TypeScript (strict mode)
- State-based navigation (no router library — smaller APK)
- Expo Location, AsyncStorage
- Open-Meteo weather API (no API key)
- Jest + @testing-library/react-native (10 tests)

## Getting Started

```bash
npm install
npm start  # dev server
```

## Weather Data

Atmos uses [Open-Meteo](https://open-meteo.com/) — no API key required for ordinary non-commercial use.

## Build

```bash
# Local
npx tsc --noEmit  # typecheck
npm run lint       # lint
npm test           # tests
```

GitHub Actions builds the release APK on every push to master.

## License

MIT
