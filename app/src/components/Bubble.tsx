import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";

// Ported from .bubble/.bot/.user in prototype/index.html.
export function Bubble({ who, text }: { who: "bot" | "user"; text: string }) {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  const isBot = who === "bot";
  return (
    <View
      style={[
        styles.bubble,
        isBot
          ? { alignSelf: "flex-start", backgroundColor: t.surface, borderWidth: 1, borderColor: t.line, borderBottomLeftRadius: 4 }
          : { alignSelf: "flex-end", backgroundColor: t.ink, borderBottomRightRadius: 4 },
      ]}
    >
      <Text
        style={{
          color: isBot ? t.ink : t.canvas,
          fontSize: 13.5,
          lineHeight: 19,
          fontFamily: fontFor(lang, isBot ? "body" : "bodySemiBold"),
          writingDirection: lang === "ur" ? "rtl" : "ltr",
          textAlign: lang === "ur" ? "right" : "left",
        }}
      >
        {tr(text)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: "84%", paddingVertical: 11, paddingHorizontal: 14, borderRadius: 16 },
});
