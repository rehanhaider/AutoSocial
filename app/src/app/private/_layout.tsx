import React from "react";
import { Drawer } from "expo-router/drawer";
import { useTheme } from "@/hooks/useTheme";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import AppDrawerContent from "@/components/layout/AppDrawerContent";

const PrivateLayout: React.FC = () => {
    const { colors } = useTheme();
    return (
        <Drawer
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: 280,
                    backgroundColor: colors.surface.primary,
                },
                drawerActiveBackgroundColor: colors.surface.inverse,
                drawerInactiveBackgroundColor: colors.surface.primary,
                drawerActiveTintColor: colors.content.inverse,
                drawerInactiveTintColor: colors.content.primary,
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: "bold",
                },
            }}
            drawerContent={(props: DrawerContentComponentProps) => <AppDrawerContent {...props} />}
        ></Drawer>
    );
};

export default PrivateLayout;
