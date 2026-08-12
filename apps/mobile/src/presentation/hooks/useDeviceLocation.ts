import { useEffect, useState } from "react";
import * as Location from "expo-location";

export interface DeviceLocation {
  lat: number;
  lng: number;
}

/**
 * La ubicación del teléfono, para la búsqueda "cerca de mí".
 *
 * Si el usuario no da permiso devolvemos `null` y la búsqueda se hace igual, solo
 * que sin ordenar por distancia. Nunca se bloquea la app por esto.
 *
 * Las coordenadas se redondean a 3 decimales (~100 m) antes de enviarlas: es
 * precisión de sobra para buscar servicios cerca, evita mandar la posición exacta
 * del usuario y hace que la clave de caché se repita entre búsquedas parecidas.
 */
export function useDeviceLocation(): {
  location: DeviceLocation | null;
  isLoading: boolean;
} {
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function askForLocation(): Promise<void> {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) return;

        const position = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;

        setLocation({
          lat: Math.round(position.coords.latitude * 1000) / 1000,
          lng: Math.round(position.coords.longitude * 1000) / 1000,
        });
      } catch {
        // Sin GPS o sin permiso: se busca sin coordenadas.
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void askForLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, isLoading };
}
