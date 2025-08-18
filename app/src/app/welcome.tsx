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
        <View className="flex-row justify-center items-center" style={{ marginTop: Spacing.md }}>
            {welcomeSlides.map((_, index) => (
                <View
                    key={index}
                    className="w-4 h-4 rounded-sm mx-0.5"
                    style={[
                        {
                            backgroundColor:
                                index === currentPage ? colors.interactive.primary.default : colors.interactive.neutral.default,
                        },
                    ]}
                />
            ))}
        </View>
    );

    return (
        <View className="flex-1" style={{ backgroundColor: colors.surface.primary }}>
            {/* Header Section */}
            <View className="items-center pb-2 px-1" style={{ paddingTop: insets.top + Spacing.lg }}>
                <Logo fontSize={Typography.heading.h1.fontSize} />
            </View>

            {/* Content Section */}
            <View className="flex-1 justify-center items-center">
                <View className="w-full justify-center items-center" style={{ height: Math.min(SCREEN_HEIGHT * 0.6, 500) }}>
                    <PagerView style={styles.pagerView} initialPage={0} onPageSelected={handlePageSelected} overdrag={true}>
                        {welcomeSlides.map((slide, index) => (
                            <View className="flex-1 justify-center items-center px-1" key={index} collapsable={false}>
                                <View className="flex-1 justify-center items-center w-full">
                                    <View className="flex-1 justify-center items-center w-full mb-md">
                                        <Image
                                            className="px-1"
                                            source={slide.source}
                                            style={styles.slideImage}
                                            contentFit="contain"
                                            transition={200}
                                        />
                                    </View>
                                    <View className="items-center">
                                        <Text
                                            className="text-center mb-sm font-bold"
                                            style={[{ color: colors.content.primary, ...Typography.heading.h3 }]}
                                        >
                                            {slide.title}
                                        </Text>
                                        <Text className="text-center px-xxs" style={[{ color: colors.content.secondary }]}>
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
            <View className="px-xs pt-md" style={{ paddingBottom: Math.max(insets.bottom, Spacing.md) }}>
                <Pressable
                    className="items-center px-sm py-md rounded-md mb-sm"
                    style={[{ backgroundColor: colors.interactive.primary.default }]}
                    onPress={handleSignUp}
                >
                    <Text className="font-bold" style={[{ color: colors.content.primary }]}>
                        {`I'm new to AutoSocial, let's signup.`}
                    </Text>
                </Pressable>

                <Pressable className="items-center px-sm py-md" onPress={handleLogin}>
                    <Text className="font-bold" style={[{ color: colors.content.primary }]}>
                        I already have a AutoSocial account.
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pagerView: {
        width: SCREEN_WIDTH,
        height: "100%",
    },
    slideImage: {
        width: SCREEN_WIDTH - Spacing.xs,
        height: SCREEN_WIDTH - Spacing.xs,
    },
});

export default WelcomeScreen;
