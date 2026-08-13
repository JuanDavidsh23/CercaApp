import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Pantallas de entrada (iniciar sesión / registro).
 */
export default function AuthLayout() {
  const { t } = useTranslation();
  const { actor, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && actor !== null) {
      router.replace("/search");
    }
  }, [actor, isLoading, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: t("common.brand"),
        headerBackVisible: true,
      }}
    />
  );
}
