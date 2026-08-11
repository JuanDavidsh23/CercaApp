import { z } from "zod";
import { getAccessToken } from "../storage/tokenStorage";

// URL base de la API obtenida de las variables de entorno (.env) o fallback para emulador Android
const DEFAULT_API_URL = "http://10.0.2.2:3333/v1";

const errorResponseSchema = z.object({
  message: z.union([z.string(), z.array(z.string())]).optional(),
});

export function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.length > 0) {
    return envUrl;
  }
  return DEFAULT_API_URL;
}

export interface ApiFetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Cliente HTTP genérico para comunicarse con la API del Backend.
 * Retorna la respuesta como `unknown` para que sea validada estrictamente por Zod.
 */
export async function apiFetch(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<unknown> {
  const baseUrl = getApiBaseUrl();
  // Asegura formato de URL limpio
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  // Combina los headers sin hacer aserciones de tipo
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (options.headers) {
    new Headers(options.headers).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  // Si la petición requiere autenticación, incluye el Bearer token
  if (options.requiresAuth !== false) {
    const token = await getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
    try {
      const rawError: unknown = await response.json();
      const parsedError = errorResponseSchema.safeParse(rawError);
      if (parsedError.success && parsedError.data.message) {
        const msg = parsedError.data.message;
        errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;
      }
    } catch {
      // Si la respuesta de error no es JSON, se conserva el mensaje HTTP básico
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta no tiene contenido (204 No Content)
  if (response.status === 204) {
    return null;
  }

  return await response.json();
}
