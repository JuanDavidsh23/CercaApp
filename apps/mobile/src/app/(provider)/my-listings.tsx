import React from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import type { ListingResponse } from "@cerca/contract";
import { localeForLanguage } from "@/presentation/i18n";
import { Button } from "@/presentation/components/ui/Button";
import { MyListingCard } from "@/presentation/components/ui/MyListingCard";
import { useChangeListingStatus, useMyListings } from "@/presentation/hooks/useListings";
import { useApiErrorMessage } from "@/presentation/hooks/useApiErrorMessage";

export default function MyListingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const toErrorMessage = useApiErrorMessage();
  const locale = localeForLanguage(i18n.language);

  const listingsQuery = useMyListings();
  const changeStatus = useChangeListingStatus();

  const listings = (listingsQuery.data?.pages ?? []).flatMap((page) => page.items);

  const changeTo = (id: string, action: "publish" | "pause"): void => {
    changeStatus.mutate(
      { id, action },
      {
        onError: (error) => {
          Alert.alert(t("provider.actionFailed"), toErrorMessage(error));
        },
      },
    );
  };

  const renderItem = ({ item }: { item: ListingResponse }) => (
    <MyListingCard listing={item} locale={locale}>
      {/* Un borrador o un anuncio pausado se pueden publicar; uno publicado, pausar.
          El resto de estados los decide un moderador, no el proveedor. */}
      {item.status === "draft" || item.status === "paused" ? (
        <Button
          label={t("provider.actions.publish")}
          onPress={() => {
            changeTo(item.id, "publish");
          }}
        />
      ) : null}

      {item.status === "published" ? (
        <Button
          label={t("provider.actions.pause")}
          variant="outline"
          onPress={() => {
            changeTo(item.id, "pause");
          }}
        />
      ) : null}
    </MyListingCard>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface-alt" edges={["top"]}>
      <View className="bg-surface px-6 pt-4 pb-4 border-b border-default">
        <Text className="text-3xl font-bold text-primary mb-1">
          {t("provider.myListings.title")}
        </Text>
        <Text className="text-secondary mb-4">{t("provider.myListings.subtitle")}</Text>

        <Button
          label={t("provider.myListings.create")}
          onPress={() => router.push("/(provider)/listings/new")}
        />
      </View>

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
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={7}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (listingsQuery.hasNextPage && !listingsQuery.isFetchingNextPage) {
              void listingsQuery.fetchNextPage();
            }
          }}
          refreshing={listingsQuery.isRefetching}
          onRefresh={() => void listingsQuery.refetch()}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-tertiary">{t("provider.myListings.empty")}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
