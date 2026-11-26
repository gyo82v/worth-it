
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
} from "@/components/ui";

import FinancialSection from "./quick/FinancialSection";
import LearningSection from "./quick/LearningSection";
import SatisfactionSection from "./quick/SatisfactionSection";

import { useQuickEvaluationFlow } from "@/providers/QuickEvaluationFlowProvider";

import type { QuickEvaluationFormValues } from "@/types/quickEvaluation";


// ============================================
// VALIDATION
// ============================================

const decimalPattern = /^\d+(?:[.,]\d{1,2})?$/;

// ============================================
// LEARNING VALIDATION
// ============================================

const ratingAnswerSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal("notApplicable"),
]).nullable().refine(
    (value) => value !== null,
    { message: "required" }
);

const requirementSchema = z.enum([
    "yes",
    "no",
    "notApplicable",
]);

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


const requiredAmountSchema = z.string()
    .trim()
    .refine(
        (value) => decimalPattern.test(value),
        { message: "invalidAmount" }
    );


const optionalAmountSchema = z.string()
    .trim()
    .refine(
        (value) =>
            value === "" || decimalPattern.test(value),
        { message: "invalidAmount" }
    );


const hoursSchema = z.string()
    .trim()
    .refine(
        (value) =>
            decimalPattern.test(value) &&
            Number(value.replace(",", ".")) > 0,
        { message: "invalidHours" }
    );


const quickEvaluationSchema = z.object({

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



// ============================================
// COMPONENT
// ============================================

export default function QuickEvaluation() {

    const router = useRouter();

    const { t } = useTranslation("evaluation");

    const { preferences } = useQuickEvaluationFlow();


    // ========================================
    // ROUTE PROTECTION
    // ========================================

    useEffect(() => {

        if (!preferences) {
            router.replace("/evaluation/quick-setup");
        }

    }, [preferences, router]);


    // ========================================
    // FORM
    // ========================================

    const methods = useForm<QuickEvaluationFormValues>({
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


                    {/* Financial section */}
                    <FinancialSection
                        currency={preferences.currency}
                    />
                    {preferences.includedOptionalAreas.includes("learning") && (
                     <LearningSection />
                    )}
                    {preferences.includedOptionalAreas.includes("satisfaction") && (
                      <SatisfactionSection />
                    )}
                </View>

            </AppScreen>

        </FormProvider>

    );
}


