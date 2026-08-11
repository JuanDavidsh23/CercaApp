export type CurrencyCode = "MXN" | "USD" | "EUR" | "JPY" | "KWD";

export interface Money {
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
}

export function formatMoney(money: Money, locale: string = "es-MX"): string {
  // Determine minor units
  let fractionDigits = 2;
  if (money.currency === "JPY") fractionDigits = 0;
  if (money.currency === "KWD") fractionDigits = 3;

  const majorAmount = money.amountMinor / Math.pow(10, fractionDigits);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).format(majorAmount);
}
