import React from "react";
import { useSettingsStore } from "@/state/settingStore";
import { View, Switch, StyleSheet, Pressable, Text, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/styles";
import { ThemeMode as Theme } from "@/types/theme";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen: React.FC = () => {
    const { theme, hapticFeedback, setTheme, setHapticFeedback } = useSettingsStore();
    const { colors } = useTheme();
    const [isThemeModalVisible, setThemeModalVisible] = React.useState(false);

    const themeOptions: { label: string; value: Theme }[] = [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Premium", value: "premium" },
        { label: "System", value: "system" },
    ];

    const handleThemeChange = (newTheme: Theme) => {
        if (hapticFeedback === "enabled") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setTheme(newTheme);
        setThemeModalVisible(false); // Close modal on selection
    };

    const handleHapticFeedbackChange = (value: boolean) => {
        if (value) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setHapticFeedback(value ? "enabled" : "disabled");
    };

    const selectedThemeLabel = themeOptions.find((option) => option.value === theme)?.label || "Light";

    return (
        <ScrollView style={[{ flex: 1 }, { backgroundColor: colors.surface.primary }]}>
            <View style={[styles.container, { backgroundColor: colors.surface.primary }]}>
                {/* Theme Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Theme</Text>
                    <Pressable
                        style={[
                            styles.selector,
                            {
                                backgroundColor: colors.surface.secondary,
                                borderColor: colors.border.secondary,
                                borderWidth: 1,
                            },
                        ]}
                        onPress={() => setThemeModalVisible(true)}
                    >
                        <Text style={[styles.selectorText, { color: colors.content.primary }]}>{selectedThemeLabel}</Text>
                        <Ionicons name="chevron-down-outline" size={20} color={colors.content.secondary} style={styles.selectorIcon} />
                    </Pressable>

                    <Modal
                        transparent={true}
                        visible={isThemeModalVisible}
                        onRequestClose={() => setThemeModalVisible(false)}
                        animationType="fade"
                    >
                        <TouchableWithoutFeedback onPress={() => setThemeModalVisible(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={[styles.modalContent, { backgroundColor: colors.surface.tertiary }]}>
                                    {themeOptions.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            style={[styles.modalItem, { borderBottomColor: colors.border.secondary }]}
                                            onPress={() => handleThemeChange(option.value)}
                                        >
                                            <Text
                                                style={[
                                                    styles.modalItemText,
                                                    {
                                                        color: theme === option.value ? colors.content.accent : colors.content.primary,
                                                    },
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                            {theme === option.value && (
                                                <Ionicons name="checkmark" size={20} color={colors.content.accent} />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>

                {/* Haptic Feedback Setting */}
                <View style={styles.settingContainer}>
                    <Text style={[styles.label, { color: colors.content.primary }]}>Haptic Feedback</Text>
                    <Switch
                        value={hapticFeedback === "enabled"}
                        onValueChange={(value) => handleHapticFeedbackChange(value)}
                        trackColor={{ false: colors.surface.secondary, true: colors.interactive.primary.default }}
                        thumbColor={hapticFeedback === "enabled" ? colors.pure.white : colors.content.secondary}
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
        borderWidth: 1,
    },
    segment: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        minWidth: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentText: {
        fontSize: 14,
        textAlign: "center",
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
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        borderRadius: BorderRadius.lg,
        overflow: "hidden",
    },
    selectorIcon: {
        marginLeft: Spacing.sm,
    },
});

export default SettingsScreen;
