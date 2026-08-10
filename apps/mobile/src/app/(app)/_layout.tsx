import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

/**
 * App layout — main authenticated area.
 * In Phase 3, this will enforce authentication.
 */
export default function AppLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: t("common.brand"),
      }}
    />
  );
}
