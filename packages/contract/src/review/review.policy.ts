import type { Actor } from "../auth/actor";
import type { Booking } from "../booking/booking.types";
import type { Eligibility } from "../common/result";

export type ReviewBlockedReason =
  "not_your_booking" | "not_completed" | "already_reviewed" | "window_closed";
export type ReviewEligibility = Eligibility<ReviewBlockedReason>;

export const REVIEW_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days elapsed from `from` to `to`, floored. Pure — no clock inside. */
export function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / DAY_MS);
}

/**
 * Política `canReviewBooking`: Regla de Dominio pura para calificar reservas.
 *
 * ¿Qué evalúa?
 * 1. Relación: `booking.customerId === actor.id` -> Solo quien reservó puede calificar (not_your_booking).
 * 2. Estado: `booking.status.kind === "completed"` -> Solo reservas completadas (not_completed).
 * 3. Unicidad: `booking.reviewId === null` -> Impide múltiples reseñas a la misma reserva (already_reviewed).
 * 4. Ventana de Tiempo: `<= 30 días` transcurridos desde completada (window_closed).
 *
 * ¿Por qué `now` es un argumento en lugar de llamar `new Date()` adentro?
 * Para mantener la función PURA y DETERMINISTA. Esto permite hacer testing fácil con cualquier fecha sin falsificar el reloj del sistema.
 *
 * Devuelve un objeto `{ ok: true }` o `{ ok: false, reason: "razon_tecnica" }`, que la app móvil traduce usando i18n (`errors.reason.window_closed`).
 */
export function canReviewBooking(
  actor: Actor,
  booking: Booking,
  now: Date,
): ReviewEligibility {
  if (booking.customerId !== actor.id) return { ok: false, reason: "not_your_booking" };
  if (booking.status.kind !== "completed") return { ok: false, reason: "not_completed" };
  if (booking.reviewId !== null) return { ok: false, reason: "already_reviewed" };
  if (daysBetween(new Date(booking.status.completedAt), now) > REVIEW_WINDOW_DAYS) {
    return { ok: false, reason: "window_closed" };
  }
  return { ok: true };
}
