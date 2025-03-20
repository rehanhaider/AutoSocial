import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity } from "react-native";
import { Text, Title, Surface, Divider, Button, List, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

const SettingsScreen: React.FC = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            await signOut();
            // The AuthContext will handle navigation after sign out
        } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign out");
            setIsLoading(false);
        }
    };

    const handleEditProfile = () => {
        // In a real app, navigate to profile edit screen
        Alert.alert("Edit Profile", "This would navigate to a profile edit screen");
    };

    const handleConnectTwitter = () => {
        // In a real app, initiate Twitter OAuth flow
        Alert.alert("Connect Twitter", "This would initiate the Twitter OAuth flow");
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
        // In a real app, save this preference to the server/local storage
    };

    const handleToggleDarkMode = () => {
        setDarkModeEnabled(!darkModeEnabled);
        // In a real app, apply theme change
    };

    const handleAbout = () => {
        Alert.alert("About", "Auto Social v1.0.0\n\nA Twitter post scheduling app");
    };

    const handlePrivacyPolicy = () => {
        // In a real app, navigate to privacy policy screen or open web link
        Alert.alert("Privacy Policy", "This would show the privacy policy");
    };

    const handleTermsOfService = () => {
        // In a real app, navigate to terms of service screen or open web link
        Alert.alert("Terms of Service", "This would show the terms of service");
    };

    return (
        <ScrollView style={styles.container}>
            <Surface style={styles.profileSection}>
                <View style={styles.profileHeader}>
                    <Avatar.Icon size={80} icon="account" style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Title>{user?.username || "User"}</Title>
                        <Text>{user?.email || "user@example.com"}</Text>
                    </View>
                </View>
                <Button mode="outlined" onPress={handleEditProfile} style={styles.editProfileButton}>
                    Edit Profile
                </Button>
            </Surface>

            <Surface style={styles.section}>
                <Title style={styles.sectionTitle}>Account</Title>
                <List.Item
                    title="Connected Twitter Account"
                    description="Connect your Twitter account to post"
                    left={(props) => <List.Icon {...props} icon="twitter" color="#1DA1F2" />}
                    right={(props) => (
                        <Button mode="text" onPress={handleConnectTwitter}>
                            Connect
                        </Button>
                    )}
                />
                <Divider />
                <List.Item
                    title="Notifications"
                    description="Enable post notifications"
                    left={(props) => <List.Icon {...props} icon="bell" />}
                    right={(props) => (
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleToggleNotifications}
                            color="#1DA1F2"
                        />
                    )}
                />
                <Divider />
                <List.Item
                    title="Dark Mode"
                    description="Enable dark theme"
                    left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                    right={(props) => (
                        <Switch value={darkModeEnabled} onValueChange={handleToggleDarkMode} color="#1DA1F2" />
                    )}
                />
            </Surface>

            <Surface style={styles.section}>
                <Title style={styles.sectionTitle}>About</Title>
                <TouchableOpacity onPress={handleAbout}>
                    <List.Item
                        title="About Auto Social"
                        left={(props) => <List.Icon {...props} icon="information" />}
                    />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={handlePrivacyPolicy}>
                    <List.Item
                        title="Privacy Policy"
                        left={(props) => <List.Icon {...props} icon="shield-account" />}
                    />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={handleTermsOfService}>
                    <List.Item
                        title="Terms of Service"
                        left={(props) => <List.Icon {...props} icon="file-document" />}
                    />
                </TouchableOpacity>
            </Surface>

            <Button
                mode="contained"
                onPress={handleSignOut}
                style={styles.signOutButton}
                loading={isLoading}
                disabled={isLoading}
                color="#F44336"
            >
                Sign Out
            </Button>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8fa",
    },
    profileSection: {
        padding: 16,
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 2,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        backgroundColor: "#1DA1F2",
    },
    profileInfo: {
        marginLeft: 16,
    },
    editProfileButton: {
        marginTop: 16,
    },
    section: {
        padding: 16,
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    signOutButton: {
        margin: 16,
    },
    versionContainer: {
        alignItems: "center",
        marginVertical: 16,
    },
    versionText: {
        color: "#657786",
    },
});

export default SettingsScreen;
