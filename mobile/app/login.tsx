import { AuthService } from "@/lib/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await AuthService.login(email, password);
            // Navigate to the main part of the app after successful login
            // Replace '/(tabs)' with your actual main screen route if different
            router.replace("/(tabs)");
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
            Alert.alert("Login Error", err.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>AutoSocial</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <Button title="Login" onPress={handleLogin} color="#007bff" />
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
