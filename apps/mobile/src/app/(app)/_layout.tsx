import { Stack } from "expo-router";

/**
 * App layout — main authenticated area.
 * In Phase 3, this will enforce authentication.
 */
export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Cerca",
      }}
    />
  );
}
