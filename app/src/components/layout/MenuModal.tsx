import { Modal, TouchableWithoutFeedback, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Spacing } from "@/styles";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MenuModalProps {
    isDropdownVisible: boolean;
    onClose: () => void;
    headerHeight?: number; // Optional for backward compatibility
}

const MenuModal: React.FC<MenuModalProps> = ({ isDropdownVisible, onClose, headerHeight: propHeaderHeight }) => {
    const { colors, shadows } = useTheme();
    const router = useRouter();
    const { logout } = useAuthStore();
    const insets = useSafeAreaInsets();

    // Calculate exact header height to match AppHeader
    const headerHeight = insets.top + Spacing.sm + Spacing.sm; // safe area + paddingBottom + paddingTop + button height

    const handleSettingsPress = () => {
        onClose();
        router.push("/settings");
    };

    const handleLogoutPress = async () => {
        onClose();
        try {
            await logout();
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Modal visible={isDropdownVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-start items-end pr-xs" style={{ paddingTop: propHeaderHeight }}>
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                styles.dropdownContainer,
                                {
                                    backgroundColor: colors.surface.primary,
                                    borderColor: colors.border.secondary,
                                    ...shadows.md,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={[styles.dropdownItem, { borderBottomColor: colors.border.secondary }]}
                                onPress={handleSettingsPress}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="settings-outline" size={20} color={colors.content.secondary} />
                                <Text style={[styles.dropdownText, { color: colors.content.primary }]}>Settings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.dropdownItem, { borderBottomWidth: 0 }]}
                                onPress={handleLogoutPress}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="log-out-outline" size={20} color={colors.content.secondary} />
                                <Text style={[styles.dropdownText, { color: colors.content.primary }]}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        minWidth: 160,
        borderRadius: 8,
        borderWidth: 1,
        overflow: "hidden",
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    dropdownText: {
        marginLeft: Spacing.sm,
        fontSize: 16,
        fontWeight: "500",
    },
});

export default MenuModal;
