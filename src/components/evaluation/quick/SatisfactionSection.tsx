
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppText } from "@/components/ui";

import RatingQuestion from "../RatingQuestion";

import type { RatingScale } from "../RatingQuestion";
import type {
    Rating,
    QuickEvaluationFormValues,
} from "@/types/quickEvaluation";


// ============================================
// QUESTION TYPES
// ============================================

type SatisfactionQuestion =
    | "colleagues"
    | "management"
    | "workLifeBalance"
    | "stressManageability";


// ============================================
// SATISFACTION SECTION
// ============================================

export default function SatisfactionSection() {

    const { control } =
        useFormContext<QuickEvaluationFormValues>();

    const { t } = useTranslation("evaluation");


    // ========================================
    // RATING SCALES
    // ========================================

    function createScale(
        question: SatisfactionQuestion
    ): RatingScale {

        const base = `quick.satisfaction.questions.${question}.scale`;

        const createOption = (rating: Rating) => ({
            label: t(`${base}.${rating}.label`),
            description: t(`${base}.${rating}.description`),
        });

        return {
            1: createOption(1),
            2: createOption(2),
            3: createOption(3),
            4: createOption(4),
            5: createOption(5),
        };
    }

    const colleaguesScale = createScale("colleagues");
    const managementScale = createScale("management");
    const workLifeBalanceScale = createScale("workLifeBalance");
    const stressManageabilityScale = createScale("stressManageability");


    // ========================================
    // RENDER
    // ========================================

    return (
        <View className="gap-5">

            {/* ================================= */}
            {/* SECTION INTRODUCTION */}
            {/* ================================= */}

            <View className="gap-1">

                <AppText variant="h2">
                    {t("quick.satisfaction.title")}
                </AppText>

                <AppText color="muted">
                    {t("quick.satisfaction.description")}
                </AppText>

            </View>


            {/* ================================= */}
            {/* COLLEAGUES */}
            {/* ================================= */}

            <Controller
                control={control}
                name="satisfaction.colleagues"
                render={({ field: { value, onChange }, fieldState }) => (

                    <RatingQuestion
                        question={t(
                            "quick.satisfaction.questions.colleagues.title"
                        )}
                        helperText={t(
                            "quick.satisfaction.questions.colleagues.helper"
                        )}
                        value={value ?? null}
                        onChange={onChange}
                        scale={colleaguesScale}
                        notApplicableLabel={t("common.notApplicable")}
                        error={
                            fieldState.error
                                ? t("quick.satisfaction.validation.required")
                                : undefined
                        }
                    />

                )}
            />


            {/* ================================= */}
            {/* MANAGEMENT */}
            {/* ================================= */}

            <Controller
                control={control}
                name="satisfaction.management"
                render={({ field: { value, onChange }, fieldState }) => (

                    <RatingQuestion
                        question={t(
                            "quick.satisfaction.questions.management.title"
                        )}
                        helperText={t(
                            "quick.satisfaction.questions.management.helper"
                        )}
                        value={value ?? null}
                        onChange={onChange}
                        scale={managementScale}
                        notApplicableLabel={t("common.notApplicable")}
                        error={
                            fieldState.error
                                ? t("quick.satisfaction.validation.required")
                                : undefined
                        }
                    />

                )}
            />


            {/* ================================= */}
            {/* WORK-LIFE BALANCE */}
            {/* ================================= */}

            <Controller
                control={control}
                name="satisfaction.workLifeBalance"
                render={({ field: { value, onChange }, fieldState }) => (

                    <RatingQuestion
                        question={t(
                            "quick.satisfaction.questions.workLifeBalance.title"
                        )}
                        helperText={t(
                            "quick.satisfaction.questions.workLifeBalance.helper"
                        )}
                        value={value ?? null}
                        onChange={onChange}
                        scale={workLifeBalanceScale}
                        notApplicableLabel={t("common.notApplicable")}
                        error={
                            fieldState.error
                                ? t("quick.satisfaction.validation.required")
                                : undefined
                        }
                    />

                )}
            />


            {/* ================================= */}
            {/* STRESS MANAGEABILITY */}
            {/* ================================= */}

            <Controller
                control={control}
                name="satisfaction.stressManageability"
                render={({ field: { value, onChange }, fieldState }) => (

                    <RatingQuestion
                        question={t(
                            "quick.satisfaction.questions.stressManageability.title"
                        )}
                        helperText={t(
                            "quick.satisfaction.questions.stressManageability.helper"
                        )}
                        value={value ?? null}
                        onChange={onChange}
                        scale={stressManageabilityScale}
                        notApplicableLabel={t("common.notApplicable")}
                        error={
                            fieldState.error
                                ? t("quick.satisfaction.validation.required")
                                : undefined
                        }
                    />

                )}
            />

        </View>
    );
}
