import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	TouchableOpacity,
	Alert,
	Modal,
	TextInput,
	Dimensions
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import {
	getDeathreports,
	getItemTypes,
	getLowStockProducts,
	generateExcel,
	addRequestPurchase,
	getRequestDetails
} from "../../services/ReportsServices";
import AppContext from "../../context/AppContext";
import Config from '../../config/Configs';
import * as WebBrowser from 'expo-web-browser';
import { getFormattedDate, convertDate } from "../../utils/Util";
import DownloadFile from "../../component/DownloadFile";
import globalStyles from "../../config/Styles";

const priorityExtra = { id: 'all', name: 'All' };

const DATA = [
    {
        id: 1,
        name: 'Sun Conure',
        date: '17.05.2022',
        reason: 'Death by natural cause post mortem done but no proper reason found'
    },
    {
        id: 2,
        name: 'Red-Tailed Amazon',
        date: '14.05.2022',
        reason: 'Death by sickness'
    }
];

export default class DeathReport extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			selectedMenuItem: "All",
			menuItems: [],
			products: [],
			priority: [priorityExtra, ...Config.ITEM_PRIORITIES],
			selectedPriorityItem: undefined,
			modalVisible: false,
			orderQuestionModalVisible: false,
			orderEdit: false,
			reOrderWarning: false,
			prevRequestData: [],
			requestingItem: [],
			orderQuantity: 0,
			isSearchModalOpen: false,
			searchValue: "",
			searchData: [],
			downloadUrl:"",
			isModalOpen:false,
			// itemType : props.route.params.itemType
		};

		this.searchInput = React.createRef();
	}

	componentDidMount() {
		let cid = this.context.userDetails.cid;
		getDeathreports(cid)
			.then((data) => {
				console.log(data)
				this.setState({ products: data, isLoading: false });
			})
			.catch((error) => console.log(error));
	}


	getRequestDetails = (item) => {
		let cid = this.context.userDetails.cid;
		item['cid'] = cid;
		item['created_by'] = this.context.userDetails.user_code;
		this.setState({
			requestingItem: item,
			isLoading: true
		})
		getRequestDetails(item)
			.then((response) => {
				if (response.type == 'fetch') {
					if (response.msg == 'Success') {
						this.setState({
							prevRequestData: response.data,
							isLoading: false
						}, () => { this.setModalVisible(true) })
					}
				}
				if (response.type == 'already_requested') {
					this.setState({
						prevRequestData: response.data,
						isLoading: false
					}, () => { this.setReorderWarning(true) })
				}
				if (response.type == 'insert') {
					this.setState({
						isLoading: false,
					}, () => { Alert.alert(response.check, response.message); })
				}
			})
			.catch((error) => { console.log(error) })
	}

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible, reOrderWarning: false });
	}

	setReorderWarning = (visible) => {
		this.setState({ reOrderWarning: visible });
	}

	showOrderEditQuestion = (visible) => {
		this.setState({ orderQuestionModalVisible: visible, modalVisible: false, reOrderWarning: false });
	}

	showOrderEdit = (visible) => {
		this.setState({ orderEdit: visible, orderQuestionModalVisible: false, modalVisible: false, reOrderWarning: false });
	}

	loadProducts = (itemType, priority) => {
		let params = { cid: this.context.userDetails.cid };
		if (typeof itemType !== "undefined") {
			params["type"] = itemType;
		}

		if (typeof priority !== "undefined") {
			if (priority === 'all') {
				params["priority"] = 'all';
			} else {
				params["priority"] = priority;
			}
		}


		getLowStockProducts(params)
			.then((data) => {
				this.setState({
					isLoading: false,
					// products: data,
                    products: DATA
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
				this.loadProducts();
			}
		);
	};

	onMenuItemChange = (type) => {
		this.setState(
			{
				isLoading: true,
				selectedMenuItem: type,
			},
			() => {
				this.loadProducts(type, this.state.selectedPriorityItem);
			}
		);
	};

	onPriorityItemChange = (type) => {
		this.setState(
			{
				isLoading: true,
				selectedPriorityItem: type,
			},
			() => {
				this.loadProducts(this.state.selectedMenuItem, type);
			}
		);
	};

	// Generate Excel And Save on device
	exportProducts = () => {
		let params = { cid: this.context.userDetails.cid };
		let itemType = this.state.selectedMenuItem;
		let priority = this.state.selectedPriorityItem;
		if (typeof itemType !== "undefined") {
			params["type"] = itemType;
		}

		if (typeof priority !== "undefined") {
			if (priority === 'all') {
				params["priority"] = 'all';
			} else {
				params["priority"] = priority;
			}
		}


		generateExcel(params)
		.then((response) => {
			let data = response.data;
			this.setState(
				{
					downloadUrl: data.fileuri,
					isModalOpen: true,
				});
		})
			.catch((error) => console.log(error));
	};

	closeModal = () =>
	this.setState({
		isModalOpen: false,
	});

	changeOrderQuanity = (val) => {
		let item = this.state.requestingItem;
		item.orderQuantity = val;
		this.setState({
			requestingItem: item,
			orderQuantity: val
		});
	}

	addToPurchaseRequest = () => {
		let cid = this.context.userDetails.cid;
		let item = this.state.requestingItem;
		item.cid = cid;
		item.created_by = this.context.userDetails.user_code;
		this.setState(
			{
				isLoading: true,
				modalVisible: false,
				orderQuestionModalVisible: false,
				orderEdit: false,
			},
			() => {
				addRequestPurchase(item)
					.then((response) => {
						this.setState({
							isLoading: false,
						}, () => { Alert.alert(response.check, response.message); })
					})
					.catch((error) => console.log(error));
				this.setState({
					isLoading: false,
				})
			}
		);
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
		let { searchValue, products } = this.state;

		let data = products.filter((element) => {
			let name = element.english_name.toLowerCase();
			let index = name.indexOf(searchValue.toLowerCase());
			return index > -1;
		});

		this.setState({ searchData: data });
	};


	renderSearchListItem = ({ item }) => (
		<TouchableHighlight underlayColor={"#eee"}>
			<View style={globalStyles.row}>
				<View style={globalStyles.leftPart}>
					<Text style={[globalStyles.labelName,globalStyles.pd0,globalStyles.no_bg_color,globalStyles.text_bold]}>
					{item.english_name}
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
					{"Date: " + item.date}
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Reason: " + item.animal_dead_reason}
					</Text>
					{/* <Text style={globalStyles.subText}>
						{"Reorder Level: " + item.reorder_level + " " + item.unit}
					</Text> */}
				</View>
				<View style={globalStyles.rightPart}>
					{/* <View style={globalStyles.rightPartStock}>
						<View style={globalStyles.qtyBox}>
							<Text style={globalStyles.qtyText}>
								{item.total_stock + " " + item.unit}
							</Text>
						</View>
						<Ionicons name="chevron-forward" style={globalStyles.iconStyle} />
					</View> */}
					{/* <View >
						<TouchableOpacity style={globalStyles.rightPartButton}
							onPress={this.getRequestDetails.bind(this, item)}
						>
							<Text style={globalStyles.rightPartButtonText}>{'Add Request'}</Text>
						</TouchableOpacity>
					</View> */}
				</View>
			</View>
		</TouchableHighlight>
	);



	renderListItem = ({ item }) => (
		<TouchableHighlight underlayColor={"#eee"}>
			<View style={globalStyles.row}>
				<View style={globalStyles.leftPart}>
					<Text style={[globalStyles.labelName,globalStyles.pd0,globalStyles.no_bg_color,globalStyles.text_bold]}>
					{item.english_name}
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
					{"Animal ID: " + item.animal_id }
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
					{"Date: " + getFormattedDate(convertDate(item.animal_dead_date),'DD/MM/YYYY') }
					</Text>
					<Text style={[globalStyles.textfield,globalStyles.no_bg_color,globalStyles.pd0]}>
						{"Reason: " + item.animal_dead_reason}
					</Text>
					{/* <Text style={globalStyles.subText}>
						{"Reorder Level: " + item.reorder_level + " " + item.unit}
					</Text> */}
				</View>
				<View style={globalStyles.rightPart}>
					{/* <View style={globalStyles.rightPartStock}>
						<View style={globalStyles.qtyBox}>
							<Text style={globalStyles.qtyText}>
								{item.total_stock + " " + item.unit}
							</Text>
						</View>
						<Ionicons name="chevron-forward" style={globalStyles.iconStyle} />
					</View> */}
					{/* <View >
						<TouchableOpacity style={globalStyles.rightPartButton}
							onPress={this.getRequestDetails.bind(this, item)}
						>
							<Text style={globalStyles.rightPartButtonText}>{'Add Request'}</Text>
						</TouchableOpacity>
					</View> */}
				</View>
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header
				title={"Death Report"}
				selectedMenuItem={this.state.selectedMenuItem}
				menuItems={this.state.menuItems}
				onMenuItemChange={this.onMenuItemChange}

				selectedPriorityItem={this.state.selectedPriorityItem}
				priorityItems={this.state.priority}
				onPriorityItemChange={this.onPriorityItemChange}

				exportProducts={this.exportProducts}
				searchAction={this.state.isLoading ? undefined : this.openSearchModal}
			/>
			<View style={globalStyles.container}>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.products}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.products.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.products.length === 0 ? globalStyles.container : null
					}
				/>
			)}

			{/* Modal for download file */}
			 
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isModalOpen}
				onRequestClose={this.closeModal}
			>
				<View style={globalStyles.container}>
					<View style={globalStyles.modalBody}>
						<DownloadFile
							url={this.state.downloadUrl}
							viewStyle={globalStyles.downloadBtn}
							textStyle={[globalStyles.fontSize16,globalStyles.marginHorizontal5]}
							design={<AntDesign name="download" size={20} />}
							text={"Download"}
						/>
						<TouchableOpacity
							activeOpacity={1}
							style={globalStyles.closerBtn}
							onPress={this.closeModal}
						>
							<Text style={globalStyles.closeBtnText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/*Search Modal*/}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isSearchModalOpen}
				onRequestClose={this.closeSearchModal}
			>
				<View style={[globalStyles.searchModalOverlay]}>
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
											style={[ globalStyles.detailText ,globalStyles.marginTop10,{
												color: Colors.textColor}]}
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
			</View>
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
// 		justifyContent: 'space-between',
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
// 	//Modal Style
// 	textStyle: {
// 		color: "white",
// 		fontWeight: "bold",
// 		textAlign: "center"
// 	},
// 	modalText: {
// 		marginBottom: 15,
// 		textAlign: "center"
// 	},
// 	detailText: {
// 		textAlign: "center"
// 	},
// 	detailsContainer: {
// 		marginBottom: 8
// 	},
// 	centeredView: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		marginTop: 22
// 	},
// 	modalView: {
// 		margin: 20,
// 		backgroundColor: "white",
// 		borderRadius: 20,
// 		padding: 35,
// 		alignItems: "center",
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 2
// 		},
// 		shadowOpacity: 0.25,
// 		shadowRadius: 4,
// 		elevation: 5
// 	},
// 	input: {
// 		height: 40,
// 		margin: 12,
// 		borderWidth: 1,
// 		padding: 10,
// 		borderColor: Colors.mediumGrey
// 	},
// 	btn: {
// 		width: 100,
// 		height: 30,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		borderRadius: 3,
// 		marginBottom: 5
// 	},
// 	btnExtra: {
// 		width: 130,
// 		height: 50,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		borderRadius: 3,
// 		marginBottom: 5
// 	},
// 	btnDanger: {
// 		backgroundColor: Colors.danger,
// 	},
// 	btnSuccess: {
// 		backgroundColor: Colors.success,
// 	},
// 	btnText: { color: Colors.white },
// 	searchModalOverlay: {
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
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0, 0, 0, 0.5)",
// 	},
// 	closerBtn: {
// 		top:20,
// 		bottom: 10,
// 		padding: 10
// 	},
// 	closeBtnText: {
// 		fontSize: 16,
// 		fontWeight: "bold",
// 		color: Colors.tomato,
// 	},
// 	modalBody: {
// 		alignItems: "center",
// 		justifyContent: "center",
// 		backgroundColor: Colors.white,
// 		width: Math.floor((windowWidth * 60) / 100),
// 		minHeight: Math.floor(windowHeight / 5),
// 		padding: 15,
// 		borderRadius: 3,
// 		elevation: 5,
// 	},
// 	downloadBtn: {
// 		flexDirection: "row",
// 		paddingHorizontal: 20,
// 		paddingVertical: 8,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
// 	},

// });
