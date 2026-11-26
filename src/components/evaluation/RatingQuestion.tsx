
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme";
import { AppText } from "@/components/ui";

import type {
    Rating,
    RatingAnswer,
} from "@/types/quickEvaluation";


export type RatingScale = Record<
    Rating,
    {
        label: string;
        description: string;
    }
>;


export interface RatingQuestionProps {
    question: string;
    helperText?: string;

    value: RatingAnswer | null;
    onChange: (value: RatingAnswer) => void;

    scale: RatingScale;

    notApplicableLabel: string;
    error?: string;
}


const RATINGS: Rating[] = [1, 2, 3, 4, 5];


export default function RatingQuestion({
    question,
    helperText,
    value,
    onChange,
    scale,
    notApplicableLabel,
    error,
}: RatingQuestionProps) {

    const { theme } = useTheme();

    const selectedRating =
        typeof value === "number" ? value : null;

    return (
        <View className="gap-3">

            {/* ================================= */}
            {/* QUESTION */}
            {/* ================================= */}

            <View className="gap-1">

                <AppText variant="title">
                    {question}
                </AppText>

                {helperText && (
                    <AppText
                        variant="bodySmall"
                        color="muted"
                    >
                        {helperText}
                    </AppText>
                )}

            </View>


            {/* ================================= */}
            {/* RATING OPTIONS */}
            {/* ================================= */}

            <View className="flex-row gap-1">

                {RATINGS.map((rating) => {

                    const selected = selectedRating === rating;

                    const filled = selectedRating !== null &&
                        rating <= selectedRating;

                    const option = scale[rating];

                    return (
                        <Pressable
                            key={rating}
                            onPress={() => onChange(rating)}
                            accessibilityRole="radio"
                            accessibilityState={{
                                checked: selected,
                            }}
                            accessibilityLabel={
                                `${rating} out of 5. ${option.label}. ${option.description}`
                            }
                            className="flex-1 min-w-0 items-center gap-1.5 rounded-lg py-2"
                            style={{
                                backgroundColor: selected
                                    ? theme.surfaceSecondary
                                    : "transparent",
                            }}
                        >

                            {/* Star */}
                            <Ionicons
                                name={filled ? "star" : "star-outline"}
                                size={25}
                                color={filled
                                    ? theme.primary
                                    : theme.muted
                                }
                            />

                            {/* Rating number */}
                            <AppText
                                variant="caption"
                                color={selected ? "primary" : "muted"}
                                style={{
                                    fontWeight: selected ? "700" : "400",
                                }}
                            >
                                {rating}
                            </AppText>

                            {/* Short description */}
                            <AppText
                                variant="caption"
                                color={selected ? "foreground" : "muted"}
                                align="center"
                                style={{
                                    fontSize: 10,
                                    lineHeight: 13,
                                    fontWeight: selected ? "600" : "400",
                                }}
                            >
                                {option.label}
                            </AppText>

                        </Pressable>
                    );
                })}

            </View>


            {/* ================================= */}
            {/* SELECTED DESCRIPTION */}
            {/* ================================= */}

            {selectedRating !== null && (

                <View
                    className="rounded-lg p-3 gap-1"
                    style={{
                        backgroundColor: theme.surfaceSecondary,
                    }}
                >

                    <AppText
                        variant="label"
                        color="primary"
                    >
                        {selectedRating} – {scale[selectedRating].label}
                    </AppText>

                    <AppText variant="bodySmall">
                        {scale[selectedRating].description}
                    </AppText>

                </View>

            )}


            {/* ================================= */}
            {/* NOT APPLICABLE */}
            {/* ================================= */}

            <Pressable
                onPress={() => onChange("notApplicable")}
                accessibilityRole="radio"
                accessibilityState={{
                    checked: value === "notApplicable",
                }}
                className="flex-row items-center gap-2 self-start rounded-lg border px-3 py-2"
                style={{
                    borderColor: value === "notApplicable"
                        ? theme.primary
                        : theme.border,
                    backgroundColor: value === "notApplicable"
                        ? theme.surfaceSecondary
                        : "transparent",
                }}
            >

                <Ionicons
                    name={
                        value === "notApplicable"
                            ? "checkmark-circle"
                            : "ellipse-outline"
                    }
                    size={18}
                    color={
                        value === "notApplicable"
                            ? theme.primary
                            : theme.muted
                    }
                />

                <AppText
                    variant="bodySmall"
                    color={
                        value === "notApplicable"
                            ? "primary"
                            : "muted"
                    }
                >
                    {notApplicableLabel}
                </AppText>

            </Pressable>


            {/* ================================= */}
            {/* VALIDATION ERROR */}
            {/* ================================= */}

            {error && (
                <AppText
                    variant="caption"
                    color="error"
                >
                    {error}
                </AppText>
            )}

        </View>
    );
}
