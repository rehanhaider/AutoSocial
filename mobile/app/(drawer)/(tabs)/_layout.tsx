import { useThemeColors } from "@/lib/hooks/useThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Tabs, useNavigation, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const PlusIcon = ({ color, size }: { color: string; size: number }) => (
    <View style={styles.plusIconContainer}>
        <MaterialCommunityIcons name="plus-circle" color={color} size={size * 1.5} />
    </View>
);

export default function TabLayout() {
    const router = useRouter();
    const navigation = useNavigation();
    const colors = useThemeColors();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                headerTitleStyle: {
                    color: colors.text,
                },
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    height: 70,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.iconPrimary,
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.dispatch(DrawerActions.openDrawer());
                        }}
                        style={{ marginLeft: Platform.OS === "ios" ? 15 : 10 }}
                    >
                        <MaterialCommunityIcons name="menu" size={28} color={colors.iconPrimary} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push("/(drawer)/(tabs)/settings");
                        }}
                        style={{ marginRight: Platform.OS === "ios" ? 15 : 10 }}
                    >
                        <MaterialCommunityIcons name="cog" size={26} color={colors.iconPrimary} />
                    </TouchableOpacity>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="add_post"
                options={{
                    title: "New Post",
                    tabBarIcon: ({ color, size }) => <PlusIcon color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Calendar",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
const styles = StyleSheet.create({
    plusIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        borderRadius: 30,
    },
});
