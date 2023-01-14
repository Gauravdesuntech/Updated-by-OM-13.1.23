import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Colors } from "../config";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: "center",
        justifyContent: "center",
    },
    imageStyle: {
        width: 100,
        height: 100,
    },
    textStyle: {
        fontSize: 16,
        color: "#555",
        opacity: 0.9
    },
});

const ListEmpty = () => (
    <View style={styles.container}>
        <Image
            source={require("../assets/emty-folder.png")}
            resizeMode="contain"
            style={styles.imageStyle}
        />
        <Text style={styles.textStyle}>
            No data found
        </Text>
    </View>
);

export default ListEmpty;