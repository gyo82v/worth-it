import { ReactNode } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/theme";

export type CardVariant =
  | "filled"
  | "outlined"
  | "elevated";

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export default function Card({
  children,
  variant = "filled",
  style,
}: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      className={`
        rounded-xl
        p-4
        ${variant === "outlined" ? "border" : ""}
        ${variant === "elevated" ? "shadow-md" : ""}
      `}
      style={[
        {
          backgroundColor: theme.surface,
          ...(variant === "outlined"
            ? {
                borderColor: theme.border,
              }
            : {}),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}