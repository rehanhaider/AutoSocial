import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/styles";
import { useRouter } from "expo-router";
import Logo from "@/components/layout/Logo";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const WelcomeScreen: React.FC = () => {
    const { colors, shadows } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentPage, setCurrentPage] = useState(0);

    const handleSignUp = () => {
        router.push("/(auth)/signup");
    };

    const handleLogin = () => {
        router.push("/(auth)/login");
    };

    const welcomeSlides = [
        {
            source: require("@/../assets/images/welcome-1.png"),
            title: "Share your story",
            description: "Connect with your audience across platforms, and share what you're passionate about.",
        },
        {
            source: require("@/../assets/images/welcome-3.png"),
            title: "Automate your social media",
            description: "Schedule and automate your social media posts to reach your audience.",
        },
        {
            source: require("@/../assets/images/welcome-4.png"),
            title: "Grow your brand",
            description: "Increase your reach and grow your brand.",
        },
    ];

    const handlePageSelected = (event: any) => {
        setCurrentPage(event.nativeEvent.position);
    };

    const renderPaginationDots = () => (
        <View style={styles.pagination}>
            {welcomeSlides.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.paginationDot,
                        {
                            backgroundColor:
                                index === currentPage ? colors.interactive.primary.default : colors.interactive.neutral.default,
                            width: 12,
                            height: 12,
                        },
                    ]}
                />
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.surface.primary }]}>
            {/* Header Section */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
                <Logo fontSize={Typography.heading.h1.fontSize} style={styles.logo} />
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.sliderWrapper}>
                    <PagerView style={styles.pagerView} initialPage={0} onPageSelected={handlePageSelected} overdrag={true}>
                        {welcomeSlides.map((slide, index) => (
                            <View key={index} style={styles.slide} collapsable={false}>
                                <View style={styles.slideContent}>
                                    <View style={styles.imageWrapper}>
                                        <Image source={slide.source} style={styles.slideImage} contentFit="contain" transition={200} />
                                    </View>
                                    <View style={styles.textContent}>
                                        <Text style={[styles.slideTitle, { color: colors.content.primary }]}>{slide.title}</Text>
                                        <Text style={[styles.slideDescription, { color: colors.content.secondary }]}>
                                            {slide.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </PagerView>
                    {renderPaginationDots()}
                </View>
            </View>

            {/* Footer Section */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
                <Pressable style={[styles.primaryButton, { backgroundColor: colors.interactive.primary.default }]} onPress={handleSignUp}>
                    <Text style={[styles.primaryButtonText, { color: colors.content.inverse }]}>
                        {`I'm new to AutoSocial, let's signup.`}
                    </Text>
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
    },
    header: {
        alignItems: "center",
        paddingHorizontal: Spacing.xs,
        paddingBottom: Spacing.md,
    },
    logo: {
        marginBottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    sliderWrapper: {
        width: SCREEN_WIDTH,
        height: Math.min(SCREEN_HEIGHT * 0.6, 500),
        justifyContent: "center",
        alignItems: "center",
    },
    pagerView: {
        width: SCREEN_WIDTH,
        height: "100%",
    },
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.xs,
    },
    slideContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    imageWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: Spacing.md,
    },
    slideImage: {
        width: SCREEN_WIDTH - Spacing.xs,
        height: SCREEN_WIDTH - Spacing.xs,
        borderRadius: BorderRadius.md,
    },
    textContent: {
        alignItems: "center",
    },
    slideTitle: {
        ...Typography.heading.h3,
        textAlign: "center",
        marginBottom: Spacing.sm,
        fontWeight: "700",
    },
    slideDescription: {
        ...Typography.bodyText.small,
        textAlign: "center",
        lineHeight: 20,
        paddingHorizontal: Spacing.sm,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Spacing.md,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: Spacing.xs / 2,
    },
    footer: {
        paddingHorizontal: Spacing.xs,
        paddingTop: Spacing.md,
    },
    primaryButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xs,
        borderRadius: BorderRadius.md,
        alignItems: "center",
        marginBottom: Spacing.sm,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    secondaryButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xs,
        alignItems: "center",
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
});

export default WelcomeScreen;
