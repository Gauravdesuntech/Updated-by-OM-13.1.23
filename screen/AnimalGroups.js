import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	Image,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Header, ListEmpty, Loader, AnimalSearchModal } from "../component";
import { Colors, Configs } from "../config";
import AppContext from "../context/AppContext";
import { getAnimalGroups } from "../services/APIServices";
import { fetchProfile } from "../services/UserManagementServices";
import { capitalize } from "../utils/Util";
import globalStyles from "../config/Styles";
import styles from './Styles'


export default class AnimalGroups extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			animalGroups: [],
			stats: null,
			userActionTypes: null
		};
		this.searchModalRef = React.createRef();
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
				animalGroups: [],
			},
			() => {
				this.loadAnimalGroups();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadAnimalGroups = () => {
		let cid = this.context.userDetails.cid;
		let userid = this.context.userDetails.id;
		Promise.all([getAnimalGroups(cid), fetchProfile({ userid })])
			.then((data) => {
				this.setState({
					isLoading: false,
					animalGroups: data[0],
				});
				this.context.setUserData(data[1].data);
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadAnimalGroups();
			}
		);
	};

	openSearchModal = () => this.searchModalRef.current.openModal();

	gotoCategory = (item) => {
		this.props.navigation.navigate("Category", {
			classID: item.id,
			className: item.group_name,
			enableAddButton: false,
		});
	};

	gotoEditGroup = (item) => {
		this.props.navigation.navigate("Add Group", {
			id: item.id,
			imageURI: item.image,
			groupName: item.group_name,
			groupDetails: item.group_details !== null ? item.group_details : "",
		});
	};

	checkAddActionPermissions = () => {
		if (this.state.isLoading == false) {
			if (this.context.userDetails.action_types.includes("Add")) {
				return this.openSearchModal;
			} else {
				return undefined
			}
		} else {
			return undefined
		}
	}

	checkEditActionPermissions = (item) => {
		if (this.context.userDetails.action_types.includes("Edit")) {
			this.gotoEditGroup(item)
		}
	}

	renderListItem = ({ item }) => {
		return (
			<TouchableHighlight
				underlayColor={"#eee"}
				onPress={this.gotoCategory.bind(this, item)}
				onLongPress={this.checkEditActionPermissions.bind(this, item)}
			>
				<View style={styles.view}>
					<View style={[globalStyles.justifyContentCenter,{ width: "20%" }]}>
						<Image
							style={styles.image}
							source={{ uri: item.image }}
							resizeMode="contain"
						/>
					</View>
					<View style={[globalStyles.justifyContentCenter,globalStyles.flex1
					]}>
						<Text style={styles.name}>{capitalize(item.group_name)}</Text>
						{/* <Text style={[styles.name,{fontSize: 12}]}>{`M - ${item.total_male_animal}, F - ${item.total_female_animal}`}</Text> */}
					</View>
					{this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?
						(
							<View
								style={{
									flexDirection: "row",
									justifyContent: "flex-end",
									alignItems: "center",
								}}
							>
								<View style={styles.qtyContainer}>
									<Text style={styles.qty}>{item.total_animal}</Text>
								</View>
								{/* <Ionicons name="chevron-forward" style={styles.iconStyle} /> */}
							</View>
						)
						: null}

				</View>
			</TouchableHighlight>
		)
	};

	gotoAddGroup = () => {
		this.props.navigation.navigate("Add Group");
	};

	render = () => (
		<Container>
			<Header
				title={"Animal Class"}
				showScanButton={this.state.isLoading ? undefined : true}
				searchAction={this.state.isLoading ? undefined : this.openSearchModal}
				addAction={this.checkAddActionPermissions()}
			/>
			{/* {this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.animalGroups}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.animalGroups.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.animalGroups.length === 0 ? styles.container : null
					}
				/>
			)} */}
			<AnimalSearchModal
				ref={this.searchModalRef}
				navigation={this.props.navigation}
			/>
		</Container>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 	},
// 	view: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 3,
// 	},
// 	image: {
// 		width: 55,
// 		height: 55,
// 	},
// 	name: {
// 		fontSize: 18,
// 		color: Colors.textColor,
// 	},
// 	qtyContainer: {
// 		height: 35,
// 		width: 35,
// 		borderRadius: 100,
// 		backgroundColor: Colors.primary,
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	qty: {
// 		fontSize: 14,
// 		color: "#FFF",
// 	},
// 	iconStyle: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},
// });
