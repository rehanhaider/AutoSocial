import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./home/HomeScreen";
import PostScreen from "./post/PostScreen";
import ScheduleScreen from "./schedule/ScheduleScreen";
import SettingsScreen from "./settings/SettingsScreen";

export type MainTabParamList = {
    Home: undefined;
    Post: undefined;
    Schedule: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = "";

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Post") {
                        iconName = focused ? "add-circle" : "add-circle-outline";
                    } else if (route.name === "Schedule") {
                        iconName = focused ? "calendar" : "calendar-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#1DA1F2",
                tabBarInactiveTintColor: "gray",
                headerShown: true,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Home",
                }}
            />
            <Tab.Screen
                name="Post"
                component={PostScreen}
                options={{
                    title: "Create Post",
                }}
            />
            <Tab.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{
                    title: "Schedule",
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: "Settings",
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
