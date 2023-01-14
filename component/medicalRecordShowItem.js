import * as React from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Colors from "../config/colors";

export default function MedicalRecord({ navigation }) {
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				navigation.navigate("MedicalRecordEntry");
			}}
		>
			<View style={styles.CardBox}>
				<View style={styles.cardList}>
					<Text style={styles.labelName}>
						Diagnosis : <Text style={styles.mc}>Eye Infection</Text>
					</Text>
					<Text style={styles.labelName}>
						Date : <Text style={styles.mc}>1/1/2020</Text>
					</Text>
					<Text style={styles.labelName}>
						Treatment : <Text style={styles.mc}>Eye Drops</Text>
					</Text>
					<Text style={styles.labelName}>
						Status : <Text style={styles.mc}>Ongoing</Text>
					</Text>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	cardList: {
		height: 80,
	},
	CardBox: {
		flexDirection: "row",
		padding: 5,
		borderRadius: 3,
		borderColor: "#ddd",
		borderWidth: 1,
		backgroundColor: "#fff",
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
	labelName: {
		fontSize: 12,
		paddingLeft: 4,
		color: "#333",
		textAlign: "left",
		fontWeight: "bold",
		flex: 1,
		width: "100%",
	},
	mc: {
		color: "#B5B5B5",
		marginLeft: 5,
		fontSize: 12,
		fontWeight: "500",
	},
});
