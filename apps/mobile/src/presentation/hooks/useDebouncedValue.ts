import { useEffect, useState } from "react";

/**
 * Devuelve el valor con retraso.
 *
 * Sirve para el buscador: si lanzáramos una petición por cada letra, escribir
 * "fontanero" serían nueve búsquedas. Con esto solo se busca cuando el usuario
 * deja de teclear durante `delayMs`.
 */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    // Si el valor cambia antes de que salte el temporizador, se cancela y empieza otro.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}
