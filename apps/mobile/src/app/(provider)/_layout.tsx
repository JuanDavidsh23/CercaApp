import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { can } from "@cerca/contract";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Área de proveedor.
 */
export default function ProviderLayout() {
  const { t } = useTranslation();
  const { actor, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (actor === null) {
      router.replace("/sign-in");
    } else if (!can(actor, "listing:create")) {
      router.replace("/search");
    }
  }, [actor, isLoading, router]);

  if (isLoading || actor === null || !can(actor, "listing:create")) {
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
        headerTitle: t("provider.title"),
      }}
    />
  );
}
