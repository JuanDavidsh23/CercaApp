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
 * Búsqueda paginada.
 *
 * `useInfiniteQuery` guarda las páginas ya cargadas y sabe pedir la siguiente:
 * le damos `nextCursor` de la última respuesta y él se encarga del resto. Cuando
 * `nextCursor` es null, deja de pedir. Así la lista puede crecer sin límite sin
 * que el teléfono cargue miles de anuncios de golpe.
 */
export function useSearchListings(params: SearchListingsParams) {
  return useInfiniteQuery({
    queryKey: listingKeys.search(params),
    queryFn: ({ pageParam }) => searchListingsApi({ ...params, cursor: pageParam }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useListingDetail(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => getListingDetailApi(id),
    enabled: id.length > 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategoriesApi,
    // Las categorías casi nunca cambian: no hace falta volver a pedirlas.
    staleTime: 1000 * 60 * 60,
  });
}

export function useMyListings() {
  return useInfiniteQuery({
    queryKey: listingKeys.mine(),
    queryFn: ({ pageParam }) => getMyListingsApi(pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListingInput) => createListingApi(input),
    onSuccess: () => {
      // El anuncio nuevo tiene que aparecer en "Mis anuncios".
      void queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
    },
  });
}

/**
 * Publicar o pausar un anuncio.
 *
 * Al cambiar de estado se invalida su detalle, mi lista y la búsqueda: un anuncio
 * pausado desaparece de los resultados, así que la búsqueda que había en caché
 * ya no es cierta.
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
