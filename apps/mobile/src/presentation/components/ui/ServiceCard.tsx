import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";
import { formatMoney, type Money } from "@cerca/contract";
import { cn } from "../../lib/cn";

export interface ServiceCardProps {
  /** Título del servicio ofertado */
  title: string;
  /** Subtítulo formateado con distancia (ej. "a 850 m" o "a 1,2 km") */
  subtitle: string;
  /** Objeto Money de contrato (`{ amountMinor, currency }`) o `null` si es a convenir */
  price: Money | null;
  /** Texto alternativo si el precio es a convenir (ej. "Precio a convenir") */
  priceFallback: string;
  /** Calificación promedio del anuncio (ej. 4.8) */
  rating: number;
  /** Número total de reseñas recibidas */
  ratingCount: number;
  locale?: string;
  onPress?: () => void;
  className?: string;
}

/**
 * Componente `ServiceCardComponent`: Tarjeta de anuncio mostrada en el listado de búsqueda principal.
 */
function ServiceCardComponent({
  title,
  subtitle,
  price,
  priceFallback,
  rating,
  ratingCount,
  locale = "es-MX",
  onPress,
  className,
}: ServiceCardProps) {
  // Formatea el dinero usando `formatMoney` del contrato (Respeta la regla 4: Cero floats)
  const priceLabel = price === null ? priceFallback : formatMoney(price, locale);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}, ${priceLabel}`}
      className={cn(
        "bg-surface rounded-2xl p-4 mb-4 border border-default flex-row shadow-sm",
        className,
      )}
    >
      {/* 1. Avatar / Placeholder de la primera letra del anuncio */}
      <View className="w-20 h-20 rounded-xl bg-surface-alt overflow-hidden mr-4 items-center justify-center">
        <Text className="text-tertiary font-bold text-lg">{title.charAt(0)}</Text>
      </View>

      {/* 2. Información técnica: Título y Distancia */}
      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="text-primary font-bold text-base" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-secondary text-sm mt-0.5">{subtitle}</Text>
        </View>

        {/* 3. Fila inferior: Precio e Indicador de Estrellas/Rating */}
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-brand font-semibold">{priceLabel}</Text>

          {/* Muestra estrellas y cantidad solo si ya tiene calificaciones acumuladas */}
          {ratingCount > 0 ? (
            <View className="flex-row items-center">
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-primary font-medium text-sm ml-1">
                {rating.toFixed(1)} ({ratingCount})
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Encapsulado con `React.memo`: Evita re-renders innecesarios en la `FlatList` al hacer scroll (Cumple la Regla 12 de AGENTS.md).
 */
export const ServiceCard = React.memo(ServiceCardComponent);
