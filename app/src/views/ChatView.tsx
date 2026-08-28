import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BUDGET_STEP, SCALE_BY_TYPE, STEP1, VIBE_BY_TYPE } from "../data/conversation";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import { tResultsIntro } from "../i18n/translations";
import { Bubble } from "../components/Bubble";
import { OptionGrid } from "../components/OptionGrid";
import { PlotCard } from "../components/PlotCard";
import { ChatItem, useAppState } from "../state/useAppState";

type Props = ReturnType<typeof useAppState>;

export function ChatView({ chat, onPurpose, onScale, onBudget, onVibe, isSaved, toggleSave }: Props) {
  const t = useTheme();
  const { lang, t: tr } = useLanguage();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent}>
        {chat.map((item) => (
          <ChatItemView
            key={item.id}
            item={item}
            onPurpose={onPurpose}
            onScale={onScale}
            onBudget={onBudget}
            onVibe={onVibe}
            isSaved={isSaved}
            toggleSave={toggleSave}
          />
        ))}
      </ScrollView>
      <View style={[styles.footerNote, { borderTopColor: t.line, backgroundColor: t.surface }]}>
        <Text style={{ color: t.inkFaint, fontSize: 10, fontFamily: fontFor(lang, "body"), textAlign: "center" }}>
          {tr("PLOTIQ Advisor · matches scored against Islamabad plot data")}
        </Text>
      </View>
    </View>
  );
}

function ChatItemView({
  item,
  onPurpose,
  onScale,
  onBudget,
  onVibe,
  isSaved,
  toggleSave,
}: {
  item: ChatItem;
} & Pick<Props, "onPurpose" | "onScale" | "onBudget" | "onVibe" | "isSaved" | "toggleSave">) {
  const { lang, t: tr } = useLanguage();

  switch (item.kind) {
    case "bubble":
      return <Bubble who={item.who} text={item.text} />;
    case "purposeOptions":
      return <OptionGrid options={STEP1.options} onPick={(i) => onPurpose(STEP1.options[i])} />;
    case "scaleOptions":
      return <OptionGrid options={SCALE_BY_TYPE[item.purpose].options} levels onPick={(i) => onScale(SCALE_BY_TYPE[item.purpose].options[i])} />;
    case "budgetOptions":
      return <OptionGrid options={BUDGET_STEP.options} levels onPick={(i) => onBudget(BUDGET_STEP.options[i])} />;
    case "vibeOptions":
      return <OptionGrid options={VIBE_BY_TYPE[item.purpose]} onPick={(i) => onVibe(VIBE_BY_TYPE[item.purpose][i])} />;
    case "recommending":
      return <Bubble who="bot" text="Crunching that against Islamabad land data..." />;
    case "noResults":
      return <Bubble who="bot" text="I couldn't find a plot matching all your criteria — try a higher budget or a different vibe." />;
    case "results":
      return (
        <>
          <Bubble who="bot" text={tResultsIntro(lang, tr(item.typeLabel), item.scaleRange[0], item.scaleRange[1])} />
          {item.matches.map((m, i) => (
            <PlotCard
              key={m.plot.id}
              match={m}
              badgeLabel={i === 0 ? tr("Top Match") : `${tr("Match")} ${i + 1}`}
              saved={isSaved(m.plot.id)}
              onToggleSave={() => toggleSave(m.plot.id, m.bestSize)}
            />
          ))}
        </>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  chat: { flex: 1 },
  chatContent: { padding: 14, paddingTop: 16, gap: 10 },
  footerNote: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
});
