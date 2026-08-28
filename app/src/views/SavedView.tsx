import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PLOTS } from "../data/plots";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import { tSavedCount } from "../i18n/translations";
import { PlotCard } from "../components/PlotCard";
import { useAppState } from "../state/useAppState";
import { EmptyState } from "../components/EmptyState";

type Props = Pick<ReturnType<typeof useAppState>, "savedPlots" | "isSaved" | "toggleSave">;

// Ported from renderSavedView() in prototype/index.html.
export function SavedView({ savedPlots, isSaved, toggleSave }: Props) {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  const rtl = lang === "ur";

  if (savedPlots.length === 0) {
    return (
      <EmptyState
        iconName="bookmark"
        title="No saved plots yet"
        body="Bookmark a match from the land finder and it'll show up here."
      />
    );
  }

  const list = [...savedPlots].reverse();

  return (
    <ScrollView contentContainerStyle={styles.list}>
      <View style={styles.header}>
        <Text style={{ color: t.ink, fontSize: 18, fontFamily: fontFor(lang, "display"), textAlign: rtl ? "right" : "left" }}>
          {tr("Saved plots")}
        </Text>
        <Text style={{ color: t.inkMuted, fontSize: 11.5, fontFamily: fontFor(lang, "body"), marginTop: 3, textAlign: rtl ? "right" : "left" }}>
          {tSavedCount(lang, list.length)}
        </Text>
      </View>
      {list.map((s) => {
        const plot = PLOTS.find((p) => p.id === s.plotId);
        if (!plot) return null;
        return (
          <PlotCard
            key={s.plotId}
            match={{ plot, bestSize: s.size, score: 0, reasons: [] }}
            saved={isSaved(s.plotId)}
            onToggleSave={() => toggleSave(s.plotId, s.size)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 14, paddingTop: 16, gap: 10 },
  header: { paddingHorizontal: 2, paddingBottom: 4 },
});
