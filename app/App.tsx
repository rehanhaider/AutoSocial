import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";

// Screens
import AuthNavigator from "./screens/auth/AuthNavigator";
import MainNavigator from "./screens/MainNavigator";

// Define theme
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#1DA1F2", // Twitter blue
        accent: "#1DA1F2",
        background: "#FFFFFF",
    },
};

const Stack = createStackNavigator();

// Root component that handles navigation based on auth state
const RootNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // We can add a loading screen here later
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            ) : (
                <Stack.Screen name="Main" component={MainNavigator} />
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <AuthProvider>
                    <NavigationContainer>
                        <RootNavigator />
                    </NavigationContainer>
                    <StatusBar style="auto" />
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
