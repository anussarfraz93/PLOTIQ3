import React from "react";
import { Platform, StyleSheet, View } from "react-native";

// Web-only presentation: when PLOTIQ is opened in an ordinary desktop
// browser (npx expo start --web), wrap it in a phone-bezel mockup so it
// reads as "a screenshot of an app" instead of "a website filling the
// browser window" — exactly the framing used throughout this project's
// design mockups. On a real device (Platform.OS !== 'web') this renders
// nothing extra: the physical phone is already the frame, and adding a
// fake one there would just be a second bezel around the real one.
export function WebPhoneFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") return <>{children}</>;

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05070a",
    padding: 24,
  },
  phone: {
    width: 390,
    height: 844,
    maxHeight: "95%",
    backgroundColor: "#000",
    borderRadius: 40,
    padding: 8,
    boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
  },
  notch: {
    position: "absolute",
    top: 8,
    left: "50%",
    marginLeft: -65,
    width: 130,
    height: 26,
    backgroundColor: "#000",
    borderRadius: 14,
    zIndex: 2,
  },
  screen: {
    flex: 1,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});
