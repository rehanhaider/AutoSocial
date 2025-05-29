import { useThemeColors } from "@/lib/hooks/useThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AddPostScreen() {
    const colors = useThemeColors();

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
        },
        header: {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
        },
        headerText: {
            color: colors.text,
        },
        description: {
            color: colors.textSecondary,
        },
        optionCard: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        optionTitle: {
            color: colors.text,
        },
        optionDescription: {
            color: colors.textSecondary,
        },
    });

    return (
        <ScrollView style={[styles.container, dynamicStyles.container]}>
            <View style={[styles.header, dynamicStyles.header]}>
                <MaterialCommunityIcons name="plus-circle" size={32} color={colors.success} />
                <Text style={[styles.headerText, dynamicStyles.headerText]}>Create New Post</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.description, dynamicStyles.description]}>
                    Create and schedule your social media posts across multiple platforms.
                </Text>

                <View style={styles.optionsContainer}>
                    <View style={[styles.optionCard, dynamicStyles.optionCard]}>
                        <MaterialCommunityIcons name="image" size={32} color={colors.primary} />
                        <Text style={[styles.optionTitle, dynamicStyles.optionTitle]}>Photo Post</Text>
                        <Text style={[styles.optionDescription, dynamicStyles.optionDescription]}>Share images with captions</Text>
                    </View>

                    <View style={[styles.optionCard, dynamicStyles.optionCard]}>
                        <MaterialCommunityIcons name="video" size={32} color={colors.warning} />
                        <Text style={[styles.optionTitle, dynamicStyles.optionTitle]}>Video Post</Text>
                        <Text style={[styles.optionDescription, dynamicStyles.optionDescription]}>Upload and share videos</Text>
                    </View>

                    <View style={[styles.optionCard, dynamicStyles.optionCard]}>
                        <MaterialCommunityIcons name="text" size={32} color={colors.error} />
                        <Text style={[styles.optionTitle, dynamicStyles.optionTitle]}>Text Post</Text>
                        <Text style={[styles.optionDescription, dynamicStyles.optionDescription]}>Share thoughts and updates</Text>
                    </View>

                    <View style={[styles.optionCard, dynamicStyles.optionCard]}>
                        <MaterialCommunityIcons name="calendar-clock" size={32} color={colors.info} />
                        <Text style={[styles.optionTitle, dynamicStyles.optionTitle]}>Schedule Post</Text>
                        <Text style={[styles.optionDescription, dynamicStyles.optionDescription]}>Plan posts for later</Text>
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
