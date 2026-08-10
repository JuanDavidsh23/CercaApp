import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Star } from "lucide-react-native";
import { formatMoney, type Money } from "@cerca/contract";
import { cn } from "../../lib/cn";

export interface ServiceCardProps {
  title: string;
  providerName: string;
  price: Money;
  rating: number;
  locale?: string;
  imageUrl?: string;
  onPress?: () => void;
  className?: string;
}

export function ServiceCard({
  title,
  providerName,
  price,
  rating,
  locale = "es-MX",
  imageUrl,
  onPress,
  className,
}: ServiceCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${providerName}, ${formatMoney(price, locale)}`}
      className={cn(
        "bg-surface rounded-2xl p-4 mb-4 border border-default flex-row shadow-sm",
        className,
      )}
    >
      <View className="w-20 h-20 rounded-xl bg-surface-alt overflow-hidden mr-4">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full" />
        ) : (
          <View className="flex-1 items-center justify-center bg-surface-alt">
            <Text className="text-tertiary font-bold text-lg">{title.charAt(0)}</Text>
          </View>
        )}
      </View>

      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="text-primary font-bold text-base" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-secondary text-sm mt-0.5">{providerName}</Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-brand font-semibold">{formatMoney(price, locale)}</Text>

          <View className="flex-row items-center">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-primary font-medium text-sm ml-1">
              {rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
