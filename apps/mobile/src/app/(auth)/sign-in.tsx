import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    // Simulate API call for Phase 3
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(app)/search");
    }, 1000);
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
              secureTextEntry
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
              onPress={handleSignIn}
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
