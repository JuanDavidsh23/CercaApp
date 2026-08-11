import React, { useState } from "react";
import {
  View,
  TextInput,
  type TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { cn } from "../../lib/cn";

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  // Prop opcional para indicar si el campo es de tipo contraseña (activa el ojito)
  isPassword?: boolean;
}

export function Input({
  icon,
  label,
  error,
  isPassword,
  className,
  ...props
}: InputProps) {
  // Estado para controlar si el input está enfocado (cambia el color del borde)
  const [isFocused, setIsFocused] = useState(false);
  // Estado para alternar la visibilidad de la contraseña (mostrar/ocultar texto)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determina si el texto debe estar oculto como contraseña
  const shouldHideText = isPassword ? !isPasswordVisible : props.secureTextEntry;

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
          secureTextEntry={shouldHideText}
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

        {/* Botón de ojito para mostrar/ocultar contraseña */}
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-1 ml-2"
            accessibilityLabel={
              isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color="#94a3b8" />
            ) : (
              <Eye size={20} color="#94a3b8" />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text className="text-error text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
