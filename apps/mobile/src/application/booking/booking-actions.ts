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
 * `bookingActionsFor`: Adaptador de la Capa de Aplicación.
 *
 * ¿Qué hace esta función?
 * Calcula qué botones (Aceptar, Rechazar, Completar, Cancelar, Reseñar) deben pintarse en la UI para una reserva dada.
 *
 * ¿Cómo combina las 3 verificaciones?
 * 1. Capacidad: `can(actor, "booking:accept")` -> Verifica si el actor tiene capacidad de proveedor.
 * 2. Relación: `role === "provider"` o `"customer"` -> Si el usuario actual es quien presta el servicio o quien lo solicitó.
 * 3. Estado: `booking.status` -> Transición de máquina de estados (`requested` -> `accepted` -> `completed` / `declined` / `cancelled`).
 *
 * NOTA IMPORTANTE (Regla 8 de AGENTS.md):
 * Ocultar un botón en la app móvil es SOLO para experiencia de usuario (UX).
 * La verdadera autorización de seguridad se realiza en el Servidor (Backend).
 */
export function bookingActionsFor(
  actor: Actor,
  booking: BookingResponse,
  role: BookingRole,
  now: Date,
): BookingActions {
  const isProvider = role === "provider";
  const mayAccept = isProvider && can(actor, "booking:accept");

  // La reserva puede cancelarse mientras no haya finalizado ni sido rechazada
  const isOpen = booking.status === "requested" || booking.status === "accepted";

  return {
    // 1. Aceptar: Solo el proveedor si la reserva está en estado 'requested'
    canAccept: mayAccept && booking.status === "requested",
    // 2. Rechazar: Solo el proveedor si la reserva está en estado 'requested'
    canDecline: mayAccept && booking.status === "requested",
    // 3. Completar: Solo el proveedor una vez aceptó el servicio y lo ejecutó
    canComplete: mayAccept && booking.status === "accepted",
    // 4. Cancelar: El cliente o proveedor mientras la reserva esté abierta
    canCancel: isOpen,
    // 5. Reseñar: Solo el cliente si la política `canWriteReview` da ok (completada, no reseñada, <= 30 días)
    canReview: !isProvider && canWriteReview(actor, booking, now).ok,
  };
}
