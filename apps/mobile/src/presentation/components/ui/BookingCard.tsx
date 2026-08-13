import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import type { BookingResponse } from "@cerca/contract";
import { useListingDetail } from "../../hooks/useListings";
import { cn } from "../../lib/cn";

/** Fondo de la etiqueta de estado (badge), mapeado a los estados del contrato compartido (`@cerca/contract`) */
const STATUS_BACKGROUND: Record<BookingResponse["status"], string> = {
  requested: "bg-brand/10",
  accepted: "bg-emerald-50",
  declined: "bg-red-50",
  completed: "bg-sky-50",
  cancelled: "bg-surface-alt",
};

/** Color del texto de la etiqueta según el estado de la reserva */
const STATUS_TEXT: Record<BookingResponse["status"], string> = {
  requested: "text-brand",
  accepted: "text-emerald-700",
  declined: "text-red-700",
  completed: "text-sky-700",
  cancelled: "text-secondary",
};

export interface BookingCardProps {
  booking: BookingResponse;
  /** Botones de acción dinámicos renderizados según las políticas del contrato */
  children?: React.ReactNode;
}

/**
 * Componente `BookingCardComponent`: Renderiza una tarjeta de reserva.
 *
 * ¿Cómo obtiene el título del anuncio?
 * La reserva viene de la API con `listingId`. Se invoca `useListingDetail(listingId)` de TanStack Query.
 * Gracias a la caché compartida, si hay 5 reservas del mismo anuncio, solo realiza **1 petición HTTP**.
 */
function BookingCardComponent({ booking, children }: BookingCardProps) {
  const { t } = useTranslation();

  const listingQuery = useListingDetail(booking.listingId);

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-default">
      {/* 1. Cabecera con título del servicio y distintivo (Badge) de Estado */}
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

      {/* 2. Fecha programada para la prestación del servicio si ya fue aceptada */}
      {booking.scheduledFor !== null ? (
        <Text className="text-secondary text-sm mb-1">
          {t("bookings.scheduledFor", {
            date: new Date(booking.scheduledFor).toLocaleDateString(),
          })}
        </Text>
      ) : null}

      {/* 3. Renderiza las acciones permitidas (Aceptar, Rechazar, Completar, Cancelar, Reseñar) */}
      {children !== undefined ? (
        <View className="flex-row flex-wrap gap-2 mt-3">{children}</View>
      ) : null}
    </View>
  );
}

/**
 * Se exporta envuelto en `React.memo` para evitar re-renderizados innecesarios en la `FlatList` (Regla 12 de AGENTS.md).
 */
export const BookingCard = React.memo(BookingCardComponent);
