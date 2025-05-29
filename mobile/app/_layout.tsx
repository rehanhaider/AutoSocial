import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider } from "@/lib/hooks/AuthProvider";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTheme } from "@/lib/hooks/useTheme";
import { ActivityIndicator, View } from "react-native";

// This component contains the core app content and navigation logic.
// It uses the useAuth hook to react to authentication state changes.
function AppContent() {
    const [loadedFonts] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { isDark, loading: themeLoading } = useTheme();
    const router = useRouter();

    useEffect(() => {
        console.log("🚀 AppContent: useEffect triggered - isAuthenticated:", isAuthenticated, "authLoading:", authLoading);
        // Wait for auth loading to complete before navigating
        if (authLoading) {
            console.log("🚀 AppContent: Auth state is loading, not navigating yet.");
            return;
        }

        if (isAuthenticated === null) {
            console.log("🚀 AppContent: isAuthenticated is null (initial state), not navigating.");
            return;
        }

        if (!isAuthenticated) {
            console.log("🚀 AppContent: Not authenticated, navigating to /login");
            router.replace("/login");
        } else {
            console.log("🚀 AppContent: Authenticated, navigating to /(drawer)/(tabs)");
            router.replace("/(drawer)/(tabs)");
        }
    }, [isAuthenticated, authLoading, router]);

    // Show a global loading indicator if fonts, theme, or auth state is loading.
    if (!loadedFonts || themeLoading || authLoading || isAuthenticated === null) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={isDark ? "light" : "dark"} />
        </ThemeProvider>
    );
}

// RootLayout now wraps AppContent with AuthProvider to provide global auth state.
export default function RootLayout() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
