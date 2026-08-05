import { Text, View } from "react-native";

/**
 * New Listing screen — 4-step form for creating a service listing.
 * Full implementation in Phase 6.
 */
export default function NewListingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">Create Listing</Text>
      <Text className="mt-2 text-secondary">Publish a new service</Text>

      {/* Placeholder — 4-step wizard in Phase 6 */}
      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <View className="flex-row justify-between">
          <Text className="text-xs text-status-draft">1. Info</Text>
          <Text className="text-xs text-tertiary">2. Category</Text>
          <Text className="text-xs text-tertiary">3. Pricing</Text>
          <Text className="text-xs text-tertiary">4. Photos</Text>
        </View>
        <Text className="mt-4 text-center text-tertiary">
          Multi-step form coming in Phase 6
        </Text>
      </View>
    </View>
  );
}
