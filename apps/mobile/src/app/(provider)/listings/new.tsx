import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import type { CreateListingInput, Pricing } from "@cerca/contract";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { CategoryPills } from "@/presentation/components/ui/CategoryPills";
import { useCategories, useCreateListing } from "@/presentation/hooks/useListings";
import { useDeviceLocation } from "@/presentation/hooks/useDeviceLocation";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { parseMoney } from "@/presentation/lib/money";

/** Los tres modelos de precio que acepta el contrato. */
const PRICING_MODELS = ["fixed", "hourly", "quote"] as const;
type PricingModel = (typeof PRICING_MODELS)[number];

/** Monedas ofrecidas. La base de datos de ejemplo trabaja en pesos colombianos. */
const CURRENCIES = ["COP", "USD", "MXN", "EUR"] as const;

/**
 * Si el teléfono no da su ubicación, el anuncio se coloca en el centro de Medellín,
 * que es la ciudad con la que viene sembrada la base de datos. La API exige unas
 * coordenadas, así que sin esto no se podría publicar nada desde un emulador.
 */
const FALLBACK_LOCATION = { lat: 6.2442, lng: -75.5812 };

export default function NewListingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const toErrorMessage = useApiErrorMessage();

  const categoriesQuery = useCategories();
  const createListing = useCreateListing();
  const { location } = useDeviceLocation();

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState<PricingModel>("fixed");
  const [currency, setCurrency] = useState<string>("COP");
  const [amount, setAmount] = useState("");
  const [minimumHours, setMinimumHours] = useState("1");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Construye el precio según el modelo elegido.
   * Devuelve `null` si falta algo, y el mensaje de error lo pone quien llama.
   */
  const buildPricing = (): Pricing | null => {
    const money = parseMoney(amount, currency);

    if (model === "fixed") {
      return money === null ? null : { model: "fixed", price: money };
    }

    if (model === "hourly") {
      const hours = Number.parseInt(minimumHours, 10);
      if (money === null || !Number.isInteger(hours) || hours < 1 || hours > 12) {
        return null;
      }
      return { model: "hourly", hourlyRate: money, minimumHours: hours };
    }

    // "A convenir": el precio de partida es opcional.
    return money === null ? { model: "quote" } : { model: "quote", startingFrom: money };
  };

  const handleCreate = async (): Promise<void> => {
    if (categoryId.length === 0) {
      setErrorMessage(t("provider.newListing.errors.noCategory"));
      return;
    }

    if (title.trim().length < 3 || description.trim().length === 0) {
      setErrorMessage(t("provider.newListing.errors.incomplete"));
      return;
    }

    const pricing = buildPricing();
    if (pricing === null) {
      setErrorMessage(t("provider.newListing.errors.badPricing"));
      return;
    }

    setErrorMessage(null);

    const input: CreateListingInput = {
      categoryId,
      title: title.trim(),
      description: description.trim(),
      pricing,
      location: location ?? FALLBACK_LOCATION,
    };

    try {
      await createListing.mutateAsync(input);
      // El anuncio nace como borrador: se publica desde "Mis anuncios".
      router.back();
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  };

  if (categoriesQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-primary mb-2">
          {t("provider.newListing.title")}
        </Text>
        <Text className="text-secondary mb-6">{t("provider.newListing.subtitle")}</Text>

        {errorMessage !== null ? (
          <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4">
            <Text className="text-red-700 text-xs font-semibold text-center leading-5">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <Text className="text-sm font-medium text-primary mb-1.5">
          {t("provider.newListing.categoryLabel")}
        </Text>
        <View className="-mx-6 mb-4">
          <CategoryPills
            categories={(categoriesQuery.data ?? []).map((category) => ({
              id: category.id,
              label: category.name,
            }))}
            selectedCategoryId={categoryId}
            onSelect={setCategoryId}
          />
        </View>

        <Input
          label={t("provider.newListing.titleLabel")}
          placeholder={t("provider.newListing.titlePlaceholder")}
          value={title}
          onChangeText={setTitle}
          maxLength={120}
        />

        <Text className="text-sm font-medium text-primary mb-1.5">
          {t("provider.newListing.descriptionLabel")}
        </Text>
        <TextInput
          className="bg-surface border border-default rounded-2xl p-4 text-primary min-h-[120px] mb-4"
          placeholder={t("provider.newListing.descriptionPlaceholder")}
          placeholderTextColor="#94a3b8"
          multiline
          textAlignVertical="top"
          maxLength={4000}
          value={description}
          onChangeText={setDescription}
          accessibilityLabel={t("provider.newListing.descriptionLabel")}
        />

        <Text className="text-sm font-medium text-primary mb-1.5">
          {t("provider.newListing.pricingLabel")}
        </Text>
        <View className="-mx-6 mb-2">
          <CategoryPills
            categories={PRICING_MODELS.map((id) => ({
              id,
              label: t(`provider.newListing.pricingModels.${id}`),
            }))}
            selectedCategoryId={model}
            onSelect={(id) => {
              if (id === "fixed" || id === "hourly" || id === "quote") setModel(id);
            }}
          />
        </View>

        <View className="-mx-6 mb-2">
          <CategoryPills
            categories={CURRENCIES.map((id) => ({ id, label: id }))}
            selectedCategoryId={currency}
            onSelect={setCurrency}
          />
        </View>

        <Input
          label={t("provider.newListing.amountLabel")}
          placeholder={t("provider.newListing.amountPlaceholder")}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        {model === "hourly" ? (
          <Input
            label={t("provider.newListing.minimumHoursLabel")}
            keyboardType="number-pad"
            value={minimumHours}
            onChangeText={setMinimumHours}
          />
        ) : null}

        {location === null ? (
          <Text className="text-tertiary text-xs mb-4">
            {t("provider.newListing.locationFallback")}
          </Text>
        ) : null}

        <Button
          label={t("provider.newListing.submit")}
          isLoading={createListing.isPending}
          onPress={() => void handleCreate()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
