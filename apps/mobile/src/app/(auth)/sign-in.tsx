import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { signInApi } from "@/infrastructure/api/auth";

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Maneja el inicio de sesión estricto contra la API del Backend
  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Intenta autenticarse contra la API del backend real
      await signInApi({ email: email.trim(), password });
      setIsLoading(false);
      // Redirige ÚNICAMENTE si la autenticación fue exitosa
      router.replace("/(app)/search");
    } catch (err: unknown) {
      setIsLoading(false);
      const rawMessage = err instanceof Error ? err.message : "Error al iniciar sesión";
      console.error("[Login Error]:", err);

      // Formatea mensajes de error comunes para una respuesta clara en interfaz
      if (
        rawMessage.includes("Network request failed") ||
        rawMessage.includes("Fetch") ||
        rawMessage.includes("Failed to connect")
      ) {
        setErrorMessage(
          "No se pudo conectar al servidor API (http://10.0.2.2:3333/v1). Asegúrate de que el Backend esté escuchando en el puerto 3333.",
        );
      } else if (
        rawMessage.includes("401") ||
        rawMessage.includes("Unauthorized") ||
        rawMessage.includes("invalid")
      ) {
        setErrorMessage("Credenciales incorrectas. Revisa tu correo y contraseña.");
      } else if (rawMessage.includes("invalid_string") || rawMessage.includes("email")) {
        setErrorMessage(
          "Por favor ingresa un correo electrónico válido (ejemplo@dominio.com).",
        );
      } else {
        setErrorMessage(rawMessage);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-12 mb-10">
            <Text className="text-4xl font-bold text-primary mb-2">
              {t("auth.signIn.title")}
            </Text>
            <Text className="text-secondary text-base">{t("auth.signIn.subtitle")}</Text>
          </View>

          {/* Caja de mensaje de error cuando falla la autenticación */}
          {errorMessage ? (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4">
              <Text className="text-red-700 text-xs font-semibold text-center leading-5">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <View className="mb-6">
            {/* Campo para ingresar el correo electrónico */}
            <Input
              label={t("auth.signIn.emailLabel")}
              placeholder={t("auth.signIn.emailPlaceholder")}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              icon={<Mail size={20} color="#94a3b8" />}
            />

            {/* Campo para la contraseña con botón de ojito activado (isPassword) */}
            <Input
              label={t("auth.signIn.passwordLabel")}
              placeholder={t("auth.signIn.passwordPlaceholder")}
              isPassword
              autoComplete="password"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
              icon={<Lock size={20} color="#94a3b8" />}
            />

            <View className="items-end mt-1 mb-6">
              <Link href="/(auth)/sign-in">
                <Text className="text-brand font-medium">
                  {t("auth.signIn.forgotPassword")}
                </Text>
              </Link>
            </View>

            <Button
              label={t("auth.signIn.submit")}
              onPress={() => void handleSignIn()}
              isLoading={isLoading}
            />
          </View>

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-default" />
            <Text className="text-tertiary mx-4">{t("common.or")}</Text>
            <View className="flex-1 h-px bg-default" />
          </View>

          <View className="flex-row gap-4 mb-8">
            <Button
              label={t("auth.signIn.google")}
              variant="outline"
              className="flex-1"
            />
            <Button label={t("auth.signIn.apple")} variant="outline" className="flex-1" />
          </View>

          <View className="flex-row justify-center mt-auto pt-4">
            <Text className="text-secondary">{t("auth.signIn.noAccount")} </Text>
            <Link href="/(auth)/sign-up">
              <Text className="text-brand font-bold">{t("auth.signIn.signUpLink")}</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
