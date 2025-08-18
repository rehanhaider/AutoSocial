/** This page lays out the available color palettes for the app */

import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const PaletteScreen: React.FC = () => {
    const { colors } = useTheme();
    const surfaces = [
        { name: "Primary Surface", color: colors.surface.primary },
        { name: "Secondary Surface", color: colors.surface.secondary },
        { name: "Tertiary Surface", color: colors.surface.tertiary },
        { name: "Inverse Surface", color: colors.surface.inverse },
        { name: "Overlay Surface", color: colors.surface.overlay },
    ];

    const contents = [
        { name: "Primary Content", color: colors.content.primary },
        { name: "Secondary Content", color: colors.content.secondary },
        { name: "Tertiary Content", color: colors.content.tertiary },
        { name: "Accent Content", color: colors.content.accent },
        { name: "Disabled Content", color: colors.content.disabled },
        { name: "Inverse Content", color: colors.content.inverse },
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.surface.primary }}>
            <View>
                {surfaces.map((surface) => (
                    <View key={surface.name} style={{ backgroundColor: surface.color, paddingVertical: 16 }}>
                        <View style={{ paddingHorizontal: 24 }}>
                            <Text className="text-xl font-bold mb-2" style={{ color: colors.content.primary }}>
                                {surface.name}
                            </Text>
                            {contents.map((content) => (
                                <Text key={content.name} className="mb-1" style={{ color: content.color }}>
                                    {content.name}
                                </Text>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default PaletteScreen;
