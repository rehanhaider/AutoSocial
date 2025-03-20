import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Button, TextInput, Text, Title, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "./AuthNavigator";

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, "SignUp">;

const SignUpScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            await signUp(username, password, email);
            Alert.alert("Verification Required", "Please check your email for a verification code", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("ConfirmSignUp", { username }),
                },
            ]);
        } catch (error) {
            Alert.alert("Sign Up Failed", error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginNavigation = () => {
        navigation.navigate("Login");
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Title style={styles.title}>Create Your Account</Title>
                    <Text style={styles.subtitle}>Sign up to schedule Twitter posts</Text>
                </View>

                <Surface style={styles.formContainer}>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSignUp}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Sign Up
                    </Button>

                    <View style={styles.loginContainer}>
                        <Text>Already have an account?</Text>
                        <Button
                            mode="text"
                            onPress={handleLoginNavigation}
                            style={styles.textButton}
                            disabled={isLoading}
                        >
                            Log In
                        </Button>
                    </View>
                </Surface>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8fa",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: "center",
        marginVertical: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: "#657786",
        marginTop: 5,
    },
    formContainer: {
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
    textButton: {
        marginHorizontal: 5,
    },
    loginContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
    },
});

export default SignUpScreen;
