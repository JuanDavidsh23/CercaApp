import { z } from "zod";
import {
  authResultSchema,
  signInSchema,
  signUpSchema,
  type AuthResult,
  type SignInInput,
  type SignUpInput,
} from "@cerca/contract";
import { apiFetch } from "./client";
import { saveTokens, clearTokens } from "../storage/tokenStorage";

const fallbackTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

/**
 * Inicia sesión contra la API del backend real
 */
export async function signInApi(input: SignInInput): Promise<AuthResult> {
  // Valida la entrada antes de enviar
  const validatedInput = signInSchema.parse(input);

  const rawData = await apiFetch("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(validatedInput),
    requiresAuth: false,
  });

  // Valida la respuesta de la API con Zod (Rule: Zod at the boundary)
  const parsed = authResultSchema.safeParse(rawData);
  if (parsed.success) {
    await saveTokens(parsed.data.accessToken, parsed.data.refreshToken);
    return parsed.data;
  }

  // Fallback si la API devolvió tokens pero la estructura de actor difiere ligeramente
  const fallbackParsed = fallbackTokensSchema.safeParse(rawData);
  if (fallbackParsed.success) {
    const { accessToken, refreshToken } = fallbackParsed.data;
    await saveTokens(accessToken, refreshToken);
    return {
      accessToken,
      refreshToken,
      actor: {
        id: "00000000-0000-0000-0000-000000000000",
        capacities: ["customer"],
        platformRole: "user",
      },
    };
  }

  throw new Error("Respuesta de autenticación inválida del servidor");
}

/**
 * Registra un nuevo usuario contra la API del backend real
 */
export async function signUpApi(input: SignUpInput): Promise<AuthResult> {
  const validatedInput = signUpSchema.parse(input);

  const rawData = await apiFetch("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(validatedInput),
    requiresAuth: false,
  });

  const authResult = authResultSchema.parse(rawData);
  await saveTokens(authResult.accessToken, authResult.refreshToken);

  return authResult;
}

/**
 * Cierra sesión revocando el token de refresco en la API
 */
export async function signOutApi(refreshToken: string): Promise<void> {
  try {
    await apiFetch("/auth/sign-out", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  } finally {
    // Asegura limpiar los tokens locales siempre
    await clearTokens();
  }
}
