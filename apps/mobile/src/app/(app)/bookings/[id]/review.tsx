import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Star, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { canWriteReview } from "@/application/review/can-write-review";
import { Button } from "@/presentation/components/ui/Button";
import { useBooking } from "@/presentation/hooks/useBookings";
import { useListingDetail } from "@/presentation/hooks/useListings";
import { useWriteReview } from "@/presentation/hooks/useReviews";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { useSession } from "@/presentation/session/SessionProvider";
import { getServiceImageUrl } from "@/presentation/lib/serviceImages";

const STARS = [1, 2, 3, 4, 5] as const;

export default function BookingReviewScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id: bookingId } = useLocalSearchParams<{ id: string }>();

  const { actor } = useSession();
  const toErrorMessage = useApiErrorMessage();

  const bookingQuery = useBooking(bookingId);
  const writeReview = useWriteReview(bookingId);

  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const listingQuery = useListingDetail(bookingQuery.data?.listingId ?? "");

  if (bookingQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#6366f1" size="large" />
      </SafeAreaView>
    );
  }

  if (bookingQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface px-6">
        <Text className="text-error text-center font-medium">
          {toErrorMessage(bookingQuery.error)}
        </Text>
      </SafeAreaView>
    );
  }

  const booking = bookingQuery.data;
  const listingTitle = listingQuery.data?.title ?? t("common.loading");
  const imageUrl = getServiceImageUrl(listingTitle);

  /**
   * Las cuatro condiciones de `canReviewBooking` del contrato:
   * fue tu reserva, está completada, no la reseñaste ya y no han pasado 30 días.
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
      {/* Top Header Bar */}
      <View className="flex-row items-center px-6 py-4 border-b border-default bg-surface">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center p-2 -ml-2"
          accessibilityLabel={t("listings.detail.back")}
        >
          <ArrowLeft size={20} color="#0f172a" />
          <Text className="text-sm font-semibold text-primary ml-1">
            {t("listings.detail.back")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-primary mb-1">{t("reviews.title")}</Text>
        <Text className="text-secondary text-sm mb-6">{t("reviews.subtitle")}</Text>

        {/* Tarjeta Visual de Previsualización del Servicio */}
        <View className="bg-surface-alt rounded-2xl p-3.5 mb-6 border border-default flex-row items-center">
          <View className="w-14 h-14 rounded-xl bg-surface border border-default overflow-hidden mr-3 items-center justify-center">
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-brand uppercase tracking-wider mb-0.5">
              Servicio contratado
            </Text>
            <Text className="text-primary font-bold text-sm" numberOfLines={1}>
              {listingTitle}
            </Text>
          </View>
        </View>

        {eligibility !== null && !eligibility.ok ? (
          <View className="bg-surface-alt border border-default rounded-2xl p-6 items-center">
            <Sparkles size={24} color="#94a3b8" className="mb-2" />
            <Text className="text-secondary text-center text-sm font-medium">
              {t(`errors.reason.${eligibility.reason}`)}
            </Text>
          </View>
        ) : (
          <>
            {/* Selector de Estrellas con Etiqueta Descriptiva */}
            <View className="bg-surface-alt rounded-2xl p-5 mb-6 border border-default items-center">
              <Text className="text-sm font-bold text-primary mb-3">
                {t("reviews.ratingLabel")}
              </Text>

              <View className="flex-row items-center justify-center mb-2">
                {STARS.map((value) => (
                  <TouchableOpacity
                    key={value}
                    activeOpacity={0.7}
                    onPress={() => setRating(value)}
                    className="p-1.5"
                    accessibilityRole="button"
                    accessibilityLabel={t("reviews.starLabel", { count: value })}
                    accessibilityState={{ selected: rating === value }}
                  >
                    <Star
                      size={36}
                      color="#f59e0b"
                      fill={value <= rating ? "#f59e0b" : "transparent"}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View className="bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-full mt-1">
                <Text className="text-amber-900 font-bold text-xs">
                  {t(`reviews.ratingWord.${rating}`)}
                </Text>
              </View>
            </View>

            {/* Campo de Texto para la Reseña */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-bold text-primary">
                  {t("reviews.bodyLabel")}
                </Text>
                <Text className="text-xs font-semibold text-tertiary">
                  {body.length}/2000
                </Text>
              </View>

              <TextInput
                className="bg-surface border border-default rounded-2xl p-4 text-primary text-sm min-h-[140px]"
                placeholder={t("reviews.bodyPlaceholder")}
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
                maxLength={2000}
                value={body}
                onChangeText={setBody}
                accessibilityLabel={t("reviews.bodyLabel")}
              />
            </View>

            {errorMessage !== null ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4">
                <Text className="text-red-700 text-xs font-semibold text-center leading-5">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <Button
              label={t("reviews.submit")}
              isLoading={writeReview.isPending}
              onPress={() => void handleSubmit()}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
