import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import Colors from "../config/colors";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalBody: {
		backgroundColor: Colors.white,
		width: Math.floor((windowWidth * 90) / 100),
		height: Math.floor((windowHeight * 20) / 100),
		borderRadius: 3,
		elevation: 8,
	},
	titleText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#444",
		lineHeight: 30,
	},
	subText: {
		fontSize: 15,
		color: Colors.textColor,
		lineHeight: 25,
	},
	btnContainer: {
		width: "100%",
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
		height: 50,
		borderTopWidth: 1,
		borderColor: "#d1d1d1",
	},
	cancelBtn: {
		width: "50%",
		alignItems: "center",
		justifyContent: "center",
	},
	confirmBtn: {
		width: "50%",
		borderLeftWidth: 1,
		borderLeftColor: "#d1d1d1",
		alignItems: "center",
		justifyContent: "center",
	},
	cancelBtnText: {
		fontSize: 16,
		color: Colors.textColor,
	},
	confirmBtnText: {
		fontSize: 16,
		fontWeight: "bold",
		color: Colors.primary,
	},
});

const ConfirmDialog = (props) => {
	const titleText =
		typeof props.title !== "undefined" ? props.title : "Remove Item";
	const subText =
		typeof props.subText !== "undefined"
			? props.subText
			: "Are you sure you want to remove this item ?";
	const confirmText =
		typeof props.confirmText !== "undefined" ? props.confirmText : "Yes";
	const cancelText =
		typeof props.cancelText !== "undefined" ? props.cancelText : "No";

	return (
		<Modal
			animationType="fade"
			transparent={true}
			statusBarTranslucent={true}
			visible={props.visible}
			onRequestClose={props.onCancel}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalBody}>
					<View style={{ padding: 15 }}>
						<Text style={styles.titleText}>{titleText}</Text>
						<Text style={styles.subText}>{subText}</Text>
					</View>
					<View style={styles.btnContainer}>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.cancelBtn}
							onPress={props.onCancel}
						>
							<Text style={styles.cancelBtnText}>{cancelText}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.confirmBtn}
							onPress={props.onConfirm}
						>
							<Text style={styles.confirmBtnText}>{confirmText}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default ConfirmDialog;
