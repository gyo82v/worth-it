
import { Host, Picker } from "@expo/ui";
import {
    StyleProp,
    View,
    ViewStyle,
} from "react-native";

import { useTheme } from "@/theme";
import AppText from "../AppText";


export type SelectOption<T extends string | number = string> = {
    label: string;
    value: T;
};


export interface SelectFieldProps<T extends string | number = string> {
    label?: string;

    value: T;
    onValueChange: (value: T) => void;

    options: SelectOption<T>[];

    helperText?: string;
    error?: string;

    disabled?: boolean;

    accessibilityLabel?: string;
    testID?: string;

    containerStyle?: StyleProp<ViewStyle>;
}


export default function SelectField<T extends string | number = string>({
    label,
    value,
    onValueChange,
    options,
    helperText,
    error,
    disabled = false,
    accessibilityLabel,
    testID,
    containerStyle,
}: SelectFieldProps<T>) {

    const { theme, mode } = useTheme();

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

            {/* Picker container */}
            <View
                className="rounded-lg border px-3"
                style={{
                    minHeight: 48,
                    justifyContent: "center",
                    backgroundColor: disabled
                        ? theme.surfaceSecondary
                        : theme.surface,
                    borderColor: error
                        ? theme.error
                        : theme.border,
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <Host
                    colorScheme={mode}
                    seedColor={theme.primary}
                    matchContents={{ vertical: true }}
                    style={{ width: "100%" }}
                >
                    <Picker
                        appearance="menu"
                        selectedValue={value}
                        onValueChange={onValueChange}
                        enabled={!disabled}
                        accessibilityLabel={accessibilityLabel ?? label}
                        testID={testID}
                    >
                        {options.map((option) => (
                            <Picker.Item
                                key={String(option.value)}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                </Host>
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
