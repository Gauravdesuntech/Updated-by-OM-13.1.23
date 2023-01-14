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
import { getUsers } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import globalStyle from "../../config/Styles";

export default class UsersProfileList extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			deptCode:
				typeof props.route.params !== "undefined"
					? props.route.params.deptCode
					: undefined,
			deptName:
				typeof props.route.params !== "undefined"
					? props.route.params.deptName
					: undefined,
			desgCode:
				typeof props.route.params !== "undefined"
					? props.route.params.desgCode
					: undefined,
			desgName:
				typeof props.route.params !== "undefined"
					? props.route.params.desgName
					: undefined,
			isLoading: true,
			users: [],
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
				users: [],
			},
			() => {
				this.loadUsers();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadUsers = () => {
		let reqObj = {cid: this.context.userDetails.cid};

		if(typeof this.state.deptCode !== "undefined"){
			reqObj.dept_code= this.state.deptCode
		}

		if(typeof this.state.desgCode !== "undefined"){
			reqObj.desg_code= this.state.desgCode
		}

		getUsers(reqObj)
			.then((data) => {
				this.setState({
					isLoading: false,
					users: data,
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
				this.loadUsers();
			}
		);
	};

	gotoAddUser = () =>
		this.props.navigation.navigate("AddUser", {
			deptCode: this.state.deptCode,
			deptName: this.state.deptName,
			desgCode: this.state.desgCode,
			desgName: this.state.desgName,
		});

	gotoEditUser = (item) => {
		this.props.navigation.navigate("AddUser", {
			id: item.id,
			deptCode: item.dept_code,
			deptName: item.dept_name,
			desgCode: item.desg_code,
			desgName: item.desg_name,
		});
	};

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.context.userDetails?.action_types.includes("Edit")? this.gotoEditUser.bind(this, item) : undefined}
		>
			<View style={globalStyle.row}>
				<View style={[globalStyle.leftPart,globalStyle.p5]}>
					<Text style={[globalStyle.labelName, globalStyle.pd0, globalStyle.text_bold]}>{item.full_name}</Text>
					<Text style={[globalStyle.textfield, globalStyle.pd0]}>{"Department: " + item.dept_name}</Text>
					<Text style={[globalStyle.textfield, globalStyle.pd0]}>{"Designation: " + item.desg_name}</Text>
				</View>
				<View style={[globalStyle.alignItemsFlexEnd,globalStyle.p5, {width:'25%',padding:5,alignItems:'flex-end'}]}>
					<Ionicons name="chevron-forward" size={18} color="#cecece" />
				</View>
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header title={"Profile"} />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.users}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.users.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.users.length === 0 ? globalStyle.container : null
					}
				/>
			)}
		</Container>
	);
}

// const globalStyle = StyleSheet.create({
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
