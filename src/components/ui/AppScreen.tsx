import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

interface AppScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  center?: boolean;
}

export default function AppScreen({
  children,
  scrollable = false,
  padded = true,
  center = false,
}: AppScreenProps) {
  const { theme } = useTheme();

  const content = (
    <View
      className={`
        flex-1
        ${padded ? "px-4" : ""}
        ${center ? "items-center justify-center" : ""}
      `}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={{
    flex: 1,
    backgroundColor: theme.background,
  }}
      edges={["top", "bottom"]}
    >
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}