import React, { useState } from "react";
import { Link } from "expo-router";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { Capacity } from "@cerca/contract";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { CategoryPills } from "@/presentation/components/ui/CategoryPills";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";
import { useSession } from "@/presentation/session/SessionProvider";

/**
 * Qué quiere hacer el usuario en Cerca.
 *
 * No es un "rol": una cuenta puede contratar Y ofrecer servicios a la vez, por eso
 * el contrato guarda una LISTA de capacidades. Quien elige "ofrecer" también puede
 * contratar, así que se le dan las dos.
 */
const ACCOUNT_TYPES = [
  { id: "customer", capacities: ["customer"] },
  { id: "provider", capacities: ["customer", "provider"] },
] as const satisfies readonly { id: string; capacities: readonly Capacity[] }[];

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { signUp } = useSession();
  const toErrorMessage = useApiErrorMessage();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountTypeId, setAccountTypeId] = useState<string>("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async (): Promise<void> => {
    if (displayName.trim().length === 0 || email.trim().length === 0) {
      setErrorMessage(t("auth.errors.emptyFields"));
      return;
    }

    // La API exige 8 caracteres. Avisamos antes de gastar una petición.
    if (password.length < 8) {
      setErrorMessage(t("auth.errors.passwordTooShort"));
      return;
    }

    const selected = ACCOUNT_TYPES.find((type) => type.id === accountTypeId);
    if (selected === undefined) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signUp({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        capacities: [...selected.capacities],
      });
      // Con la sesión ya iniciada, el layout de (auth) redirige a la búsqueda.
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsLoading(false);
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
          <View className="mt-12 mb-8">
            <Text className="text-4xl font-bold text-primary mb-2">
              {t("auth.signUp.title")}
            </Text>
            <Text className="text-secondary text-base">{t("auth.signUp.subtitle")}</Text>
          </View>

          {errorMessage !== null ? (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4">
              <Text className="text-red-700 text-xs font-semibold text-center leading-5">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Input
            label={t("auth.signUp.nameLabel")}
            placeholder={t("auth.signUp.namePlaceholder")}
            value={displayName}
            onChangeText={setDisplayName}
            icon={<User size={20} color="#94a3b8" />}
          />

          <Input
            label={t("auth.signIn.emailLabel")}
            placeholder={t("auth.signIn.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            icon={<Mail size={20} color="#94a3b8" />}
          />

          <Input
            label={t("auth.signIn.passwordLabel")}
            placeholder={t("auth.signUp.passwordPlaceholder")}
            isPassword
            value={password}
            onChangeText={setPassword}
            icon={<Lock size={20} color="#94a3b8" />}
          />

          <Text className="text-sm font-medium text-primary mb-1.5 mt-2">
            {t("auth.signUp.accountTypeLabel")}
          </Text>
          <View className="-mx-6 mb-6">
            <CategoryPills
              categories={ACCOUNT_TYPES.map((type) => ({
                id: type.id,
                label: t(`auth.signUp.accountType.${type.id}`),
              }))}
              selectedCategoryId={accountTypeId}
              onSelect={setAccountTypeId}
            />
          </View>

          <Button
            label={t("auth.signUp.submit")}
            onPress={() => void handleSignUp()}
            isLoading={isLoading}
          />

          <View className="flex-row justify-center mt-auto pt-6">
            <Text className="text-secondary">{t("auth.signUp.hasAccount")} </Text>
            <Link href="/(auth)/sign-in">
              <Text className="text-brand font-bold">{t("auth.signUp.signInLink")}</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
