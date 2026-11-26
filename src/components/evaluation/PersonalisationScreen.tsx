
import { ComponentProps } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { View, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import {
    AppScreen,
    AppText,
    Button,
    Card,
    SelectField,
    SelectableCard,
    TextField,
} from "@/components/ui";

import type { SelectOption } from "@/components/ui";

import { useTheme } from "@/theme";

import {
    calculateQuickEvaluationWeights,
    getRequiredOptionalArea,
} from "@/utils/quickEvaluationPreferences";

import type {
    EvaluationGoal,
    EvaluationPreferences,
    OptionalEvaluationArea,
} from "@/types/quickEvaluation";


// ============================================
// OPTIONS
// ============================================

const CURRENCY_CODES = [
    "EUR",
    "GBP",
    "USD",
    "AUD",
    "CAD",
    "CHF",
] as const;

type CurrencyCode = typeof CURRENCY_CODES[number];

const currencyOptions: SelectOption<CurrencyCode>[] = [
    { label: "EUR – Euro", value: "EUR" },
    { label: "GBP – British Pound", value: "GBP" },
    { label: "USD – US Dollar", value: "USD" },
    { label: "AUD – Australian Dollar", value: "AUD" },
    { label: "CAD – Canadian Dollar", value: "CAD" },
    { label: "CHF – Swiss Franc", value: "CHF" },
];


// ============================================
// FORM VALIDATION
// ============================================

const personalisationSchema = z.object({

    mainGoal: z.enum([
        "money",
        "careerGrowth",
        "satisfaction",
        "balanced",
    ]),

    includedOptionalAreas: z.array(
        z.enum(["learning", "satisfaction"])
    ),

    currency: z.enum(CURRENCY_CODES),

    minimumHourlyEarnings: z
        .string()
        .trim()
        .refine((value) => {
            if (value === "") return true;

            const normalised = value.replace(",", ".");

            return (
                /^\d+(\.\d{1,2})?$/.test(normalised) &&
                Number(normalised) > 0
            );
        }, "invalidHourlyTarget")
        .transform((value) => {
            if (value === "") return null;

            return Number(value.replace(",", "."));
        }),
});

type PersonalisationFormValues =
    z.input<typeof personalisationSchema>;

type PersonalisationFormOutput =
    z.output<typeof personalisationSchema>;


// ============================================
// COMPONENT PROPS
// ============================================

interface PersonalisationScreenProps {
    initialPreferences: EvaluationPreferences | null;
    onContinue: (preferences: EvaluationPreferences) => void;
}


// ============================================
// COMPONENT
// ============================================

export default function PersonalisationScreen({
    initialPreferences,
    onContinue,
}: PersonalisationScreenProps) {

    const { theme } = useTheme();
    const { t } = useTranslation("evaluation");


    // ========================================
    // GOAL OPTIONS
    // ========================================

    const goalOptions: {
        value: Exclude<EvaluationGoal, "balanced">;
        icon: ComponentProps<typeof Ionicons>["name"];
    }[] = [
        {
            value: "money",
            icon: "wallet-outline",
        },
        {
            value: "careerGrowth",
            icon: "school-outline",
        },
        {
            value: "satisfaction",
            icon: "heart-outline",
        },
    ];


    // ========================================
    // DEFAULT VALUES
    // ========================================

    const initialGoal = initialPreferences?.mainGoal ?? "balanced";

    const initialAreas =
        initialPreferences?.includedOptionalAreas ??
        ["learning", "satisfaction"];

    const requiredInitialArea = getRequiredOptionalArea(initialGoal);

    // Make sure the main priority area is always included.
    const normalizedInitialAreas = requiredInitialArea
        ? [...new Set([...initialAreas, requiredInitialArea])]
        : initialAreas;


    // ========================================
    // FORM
    // ========================================

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<
        PersonalisationFormValues,
        unknown,
        PersonalisationFormOutput
    >({
        resolver: zodResolver(personalisationSchema),

        defaultValues: {
            mainGoal: initialGoal,

            includedOptionalAreas: normalizedInitialAreas,

            currency:
                (initialPreferences?.currency as CurrencyCode) ?? "EUR",

            minimumHourlyEarnings:
                initialPreferences?.minimumHourlyEarnings?.toString() ?? "",
        },
    });

    const selectedGoal = useWatch({control,name: "mainGoal",});
    const requiredArea = getRequiredOptionalArea(selectedGoal);

    // ========================================
    // MAIN GOAL HANDLER
    // ========================================

    function handleGoalChange(
        nextGoal: EvaluationGoal,
        onChange: (value: EvaluationGoal) => void
    ) {
        const requiredArea = getRequiredOptionalArea(nextGoal);

        const currentAreas = getValues("includedOptionalAreas");

        if (requiredArea && !currentAreas.includes(requiredArea)) {
            setValue(
                "includedOptionalAreas",
                [...currentAreas, requiredArea],
                {
                    shouldDirty: true,
                    shouldValidate: true,
                }
            );
        }

        onChange(nextGoal);
    }


    // ========================================
    // OPTIONAL AREA HANDLER
    // ========================================

    function handleAreaChange(
    area: OptionalEvaluationArea,
    enabled: boolean,
    currentAreas: OptionalEvaluationArea[],
    onChange: (value: OptionalEvaluationArea[]) => void
) {
    // The main priority area cannot be excluded.
    if (!enabled && requiredArea === area) {
        return;
    }

    const nextAreas = enabled
        ? [...new Set([...currentAreas, area])]
        : currentAreas.filter((current) => current !== area);

    onChange(nextAreas);
}


    // ========================================
    // FORM SUBMISSION
    // ========================================

    function onSubmit(values: PersonalisationFormOutput) {

        const preferences: EvaluationPreferences = {
            mainGoal: values.mainGoal,

            currency: values.currency,

            minimumHourlyEarnings: values.minimumHourlyEarnings,

            includedOptionalAreas: values.includedOptionalAreas,

            weights: calculateQuickEvaluationWeights(
                values.mainGoal,
                values.includedOptionalAreas
            ),
        };

        onContinue(preferences);
    }


    // ========================================
    // RENDER
    // ========================================

    return (
        <AppScreen scrollable>

            <View className="flex-1 gap-7 py-6">

                {/* ================================= */}
                {/* INTRODUCTION */}
                {/* ================================= */}

                <View className="gap-2">
                    <AppText variant="h1">
                        {t("quick.setup.title")}
                    </AppText>

                    <AppText color="muted">
                        {t("quick.setup.description")}
                    </AppText>
                </View>


                {/* ================================= */}
                {/* 1. MAIN PRIORITY */}
                {/* ================================= */}

                <View className="gap-3">

                    <AppText variant="h2">
                        {t("quick.setup.mainPriority")}
                    </AppText>


                    <Controller
                        control={control}
                        name="mainGoal"
                        render={({ field: { value, onChange } }) => (

                            <View className="gap-3">

                                {/* Balanced default */}
                                <SelectableCard
                                    layout="horizontal"
                                    title={t("quick.setup.balanced.title")}
                                    description={t("quick.setup.balanced.description")}
                                    icon={
                                        <Ionicons
                                            name="scale-outline"
                                            size={24}
                                            color={theme.primary}
                                        />
                                    }
                                    selected={value === "balanced"}
                                    onPress={() =>
                                        handleGoalChange("balanced", onChange)
                                    }
                                />


                                {/* Other priorities */}
                                <View className="gap-2">

                                    <AppText
                                        variant="caption"
                                        color="muted"
                                    >
                                        {t("quick.setup.choosePriority")}
                                    </AppText>

                                    <View className="flex-row gap-2">

                                        {goalOptions.map((goal) => (

                                            <SelectableCard
                                                key={goal.value}
                                                layout="vertical"
                                                title={t(
                                                    `quick.setup.goals.${goal.value}.title`
                                                )}
                                                icon={
                                                    <Ionicons
                                                        name={goal.icon}
                                                        size={24}
                                                        color={theme.primary}
                                                    />
                                                }
                                                selected={value === goal.value}
                                                onPress={() =>
                                                    handleGoalChange(
                                                        goal.value,
                                                        onChange
                                                    )
                                                }
                                                style={{ flex: 1, minWidth: 0 }}
                                            />

                                        ))}

                                    </View>

                                </View>

                            </View>
                        )}
                    />

                </View>


                {/* ================================= */}
                {/* 2. ADDITIONAL AREAS */}
                {/* ================================= */}

                <View className="gap-3">

                    <View className="gap-1">
                        <AppText variant="h2">
                            {t("quick.setup.additionalAreas")}
                        </AppText>

                        <AppText variant="bodySmall" color="muted">
                            {t("quick.setup.additionalAreasDescription")}
                        </AppText>
                    </View>


                    <Controller
                        control={control}
                        name="includedOptionalAreas"
                        render={({ field: { value, onChange } }) => {

                            return (
                                <View className="gap-3">

                                    {/* Learning */}
                                    <Card variant="outlined">

                                        <View className="flex-row items-center gap-3">

                                            <View className="flex-1 gap-1">
                                                <AppText variant="title">
                                                    {t("common.learning")}
                                                </AppText>

                                                <AppText
                                                    variant="bodySmall"
                                                    color="muted"
                                                >
                                                    {t("quick.setup.learningDescription")}
                                                </AppText>

                                                {requiredArea === "learning" && (
                                                  <AppText variant="caption" color="primary">
                                                   {t("quick.setup.priorityIncluded")}
                                                  </AppText>
                                                )}
                                            </View>

                                            <Switch
                                                value={value.includes("learning")}
                                                onValueChange={(enabled) =>
                                                    handleAreaChange(
                                                        "learning",
                                                        enabled,
                                                        value,
                                                        onChange
                                                    )
                                                }
                                                disabled={requiredArea === "learning"}
                                                trackColor={{
                                                    false: theme.border,
                                                    true: theme.primary,
                                                }}
                                                thumbColor={theme.surface}
                                                accessibilityLabel={t("common.learning")}
                                            />

                                        </View>
                                    </Card>


                                    {/* Satisfaction */}
                                    <Card variant="outlined">

                                        <View className="flex-row items-center gap-3">

                                            <View className="flex-1 gap-1">
                                                <AppText variant="title">
                                                    {t("common.satisfaction")}
                                                </AppText>

                                                <AppText
                                                    variant="bodySmall"
                                                    color="muted"
                                                >
                                                    {t("quick.setup.satisfactionDescription")}
                                                </AppText>

                                                {requiredArea === "satisfaction" && (
                                                  <AppText variant="caption" color="primary">
                                                    {t("quick.setup.priorityIncluded")}
                                                  </AppText>
                                                )}
                                            </View>

                                            <Switch
                                                value={value.includes("satisfaction")}
                                                onValueChange={(enabled) =>
                                                    handleAreaChange(
                                                        "satisfaction",
                                                        enabled,
                                                        value,
                                                        onChange
                                                    )
                                                }
                                                disabled={requiredArea === "satisfaction"}
                                                trackColor={{
                                                    false: theme.border,
                                                    true: theme.primary,
                                                }}
                                                thumbColor={theme.surface}
                                                accessibilityLabel={t("common.satisfaction")}
                                            />

                                        </View>

                                    </Card>

                                </View>
                            );
                        }}
                    />

                </View>


                {/* ================================= */}
                {/* 3. FINANCIAL TARGET */}
                {/* ================================= */}

                <View className="gap-3">

                    <View className="gap-1">
                        <AppText variant="h2">
                            {t("quick.setup.financialTarget")}
                        </AppText>

                        <AppText variant="bodySmall" color="muted">
                            {t("quick.setup.financialTargetDescription")}
                        </AppText>
                    </View>


                    <View className="gap-3">

                        <Controller
                            control={control}
                            name="minimumHourlyEarnings"
                            render={({ field: { value, onChange, onBlur } }) => (

                                <TextField
                                    label={t("quick.setup.minimumEarnings")}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder={t("quick.setup.targetPlaceholder")}
                                    keyboardType="decimal-pad"
                                    error={
                                        errors.minimumHourlyEarnings
                                            ? t("quick.setup.invalidHourlyTarget")
                                            : undefined
                                    }
                                    helperText={t("quick.setup.targetOptional")}
                                />

                            )}
                        />


                        <Controller
                            control={control}
                            name="currency"
                            render={({ field: { value, onChange } }) => (

                                <SelectField
                                    label={t("common.currency")}
                                    value={value}
                                    onValueChange={onChange}
                                    options={currencyOptions}
                                />

                            )}
                        />

                    </View>

                </View>


                {/* ================================= */}
                {/* SUBMIT */}
                {/* ================================= */}

                <View className="pt-2">
                    <Button
                        fullWidth
                        size="lg"
                        disabled={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                    >
                        {t("quick.setup.start")}
                    </Button>
                </View>

            </View>

        </AppScreen>
    );
}

