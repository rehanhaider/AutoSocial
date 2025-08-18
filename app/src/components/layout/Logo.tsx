import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export interface LogoProps {
    fontSize?: number;
    style?: any;
}

const Logo: React.FC<LogoProps> = ({ fontSize = 18, style }) => {
    const { colors } = useTheme();

    return (
        <>
            {/* Center - Logo */}
            <View className="flex-row" style={[style]}>
                <Text className="text-lg" style={[{ color: colors.accent.redditRed, fontSize: fontSize }]}>
                    <Text className="font-bold" style={[{ color: colors.accent.redditRed }]}>
                        Auto
                    </Text>
                    <Text className="font-light" style={[{ color: colors.accent.redditRed }]}>
                        Social
                    </Text>
                </Text>
            </View>
        </>
    );
};

export default Logo;
