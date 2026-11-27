
import { useEffect } from "react";

import {
    FormProvider,
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import {
    AppScreen,
    AppText,
    Button,
} from "@/components/ui";

import FinancialSection from "./quick/FinancialSection";
import LearningSection from "./quick/LearningSection";
import SatisfactionSection from "./quick/SatisfactionSection";

import { useQuickEvaluationFlow } from "@/providers/QuickEvaluationFlowProvider";

import { calculateQuickEvaluationResult } from "@/utils/quickEvaluation";

import type {
    QuickEvaluationFormValues,
    QuickEvaluationInput,
    RatingAnswer,
} from "@/types/quickEvaluation";


// ============================================
// FINANCIAL VALIDATION
// ============================================

const decimalPattern = /^\d+(?:[.,]\d{1,2})?$/;


const requiredAmountSchema = z.string()
    .trim()
    .refine(
        (value) => decimalPattern.test(value),
        { message: "invalidAmount" }
    )
    .transform(
        (value) => Number(value.replace(",", "."))
    );


const optionalAmountSchema = z.string()
    .trim()
    .refine(
        (value) => value === "" || decimalPattern.test(value),
        { message: "invalidAmount" }
    )
    .transform(
        (value) => value === ""
            ? 0
            : Number(value.replace(",", "."))
    );


const hoursSchema = z.string()
    .trim()
    .refine(
        (value) =>
            decimalPattern.test(value) &&
            Number(value.replace(",", ".")) > 0,
        { message: "invalidHours" }
    )
    .transform(
        (value) => Number(value.replace(",", "."))
    );


// ============================================
// RATING VALIDATION
// ============================================

const ratingAnswerSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal("notApplicable"),
])
    .nullable()
    .refine(
        (value) => value !== null,
        { message: "required" }
    )
    .transform(
        (value) => value as RatingAnswer
    );


const requirementSchema = z.enum([
    "yes",
    "no",
    "notApplicable",
]);


// ============================================
// LEARNING VALIDATION
// ============================================

const learningSchema = z.object({

    skillDevelopment: ratingAnswerSchema,

    careerRelevance: ratingAnswerSchema,

    networking: ratingAnswerSchema,

    requiredForCredits: requirementSchema,

    requiredForCurriculum: requirementSchema,

});


// ============================================
// SATISFACTION VALIDATION
// ============================================

const satisfactionSchema = z.object({

    colleagues: ratingAnswerSchema,

    management: ratingAnswerSchema,

    workLifeBalance: ratingAnswerSchema,

    stressManageability: ratingAnswerSchema,

});


// ============================================
// COMPLETE FORM SCHEMA
// ============================================

const quickEvaluationBaseSchema = z.object({

    financial: z.object({

        period: z.enum(["week", "month", "year"]),

        incomeAfterTax: requiredAmountSchema,

        benefitsValue: optionalAmountSchema,

        jobExpenses: optionalAmountSchema,

        totalCommittedHours: hoursSchema,

    }),

    learning: learningSchema.optional(),

    satisfaction: satisfactionSchema.optional(),

});

type QuickEvaluationFormOutput =
    z.output<typeof quickEvaluationBaseSchema>;


// ============================================
// COMPONENT
// ============================================

export default function QuickEvaluation() {

    const router = useRouter();

    const { t } = useTranslation("evaluation");

    const {
        preferences,
        setResult,
    } = useQuickEvaluationFlow();


    // ========================================
    // ROUTE PROTECTION
    // ========================================

    useEffect(() => {

        if (!preferences) {
            router.replace("/evaluation/quick-setup");
        }

    }, [preferences, router]);


    // ========================================
    // VALIDATION
    // ========================================

    const quickEvaluationSchema =
        quickEvaluationBaseSchema.superRefine((values, ctx) => {

            if (
                preferences?.includedOptionalAreas.includes("learning") &&
                !values.learning
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["learning"],
                    message: "Learning input is required.",
                });
            }

            if (
                preferences?.includedOptionalAreas.includes("satisfaction") &&
                !values.satisfaction
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["satisfaction"],
                    message: "Satisfaction input is required.",
                });
            }

        });


    // ========================================
    // FORM
    // ========================================

    const methods = useForm<
        QuickEvaluationFormValues,
        unknown,
        QuickEvaluationFormOutput
    >({

        resolver: zodResolver(quickEvaluationSchema),

        mode: "onBlur",

        defaultValues: {

            financial: {
                period: "month",
                incomeAfterTax: "",
                benefitsValue: "",
                jobExpenses: "",
                totalCommittedHours: "",
            },

            learning: preferences?.includedOptionalAreas.includes("learning")
                ? {
                    skillDevelopment: null,
                    careerRelevance: null,
                    networking: null,
                    requiredForCredits: "notApplicable",
                    requiredForCurriculum: "notApplicable",
                }
                : undefined,

            satisfaction: preferences?.includedOptionalAreas.includes("satisfaction")
                ? {
                    colleagues: null,
                    management: null,
                    workLifeBalance: null,
                    stressManageability: null,
                }
                : undefined,

        },
    });


    if (!preferences) {
        return null;
    }


    // ========================================
    // FORM SUBMISSION
    // ========================================

    function onSubmit(values: QuickEvaluationFormOutput) {
        if (!preferences) {
          router.replace("/evaluation/quick-setup");
          return;
        }

        // Convert the validated form values into our evaluation model.
        const input: QuickEvaluationInput = {

            financial: {
                period: values.financial.period,
                incomeAfterTax: values.financial.incomeAfterTax,
                benefitsValue: values.financial.benefitsValue,
                jobExpenses: values.financial.jobExpenses,
                totalCommittedHours: values.financial.totalCommittedHours,
            },

        };


        // Add Learning only when included.
        if (
            preferences.includedOptionalAreas.includes("learning") &&
            values.learning
        ) {
            input.learning = values.learning;
        }


        // Add Satisfaction only when included.
        if (
            preferences.includedOptionalAreas.includes("satisfaction") &&
            values.satisfaction
        ) {
            input.satisfaction = values.satisfaction;
        }


        // Calculate the complete result.
        const result = calculateQuickEvaluationResult(
            input,
            preferences
        );


        // Store it for the Results screen.
        setResult(result);

        // Navigate to Results.
        router.push("/evaluation/quick-results");
    }


    // ========================================
    // RENDER
    // ========================================

    return (

        <FormProvider {...methods}>

            <AppScreen scrollable>

                <View className="flex-1 gap-7 py-6">

                    {/* Page introduction */}
                    <View className="gap-2">

                        <AppText variant="h1">
                            {t("quick.title")}
                        </AppText>

                        <AppText color="muted">
                            {t("quick.description")}
                        </AppText>

                    </View>


                    {/* Financial */}
                    <FinancialSection
                        currency={preferences.currency}
                    />


                    {/* Learning */}
                    {preferences.includedOptionalAreas.includes("learning") && (
                        <LearningSection />
                    )}


                    {/* Satisfaction */}
                    {preferences.includedOptionalAreas.includes("satisfaction") && (
                        <SatisfactionSection />
                    )}


                    {/* Submit */}
                    <Button
                        fullWidth
                        size="lg"
                        onPress={methods.handleSubmit(onSubmit)}
                    >
                        {t("quick.submit")}
                    </Button>

                </View>

            </AppScreen>

        </FormProvider>

    );
}



