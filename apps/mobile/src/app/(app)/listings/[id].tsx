import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

/**
 * Listing detail screen — supports deep linking via cerca://listing/:id
 * Full implementation in Phase 5.
 */
export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">Listing Detail</Text>
      <Text className="mt-2 text-secondary">ID: {id}</Text>

      {/* Placeholder — photos, pricing, reviews, booking in Phase 5 */}
      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <Text className="text-center text-tertiary">
          Full detail view coming in Phase 5
        </Text>
      </View>
    </View>
  );
}
