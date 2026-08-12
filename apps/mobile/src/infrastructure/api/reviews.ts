import { z } from "zod";
import {
  reviewResponseSchema,
  writeReviewSchema,
  type ReviewResponse,
  type WriteReviewInput,
  type Page,
} from "@cerca/contract";
import { apiFetch, newIdempotencyKey } from "./client";

const reviewPageSchema = z.object({
  items: z.array(reviewResponseSchema),
  nextCursor: z.string().nullable(),
});

/**
 * POST /bookings/:id/review — escribe la reseña de una reserva completada.
 * Lleva Idempotency-Key por el mismo motivo que la reserva: un doble toque
 * no debe intentar crear dos reseñas.
 *
 * El servidor vuelve a comprobar las cuatro condiciones de `canReviewBooking`
 * (fue tu reserva, está completada, no la reseñaste ya, sigue dentro de los 30 días).
 * Lo que hace la app con esa política es solo UX.
 */
export async function writeReviewApi(
  bookingId: string,
  input: WriteReviewInput,
): Promise<ReviewResponse> {
  const validatedInput = writeReviewSchema.parse(input);

  const raw = await apiFetch(`/bookings/${bookingId}/review`, {
    method: "POST",
    body: validatedInput,
    idempotencyKey: newIdempotencyKey(),
  });

  return reviewResponseSchema.parse(raw);
}

/** GET /listings/:id/reviews — las reseñas públicas de un anuncio. */
export async function getListingReviewsApi(
  listingId: string,
  cursor?: string,
): Promise<Page<ReviewResponse>> {
  const raw = await apiFetch(`/listings/${listingId}/reviews`, {
    requiresAuth: false,
    query: { cursor, limit: 20 },
  });

  return reviewPageSchema.parse(raw);
}
