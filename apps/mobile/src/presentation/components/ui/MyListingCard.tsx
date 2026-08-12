import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import type { ListingResponse } from "@cerca/contract";
import { usePricingLabel } from "../../hooks/usePricingLabel";
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

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-default">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-primary font-bold text-base flex-1 mr-3" numberOfLines={2}>
          {listing.title}
        </Text>

        <View className={cn("px-3 py-1 rounded-full", STATUS_BACKGROUND[listing.status])}>
          <Text className={cn("text-xs font-bold", STATUS_TEXT[listing.status])}>
            {t(`listings.status.${listing.status}`)}
          </Text>
        </View>
      </View>

      <Text className="text-brand font-semibold">
        {pricingLabel(listing.pricing, locale)}
      </Text>

      {children !== undefined ? (
        <View className="flex-row flex-wrap gap-2 mt-3">{children}</View>
      ) : null}
    </View>
  );
}

export const MyListingCard = React.memo(MyListingCardComponent);
