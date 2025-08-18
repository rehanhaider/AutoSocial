import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";

const Index: React.FC = () => {
    const params = useLocalSearchParams();
    return <Redirect href={{ pathname: "/private/(tabs)", params }} />;
};

export default Index;
