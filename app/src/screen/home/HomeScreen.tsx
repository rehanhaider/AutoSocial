import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

const HomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    );
};

export default HomeScreen;
