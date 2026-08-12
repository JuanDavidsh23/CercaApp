import { z } from "zod";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../storage/tokenStorage";

// URL base de la API. Se lee del .env (EXPO_PUBLIC_API_URL) y si no existe usamos
// 10.0.2.2, que es como el emulador de Android llama al "localhost" de tu PC.
const DEFAULT_API_URL = "http://10.0.2.2:3333/v1";

export function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl !== undefined && envUrl.length > 0) {
    return envUrl;
  }
  return DEFAULT_API_URL;
}

/**
 * Formato de error de la API (RFC 9457 "problem+json").
 * Ejemplo real: { status: 403, code: "REVIEW_NOT_ALLOWED", reason: "window_closed", ... }
 */
const problemSchema = z.object({
  status: z.number().optional(),
  title: z.string().optional(),
  detail: z.string().optional(),
  code: z.string().optional(),
  reason: z.string().optional(),
});

/**
 * Error de la API con la información que necesitan las pantallas.
 * `code` y `reason` los pone el servidor y sirven como clave de traducción,
 * para no mostrar textos en inglés que vienen del backend.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly reason: string | undefined;

  constructor(status: number, code: string, detail: string, reason?: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.reason = reason;
  }
}

/** Error de red: el teléfono no pudo siquiera hablar con el servidor. */
export class NetworkError extends Error {
  constructor() {
    super("network_unreachable");
    this.name = "NetworkError";
  }
}

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  /** Objeto plano; aquí se convierte a JSON. */
  body?: unknown;
  /** Parámetros de la query string (?lat=...&lng=...). Los `undefined` se ignoran. */
  query?: Record<string, string | number | undefined>;
  /** Por defecto true. Ponlo en false en endpoints públicos (sign-in, búsqueda). */
  requiresAuth?: boolean;
  /** Obligatorio en POST /bookings y POST /bookings/:id/review. */
  idempotencyKey?: string;
}

/** Construye "/listings?lat=6.24&limit=20" ignorando los valores vacíos. */
function buildUrl(
  path: string,
  query?: Record<string, string | number | undefined>,
): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${cleanPath}`;

  if (!query) return url;

  const parts: string[] = [];
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  return parts.length > 0 ? `${url}?${parts.join("&")}` : url;
}

async function buildHeaders(options: ApiFetchOptions): Promise<Headers> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (options.idempotencyKey !== undefined) {
    headers.set("Idempotency-Key", options.idempotencyKey);
  }

  if (options.requiresAuth !== false) {
    const token = await getAccessToken();
    if (token !== null) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

/** Convierte la respuesta de error del servidor en un ApiError legible. */
async function toApiError(response: Response): Promise<ApiError> {
  let code = `HTTP_${response.status}`;
  let detail = response.statusText;
  let reason: string | undefined;

  try {
    const raw: unknown = await response.json();
    const parsed = problemSchema.safeParse(raw);
    if (parsed.success) {
      code = parsed.data.code ?? code;
      detail = parsed.data.detail ?? parsed.data.title ?? detail;
      reason = parsed.data.reason;
    }
  } catch {
    // El cuerpo del error no era JSON; nos quedamos con el mensaje HTTP básico.
  }

  return new ApiError(response.status, code, detail, reason);
}

// ── Refresco del token ────────────────────────────────────────────────────────
// El access token dura poco. Cuando caduca, la API responde 401 y aquí pedimos uno
// nuevo con el refresh token y reintentamos la petición UNA vez. `refreshInFlight`
// evita que diez peticiones simultáneas disparen diez refrescos a la vez.

const refreshResultSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

let refreshInFlight: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (refreshToken === null) return false;

  const response = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    // El refresh token también murió (o fue reutilizado): hay que volver a entrar.
    await clearTokens();
    return false;
  }

  const raw: unknown = await response.json();
  const parsed = refreshResultSchema.safeParse(raw);
  if (!parsed.success) {
    await clearTokens();
    return false;
  }

  await saveTokens(parsed.data.accessToken, parsed.data.refreshToken);
  return true;
}

function refreshTokens(): Promise<boolean> {
  refreshInFlight ??= doRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/**
 * Cliente HTTP de la API.
 * Devuelve `unknown` a propósito: cada adaptador valida la respuesta con Zod
 * antes de que los datos entren en la app (regla 7 de AGENTS.md).
 */
export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<unknown> {
  const url = buildUrl(path, options.query);

  const send = async (): Promise<Response> => {
    const headers = await buildHeaders(options);
    try {
      return await fetch(url, {
        method: options.method ?? "GET",
        headers,
        ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      });
    } catch {
      throw new NetworkError();
    }
  };

  let response = await send();

  // Token caducado: refrescamos y reintentamos una sola vez.
  if (response.status === 401 && options.requiresAuth !== false) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      response = await send();
    }
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

/**
 * Clave para la cabecera Idempotency-Key: identifica UNA acción del usuario.
 * Si el reintento usa la misma clave, el servidor no crea una segunda reserva.
 */
export function newIdempotencyKey(): string {
  const random = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}-${random}`;
}
