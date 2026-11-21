import { Pressable, View } from "react-native";
import { AppText, Card } from "@/components/ui";

interface EvaluationOptionCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onPress: () => void;
}

export default function EvaluationOptionCard({
  title,
  description,
  actionLabel,
  onPress,
}: EvaluationOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}. ${actionLabel}`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Card variant="outlined">
        <View className="gap-3">
          <View className="gap-1">
            <AppText variant="h3">
              {title}
            </AppText>

            <AppText variant="bodySmall" color="muted">
              {description}
            </AppText>
          </View>

          <View className="flex-row justify-end">
            <AppText variant="button" color="primary">
              {actionLabel} →
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
