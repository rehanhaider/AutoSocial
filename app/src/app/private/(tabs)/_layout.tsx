import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import AppHeader from "@/components/layout/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar from "@/components/layout/TabBar";
import { useLocalSearchParams } from "expo-router";
import SettingsScreen from "./settings";
import HomeScreen from "./index";

type TabParamList = {
    Home: undefined;
    Settings: undefined;
};

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
                tabBar={(props) => <TabBar {...props} />}
            >
                <Tab.Screen name="Home" component={HomeScreen} initialParams={params as any} />
            </Tab.Navigator>
        </View>
    );
};

export default MainTabs;
