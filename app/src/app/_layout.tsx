import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { sharedQueryClient } from "@/lib/sharedQueryClient";

SplashScreen.preventAutoHideAsync();

// This component wraps the main app content and applies theme/safe area
const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { colorScheme } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                {children}
            </SafeAreaProvider>
        </GestureHandlerRootView>
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
        <QueryClientProvider client={sharedQueryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <AppWrapper>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="welcome" />
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="settings" />
                        </Stack>
                    </AppWrapper>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default RootLayout;
