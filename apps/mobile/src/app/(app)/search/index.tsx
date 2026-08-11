import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { Money } from "@cerca/contract";
import { localeForLanguage } from "@/presentation/i18n";
import { SearchBar } from "@/presentation/components/ui/SearchBar";
import { CategoryPills } from "@/presentation/components/ui/CategoryPills";
import { ServiceCard } from "@/presentation/components/ui/ServiceCard";

type CategoryId = "all" | "plumbing" | "electrical" | "cleaning" | "tutoring" | "pets";

interface MockService {
  id: string;
  titleKey: string;
  providerName: string;
  price: Money;
  rating: number;
  categoryId: Exclude<CategoryId, "all">;
}

const CATEGORY_IDS: readonly CategoryId[] = [
  "all",
  "plumbing",
  "electrical",
  "cleaning",
  "tutoring",
  "pets",
];

const CATEGORY_ID_SET: ReadonlySet<string> = new Set(CATEGORY_IDS);

// Comprobación de tipo (Type Guard) para validar si una categoría es válida
function isCategoryId(value: string): value is CategoryId {
  return CATEGORY_ID_SET.has(value);
}

// Datos de prueba (mock) de los servicios disponibles en Cerca
const MOCK_SERVICES: readonly MockService[] = [
  {
    id: "1",
    titleKey: "listings.mock.pipeRepair",
    providerName: "Carlos Pérez",
    price: { amountMinor: 4500, currency: "USD" },
    rating: 4.8,
    categoryId: "plumbing",
  },
  {
    id: "2",
    titleKey: "listings.mock.electricalInstall",
    providerName: "Juan Gómez",
    price: { amountMinor: 6000, currency: "USD" },
    rating: 4.9,
    categoryId: "electrical",
  },
  {
    id: "3",
    titleKey: "listings.mock.deepCleaning",
    providerName: "María López",
    price: { amountMinor: 3000, currency: "USD" },
    rating: 4.7,
    categoryId: "cleaning",
  },
  {
    id: "4",
    titleKey: "listings.mock.mathTutoring",
    providerName: "Ana Silva",
    price: { amountMinor: 2500, currency: "USD" },
    rating: 5.0,
    categoryId: "tutoring",
  },
  {
    id: "5",
    titleKey: "listings.mock.dogWalking",
    providerName: "David Ruiz",
    price: { amountMinor: 1500, currency: "USD" },
    rating: 4.6,
    categoryId: "pets",
  },
  {
    id: "6",
    titleKey: "listings.mock.drainClearing",
    providerName: "Carlos Pérez",
    price: { amountMinor: 5000, currency: "USD" },
    rating: 4.7,
    categoryId: "plumbing",
  },
];

export default function SearchScreen() {
  // Hook de navegación de Expo Router
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>("all");

  // Memoiza la lista de categorías traducidas para evitar recálculos innecesarios
  const categories = useMemo(
    () =>
      CATEGORY_IDS.map((id) => ({
        id,
        label: t(`search.categories.${id}`),
      })),
    [t],
  );

  // Filtra los servicios según la búsqueda de texto y la categoría seleccionada
  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MOCK_SERVICES.filter((service) => {
      const title = t(service.titleKey);
      const matchesCategory =
        selectedCategoryId === "all" || service.categoryId === selectedCategoryId;
      const matchesSearch =
        query.length === 0 ||
        title.toLowerCase().includes(query) ||
        service.providerName.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategoryId, t]);

  const locale = localeForLanguage(i18n.language);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <StatusBar style="dark" />

      <View className="bg-surface pt-4 pb-2 px-6">
        {/* Fila superior con título y botón de ícono para volver al Login */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-primary mb-1">
              {t("search.title")}
            </Text>
            <Text className="text-secondary">{t("search.subtitle")}</Text>
          </View>

          {/* Botón de solo ícono para salir o volver al Login de manera sencilla */}
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-in")}
            className="w-10 h-10 bg-surface-alt border border-default rounded-full items-center justify-center"
            accessibilityLabel={t("nav.backToLogin")}
          >
            <LogOut size={20} color="#0f172a" />
          </TouchableOpacity>
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
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={(id) => {
            if (isCategoryId(id)) {
              setSelectedCategoryId(id);
            }
          }}
        />
      </View>

      <View className="flex-1 bg-surface-alt pt-2">
        {/* Lista optimizada (FlatList) para renderizar las cartas de servicios */}
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={7}
          renderItem={({ item }) => (
            <ServiceCard
              title={t(item.titleKey)}
              providerName={item.providerName}
              price={item.price}
              rating={item.rating}
              locale={locale}
              // Al presionar la carta, navega al componente de especificaciones detalladas
              onPress={() => {
                router.push(`/(app)/listings/${item.id}`);
              }}
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-tertiary">{t("search.empty")}</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
