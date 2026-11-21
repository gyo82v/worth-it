import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import AdvancedEvaluation from "@/components/evaluation/AdvancedEvaluation";

export default function AdvancedEvaluationRoute() {
  const { t } = useTranslation("evaluation");

  return (
    <>
      <Stack.Screen options={{ title: t("advanced.title") }} />
      <AdvancedEvaluation />
    </>
  );
}