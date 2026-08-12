import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Área con sesión iniciada.
 *
 * Mientras la sesión carga no decidimos nada: si redirigiéramos antes de saber
 * si hay sesión, echaríamos fuera a un usuario que sí está dentro.
 */
export default function AppLayout() {
  const { t } = useTranslation();
  const { actor, isLoading } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#6366f1" />
      </View>
    );
  }

  if (actor === null) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: t("common.brand"),
      }}
    />
  );
}
