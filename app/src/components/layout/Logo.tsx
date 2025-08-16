import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Typography } from "@/styles";

export interface LogoProps {
    fontSize?: number;
    style?: any;
}

const Logo: React.FC<LogoProps> = ({ fontSize = 18, style }) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        logoContainer: {
            flexDirection: "row",
        },
        logoText: {
            fontSize,
            letterSpacing: -0.5,
        },
        logoBold: {
            fontSize,
            fontFamily: Typography.heading.h1.fontFamily,
            fontWeight: "800",
            letterSpacing: -0.5,
        },
        logoLight: {
            fontSize,
            fontFamily: Typography.bodyText.medium.fontFamily,
            fontWeight: "300",
            opacity: 0.95,
            letterSpacing: 0.5,
        },
    });
    return (
        <>
            {/* Center - Logo */}
            <View style={[styles.logoContainer, style]}>
                <Text style={[styles.logoText, { color: colors.accent.redditRed }]}>
                    <Text style={[styles.logoBold, { color: colors.accent.redditRed }]}>Auto</Text>
                    <Text style={[styles.logoLight, { color: colors.accent.redditRed }]}>Social</Text>
                </Text>
            </View>
        </>
    );
};

export default Logo;
