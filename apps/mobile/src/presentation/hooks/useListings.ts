import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateListingInput } from "@cerca/contract";
import {
  createListingApi,
  getCategoriesApi,
  getListingDetailApi,
  getMyListingsApi,
  pauseListingApi,
  publishListingApi,
  searchListingsApi,
  type SearchListingsParams,
} from "@/infrastructure/api/listings";
import { FIRST_PAGE } from "./pagination";
import { categoryKeys, listingKeys } from "./queryKeys";

/**
 * Hook `useSearchListings`: Búsqueda paginada de anuncios con TanStack Query (`useInfiniteQuery`).
 *
 * ¿Cómo funciona la paginación por cursor?
 * - En lugar de usar `page=1, page=2`, la API usa un token o ID `nextCursor`.
 * - `useInfiniteQuery` pasa el `pageParam` (el cursor) a `searchListingsApi`.
 * - `getNextPageParam` extrae `nextCursor` de la última respuesta obtenida.
 * - Si `nextCursor` es null, se detiene el scroll infinito. Esto permite soportar 5.000+ elementos eficientemente.
 */
export function useSearchListings(params: SearchListingsParams) {
  return useInfiniteQuery({
    queryKey: listingKeys.search(params),
    queryFn: ({ pageParam }) => searchListingsApi({ ...params, cursor: pageParam }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

/** Hook para obtener el detalle de un anuncio específico en caché o servidor. */
export function useListingDetail(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => getListingDetailApi(id),
    enabled: id.length > 0,
  });
}

/** Hook para obtener las categorías siembras por la API. Posee un staleTime de 1 hora. */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategoriesApi,
    staleTime: 1000 * 60 * 60,
  });
}

/** Hook para listar mis anuncios como proveedor. */
export function useMyListings() {
  return useInfiniteQuery({
    queryKey: listingKeys.mine(),
    queryFn: ({ pageParam }) => getMyListingsApi(pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

/**
 * Hook `useCreateListing`: Mutación para publicar anuncios.
 * Al completarse la creación, invalida `listingKeys.mine()` para forzar a la app a refetchear mis anuncios.
 */
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListingInput) => createListingApi(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
    },
  });
}

/**
 * Hook `useChangeListingStatus`: Mutación para publicar o pausar un anuncio.
 *
 * ¿Cómo funciona la Invalidación de Caché coordinada? (Regla 11 de AGENTS.md)
 * Cuando un anuncio cambia de estado (ej. se pausa):
 * 1. Invalida el detalle específico (`listingKeys.detail(id)`).
 * 2. Invalida la lista del proveedor (`listingKeys.mine()`).
 * 3. Invalida las búsquedas públicas (`listingKeys.all`), para que el anuncio pausado ya no aparezca a otros usuarios.
 */
export function useChangeListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "publish" | "pause" }) =>
      action === "publish" ? publishListingApi(id) : pauseListingApi(id),
    onSuccess: (listing) => {
      void queryClient.invalidateQueries({ queryKey: listingKeys.detail(listing.id) });
      void queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
      void queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}
