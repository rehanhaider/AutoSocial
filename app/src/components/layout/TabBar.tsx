import React, { useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Platform, Animated } from "react-native";

import { BlurView } from "expo-blur";
import { useHaptics } from "@/hooks/useHaptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabParamList } from "@/types/ui";

const TabBar: React.FC<{ tabs: TabParamList; state: any; navigation: any }> = ({ tabs, state, navigation }) => {
    const icons: Record<string, { name: string }> = tabs;

    const insets = useSafeAreaInsets();
    const { colors, colorScheme, shadows, isDark } = useTheme();
    // Create refs for all routes at the top level
    const scaleAnimRefs = useRef<Record<string, Animated.Value>>({});

    // Initialize animation values for each route
    state.routes.forEach((route: any, index: number) => {
        if (!scaleAnimRefs.current[route.key]) {
            const isFocused = state.index === index;
            scaleAnimRefs.current[route.key] = new Animated.Value(isFocused ? 1.1 : 1);
        }
    });

    const { triggerHaptic } = useHaptics();

    // Handle animations for all tabs in a single useEffect
    useEffect(() => {
        state.routes.forEach((route: any, index: number) => {
            const isFocused = state.index === index;
            const scaleAnimRef = scaleAnimRefs.current[route.key];
            if (scaleAnimRef) {
                Animated.timing(scaleAnimRef, {
                    toValue: isFocused ? 1.1 : 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        });
    }, [state.index, state.routes]);

    const styles = StyleSheet.create({
        tabBarContainer: {
            ...Platform.select({
                ios: {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
    });

    return (
        <View
            className="absolute rounded-t-xl bottom-0 left-0 right-0"
            style={[styles.tabBarContainer, { height: 60 + insets.bottom, paddingBottom: insets.bottom, ...shadows.sm }]}
        >
            {Platform.OS === "ios" && (
                <BlurView
                    intensity={95}
                    tint={colorScheme === "dark" || colorScheme === "premium" ? "dark" : "light"}
                    className="absolute inset-0"
                />
            )}
            {Platform.OS !== "ios" && (
                <View
                    className="absolute inset-0"
                    style={{
                        backgroundColor: colors.surface.primary,
                    }}
                />
            )}
            <View className="flex-1 flex-row justify-around items-center pt-2">
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    const scaleAnimRef = scaleAnimRefs.current[route.key];
                    const iconInfo = icons[route.name];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                        // Subtle haptic feedback on tab press (if enabled in settings)
                        try {
                            triggerHaptic && triggerHaptic(ImpactFeedbackStyle.Light);
                        } catch (error) {
                            // Silently fail if haptic feedback is not available
                        }
                    };

                    // Skip rendering if no scale animation ref or icon info
                    if (!scaleAnimRef || !iconInfo) {
                        return null;
                    }

                    return (
                        <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7}>
                            <Animated.View style={[{ transform: [{ scale: scaleAnimRef }] }]}>
                                <Ionicons
                                    name={iconInfo.name as any}
                                    size={isFocused ? 24 : 22}
                                    color={isFocused ? colors.accent.redditRed : colors.content.tertiary}
                                />
                            </Animated.View>
                            {isFocused && (
                                <View className="w-6 h-[3px] rounded mt-2 mx-auto" style={{ backgroundColor: colors.accent.redditRed }} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default TabBar;
