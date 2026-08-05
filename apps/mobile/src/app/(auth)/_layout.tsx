import { Stack } from "expo-router";

/**
 * Auth layout — wraps sign-in and sign-up screens.
 * In Phase 3, this will redirect authenticated users away.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Cerca",
        headerBackVisible: true,
      }}
    />
  );
}
