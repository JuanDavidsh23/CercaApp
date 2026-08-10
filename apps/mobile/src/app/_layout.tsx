import "../global.css";
import "@/presentation/i18n";

import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { useTranslation } from "react-i18next";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden during Expo Go reloads.
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  useEffect(() => {
    // Phase 3: wait for auth/session bootstrap before hiding.
    void SplashScreen.hideAsync().catch(() => {
      // Ignore splash races during Fast Refresh.
    });
  }, []);

  return (
    <View style={styles.root}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, title: t("common.brand") }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(provider)" />
        </Stack>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
