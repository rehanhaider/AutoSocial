import { useAuth } from "@/lib/hooks/useAuth";
import { useThemeColors } from "@/lib/hooks/useThemeColors";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login, loading } = useAuth();
    const colors = useThemeColors();

    const handleLogin = async () => {
        setError(null);
        try {
            await login(email, password);
            // Navigation will be handled by the useProtectedRoute hook in _layout.tsx
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
            Alert.alert("Login Error", err.message || "Login failed. Please check your credentials.");
        }
    };

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
        },
        logo: {
            color: colors.text,
        },
        input: {
            backgroundColor: colors.input,
            borderColor: colors.inputBorder,
            color: colors.inputText,
        },
        errorText: {
            color: colors.error,
        },
    });

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Text style={[styles.logo, dynamicStyles.logo]}>AutoSocial</Text>
            {error && <Text style={[styles.errorText, dynamicStyles.errorText]}>{error}</Text>}
            <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Email"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
            />
            <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
            />
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <Button title="Login" onPress={handleLogin} color={colors.primary} />
            )}
            {/* TODO: Add links for Sign Up, Forgot Password */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    logo: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 40,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        fontSize: 14,
        textAlign: "center",
    },
    // TODO: Add styles for Sign Up and Forgot Password links
});
