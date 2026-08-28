import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PLOTS } from "../data/plots";
import { fetchInsights, InsightsResponse } from "../lib/api";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import { tAvgPrice, tInsightsIntro, tSectorsTracked } from "../i18n/translations";
import { Icon } from "../components/Icon";

// Ported from renderInsightsView() in prototype/index.html — average
// price/Marla per land type, with the sorted sector list underneath each,
// computed by the backend (falls back to on-device calc if unreachable).
export function InsightsView() {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  const rtl = lang === "ur";
  const [data, setData] = useState<InsightsResponse | null>(null);

  useEffect(() => {
    fetchInsights().then(({ data }) => setData(data));
  }, []);

  if (!data) return null;

  const maxAvg = Math.max(...data.byType.map((s) => s.avgPricePerMarlaLac));

  return (
    <ScrollView contentContainerStyle={styles.list}>
      <View style={styles.header}>
        <Text style={{ color: t.ink, fontSize: 18, fontFamily: fontFor(lang, "display"), textAlign: rtl ? "right" : "left" }}>
          {tr("Market insights")}
        </Text>
        <Text style={{ color: t.inkMuted, fontSize: 11.5, fontFamily: fontFor(lang, "body"), marginTop: 3, textAlign: rtl ? "right" : "left" }}>
          {tr("Average price per Marla, by land type")}
        </Text>
      </View>

      <View style={[styles.insightCard, { backgroundColor: t.surface, borderColor: t.line }]}>
        <View style={[styles.insightIcon, { backgroundColor: t.accentSoft }]}>
          <Icon name="info" size={17} color={t.accentStrong} />
        </View>
        <Text style={{ color: t.inkMuted, fontSize: 12, fontFamily: fontFor(lang, "body"), lineHeight: 18, flex: 1, textAlign: rtl ? "right" : "left" }}>
          {tInsightsIntro(lang, data.totalSectors || PLOTS.length)}
        </Text>
      </View>

      {data.byType.map((s) => {
        const pct = Math.round((s.avgPricePerMarlaLac / maxAvg) * 100);
        return (
          <View key={s.type} style={[styles.statRow, { backgroundColor: t.surface, borderColor: t.line }]}>
            <View style={styles.statTop}>
              <Text style={{ color: t.ink, fontSize: 12.5, fontWeight: "600", fontFamily: fontFor(lang, "bodySemiBold") }}>
                {tr(s.typeLabel)}
              </Text>
              <Text style={{ color: t.inkMuted, fontSize: 12.5, fontFamily: fontFor(lang, "mono") }}>
                {tAvgPrice(lang, s.avgPricePerMarlaLac.toFixed(0))}
              </Text>
            </View>
            <View style={[styles.barTrack, { backgroundColor: t.surface2 }]}>
              <View style={[styles.barFill, { backgroundColor: t.accent, width: `${pct}%` }]} />
            </View>
            <Text style={{ color: t.inkMuted, fontSize: 10.5, fontFamily: fontFor(lang, "body"), textAlign: rtl ? "right" : "left" }}>
              {tSectorsTracked(lang, s.count)}
            </Text>
            <View style={styles.tagWrap}>
              {s.sectors.map((sec) => (
                <View key={sec.sector} style={[styles.tag, { backgroundColor: t.surface2, borderColor: t.line }]}>
                  <Text style={{ fontSize: 10, fontFamily: fontFor(lang, "monoMedium") }}>
                    <Text style={{ color: t.ink, fontWeight: "600" }}>{sec.sector}</Text>
                    <Text style={{ color: t.inkMuted }}> · {sec.pricePerMarlaLac}L</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 14, paddingTop: 16, gap: 10 },
  header: { paddingHorizontal: 2, paddingBottom: 4 },
  insightCard: { flexDirection: "row", gap: 12, alignItems: "flex-start", borderWidth: 1, borderRadius: 14, padding: 14 },
  insightIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statRow: { borderWidth: 1, borderRadius: 14, padding: 12, gap: 6 },
  statTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  barTrack: { height: 7, borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  tag: { borderWidth: 1, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 9 },
});
