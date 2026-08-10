import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { cn } from "../../lib/cn";

export interface CategoryPillsProps {
  categories: readonly { id: string; label: string }[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryPills({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row py-4"
      contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
    >
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelect(category.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className={cn(
              "px-5 py-2.5 rounded-full border min-h-touch justify-center",
              isSelected ? "bg-brand border-brand" : "bg-surface border-default",
            )}
          >
            <Text
              className={cn("font-medium", isSelected ? "text-inverse" : "text-primary")}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
