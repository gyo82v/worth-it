
import { useState } from "react";

import {
    Platform,
    Share,
    Switch,
    View,
    Pressable,
} from "react-native";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import {
    AppScreen,
    AppText,
    Button,
    Card,
} from "@/components/ui";

import { useTheme } from "@/theme";

import { useQuickEvaluationFlow } from "@/providers/QuickEvaluationFlowProvider";

import type {
    RatingAreaResult,
} from "@/types/quickEvaluation";


// ============================================
// SCORE BAR
// ============================================

function ScoreBar({ score }: { score: number | null }) {

    const { theme } = useTheme();

    return (
        <View
            className="h-2 w-full overflow-hidden rounded-full"
            style={{
                backgroundColor: theme.surfaceSecondary,
            }}
        >
            <View
                className="h-full rounded-full"
                style={{
                    width: `${score === null ? 0 : Math.min(100, Math.max(0, score))}%`,
                    backgroundColor: theme.primary,
                }}
            />
        </View>
    );
}


// ============================================
// RATING AREA RESULT
// ============================================

interface RatingResultCardProps {
    title: string;
    result: RatingAreaResult;
    weight: number;
    averageLabel: string;
    noRatingsLabel: string;
}

function RatingResultCard({
    title,
    result,
    weight,
    averageLabel,
    noRatingsLabel,
}: RatingResultCardProps) {

    return (
        <Card variant="outlined">

            <View className="gap-3">

                <View className="flex-row items-center justify-between">

                    <AppText variant="title">
                        {title}
                    </AppText>

                    <AppText
                        variant="caption"
                        color="muted"
                    >
                        Weight: {weight}%
                    </AppText>

                </View>

                {result.averageRating !== null ? (
                    <>
                        <View className="flex-row items-end justify-between">

                            <View className="flex-row items-baseline gap-1">
                                <AppText variant="display">
                                    {result.averageRating.toFixed(1)}
                                </AppText>

                                <AppText color="muted">
                                    / 5
                                </AppText>
                            </View>

                            <AppText
                                variant="caption"
                                color="muted"
                            >
                                {averageLabel}
                            </AppText>

                        </View>

                        <ScoreBar score={result.score} />
                    </>
                ) : (
                    <AppText color="muted">
                        {noRatingsLabel}
                    </AppText>
                )}

            </View>

        </Card>
    );
}


// ============================================
// MAIN RESULTS SCREEN
// ============================================

