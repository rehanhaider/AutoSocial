import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Button, TextInput, Text, Title, Surface } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "./AuthNavigator";

type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, "ResetPassword">;
type ResetPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, "ResetPassword">;

const ResetPasswordScreen: React.FC = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const route = useRoute<ResetPasswordScreenRouteProp>();
    const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
    const { resetPassword } = useAuth();
    const { username } = route.params;

    const handleResetPassword = async () => {
        if (!verificationCode || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            await resetPassword(username, verificationCode, newPassword);
            Alert.alert("Success", "Your password has been reset. Please log in with your new password.", [
                {
                    text: "Log In",
                    onPress: () => navigation.navigate("Login"),
                },
            ]);
        } catch (error) {
            Alert.alert("Reset Failed", error instanceof Error ? error.message : "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Surface style={styles.formContainer}>
                <Title style={styles.title}>Reset Password</Title>
                <Text style={styles.description}>
                    Enter the verification code we sent to your email along with your new password.
                </Text>

                <TextInput
                    label="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    style={styles.input}
                    keyboardType="number-pad"
                />

                <TextInput
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <TextInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleResetPassword}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Reset Password
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
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
    backButton: {
        marginTop: 15,
    },
});

export default ResetPasswordScreen;
