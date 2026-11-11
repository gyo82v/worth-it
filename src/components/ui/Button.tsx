import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/theme";

import AppText from "./AppText";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

export interface ButtonProps {
  children: ReactNode;

  onPress?: () => void;

  variant?: ButtonVariant;

  size?: ButtonSize;

  disabled?: boolean;

  fullWidth?: boolean;

  style?: StyleProp<ViewStyle>;
}

export default function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { theme } = useTheme();

  const sizeStyles = {
    sm: "min-h-9 px-3 py-2",
    md: "min-h-12 px-4 py-3",
    lg: "min-h-14 px-6 py-4",
  };

  const variantStyles = {
    primary: " ",
    secondary: "",
    outline: "border",
    ghost: "",
    destructive: "",
  };

  const textColors = {
    primary: "onPrimary",
    secondary: "foreground",
    outline: "foreground",
    ghost: "primary",
    destructive: "foreground",
  } as const;

  const config = {
    backgroundColor: {
      primary: theme.primary,
      secondary: theme.surfaceSecondary,
      outline: "transparent",
      ghost: "transparent",
      destructive: theme.error,
    },
    textColor: textColors[variant],
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`
        items-center
        justify-center
        rounded-lg
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        disabled:opacity-50
      `}
      style={({ pressed }) => [
        {
          backgroundColor: config.backgroundColor[variant],
          ...(variant === "outline"
            ? {
                borderColor: theme.border,
              }
            : {}),
          ...(pressed && !disabled
            ? {
                opacity: 0.8,
              }
            : {}),
        },
        style,
      ]}
    >
      <AppText
        variant="button"
        color={config.textColor}
      >
        {children}
      </AppText>
    </Pressable>
  );
}