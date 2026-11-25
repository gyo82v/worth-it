
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

    // Optional icon supplied by the parent.
    icon?: ReactNode;

    selected: boolean;
    onPress: () => void;

    disabled?: boolean;

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
    accessibilityLabel,
    testID,
    style,
}: SelectableCardProps) {

    const { theme } = useTheme();

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
                    opacity: pressed && !disabled ? 0.8 : disabled ? 0.5 : 1,
                },
                style,
            ]}
        >
            <Card
                variant="outlined"
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: selected
                        ? theme.surfaceSecondary
                        : theme.surface,
                    borderColor: selected
                        ? theme.primary
                        : theme.border,
                    borderWidth: selected ? 1.5 : 1,
                }}
            >
                {/* Optional icon */}
                {icon && (
                    <View>
                        {icon}
                    </View>
                )}

                {/* Title and description */}
                <View className="flex-1 gap-1">
                    <AppText variant="title">
                        {title}
                    </AppText>

                    {description && (
                        <AppText
                            variant="bodySmall"
                            color="muted"
                        >
                            {description}
                        </AppText>
                    )}
                </View>

                {/* Selection indicator */}
                <View
                    className="h-5 w-5 items-center justify-center rounded-full border"
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
                                fontSize: 12,
                                lineHeight: 16,
                            }}
                        >
                            ✓
                        </AppText>
                    )}
                </View>

            </Card>
        </Pressable>
    );
}
