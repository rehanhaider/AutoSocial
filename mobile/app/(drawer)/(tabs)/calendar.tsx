import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CalendarScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="calendar" size={32} color="#f59e0b" />
                <Text style={styles.headerText}>Content Calendar</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>View and manage your scheduled posts across all platforms.</Text>

                <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#64748b" />
                        <Text style={styles.monthText}>January 2024</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
                    </View>

                    <View style={styles.weekDays}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <Text key={day} style={styles.weekDay}>
                                {day}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.emptyCalendar}>
                        <MaterialCommunityIcons name="calendar-blank" size={48} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No scheduled posts yet</Text>
                        <Text style={styles.emptySubtext}>Create your first scheduled post to see it here</Text>
                    </View>
                </View>

                <View style={styles.upcomingSection}>
                    <Text style={styles.sectionTitle}>Upcoming Posts</Text>
                    <View style={styles.emptyUpcoming}>
                        <MaterialCommunityIcons name="clock-outline" size={32} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No upcoming posts</Text>
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
    calendarContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    calendarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    monthText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b",
    },
    weekDays: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    weekDay: {
        fontSize: 14,
        fontWeight: "500",
        color: "#64748b",
        width: 40,
        textAlign: "center",
    },
    emptyCalendar: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#64748b",
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#94a3b8",
        marginTop: 4,
        textAlign: "center",
    },
    upcomingSection: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 16,
    },
    emptyUpcoming: {
        alignItems: "center",
        paddingVertical: 20,
    },
});
