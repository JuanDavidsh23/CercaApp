import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { CalendarDays, LogOut, Briefcase } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { can, type ListingSearchItem } from "@cerca/contract";
import { localeForLanguage } from "@/presentation/i18n";
import { SearchBar } from "@/presentation/components/ui/SearchBar";
import { CategoryPills } from "@/presentation/components/ui/CategoryPills";
import { ServiceCard } from "@/presentation/components/ui/ServiceCard";
import { useCategories, useSearchListings } from "@/presentation/hooks/useListings";
import { useDebouncedValue } from "@/presentation/hooks/useDebouncedValue";
import { useDeviceLocation } from "@/presentation/hooks/useDeviceLocation";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { useSession } from "@/presentation/session/SessionProvider";

/** Id que usamos para la píldora "Todas". No es una categoría real de la API. */
const ALL_CATEGORIES = "all";

/**
 * Desde dónde se busca cuando no hay permiso de ubicación.
 * La API acepta estas ciudades: bogota, medellin, cali, barranquilla,
 * cartagena y bucaramanga.
 */
const DEFAULT_CITY_ID = "medellin";

/**
 * Pantalla Principal `SearchScreen`: Búsqueda de servicios "Cerca de Mí" ordenados por geolocalización.
 */
export default function SearchScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { actor, signOut } = useSession();
  const toErrorMessage = useApiErrorMessage();

  // Estado del texto del buscador y categoría seleccionada
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL_CATEGORIES);

  // 1. Debounce: Espera 300ms tras dejar de escribir antes de enviar la consulta al servidor (Optimización de red)
  const debouncedQuery = useDebouncedValue(searchQuery);

  // 2. Ubicación GPS: Pide permisos y obtiene lat/lng del dispositivo
  const { location } = useDeviceLocation();

  const categoriesQuery = useCategories();

  // 3. Consulta Paginada a la API (`useSearchListings`):
  // Si no hay GPS activo (`location === null`), se envía `cityId: "medellin"` como fallback para evitar el error 422 LOCATION_REQUIRED.
  const listingsQuery = useSearchListings({
    query: debouncedQuery.trim().length > 0 ? debouncedQuery.trim() : undefined,
    categoryId: selectedCategoryId === ALL_CATEGORIES ? undefined : selectedCategoryId,
    lat: location?.lat,
    lng: location?.lng,
    cityId: location === null ? DEFAULT_CITY_ID : undefined,
    radiusKm: 25,
  });

  // Une las categorías recibidas de la API agregando "Todas" al inicio
  const categoryPills = useMemo(
    () => [
      { id: ALL_CATEGORIES, label: t("search.categories.all") },
      ...(categoriesQuery.data ?? []).map((category) => ({
        id: category.id,
        label: category.name,
      })),
    ],
    [categoriesQuery.data, t],
  );

  // Aplana todas las páginas recibidas por el cursor en un solo arreglo plano para la FlatList
  const listings = useMemo(
    () => (listingsQuery.data?.pages ?? []).flatMap((page) => page.items),
    [listingsQuery.data],
  );

  const locale = localeForLanguage(i18n.language);

  /** Formatea la distancia calculada por la API (ej. "a 850 m" o "a 1.2 km") */
  const distanceLabel = (meters: number): string => {
    if (meters < 1000) {
      return t("search.distanceMeters", { value: Math.round(meters) });
    }
    return t("search.distanceKm", { value: (meters / 1000).toFixed(1) });
  };

  /** Renderiza cada elemento de la lista con memoización mediante ServiceCard */
  const renderItem = ({ item }: { item: ListingSearchItem }) => (
    <ServiceCard
      title={item.title}
      subtitle={distanceLabel(item.distanceMeters)}
      price={item.priceFrom}
      priceFallback={t("listings.priceOnRequest")}
      rating={item.ratingAvg}
      ratingCount={item.ratingCount}
      locale={locale}
      onPress={() => {
        router.push(`/(app)/listings/${item.id}`);
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <StatusBar style="dark" />

      <View className="bg-surface pt-4 pb-2 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-primary mb-1">
              {t("search.title")}
            </Text>
            <Text className="text-secondary">{t("search.subtitle")}</Text>
          </View>

          <View className="flex-row gap-2">
            {/* Evaluación de Permisos Capa 1 (`can(actor, "listing:create")`):
                Muestra el botón de "Mis Anuncios" solo si la cuenta tiene capacidad de Proveedor. */}
            {actor !== null && can(actor, "listing:create") ? (
              <TouchableOpacity
                onPress={() => router.push("/(provider)/my-listings")}
                className="w-10 h-10 bg-surface-alt border border-default rounded-full items-center justify-center"
                accessibilityLabel={t("nav.myListings")}
              >
                <Briefcase size={18} color="#0f172a" />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => router.push("/(app)/bookings")}
              className="w-10 h-10 bg-surface-alt border border-default rounded-full items-center justify-center"
              accessibilityLabel={t("nav.bookings")}
            >
              <CalendarDays size={18} color="#0f172a" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void signOut()}
              className="w-10 h-10 bg-surface-alt border border-default rounded-full items-center justify-center"
              accessibilityLabel={t("nav.signOut")}
            >
              <LogOut size={18} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        <SearchBar
          placeholder={t("search.placeholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel={t("search.placeholder")}
        />
      </View>

      <View className="bg-surface border-b border-default mb-4">
        <CategoryPills
          categories={categoryPills}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </View>

      <View className="flex-1 bg-surface-alt pt-2">
        {listingsQuery.isPending ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator color="#6366f1" />
          </View>
        ) : listingsQuery.isError ? (
          <View className="items-center justify-center px-6 py-10">
            <Text className="text-error text-center">
              {toErrorMessage(listingsQuery.error)}
            </Text>
          </View>
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            windowSize={7}
            // Al llegar al final se pide la página siguiente por cursor.
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (listingsQuery.hasNextPage && !listingsQuery.isFetchingNextPage) {
                void listingsQuery.fetchNextPage();
              }
            }}
            refreshing={listingsQuery.isRefetching}
            onRefresh={() => void listingsQuery.refetch()}
            ListFooterComponent={
              listingsQuery.isFetchingNextPage ? (
                <ActivityIndicator className="py-4" color="#6366f1" />
              ) : null
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-10">
                <Text className="text-tertiary">{t("search.empty")}</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
