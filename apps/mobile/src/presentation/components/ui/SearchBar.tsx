import React from "react";
import { View, TextInput, type TextInputProps } from "react-native";
import { Search } from "lucide-react-native";
import { cn } from "../../lib/cn";

export interface SearchBarProps extends TextInputProps {
  containerClassName?: string;
}

export function SearchBar({ containerClassName, className, ...props }: SearchBarProps) {
  return (
    <View
      className={cn(
        "flex-row items-center bg-surface-alt rounded-2xl px-4 py-3 min-h-touch gap-2",
        containerClassName,
      )}
    >
      <Search size={20} color="#94a3b8" accessibilityElementsHidden />
      <TextInput
        className={cn("flex-1 text-primary text-base", className)}
        placeholderTextColor="#94a3b8"
        returnKeyType="search"
        clearButtonMode="while-editing"
        {...props}
      />
    </View>
  );
}
