import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const Index: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { colors } = useTheme();

    // Show loading spinner while checking auth status
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.surface.primary }}>
                <ActivityIndicator size="large" color={colors.interactive.primary.default} />
            </View>
        );
    }

    // Redirect based on authentication status
    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    } else {
        return <Redirect href="/welcome" />;
    }
};

export default Index;
