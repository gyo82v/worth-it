
import { Controller, useFormContext } from "react-hook-form";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
    AppText,
    TextField,
} from "@/components/ui";

import { useTheme } from "@/theme";

import type {
    EvaluationPeriod,
    QuickEvaluationFormValues,
} from "@/types/quickEvaluation";


const PERIODS: EvaluationPeriod[] = [
    "week",
    "month",
    "year",
];


interface FinancialSectionProps {
    currency: string;
}


export default function FinancialSection({
    currency,
}: FinancialSectionProps) {

    const { control, formState: { errors } } =
        useFormContext<QuickEvaluationFormValues>();

    const { t } = useTranslation("evaluation");
    const { theme } = useTheme();


    return (
        <View className="gap-4">

            {/* SECTION INTRODUCTION */}

            <View className="gap-1">

                <View className="flex-row items-center justify-between">

                    <AppText variant="h2">
                        {t("quick.financial.title")}
                    </AppText>

                    <AppText
                        variant="caption"
                        color="primary"
                    >
                        {currency}
                    </AppText>

                </View>

                <AppText color="muted">
                    {t("quick.financial.description")}
                </AppText>

                <AppText
                    variant="caption"
                    color="muted"
                >
                    {t("quick.financial.amountsNote", { currency })}
                </AppText>

            </View>


            {/* EVALUATION PERIOD */}

            <View className="gap-2">

                <AppText variant="label">
                    {t("quick.financial.period.label")}
                </AppText>

                <Controller
                    control={control}
                    name="financial.period"
                    render={({ field: { value, onChange } }) => (

                        <View className="flex-row gap-2">

                            {PERIODS.map((period) => {

                                const selected = value === period;

                                return (
                                    <Pressable
                                        key={period}
                                        onPress={() => onChange(period)}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected }}
                                        className="flex-1 min-h-11 items-center justify-center rounded-lg border"
                                        style={{
                                            borderWidth: 1.5,
                                            borderColor: selected
                                                ? theme.primary
                                                : theme.border,
                                            backgroundColor: selected
                                                ? theme.surfaceSecondary
                                                : theme.surface,
                                        }}
                                    >
                                        <AppText
                                            variant="label"
                                            color={selected ? "primary" : "muted"}
                                        >
                                            {t(`quick.financial.period.${period}`)}
                                        </AppText>
                                    </Pressable>
                                );
                            })}

                        </View>

                    )}
                />

                <AppText variant="caption" color="muted">
                    {t("quick.financial.period.helper")}
                </AppText>

            </View>


            {/* ================================= */}
            {/* TAKE-HOME INCOME */}
            {/* ================================= */}

            <Controller
                control={control}
                name="financial.incomeAfterTax"
                render={({ field: { value, onChange, onBlur } }) => (

                    <TextField
                        label={t("quick.financial.income.label")}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t("quick.financial.income.placeholder")}
                        keyboardType="decimal-pad"
                        error={
                            errors.financial?.incomeAfterTax
                                ? t("quick.financial.validation.invalidAmount")
                                : undefined
                        }
                        helperText={t("quick.financial.income.helper")}
                    />

                )}
            />


            {/* ================================= */}
            {/* ADDITIONAL BENEFITS */}
            {/* ================================= */}

            <Controller
                control={control}
                name="financial.benefitsValue"
                render={({ field: { value, onChange, onBlur } }) => (

                    <TextField
                        label={t("quick.financial.benefits.label")}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t("quick.financial.benefits.placeholder")}
                        keyboardType="decimal-pad"
                        error={
                            errors.financial?.benefitsValue
                                ? t("quick.financial.validation.invalidAmount")
                                : undefined
                        }
                        helperText={t("quick.financial.benefits.helper")}
                    />

                )}
            />


            {/* ================================= */}
            {/* JOB-RELATED EXPENSES */}
            {/* ================================= */}

            <Controller
                control={control}
                name="financial.jobExpenses"
                render={({ field: { value, onChange, onBlur } }) => (

                    <TextField
                        label={t("quick.financial.expenses.label")}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t("quick.financial.expenses.placeholder")}
                        keyboardType="decimal-pad"
                        error={
                            errors.financial?.jobExpenses
                                ? t("quick.financial.validation.invalidAmount")
                                : undefined
                        }
                        helperText={t("quick.financial.expenses.helper")}
                    />

                )}
            />


            {/* ================================= */}
            {/* TOTAL COMMITTED HOURS */}
            {/* ================================= */}

            <Controller
                control={control}
                name="financial.totalCommittedHours"
                render={({ field: { value, onChange, onBlur } }) => (

                    <TextField
                        label={t("quick.financial.hours.label")}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t("quick.financial.hours.placeholder")}
                        keyboardType="decimal-pad"
                        error={
                            errors.financial?.totalCommittedHours
                                ? t("quick.financial.validation.invalidHours")
                                : undefined
                        }
                        helperText={t("quick.financial.hours.helper")}
                    />

                )}
            />

        </View>
    );
}
