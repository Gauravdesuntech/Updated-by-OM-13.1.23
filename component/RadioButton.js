import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../config/colors";

export default class RadioButton extends React.Component {
	render() {
		const { status } = this.props;
		return (
			<View style={status ? styles.radioCircleSelected : styles.radioCircle}>
				{status && <View style={styles.selectedRb} />}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 20 / 2,
		borderWidth: 2,
		borderColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	radioCircleSelected: {
		height: 20,
		width: 20,
		borderRadius: 20 / 2,
		borderWidth: 2,
		borderColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedRb: {
		width: 10,
		height: 10,
		borderRadius: 10 / 2,
		backgroundColor: Colors.primary,
	},
});
