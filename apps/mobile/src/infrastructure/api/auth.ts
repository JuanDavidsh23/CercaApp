import {
  actorResponseSchema,
  authResultSchema,
  signInSchema,
  signUpSchema,
  type ActorResponse,
  type AuthResult,
  type SignInInput,
  type SignUpInput,
} from "@cerca/contract";
import { apiFetch } from "./client";
import { saveTokens, clearTokens, getRefreshToken } from "../storage/tokenStorage";

/** POST /auth/sign-in — inicia sesión y guarda los tokens en el almacén seguro. */
export async function signInApi(input: SignInInput): Promise<AuthResult> {
  const validatedInput = signInSchema.parse(input);

  const raw = await apiFetch("/auth/sign-in", {
    method: "POST",
    body: validatedInput,
    requiresAuth: false,
  });

  const result = authResultSchema.parse(raw);
  await saveTokens(result.accessToken, result.refreshToken);
  return result;
}

/** POST /auth/sign-up — crea la cuenta y deja la sesión iniciada. */
export async function signUpApi(input: SignUpInput): Promise<AuthResult> {
  const validatedInput = signUpSchema.parse(input);

  const raw = await apiFetch("/auth/sign-up", {
    method: "POST",
    body: validatedInput,
    requiresAuth: false,
  });

  const result = authResultSchema.parse(raw);
  await saveTokens(result.accessToken, result.refreshToken);
  return result;
}

/**
 * POST /auth/sign-out — revoca el refresh token en el servidor.
 * Los tokens locales se borran pase lo que pase: si el servidor no responde,
 * lo peor que puede ocurrir es que el token caduque solo, pero el teléfono
 * nunca se queda con una sesión abierta que el usuario creía cerrada.
 */
export async function signOutApi(): Promise<void> {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken !== null) {
      await apiFetch("/auth/sign-out", {
        method: "POST",
        body: { refreshToken },
      });
    }
  } finally {
    await clearTokens();
  }
}

/** GET /me — quién soy, según el servidor. Es la única fuente de verdad del actor. */
export async function getMeApi(): Promise<ActorResponse> {
  const raw = await apiFetch("/me");
  return actorResponseSchema.parse(raw);
}

/** POST /me/capacities/provider — añade la capacidad de proveedor a mi cuenta. */
export async function becomeProviderApi(): Promise<ActorResponse> {
  const raw = await apiFetch("/me/capacities/provider", { method: "POST" });
  return actorResponseSchema.parse(raw);
}
