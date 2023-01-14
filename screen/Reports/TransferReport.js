import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableHighlight,
	FlatList,
	ScrollView,
	TextInput,
    Dimensions,
    Modal,
    TouchableOpacity
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import Base64 from "../../config/Base64";
import { Header,  ListEmpty, OverlayLoader } from "../../component";
import {
	getConfirmedEnclosureChangeHistory,
} from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";

export default class TransferReport extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			showLoader: false,
			data: [],
            isSearchModalOpen: false,
            searchValue: "",
			searchData: [],
		};

        this.searchInput = React.createRef();
	}

	componentDidMount = () => {
		this.subscribe = this.props.navigation.addListener('focus',()=>{
			this.setState({showLoader: true},()=>{this.fetchData()});
		})	
	};

	fetchData = () => {
		let cid = this.context.userDetails.cid;
		let user_id = this.context.userDetails.id;
		getConfirmedEnclosureChangeHistory(user_id)
			.then((res) => {
				this.setState({
					data: res,
					showLoader: false,
				})
			})
			.catch((err) => { console.log(err) })
	}

	componentWillUnmount = () => {
		this.subscribe();
	}

    openSearchModal = () => {
		this.setState({
			isSearchModalOpen: true,
			searchValue: "",
			searchData: [],
		});

		setTimeout(() => {
			this.searchInput.current.focus();
		}, 500);
	};

	closeSearchModal = () => {
		this.setState({
			isSearchModalOpen: false,
			searchValue: "",
			searchData: [],
		});
	};

	searchProduct = () => {
		let { searchValue, data } = this.state;

		let result = data.filter((element) => {
			let name = element.animal_id.toLowerCase();
			let index = name.indexOf(searchValue.toLowerCase());
			return index > -1;
		});

		this.setState({ searchData: result });
	};

	gotoBack = () => this.props.navigation.goBack();

	gotoChangeEnclosure = () => this.props.navigation.navigate("ChangeEnclosure");

	goToDetails = (item) => this.props.navigation.navigate("ViewChangeEnclosure",{item: item});

    renderSearchListItem = ({ item }) => (
		<TouchableHighlight underlayColor={"#eee"} onPress={this.goToDetails.bind(this,item)}>
			<View style={globalStyles.row}>
				<View style={globalStyles.leftPart}>
					<Text style={[globalStyles.labelName,globalStyles.pd0,globalStyles.no_bg_color,globalStyles.text_bold]}>{`#${item.request_number}`}</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>{"Animals : " + item.animal_id}</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Requested By: " + item.changed_by_name}
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Reason: " + item.change_reason}
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Status: " + item.status}
					</Text>
				</View>
				<View style={globalStyles.rightPart}>
					<View style={globalStyles.rightPartStock}>
						<Ionicons name="chevron-forward" style={globalStyles.iconStyle} />
					</View>
				</View>
			</View>
		</TouchableHighlight>
	);

	renderListItem = ({ item }) => (
		<TouchableHighlight underlayColor={"#eee"} onPress={this.goToDetails.bind(this,item)}>
			<View style={globalStyles.row}>
				<View style={globalStyles.leftPart}>
					<Text style={[globalStyles.labelName,globalStyles.pd0,globalStyles.no_bg_color,globalStyles.text_bold]}>{`#${item.request_number}`}</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>{"Animals : " + item.animal_id}</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Requested By: " + item.changed_by_name}
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Reason: " + item.change_reason}
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Status: " + item.status}
					</Text>
				</View>
				<View style={globalStyles.rightPart}>
					<View style={globalStyles.rightPartStock}>
						<Ionicons name="chevron-forward" style={globalStyles.iconStyle} />
					</View>
				</View>
			</View>
		</TouchableHighlight>
	);

	checkAddActionPermissions = () => {
		if( this.context.userDetails.action_types.includes("Add") ) {
			return this.gotoChangeEnclosure;
		} else {
			return undefined
		}
	}
	
	render = () => (
		<Container>
			<Header
				title={"Death Report"}
				searchAction={this.state.isLoading ? undefined : this.openSearchModal}
			/>
			<View style={globalStyles.container}>
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.data}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.data.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.data.length === 0 ? globalStyles.container : null
					}
				/>
			</View>
              {/*Search Modal*/}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isSearchModalOpen}
				onRequestClose={this.closeSearchModal}
			>
				<View style={globalStyles.searchModalOverlay}>
					<View style={globalStyles.seacrhModalContainer}>
						<View style={globalStyles.searchModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={globalStyles.searchBackBtn}
								onPress={this.closeSearchModal}
							>
								<Ionicons name="arrow-back" size={25} color={Colors.white} />
							</TouchableOpacity>

							<View style={globalStyles.searchContainer}>
								<View style={globalStyles.searchFieldBox}>
									<Ionicons name="search" size={24} color={Colors.white} />
									<TextInput
										ref={this.searchInput}
										value={this.state.searchValue}
										onChangeText={(searchValue) =>
											this.setState(
												{
													searchValue: searchValue,
												},
												() => {
													this.searchProduct();
												}
											)
										}
										autoCompleteType="off"
										placeholder="Search"
										placeholderTextColor={Colors.white}
										style={globalStyles.searchField}
									/>
								</View>
							</View>
						</View>

						<View style={globalStyles.searchModalBody}>
							{this.state.searchValue.trim().length > 0 ? (
								<FlatList
									data={this.state.searchData}
									keyExtractor={(item, index) => item.id.toString()}
									renderItem={this.renderSearchListItem}
									initialNumToRender={this.state.searchData.length}
									keyboardShouldPersistTaps="handled"
									ListEmptyComponent={() => (
										<Text
											style={[ globalStyles.detailText,globalStyles.marginTop10,{color: Colors.textColor}]}
										>
											No Result Found
										</Text>
									)}
								/>
							) : null}
						</View>
					</View>
				</View>
			</Modal>      
			<OverlayLoader visible={this.state.showLoader} />
		</Container>
	);
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// const globalStyles = StyleSheet.create({
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
// 		justifyContent: "center",
// 	},
// 	rightPartStock: {
// 		flexDirection: 'row',
// 		justifyContent: 'flex-end',
// 		alignItems: 'center',
// 		flex: 1 / 2
// 	},
// 	rightPartButton: {
// 		padding: 5,
// 		alignItems: 'center',
// 		backgroundColor: Colors.primary,
// 		borderRadius: 3
// 	},
// 	rightPartButtonText: {
// 		color: Colors.white
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
//     searchModalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	seacrhModalContainer: {
// 		flex: 1,
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 		elevation: 5,
// 	},
// 	searchModalHeader: {
// 		height: 55,
// 		width: "100%",
// 		elevation: 5,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 		backgroundColor: Colors.primary,
// 	},
// 	searchBackBtn: {
// 		width: "10%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchContainer: {
// 		width: "90%",
// 		flexDirection: "row",
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchFieldBox: {
// 		width: "100%",
// 		height: 40,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		backgroundColor: "rgba(0,0,0, 0.1)",
// 		borderRadius: 50,
// 	},
// 	searchField: {
// 		width: "90%",
// 		padding: 5,
// 		color: Colors.white,
// 		fontSize: 15,
// 	},
// 	searchModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 	},
// });
