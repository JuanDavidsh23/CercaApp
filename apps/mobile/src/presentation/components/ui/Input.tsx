import React, { useState } from "react";
import {
  View,
  TextInput,
  type TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

/**
 * Props del componente reutilizable `Input`.
 * Hereda todas las propiedades nativas de `TextInputProps` de React Native.
 */
export interface InputProps extends TextInputProps {
  /** Icono opcional a la izquierda del campo de texto */
  icon?: React.ReactNode;
  /** Etiqueta / Título visible arriba del campo */
  label?: string;
  /** Mensaje de error para mostrar en color rojo cuando la validación falla */
  error?: string;
  /** Si es true, habilita el botón de ojito para mostrar/ocultar la contraseña */
  isPassword?: boolean;
}

/**
 * Componente Reutilizable `Input`: Campo de texto estilizado con soporte para iconos, estados de foco y contraseñas.
 */
export function Input({
  icon,
  label,
  error,
  isPassword,
  className,
  ...props
}: InputProps) {
  const { t } = useTranslation();

  // Estado 1: Rastrea si el usuario tiene la casilla enfocada (para resaltar el borde en morado)
  const [isFocused, setIsFocused] = useState(false);

  // Estado 2: Alterna la visibilidad del texto si el campo es de tipo contraseña
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Si `isPassword` es true, oculta el texto solo si `isPasswordVisible` es false.
  const shouldHideText = isPassword ? !isPasswordVisible : props.secureTextEntry;

  return (
    <View className="mb-4">
      {/* 1. Renderiza la etiqueta del campo si fue proporcionada */}
      {label ? (
        <Text className="text-sm font-medium text-primary mb-1.5">{label}</Text>
      ) : null}

      {/* 2. Contenedor del Input: Cambia de color según estado de Foco (brand), Error (error) o Normal (default) */}
      <View
        className={cn(
          "flex-row items-center bg-surface rounded-2xl px-4 py-3 min-h-touch border",
          isFocused ? "border-brand" : error ? "border-error" : "border-default",
        )}
      >
        {/* Renderiza el icono izquierdo si existe */}
        {icon ? <View className="mr-3">{icon}</View> : null}

        {/* Campo de texto nativo de React Native */}
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

        {/* 3. Botón interactivo de Ojito para mostrar/ocultar contraseña */}
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-1 ml-2"
            accessibilityLabel={
              isPasswordVisible ? t("input.hidePassword") : t("input.showPassword")
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

      {/* 4. Muestra el mensaje de error en rojo debajo del input si existe */}
      {error ? <Text className="text-error text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
