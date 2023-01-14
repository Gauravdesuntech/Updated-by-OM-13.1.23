import React from "react";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Alert,
	Modal,
	TextInput,
	Dimensions,
	SafeAreaView
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { isNumber, getFormattedDate } from "../../utils/Util";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { Header, Loader, OverlayLoader, Dropdown, } from "../../component";
import {
	getConsumptionDetails,
	manageConsumption,
	getProducts,
	getStoreNames,
	getTotalAvailableStock,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'
export default class ConsumptionDetails extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			consumptionID:
				typeof props.route.params !== "undefined"
					? props.route.params.consumptionID
					: 0,
			consumptionStatus:
				typeof props.route.params !== "undefined"
					? props.route.params.status
					: "P",
			referenceNo: null,
			consumptionDate: null,
			consumptionItems: [],
			selectedConsumptionItems: [],
			showLoader: false,
			currentItem: [],
			isAddItemModalOpen: false,
			products: [],
			departmentValidationFailed: false,
			itemNameValidationFailed: false,
			storeNameValidationFailed: false,
			batchNoValidationFailed: false,
			quantityValidationFailed: false,
			itemCode: undefined,
			itemAvailableStock: ''
		};
	}

	componentDidMount = () => {
		let { consumptionID, consumptionStatus } = this.state;
		getConsumptionDetails(consumptionID, consumptionStatus)
			.then((data) => {
				if (data !== null) {
					this.setState({
						isLoading: false,
						referenceNo: data.reference_no,
						consumptionDate: data.consumption_date,
						consumptionItems: data.items,
					});
				}
			})
			.catch((error) => console.log(error));
		this.loadData();
	};

	loadData = () => {
		let cid = this.context.userDetails.cid;

		Promise.all([getStoreNames(cid), getProducts({ cid })])
			.then((response) => {
				// if(response[0].length == 1){
				// 	this.setAvailableQuantity(response[0]);
				// }
				this.setState({
					showLoader: false,
					storeNames: response[0],
					products: (response[1] || []).map((v, i) => ({
						id: v.product_code,
						name: v.name,
						unit: v.unit,
						total_stock: v.total_stock,
					})),
					departments: (response[2] || []).map((v, i) => ({
						id: v.id,
						name: v.dept_name,
						dept_code: v.dept_code,
					})),
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ showLoader: false });
			});
	};

	gotoBack = () => this.props.navigation.goBack();

	toggleItemSelect = (id) => {
		let arr = this.state.selectedConsumptionItems;
		if (arr.includes(id)) {
			arr = arr.filter((element) => element !== id);
		} else {
			arr.push(id);
		}

		this.setState({ selectedConsumptionItems: arr });
	};

	submitRequest = (status) => {
		let store_count = 0;
		let { selectedConsumptionItems } = this.state;
		if (selectedConsumptionItems.length > 0) {
			let reqObj = {
				cid: this.context.userDetails.cid,
				consumption_id: this.state.consumptionID,
				reference_no: this.state.referenceNo,
				item_ids: selectedConsumptionItems.join(","),
				status: status,
				consumptionItems: JSON.stringify(this.state.consumptionItems)
			};
			// console.log(this.state.consumptionItems);return;
			this.state.consumptionItems.map((item) => {
				if (!item.hasOwnProperty("store_id")) {
					store_count += 1;
					Alert.alert("Warning", "Please select store.");
					return;
				}
			})
			if (store_count != 0) {
				return;
			}

			this.setState({ showLoader: true });
			manageConsumption(reqObj)
				.then((response) => {
					if (response.check === Configs.SUCCESS_TYPE) {
						this.setState(
							{
								showLoader: false,
							},
							() => {
								this.gotoBack();
							}
						);
					} else {
						console.log(response);
					}
				})
				.catch((error) => console.log(error));
		} else {
			Alert.alert("Warning", "Please select atleast one item.");
		}
	};

	setItemData = (item) => {
		this.setState({
			itemCode: item.id,
			itemName: item.name,
			itemUnit: item.unit,
			itemAvailableStock: item.total_stock,
			storeNameID: item.hasOwnProperty("store_id") ? item.store_id : undefined,
			storeName: undefined,
			batchNo: item.hasOwnProperty('batch_no') ? item.batch_no : 0,
		});
	};

	setAvailableQuantity = (v) => {
		let { itemCode } = this.state;
		if (typeof itemCode !== "undefined") {
			this.setState(
				{
					storeNameID: v.id,
					storeName: v.name,
					batchNo: "",
				},
				() => {
					this.setState({ showLoader: true });
					getTotalAvailableStock(itemCode, v.id)
						.then((data) => {
							this.setState({
								showLoader: false,
								itemAvailableStock: parseFloat(data.total_stock),
							});
						})
						.catch((error) => console.log(error));
				}
			);
		} else {
			Alert.alert("Warning", "Please select an item name");
		}
	};

	addItem = () => {
		this.setState(
			{
				itemNameValidationFailed: false,
				batchNoValidationFailed: false,
				quantityValidationFailed: false,
			},
			() => {
				let {
					itemId,
					itemCode,
					storeNameID,
					itemAvailableStock,
					quantity,
					consumptionItems,
				} = this.state;
				if (typeof itemCode === "undefined") {
					this.setState({ itemNameValidationFailed: true });
					return false;
				} else if (typeof storeNameID === "undefined") {
					this.setState({ storeNameValidationFailed: true });
					return false;
				} else if (
					!isNumber(quantity) ||
					(isNumber(quantity) && parseFloat(quantity) <= 0)
				) {
					this.setState({ quantityValidationFailed: true });
					return false;
				} else if (parseFloat(quantity) > parseFloat(itemAvailableStock)) {
					Alert.alert("Warning", "Insufficient quantity");
				} else {
					let obj = {
						id: itemId,
						product_name: this.state.itemName,
						product_code: this.state.itemCode,
						unit: this.state.itemUnit,
						store_id: this.state.storeNameID,
						batch_no: this.state.batchNo,
						quantity: parseFloat(quantity).toFixed(1),
						status: 'P'
					};

					let index = consumptionItems.findIndex(
						(element) =>
							element.product_code === itemCode
					);

					if (index > -1) {
						consumptionItems[index] = obj;
					}

					this.setState({
						consumptionItems: consumptionItems,
						isAddItemModalOpen: false,
					});
				}
			}
		);
	};


	editHandler = (item) => {
		this.setState({
			isAddItemModalOpen: true,
			currentItem: item,
			itemCode: item.product_code,
			itemName: item.product_name,
			itemUnit: item.unit,
			itemId: item.id,
			storeNameID: undefined,
			storeName: undefined,
			itemAvailableStock: "",
			stockID: undefined,
			batchNo: "",
			batchNoLabel: "",
			quantity: item.quantity,
		})
	}

	closeAddItemModal = () =>
		this.setState({
			isAddItemModalOpen: false,
		});

	render = () => {
		//	console.log("STATE-------->", this.state)
		return (
			<Container>
				<Header title={"Consumption Details"} />
				{this.state.isLoading ? (
					<Loader />
				) : (
					<View style={styles.container}>
						<View style={styles.itemInfoContainer}>
							<View style={ [globalStyle.flexDirectionRow,globalStyle.mb10]}>
								<View style={globalStyle.flex1}>
									<Text style={styles.subText}>Consumption ID</Text>
									<Text style={styles.titleText}>
										{"#" + this.state.consumptionID}
									</Text>
								</View>
								<View style={globalStyle.flex1}>
									<Text style={styles.subText}>Reference No.</Text>
									<Text style={styles.titleText}>{this.state.referenceNo}</Text>
								</View>
							</View>
							<View style={globalStyle.flexDirectionRow}>
								<View style={globalStyle.flex1}>
									<Text style={styles.subText}>Date</Text>
									<Text style={styles.titleText}>
										{moment(this.state.consumptionDate, "YYYY-MM-DD").format(
											"DD/MM/YYYY"
										)}
									</Text>
								</View>
								<View style={globalStyle.flex1}>
									<Text style={styles.subText}>Status</Text>
									<Text
										style={[
											styles.titleText,
											this.state.consumptionStatus === "P"
												? styles.pendingStatus
												: this.state.consumptionStatus === "A"
													? styles.approveStatus
													: styles.rejectStatus,
										]}
									>
										{this.state.consumptionStatus === "P"
											? "Pending"
											: this.state.consumptionStatus === "A"
												? "Approved"
												: "Rejected"}
									</Text>
								</View>
							</View>
						</View>

						<View style={globalStyle.flex1}>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={styles.theadRow}>
									<View style={globalStyle.flex1}>
										<Text style={styles.titleText}>Product Name</Text>
									</View>
									<View style={[globalStyle.flex1,globalStyle.alignItemsCenter]}>
										<Text style={styles.titleText}>Batch No.</Text>
									</View>
									<View style={[globalStyle.flex1,globalStyle.alignItemsFlexEnd]}>
										<Text style={styles.titleText}>Quantity</Text>
									</View>
								</View>
								{(this.state.consumptionItems || []).map((item) => (
									<View key={item.id.toString()} style={styles.tbodyRow}>
										<View style={styles.firstCol}>
											{item.status === "P" ? (
												<TouchableOpacity
													activeOpacity={1}
													style={styles.checkboxContainer}
													onPress={this.toggleItemSelect.bind(this, item.id)}
												>
													<MaterialCommunityIcons
														name={
															this.state.selectedConsumptionItems.includes(
																item.id
															)
																? "checkbox-marked"
																: "checkbox-blank-outline"
														}
														color={Colors.primary}
														size={20}
													/>
												</TouchableOpacity>
											) : null}
											<Text style={styles.subText}>{item.product_name}</Text>
										</View>
										<TouchableOpacity onPress={this.editHandler.bind(this, item)}>
											<View style={[globalStyle.flex1,globalStyle.alignItemsCenter]}>
												<Text style={styles.subText}>
													{item.batch_no !== null ? item.batch_no : "N/A"}
												</Text>
											</View>
										</TouchableOpacity>
										<TouchableOpacity onPress={this.editHandler.bind(this, item)}>
											<View style={[globalStyle.flex1,globalStyle.alignItemsFlexEnd]}>
												<Text style={styles.subText}>
													{item.quantity + " " + item.unit}
												</Text>
											</View>
										</TouchableOpacity>
									</View>
								))}
							</ScrollView>
						</View>

						{this.state.consumptionStatus === "P" ? (
							<View style={styles.btnContainer}>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.approveBtn}
									onPress={this.submitRequest.bind(this, "A")}
								>
									<Text style={styles.btnText}>Issue</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.rejectBtn}
									onPress={this.submitRequest.bind(this, "R")}
								>
									<Text style={styles.btnText}>Reject</Text>
								</TouchableOpacity>
							</View>
						) : null}
					</View>
				)}


				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.isAddItemModalOpen}
					onRequestClose={this.closeAddItemModal}
				>
					<SafeAreaView style={globalStyle.safeAreaViewStyle}>
						<View style={styles.modalOverlay}>
							<View style={styles.itemModalContainer}>
								<View style={styles.itemModalHeader}>
									<TouchableOpacity
										activeOpacity={1}
										style={styles.headerBackBtnContainer}
										onPress={this.closeAddItemModal}
									>
										<Ionicons name="arrow-back" size={25} color={Colors.white} />
									</TouchableOpacity>
									<View style={styles.headerTitleContainer}>
										<Text style={[globalStyle.fontSize20,{color: Colors.white }]}>
											Edit Item
										</Text>
									</View>
								</View>

								<View style={styles.itemModalBody}>
									<Dropdown
										label={"Item:"}
										value={this.state.itemName}
										items={this.state.products}
										onChange={this.setItemData}
										labelStyle={styles.labelName}
										textFieldStyle={styles.textfield}
										style={[
											styles.fieldBox,
											this.state.itemNameValidationFailed
												? styles.errorFieldBox
												: null,
										]}
									/>

									<Dropdown
										label={"Store Name:"}
										placeholder="Select Store Name"
										value={this.state.storeName}
										items={this.state.storeNames}
										onChange={this.setAvailableQuantity}
										labelStyle={styles.labelName}
										textFieldStyle={styles.textfield}
										style={[
											styles.fieldBox,
											this.state.storeNameValidationFailed
												? styles.errorFieldBox
												: null,
										]}
									/>

									<View style={styles.fieldBox}>
										<Text style={styles.labelName}>Batch No.</Text>
										<TextInput
											value={this.state.batchNo}
											onChangeText={(batchNo) => this.setState({ batchNo })}
											style={styles.textfield}
											autoCompleteType="off"
											autoCapitalize="none"
											placeholder="Enter Batch No."
										/>
									</View>

									<View style={styles.fieldBox}>
										<Text style={styles.labelName}>Available Quantity:</Text>
										<TextInput
											editable={false}
											style={styles.textfield}
											value={
												this.state.itemAvailableStock + " " + this.state.itemUnit
											}
										/>
									</View>

									<View
										style={[
											styles.fieldBox,
											this.state.quantityValidationFailed
												? styles.errorFieldBox
												: null,
										]}
									>
										<Text style={styles.labelName}>Quantity:</Text>
										<TextInput
											value={this.state.quantity}
											onChangeText={(quantity) => this.setState({ quantity })}
											style={styles.textfield}
											autoCompleteType="off"
											keyboardType="number-pad"
											placeholder="Enter Quantity"
										/>
									</View>

									<TouchableOpacity style={styles.button} onPress={this.addItem}>
										<Text style={styles.textWhite}>Save</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</SafeAreaView>
				</Modal>

				<OverlayLoader visible={this.state.showLoader} />
			</Container>
		);
	};
}
//const windowWidth = Dimensions.get("screen").width;
//const windowHeight = Dimensions.get("screen").height;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 	},
// 	titleText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 14,
// 		lineHeight: 22,
// 	},
// 	itemInfoContainer: {
// 		height: 120,
// 		padding: 15,
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#eee",
// 	},
// 	pendingStatus: {
// 		color: Colors.warning,
// 	},
// 	approveStatus: {
// 		color: Colors.primary,
// 	},
// 	rejectStatus: {
// 		color: Colors.danger,
// 	},
// 	theadRow: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 8,
// 		paddingVertical: 15,
// 		backgroundColor: Colors.lightGrey,
// 		borderBottomColor: "#ddd",
// 		borderBottomWidth: 1,
// 	},
// 	tbodyRow: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 5,
// 		paddingVertical: 15,
// 		borderBottomColor: "#ddd",
// 		borderBottomWidth: 1,
// 	},
// 	firstCol: {
// 		flex: 1,
// 		flexDirection: "row",
// 		alignItems: "center",
// 	},
// 	checkboxContainer: {
// 		width: 25,
// 		height: 25,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	btnContainer: {
// 		height: 60,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		paddingHorizontal: 8,
// 	},
// 	approveBtn: {
// 		width: 150,
// 		height: 50,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		backgroundColor: Colors.primary,
// 		borderRadius: 4,
// 	},
// 	rejectBtn: {
// 		width: 150,
// 		height: 50,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		backgroundColor: Colors.tomato,
// 		borderRadius: 4,
// 	},
// 	btnText: {
// 		fontSize: 14,
// 		color: "#fff",
// 		fontWeight: "bold",
// 	},
// 	modalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	itemModalContainer: {
// 		flex: 1,
// 		width: windowWidth,
// 		height: windowHeight,
// 		backgroundColor: Colors.lightGrey,
// 	},
// 	itemModalHeader: {
// 		height: 55,
// 		flexDirection: "row",
// 		width: "100%",
// 		backgroundColor: Colors.primary,
// 		elevation: 1,
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 	},
// 	labelName: {
// 		color: Colors.textColor,
// 		lineHeight: 40,
// 		fontSize: 14,
// 		paddingLeft: 4,
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: 40,
		
