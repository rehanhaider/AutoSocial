import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Button, TextInput, Text, Title, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "./AuthNavigator";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, "ForgotPassword">;

const ForgotPasswordScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const { forgotPassword } = useAuth();

    const handleForgotPassword = async () => {
        if (!username) {
            Alert.alert("Error", "Please enter your username or email");
            return;
        }

        try {
            setIsLoading(true);
            await forgotPassword(username);
            Alert.alert("Code Sent", "We have sent a reset code to your email address.", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("ResetPassword", { username }),
                },
            ]);
        } catch (error) {
            Alert.alert(
                "Failed to Send Code",
                error instanceof Error ? error.message : "Failed to send reset code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Surface style={styles.formContainer}>
                <Title style={styles.title}>Reset Your Password</Title>
                <Text style={styles.description}>
                    Enter your username or email address and we'll send you instructions to reset your password.
                </Text>

                <TextInput
                    label="Username or Email"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Button
                    mode="contained"
                    onPress={handleForgotPassword}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Send Reset Code
                </Button>

                <Button mode="text" onPress={() => navigation.navigate("Login")} style={styles.backButton}>
                    Back to Login
                </Button>
            </Surface>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f8fa",
    },
    formContainer: {
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        textAlign: "center",
        marginBottom: 20,
        color: "#657786",
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
    backButton: {
        marginTop: 15,
    },
});

export default ForgotPasswordScreen;
