/**
 * El cursor de la primera página es "ninguno".
 *
 * Va como constante con el tipo escrito a mano por un motivo concreto: si le
 * pasáramos `undefined` suelto a `initialPageParam`, TypeScript deduciría que el
 * cursor SIEMPRE es `undefined` y luego se quejaría al devolver el `nextCursor`
 * de la página siguiente, que sí es un string.
 */
export const FIRST_PAGE: string | undefined = undefined;
