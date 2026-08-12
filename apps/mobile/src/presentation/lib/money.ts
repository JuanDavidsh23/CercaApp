import { minorUnitsFor, type Money } from "@cerca/contract";

/**
 * Convierte lo que el usuario escribe ("45.50") en `Money` de unidades menores.
 *
 * El dinero se guarda SIEMPRE en enteros, nunca en decimales: `0.1 + 0.2` no da
 * `0.3` en coma flotante. Y cuántos decimales tiene una moneda depende de la
 * moneda — el peso colombiano no tiene ninguno y el dinar kuwaití tiene tres —,
 * por eso el factor sale de `minorUnitsFor` y no de un "por 100" fijo.
 *
 * Devuelve `null` si lo escrito no es una cantidad válida.
 */
export function parseMoney(text: string, currency: string): Money | null {
  const normalized = text.replace(",", ".").trim();
  if (normalized.length === 0) return null;

  const major = Number(normalized);
  if (!Number.isFinite(major) || major < 0) return null;

  const factor = Math.pow(10, minorUnitsFor(currency));
  return { amountMinor: Math.round(major * factor), currency };
}
