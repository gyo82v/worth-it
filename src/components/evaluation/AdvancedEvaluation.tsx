
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppScreen, AppText } from "@/components/ui";

export default function AdvancedEvaluation() {
  const { t } = useTranslation("evaluation");

  return (
    <AppScreen>
      <View className="flex-1 gap-3 py-6">
        <AppText variant="h1">
          {t("advanced.title")}
        </AppText>

        <AppText color="muted">
          Advanced evaluation here
        </AppText>
      </View>
    </AppScreen>
  );
}
