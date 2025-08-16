import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/styles";
import { useRouter } from "expo-router";

const LoginScreen: React.FC = () => {
    const { colors } = useTheme();
    const router = useRouter();

    const handleLogin = () => {
        // TODO: Implement login logic
        console.log("Login button pressed");
        // On successful login, navigate to the main app
        // router.replace('/(tabs)');
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
            />

            <Pressable style={[styles.primaryButton, { backgroundColor: colors.interactive.primary.default }]} onPress={handleLogin}>
                <Text style={[styles.primaryButtonText, { color: colors.content.inverse }]}>Log In</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => router.push("/signup")}>
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
