import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Text, Card, FAB, Title, Surface, Divider, Button, IconButton, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

// Mock data for testing UI
interface ScheduleSlot {
    id: string;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    time: string; // HH:MM format
    isActive: boolean;
    description: string;
}

const mockScheduleSlots: ScheduleSlot[] = [
    {
        id: "1",
        dayOfWeek: 1, // Monday
        time: "09:00",
        isActive: true,
        description: "Monday morning post",
    },
    {
        id: "2",
        dayOfWeek: 3, // Wednesday
        time: "12:30",
        isActive: true,
        description: "Wednesday lunch post",
    },
    {
        id: "3",
        dayOfWeek: 5, // Friday
        time: "17:00",
        isActive: true,
        description: "Friday evening post",
    },
    {
        id: "4",
        dayOfWeek: 6, // Saturday
        time: "10:00",
        isActive: false,
        description: "Weekend post (disabled)",
    },
];

const ScheduleScreen: React.FC = () => {
    const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        // In a real app, fetch schedule slots from API
        const fetchScheduleSlots = async () => {
            try {
                // Simulate API call
                setTimeout(() => {
                    setScheduleSlots(mockScheduleSlots);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching schedule slots:", error);
                setIsLoading(false);
            }
        };

        fetchScheduleSlots();
    }, []);

    const handleAddScheduleSlot = () => {
        // In a real app, navigate to a form to add a new schedule slot
        Alert.alert("Add Schedule Slot", "This would open a form to add a new schedule slot.");
    };

    const handleToggleActive = (id: string) => {
        // Toggle the active status of a schedule slot
        setScheduleSlots(scheduleSlots.map((slot) => (slot.id === id ? { ...slot, isActive: !slot.isActive } : slot)));
    };

    const handleEditSlot = (slot: ScheduleSlot) => {
        // In a real app, navigate to a form to edit the schedule slot
        Alert.alert("Edit Schedule Slot", `This would open a form to edit the schedule slot: ${slot.description}`);
    };

    const handleDeleteSlot = (id: string) => {
        // Confirm deletion
        Alert.alert("Delete Schedule Slot", "Are you sure you want to delete this schedule slot?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                onPress: () => {
                    // Remove the slot from the list
                    setScheduleSlots(scheduleSlots.filter((slot) => slot.id !== id));
                },
                style: "destructive",
            },
        ]);
    };

    const getDayName = (dayOfWeek: number): string => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[dayOfWeek];
    };

    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const renderScheduleSlotCard = ({ item }: { item: ScheduleSlot }) => {
        return (
            <Card style={[styles.card, !item.isActive && styles.inactiveCard]}>
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <View>
                            <Title>
                                {getDayName(item.dayOfWeek)} at {formatTime(item.time)}
                            </Title>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                        <View style={styles.cardActions}>
                            <IconButton
                                icon={item.isActive ? "pause-circle" : "play-circle"}
                                size={24}
                                onPress={() => handleToggleActive(item.id)}
                                color={item.isActive ? "#F44336" : "#4CAF50"}
                            />
                            <IconButton icon="pencil" size={24} onPress={() => handleEditSlot(item)} color="#1DA1F2" />
                            <IconButton
                                icon="delete"
                                size={24}
                                onPress={() => handleDeleteSlot(item.id)}
                                color="#F44336"
                            />
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.statusContainer}>
                        <Text style={item.isActive ? styles.activeStatus : styles.inactiveStatus}>
                            {item.isActive ? "Active" : "Inactive"}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <Surface style={styles.header}>
                <Title style={styles.headerTitle}>Your Posting Schedule</Title>
            </Surface>

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#1DA1F2" />
                </View>
            ) : scheduleSlots.length > 0 ? (
                <FlatList
                    data={scheduleSlots}
                    renderItem={renderScheduleSlotCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.slotsList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No schedule slots defined</Text>
                    <Text style={styles.emptySubtext}>
                        Tap the + button to create your first scheduled posting time
                    </Text>
                </View>
            )}

            <FAB style={styles.fab} icon="plus" onPress={handleAddScheduleSlot} color="#FFFFFF" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8fa",
    },
    header: {
        padding: 16,
        elevation: 4,
        backgroundColor: "#FFFFFF",
    },
    headerTitle: {
        fontSize: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    slotsList: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    inactiveCard: {
        opacity: 0.7,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    description: {
        color: "#657786",
        marginTop: 4,
    },
    cardActions: {
        flexDirection: "row",
    },
    divider: {
        marginVertical: 10,
    },
    statusContainer: {
        alignItems: "flex-start",
    },
    activeStatus: {
        color: "#4CAF50",
        fontWeight: "bold",
    },
    inactiveStatus: {
        color: "#F44336",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#657786",
        textAlign: "center",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#1DA1F2",
    },
});

export default ScheduleScreen;
