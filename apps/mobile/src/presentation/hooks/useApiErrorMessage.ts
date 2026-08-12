import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ApiError, NetworkError } from "@/infrastructure/api/client";

/**
 * Convierte un error en un texto para el usuario, siempre traducido.
 *
 * La API no manda mensajes en el idioma del usuario: manda un `code`
 * ("REVIEW_NOT_ALLOWED") y a veces un `reason` ("window_closed"). Esas son las
 * claves que buscamos en los archivos de traducción; si no tenemos texto para
 * una en concreto, cae en un mensaje genérico. Así nunca se cuela en pantalla
 * una frase en inglés escrita por el backend (regla 1 de AGENTS.md).
 */
export function useApiErrorMessage(): (error: unknown) => string {
  const { t } = useTranslation();

  return useCallback(
    (error: unknown): string => {
      const fallback = t("errors.unknown");

      if (error instanceof NetworkError) {
        return t("errors.network");
      }

      if (error instanceof ApiError) {
        if (error.reason !== undefined) {
          return t(`errors.reason.${error.reason}`, { defaultValue: fallback });
        }
        return t(`errors.code.${error.code}`, { defaultValue: fallback });
      }

      return fallback;
    },
    [t],
  );
}
