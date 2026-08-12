import { Redirect, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Pantallas de entrada (iniciar sesión / registro).
 * Si ya hay sesión no tiene sentido mostrarlas: vamos directo a la búsqueda.
 */
export default function AuthLayout() {
  const { t } = useTranslation();
  const { actor, isLoading } = useSession();

  if (!isLoading && actor !== null) {
    return <Redirect href="/(app)/search" />;
  }

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
