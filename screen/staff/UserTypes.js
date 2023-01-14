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
import { Header, ListEmpty } from "../../component";
import globalStyle from "../../config/Styles";

export default class UserTypes extends React.Component {
	state = {
		userTypes: [
			{
				id: "1",
				name: "Data Entry Operator",
				selectedAnimalCategories: [],
				selectedAnimalSubCategories: [],
			},
			{
				id: "2",
				name: "Manager",
				selectedAnimalCategories: [],
				selectedAnimalSubCategories: [],
			},
			{
				id: "3",
				name: "Supervisor",
				selectedAnimalCategories: [],
				selectedAnimalSubCategories: [],
			},
		],
	};

	gotoBack = () => {
		this.props.navigation.goBack();
	};

	gotoAddUserType = () => this.props.navigation.navigate("AddUserType");

	gotoEditUserType = (item) =>
		this.props.navigation.navigate("AddUserType", {
			id: item.id,
			name: item.name,
			selectedAnimalCategories: item.selectedAnimalCategories,
			selectedAnimalSubCategories: item.selectedAnimalSubCategories,
		});

	gotoUsers = () => this.props.navigation.navigate("Users");

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			// onPress={this.gotoUsers}
			onLongPress={this.context.userDetails?.action_types.includes("Edit")? this.gotoEditUserType.bind(this, item) : undefined}
		>
			<View style={globalStyle.row}>
				<View style={[globalStyle.leftPart,globalStyle.p5]}>
					<Text style={[globalStyle.labelName, globalStyle.text_bold]}>{item.name}</Text>
				</View>
				{/* <View style={[globalStyle.rightPart,{padding:5,alignItems:'flex-end'}]}>
					<Ionicons name="chevron-forward" size={18} color="#cecece" />
				</View> */}
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header
				leftIconName={"arrow-back"}
				rightIconName={"add"}
				title={"User Types"}
				leftIconShow={true}
				rightIconShow={true}
				leftButtonFunc={this.gotoBack}
				rightButtonFunc={this.gotoAddUserType}
			/>
			<FlatList
				ListEmptyComponent={() => <ListEmpty />}
				data={this.state.userTypes}
				keyExtractor={(item, index) => item.id.toString()}
				renderItem={this.renderListItem}
				initialNumToRender={this.state.userTypes.length}
				contentContainerStyle={
					this.state.userTypes.length === 0 ? globalStyle.container : null
				}
			/>
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
