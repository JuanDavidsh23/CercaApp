import { z } from "zod";
import {
  categoryResponseSchema,
  createListingSchema,
  listingResponseSchema,
  listingSearchItemSchema,
  type CategoryResponse,
  type CreateListingInput,
  type ListingResponse,
  type ListingSearchItem,
  type Page,
} from "@cerca/contract";
import { apiFetch } from "./client";

/**
 * La API pagina por CURSOR (keyset), no por número de página: cada respuesta trae
 * los elementos y `nextCursor`, que es "por dónde iba". Cuando llega `null`, se acabó.
 * El tipo `Page<T>` lo define @cerca/contract, el mismo paquete que usa el backend.
 */

/** Construye el schema de una página para cualquier tipo de elemento. */
function pageSchemaOf<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  });
}

const listingPageSchema = pageSchemaOf(listingSearchItemSchema);
const myListingPageSchema = pageSchemaOf(listingResponseSchema);
const categoryListSchema = z.array(categoryResponseSchema);

/**
 * Los `| undefined` están escritos a propósito: el proyecto usa
 * `exactOptionalPropertyTypes`, que distingue entre "no paso la propiedad" y
 * "la paso valiendo undefined". Aquí la pantalla sí manda `query: undefined`
 * cuando el buscador está vacío, así que el tipo tiene que permitirlo.
 */
export interface SearchListingsParams {
  query?: string | undefined;
  categoryId?: string | undefined;
  /**
   * Desde dónde se busca. La API EXIGE un punto de partida: o las coordenadas
   * del teléfono, o el `cityId` de una de sus ciudades conocidas (bogota,
   * medellin, cali, barranquilla, cartagena, bucaramanga). Si no llega ninguno
   * responde 422 LOCATION_REQUIRED.
   */
  lat?: number | undefined;
  lng?: number | undefined;
  cityId?: string | undefined;
  radiusKm?: number | undefined;
  cursor?: string | undefined;
  limit?: number | undefined;
}

/**
 * GET /listings — búsqueda pública, ordenada por distancia.
 * Es el endpoint que el README llama "la consulta dominante: cerca de mí".
 */
export async function searchListingsApi(
  params: SearchListingsParams = {},
): Promise<Page<ListingSearchItem>> {
  const raw = await apiFetch("/listings", {
    requiresAuth: false,
    query: {
      query: params.query,
      categoryId: params.categoryId,
      lat: params.lat,
      lng: params.lng,
      cityId: params.cityId,
      radiusKm: params.radiusKm,
      cursor: params.cursor,
      limit: params.limit ?? 20,
    },
  });

  return listingPageSchema.parse(raw);
}

/** GET /listings/:id — detalle público de un anuncio. */
export async function getListingDetailApi(id: string): Promise<ListingResponse> {
  const raw = await apiFetch(`/listings/${id}`, { requiresAuth: false });
  return listingResponseSchema.parse(raw);
}

/** GET /categories — las 40 categorías que siembra el backend. */
export async function getCategoriesApi(): Promise<CategoryResponse[]> {
  const raw = await apiFetch("/categories", { requiresAuth: false });
  return categoryListSchema.parse(raw);
}

/** GET /me/listings — mis anuncios como proveedor, en cualquier estado. */
export async function getMyListingsApi(cursor?: string): Promise<Page<ListingResponse>> {
  const raw = await apiFetch("/me/listings", {
    query: { cursor, limit: 20 },
  });
  return myListingPageSchema.parse(raw);
}

/** POST /listings — publica un anuncio nuevo (nace en estado `draft`). */
export async function createListingApi(
  input: CreateListingInput,
): Promise<ListingResponse> {
  const validatedInput = createListingSchema.parse(input);

  const raw = await apiFetch("/listings", {
    method: "POST",
    body: validatedInput,
  });

  return listingResponseSchema.parse(raw);
}

/** POST /listings/:id/publish — pasa el anuncio de borrador a publicado. */
export async function publishListingApi(id: string): Promise<ListingResponse> {
  const raw = await apiFetch(`/listings/${id}/publish`, { method: "POST" });
  return listingResponseSchema.parse(raw);
}

/** POST /listings/:id/pause — deja de mostrarlo en la búsqueda, sin borrarlo. */
export async function pauseListingApi(id: string): Promise<ListingResponse> {
  const raw = await apiFetch(`/listings/${id}/pause`, { method: "POST" });
  return listingResponseSchema.parse(raw);
}
