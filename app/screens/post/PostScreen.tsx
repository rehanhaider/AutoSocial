import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, Image } from "react-native";
import { Button, TextInput, Text, Title, Surface, Chip, RadioButton, Divider } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";

// Type for post scheduling options
type ScheduleOption = "now" | "next" | "custom";

const PostScreen: React.FC = () => {
    const [content, setContent] = useState("");
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [scheduleOption, setScheduleOption] = useState<ScheduleOption>("next");
    const [customDate, setCustomDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useAuth();

    // Character limit for Twitter
    const CHARACTER_LIMIT = 280;

    useEffect(() => {
        // Check if we're editing an existing post
        if (route.params && "postId" in route.params) {
            setIsEditing(true);
            // In a real app, fetch post data from API
            // For now, just set some mock data
            setContent("This is an existing post that we are editing.");
            setScheduleOption("custom");
            setCustomDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
        }
    }, [route.params]);

    useEffect(() => {
        setCharacterCount(content.length);
    }, [content]);

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission Required", "Sorry, we need camera roll permissions to upload images.");
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setMediaUri(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setMediaUri(null);
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            Alert.alert("Error", "Please enter some content for your post");
            return;
        }

        if (content.length > CHARACTER_LIMIT) {
            Alert.alert("Error", `Your post exceeds the ${CHARACTER_LIMIT} character limit`);
            return;
        }

        try {
            setIsLoading(true);

            // In a real app, this would send data to your API
            // For now, just simulate a delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Show success message
            const actionText = scheduleOption === "now" ? "posted" : "scheduled";
            Alert.alert("Success", `Your post has been ${actionText}!`, [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "Failed to create post");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Surface style={styles.formContainer}>
                    <Title style={styles.title}>{isEditing ? "Edit Post" : "Create New Post"}</Title>

                    <TextInput
                        placeholder="What's happening?"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={5}
                        style={styles.contentInput}
                        maxLength={CHARACTER_LIMIT}
                    />

                    <View style={styles.characterCounter}>
                        <Text style={characterCount > CHARACTER_LIMIT ? styles.overLimit : {}}>
                            {characterCount}/{CHARACTER_LIMIT}
                        </Text>
                    </View>

                    {mediaUri ? (
                        <View style={styles.mediaPreviewContainer}>
                            <Image source={{ uri: mediaUri }} style={styles.mediaPreview} />
                            <Button icon="close" onPress={removeImage} style={styles.removeMediaButton}>
                                Remove
                            </Button>
                        </View>
                    ) : (
                        <Button mode="outlined" icon="image" onPress={pickImage} style={styles.mediaButton}>
                            Add Media
                        </Button>
                    )}

                    <Divider style={styles.divider} />

                    <Title style={styles.sectionTitle}>When to post?</Title>

                    <RadioButton.Group
                        onValueChange={(value) => setScheduleOption(value as ScheduleOption)}
                        value={scheduleOption}
                    >
                        <View style={styles.radioOption}>
                            <RadioButton value="now" />
                            <Text>Post immediately</Text>
                        </View>

                        <View style={styles.radioOption}>
                            <RadioButton value="next" />
                            <Text>Add to next available slot</Text>
                        </View>

                        <View style={styles.radioOption}>
                            <RadioButton value="custom" />
                            <Text>Schedule for specific time</Text>
                        </View>
                    </RadioButton.Group>

                    {scheduleOption === "custom" && (
                        <View style={styles.datePickerContainer}>
                            <Text>Date picker would go here in a real app</Text>
                            <Text>Selected: {format(customDate, "PPP p")}</Text>
                        </View>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        loading={isLoading}
                        disabled={isLoading || !content.trim() || content.length > CHARACTER_LIMIT}
                    >
                        {isEditing ? "Update Post" : scheduleOption === "now" ? "Post Now" : "Schedule Post"}
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
        padding: 16,
    },
    formContainer: {
        padding: 16,
        borderRadius: 10,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: "center",
    },
    contentInput: {
        backgroundColor: "transparent",
        fontSize: 16,
    },
    characterCounter: {
        alignItems: "flex-end",
        marginTop: 4,
        marginBottom: 16,
    },
    overLimit: {
        color: "red",
    },
    mediaButton: {
        marginTop: 8,
        marginBottom: 16,
    },
    mediaPreviewContainer: {
        marginTop: 16,
        marginBottom: 16,
        alignItems: "center",
    },
    mediaPreview: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 8,
    },
    removeMediaButton: {
        marginTop: 8,
    },
    divider: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    datePickerContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    submitButton: {
        marginTop: 24,
        paddingVertical: 8,
    },
});

export default PostScreen;
