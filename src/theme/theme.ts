export const lightTheme = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F5F9",

  foreground: "#0F172A",
  foregroundSecondary: "#475569",
  muted: "#64748B",

  primary: "#0F766E",
  primaryLight: "#14B8A6",
  primaryDark: "#115E59",
  onPrimary: "#FFFFFF",

  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626",

  border: "#CBD5E1",
  divider: "#E2E8F0",
} as const;

export const darkTheme = {
  background: "#020617",
  surface: "#0F172A",
  surfaceSecondary: "#1E293B",

  foreground: "#F8FAFC",
  foregroundSecondary: "#CBD5E1",
  muted: "#94A3B8",

  primary: "#2DD4BF",
  primaryLight: "#5EEAD4",
  primaryDark: "#14B8A6",
  onPrimary: "#042F2E",

  success: "#4ADE80",
  warning: "#FBBF24",
  error: "#F87171",

  border: "#334155",
  divider: "#475569",
} as const;

export type AppTheme = {
  [Key in keyof typeof lightTheme]: string;
};
export type ThemeColor = keyof typeof lightTheme;