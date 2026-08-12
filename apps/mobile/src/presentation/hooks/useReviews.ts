import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { WriteReviewInput } from "@cerca/contract";
import { getListingReviewsApi, writeReviewApi } from "@/infrastructure/api/reviews";
import { FIRST_PAGE } from "./pagination";
import { bookingKeys, listingKeys, reviewKeys } from "./queryKeys";

/** Las reseñas públicas de un anuncio. */
export function useListingReviews(listingId: string) {
  return useInfiniteQuery({
    queryKey: reviewKeys.forListing(listingId),
    queryFn: ({ pageParam }) => getListingReviewsApi(listingId, pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: listingId.length > 0,
  });
}

/**
 * Escribir la reseña de una reserva.
 *
 * Al terminar hay que invalidar tres cosas, porque una reseña toca tres sitios:
 * la lista de reseñas del anuncio, la nota media del anuncio y la reserva
 * (que pasa a tener `reviewId` y por tanto ya no se puede volver a reseñar).
 */
export function useWriteReview(bookingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: WriteReviewInput) => writeReviewApi(bookingId, input),
    onSuccess: (review) => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.forListing(review.listingId),
      });
      void queryClient.invalidateQueries({
        queryKey: listingKeys.detail(review.listingId),
      });
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
