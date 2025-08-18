import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/styles";
import { useRouter } from "expo-router";
import Logo from "@/components/layout/Logo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignupScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const router = useRouter();

    const handleSignup = () => {
        // TODO: Implement signup logic
        console.log("Signup button pressed");
        // On successful signup, navigate to the main app or login
        // router.replace('/(tabs)');
    };

    return (
        <View className="flex-1 px-lg justify-center items-center" style={{ backgroundColor: colors.surface.primary }}>
            <View className="items-center pb-xl mb-md px-1" style={{ paddingTop: insets.top + Spacing.lg }}>
                <Logo fontSize={Typography.heading.h1.fontSize} />
            </View>
            <Text className="text-2xl font-bold mb-md" style={[{ color: colors.content.primary }]}>
                Sign up for AutoSocial
            </Text>

            <TextInput
                className="w-full p-md rounded-md border mb-md"
                style={[
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
                className="w-full p-md rounded-md border mb-md"
                style={[
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
                className="w-full p-md rounded-md border mb-md"
                style={[
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

            <Pressable
                className="w-full p-md rounded-md items-center"
                style={[{ backgroundColor: colors.interactive.primary.default }]}
                onPress={handleSignup}
            >
                <Text className="font-bold" style={[{ color: colors.content.primary }]}>
                    Sign Up
                </Text>
            </Pressable>

            <Pressable className="w-full items-center py-md" onPress={() => router.push("/(auth)/login")}>
                <Text className="font-bold" style={[{ color: colors.content.primary }]}>
                    Already have an account? Log In
                </Text>
            </Pressable>
        </View>
    );
};

export default SignupScreen;
