import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import AppProvider from "@/providers/AppProvider";

export default function RootLayout() {

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      </Stack>
      <StatusBar style="light" />
    </AppProvider>            
  );
}

