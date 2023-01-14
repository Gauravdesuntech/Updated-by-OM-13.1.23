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
import { getStoreNames } from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'
export default class StoreNames extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			storeNames: [],
		};
	}

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener(
			"focus",
			this.loadStoreNames
		);
	}

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadStoreNames = () => {
		let cid = this.context.userDetails.cid;
		this.setState(
			{
				isLoading: true,
			},
			() => {
				getStoreNames(cid)
					.then((data) => {
						this.setState({
							isLoading: false,
							storeNames: data,
						});
					})
					.catch((error) => console.log(error));
			}
		);
	};

	gotoAddStoreName = () => this.props.navigation.navigate("AddStoreName");

	gotoEditStoreName = (item) => {
		this.props.navigation.navigate("AddStoreName", {
			id: item.id,
			storeName: item.name,
		});
	};

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.context.userDetails.action_types.includes("Edit") ? this.gotoEditStoreName.bind(this, item) : undefined}
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
				title={"Store Names"}
				addAction={this.state.isLoading || !this.context.userDetails.action_types.includes("Add") ? undefined : this.gotoAddStoreName}
			/>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.storeNames}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.storeNames.length}
					refreshing={this.state.isLoading}
					onRefresh={this.loadStoreNames}
					contentContainerStyle={
						this.state.storeNames.length === 0 ? styles.container : null
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
// 	},
// 	row: {
// 		flexDirection: "row",
// 		height: 50,
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 5,
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
// 	iconStyle: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},
// });
