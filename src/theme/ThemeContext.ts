import { createContext } from "react";

import type { ThemeMode } from "../types/theme";
import type { AppTheme } from "./theme";

export interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext =
  createContext<ThemeContextValue | null>(null);