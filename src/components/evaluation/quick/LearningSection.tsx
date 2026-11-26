
import { Controller, useFormContext } from "react-hook-form";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
    AppText,
    Card,
} from "@/components/ui";

import { useTheme } from "@/theme";

import RatingQuestion from "../RatingQuestion";

import type { RatingScale } from "../RatingQuestion";

import type {
    Rating,
    RequirementAnswer,
    QuickEvaluationFormValues,
} from "@/types/quickEvaluation";


// ============================================
// QUESTION TYPES
// ============================================

type LearningQuestion =
    | "skillDevelopment"
    | "careerRelevance"
    | "networking";


// ============================================
// ACADEMIC REQUIREMENT SELECTOR
// ============================================

interface AcademicRequirementFieldProps {
    label: string;
    value: RequirementAnswer;
    onChange: (value: RequirementAnswer) => void;
}

function AcademicRequirementField({
    label,
    value,
    onChange,
}: AcademicRequirementFieldProps) {

    const { theme } = useTheme();
    const { t } = useTranslation("evaluation");

    const options: {
        value: RequirementAnswer;
        label: string;
    }[] = [
        {
            value: "yes",
            label: t("common.yes"),
        },
        {
            value: "no",
            label: t("common.no"),
        },
        {
            value: "notApplicable",
            label: t("common.notApplicable"),
        },
    ];

    return (
        <View className="gap-2">

            <AppText variant="bodySmall">
                {label}
            </AppText>

            <View className="flex-row gap-2">

                {options.map((option) => {

                    const selected = value === option.value;

                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            accessibilityRole="radio"
                            accessibilityState={{
                                checked: selected,
                            }}
                            className="flex-1 min-h-10 items-center justify-center rounded-lg border px-1"
                            style={{
                                borderWidth: 1.5,
                                borderColor: selected
                                    ? theme.primary
                                    : theme.border,
                                backgroundColor: selected
                                    ? theme.surfaceSecondary
                                    : "transparent",
                            }}
                        >
                            <AppText
                                variant="caption"
                                align="center"
                                color={selected ? "primary" : "muted"}
                                style={{
                                    fontWeight: selected ? "600" : "400",
                                }}
                            >
                                {option.label}
                            </AppText>
                        </Pressable>
                    );
                })}

            </View>

        </View>
    );
}


// ============================================
// LEARNING SECTION
// ============================================

export default function LearningSection() {

    const { control } =
        useFormContext<QuickEvaluationFormValues>();

    const { t } = useTranslation("evaluation");


    // ========================================
    // RATING SCALES
    // ========================================

    function createScale(question: LearningQuestion): RatingScale {

        const base = `quick.learning.questions.${question}.scale`;

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

    const skillDevelopmentScale =
        createScale("skillDevelopment");

    const careerRelevanceScale =
        createScale("careerRelevance");

    const networkingScale =
        createScale("networking");


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
                    {t("quick.learning.title")}
                </AppText>

                <AppText color="muted">
                    {t("quick.learning.description")}
                </AppText>

            </View>


            {/* ================================= */}
            {/* SKILL DEVELOPMENT */}
            {/* ================================= */}

            <Controller
                control={control}
                name="learning.skillDevelopment"
                render={({ field: { value, onChange }, fieldState }) => (

                    <RatingQuestion
                        question={t(
                            "quick.learning.questions.skillDevelopment.title"
                        )}
                        helperText={t(
                            "quick.learning.questions.skillDevelopment.helper"
                        )}
                        value={value ?? null}
                        onChange={onChange}
                        scale={skillDevelopmentScale}
                        notApplicableLabel={t("common.notApplicable")}
                        error={
                            fieldState.error
                                ? t("quick.learning.validation.required")
                                : undefined
                        }
                    />

                )}
            />


            {/* ================================= */}
            {/* CAREER RELEVANCE */}
            {/* ================================= */}

            <Controller
                control={control}
                name="learning.careerRelevance"
                render={({ field: { value, onChange }, fieldState }) => (

                    <RatingQuestion
                        question={t(
                            "quick.learning.questions.careerRelevance.title"
                        )}
                        helperText={t(
                            "quick.learning.questions.careerRelevance.helper"
                        )}
                        value={value ?? null}
                        onChange={onChange}
                        scale={careerRelevanceScale}
                        notApplicableLabel={t("common.notApplicable")}
                        error={
                            fieldState.error
                                ? t("quick.learning.validation.required")
                                : undefined
                        }
                    />

                )}
            />


            {/* ================================= */}
            {/* NETWORKING */}
            {/* ================================= */}

            <Controller
                control={control}
                name="learning.networking"
                render={({ field: { value, onChange }, fieldState }) => (

                    <RatingQuestion
                        question={t(
                            "quick.learning.questions.networking.title"
                        )}
                        helperText={t(
                            "quick.learning.questions.networking.helper"
                        )}
                        value={value ?? null}
                        onChange={onChange}
                        scale={networkingScale}
                        notApplicableLabel={t("common.notApplicable")}
                        error={
                            fieldState.error
                                ? t("quick.learning.validation.required")
                                : undefined
                        }
                    />

                )}
            />


            {/* ================================= */}
            {/* ACADEMIC REQUIREMENTS */}
            {/* ================================= */}

            <Card variant="filled">

                <View className="gap-4">

                    <View className="gap-1">

                        <AppText variant="title">
                            {t("quick.learning.academic.title")}
                        </AppText>

                        <AppText
                            variant="caption"
                            color="muted"
                        >
                            {t("quick.learning.academic.description")}
                        </AppText>

                    </View>


                    {/* Academic credits */}
                    <Controller
                        control={control}
                        name="learning.requiredForCredits"
                        render={({ field: { value, onChange } }) => (

                            <AcademicRequirementField
                                label={t("quick.learning.academic.credits")}
                                value={value  ?? "notApplicable"}
                                onChange={onChange}
                            />

                        )}
                    />


                    {/* Curriculum */}
                    <Controller
                        control={control}
                        name="learning.requiredForCurriculum"
                        render={({ field: { value, onChange } }) => (

                            <AcademicRequirementField
                                label={t("quick.learning.academic.curriculum")}
                                value={value  ?? "notApplicable"}
                                onChange={onChange}
                            />

                        )}
                    />

                </View>

            </Card>

        </View>
    );
}
