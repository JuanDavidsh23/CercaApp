import { Text, View } from "react-native";

/**
 * Search screen — main entry point for discovering services.
 * Full implementation in Phase 4.
 */
export default function SearchScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">Discover Services</Text>
      <Text className="mt-2 text-center text-secondary">
        Find local services near you
      </Text>

      {/* Placeholder — search, filters, map, and results in Phase 4 */}
      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <Text className="text-center text-tertiary">
          Search, filters, and results coming in Phase 4
        </Text>
      </View>
    </View>
  );
}
