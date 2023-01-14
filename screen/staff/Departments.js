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
import { getDepartments } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class Departments extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			departments: [],
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
				departments: [],
			},
			() => {
				this.loadDepartments();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadDepartments = () => {
		let cid = this.context.userDetails.cid;
		getDepartments(cid)
			.then((data) => {
				this.setState({
					isLoading: false,
					departments: data,
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
				this.loadDepartments();
			}
		);
	};

	gotoAddDepartment = () => this.props.navigation.navigate("AddDepartment");

	gotoEditDepartment = (item) => {
		let selectedMenues = (item.menu_permission || []).map((v, i) => {
			let index = Configs.HOME_SCREEN_MENUES.findIndex(
				(element) => element.id === v
			);
			return Configs.HOME_SCREEN_MENUES[index];
		});

		this.props.navigation.navigate("AddDepartment", {
			id: item.id,
			name: item.dept_name,
			selectedMenues: selectedMenues,
		});
	};

	gotoDesignations = (item) =>
		this.props.navigation.navigate("Designations", {
			deptCode: item.dept_code,
			deptName: item.dept_name,
		});

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			// onPress={this.gotoDesignations.bind(this, item)}
			onLongPress={this.context.userDetails?.action_types.includes("Edit")? this.gotoEditDepartment.bind(this, item) : undefined}
		>
			<View style={styles.row}>
				<View style={[styles.leftPart,{padding:5}]}>
					<Text style={[styles.labelName, styles.text_bold]}>{item.dept_name}</Text>
				</View>
				{/* <View style={[styles.rightPart,{padding:5,alignItems:'flex-end'}]}>
					<Ionicons name="chevron-forward" size={18} color="#cecece" />
				</View> */}
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header title={"Departments"} addAction={this.context.userDetails?.action_types.includes("Add")? this.gotoAddDepartment : undefined} />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.departments}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.departments.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.departments.length === 0 ? styles.container : null
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
// 		height: 50,
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
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
// 	iconStyle: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},
// });
