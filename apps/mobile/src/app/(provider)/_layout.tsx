import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { can } from "@cerca/contract";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Área de proveedor.
 *
 * Se pide la capacidad `listing:create` con la MISMA matriz de permisos que usa el
 * backend (@cerca/contract). Esconder la pantalla es solo comodidad: si alguien
 * llegara igualmente, la API rechazaría cada petición por su cuenta.
 */
export default function ProviderLayout() {
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

  if (!can(actor, "listing:create")) {
    return <Redirect href="/(app)/search" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: t("provider.title"),
      }}
    />
  );
}
