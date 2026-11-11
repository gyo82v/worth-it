import { ReactNode } from "react";
import ThemeProvider  from "@/theme/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
