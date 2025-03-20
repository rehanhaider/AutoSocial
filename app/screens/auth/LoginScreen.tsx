import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Button, TextInput, Text, Title, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "./AuthNavigator";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Login">;

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password");
            return;
        }

        try {
            setIsLoading(true);
            await signIn(username, password);
            // On successful login, the AuthContext will update and App.tsx will redirect to MainNavigator
        } catch (error) {
            Alert.alert("Login Failed", error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUpNavigation = () => {
        navigation.navigate("SignUp");
    };

    const handleForgotPasswordNavigation = () => {
        navigation.navigate("ForgotPassword");
    };

    const twitterLogo = require("../../assets/twitter-logo.svg");

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image source={twitterLogo} style={styles.logo} resizeMode="contain" />
                    <Title style={styles.title}>Auto Social</Title>
                    <Text style={styles.subtitle}>Schedule your Twitter posts</Text>
                </View>

                <Surface style={styles.formContainer}>
                    <TextInput
                        label="Username or Email"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
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

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Log In
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={handleSignUpNavigation}
                        style={styles.button}
                        disabled={isLoading}
                    >
                        Create Account
                    </Button>

                    <Button
                        mode="text"
                        onPress={handleForgotPasswordNavigation}
                        style={styles.textButton}
                        disabled={isLoading}
                    >
                        Forgot Password?
                    </Button>
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
        justifyContent: "center",
        padding: 20,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#657786",
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
        marginTop: 15,
    },
});

export default LoginScreen;