// 		fontSize: 12,
// 		color: Colors.textColor,
// 		textAlign: "right",
// 		width: "60%",
// 		padding: 5,
// 	},
// 	fieldBox: {
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		height: 50,
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 		// shadowColor: "#999",
// 		// shadowOffset: {
// 		// 	width: 0,
// 		// 	height: 1,
// 		// },
// 		// shadowOpacity: 0.22,
// 		// shadowRadius: 2.22,
// 		// elevation: 3,
// 	},
// 	addItemRow: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		alignItems: "center",
// 		marginVertical: 5,
// 		paddingHorizontal: 5,
// 	},
// 	capsule: {
// 		height: 25,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 10,
// 		paddingBottom: 2,
// 		borderRadius: 50,
// 	},
// 	itemsContainer: {
// 		marginVertical: 5,
// 		paddingHorizontal: 5,
// 	},
// 	itemRow: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		paddingVertical: 5,
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#eee",
// 	},
// 	itemRemoveContainer: {
// 		width: "10%",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	rowTitleText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
// 	},
// 	rowSubText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 12,
// 	},
// 	button: {
// 		alignItems: "center",
// 		backgroundColor: Colors.primary,
// 		padding: 10,
// 		// shadowColor: "#000",
// 		// shadowOffset: {
// 		// 	width: 0,
// 		// 	height: 2,
// 		// },
// 		// shadowOpacity: 0.23,
// 		// shadowRadius: 2.62,
// 		// elevation: 4,
// 		borderRadius: 20,
// 		color: "#fff",
// 		marginVertical: 10,
// 	},
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 	},
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// });
