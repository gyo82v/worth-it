import { ReactNode } from "react";
import {
  Text,
  StyleProp,
  TextStyle,
} from "react-native";
import type { ThemeColor } from "@/theme/theme";
import { useTheme } from "@/theme";
import {
  displayStyle,
  h1Style,
  h2Style,
  h3Style,
  titleStyle,
  bodyStyle,
  bodySmallStyle,
  captionStyle,
  buttonStyle,
  labelStyle,
} from "@/styles/typography";

interface AppTextProps {
  children: ReactNode;
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "title"
    | "body"
    | "bodySmall"
    | "caption"
    | "button"
    | "label";
  align?: "left" | "center" | "right";
  color?: ThemeColor;
  style?: StyleProp<TextStyle>;
}

const typographyStyles = {
  display: displayStyle,
  h1: h1Style,
  h2: h2Style,
  h3: h3Style,
  title: titleStyle,
  body: bodyStyle,
  bodySmall: bodySmallStyle,
  caption: captionStyle,
  button: buttonStyle,
  label: labelStyle,
};

const alignmentStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export default function AppText({
  children,
  variant = "body",
  align = "left",
  color = "foreground",
  style,
}: AppTextProps) {
  const { theme } = useTheme();

  return (
    <Text
      className={`${typographyStyles[variant]} ${alignmentStyles[align]}`}
      style={[
        {
          color: theme[color],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}