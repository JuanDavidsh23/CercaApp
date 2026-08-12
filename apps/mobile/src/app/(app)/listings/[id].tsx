import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Star } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { canBookListing } from "@/application/listing/can-book-listing";
import { localeForLanguage } from "@/presentation/i18n";
import { Button } from "@/presentation/components/ui/Button";
import { useListingDetail } from "@/presentation/hooks/useListings";
import { useListingReviews } from "@/presentation/hooks/useReviews";
import { useCreateBooking } from "@/presentation/hooks/useBookings";
import { usePricingLabel } from "@/presentation/hooks/usePricingLabel";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { useSession } from "@/presentation/session/SessionProvider";

export default function ListingDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  // El id viene de la ruta /(app)/listings/[id], así que siempre está presente.
  const { id: listingId } = useLocalSearchParams<{ id: string }>();

  const { actor } = useSession();
  const toErrorMessage = useApiErrorMessage();
  const pricingLabel = usePricingLabel();
  const locale = localeForLanguage(i18n.language);

  const listingQuery = useListingDetail(listingId);
  const reviewsQuery = useListingReviews(listingId);
  const createBooking = useCreateBooking();

  const [feedback, setFeedback] = useState<string | null>(null);

  if (listingQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (listingQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface px-6">
        <Text className="text-error text-center">
          {toErrorMessage(listingQuery.error)}
        </Text>
      </SafeAreaView>
    );
  }

  const listing = listingQuery.data;
  const reviews = (reviewsQuery.data?.pages ?? []).flatMap((page) => page.items);

  // ¿Se puede reservar? La regla es la del contrato compartido con el backend.
  const eligibility = actor === null ? null : canBookListing(actor, listing);
  const blockedReason =
    eligibility !== null && !eligibility.ok ? eligibility.reason : null;

  const handleBook = async (): Promise<void> => {
    setFeedback(null);
    try {
      // La reserva nace en estado `requested`: ahora le toca al proveedor
      // aceptarla, así que llevamos al usuario a la lista de sus reservas.
      await createBooking.mutateAsync({ listingId: listing.id });
      router.push("/(app)/bookings");
    } catch (error) {
      setFeedback(toErrorMessage(error));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
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
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-primary mb-2">{listing.title}</Text>

        <View className="flex-row items-center justify-between mt-2 mb-6">
          <Text className="text-2xl font-bold text-brand">
            {pricingLabel(listing.pricing, locale)}
          </Text>

          {listing.ratingCount > 0 ? (
            <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-amber-800 font-bold text-sm ml-1.5">
                {listing.ratingAvg.toFixed(1)} ({listing.ratingCount})
              </Text>
            </View>
          ) : (
            <Text className="text-tertiary text-sm">
              {t("listings.detail.noReviews")}
            </Text>
          )}
        </View>

        <View className="mb-8">
          <Text className="text-lg font-bold text-primary mb-2">
            {t("listings.detail.description")}
          </Text>
          <Text className="text-secondary text-base leading-6">
            {listing.description}
          </Text>
        </View>

        {/* Reseñas reales del anuncio */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-primary mb-3">
            {t("listings.detail.reviews")}
          </Text>

          {reviews.length === 0 ? (
            <Text className="text-tertiary">{t("listings.detail.noReviews")}</Text>
          ) : (
            reviews.map((review) => (
              <View
                key={review.id}
                className="bg-surface-alt rounded-2xl p-4 mb-3 border border-default"
              >
                <View className="flex-row items-center mb-1.5">
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text className="text-primary font-bold text-sm ml-1.5">
                    {review.rating}/5
                  </Text>
                </View>
                <Text className="text-secondary leading-5">{review.body}</Text>
              </View>
            ))
          )}
        </View>

        {feedback !== null ? (
          <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4">
            <Text className="text-red-700 text-xs font-semibold text-center leading-5">
              {feedback}
            </Text>
          </View>
        ) : null}

        {/* Si no se puede reservar, se explica el motivo en vez de dejar un botón muerto. */}
        {blockedReason !== null ? (
          <View className="bg-surface-alt border border-default rounded-xl p-4">
            <Text className="text-secondary text-center text-sm">
              {t(`errors.reason.${blockedReason}`)}
            </Text>
          </View>
        ) : (
          <Button
            label={t("listings.detail.book")}
            isLoading={createBooking.isPending}
            onPress={() => void handleBook()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
