import { Stack } from "expo-router";

/**
 * Provider layout — area for service providers to manage listings.
 * In Phase 3, this will enforce provider capacity.
 */
export default function ProviderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Provider Dashboard",
      }}
    />
  );
}
