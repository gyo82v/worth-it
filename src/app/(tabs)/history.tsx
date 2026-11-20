import { Text, View } from "react-native";
import AppScreen from "@/components/ui/AppScreen";

export default function History() {
  return (
    <AppScreen center>
      <View style={{ backgroundColor: "#ffffff", padding: 24 }}>
        <Text style={{ color: "#000000", fontSize: 24 }}>
          AppScreen works!
        </Text>
      </View>
    </AppScreen>
  );
}