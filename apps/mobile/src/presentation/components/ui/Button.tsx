import React from "react";
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

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
  label: string;
  isLoading?: boolean;
}

export function Button({
  label,
  variant = "primary",
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
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
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? "#ffffff" : "#6366f1"} />
      ) : (
        <Text className={buttonTextVariants({ variant })}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
