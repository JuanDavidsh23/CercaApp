import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

/**
 * Sign Up screen — placeholder for Phase 3.
 */
export default function SignUpScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-3xl font-bold text-primary">{t("auth.signUp.title")}</Text>
      <Text className="mt-2 text-secondary">{t("auth.signUp.subtitle")}</Text>

      <View className="mt-8 w-full rounded-2xl bg-surface-alt p-6">
        <Text className="text-center text-tertiary">{t("auth.signUp.placeholder")}</Text>
      </View>

      <Link href="/(auth)/sign-in" className="mt-6">
        <Text className="text-brand">
          {t("auth.signUp.hasAccount")} {t("auth.signUp.signInLink")}
        </Text>
      </Link>
    </View>
  );
}
