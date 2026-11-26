
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import { AppScreen, AppText } from "@/components/ui";
import EvaluationOptionCard from "@/components/evaluation/EvaluationOptionCard";

export default function Index() {
  const router = useRouter()
  const { t: tHome } = useTranslation("home");
  const { t: tEvaluation } = useTranslation("evaluation");

  return (
    <AppScreen scrollable>
      <View className="flex-1 gap-6 py-6">
        {/* Page introduction */}
        <View className="gap-2">
          <AppText variant="h1">
            {tHome("title")}
          </AppText>

          <AppText variant="body" color="muted">
            {tHome("description")}
          </AppText>
        </View>

        {/* Evaluation options */}
        <View className="gap-4">
          <EvaluationOptionCard
            title={tEvaluation("quick.title")}
            description={tEvaluation("quick.description")}
            actionLabel={tEvaluation("start")}
            onPress={() => router.push("/evaluation/quick-setup")}
          />

          <EvaluationOptionCard
            title={tEvaluation("advanced.title")}
            description={tEvaluation("advanced.description")}
            actionLabel={tEvaluation("start")}
            onPress={() => router.push("/evaluation/advanced")}
          />
        </View>
      </View>
    </AppScreen>
  );
}




