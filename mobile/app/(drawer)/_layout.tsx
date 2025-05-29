import { getUserEmail, getUserFirstName, getUserInitials } from "@/lib/auth/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { useThemeColors } from "@/lib/hooks/useThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function CustomDrawerContent(props: any) {
    const router = useRouter();
    const { userAttributes, loading, logout } = useAuth();
    const colors = useThemeColors();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const dynamicStyles = StyleSheet.create({
        drawerContainer: {
            backgroundColor: colors.surface,
        },
        userSection: {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
        },
        avatar: {
            backgroundColor: colors.primary,
        },
        greeting: {
            color: colors.text,
        },
        userEmail: {
            color: colors.textSecondary,
        },
        logoutButton: {
            borderTopColor: colors.border,
        },
        logoutText: {
            color: colors.error,
        },
    });

    if (loading) {
        return (
            <DrawerContentScrollView {...props} style={[styles.drawerContainer, dynamicStyles.drawerContainer]}>
                <View style={[styles.userSection, dynamicStyles.userSection]}>
                    <View style={[styles.avatar, dynamicStyles.avatar]}>
                        <Text style={styles.avatarText}>...</Text>
                    </View>
                    <Text style={[styles.greeting, dynamicStyles.greeting]}>Loading...</Text>
                </View>
            </DrawerContentScrollView>
        );
    }

    return (
        <DrawerContentScrollView {...props} style={[styles.drawerContainer, dynamicStyles.drawerContainer]}>
            {/* User Info Section */}
            <View style={[styles.userSection, dynamicStyles.userSection]}>
                <View style={[styles.avatar, dynamicStyles.avatar]}>
                    <Text style={styles.avatarText}>{getUserInitials(userAttributes)}</Text>
                </View>
                <Text style={[styles.greeting, dynamicStyles.greeting]}>Hi, {getUserFirstName(userAttributes)}!</Text>
                <Text style={[styles.userEmail, dynamicStyles.userEmail]}>{getUserEmail(userAttributes)}</Text>
            </View>

            {/* Navigation Items */}
            <View style={styles.navigationSection}>
                <DrawerItem
                    label="Dashboard"
                    icon={({ color, size }) => <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />}
                    onPress={() => props.navigation.navigate("(tabs)", { screen: "index" })}
                    activeTintColor={colors.primary}
                    inactiveTintColor={colors.iconPrimary}
                    labelStyle={{ color: colors.text }}
                />

                <DrawerItem
                    label="Create Post"
                    icon={({ color, size }) => <MaterialCommunityIcons name="plus-circle" color={color} size={size} />}
                    onPress={() => props.navigation.navigate("(tabs)", { screen: "add_post" })}
                    activeTintColor={colors.primary}
                    inactiveTintColor={colors.iconPrimary}
                    labelStyle={{ color: colors.text }}
                />

                <DrawerItem
                    label="Calendar"
                    icon={({ color, size }) => <MaterialCommunityIcons name="calendar" color={color} size={size} />}
                    onPress={() => props.navigation.navigate("(tabs)", { screen: "calendar" })}
                    activeTintColor={colors.primary}
                    inactiveTintColor={colors.iconPrimary}
                    labelStyle={{ color: colors.text }}
                />

                <View style={[styles.divider, { backgroundColor: colors.divider }]} />

                <DrawerItem
                    label="Settings"
                    icon={({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />}
                    onPress={() => {
                        props.navigation.closeDrawer();
                        router.push("/(drawer)/(tabs)/settings");
                    }}
                    activeTintColor={colors.primary}
                    inactiveTintColor={colors.iconPrimary}
                    labelStyle={{ color: colors.text }}
                />

                <DrawerItem
                    label="Help & Support"
                    icon={({ color, size }) => <MaterialCommunityIcons name="help-circle" color={color} size={size} />}
                    onPress={() => {
                        console.log("Help pressed");
                    }}
                    activeTintColor={colors.primary}
                    inactiveTintColor={colors.iconPrimary}
                    labelStyle={{ color: colors.text }}
                />
            </View>

            {/* Logout Section */}
            <View style={[styles.logoutSection, dynamicStyles.logoutButton]}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" color={colors.error} size={20} />
                    <Text style={[styles.logoutText, dynamicStyles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

export default function DrawerLayout() {
    const colors = useThemeColors();

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.iconPrimary,
                drawerStyle: {
                    backgroundColor: colors.surface,
                },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                    title: "Main App",
                }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    userSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        alignItems: "center",
        backgroundColor: "#f8fafc",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#4f46e5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    avatarText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    greeting: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: "#64748b",
    },
    navigationSection: {
        flex: 1,
        paddingTop: 10,
    },
    divider: {
        height: 1,
        backgroundColor: "#e2e8f0",
        marginVertical: 10,
        marginHorizontal: 20,
    },
    logoutSection: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    logoutText: {
        color: "#ef4444",
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 12,
    },
});
