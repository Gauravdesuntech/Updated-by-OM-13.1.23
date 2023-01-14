import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.background,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		color: Colors.textColor,
		opacity: 0.9,
		fontSize: 14,
		marginTop: 10,
	},
});

const Loader = () => (
	<View style={styles.container}>
		<ActivityIndicator size="large" color={Colors.primary} />
		<Text style={styles.loadingText}>Loading...</Text>
	</View>
);

export default Loader;
