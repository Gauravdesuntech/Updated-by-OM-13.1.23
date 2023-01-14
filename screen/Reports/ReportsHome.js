import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	FlatList,
	Dimensions,
} from "react-native";
import { Container } from "native-base";
import {
	Ionicons,
	FontAwesome,
	FontAwesome5,
	MaterialIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../component";
import globalStyles from "../../config/Styles";

export default class ReportsHome extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			menus: [
				{
					id: 1,
					name: "Death Report",
					onclick: () => this.props.navigation.navigate("DeathReport"),
					icon: <MaterialCommunityIcons name="stocking" size={35} color={Colors.textColor} />
				},
				{
					id: 2,
					name: "Transfer Report",
					onclick: () => this.props.navigation.navigate("TransferReport"),
					icon: <FontAwesome name="recycle" size={35} color={Colors.textColor} />
				},
				{
					id: 3,
					name: "Task Report",
					onclick: () => this.props.navigation.navigate("TaskReport"),
					icon: <FontAwesome5 name="tasks" size={35} color={Colors.textColor} />
				},
				{
					id: 4,
					name: "Incident Report",
					onclick: () => this.props.navigation.navigate("IncidentReport"),
					icon: <MaterialIcons name="event-note" size={35} color={Colors.textColor} />
				},
				{
					id: 5,
					name: "Medical Report",
					onclick: () => this.props.navigation.navigate("MedicalReport"),
					icon: <FontAwesome5 name="book-medical" size={35} color={Colors.textColor} />
				},
				{
					id: 6,
					name: "Observations Report",
					onclick: () => this.props.navigation.navigate("ObservationsReport"),
					icon: <MaterialCommunityIcons name="table-eye" size={35} color={Colors.textColor} />
				},
			]
		}
	}


	renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={item.onclick}
				style={[globalStyles.icon_btn, globalStyles.pl12,]}
			>
				<View style={globalStyles.imgContainer}>
					{item.icon}
				</View>
				<Text style={globalStyles.title}>{item.name}</Text>
			</TouchableOpacity>
		)
	}

	render = () => (
		<Container>
			<Header title={"Reports Mgmt"} />
			<View style={globalStyles.container}>
			<FlatList
					data={this.state.menus}
					keyExtractor={(item) => item.id.toString()}
					renderItem={this.renderItem}
				/>
			</View>
		</Container>
	);
}

const windowWidth = Dimensions.get("screen").width;
// const globalStyles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingVertical: 10,
// 	},
// 	pl12: {
// 		paddingLeft: 12,
// 	},
// 	btn: {
// 		// width: Math.floor(windowWidth / 2),
// 		paddingVertical: 20,
// 		flexDirection: "row",
// 		alignItems: "center",
// 	},
// 	imgContainer: {
// 		width: "20%",
// 	},

// 	title: {
// 		width: "72%",
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},
// });
