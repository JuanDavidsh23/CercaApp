import type { SearchListingsParams } from "@/infrastructure/api/listings";

/**
 * Claves de TanStack Query, en forma de árbol (regla 11 de AGENTS.md).
 *
 * La gracia del árbol es poder invalidar por ramas: `listingKeys.all` invalida
 * TODO lo de anuncios, mientras que `listingKeys.detail(id)` invalida uno solo.
 * Si las claves fueran strings sueltos habría que acordarse de cada una.
 */
export const sessionKeys = {
  all: ["session"] as const,
  me: () => [...sessionKeys.all, "me"] as const,
};

export const listingKeys = {
  all: ["listings"] as const,
  search: (params: SearchListingsParams) =>
    [...listingKeys.all, "search", params] as const,
  detail: (id: string) => [...listingKeys.all, "detail", id] as const,
  mine: () => [...listingKeys.all, "mine"] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
};

export const bookingKeys = {
  all: ["bookings"] as const,
  list: (role: "customer" | "provider") => [...bookingKeys.all, "list", role] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,
  forListing: (listingId: string) => [...reviewKeys.all, "listing", listingId] as const,
};
