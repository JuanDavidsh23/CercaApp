import {
  canReviewBooking,
  type Actor,
  type BookingResponse,
  type ReviewEligibility,
} from "@cerca/contract";

/**
 * ¿Puede este usuario reseñar esta reserva?
 *
 * La regla de verdad vive en `canReviewBooking`, dentro de @cerca/contract: el MISMO
 * archivo que el backend ejecuta al recibir la petición. Aquí solo la adaptamos, porque
 * la reserva llega por la red en formato "plano" (`status: "completed"`) y la política
 * lee el formato del dominio (`status: { kind: "completed", completedAt }`).
 *
 * Las dos primeras condiciones se resuelven sin convertir nada, y para el resto —
 * "ya la reseñaste" y "pasaron más de 30 días" — llamamos a la política compartida.
 *
 * Esto es SOLO para la interfaz: sirve para deshabilitar el formulario y explicar el
 * motivo. El servidor vuelve a comprobarlo todo (regla 8: el servidor es la autoridad).
 */
export function canWriteReview(
  actor: Actor,
  booking: BookingResponse,
  now: Date,
): ReviewEligibility {
  if (booking.customerId !== actor.id) {
    return { ok: false, reason: "not_your_booking" };
  }

  if (booking.status !== "completed" || booking.completedAt === null) {
    return { ok: false, reason: "not_completed" };
  }

  return canReviewBooking(
    actor,
    {
      id: booking.id,
      listingId: booking.listingId,
      customerId: booking.customerId,
      status: { kind: "completed", completedAt: booking.completedAt },
      reviewId: booking.reviewId,
    },
    now,
  );
}
