import { ReactNode, useEffect, useState } from "react";
import { Appearance } from "react-native";

import { useAuth } from "@/providers/AuthProvider";

import { lightTheme, darkTheme } from "./theme";
import { ThemeContext } from "./ThemeContext";

import type { ThemeMode } from "../types/theme";

interface Props {
  children: ReactNode;
}

function getSystemMode(): ThemeMode {
  return Appearance.getColorScheme() === "dark"
    ? "dark"
    : "light";
}

export default function ThemeProvider({ children }: Props) {
  const { profile } = useAuth();

  const [mode, setMode] = useState<ThemeMode>(getSystemMode);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme }) => {
        if (!profile?.theme) {
          setMode(
            colorScheme === "dark"
              ? "dark"
              : "light"
          );
        }
      }
    );

    return () => subscription.remove();
  }, [profile?.theme]);

  useEffect(() => {
    if (profile?.theme) {
      setMode(profile.theme);
      return;
    }

    setMode(getSystemMode());
  }, [profile?.theme]);

  function changeMode(nextMode: ThemeMode) {
    setMode(nextMode);
  }

  const theme =
    mode === "dark"
      ? darkTheme
      : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setMode: changeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}