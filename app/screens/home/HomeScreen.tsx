import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Text, Card, FAB, Title, Surface, Avatar, Chip, Divider, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

// Mock data for testing UI
interface Post {
    id: string;
    content: string;
    mediaUrl?: string;
    scheduledTime: Date;
    status: "scheduled" | "posted" | "failed";
}

const mockPosts: Post[] = [
    {
        id: "1",
        content: "Excited to announce our new product launch! #ProductLaunch #Excited",
        mediaUrl: "https://via.placeholder.com/300",
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: "scheduled",
    },
    {
        id: "2",
        content: "Check out our latest blog post about tech trends in 2023!",
        scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        status: "scheduled",
    },
    {
        id: "3",
        content: "Thank you everyone for attending our webinar yesterday. The recording is now available.",
        mediaUrl: "https://via.placeholder.com/300",
        scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: "posted",
    },
];

const HomeScreen: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const { user } = useAuth();

    useEffect(() => {
        // In a real app, fetch posts from API
        const fetchPosts = async () => {
            try {
                // Simulate API call
                setTimeout(() => {
                    setPosts(mockPosts);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleAddPost = () => {
        // @ts-ignore - We'll implement the navigation types later
        navigation.navigate("Post");
    };

    const handlePostPress = (post: Post) => {
        // @ts-ignore - We'll implement the navigation types later
        navigation.navigate("Post", { postId: post.id });
    };

    const renderPostCard = ({ item }: { item: Post }) => {
        const statusColor = item.status === "scheduled" ? "#1DA1F2" : item.status === "posted" ? "#4CAF50" : "#F44336";

        const statusText = item.status === "scheduled" ? "Scheduled" : item.status === "posted" ? "Posted" : "Failed";

        return (
            <TouchableOpacity onPress={() => handlePostPress(item)}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardHeader}>
                            <View style={styles.userInfo}>
                                <Avatar.Icon size={40} icon="account" />
                                <View style={styles.userDetails}>
                                    <Text style={styles.username}>{user?.username || "User"}</Text>
                                    <Text style={styles.scheduledTime}>
                                        {format(item.scheduledTime, "MMM d, yyyy - h:mm a")}
                                    </Text>
                                </View>
                            </View>
                            <Chip style={{ backgroundColor: statusColor + "20" }}>
                                <Text style={{ color: statusColor }}>{statusText}</Text>
                            </Chip>
                        </View>

                        <Divider style={styles.divider} />

                        <Text style={styles.postContent}>{item.content}</Text>

                        {item.mediaUrl && <Card.Cover source={{ uri: item.mediaUrl }} style={styles.mediaImage} />}
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Surface style={styles.header}>
                <Title style={styles.headerTitle}>Your Scheduled Posts</Title>
            </Surface>

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#1DA1F2" />
                </View>
            ) : posts.length > 0 ? (
                <FlatList
                    data={posts}
                    renderItem={renderPostCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.postsList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No posts scheduled yet</Text>
                    <Text style={styles.emptySubtext}>Tap the + button to create your first scheduled post</Text>
                </View>
            )}

            <FAB style={styles.fab} icon="plus" onPress={handleAddPost} color="#FFFFFF" />
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
    postsList: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    userDetails: {
        marginLeft: 10,
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
    },
    scheduledTime: {
        color: "#657786",
        fontSize: 12,
    },
    divider: {
        marginVertical: 10,
    },
    postContent: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 10,
    },
    mediaImage: {
        borderRadius: 10,
        marginTop: 10,
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

export default HomeScreen;
