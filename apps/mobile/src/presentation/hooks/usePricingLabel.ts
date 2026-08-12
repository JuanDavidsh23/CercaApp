import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { formatMoney, type Pricing } from "@cerca/contract";

/**
 * Convierte el precio de un anuncio en texto.
 *
 * `Pricing` es una unión: precio cerrado, por hora, o "a convenir". El `switch`
 * cubre los tres casos y ESLint obliga a que estén todos, así que si el contrato
 * añadiera un cuarto modelo, esto dejaría de compilar.
 *
 * El dinero NUNCA se divide a mano: `formatMoney` sabe cuántos decimales tiene
 * cada moneda (el peso colombiano no tiene, el dinar kuwaití tiene tres).
 */
export function usePricingLabel(): (pricing: Pricing, locale: string) => string {
  const { t } = useTranslation();

  return useCallback(
    (pricing: Pricing, locale: string): string => {
      switch (pricing.model) {
        case "fixed":
          return formatMoney(pricing.price, locale);

        case "hourly":
          return t("listings.pricing.hourly", {
            amount: formatMoney(pricing.hourlyRate, locale),
            hours: pricing.minimumHours,
          });

        case "quote":
          return pricing.startingFrom === undefined
            ? t("listings.priceOnRequest")
            : t("listings.pricing.quoteFrom", {
                amount: formatMoney(pricing.startingFrom, locale),
              });
      }
    },
    [t],
  );
}
