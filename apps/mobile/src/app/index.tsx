import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * Root index — redirects to the search screen by default.
 */
export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/search");
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <ActivityIndicator color="#6366f1" />
    </View>
  );
}
