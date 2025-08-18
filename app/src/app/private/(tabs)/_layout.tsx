import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import AppHeader from "@/components/layout/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar from "@/components/layout/TabBar";
import { useLocalSearchParams } from "expo-router";
import HomeScreen from "./index";
import PaletteScreen from "./palette";
import { Ionicons } from "@expo/vector-icons";

const TABS = {
    Home: {
        name: "home",
        lib: Ionicons,
        component: HomeScreen,
    },
    Palette: {
        name: "color-palette",
        lib: Ionicons,
        component: PaletteScreen,
    },
} as const;

type TabParamList = Record<keyof typeof TABS, undefined>;

const Tab = createMaterialTopTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { colors, colorScheme } = useTheme();
    const params = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
            <AppHeader />
            <Tab.Navigator
                initialRouteName="Home"
                tabBarPosition="bottom"
                screenOptions={{
                    tabBarShowLabel: true,
                    tabBarIndicatorStyle: { height: 0 }, // Hide the top indicator
                    swipeEnabled: true,
                }}
                tabBar={(props) => <TabBar tabs={TABS} {...props} />}
            >
                {Object.entries(TABS).map(([key, value]) => (
                    <Tab.Screen key={key} name={key as keyof typeof TABS} component={value.component} initialParams={params as any} />
                ))}
            </Tab.Navigator>
        </View>
    );
};

export default MainTabs;
