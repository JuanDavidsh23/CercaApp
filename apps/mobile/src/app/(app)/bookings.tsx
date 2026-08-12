import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import type { BookingResponse, DeclineReason } from "@cerca/contract";
import {
  bookingActionsFor,
  type BookingRole,
} from "@/application/booking/booking-actions";
import { Button } from "@/presentation/components/ui/Button";
import { BookingCard } from "@/presentation/components/ui/BookingCard";
import { CategoryPills } from "@/presentation/components/ui/CategoryPills";
import { useBookingAction, useBookings } from "@/presentation/hooks/useBookings";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { useSession } from "@/presentation/session/SessionProvider";

const ROLES: readonly BookingRole[] = ["customer", "provider"];
const DECLINE_REASONS: readonly DeclineReason[] = ["unavailable", "not_a_fit", "other"];

/** Opciones rápidas de fecha al aceptar, en días desde hoy. */
const SCHEDULE_OPTIONS = [1, 3, 7] as const;

function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export default function BookingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { actor } = useSession();
  const toErrorMessage = useApiErrorMessage();

  const [role, setRole] = useState<BookingRole>("customer");
  const bookingsQuery = useBookings(role);
  const bookingAction = useBookingAction();

  const bookings = (bookingsQuery.data?.pages ?? []).flatMap((page) => page.items);

  const runAction = (
    id: string,
    action: Parameters<typeof bookingAction.mutate>[0]["action"],
  ): void => {
    bookingAction.mutate(
      { id, action },
      {
        onError: (error) => {
          Alert.alert(t("bookings.actionFailed"), toErrorMessage(error));
        },
      },
    );
  };

  /** Al aceptar hay que decir CUÁNDO: la API exige una fecha. */
  const askSchedule = (id: string): void => {
    Alert.alert(t("bookings.accept.title"), t("bookings.accept.message"), [
      ...SCHEDULE_OPTIONS.map((days) => ({
        text: t("bookings.accept.inDays", { count: days }),
        onPress: () => {
          runAction(id, { type: "accept", scheduledFor: inDays(days) });
        },
      })),
      { text: t("common.cancel"), style: "cancel" as const },
    ]);
  };

  const askDeclineReason = (id: string): void => {
    Alert.alert(t("bookings.decline.title"), t("bookings.decline.message"), [
      ...DECLINE_REASONS.map((reason) => ({
        text: t(`bookings.decline.reasons.${reason}`),
        onPress: () => {
          runAction(id, { type: "decline", reason });
        },
      })),
      { text: t("common.cancel"), style: "cancel" as const },
    ]);
  };

  const renderItem = ({ item }: { item: BookingResponse }) => {
    if (actor === null) return null;

    // Qué botones tienen sentido: capacidad + relación + estado, igual que el servidor.
    const actions = bookingActionsFor(actor, item, role, new Date());

    return (
      <BookingCard booking={item}>
        {actions.canAccept ? (
          <Button
            label={t("bookings.actions.accept")}
            onPress={() => {
              askSchedule(item.id);
            }}
          />
        ) : null}

        {actions.canDecline ? (
          <Button
            label={t("bookings.actions.decline")}
            variant="outline"
            onPress={() => {
              askDeclineReason(item.id);
            }}
          />
        ) : null}

        {actions.canComplete ? (
          <Button
            label={t("bookings.actions.complete")}
            onPress={() => {
              runAction(item.id, { type: "complete" });
            }}
          />
        ) : null}

        {actions.canCancel ? (
          <Button
            label={t("bookings.actions.cancel")}
            variant="outline"
            onPress={() => {
              runAction(item.id, { type: "cancel" });
            }}
          />
        ) : null}

        {actions.canReview ? (
          <Button
            label={t("bookings.actions.review")}
            onPress={() => {
              router.push(`/(app)/bookings/${item.id}/review`);
            }}
          />
        ) : null}
      </BookingCard>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-alt" edges={["top"]}>
      <View className="bg-surface px-6 pt-4 pb-2 border-b border-default">
        <Text className="text-3xl font-bold text-primary mb-1">
          {t("bookings.title")}
        </Text>
        <Text className="text-secondary mb-2">{t("bookings.subtitle")}</Text>

        {/* El mismo endpoint sirve las dos vistas: solo cambia ?role= */}
        <View className="-mx-6">
          <CategoryPills
            categories={ROLES.map((id) => ({ id, label: t(`bookings.roles.${id}`) }))}
            selectedCategoryId={role}
            onSelect={(id) => {
              if (id === "customer" || id === "provider") setRole(id);
            }}
          />
        </View>
      </View>

      {bookingsQuery.isPending ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator color="#6366f1" />
        </View>
      ) : bookingsQuery.isError ? (
        <View className="items-center justify-center px-6 py-10">
          <Text className="text-error text-center">
            {toErrorMessage(bookingsQuery.error)}
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={7}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (bookingsQuery.hasNextPage && !bookingsQuery.isFetchingNextPage) {
              void bookingsQuery.fetchNextPage();
            }
          }}
          refreshing={bookingsQuery.isRefetching}
          onRefresh={() => void bookingsQuery.refetch()}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-tertiary">{t("bookings.empty")}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
