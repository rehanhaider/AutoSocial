import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/lib/hooks/useAuth";
import { ActivityIndicator, View } from "react-native";

// This hook will protect the route access based on authentication state.
function useProtectedRoute(user: boolean | null) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            // Still loading auth state
            return;
        }

        if (!user && segments[0] !== "login") {
            // Redirect to the login page if the user is not authenticated and not already on the login page.
            router.replace("/login");
        } else if (user && segments[0] === "login") {
            // Redirect to the main app if the user is authenticated and currently on the login page.
            router.replace("/(drawer)/(tabs)");
        }
    }, [user, segments, router]);
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loadedFonts] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
    const { isAuthenticated, loading } = useAuth();

    useProtectedRoute(isAuthenticated);

    if (!loadedFonts || loading) {
        // Show a loading indicator while fonts are loading or auth check is in progress
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen
                    name="(drawer)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
