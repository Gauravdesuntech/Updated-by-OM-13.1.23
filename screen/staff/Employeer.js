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
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getEmplyeer } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";

export default class Employeers extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			employeers: [],
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
				employeers: [],
			},
			() => {
				this.loadEmployeers();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadEmployeers = () => {
		let cid = this.context.userDetails.cid;
		getEmplyeer(cid)
			.then((data) => {
				this.setState({
					isLoading: false,
					employeers: data,
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
				this.loadEmployeers();
			}
		);
	};

	gotoAddEmployeer = () => this.props.navigation.navigate("AddEmployeer");

	gotoEditDepartment = (item) => {
		this.props.navigation.navigate("AddEmployeer", {
			id: item.id,
			name: item.name,
			address: item.address,
		});
	};


	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.context.userDetails?.action_types.includes("Edit")? this.gotoEditDepartment.bind(this, item) : undefined}
			// onLongPress={this.gotoEditDepartment.bind(this, item)}
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
			<Header title={"Employeers"} addAction={this.context.userDetails?.action_types.includes("Add")? this.gotoAddEmployeer : undefined} />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.employeers}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.employeers.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.employeers.length === 0 ? styles.container : null
					}
				/>
			)}
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 5,
	},
	row: {
		height: 50,
		flexDirection: "row",
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
	},
	leftPart: {
		width: "75%",
		justifyContent: "center",
	},
	rightPart: {
		width: "25%",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	name: {
		fontSize: 16,
		color: Colors.textColor,
		fontWeight: "bold",
		lineHeight: 24,
	},
	iconStyle: {
		fontSize: 18,
		color: "#cecece",
	},
});
