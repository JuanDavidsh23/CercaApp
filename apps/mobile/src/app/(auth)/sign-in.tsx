import React, { useState } from "react";
import { Link } from "expo-router";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Pantalla `SignInScreen`: Permite iniciar sesión con correo y contraseña.
 */
export default function SignInScreen() {
  const { t } = useTranslation();
  const { signIn } = useSession();
  const toErrorMessage = useApiErrorMessage();

  // Estados locales para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Procesa el inicio de sesión.
   *
   * ¿Cómo redirige tras el login?
   * No se usa `router.push`: al completarse el login en `useSession`, se actualiza el objeto `actor`.
   * El layout reactivo de `(auth)/_layout.tsx` detecta el `actor !== null` y redirige automáticamente a `/(app)/search`.
   */
  const handleSignIn = async (): Promise<void> => {
    // Validaciones locales previas al envío
    if (email.trim().length === 0 || password.length === 0) {
      setErrorMessage(t("auth.errors.emptyFields"));
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signIn({ email: email.trim(), password });
    } catch (error) {
      // Traduce errores RFC 9457 o de conexión a mensajes i18n comprensibles
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      {/* Evita que el teclado virtual tape los botones e inputs en iOS y Android */}
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
          {/* Cabecera con Título y Subtítulo traducidos con i18n */}
          <View className="mt-12 mb-10">
            <Text className="text-4xl font-bold text-primary mb-2">
              {t("auth.signIn.title")}
            </Text>
            <Text className="text-secondary text-base">{t("auth.signIn.subtitle")}</Text>
          </View>

          {/* Muestra alerta de error devuelta por la API si existe */}
          {errorMessage !== null ? (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4">
              <Text className="text-red-700 text-xs font-semibold text-center leading-5">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Campos del formulario */}
          <View className="mb-6">
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

            <Button
              label={t("auth.signIn.submit")}
              onPress={() => void handleSignIn()}
              isLoading={isLoading}
            />
          </View>

          {/* Enlace para ir al registro */}
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
