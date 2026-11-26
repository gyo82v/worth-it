
import { ReactNode } from "react";
import {
    Pressable,
    StyleProp,
    View,
    ViewStyle,
} from "react-native";

import { useTheme } from "@/theme";

import AppText from "./AppText";
import Card from "./Card";


export interface SelectableCardProps {
    title: string;
    description?: string;
    icon?: ReactNode;

    selected: boolean;
    onPress: () => void;

    disabled?: boolean;

    layout?: "horizontal" | "vertical";

    accessibilityLabel?: string;
    testID?: string;

    style?: StyleProp<ViewStyle>;
}


export default function SelectableCard({
    title,
    description,
    icon,
    selected,
    onPress,
    disabled = false,
    layout = "horizontal",
    accessibilityLabel,
    testID,
    style,
}: SelectableCardProps) {

    const { theme } = useTheme();

    const isVertical = layout === "vertical";

    const indicator = (
        <View
            className="h-[18px] w-[18px] items-center justify-center rounded-full border"
            style={{
                backgroundColor: selected
                    ? theme.primary
                    : "transparent",
                borderColor: selected
                    ? theme.primary
                    : theme.border,
            }}
        >
            {selected && (
                <AppText
                    variant="caption"
                    color="onPrimary"
                    style={{
                        fontSize: 10,
                        lineHeight: 14,
                        fontWeight: "700",
                    }}
                >
                    ✓
                </AppText>
            )}
        </View>
    );

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityState={{
                selected,
                disabled,
            }}
            testID={testID}
            style={({ pressed }) => [
                {
                    opacity: pressed && !disabled
                        ? 0.8
                        : disabled
                            ? 0.5
                            : 1,
                },
                style,
            ]}
        >
            <Card
                variant="outlined"
                style={{
                    position: "relative",

                    flexDirection: isVertical ? "column" : "row",

                    alignItems: "center",

                    justifyContent: isVertical
                        ? "center"
                        : "flex-start",

                    gap: isVertical ? 8 : 12,

                    // Fixed dimensions for vertical cards.
                    height: isVertical ? 112 : undefined,

                    paddingVertical: isVertical ? 10 : 16,
                    paddingHorizontal: isVertical ? 6 : 16,

                    // Selection must not change card dimensions.
                    borderWidth: 1.5,

                    backgroundColor: selected
                        ? theme.surfaceSecondary
                        : theme.surface,

                    borderColor: selected
                        ? theme.primary
                        : theme.border,
                }}
            >

                {/* Icon */}
                {icon && (
                    <View>
                        {icon}
                    </View>
                )}


                {/* Title and description */}
                <View
                    className={isVertical
                        ? "w-full items-center"
                        : "flex-1 gap-1"
                    }
                >
                    <AppText
                        variant={isVertical ? "bodySmall" : "title"}
                        align={isVertical ? "center" : "left"}
                        style={isVertical ? {
                            fontSize: 12,
                            lineHeight: 16,
                            fontWeight: "600",
                            letterSpacing: -0.2,
                        } : undefined}
                    >
                        {title}
                    </AppText>

                    {description && (
                        <AppText
                            variant="bodySmall"
                            color="muted"
                            align={isVertical ? "center" : "left"}
                        >
                            {description}
                        </AppText>
                    )}
                </View>


                {/* Selection indicator */}
                {isVertical ? (
                    <View
                        pointerEvents="none"
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                        }}
                    >
                        {indicator}
                    </View>
                ) : (
                    indicator
                )}

            </Card>
        </Pressable>
    );
}

