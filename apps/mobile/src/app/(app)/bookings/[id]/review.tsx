import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { canWriteReview } from "@/application/review/can-write-review";
import { Button } from "@/presentation/components/ui/Button";
import { useBooking } from "@/presentation/hooks/useBookings";
import { useWriteReview } from "@/presentation/hooks/useReviews";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { useSession } from "@/presentation/session/SessionProvider";

const STARS = [1, 2, 3, 4, 5] as const;

export default function BookingReviewScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  // El id viene de la ruta /(app)/bookings/[id]/review, así que siempre está presente.
  const { id: bookingId } = useLocalSearchParams<{ id: string }>();

  const { actor } = useSession();
  const toErrorMessage = useApiErrorMessage();

  const bookingQuery = useBooking(bookingId);
  const writeReview = useWriteReview(bookingId);

  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (bookingQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (bookingQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface px-6">
        <Text className="text-error text-center">
          {toErrorMessage(bookingQuery.error)}
        </Text>
      </SafeAreaView>
    );
  }

  const booking = bookingQuery.data;

  /**
   * Las cuatro condiciones de `canReviewBooking`, la "función estrella" del
   * contrato: fue tu reserva, está completada, no la reseñaste ya y no han
   * pasado 30 días. Devuelve el MOTIVO, no un sí/no, y ese motivo es el que
   * se le enseña al usuario.
   */
  const eligibility = actor === null ? null : canWriteReview(actor, booking, new Date());

  const handleSubmit = async (): Promise<void> => {
    if (body.trim().length === 0) {
      setErrorMessage(t("reviews.errors.emptyBody"));
      return;
    }

    setErrorMessage(null);

    try {
      await writeReview.mutateAsync({ rating, body: body.trim() });
      router.back();
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-primary mb-2">{t("reviews.title")}</Text>
        <Text className="text-secondary mb-8">{t("reviews.subtitle")}</Text>

        {eligibility !== null && !eligibility.ok ? (
          // No se puede reseñar: se explica por qué en vez de dejar un formulario inútil.
          <View className="bg-surface-alt border border-default rounded-2xl p-6">
            <Text className="text-secondary text-center">
              {t(`errors.reason.${eligibility.reason}`)}
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-sm font-medium text-primary mb-2">
              {t("reviews.ratingLabel")}
            </Text>

            <View className="flex-row mb-6">
              {STARS.map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => {
                    setRating(value);
                  }}
                  className="p-2"
                  accessibilityRole="button"
                  accessibilityLabel={t("reviews.starLabel", { count: value })}
                  accessibilityState={{ selected: rating === value }}
                >
                  <Star
                    size={32}
                    color="#fbbf24"
                    fill={value <= rating ? "#fbbf24" : "transparent"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm font-medium text-primary mb-1.5">
              {t("reviews.bodyLabel")}
            </Text>
            <TextInput
              className="bg-surface border border-default rounded-2xl p-4 text-primary min-h-[120px]"
              placeholder={t("reviews.bodyPlaceholder")}
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              maxLength={2000}
              value={body}
              onChangeText={setBody}
              accessibilityLabel={t("reviews.bodyLabel")}
            />

            {errorMessage !== null ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mt-4">
                <Text className="text-red-700 text-xs font-semibold text-center leading-5">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <View className="mt-6">
              <Button
                label={t("reviews.submit")}
                isLoading={writeReview.isPending}
                onPress={() => void handleSubmit()}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
