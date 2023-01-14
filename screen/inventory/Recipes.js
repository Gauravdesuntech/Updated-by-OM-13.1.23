import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getRecipes } from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'
export default class InventoryItems extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			recipes: [],
		};
	}

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener(
			"focus",
			this.onScreenFocus
		);
	}

	onScreenFocus = () => {
		this.setState(
			{
				isLoading: true,
				recipes: [],
			},
			() => {
				this.loadRecipes();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadRecipes = () => {
		let cid = this.context.userDetails.cid;
		getRecipes(cid)
			.then((data) => {
				this.setState({
					isLoading: false,
					recipes: data,
				});
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadRecipes();
			}
		);
	};

	gotoAddRecipe = () => this.props.navigation.navigate("AddRecipe");

	gotoEditRecipe = (item) => {
		this.props.navigation.navigate("AddRecipe", {
			id: item.id,
			recipeCode: item.recipe_code,
			recipeName: item.name,
		});
	};

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={!this.context.userDetails.action_types.includes('Edit') ? undefined : this.gotoEditRecipe.bind(this, item)}
		>
			<View style={styles.row}>
				<View style={styles.leftPart}>
					<Text style={styles.name}>{item.name}</Text>
				</View>
				<View style={styles.rightPart}>
					<Ionicons name="chevron-forward" style={styles.iconStyle} />
				</View>
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header
				title={"Recipes"}
				addAction={this.state.isLoading || !this.context.userDetails.action_types.includes('Add') ? undefined : this.gotoAddRecipe}
			/>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.recipes}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.recipes.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.recipes.length === 0 ? styles.container : null
					}
				/>
			)}
		</Container>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 	},
// 	row: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		height: 50,
// 		alignItems: "center",
// 	},
// 	leftPart: {
// 		width: "75%",
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	name: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 14,
// 		lineHeight: 22,
// 	},
// 	qtyBox: {
// 		backgroundColor: Colors.primary,
// 		paddingHorizontal: 5,
// 		paddingVertical: 3,
// 		borderRadius: 3,
// 	},
// 	qtyText: {
// 		fontSize: 14,
// 		color: "#FFF",
// 	},
// 	iconStyle: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},
// });
