// Ported 1:1 from prototype/index.html's :root / dark-media / [data-theme=dark]
// CSS custom properties. Same hex values in both places — do not change.

export type ThemeTokens = {
  canvas: string;
  surface: string;
  surface2: string;
  surfaceHover: string;
  ink: string;
  inkMuted: string;
  inkFaint: string;
  line: string;
  lineStrong: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  accentInk: string;
  good: string;
  goodBg: string;
};

export const lightTokens: ThemeTokens = {
  canvas: "#eef1f6",
  surface: "#ffffff",
  surface2: "#e3e8f0",
  surfaceHover: "#d9e0ec",
  ink: "#10162a",
  inkMuted: "#5b6480",
  inkFaint: "#8890a8",
  line: "#d3d9e6",
  lineStrong: "#b9c1d4",
  accent: "#c1662a",
  accentStrong: "#a5541f",
  accentSoft: "#f3e0cf",
  accentInk: "#fffaf5",
  good: "#1f8f5f",
  goodBg: "#e3f5ec",
};

export const darkTokens: ThemeTokens = {
  canvas: "#0a0f1c",
  surface: "#121a2b",
  surface2: "#1a2438",
  surfaceHover: "#22304c",
  ink: "#edf1fa",
  inkMuted: "#97a2c1",
  inkFaint: "#69739a",
  line: "#243050",
  lineStrong: "#334268",
  accent: "#e2913f",
  accentStrong: "#f2a352",
  accentSoft: "#3a2a17",
  accentInk: "#1a1206",
  good: "#3fd190",
  goodBg: "rgba(63,209,144,0.14)",
};

export const fonts = {
  display: "Fraunces_600SemiBold",
  displayBold: "Fraunces_700Bold",
  body: "IBMPlexSans_400Regular",
  bodyMedium: "IBMPlexSans_500Medium",
  bodySemiBold: "IBMPlexSans_600SemiBold",
  mono: "IBMPlexMono_400Regular",
  monoMedium: "IBMPlexMono_500Medium",
  monoSemiBold: "IBMPlexMono_600SemiBold",
  urdu: "NotoNastaliqUrdu_400Regular",
  urduBold: "NotoNastaliqUrdu_700Bold",
};

export type FontRole = keyof typeof fonts;

// Urdu (Nastaliq script) isn't covered by Fraunces/IBM Plex, so every role
// falls back to the one Urdu face when the app is in Urdu — bold roles get
// the bold cut, everything else gets regular. English keeps its normal
// per-role font pairing untouched.
export function fontFor(lang: "en" | "ur", role: FontRole): string {
  if (lang !== "ur") return fonts[role];
  const isBold = role === "display" || role === "displayBold" || role === "bodySemiBold" || role === "monoSemiBold";
  return isBold ? fonts.urduBold : fonts.urdu;
}
