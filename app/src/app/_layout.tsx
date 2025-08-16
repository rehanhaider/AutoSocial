import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { sharedQueryClient } from "@/lib/sharedQueryClient";
import WelcomeScreen from "./welcome"; // Import the new WelcomeScreen

SplashScreen.preventAutoHideAsync();

// This component wraps the main app content and applies theme/safe area
function AppWrapper({ children }: { children: React.ReactNode }) {
    const { colorScheme } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                {children}
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });

    const [isAuthenticated, setIsAuthenticated] = useState(false); // Placeholder for auth status

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // Simulate authentication check
    useEffect(() => {
        // In a real app, you'd check a token, context, or similar here
        const checkAuth = async () => {
            // For now, let's just assume false for unauthenticated flow
            // setIsAuthenticated(true); // Set to true to see main app
        };
        checkAuth();
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <QueryClientProvider client={sharedQueryClient}>
            <ThemeProvider>
                <AppWrapper>
                    {isAuthenticated ? (
                        <Drawer
                            screenOptions={{
                                drawerType: "front",
                                swipeEdgeWidth: 32,
                                swipeEnabled: true,
                                drawerStyle: { width: "61.8%" },
                            }}
                        >
                            <Drawer.Screen name="(tabs)" options={{ headerShown: false, title: "Home" }} />
                            <Drawer.Screen name="settings" options={{ drawerItemStyle: { display: "none" } }} />
                        </Drawer>
                    ) : (
                        <WelcomeScreen />
                    )}
                </AppWrapper>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
