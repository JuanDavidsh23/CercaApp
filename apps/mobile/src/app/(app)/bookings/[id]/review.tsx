import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

/**
 * Review screen for a completed booking.
 * Full implementation in Phase 7.
 */
export default function BookingReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">Write a Review</Text>
      <Text className="mt-2 text-secondary">Booking: {id}</Text>

      {/* Placeholder — rating, comment, eligibility check in Phase 7 */}
      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <Text className="text-center text-tertiary">Review form coming in Phase 7</Text>
      </View>
    </View>
  );
}
