import React from "react";
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Configuración de variantes visuales del botón usando `class-variance-authority` (cva).
 * Permite alternar estilos (primary, secondary, outline, ghost) de forma limpia y mantenible.
 */
const buttonVariants = cva(
  "min-h-touch rounded-full justify-center items-center px-6 border",
  {
    variants: {
      variant: {
        primary: "bg-brand border-brand",
        secondary: "bg-surface-alt border-default",
        outline: "bg-transparent border-default",
        ghost: "bg-transparent border-transparent",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

/** Variantes de color y peso de fuente para el texto dentro del botón según la variante activa */
const buttonTextVariants = cva("text-base", {
  variants: {
    variant: {
      primary: "text-inverse font-semibold",
      secondary: "text-primary font-semibold",
      outline: "text-primary font-semibold",
      ghost: "text-brand font-medium",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface ButtonProps
  extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
  /** Texto que muestra el botón */
  label: string;
  /** Muestra un indicador de carga (`ActivityIndicator`) y deshabilita toques mientras se completa una petición */
  isLoading?: boolean;
}

/**
 * Componente Reutilizable `Button`: Botón principal con soporte para variantes, indicadores de carga y accesibilidad.
 */
export function Button({
  label,
  variant = "primary",
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  // Deshabilita el botón si está cargando o explicitamente deshabilitado
  const isDisabled = Boolean(isLoading || disabled);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      className={cn(buttonVariants({ variant }), isDisabled && "opacity-50", className)}
      {...props}
    >
      {/* 1. Muestra ActivityIndicator giratorio si isLoading es true */}
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? "#ffffff" : "#6366f1"} />
      ) : (
        /* 2. Muestra el texto de la etiqueta si no está cargando */
        <Text className={buttonTextVariants({ variant })}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
