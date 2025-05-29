import { getUserEmail, getUserFullName } from "@/lib/auth/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { ThemeMode, useTheme } from "@/lib/hooks/useTheme";
import { useThemeColors } from "@/lib/hooks/useThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
    const { userAttributes, logout } = useAuth();
    const { themeMode, setTheme, systemColorScheme, loading: themeLoading } = useTheme();
    const colors = useThemeColors();

    const handleThemeChange = async (theme: ThemeMode) => {
        try {
            await setTheme(theme);
        } catch (error) {
            console.error("Failed to save theme preference:", error);
            Alert.alert("Error", "Failed to save theme preference");
        }
    };

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        await logout();
                    } catch (error) {
                        console.error("Logout failed:", error);
                        Alert.alert("Error", "Failed to logout. Please try again.");
                    }
                },
            },
        ]);
    };

    const ThemeOption = ({ mode, label, icon }: { mode: ThemeMode; label: string; icon: string }) => (
        <TouchableOpacity
            style={[
                styles.themeOption,
                {
                    backgroundColor: colors.surface,
                    borderColor: themeMode === mode ? colors.primary : colors.border,
                },
                themeMode === mode && { backgroundColor: colors.primary + "10" },
            ]}
            onPress={() => handleThemeChange(mode)}
        >
            <View style={styles.themeOptionLeft}>
                <MaterialCommunityIcons name={icon as any} size={24} color={themeMode === mode ? colors.primary : colors.iconPrimary} />
                <Text style={[styles.themeOptionText, { color: themeMode === mode ? colors.primary : colors.text }]}>{label}</Text>
            </View>
            {themeMode === mode && <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
    );

    if (themeLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Loading...</Text>
            </View>
        );
    }

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
        },
        header: {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
        },
        headerText: {
            color: colors.text,
        },
        sectionTitle: {
            color: colors.text,
        },
        userCard: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        userName: {
            color: colors.text,
        },
        userEmail: {
            color: colors.textSecondary,
        },
        themeContainer: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        themeLabel: {
            color: colors.text,
        },
        themeDescription: {
            color: colors.textSecondary,
        },
        settingItem: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        settingText: {
            color: colors.text,
        },
        logoutButton: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
    });

    return (
        <ScrollView style={[styles.container, dynamicStyles.container]}>
            <View style={[styles.header, dynamicStyles.header]}>
                <MaterialCommunityIcons name="cog" size={32} color={colors.primary} />
                <Text style={[styles.headerText, dynamicStyles.headerText]}>Settings</Text>
            </View>

            {/* User Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Account</Text>
                <View style={[styles.userCard, dynamicStyles.userCard]}>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, dynamicStyles.userName]}>{getUserFullName(userAttributes)}</Text>
                        <Text style={[styles.userEmail, dynamicStyles.userEmail]}>{getUserEmail(userAttributes)}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="pencil" size={20} color={colors.iconPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Theme Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Appearance</Text>
                <View style={[styles.themeContainer, dynamicStyles.themeContainer]}>
                    <Text style={[styles.themeLabel, dynamicStyles.themeLabel]}>Theme</Text>
                    <Text style={[styles.themeDescription, dynamicStyles.themeDescription]}>
                        Current: {themeMode === "system" ? `System (${systemColorScheme})` : themeMode}
                    </Text>

                    <View style={styles.themeOptions}>
                        <ThemeOption mode="light" label="Light" icon="white-balance-sunny" />
                        <ThemeOption mode="dark" label="Dark" icon="moon-waning-crescent" />
                        <ThemeOption mode="system" label="System" icon="theme-light-dark" />
                    </View>
                </View>
            </View>

            {/* App Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>App</Text>

                <TouchableOpacity style={[styles.settingItem, dynamicStyles.settingItem]}>
                    <View style={styles.settingLeft}>
                        <MaterialCommunityIcons name="bell" size={24} color={colors.iconPrimary} />
                        <Text style={[styles.settingText, dynamicStyles.settingText]}>Notifications</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.iconSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, dynamicStyles.settingItem]}>
                    <View style={styles.settingLeft}>
                        <MaterialCommunityIcons name="shield-check" size={24} color={colors.iconPrimary} />
                        <Text style={[styles.settingText, dynamicStyles.settingText]}>Privacy & Security</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.iconSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, dynamicStyles.settingItem]}>
                    <View style={styles.settingLeft}>
                        <MaterialCommunityIcons name="information" size={24} color={colors.iconPrimary} />
                        <Text style={[styles.settingText, dynamicStyles.settingText]}>About</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.iconSecondary} />
                </TouchableOpacity>
            </View>

            {/* Logout Section */}
            <View style={styles.section}>
                <TouchableOpacity style={[styles.logoutButton, dynamicStyles.logoutButton]} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={24} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e293b",
        marginTop: 8,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 12,
    },
    userCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
    },
    userEmail: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 2,
    },
    editButton: {
        padding: 8,
    },
    themeContainer: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    themeLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 4,
    },
    themeDescription: {
        fontSize: 14,
        color: "#64748b",
        marginBottom: 16,
    },
    themeOptions: {
        gap: 8,
    },
    themeOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    themeOptionSelected: {
        borderColor: "#4f46e5",
        backgroundColor: "#f8fafc",
    },
    themeOptionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    themeOptionText: {
        fontSize: 16,
        color: "#64748b",
    },
    themeOptionTextSelected: {
        color: "#4f46e5",
        fontWeight: "500",
    },
    settingItem: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    settingText: {
        fontSize: 16,
        color: "#1e293b",
    },
    logoutButton: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ef4444",
    },
});
