import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import type { BookingResponse } from "@cerca/contract";
import { useListingDetail } from "../../hooks/useListings";
import { cn } from "../../lib/cn";

/** Fondo de la etiqueta de estado, uno por cada estado del contrato. */
const STATUS_BACKGROUND: Record<BookingResponse["status"], string> = {
  requested: "bg-brand/10",
  accepted: "bg-emerald-50",
  declined: "bg-red-50",
  completed: "bg-sky-50",
  cancelled: "bg-surface-alt",
};

/** Color del texto de esa misma etiqueta. */
const STATUS_TEXT: Record<BookingResponse["status"], string> = {
  requested: "text-brand",
  accepted: "text-emerald-700",
  declined: "text-red-700",
  completed: "text-sky-700",
  cancelled: "text-secondary",
};

export interface BookingCardProps {
  booking: BookingResponse;
  /** Botones de acción, que decide la pantalla. */
  children?: React.ReactNode;
}

function BookingCardComponent({ booking, children }: BookingCardProps) {
  const { t } = useTranslation();

  // La API devuelve la reserva con el `listingId`, no con el anuncio dentro,
  // así que el título se pide aparte. TanStack Query lo cachea: si dos reservas
  // son del mismo anuncio, solo se pide una vez.
  const listingQuery = useListingDetail(booking.listingId);

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-default">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-primary font-bold text-base flex-1 mr-3" numberOfLines={2}>
          {listingQuery.data?.title ?? t("common.loading")}
        </Text>

        <View className={cn("px-3 py-1 rounded-full", STATUS_BACKGROUND[booking.status])}>
          <Text className={cn("text-xs font-bold", STATUS_TEXT[booking.status])}>
            {t(`bookings.status.${booking.status}`)}
          </Text>
        </View>
      </View>

      {booking.scheduledFor !== null ? (
        <Text className="text-secondary text-sm mb-1">
          {t("bookings.scheduledFor", {
            date: new Date(booking.scheduledFor).toLocaleDateString(),
          })}
        </Text>
      ) : null}

      {children !== undefined ? (
        <View className="flex-row flex-wrap gap-2 mt-3">{children}</View>
      ) : null}
    </View>
  );
}

export const BookingCard = React.memo(BookingCardComponent);
