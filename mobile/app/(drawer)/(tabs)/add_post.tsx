import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AddPostScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="plus-circle" size={32} color="#10b981" />
                <Text style={styles.headerText}>Create New Post</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>Create and schedule your social media posts across multiple platforms.</Text>

                <View style={styles.optionsContainer}>
                    <View style={styles.optionCard}>
                        <MaterialCommunityIcons name="image" size={32} color="#4f46e5" />
                        <Text style={styles.optionTitle}>Photo Post</Text>
                        <Text style={styles.optionDescription}>Share images with captions</Text>
                    </View>

                    <View style={styles.optionCard}>
                        <MaterialCommunityIcons name="video" size={32} color="#f59e0b" />
                        <Text style={styles.optionTitle}>Video Post</Text>
                        <Text style={styles.optionDescription}>Upload and share videos</Text>
                    </View>

                    <View style={styles.optionCard}>
                        <MaterialCommunityIcons name="text" size={32} color="#ef4444" />
                        <Text style={styles.optionTitle}>Text Post</Text>
                        <Text style={styles.optionDescription}>Share thoughts and updates</Text>
                    </View>

                    <View style={styles.optionCard}>
                        <MaterialCommunityIcons name="calendar-clock" size={32} color="#8b5cf6" />
                        <Text style={styles.optionTitle}>Schedule Post</Text>
                        <Text style={styles.optionDescription}>Plan posts for later</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e293b",
        marginTop: 8,
    },
    content: {
        padding: 20,
    },
    description: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b",
        marginTop: 12,
    },
    optionDescription: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 4,
        textAlign: "center",
    },
});
