import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import { Icon, IconName } from "./Icon";

// Ported from .empty/.oi-lg in prototype/index.html.
export function EmptyState({ iconName, title, body }: { iconName: IconName; title: string; body: string }) {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: t.surface2 }]}>
        <Icon name={iconName} size={24} color={t.inkFaint} />
      </View>
      <Text style={{ color: t.ink, fontSize: 15, fontFamily: fontFor(lang, "display"), textAlign: "center" }}>{tr(title)}</Text>
      <Text style={{ color: t.inkMuted, fontSize: 12.5, fontFamily: fontFor(lang, "body"), textAlign: "center", maxWidth: 220 }}>
        {tr(body)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 30 },
  iconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
});
