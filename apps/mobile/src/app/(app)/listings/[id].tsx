import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  User,
  LogOut,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { formatMoney, type Money } from "@cerca/contract";
import { localeForLanguage } from "@/presentation/i18n";
import { Button } from "@/presentation/components/ui/Button";

interface MockServiceDetail {
  id: string;
  titleKey: string;
  providerName: string;
  price: Money;
  rating: number;
  category: string;
  descriptionKey: string;
  responseTime: string;
  location: string;
}

const DEFAULT_SERVICE: MockServiceDetail = {
  id: "1",
  titleKey: "listings.mock.pipeRepair",
  providerName: "Carlos Pérez",
  price: { amountMinor: 4500, currency: "USD" },
  rating: 4.8,
  category: "Plomería",
  descriptionKey:
    "Reparación profesional de tuberías, fugas de agua y problemas de plomería residencial con garantía de servicio.",
  responseTime: "< 2 horas",
  location: "Zona Centro",
};

// Datos detallados simulados para cada carta de servicio
const MOCK_DETAILS: Record<string, MockServiceDetail> = {
  "1": DEFAULT_SERVICE,
  "2": {
    id: "2",
    titleKey: "listings.mock.electricalInstall",
    providerName: "Juan Gómez",
    price: { amountMinor: 6000, currency: "USD" },
    rating: 4.9,
    category: "Electricidad",
    descriptionKey:
      "Instalación y mantenimiento de tableros eléctricos, cableado residencial y diagnóstico de fallas.",
    responseTime: "< 1 hora",
    location: "Zona Norte",
  },
  "3": {
    id: "3",
    titleKey: "listings.mock.deepCleaning",
    providerName: "María López",
    price: { amountMinor: 3000, currency: "USD" },
    rating: 4.7,
    category: "Limpieza",
    descriptionKey:
      "Servicio completo de limpieza profunda para casas y oficinas, incluye desinfección y productos ecológicos.",
    responseTime: "Mismo día",
    location: "Zona Sur",
  },
  "4": {
    id: "4",
    titleKey: "listings.mock.mathTutoring",
    providerName: "Ana Silva",
    price: { amountMinor: 2500, currency: "USD" },
    rating: 5.0,
    category: "Tutoría",
    descriptionKey:
      "Clases personalizadas de matemáticas para primaria, secundaria y nivel universitario.",
    responseTime: "A convenir",
    location: "En línea / Presencial",
  },
  "5": {
    id: "5",
    titleKey: "listings.mock.dogWalking",
    providerName: "David Ruiz",
    price: { amountMinor: 1500, currency: "USD" },
    rating: 4.6,
    category: "Mascotas",
    descriptionKey:
      "Paseo de perros seguro y divertido con seguimiento en tiempo real y atención personalizada.",
    responseTime: "< 30 mins",
    location: "Parques locales",
  },
  "6": {
    id: "6",
    titleKey: "listings.mock.drainClearing",
    providerName: "Carlos Pérez",
    price: { amountMinor: 5000, currency: "USD" },
    rating: 4.7,
    category: "Plomería",
    descriptionKey:
      "Destape rápido de drenajes y fregaderos con maquinaria especializada sin dañar tuberías.",
    responseTime: "< 1 hora",
    location: "Zona Metro",
  },
};

/**
 * Pantalla de Detalle y Especificaciones de la Carta seleccionada
 */
export default function ListingDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  // Obtiene el ID del servicio pasado por la URL dinámica /(app)/listings/[id]
  const { id } = useLocalSearchParams<{ id: string }>();

  // Busca el servicio específico o usa el servicio por defecto sin aserciones
  const selectedService = id ? MOCK_DETAILS[id] : undefined;
  const service: MockServiceDetail = selectedService ?? DEFAULT_SERVICE;
  const locale = localeForLanguage(i18n.language);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      {/* Encabezado con navegación de regreso */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-default bg-surface">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center p-2 -ml-2"
          accessibilityLabel={t("listings.detail.back")}
        >
          <ArrowLeft size={20} color="#0f172a" />
          <Text className="text-sm font-semibold text-primary ml-1">
            {t("listings.detail.back")}
          </Text>
        </TouchableOpacity>

        {/* Botón de ícono para volver al Login */}
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-in")}
          className="w-10 h-10 bg-surface-alt border border-default rounded-full items-center justify-center"
          accessibilityLabel={t("nav.backToLogin")}
        >
          <LogOut size={18} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título e información básica */}
        <View className="mb-6">
          <View className="bg-brand/10 self-start px-3 py-1 rounded-full mb-3">
            <Text className="text-brand font-bold text-xs uppercase">
              {service.category}
            </Text>
          </View>
          <Text className="text-3xl font-bold text-primary mb-2">
            {t(service.titleKey)}
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            {/* Formato de precio estricto según la moneda */}
            <Text className="text-2xl font-bold text-brand">
              {formatMoney(service.price, locale)}
            </Text>

            <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-amber-800 font-bold text-sm ml-1.5">
                {service.rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tarjeta con las especificaciones del servicio */}
        <View className="bg-surface-alt rounded-2xl p-5 mb-6 border border-default">
          <Text className="text-lg font-bold text-primary mb-4">
            {t("listings.detail.specifications")}
          </Text>

          <View className="gap-3">
            <View className="flex-row items-center">
              <User size={18} color="#64748b" />
              <Text className="text-secondary text-sm ml-3 font-medium">
                {t("listings.detail.provider")}:{" "}
                <Text className="text-primary font-bold">{service.providerName}</Text>
              </Text>
            </View>

            <View className="flex-row items-center">
              <Clock size={18} color="#64748b" />
              <Text className="text-secondary text-sm ml-3 font-medium">
                Tiempo de respuesta:{" "}
                <Text className="text-primary font-semibold">{service.responseTime}</Text>
              </Text>
            </View>

            <View className="flex-row items-center">
              <MapPin size={18} color="#64748b" />
              <Text className="text-secondary text-sm ml-3 font-medium">
                Ubicación:{" "}
                <Text className="text-primary font-semibold">{service.location}</Text>
              </Text>
            </View>

            <View className="flex-row items-center">
              <ShieldCheck size={18} color="#16a34a" />
              <Text className="text-emerald-700 text-sm ml-3 font-semibold">
                Servicio verificado y garantizado por Cerca
              </Text>
            </View>
          </View>
        </View>

        {/* Descripción extensa */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-primary mb-2">
            {t("listings.detail.description")}
          </Text>
          <Text className="text-secondary text-base leading-6">
            {service.descriptionKey}
          </Text>
        </View>

        {/* Botón de acción para reservar */}
        <Button
          label={t("listings.detail.book")}
          onPress={() => {
            // Acción simulada de reserva
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
