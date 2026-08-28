import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useFonts as useFraunces, Fraunces_600SemiBold, Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import {
  useFonts as useIBMPlexSans,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from "@expo-google-fonts/ibm-plex-sans";
import {
  useFonts as useIBMPlexMono,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from "@expo-google-fonts/ibm-plex-mono";
import { useFonts as useNotoNastaliqUrdu, NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from "@expo-google-fonts/noto-nastaliq-urdu";

import { useTheme } from "./src/theme/useTheme";
import { AppShell } from "./src/components/AppShell";
import { WebPhoneFrame } from "./src/components/WebPhoneFrame";
import { ChatView } from "./src/views/ChatView";
import { SavedView } from "./src/views/SavedView";
import { InsightsView } from "./src/views/InsightsView";
import { CompareView } from "./src/views/CompareView";
import { useAppState } from "./src/state/useAppState";
import { LanguageProvider } from "./src/i18n/LanguageContext";

function AppInner() {
  const [frauncesLoaded] = useFraunces({ Fraunces_600SemiBold, Fraunces_700Bold });
  const [sansLoaded] = useIBMPlexSans({ IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold });
  const [monoLoaded] = useIBMPlexMono({ IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold });
  const [urduLoaded] = useNotoNastaliqUrdu({ NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold });
  const fontsLoaded = frauncesLoaded && sansLoaded && monoLoaded && urduLoaded;

  const theme = useTheme();
  const state = useAppState();

  useEffect(() => {
    if (fontsLoaded) state.startChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <WebPhoneFrame>
        <View style={{ flex: 1, backgroundColor: theme.canvas }} />
      </WebPhoneFrame>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <WebPhoneFrame>
        <AppShell {...state}>
          {state.currentView === "chat" && <ChatView {...state} />}
          {state.currentView === "saved" && <SavedView {...state} />}
          {state.currentView === "insights" && <InsightsView />}
          {state.currentView === "compare" && <CompareView {...state} />}
        </AppShell>
      </WebPhoneFrame>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
