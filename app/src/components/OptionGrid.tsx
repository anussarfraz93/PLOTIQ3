import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";
import { fontFor } from "../theme/tokens";
import { useLanguage } from "../i18n/LanguageContext";
import { BarsIcon, Icon, IconName } from "./Icon";

// Ported from .opt-grid / .opt-card in prototype/index.html — a 2-column
// grid of icon + label + sublabel cards.
export type GridOption = { label: string; sub?: string; icon?: IconName };

export function OptionGrid({
  options,
  levels,
  onPick,
}: {
  options: GridOption[];
  levels?: boolean;
  onPick: (index: number) => void;
}) {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  return (
    <View style={styles.grid}>
      {options.map((opt, i) => (
        <Pressable
          key={i}
          onPress={() => onPick(i)}
          style={({ pressed, hovered }: any) => [
            styles.card,
            { backgroundColor: t.surface, borderColor: t.line },
            hovered && { backgroundColor: t.surfaceHover, borderColor: t.accent },
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: t.accentSoft }]}>
            {opt.icon ? (
              <Icon name={opt.icon} size={16} color={t.accentStrong} />
            ) : levels ? (
              <BarsIcon level={i + 1} max={options.length} size={16} color={t.accentStrong} />
            ) : (
              <Icon name="tag" size={16} color={t.accentStrong} />
            )}
          </View>
          <Text
            style={[
              styles.label,
              { color: t.ink, fontFamily: fontFor(lang, "bodySemiBold"), textAlign: lang === "ur" ? "right" : "left", writingDirection: lang === "ur" ? "rtl" : "ltr" },
            ]}
          >
            {tr(opt.label)}
          </Text>
          {!!opt.sub && (
            <Text
              style={[
                styles.sub,
                { color: t.inkMuted, fontFamily: fontFor(lang, "body"), textAlign: lang === "ur" ? "right" : "left", writingDirection: lang === "ur" ? "rtl" : "ltr" },
              ]}
            >
              {tr(opt.sub)}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignSelf: "stretch" },
  card: {
    flexBasis: "48%",
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 11,
    gap: 8,
  },
  iconWrap: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 12.5, fontWeight: "600", lineHeight: 16 },
  sub: { fontSize: 10.5 },
});
