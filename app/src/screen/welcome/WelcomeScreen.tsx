import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/styles";
import { useRouter } from "expo-router";
import Logo from "@/components/layout/Logo";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WelcomeScreen: React.FC = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentPage, setCurrentPage] = useState(0);

    const handleSignUp = () => {
        router.push("/signup");
    };

    const handleLogin = () => {
        router.push("/login");
    };

    // Welcome slider images
    const welcomeImages = [
        {
            source: require("@/../assets/images/welcome-1.png"),
            alt: "Welcome slide 1",
        },
        {
            source: require("@/../assets/images/welcome-3.png"),
            alt: "Welcome slide 2",
        },
        {
            source: require("@/../assets/images/welcome-4.png"),
            alt: "AutoSocial features",
        },
    ];

    const handlePageChange = (event: any) => {
        setCurrentPage(event.nativeEvent.position);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface.primary, paddingTop: insets.top }]}>
            <View style={styles.contentContainer}>
                <Logo fontSize={Typography.heading.h1.fontSize} style={{ marginBottom: Spacing.xxl }} />
                <Text style={[Typography.heading.h2, styles.heading, { color: colors.content.primary, marginBottom: Spacing.md }]}>
                    Share your story
                </Text>
                <Text style={[Typography.heading.h3, styles.heading, { color: colors.content.primary }]}>Connect with your audience</Text>

                {/* Welcome Images Slider */}
                <View style={styles.sliderContainer}>
                    <PagerView style={styles.pagerView} initialPage={0} onPageSelected={handlePageChange}>
                        {welcomeImages.map((image, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image source={image.source} style={styles.image} />
                            </View>
                        ))}
                    </PagerView>

                    {/* Pagination Dots */}
                    <View style={styles.paginationDots}>
                        {welcomeImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor:
                                            index === currentPage ? colors.interactive.primary.default : colors.content.tertiary,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>

            <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
                <Pressable style={[styles.primaryButton, { backgroundColor: colors.interactive.primary.default }]} onPress={handleSignUp}>
                    <Text style={[styles.primaryButtonText, { color: colors.content.inverse }]}>I'm new to AutoSocial, let's signup.</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={handleLogin}>
                    <Text style={[styles.secondaryButtonText, { color: colors.content.primary }]}>
                        I already have a AutoSocial account.
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        paddingHorizontal: Spacing.md,
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    heading: {
        textAlign: "center",
        marginBottom: Spacing.md,
    },
    sliderContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: Spacing.lg,
    },
    pagerView: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: BorderRadius.md,
    },
    paginationDots: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Spacing.md,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: Spacing.xs / 2,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: Spacing.md,
    },
    primaryButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        alignItems: "center",
        marginBottom: Spacing.md,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    secondaryButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        alignItems: "center",
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
});

export default WelcomeScreen;
