import { Link } from "expo-router";
import { Text, View } from "react-native";

/**
 * Sign In screen — placeholder for Phase 3.
 */
export default function SignInScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">Sign In</Text>
      <Text className="mt-2 text-secondary">Welcome back to Cerca</Text>

      {/* Placeholder — form will be added in Phase 3 */}
      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <Text className="text-center text-tertiary">
          Authentication form coming in Phase 3
        </Text>
      </View>

      <Link href="/(auth)/sign-up" className="mt-6">
        <Text className="text-brand">Don&apos;t have an account? Sign up</Text>
      </Link>
    </View>
  );
}
