import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateBookingInput, DeclineReason } from "@cerca/contract";
import {
  acceptBookingApi,
  cancelBookingApi,
  completeBookingApi,
  createBookingApi,
  declineBookingApi,
  getBookingApi,
  getBookingsApi,
} from "@/infrastructure/api/bookings";
import { FIRST_PAGE } from "./pagination";
import { bookingKeys } from "./queryKeys";

/** Mis reservas: las que pedí (`customer`) o las que me pidieron (`provider`). */
export function useBookings(role: "customer" | "provider") {
  return useInfiniteQuery({
    queryKey: bookingKeys.list(role),
    queryFn: ({ pageParam }) => getBookingsApi(role, pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => getBookingApi(id),
    enabled: id.length > 0,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBookingApi(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

/** Lo que le puede pasar a una reserva después de creada. */
export type BookingAction =
  | { type: "accept"; scheduledFor: string }
  | { type: "decline"; reason: DeclineReason }
  | { type: "complete" }
  | { type: "cancel" };

/**
 * Una sola mutación para las cuatro acciones.
 *
 * El `switch` sobre `action.type` está cubierto por la regla de ESLint
 * `switch-exhaustiveness-check`: si mañana la API añade una acción nueva, esto
 * deja de compilar aquí mismo en vez de fallar en tiempo de ejecución.
 */
export function useBookingAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: BookingAction }) => {
      switch (action.type) {
        case "accept":
          return acceptBookingApi(id, action.scheduledFor);
        case "decline":
          return declineBookingApi(id, action.reason);
        case "complete":
          return completeBookingApi(id);
        case "cancel":
          return cancelBookingApi(id);
      }
    },
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.detail(booking.id) });
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