export default function QuickEvaluationResults() {

    const router = useRouter();

    const { t } = useTranslation("evaluation");

    const { theme } = useTheme();

    const { result } = useQuickEvaluationFlow();

    const [includeHourlyEarnings, setIncludeHourlyEarnings] =
        useState(false);

    const [shareFeedback, setShareFeedback] =
        useState("");


    if (!result) {
        return null;
    }


    // ========================================
    // FORMATTING
    // ========================================

    const currencyFormat = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: result.preferences.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedHourlyEarnings = currencyFormat.format(
        result.areaResults.financial.effectiveHourlyEarnings
    );

    const financialResult = result.areaResults.financial;


    // ========================================
    // UNAVAILABLE SCORE REASON
    // ========================================

    const unavailableReason =
        result.preferences.minimumHourlyEarnings === null
            ? t("quick.results.overall.targetMissing")
            : t("quick.results.overall.areaUnavailable");


    // ========================================
    // SHARE SUMMARY
    // ========================================

    function createShareSummary(): string {
        if(!result) return "no data available"

        const lines: string[] = [
            t("quick.results.title"),
            "",
        ];

        if (result.overallScore !== null) {
            lines.push(
                `${t("quick.results.overall.score")}: ${Math.round(result.overallScore)} / 100`
            );

            if (result.verdict) {
                lines.push(
                    t(`quick.results.verdicts.${result.verdict}`)
                );
            }
        } else {
            lines.push(
                t("quick.results.overall.unavailable")
            );
        }

        lines.push("");

        if (includeHourlyEarnings) {
            lines.push(
                `${t("quick.results.financial.hourlyEarnings")}: ${formattedHourlyEarnings} / hour`
            );
        } else {
            lines.push(
                t("quick.results.financial.title")
            );
        }

        if (result.areaResults.learning) {
            const average = result.areaResults.learning.averageRating;

            lines.push(
                `${t("quick.results.learning.title")}: ${
                    average === null ? "—" : `${average.toFixed(1)} / 5`
                }`
            );
        }

        if (result.areaResults.satisfaction) {
            const average = result.areaResults.satisfaction.averageRating;

            lines.push(
                `${t("quick.results.satisfaction.title")}: ${
                    average === null ? "—" : `${average.toFixed(1)} / 5`
                }`
            );
        }

        lines.push("");
        lines.push("Created with Worth It");

        return lines.join("\n");
    }


    // ========================================
    // SHARE HANDLER
    // ========================================

    async function handleShare() {

        const message = createShareSummary();

        setShareFeedback("");

        try {

            if (Platform.OS === "web") {

                if (typeof navigator !== "undefined") {

                    const webNavigator = navigator as Navigator & {
                        share?: (data: {
                            title?: string;
                            text?: string;
                        }) => Promise<void>;

                        clipboard?: {
                            writeText: (text: string) => Promise<void>;
                        };
                    };

                    if (webNavigator.share) {

                        await webNavigator.share({
                            title: t("quick.results.title"),
                            text: message,
                        });

                        return;
                    }

                    if (webNavigator.clipboard?.writeText) {

                        await webNavigator.clipboard.writeText(message);

                        setShareFeedback(
                            t("quick.results.share.copied")
                        );

                        return;
                    }
                }

                setShareFeedback(
                    t("quick.results.share.unavailable")
                );

                return;
            }

            await Share.share({
                title: t("quick.results.title"),
                message,
            });

        } catch (error) {

            console.error("Failed to share evaluation:", error);

        }
    }


    // ========================================
    // RENDER
    // ========================================

    return (

        <AppScreen scrollable>

            <View className="flex-1 gap-4 py-6">

                {/* ================================= */}
                {/* INTRODUCTION */}
                {/* ================================= */}

                <View className="gap-1">

                    <AppText variant="h1">
                        {t("quick.results.title")}
                    </AppText>

                    <AppText color="muted">
                        {t("quick.results.overall.basedOn")}
                    </AppText>

                </View>


                {/* ================================= */}
                {/* OVERALL RESULT */}
                {/* ================================= */}

                <Card variant="outlined">

                    <View className="items-center gap-2 py-2">

                        <AppText color="muted">
                            {t("quick.results.overall.title")}
                        </AppText>


                        {result.overallScore !== null ? (
                            <>
                                <AppText
                                    variant="display"
                                    color="primary"
                                >
                                    {Math.round(result.overallScore)}
                                    <AppText
                                        variant="title"
                                        color="muted"
                                    >
                                        {" "}/ 100
                                    </AppText>
                                </AppText>

                                <AppText variant="h2">
                                    {result.verdict
                                        ? t(`quick.results.verdicts.${result.verdict}`)
                                        : ""
                                    }
                                </AppText>
                            </>
                        ) : (
                            <>
                                <AppText variant="h2">
                                    {t("quick.results.overall.unavailable")}
                                </AppText>

                                <AppText
                                    variant="bodySmall"
                                    color="muted"
                                    align="center"
                                >
                                    {unavailableReason}
                                </AppText>
                            </>
                        )}

                    </View>

                </Card>


                {/* ================================= */}
                {/* FINANCIAL */}
                {/* ================================= */}

                <Card variant="outlined">

                    <View className="gap-3">

                        <View className="flex-row justify-between items-center">

                            <AppText variant="title">
                                {t("quick.results.financial.title")}
                            </AppText>

                            <AppText
                                variant="caption"
                                color="muted"
                            >
                                {t("quick.results.weight", {
                                    value: result.preferences.weights.financial,
                                })}
                            </AppText>

                        </View>


                        <View className="gap-1">

                            <AppText
                                variant="caption"
                                color="muted"
                            >
                                {t("quick.results.financial.hourlyEarnings")}
                            </AppText>

                            <View className="flex-row items-baseline gap-1">

                                <AppText variant="display">
                                    {formattedHourlyEarnings}
                                </AppText>

                                <AppText color="muted">
                                    / hour
                                </AppText>

                            </View>

                        </View>


                        {financialResult.financialScore !== null ? (
                            <View className="gap-2">

                                <View className="flex-row justify-between">

                                    <AppText
                                        variant="caption"
                                        color="muted"
                                    >
                                        {t("quick.results.financial.score")}
                                    </AppText>

                                    <AppText variant="caption">
                                        {Math.round(financialResult.financialScore)} / 100
                                    </AppText>

                                </View>

                                <ScoreBar
                                    score={financialResult.financialScore}
                                />

                            </View>
                        ) : (
                            <AppText
                                variant="caption"
                                color="muted"
                            >
                                {t("quick.results.financial.targetMissing")}
                            </AppText>
                        )}


                        <View
                            className="gap-1 pt-2"
                            style={{
                                borderTopWidth: 1,
                                borderTopColor: theme.border,
                            }}
                        >

                            <View className="flex-row justify-between">

                                <AppText
                                    variant="caption"
                                    color="muted"
                                >
                                    {t("quick.results.financial.netEarnings")}
                                </AppText>

                                <AppText variant="caption">
                                    {currencyFormat.format(
                                        financialResult.netEarningsAfterJobExpenses
                                    )}
                                </AppText>

                            </View>

                            <View className="flex-row justify-between">

                                <AppText
                                    variant="caption"
                                    color="muted"
                                >
                                    {t("quick.results.financial.totalHours")}
                                </AppText>

                                <AppText variant="caption">
                                    {financialResult.totalHours} / {result.input.financial.period}
                                </AppText>

                            </View>

                        </View>

                    </View>

                </Card>


                {/* ================================= */}
                {/* LEARNING */}
                {/* ================================= */}

                {result.areaResults.learning && (
                    <RatingResultCard
                        title={t("quick.results.learning.title")}
                        result={result.areaResults.learning}
                        weight={result.preferences.weights.learning}
                        averageLabel={t("quick.results.learning.average")}
                        noRatingsLabel={t("quick.results.learning.noRatings")}
                    />
                )}


                {/* ================================= */}
                {/* SATISFACTION */}
                {/* ================================= */}

                {result.areaResults.satisfaction && (
                    <RatingResultCard
                        title={t("quick.results.satisfaction.title")}
                        result={result.areaResults.satisfaction}
                        weight={result.preferences.weights.satisfaction}
                        averageLabel={t("quick.results.satisfaction.average")}
                        noRatingsLabel={t("quick.results.satisfaction.noRatings")}
                    />
                )}


                {/* ================================= */}
                {/* SHARE */}
                {/* ================================= */}

                <Card variant="outlined">

                    <View className="gap-3">

                        <View className="gap-1">

                            <AppText variant="title">
                                {t("quick.results.share.title")}
                            </AppText>

                            <AppText
                                variant="bodySmall"
                                color="muted"
                            >
                                {t("quick.results.share.description")}
                            </AppText>

                        </View>


                        <View className="flex-row items-center gap-3">

                            <View className="flex-1 gap-1">

                                <AppText variant="label">
                                    {t("quick.results.share.includeHourlyEarnings")}
                                </AppText>

                                <AppText
                                    variant="caption"
                                    color="muted"
                                >
                                    {t("quick.results.share.privacyNote")}
                                </AppText>

                            </View>

                            <Switch
                                value={includeHourlyEarnings}
                                onValueChange={setIncludeHourlyEarnings}
                                trackColor={{
                                    false: theme.border,
                                    true: theme.primary,
                                }}
                                thumbColor={theme.surface}
                            />

                        </View>


                        <Button
                            fullWidth
                            onPress={handleShare}
                        >
                            {t("quick.results.share.button")}
                        </Button>


                        {shareFeedback !== "" && (
                            <AppText
                                variant="caption"
                                color="muted"
                                align="center"
                            >
                                {shareFeedback}
                            </AppText>
                        )}

                    </View>

                </Card>


                {/* ================================= */}
                {/* NEW EVALUATION */}
                {/* ================================= */}

                <Button
                    variant="outline"
                    fullWidth
                    onPress={() =>
                        router.replace("/evaluation/quick-setup")
                    }
                >
                    {t("quick.results.newEvaluation")}
                </Button>

            </View>

        </AppScreen>
    );
}
