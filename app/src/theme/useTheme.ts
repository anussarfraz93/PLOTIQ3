import { useColorScheme } from "react-native";
import { darkTokens, lightTokens, ThemeTokens } from "./tokens";

// Mirrors the artifact's `@media (prefers-color-scheme: dark)` — React
// Native's useColorScheme() is the same "system setting" signal.
export function useTheme(): ThemeTokens {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTokens : lightTokens;
}
