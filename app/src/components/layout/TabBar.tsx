import React, { useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Platform, Animated } from "react-native";
import { BorderRadius, Spacing } from "@/styles";
import { BlurView } from "expo-blur";
import { useHaptics } from "@/hooks/useHaptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabBar: React.FC<{ state: any; navigation: any }> = ({ state, navigation }) => {
    const icons: Record<string, { name: string; lib: any }> = {
        Home: { name: "home", lib: Ionicons },
    };

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
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: BorderRadius.xl,
            borderTopRightRadius: BorderRadius.xl,
            ...shadows.sm,
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
        tabBarContent: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingTop: Spacing.sm,
        },
        iconWrapper: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            minWidth: 60,
            minHeight: 44,
        },
        focusedIndicator: {
            width: 24,
            height: 3,
            borderRadius: BorderRadius.sm,
            marginTop: Spacing.sm,
        },
    });

    return (
        <View style={[styles.tabBarContainer, { height: 60 + insets.bottom, paddingBottom: insets.bottom }]}>
            {Platform.OS === "ios" && (
                <BlurView intensity={95} tint={colorScheme === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
            )}
            {Platform.OS !== "ios" && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: colors.surface.primary,
                        },
                    ]}
                />
            )}
            <View style={styles.tabBarContent}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    const { name, lib: IconComponent } = icons[route.name];
                    const scaleAnimRef = scaleAnimRefs.current[route.key];

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
                        } catch {}
                    };

                    return (
                        <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7}>
                            <Animated.View style={[{ transform: [{ scale: scaleAnimRef }] }]}>
                                <IconComponent
                                    name={name}
                                    size={isFocused ? 24 : 22}
                                    color={isFocused ? colors.accent.redditRed : colors.content.tertiary}
                                />
                            </Animated.View>
                            {isFocused && <View style={[styles.focusedIndicator, { backgroundColor: colors.accent.redditRed }]} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default TabBar;
