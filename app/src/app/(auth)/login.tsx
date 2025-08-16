import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/styles";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const LoginScreen: React.FC = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.replace("/(tabs)");
        } else {
            Alert.alert("Error", "Invalid email or password");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface.primary }]}>
            <Text style={[styles.title, { color: colors.content.primary }]}>Login</Text>

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface.secondary,
                        color: colors.content.primary,
                        borderColor: colors.border.secondary,
                    },
                ]}
                placeholder="Email"
                placeholderTextColor={colors.content.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface.secondary,
                        color: colors.content.primary,
                        borderColor: colors.border.secondary,
                    },
                ]}
                placeholder="Password"
                placeholderTextColor={colors.content.secondary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Pressable
                style={[
                    styles.primaryButton,
                    {
                        backgroundColor: isLoading ? colors.interactive.primary.disabled : colors.interactive.primary.default,
                    },
                ]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                <Text style={[styles.primaryButtonText, { color: colors.content.inverse }]}>{isLoading ? "Logging in..." : "Log In"}</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => router.push("/(auth)/signup")}>
                <Text style={[styles.secondaryButtonText, { color: colors.content.primary }]}>Don't have an account? Sign Up</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: Spacing.xl,
    },
    input: {
        width: "100%",
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        marginBottom: Spacing.md,
    },
    primaryButton: {
        width: "100%",
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: "center",
        marginBottom: Spacing.md,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    secondaryButton: {
        width: "100%",
        paddingVertical: Spacing.md,
        alignItems: "center",
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
});

export default LoginScreen;
