import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";
import { formatMoney, type Money } from "@cerca/contract";
import { cn } from "../../lib/cn";

export interface ServiceCardProps {
  title: string;
  /** Texto ya traducido por la pantalla (por ejemplo, "a 1,2 km"). */
  subtitle: string;
  /** `null` cuando el anuncio es "a convenir" y no tiene precio de partida. */
  price: Money | null;
  /** Qué mostrar cuando no hay precio. Ya traducido. */
  priceFallback: string;
  rating: number;
  ratingCount: number;
  locale?: string;
  onPress?: () => void;
  className?: string;
}

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
      <View className="w-20 h-20 rounded-xl bg-surface-alt overflow-hidden mr-4 items-center justify-center">
        <Text className="text-tertiary font-bold text-lg">{title.charAt(0)}</Text>
      </View>

      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="text-primary font-bold text-base" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-secondary text-sm mt-0.5">{subtitle}</Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-brand font-semibold">{priceLabel}</Text>

          {/* Sin reseñas todavía no hay nota que enseñar. */}
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
 * `memo` evita que las tarjetas ya pintadas se vuelvan a dibujar cuando cambia
 * cualquier otra cosa de la pantalla. Con listas largas se nota (regla 12).
 */
export const ServiceCard = React.memo(ServiceCardComponent);
