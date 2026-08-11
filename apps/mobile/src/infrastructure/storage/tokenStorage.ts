import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "cerca_access_token";
const REFRESH_TOKEN_KEY = "cerca_refresh_token";

/**
 * Guarda los tokens de sesión de manera segura en el dispositivo
 */
export async function saveTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Obtiene el token de acceso guardado
 */
export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

/**
 * Obtiene el token de refresco guardado
 */
export async function getRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Elimina los tokens guardados (al cerrar sesión)
 */
export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
