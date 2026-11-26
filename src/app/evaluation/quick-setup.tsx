
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import PersonalisationScreen from "@/components/evaluation/PersonalisationScreen";

import {
    useQuickEvaluationFlow,
} from "@/providers/QuickEvaluationFlowProvider";

import type { EvaluationPreferences } from "@/types/quickEvaluation";


export default function QuickEvaluationSetupRoute() {

    const router = useRouter();
    const { t } = useTranslation("evaluation");

    const { preferences, setPreferences } = useQuickEvaluationFlow();

    function handleContinue(nextPreferences: EvaluationPreferences) {
        setPreferences(nextPreferences);
        router.push("/evaluation/quick");
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: t("quickSetup.navigationTitle", {
                        defaultValue: "Personalise",
                    }),
                }}
            />

            <PersonalisationScreen
                initialPreferences={preferences}
                onContinue={handleContinue}
            />
        </>
    );
}

