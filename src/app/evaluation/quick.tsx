import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import QuickEvaluation from "@/components/evaluation/QuickEvaluation";

export default function QuickEvaluationRoute() {
  const { t } = useTranslation("evaluation");

  return (
    <>
      <Stack.Screen options={{ title: t("quick.title") }} />
      <QuickEvaluation />
    </>
  );
}