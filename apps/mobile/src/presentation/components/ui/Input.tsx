import React, { useState } from "react";
import { View, TextInput, type TextInputProps, Text } from "react-native";
import { cn } from "../../lib/cn";

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export function Input({ icon, label, error, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label ? (
        <Text className="text-sm font-medium text-primary mb-1.5">{label}</Text>
      ) : null}

      <View
        className={cn(
          "flex-row items-center bg-surface rounded-2xl px-4 py-3 min-h-touch border",
          isFocused ? "border-brand" : error ? "border-error" : "border-default",
        )}
      >
        {icon ? <View className="mr-3">{icon}</View> : null}

        <TextInput
          className={cn("flex-1 text-primary text-base", className)}
          placeholderTextColor="#94a3b8"
          accessibilityLabel={label}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </View>

      {error ? <Text className="text-error text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
