import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	fieldBox: {
		flexDirection: "row",
		padding: 5,
		borderRadius: 3,
		borderColor: "#ddd",
		borderWidth: 1,
		backgroundColor: "#fff",
		height: 50,
		justifyContent: "space-between",
		marginBottom: 5,
		marginTop: 5,
		shadowColor: "#999",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
	},
	textfielddate: {
		backgroundColor: "#fff",
		height: 40,
		lineHeight: 30,
		fontSize: 12,
		color: Colors.textColor,
		position: "absolute",
		right: 35,
		bottom: 0,
	},
	labelName: {
		color: Colors.textColor,
		lineHeight: 40,
		fontSize: 14,
		paddingLeft: 4,
	},
	textInputIcon: {
		position: "absolute",
		bottom: 14,
		right: 10,
		marginLeft: 8,
		color: Colors.primary,
		zIndex: 99,
	},
});

const DatePicker = (props) => {
	return (
		<>
			<TouchableWithoutFeedback onPress={props.onPress}>
				<View style={[styles.fieldBox, props.style]}>
					<Text style={styles.labelName}>{props.label} </Text>
					<AntDesign name="calendar" style={styles.textInputIcon} size={20} />
					{!!props.date ? (
						<Text style={styles.textfielddate}>
							{props.date.toDateString()}
						</Text>
					) : (
						<Text style={[styles.textfielddate, { opacity: 0.6 }]}>
							{"DD/MM/YYYY"}
						</Text>
					)}
				</View>
			</TouchableWithoutFeedback>
			{props.show && (
				<DateTimePicker
					testID="dateTimePicker"
					value={!!props.date ? props.date : new Date()}
					mode={props.mode}
					is24Hour={true}
					display="default"
					onChange={props.onChange}
					minimumDate={props.minimumDate}
				/>
			)}
		</>
	);
};

export default DatePicker;
