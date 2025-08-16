import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/styles";
import { useRouter } from "expo-router";

const SignupScreen: React.FC = () => {
    const { colors } = useTheme();
    const router = useRouter();

    const handleSignup = () => {
        // TODO: Implement signup logic
        console.log("Signup button pressed");
        // On successful signup, navigate to the main app or login
        // router.replace('/(tabs)');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface.primary }]}>
            <Text style={[styles.title, { color: colors.content.primary }]}>Sign Up</Text>

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

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface.secondary,
                        color: colors.content.primary,
                        borderColor: colors.border.secondary,
                    },
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={colors.content.secondary}
                secureTextEntry
            />

            <Pressable style={[styles.primaryButton, { backgroundColor: colors.interactive.primary.default }]} onPress={handleSignup}>
                <Text style={[styles.primaryButtonText, { color: colors.content.inverse }]}>Sign Up</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => router.push("/login")}>
                <Text style={[styles.secondaryButtonText, { color: colors.content.primary }]}>Already have an account? Log In</Text>
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

export default SignupScreen;
