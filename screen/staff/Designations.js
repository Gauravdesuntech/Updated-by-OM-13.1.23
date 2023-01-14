import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	SectionList,
	RefreshControl,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getDesignations, getDesignationsbySections } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class Designations extends React.Component {
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
			isLoading: true,
			designations: [],
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
				designations: [],
			},
			() => {
				this.loadDesignations();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadDesignations = () => {
		let reqObj = {
			cid: this.context.userDetails.cid,
		};

		if(typeof this.state.deptCode !== 'undefined'){
			reqObj.dept_code= this.state.deptCode
		}

		getDesignationsbySections(reqObj)
			.then((data) => {
			let dataArr = [];
            for (let key in data) {
              dataArr.push({ title: key, data: data[key] });
            }
				this.setState({
					isLoading: false,
					designations: dataArr,
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
				this.loadDesignations();
			}
		);
	};

	gotoAddDesignation = () =>
		this.props.navigation.navigate("AddDesignation", {
			deptCode: this.state.deptCode,
		});

	gotoEditDesignation = (item) =>
		this.props.navigation.navigate("AddDesignation", {
			id: item.id,
			deptCode: item.dept_code,
			deptName: item.dept_name,
			name: item.desg_name,
			selectedAnimalClass: item.animal_class,
		});

	gotoUsers = (item) =>
		this.props.navigation.navigate("Users", {
			deptCode: this.state.deptCode,
			deptName: this.state.deptName,
			desgCode: item.desg_code,
			desgName: item.desg_name,
		});

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			// onPress={this.gotoUsers.bind(this, item)}
			onLongPress={this.context.userDetails?.action_types.includes("Edit")? this.gotoEditDesignation.bind(this, item) : undefined}
		>
			<View style={styles.row}>
				<View style={[styles.leftPart,{padding:5}]}>
					<Text style={[styles.labelName, styles.text_bold]}>{item.desg_name}</Text>
				</View>
				{/* <View style={[styles.rightPart,{padding:5,alignItems:'flex-end'}]}>
					<Ionicons name="chevron-forward" size={18} color="#cecece" />
				</View> */}
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header title={"Designations"} addAction={this.context.userDetails?.action_types.includes("Add")? this.gotoAddDesignation : undefined} />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<SectionList
                    sections={this.state.designations}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderListItem}
                    contentContainerStyle={
                      this.state.designations.length === 0 ? styles.container : null
                    }
                    ListEmptyComponent={() => <ListEmpty />}
                    stickySectionHeadersEnabled
                    renderSectionHeader={({ section: { title } }) => {
                      return (
                        <View style={styles.sectionHeader}>
                          <View style={styles.sectionHeaderRight}>
                            <Text style={{ fontSize: 16, color: Colors.white }}>
                              {title}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this.handelRefresh}
                      />
                    }
                  />
				// <FlatList
				// 	ListEmptyComponent={() => <ListEmpty />}
				// 	data={this.state.designations}
				// 	keyExtractor={(item, index) => item.id.toString()}
				// 	renderItem={this.renderListItem}
				// 	initialNumToRender={this.state.designations.length}
				// 	refreshing={this.state.isLoading}
				// 	onRefresh={this.handelRefresh}
				// 	contentContainerStyle={
				// 		this.state.designations.length === 0 ? styles.container : null
				// 	}
				// />
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
