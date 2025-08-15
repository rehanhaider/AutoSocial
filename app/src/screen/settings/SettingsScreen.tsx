import React from "react";
import { useSettingsStore } from "@/lib/state/settingStore";
import { View, Switch, StyleSheet, Pressable, Text, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/styles";
import { Theme } from "@/lib/types/settingsTypes";
import * as Haptics from "expo-haptics";

const SettingsScreen: React.FC = () => {
    const { theme, hapticFeedback, setTheme, setHapticFeedback } = useSettingsStore();
    const { colors } = useTheme();

    const themeOptions: { label: string; value: Theme }[] = [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Premium", value: "premium" },
        { label: "System", value: "system" },
    ];

    const handleThemeChange = (newTheme: Theme) => {
        // Trigger haptic feedback if enabled
        if (hapticFeedback === "enabled") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setTheme(newTheme);
    };

    const handleHapticFeedbackChange = (value: boolean) => {
        // Always trigger feedback when turning ON, but not when turning OFF
        if (value) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setHapticFeedback(value ? "enabled" : "disabled");
    };

    return (
        <ScrollView style={[{ flex: 1 }, { backgroundColor: colors.surface.base }]}>
            <View style={[styles.container, { backgroundColor: colors.surface.base }]}>
                {/* Theme Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Theme</Text>
                    <View style={[styles.segmentedControl, { backgroundColor: colors.surface.muted }]}>
                        {themeOptions.map((option) => (
                            <Pressable
                                key={option.value}
                                style={[
                                    styles.segment,
                                    {
                                        backgroundColor: theme === option.value ? colors.palette.brand[500] : "transparent",
                                    },
                                ]}
                                onPress={() => handleThemeChange(option.value)}
                            >
                                <Text
                                    style={{
                                        color: theme === option.value ? colors.content.primary : colors.content.secondary,
                                    }}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Haptic Feedback Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Haptic Feedback</Text>
                    <Switch
                        value={hapticFeedback === "enabled"}
                        onValueChange={(value) => handleHapticFeedbackChange(value)}
                        trackColor={{ false: colors.surface.muted, true: colors.palette.brand[500] }}
                        thumbColor={hapticFeedback === "enabled" ? colors.content.primary : colors.content.secondary}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
    },
    settingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: 16,
        flex: 1,
    },
    segmentedControl: {
        flexDirection: "row",
        borderRadius: BorderRadius.md,
        overflow: "hidden",
    },
    segment: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    selector: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        minWidth: 200,
    },
    selectorText: {
        fontSize: 16,
        fontWeight: "500",
    },
    selectorSubtext: {
        fontSize: 14,
        marginTop: 2,
    },
    flag: {
        fontSize: 20,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: Spacing.lg,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: Spacing.lg,
        borderBottomWidth: 1,
    },
    modalItemText: {
        fontSize: 16,
        fontWeight: "500",
    },
    modalItemSubtext: {
        fontSize: 14,
        marginTop: 2,
    },
});

export default SettingsScreen;
