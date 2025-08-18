import React from "react";
import { useSettingsStore } from "@/stores/settingStore";
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
        <ScrollView className="flex-1" style={[{ backgroundColor: colors.surface.primary }]}>
            <View className="flex-1 p-md" style={[{ backgroundColor: colors.surface.primary }]}>
                {/* Theme Setting */}
                <View className="flex-row justify-between items-center mt-sm mb-md">
                    <Text className="flex-1" style={[{ color: colors.content.primary }]}>
                        Theme
                    </Text>
                    <Pressable
                        className="flex-row items-center px-sm py-sm w-1/2 rounded-md border justify-center"
                        style={[{ backgroundColor: colors.surface.secondary, borderColor: colors.border.secondary }]}
                        onPress={() => setThemeModalVisible(true)}
                    >
                        <Text className="font-bold" style={[{ color: colors.content.primary }]}>
                            {selectedThemeLabel}
                        </Text>
                        <Ionicons name="chevron-down-outline" size={20} color={colors.content.secondary} />
                    </Pressable>

                    <Modal
                        transparent={true}
                        visible={isThemeModalVisible}
                        onRequestClose={() => setThemeModalVisible(false)}
                        animationType="fade"
                    >
                        <TouchableWithoutFeedback onPress={() => setThemeModalVisible(false)}>
                            <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.surface.overlay }}>
                                <View
                                    className="w-2/3 rounded-lg overflow-hidden py-sm"
                                    style={[{ backgroundColor: colors.surface.tertiary }]}
                                >
                                    {themeOptions.map((option) => (
                                        <Pressable
                                            className="flex-row items-center px-lg py-md mx-sm my-xs rounded-lg"
                                            key={option.value}
                                            style={[
                                                {
                                                    backgroundColor: colors.surface.secondary,
                                                    elevation: 2,
                                                },
                                            ]}
                                            onPress={() => handleThemeChange(option.value)}
                                        >
                                            <Text
                                                className="font-bold"
                                                style={[
                                                    {
                                                        color: theme === option.value ? colors.content.primary : colors.content.accent,
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
                <View className="flex-row justify-between items-center my-md">
                    <Text className="flex-1" style={[{ color: colors.content.primary }]}>
                        Haptic Feedback
                    </Text>
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

export default SettingsScreen;
