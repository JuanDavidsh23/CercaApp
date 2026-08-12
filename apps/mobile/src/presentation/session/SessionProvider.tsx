import React, { createContext, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ActorResponse, SignInInput, SignUpInput } from "@cerca/contract";
import { getMeApi, signInApi, signOutApi, signUpApi } from "@/infrastructure/api/auth";
import { ApiError } from "@/infrastructure/api/client";
import { getAccessToken } from "@/infrastructure/storage/tokenStorage";
import { sessionKeys } from "@/presentation/hooks/queryKeys";

/**
 * Quién está usando la app, según el servidor.
 * `actor === null` significa "no hay sesión". `isLoading` es el arranque:
 * mientras leemos el token guardado todavía no sabemos si hay sesión o no.
 */
interface SessionValue {
  actor: ActorResponse | null;
  isLoading: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

/**
 * Carga el actor al arrancar.
 *
 * El token guardado NO nos dice quiénes somos: podría estar caducado o revocado.
 * Por eso preguntamos a GET /me. Si el servidor responde 401, la sesión no vale y
 * el actor es `null`. Cualquier otro error (por ejemplo, la API apagada) sí se
 * propaga, para no hacer creer al usuario que se le cerró la sesión.
 */
async function loadActor(): Promise<ActorResponse | null> {
  const token = await getAccessToken();
  if (token === null) return null;

  try {
    return await getMeApi();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: sessionKeys.me(),
    queryFn: loadActor,
    retry: false,
    staleTime: Infinity,
  });

  const signInMutation = useMutation({
    mutationFn: signInApi,
    onSuccess: (result) => {
      queryClient.setQueryData(sessionKeys.me(), result.actor);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUpApi,
    onSuccess: (result) => {
      queryClient.setQueryData(sessionKeys.me(), result.actor);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: signOutApi,
    onSettled: () => {
      // Se limpia la caché entera: los datos del usuario anterior no pueden
      // quedar visibles para el siguiente que entre en este teléfono.
      queryClient.setQueryData(sessionKeys.me(), null);
      queryClient.clear();
    },
  });

  const value = useMemo<SessionValue>(
    () => ({
      actor: meQuery.data ?? null,
      isLoading: meQuery.isPending,
      signIn: async (input) => {
        await signInMutation.mutateAsync(input);
      },
      signUp: async (input) => {
        await signUpMutation.mutateAsync(input);
      },
      signOut: async () => {
        await signOutMutation.mutateAsync();
      },
    }),
    [meQuery.data, meQuery.isPending, signInMutation, signUpMutation, signOutMutation],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Lee la sesión desde cualquier pantalla. */
export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (value === null) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return value;
}
