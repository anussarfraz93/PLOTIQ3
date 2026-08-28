import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fontFor } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import { API_BASE } from "../lib/api";
import { Icon } from "./Icon";
import { useAppState, ViewName } from "../state/useAppState";

type Props = ReturnType<typeof useAppState> & { children: React.ReactNode };

const RAIL_ITEMS: { view: ViewName; icon: Parameters<typeof Icon>[0]["name"]; label: string }[] = [
  { view: "chat", icon: "search", label: "Land Finder" },
  { view: "saved", icon: "bookmark", label: "Saved Plots" },
  { view: "insights", icon: "chart", label: "Market Insights" },
  { view: "compare", icon: "layers", label: "Compare Plots" },
];

// Ported from the app-shell in prototype/index.html: topbar (brand only —
// the header hamburger was removed earlier in the project), left icon rail,
// bottom Back/Home/Menu bar, right slide-in drawer, toast. No phone-frame
// chrome here — that was only presentational for the browser artifact; a
// real app IS the screen.
export function AppShell(props: Props) {
  const t = useTheme();
  const { lang, setLang, t: tr } = useLanguage();
  const {
    children,
    currentView,
    setView,
    savedPlots,
    drawerOpen,
    setDrawerOpen,
    backDisabled,
    goBack,
    goHome,
    startChat,
    quickStart,
    toast,
  } = props;

  return (
    <View style={[styles.root, { backgroundColor: t.canvas }]}>
      {/* Topbar */}
      <View style={[styles.topbar, { backgroundColor: t.surface, borderBottomColor: t.line }]}>
        <View style={styles.brand}>
          <View style={[styles.mark, { backgroundColor: t.ink }]}>
            <Icon name="compass" size={17} color={t.canvas} />
          </View>
          <View>
            <Text style={{ color: t.ink, fontSize: 19, fontWeight: "600", fontFamily: fontFor(lang, "display") }}>PLOTIQ</Text>
            <Text style={{ color: t.inkMuted, fontSize: 10.5, letterSpacing: 0.3, fontFamily: fontFor(lang, "body"), marginTop: 3 }}>
              {tr("LAND INTELLIGENCE · ISLAMABAD")}
            </Text>
          </View>
        </View>
      </View>

      {/* Body: rail + main */}
      <View style={styles.bodyRow}>
        <View style={[styles.rail, { backgroundColor: t.surface, borderRightColor: t.line }]}>
          {RAIL_ITEMS.map((item) => {
            const active = currentView === item.view;
            return (
              <Pressable
                key={item.view}
                onPress={() => setView(item.view)}
                accessibilityLabel={tr(item.label)}
                style={[styles.railBtn, active && { backgroundColor: t.ink }]}
              >
                <Icon name={item.icon} size={20} color={active ? t.canvas : t.inkMuted} />
                {item.view === "saved" && savedPlots.length > 0 && (
                  <View style={[styles.badge, { backgroundColor: t.accent }]}>
                    <Text style={{ color: t.accentInk, fontSize: 9.5, fontWeight: "700", fontFamily: fontFor(lang, "mono") }}>
                      {savedPlots.length}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.main}>{children}</View>
      </View>

      {/* Bottombar */}
      <View style={[styles.bottombar, { backgroundColor: t.surface, borderTopColor: t.line }]}>
        <Pressable
          onPress={goBack}
          disabled={backDisabled}
          accessibilityLabel={tr("Back")}
          style={[styles.bottombarBtn, backDisabled && styles.disabled]}
        >
          <Icon name="arrowLeft" size={21} color={t.inkMuted} />
        </Pressable>
        <Pressable onPress={goHome} accessibilityLabel={tr("Home")} style={styles.bottombarBtn}>
          <Icon name="house" size={21} color={t.inkMuted} />
        </Pressable>
        <Pressable onPress={() => setDrawerOpen(true)} accessibilityLabel={tr("Menu")} style={styles.bottombarBtn}>
          <Icon name="menu" size={21} color={t.inkMuted} />
        </Pressable>
      </View>

      {/* Drawer overlay */}
      {drawerOpen && (
        <Pressable style={styles.overlay} onPress={() => setDrawerOpen(false)}>
          <Pressable style={[styles.drawer, { backgroundColor: t.surface }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.drawerHead, { borderBottomColor: t.line }]}>
              <View>
                <Text style={{ color: t.ink, fontSize: 17, fontFamily: fontFor(lang, "display") }}>{tr("Menu")}</Text>
                <Text style={{ color: t.inkMuted, fontSize: 11, fontFamily: fontFor(lang, "body"), marginTop: 3 }}>
                  {tr("Everything PLOTIQ can do")}
                </Text>
              </View>
              <Pressable
                onPress={() => setDrawerOpen(false)}
                accessibilityLabel={tr("Close menu")}
                style={[styles.iconBtn, { borderColor: t.line, backgroundColor: t.surface }]}
              >
                <Icon name="close" size={18} color={t.ink} />
              </Pressable>
            </View>

            {/* Language toggle */}
            <View style={[styles.langRow, { borderBottomColor: t.line }]}>
              <Pressable
                onPress={() => setLang("en")}
                style={[styles.langBtn, { borderColor: t.line }, lang === "en" && { backgroundColor: t.ink, borderColor: t.ink }]}
              >
                <Text style={{ fontSize: 12.5, fontWeight: "600", fontFamily: "IBMPlexSans_600SemiBold", color: lang === "en" ? t.canvas : t.ink }}>
                  English
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLang("ur")}
                style={[styles.langBtn, { borderColor: t.line }, lang === "ur" && { backgroundColor: t.ink, borderColor: t.ink }]}
              >
                <Text
                  style={{
                    fontSize: 13.5,
                    fontWeight: "600",
                    fontFamily: fontFor("ur", "bodySemiBold"),
                    color: lang === "ur" ? t.canvas : t.ink,
                  }}
                >
                  اردو
                </Text>
              </Pressable>
            </View>

            <ScrollView style={styles.drawerNav}>
              <DrawerItem lang={lang} t={t} icon="search" label="New search" onPress={() => { setView("chat"); startChat(); }} />
              <DrawerItem lang={lang} t={t} icon="bookmark" label="Saved plots" count={savedPlots.length} onPress={() => setView("saved")} />
              <DrawerItem lang={lang} t={t} icon="chart" label="Market insights" onPress={() => setView("insights")} />
              <DrawerItem lang={lang} t={t} icon="layers" label="Compare plots" onPress={() => setView("compare")} />
              <View style={[styles.divider, { backgroundColor: t.line }]} />
              <DrawerItem lang={lang} t={t} icon="house" label="Find land for a house" onPress={() => quickStart("residential", "family")} />
              <DrawerItem lang={lang} t={t} icon="factory" label="Find land for a factory" onPress={() => quickStart("industrial")} />
              <DrawerItem lang={lang} t={t} icon="shop" label="Find land for a shop" onPress={() => quickStart("commercial")} />
              <DrawerItem lang={lang} t={t} icon="tree" label="Find land for a farmhouse" onPress={() => quickStart("farmhouse")} />
              <View style={[styles.divider, { backgroundColor: t.line }]} />
              <DrawerItem
                lang={lang}
                t={t}
                icon="settings"
                label="Admin Panel"
                onPress={() => {
                  setDrawerOpen(false);
                  Linking.openURL(`${API_BASE}/admin.html`);
                }}
              />
            </ScrollView>

            <View style={[styles.drawerFoot, { borderTopColor: t.line }]}>
              <Text style={{ color: t.inkFaint, fontSize: 10.5, fontFamily: fontFor(lang, "body") }}>{tr("PLOTIQ · rule-based demo logic")}</Text>
            </View>
          </Pressable>
        </Pressable>
      )}

      {/* Toast */}
      {toast && (
        <View pointerEvents="none" style={styles.toastLayer}>
          <View style={[styles.toast, { backgroundColor: t.ink }]}>
            <Text style={{ color: t.canvas, fontSize: 12, fontWeight: "500", fontFamily: fontFor(lang, "bodyMedium") }}>{tr(toast)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function DrawerItem({
  t,
  lang,
  icon,
  label,
  count,
  onPress,
}: {
  t: ReturnType<typeof useTheme>;
  lang: "en" | "ur";
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  count?: number;
  onPress: () => void;
}) {
  const { t: tr } = useLanguage();
  return (
    <Pressable onPress={onPress} style={styles.drawerItem}>
      <View style={[styles.drawerItemIcon, { backgroundColor: t.surface2 }]}>
        <Icon name={icon} size={15} color={t.inkMuted} />
      </View>
      <Text style={{ color: t.ink, fontSize: 13.5, fontWeight: "500", fontFamily: fontFor(lang, "bodyMedium"), flex: 1 }}>
        {tr(label)}
      </Text>
      {!!count && (
        <View style={[styles.drawerBadge, { backgroundColor: t.accentSoft }]}>
          <Text style={{ color: t.accentStrong, fontSize: 10, fontWeight: "700", fontFamily: fontFor(lang, "mono") }}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1 },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  mark: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  bodyRow: { flex: 1, flexDirection: "row", minHeight: 0 },
  rail: { width: 58, alignItems: "center", paddingVertical: 14, gap: 6, borderRightWidth: 1 },
  railBtn: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: -2, right: -2, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  main: { flex: 1, minWidth: 0 },
  bottombar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 10, borderTopWidth: 1 },
  bottombarBtn: { width: 46, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  disabled: { opacity: 0.35 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(8,12,22,0.45)", zIndex: 40 },
  drawer: { position: "absolute", top: 0, right: 0, bottom: 0, width: "76%", maxWidth: 280 },
  drawerHead: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 14, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  iconBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  langRow: { flexDirection: "row", gap: 8, padding: 10, borderBottomWidth: 1 },
  langBtn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 8, alignItems: "center", justifyContent: "center" },
  drawerNav: { flex: 1, padding: 10 },
  drawerItem: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 11, paddingHorizontal: 10, borderRadius: 10 },
  drawerItemIcon: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  drawerBadge: { borderRadius: 10, paddingVertical: 2, paddingHorizontal: 7 },
  divider: { height: 1, marginVertical: 8, marginHorizontal: 4 },
  drawerFoot: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 18, borderTopWidth: 1 },
  toastLayer: { position: "absolute", left: 0, right: 0, bottom: 18, alignItems: "center", zIndex: 60 },
  toast: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 20, maxWidth: "84%" },
});
