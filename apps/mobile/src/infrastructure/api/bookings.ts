import { z } from "zod";
import {
  acceptBookingSchema,
  bookingResponseSchema,
  createBookingSchema,
  declineBookingSchema,
  type BookingResponse,
  type CreateBookingInput,
  type DeclineReason,
  type Page,
} from "@cerca/contract";
import { apiFetch, newIdempotencyKey } from "./client";

const bookingPageSchema = z.object({
  items: z.array(bookingResponseSchema),
  nextCursor: z.string().nullable(),
});

/**
 * POST /bookings — pide una reserva.
 * Lleva Idempotency-Key: si el usuario toca dos veces "Reservar" o la red reintenta,
 * el servidor devuelve la MISMA reserva en vez de crear dos.
 */
export async function createBookingApi(
  input: CreateBookingInput,
): Promise<BookingResponse> {
  const validatedInput = createBookingSchema.parse(input);

  const raw = await apiFetch("/bookings", {
    method: "POST",
    body: validatedInput,
    idempotencyKey: newIdempotencyKey(),
  });

  return bookingResponseSchema.parse(raw);
}

/**
 * GET /bookings?role=... — mis reservas.
 * `customer` = las que YO pedí. `provider` = las que me pidieron a mí.
 * Es el mismo endpoint: el servidor decide qué puedo ver.
 */
export async function getBookingsApi(
  role: "customer" | "provider",
  cursor?: string,
): Promise<Page<BookingResponse>> {
  const raw = await apiFetch("/bookings", {
    query: { role, cursor, limit: 20 },
  });
  return bookingPageSchema.parse(raw);
}

/** GET /bookings/:id — una reserva concreta. */
export async function getBookingApi(id: string): Promise<BookingResponse> {
  const raw = await apiFetch(`/bookings/${id}`);
  return bookingResponseSchema.parse(raw);
}

/** POST /bookings/:id/accept — el proveedor acepta y fija la fecha del servicio. */
export async function acceptBookingApi(
  id: string,
  scheduledFor: string,
): Promise<BookingResponse> {
  const validatedInput = acceptBookingSchema.parse({ scheduledFor });

  const raw = await apiFetch(`/bookings/${id}/accept`, {
    method: "POST",
    body: validatedInput,
  });

  return bookingResponseSchema.parse(raw);
}

/** POST /bookings/:id/decline — el proveedor rechaza, indicando el motivo. */
export async function declineBookingApi(
  id: string,
  reason: DeclineReason,
): Promise<BookingResponse> {
  const validatedInput = declineBookingSchema.parse({ reason });

  const raw = await apiFetch(`/bookings/${id}/decline`, {
    method: "POST",
    body: validatedInput,
  });

  return bookingResponseSchema.parse(raw);
}

/** POST /bookings/:id/complete — el servicio se prestó. Abre la ventana de reseña. */
export async function completeBookingApi(id: string): Promise<BookingResponse> {
  const raw = await apiFetch(`/bookings/${id}/complete`, { method: "POST" });
  return bookingResponseSchema.parse(raw);
}

/** POST /bookings/:id/cancel — cancelar la reserva. */
export async function cancelBookingApi(id: string): Promise<BookingResponse> {
  const raw = await apiFetch(`/bookings/${id}/cancel`, { method: "POST" });
  return bookingResponseSchema.parse(raw);
}
