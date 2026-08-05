import { Link } from "expo-router";
import { Text, View } from "react-native";

/**
 * Sign Up screen — placeholder for Phase 3.
 */
export default function SignUpScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">Sign Up</Text>
      <Text className="mt-2 text-secondary">Create your Cerca account</Text>

      {/* Placeholder — form will be added in Phase 3 */}
      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <Text className="text-center text-tertiary">
          Registration form coming in Phase 3
        </Text>
      </View>

      <Link href="/(auth)/sign-in" className="mt-6">
        <Text className="text-brand">Already have an account? Sign in</Text>
      </Link>
    </View>
  );
}
