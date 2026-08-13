import React, { useState } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import type { ListingResponse } from "@cerca/contract";
import { usePricingLabel } from "../../hooks/usePricingLabel";
import { getServiceImageUrl } from "../../lib/serviceImages";
import { cn } from "../../lib/cn";

const STATUS_BACKGROUND: Record<ListingResponse["status"], string> = {
  draft: "bg-surface-alt",
  published: "bg-emerald-50",
  paused: "bg-amber-50",
  under_review: "bg-orange-50",
  removed: "bg-red-50",
};

const STATUS_TEXT: Record<ListingResponse["status"], string> = {
  draft: "text-secondary",
  published: "text-emerald-700",
  paused: "text-amber-700",
  under_review: "text-orange-700",
  removed: "text-red-700",
};

export interface MyListingCardProps {
  listing: ListingResponse;
  locale: string;
  /** Botones de acción, que decide la pantalla. */
  children?: React.ReactNode;
}

function MyListingCardComponent({ listing, locale, children }: MyListingCardProps) {
  const { t } = useTranslation();
  const pricingLabel = usePricingLabel();
  const [imageError, setImageError] = useState(false);
  const imageUrl = getServiceImageUrl(listing.title);

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-default shadow-sm">
      <View className="flex-row items-start mb-3">
        <View className="w-16 h-16 rounded-2xl bg-surface-alt border border-default overflow-hidden mr-3 items-center justify-center relative">
          {!imageError ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
              onError={() => setImageError(true)}
            />
          ) : (
            <View className="w-full h-full bg-brand/10 items-center justify-center">
              <Text className="text-brand font-bold text-lg">
                {listing.title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1 justify-between py-0.5">
          <View className="flex-row items-start justify-between">
            <Text
              className="text-primary font-bold text-base flex-1 mr-2 leading-5"
              numberOfLines={2}
            >
              {listing.title}
            </Text>

            <View
              className={cn(
                "px-2.5 py-0.5 rounded-full",
                STATUS_BACKGROUND[listing.status],
              )}
            >
              <Text className={cn("text-[11px] font-bold", STATUS_TEXT[listing.status])}>
                {t(`listings.status.${listing.status}`)}
              </Text>
            </View>
          </View>

          <Text className="text-brand font-semibold text-xs mt-1">
            {pricingLabel(listing.pricing, locale)}
          </Text>
        </View>
      </View>

      {children !== undefined ? (
        <View className="flex-row flex-wrap gap-2 mt-2 pt-2 border-t border-default/50">
          {children}
        </View>
      ) : null}
    </View>
  );
}

export const MyListingCard = React.memo(MyListingCardComponent);
