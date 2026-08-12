import "../global.css";
import "@/presentation/i18n";

import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SessionProvider } from "@/presentation/session/SessionProvider";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden during Expo Go reloads.
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  // Instancia única de TanStack Query Client para gestionar el estado del servidor
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos de almacenamiento en caché
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => {
      // Ignore splash races during Fast Refresh.
    });
  }, []);

  return (
    <View style={styles.root}>
      <QueryClientProvider client={queryClient}>
        {/* SessionProvider va DENTRO del QueryClientProvider porque la sesión
            se carga con una query (GET /me) como cualquier otro dato del servidor. */}
        <SessionProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, title: t("common.brand") }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
              <Stack.Screen name="(provider)" />
            </Stack>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
