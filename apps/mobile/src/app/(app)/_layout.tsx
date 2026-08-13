import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Área con sesión iniciada.
 */
export default function AppLayout() {
  const { t } = useTranslation();
  const { actor, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && actor === null) {
      router.replace("/sign-in");
    }
  }, [actor, isLoading, router]);

  if (isLoading || actor === null) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: t("common.brand"),
      }}
    />
  );
}
