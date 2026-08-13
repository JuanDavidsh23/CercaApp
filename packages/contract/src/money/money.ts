import { z } from "zod";

/**
 * Manejo del Dinero en CercaApp:
 *
 * ¿Por qué NUNCA se usan números de punto flotante (`float`) para dinero?
 * 1. Imprecisión binaria de punto flotante: en IEEE 754, `0.1 + 0.2` da `0.30000000000000004`, provocando errores de centavos.
 * 2. Suposición de 2 decimales universal: Dividir entre 100 de forma genérica es incorrecto globalmente.
 *    - El Peso Colombiano (COP), Chileno (CLP) y Yen Japonés (JPY) tienen 0 decimales (unidades menores = 0).
 *    - El Dinar Kuwaití (KWD) tiene 3 decimales (unidades menores = 3).
 *    - El Dólar (USD) y Euro (EUR) tienen 2 decimales (unidades menores = 2).
 *
 * La regla de oro (Regla 4 y 5 de AGENTS.md):
 * El dinero SIEMPRE viaja por el API como `{ amountMinor: entero, currency: "USD" }`.
 * El servidor almacena y transmite enteros enteros; solo el cliente móvil le aplica formato para la UI según el locale local.
 */
export const CURRENCY_MINOR_UNITS: Readonly<Record<string, number>> = Object.freeze({
  COP: 0,
  CLP: 0,
  JPY: 0,
  USD: 2,
  EUR: 2,
  GBP: 2,
  MXN: 2,
  BRL: 2,
  KWD: 3,
});

/** Esquema Zod estricto para validar cualquier objeto de Dinero recibido por la API. */
export const moneySchema = z
  .object({
    amountMinor: z.number().int().nonnegative(),
    currency: z
      .string()
      .length(3)
      .regex(/^[A-Z]{3}$/, "currency must be a 3-letter ISO-4217 code"),
  })
  .strict();

export type Money = z.infer<typeof moneySchema>;

/** Devuelve cuántos decimales / exponentes de unidad menor usa una moneda dada. */
export function minorUnitsFor(currency: string): number {
  return CURRENCY_MINOR_UNITS[currency] ?? 2;
}

/**
 * Formatea un objeto `Money` a un texto formateado según el locale (ej. "$ 15.000" o "$150.00").
 *
 * Pasos:
 * 1. Obtiene los decimales según la moneda (ej. 2 para MXN/USD, 0 para JPY/COP).
 * 2. Convierte `amountMinor` dividiendo por 10^minorUnits para obtener el monto principal.
 * 3. Aplica `Intl.NumberFormat` nativo con la moneda y los decimales exactos.
 */
export function formatMoney(money: Money, locale: string = "es-MX"): string {
  const minorUnits = minorUnitsFor(money.currency);
  const amountMajor = money.amountMinor / Math.pow(10, minorUnits);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: minorUnits,
    maximumFractionDigits: minorUnits,
  }).format(amountMajor);
}
