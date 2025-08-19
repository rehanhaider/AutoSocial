import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/stores/authStore";
import { useTheme } from "@/hooks/useTheme";
import "@/styles/global.css";

SplashScreen.preventAutoHideAsync();

// This component wraps the main app content and applies theme/safe area
const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { colorScheme } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <StatusBar style={colorScheme === "dark" || colorScheme === "premium" ? "light" : "dark"} />
                {children}
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

// Protected Stack component that has access to auth store
const ProtectedStack: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Public routes - always accessible */}
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />

            {/* Auth routes - only accessible when NOT authenticated */}
            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>

            {/* Private routes - only accessible when authenticated */}
            <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="private" options={{ headerShown: false }} />
                <Stack.Screen name="accountSettings" />
            </Stack.Protected>
        </Stack>
    );
};

const RootLayout: React.FC = () => {
    const [loaded] = useFonts({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider>
            <AppWrapper>
                <ProtectedStack />
            </AppWrapper>
        </ThemeProvider>
    );
};

export default RootLayout;
