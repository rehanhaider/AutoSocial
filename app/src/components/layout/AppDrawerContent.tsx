import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerContentComponentProps } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Spacing } from "@/styles";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "react-native";

const AppDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const menuItems = [
        { label: "Home", icon: "home-outline", route: "/private/(tabs)" },
        { label: "Settings", icon: "settings-outline", route: "/private/settings" },
    ];

    const handleMenuItemPress = (route: string) => {
        props.navigation.closeDrawer();
        router.push(route as any);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface.primary }]}>
            <DrawerContentScrollView {...props} contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + Spacing.lg }]}>
                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, { borderBottomColor: colors.border.secondary }]}
                            onPress={() => handleMenuItemPress(item.route)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={item.icon as any} size={24} color={colors.content.secondary} />
                            <Text style={{ color: colors.content.primary, marginLeft: Spacing.md }}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </DrawerContentScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    title: {
        fontSize: Typography.display.large.fontSize,
    },
    menuContainer: {
        paddingTop: Spacing.md,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default AppDrawerContent;
