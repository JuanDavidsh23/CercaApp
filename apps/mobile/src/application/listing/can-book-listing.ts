import {
  canRequestBooking,
  type Actor,
  type Listing,
  type ListingResponse,
  type ListingStatus,
  type RequestBookingEligibility,
} from "@cerca/contract";

/**
 * Traduce el estado "plano" que llega por la red al estado del dominio.
 *
 * La API manda `status: "published"`, mientras que las políticas leen una unión
 * (`{ kind: "published", publishedAt }`). Algunos estados llevan datos extra que
 * ESTA respuesta no incluye —`publishedAt`, quién retiró el anuncio y por qué—,
 * así que se rellenan con lo más cercano que sí tenemos. Ninguna política los
 * lee: todas miran únicamente `kind`.
 */
function toListingStatus(listing: ListingResponse): ListingStatus {
  switch (listing.status) {
    case "draft":
      return { kind: "draft" };
    case "published":
      return { kind: "published", publishedAt: listing.createdAt };
    case "paused":
      return { kind: "paused" };
    case "under_review":
      return { kind: "under_review" };
    case "removed":
      return { kind: "removed", removedById: listing.ownerId, reason: "" };
  }
}

/**
 * ¿Puede este usuario reservar este anuncio?
 *
 * La regla la pone `canRequestBooking` de @cerca/contract, el mismo archivo que
 * ejecuta el backend: no puedes reservarte a ti mismo (`own_listing`) y solo se
 * reserva lo que está publicado (`not_bookable`).
 *
 * Sirve para deshabilitar el botón y explicar por qué. El servidor lo comprueba
 * otra vez cuando llega la petición.
 */
export function canBookListing(
  actor: Actor,
  listing: ListingResponse,
): RequestBookingEligibility {
  const domainListing: Listing = {
    id: listing.id,
    ownerId: listing.ownerId,
    status: toListingStatus(listing),
  };

  return canRequestBooking(actor, domainListing);
}
