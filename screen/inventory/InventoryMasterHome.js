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
	MaterialIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../component";
//import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class InventoryMasterHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: [
				{
					id: 1,
					name: "Categories",
					onclick: () => this.props.navigation.navigate("ItemCategories"),
					icon: <FontAwesome name="th-large" size={35} color={Colors.textColor} />
				},
				{
					id: 2,
					name: "Store Names",
					onclick: () => this.props.navigation.navigate("StoreNames"),
					icon: <MaterialIcons name="store" size={35} color={Colors.textColor} />
				},
				{
					id: 3,
					name: "Items",
					onclick: () => this.props.navigation.navigate("ItemsMenu"),
					icon: <Ionicons name="cube" size={35} color={Colors.textColor} />
				},
				{
					id: 4,
					name: "Recipes",
					onclick: () => this.props.navigation.navigate("Recipes"),
					icon: <FontAwesome name="book" size={35} color={Colors.textColor} />
				},
				{
					id: 5,
					name: "Parties",
					onclick: () => this.props.navigation.navigate("Parties"),
					icon: <Ionicons name="people" size={35} color={Colors.textColor} />
				}
			]
		}
	}
	gotoCategories = () => this.props.navigation.navigate("ItemCategories");

	gotoStoreNames = () => this.props.navigation.navigate("StoreNames");

	gotoItems = () => this.props.navigation.navigate("Items");

	gotoRecipes = () => this.props.navigation.navigate("Recipes");

	gotoParties = () => this.props.navigation.navigate("Parties");

	renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={item.onclick}
				style={[styles.btn, styles.pl12,globalStyle.bbw0, {
					borderBottomColor: "#eee",
				}]}
			>
				<View style={styles.imgContainer}>
					{item.icon}
				</View>
				<Text style={styles.title}>{item.name}</Text>
			</TouchableOpacity>
		)
	}

	render = () => (
		<Container>
			<Header title={"Inventory Mgmt"} />
			<View style={styles.container}>
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
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 10,
	},
	pl12: {
		paddingLeft: 12,
	},
	btn: {
		// width: Math.floor(windowWidth / 2),
		paddingVertical: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	imgContainer: {
		width: "20%",
	},

	title: {
		width: "72%",
		fontSize: 16,
		color: Colors.textColor,
		fontWeight: "bold",
	},
});
