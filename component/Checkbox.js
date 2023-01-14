import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default class Checkbox extends React.Component {
	render() {
		let activeOpacity =
			typeof this.props.activeOpacity !== "undefined"
				? this.props.activeOpacity
				: 0.2;

		let checkedColor =
			typeof this.props.checkedColor !== "undefined"
				? this.props.checkedColor
				: "#000000";

		let uncheckedColor =
			typeof this.props.uncheckedColor !== "undefined"
				? this.props.uncheckedColor
				: "#000000";

		let iconSize =
			typeof this.props.iconSize !== "undefined" ? this.props.iconSize : 18;

		return (
			<TouchableOpacity
				activeOpacity={activeOpacity}
				style={styles.container}
				onPress={this.props.onChange}
			>
				{this.props.checked ? (
					<Ionicons name={"checkbox"} color={checkedColor} size={iconSize} />
				) : (
					<Ionicons
						name={"square-outline"}
						color={uncheckedColor}
						size={iconSize}
					/>
				)}
				<Text style={[styles.labelStyle, this.props.labelStyle]}>
					{this.props.label}
				</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 3,
		flexDirection: "row",
		alignItems: "center",
	},
	labelStyle: {
		fontSize: 18,
		color: "#000000",
		marginLeft: 3,
		marginRight: 10,
	},
});
