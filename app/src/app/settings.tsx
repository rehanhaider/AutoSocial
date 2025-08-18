import React from "react";
import { Stack, useRouter } from "expo-router";
import SettingsScreen from "@/screen/settings/SettingsScreen";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing } from "@/styles";

export default function Settings() {
    const router = useRouter();
    const { colors, colorScheme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <StatusBar
                barStyle={colorScheme === "dark" || colorScheme === "premium" ? "light-content" : "dark-content"}
                backgroundColor={colors.surface.primary}
            />
            <View className="flex-1" style={{ backgroundColor: colors.surface.primary }}>
                {/* Custom Header */}
                <View
                    className="flex-row items-center border-b"
                    style={{
                        paddingTop: insets.top,
                        paddingHorizontal: Spacing.md,
                        paddingBottom: Spacing.md,
                        backgroundColor: colors.surface.primary,
                        borderBottomColor: colors.border.secondary,
                    }}
                >
                    <TouchableOpacity className="p-2" onPress={() => router.back()} style={{ marginRight: Spacing.md }} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={24} color={colors.content.primary} />
                    </TouchableOpacity>
                    <Text className="flex-1 text-lg font-semibold" style={{ color: colors.content.primary }}>
                        Settings
                    </Text>
                </View>

                {/* Settings Content */}
                <SettingsScreen />
            </View>
        </>
    );
}
