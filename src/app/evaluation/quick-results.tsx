
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import QuickEvaluationResults from "@/components/evaluation/QuickEvaluationResults";

import { useQuickEvaluationFlow } from "@/providers/QuickEvaluationFlowProvider";


export default function QuickEvaluationResultsRoute() {

    const router = useRouter();

    const { t } = useTranslation("evaluation");

    const { result } = useQuickEvaluationFlow();


    useEffect(() => {
        if (!result) {
            router.replace("/evaluation/quick-setup");
        }
    }, [result, router]);


    if (!result) {
        return null;
    }


    return (
        <>
            <Stack.Screen
                options={{
                    title: t("quick.results.title"),
                }}
            />

            <QuickEvaluationResults />
        </>
    );
}

