import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import AppHeader from "@/components/layout/AppHeader";
import TabBar from "@/components/layout/TabBar";
import { useLocalSearchParams } from "expo-router";
import { TabParamList } from "@/types/ui";
import ScheduledPosts from "./index";
import Drafts from "./drafts";
import Setting from "./settings";

const TABS: TabParamList = {
    ScheduledPosts: {
        name: "list",
        component: ScheduledPosts,
    },
    Drafts: {
        name: "create",
        component: Drafts,
    },
    Analytics: {
        name: "settings",
        component: Setting,
    },
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
    const params = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
            <AppHeader />
            <Tab.Navigator
                initialRouteName="ScheduledPosts"
                tabBarPosition="bottom"
                screenOptions={{
                    tabBarShowLabel: true,
                    tabBarIndicatorStyle: { height: 0 }, // Hide the top indicator
                    swipeEnabled: true,
                }}
                tabBar={(props) => <TabBar tabs={TABS} {...props} />}
            >
                {Object.entries(TABS).map(([key, value]) => (
                    <Tab.Screen key={key} name={key} component={value.component} initialParams={params as any} />
                ))}
            </Tab.Navigator>
        </View>
    );
};

export default MainTabs;
