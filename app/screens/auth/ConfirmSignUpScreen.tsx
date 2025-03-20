import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Button, TextInput, Text, Title, Surface } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "./AuthNavigator";

type ConfirmSignUpScreenRouteProp = RouteProp<AuthStackParamList, "ConfirmSignUp">;
type ConfirmSignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, "ConfirmSignUp">;

const ConfirmSignUpScreen: React.FC = () => {
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const route = useRoute<ConfirmSignUpScreenRouteProp>();
    const navigation = useNavigation<ConfirmSignUpScreenNavigationProp>();
    const { confirmSignUp } = useAuth();
    const { username } = route.params;

    const handleConfirmation = async () => {
        if (!confirmationCode) {
            Alert.alert("Error", "Please enter the confirmation code");
            return;
        }

        try {
            setIsLoading(true);
            await confirmSignUp(username, confirmationCode);
            Alert.alert("Success", "Your account has been verified. You can now log in.", [
                {
                    text: "Log In",
                    onPress: () => navigation.navigate("Login"),
                },
            ]);
        } catch (error) {
            Alert.alert("Verification Failed", error instanceof Error ? error.message : "Failed to verify account");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Surface style={styles.formContainer}>
                <Title style={styles.title}>Verify Your Account</Title>
                <Text style={styles.description}>
                    We've sent a verification code to your email address. Please enter it below to complete your
                    registration.
                </Text>

                <TextInput
                    label="Confirmation Code"
                    value={confirmationCode}
                    onChangeText={setConfirmationCode}
                    style={styles.input}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                />

                <Button
                    mode="contained"
                    onPress={handleConfirmation}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Verify Account
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

export default ConfirmSignUpScreen;
