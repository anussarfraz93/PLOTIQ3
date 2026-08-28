import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Match } from "../data/types";
import { TYPE_LABEL } from "../data/plots";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import { tEstPrice, tMarla, tMatchBadge } from "../i18n/translations";
import { Icon } from "./Icon";

// Ported from matchCardHTML() / .card/.row/.match-badge/.save-btn in
// prototype/index.html, extended per SRS 4.3/4.8: legal/NOC status and a
// Contact Agent (call / WhatsApp) section. Used by Chat results, Saved,
// and Compare (compare uses the compact `variant`, without agent/legal —
// that's about comparing numbers, not making contact).
export function PlotCard({
  match,
  badgeLabel,
  saved,
  onToggleSave,
  extraBadges,
  variant = "match",
}: {
  match: Pick<Match, "plot" | "bestSize" | "score" | "reasons">;
  badgeLabel?: string; // omit to hide the match-% badge entirely (Saved view)
  saved: boolean;
  onToggleSave: () => void;
  extraBadges?: React.ReactNode; // Compare view's Best price / Closest badges
  variant?: "match" | "compare"; // compare uses Size/Price-per-Marla/Total price rows instead
}) {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  const { plot, bestSize, score, reasons } = match;
  const totalCostLac = Math.round(bestSize * plot.pricePerMarlaLac);
  const rtl = lang === "ur";

  return (
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
      <Pressable
        onPress={onToggleSave}
        accessibilityLabel={tr(saved ? "Remove from saved" : "Save plot")}
        style={[
          styles.saveBtn,
          { backgroundColor: saved ? t.accentSoft : t.surface, borderColor: saved ? t.accent : t.line },
        ]}
      >
        <Icon name={saved ? "bookmarkFill" : "bookmark"} size={15} color={saved ? t.accentStrong : t.inkMuted} />
      </Pressable>

      {extraBadges}
      {badgeLabel && (
        <View style={[styles.matchBadge, { backgroundColor: t.goodBg }]}>
          <Text style={{ color: t.good, fontSize: 10.5, fontWeight: "700", fontFamily: fontFor(lang, "monoMedium") }}>
            {/* badgeLabel arrives pre-translated from the caller (e.g. "Match 2"
                isn't a dictionary key on its own — the number is appended after
                translating "Match") */}
            {tMatchBadge(lang, badgeLabel, Math.min(99, Math.round(score)))}
          </Text>
        </View>
      )}

      <Text style={{ color: t.ink, fontSize: 16, fontFamily: fontFor(lang, "display"), marginBottom: 2, textAlign: rtl ? "right" : "left" }}>
        {plot.sector}{plot.block ? ` · ${plot.block}` : ""}
      </Text>
      <Text style={{ color: t.inkMuted, fontSize: 11.5, marginBottom: 8, fontFamily: fontFor(lang, "body"), textAlign: rtl ? "right" : "left" }}>
        {tr(TYPE_LABEL[plot.type])} · {plot.distance}
      </Text>

      {variant === "compare" ? (
        <>
          <Row lang={lang} t={t} label="Size" value={tMarla(lang, bestSize)} mono />
          <Row lang={lang} t={t} label="Price/Marla" value={`${plot.pricePerMarlaLac}L`} mono />
          <Row lang={lang} t={t} label="Total price" value={`${totalCostLac}L`} mono />
        </>
      ) : (
        <>
          <Row lang={lang} t={t} label="Recommended size" value={tMarla(lang, bestSize)} mono />
          <Row lang={lang} t={t} label="Est. price" value={tEstPrice(lang, plot.pricePerMarlaLac, totalCostLac)} mono />
          {reasons.length > 0 && <Row lang={lang} t={t} label="Why" value={reasons.join("; ")} />}

          {!!plot.legalStatus && (
            <View style={[styles.legalRow, { borderTopColor: t.line }]}>
              <Text style={{ color: t.inkMuted, fontSize: 12.5, fontFamily: fontFor(lang, "body") }}>{tr("Legal status")}</Text>
              <View style={[styles.legalPill, { backgroundColor: plot.nocApproved ? t.goodBg : t.accentSoft }]}>
                <Text style={{ color: plot.nocApproved ? t.good : t.accentStrong, fontSize: 10.5, fontWeight: "700", fontFamily: fontFor(lang, "monoMedium") }}>
                  {tr(plot.legalStatus)}
                </Text>
              </View>
            </View>
          )}

          {(plot.agent?.phone || plot.agent?.whatsapp) && (
            <View style={[styles.agentRow, { borderTopColor: t.line }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.inkMuted, fontSize: 10.5, fontFamily: fontFor(lang, "body") }}>{tr("Contact Agent")}</Text>
                {!!plot.agent?.name && (
                  <Text style={{ color: t.ink, fontSize: 12.5, fontFamily: fontFor(lang, "bodySemiBold"), marginTop: 1 }}>{plot.agent.name}</Text>
                )}
              </View>
              <View style={styles.agentBtns}>
                {!!plot.agent?.phone && (
                  <Pressable
                    onPress={() => Linking.openURL(`tel:${plot.agent!.phone}`)}
                    accessibilityLabel={tr("Call")}
                    style={[styles.agentBtn, { backgroundColor: t.ink }]}
                  >
                    <Icon name="phone" size={15} color={t.canvas} />
                  </Pressable>
                )}
                {!!plot.agent?.whatsapp && (
                  <Pressable
                    onPress={() => Linking.openURL(`https://wa.me/${plot.agent!.whatsapp}`)}
                    accessibilityLabel={tr("WhatsApp")}
                    style={[styles.agentBtn, { backgroundColor: t.good }]}
                  >
                    <Icon name="whatsapp" size={15} color="#fff" />
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

function Row({
  t,
  lang,
  label,
  value,
  mono,
}: {
  t: ReturnType<typeof useTheme>;
  lang: "en" | "ur";
  label: string;
  value: string;
  mono?: boolean;
}) {
  const { t: tr } = useLanguage();
  return (
    <View style={[styles.row, { borderTopColor: t.line }]}>
      <Text style={{ color: t.inkMuted, fontSize: 12.5, fontFamily: fontFor(lang, "body"), flexShrink: 0, marginRight: 10 }}>
        {tr(label)}
      </Text>
      <Text
        style={{
          color: t.ink,
          fontSize: 12.5,
          fontFamily: mono ? fontFor(lang, "mono") : fontFor(lang, "body"),
          textAlign: "right",
          flexShrink: 1,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 2 },
  saveBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  matchBadge: { alignSelf: "flex-start", borderRadius: 20, paddingVertical: 3, paddingHorizontal: 9, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1 },
  legalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderTopWidth: 1 },
  legalPill: { borderRadius: 20, paddingVertical: 3, paddingHorizontal: 9, maxWidth: "62%" },
  agentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, marginTop: 2 },
  agentBtns: { flexDirection: "row", gap: 8 },
  agentBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
