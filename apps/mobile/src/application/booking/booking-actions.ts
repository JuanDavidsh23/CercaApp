import { can, type Actor, type BookingResponse } from "@cerca/contract";
import { canWriteReview } from "../review/can-write-review";

/** El lado desde el que estoy mirando la reserva: la pedí yo, o me la pidieron a mí. */
export type BookingRole = "customer" | "provider";

/** Qué botones tienen sentido para esta reserva. Solo decide qué se PINTA. */
export interface BookingActions {
  canAccept: boolean;
  canDecline: boolean;
  canComplete: boolean;
  canCancel: boolean;
  canReview: boolean;
}

/**
 * Decide qué acciones mostrar, combinando las mismas capas que usa el servidor:
 * la CAPACIDAD (`can(actor, "booking:accept")`), la RELACIÓN (soy el cliente o el
 * proveedor) y el ESTADO de la reserva.
 *
 * Ojo: esto es solo estética. Si alguien fuerza la petición igualmente, la API la
 * rechaza. Ocultar un botón nunca es una medida de seguridad.
 */
export function bookingActionsFor(
  actor: Actor,
  booking: BookingResponse,
  role: BookingRole,
  now: Date,
): BookingActions {
  const isProvider = role === "provider";
  const mayAccept = isProvider && can(actor, "booking:accept");

  // Solo se puede cancelar mientras la reserva sigue viva.
  const isOpen = booking.status === "requested" || booking.status === "accepted";

  return {
    canAccept: mayAccept && booking.status === "requested",
    canDecline: mayAccept && booking.status === "requested",
    canComplete: mayAccept && booking.status === "accepted",
    canCancel: isOpen,
    canReview: !isProvider && canWriteReview(actor, booking, now).ok,
  };
}
