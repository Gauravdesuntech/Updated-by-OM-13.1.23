
import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../config/colors";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const tabHeight = 50;
const styles = StyleSheet.create({
    container: {
		flex: 1,
		padding: 8,
	},
	fieldBox: {
		width: "100%",
		overflow: "hidden",
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
	labelName: {
		color: Colors.textColor,
		lineHeight: 40,
		fontSize: 14,
		paddingLeft: 4,
	},
	textfield: {
		backgroundColor: "#fff",
		height: 40,
		
		fontSize: 12,
		color: Colors.textColor,
		textAlign: "right",
		width: "60%",
		padding: 5,
	},
	button: {
		alignItems: "center",
		backgroundColor: Colors.primary,
		padding: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		borderRadius: 20,
		color: "#fff",
		marginVertical: 10,
	},
	textWhite: {
		color: "#fff",
		fontWeight: "bold",
	},
})
export default styles;