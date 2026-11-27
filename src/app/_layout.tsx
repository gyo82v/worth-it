import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import AppProvider from "@/providers/AppProvider";
import { QuickEvaluationFlowProvider} from "@/providers/QuickEvaluationFlowProvider";

export default function RootLayout() {

  return (
    <AppProvider>
      <QuickEvaluationFlowProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="evaluation/quick" />
        <Stack.Screen name="evaluation/quick-results" />
        <Stack.Screen name="evaluation/advanced" />
      </Stack>
      <StatusBar style="light" />
      </QuickEvaluationFlowProvider>
    </AppProvider>            
  );
}

