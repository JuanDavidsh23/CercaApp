import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

/**
 * Auth layout — wraps sign-in and sign-up screens.
 * In Phase 3, this will redirect authenticated users away.
 */
export default function AuthLayout() {
  const { t } = useTranslation();

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
