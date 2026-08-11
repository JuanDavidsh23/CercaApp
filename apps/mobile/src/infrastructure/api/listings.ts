import { z } from "zod";
import {
  listingResponseSchema,
  listingSearchItemSchema,
  categoryResponseSchema,
  type ListingResponse,
  type ListingSearchItem,
  type CategoryResponse,
} from "@cerca/contract";
import { apiFetch } from "./client";

const listingSearchListSchema = z.array(listingSearchItemSchema);
const categoryListSchema = z.array(categoryResponseSchema);

/**
 * Obtiene la lista de servicios disponibles desde el Backend real
 */
export async function getListingsApi(): Promise<ListingSearchItem[]> {
  const rawData = await apiFetch("/listings", {
    method: "GET",
    requiresAuth: false,
  });

  return listingSearchListSchema.parse(rawData);
}

/**
 * Obtiene el detalle de un servicio por su ID desde el Backend real
 */
export async function getListingDetailApi(id: string): Promise<ListingResponse> {
  const rawData = await apiFetch(`/listings/${id}`, {
    method: "GET",
    requiresAuth: false,
  });

  return listingResponseSchema.parse(rawData);
}

/**
 * Obtiene las categorías disponibles desde el Backend real
 */
export async function getCategoriesApi(): Promise<CategoryResponse[]> {
  const rawData = await apiFetch("/categories", {
    method: "GET",
    requiresAuth: false,
  });

  return categoryListSchema.parse(rawData);
}
