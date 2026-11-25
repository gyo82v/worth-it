import { useState } from "react";
import {
    TextInput,
    TextInputProps,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

import { useTheme } from "@/theme";

import AppText from "../AppText";

export interface TextFieldProps extends Omit<
    TextInputProps,
    "style" | "value" | "onChangeText"
> {
    label?: string;

    value: string;
    onChangeText: (value: string) => void;

    helperText?: string;
    error?: string;

    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
}


export default function TextField({
    label,
    value,
    onChangeText,
    helperText,
    error,
    containerStyle,
    inputStyle,
    editable = true,
    multiline = false,
    onFocus,
    onBlur,
    accessibilityLabel,
    placeholderTextColor,
    ...textInputProps
}: TextFieldProps) {

    const { theme } = useTheme();

    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
        ? theme.error
        : isFocused
            ? theme.primary
            : theme.border;

    return (
        <View
            className="gap-1.5"
            style={containerStyle}
        >
            {/* Label */}
            {label && (
                <AppText variant="label">
                    {label}
                </AppText>
            )}

            {/* Input container */}
            <View
                className={`
                    flex-row
                    rounded-lg
                    border
                    px-3
                    ${multiline ? "items-start" : "items-center"}
                `}
                style={[
                    {
                        minHeight: multiline ? 112 : 48,
                        backgroundColor: editable
                            ? theme.surface
                            : theme.surfaceSecondary,
                        borderColor,
                    },
                ]}
            >
                <TextInput
                    {...textInputProps}
                    value={value}
                    onChangeText={onChangeText}
                    editable={editable}
                    multiline={multiline}
                    onFocus={(event) => {
                        setIsFocused(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setIsFocused(false);
                        onBlur?.(event);
                    }}
                    accessibilityLabel={accessibilityLabel ?? label}
                    placeholderTextColor={
                        placeholderTextColor ?? theme.muted
                    }
                    selectionColor={theme.primary}
                    className="flex-1"
                    style={[
                        {
                            color: editable
                                ? theme.foreground
                                : theme.muted,
                            fontSize: 16,
                            minHeight: multiline ? 88 : 46,
                            paddingVertical: multiline ? 12 : 0,
                            textAlignVertical: multiline ? "top" : "center",
                        },
                        inputStyle,
                    ]}
                />
            </View>

            {/* Helper text / Error */}
            {error ? (
                <AppText variant="caption" color="error">
                    {error}
                </AppText>
            ) : helperText ? (
                <AppText variant="caption" color="muted">
                    {helperText}
                </AppText>
            ) : null}
        </View>
    );
}
