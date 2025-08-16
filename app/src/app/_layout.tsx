import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { sharedQueryClient } from "@/lib/sharedQueryClient";

SplashScreen.preventAutoHideAsync();

function AppContent() {
    const { colorScheme } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
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
                <AppContent />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
