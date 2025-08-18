import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import AppHeader from "@/components/layout/AppHeader";
import TabBar from "@/components/layout/TabBar";
import { useLocalSearchParams } from "expo-router";
import HomeScreen from "./index";

type TabParamList = {
    Home: undefined;
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
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
