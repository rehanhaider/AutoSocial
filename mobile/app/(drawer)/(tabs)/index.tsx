import { getUserFirstName } from "@/lib/auth/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    const { userAttributes } = useAuth();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="home" size={32} color="#4f46e5" />
                <Text style={styles.headerText}>Welcome to AutoSocial</Text>
                <Text style={styles.subHeaderText}>Hi {getUserFirstName(userAttributes)}! Ready to create amazing content?</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>Your social media automation platform is ready to use!</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="post" size={24} color="#10b981" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>

                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="calendar-clock" size={24} color="#f59e0b" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Scheduled</Text>
                    </View>

                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="chart-line" size={24} color="#ef4444" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Analytics</Text>
                    </View>
                </View>

                <View style={styles.quickActions}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionGrid}>
                        <View style={styles.actionCard}>
                            <MaterialCommunityIcons name="plus-circle" size={28} color="#4f46e5" />
                            <Text style={styles.actionTitle}>Create Post</Text>
                            <Text style={styles.actionSubtitle}>Start creating content</Text>
                        </View>

                        <View style={styles.actionCard}>
                            <MaterialCommunityIcons name="calendar-plus" size={28} color="#10b981" />
                            <Text style={styles.actionTitle}>Schedule</Text>
                            <Text style={styles.actionSubtitle}>Plan your content</Text>
                        </View>
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
    subHeaderText: {
        fontSize: 16,
        color: "#64748b",
        marginTop: 4,
        textAlign: "center",
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
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
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
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e293b",
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 4,
    },
    quickActions: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 16,
    },
    actionGrid: {
        flexDirection: "row",
        gap: 12,
    },
    actionCard: {
        flex: 1,
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
    actionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
        marginTop: 8,
    },
    actionSubtitle: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 4,
        textAlign: "center",
    },
});
