import { Link } from "expo-router";
import { Text, View } from "react-native";

/**
 * My Listings screen — shows provider's own listings.
 * Full implementation in Phase 6.
 */
export default function MyListingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">My Listings</Text>
      <Text className="mt-2 text-secondary">Manage your services</Text>

      {/* Placeholder — listing cards + status in Phase 6 */}
      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <Text className="text-center text-tertiary">
          Your listings will appear here in Phase 6
        </Text>
      </View>

      <Link href="/(provider)/listings/new" className="mt-6">
        <Text className="text-brand font-semibold">+ Create new listing</Text>
      </Link>
    </View>
  );
}
