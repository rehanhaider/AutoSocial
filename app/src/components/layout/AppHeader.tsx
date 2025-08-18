import React from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Spacing } from "@/styles";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Logo from "./Logo";

const AppHeader: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { colors, shadows, isDark } = useTheme();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    const statusBarStyle = isDark ? "light-content" : "dark-content";
    const statusBarBg = colors.surface.primary;

    const handleMenuPress = () => {
        navigation.openDrawer();
    };

    const handleSettingsPress = () => {
        router.push("/settings");
    };

    return (
        <>
            <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarBg} />
            <View
                className="border-b"
                style={[
                    {
                        paddingTop: insets.top,
                        paddingBottom: Spacing.sm,
                        backgroundColor: colors.surface.primary,
                        borderBottomColor: colors.border.secondary,
                        ...shadows.sm,
                    },
                ]}
            >
                <View className="flex-row items-center justify-between" style={[{ paddingHorizontal: Spacing.xs, paddingTop: Spacing.sm }]}>
                    {/* Left side - Hamburger Menu */}
                    <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={handleMenuPress} activeOpacity={0.7}>
                        <Ionicons name="menu" size={24} color={colors.content.primary} />
                    </TouchableOpacity>
                    <Logo style={{ flex: 1, marginLeft: Spacing.sm }} />
                    {/* Right side - Icons */}
                    <View className="flex-row items-center justify-center">
                        <TouchableOpacity
                            className="w-10 h-10 items-center justify-center"
                            onPress={handleSettingsPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="ellipsis-vertical" size={24} color={colors.content.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

export default AppHeader;
