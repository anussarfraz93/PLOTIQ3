import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PLOTS } from "../data/plots";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import { tCompareCount } from "../i18n/translations";
import { EmptyState } from "../components/EmptyState";
import { PlotCard } from "../components/PlotCard";
import { Icon } from "../components/Icon";
import { useAppState } from "../state/useAppState";

type Props = Pick<ReturnType<typeof useAppState>, "savedPlots" | "toggleSave">;

// Ported from renderCompareView() in prototype/index.html — vertically
// stacked cards (not a side-scrolling table), sorted cheapest first, with
// Best price / Closest badges computed from the saved set.
export function CompareView({ savedPlots, toggleSave }: Props) {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  const rtl = lang === "ur";

  const rows = savedPlots
    .map((s) => {
      const plot = PLOTS.find((p) => p.id === s.plotId);
      return plot ? { s, plot } : null;
    })
    .filter((r): r is { s: (typeof savedPlots)[number]; plot: (typeof PLOTS)[number] } => r !== null);

  if (rows.length < 2) {
    return (
      <EmptyState
        iconName="layers"
        title="Save 2+ plots to compare"
        body={`${tr(rows.length === 0 ? "You haven't saved any plots yet." : "You've saved 1 — save at least one more.")} ${tr("Bookmark plots from the Land Finder, then come back here.")}`}
      />
    );
  }

  const parseMinutes = (distance: string) => {
    const m = distance.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 999;
  };

  const withStats = rows
    .map((r) => ({ ...r, total: r.s.size * r.plot.pricePerMarlaLac, minutes: parseMinutes(r.plot.distance) }))
    .sort((a, b) => a.total - b.total);

  const cheapestTotal = Math.min(...withStats.map((r) => r.total));
  const closestMinutes = Math.min(...withStats.map((r) => r.minutes));

  return (
    <ScrollView contentContainerStyle={styles.list}>
      <View style={styles.header}>
        <Text style={{ color: t.ink, fontSize: 18, fontFamily: fontFor(lang, "display"), textAlign: rtl ? "right" : "left" }}>
          {tr("Compare plots")}
        </Text>
        <Text style={{ color: t.inkMuted, fontSize: 11.5, fontFamily: fontFor(lang, "body"), marginTop: 3, textAlign: rtl ? "right" : "left" }}>
          {tCompareCount(lang, rows.length)}
        </Text>
      </View>

      {withStats.map((r) => {
        const badges: React.ReactNode[] = [];
        if (r.total === cheapestTotal) {
          badges.push(
            <View key="price" style={[styles.badge, { backgroundColor: t.goodBg }]}>
              <Icon name="tag" size={11} color={t.good} />
              <Text style={{ color: t.good, fontSize: 10.5, fontWeight: "700", fontFamily: fontFor(lang, "monoMedium") }}>
                {tr("Best price")}
              </Text>
            </View>
          );
        }
        if (r.minutes === closestMinutes) {
          badges.push(
            <View key="dist" style={[styles.badge, { backgroundColor: t.accentSoft }]}>
              <Icon name="mapPin" size={11} color={t.accentStrong} />
              <Text style={{ color: t.accentStrong, fontSize: 10.5, fontWeight: "700", fontFamily: fontFor(lang, "monoMedium") }}>
                {tr("Closest")}
              </Text>
            </View>
          );
        }
        return (
          <PlotCard
            key={r.plot.id}
            variant="compare"
            match={{ plot: r.plot, bestSize: r.s.size, score: 0, reasons: [] }}
            saved
            onToggleSave={() => toggleSave(r.plot.id)}
            extraBadges={badges.length ? <View style={styles.badgeRow}>{badges}</View> : undefined}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 14, paddingTop: 16, gap: 10 },
  header: { paddingHorizontal: 2, paddingBottom: 4 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  badge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 9 },
});
