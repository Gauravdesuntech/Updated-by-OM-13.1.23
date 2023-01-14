import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	Dimensions,
	TextInput,
	Image,
	ScrollView,
	Alert,
} from "react-native";
import moment from "moment";
import { Container, Tab, Tabs } from "native-base";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import {
	Header,
	Dropdown,
	DatePicker,
	Loader,
	OverlayLoader,
} from "../../component";
import {
	getProductDetails,
	getProductAvailableStocks,
	getStockTransactions,
	addStock,
	reduceStock,
	getStoreNames,
	getTotalAvailableStock,
} from "../../services/InventoryManagmentServices";
import { isNumber, getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class ItemDetails extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			productID:
				typeof props.route.params !== "undefined"
					? props.route.params.productID
					: undefined,
			productCode:
				typeof props.route.params !== "undefined"
					? props.route.params.productCode
					: undefined,
			hideEdit: props.route.params.hideEdit ?? false,
			productName: "",
			purchasePrice: 0,
			salesPrice: 0,
			gst: 0,
			unit: "",
			hsnCode: "",
			imageURI: undefined,
			currentStock: 0,
			updatedStock: 0,
			availableStock: 0,
			reduceUpdateStock: 0,
			date: new Date(),
			quantity: "",
			batchNo: "",
			expiryDate: new Date(),
			storeNameID: undefined,
			storeName: undefined,
			isAddStockModalOpen: false,
			isReduceStockModalOpen: false,
			isDatepickerOpen: false,
			isExpiryDatepickerOpen: false,
			quantityValidationFailed: false,
			storeNameValidationFailed: false,
			isLoading: true,
			showLoader: false,
			storeNames: [],
			transaction: [],
			availableStocks: [],
		};
	}

	componentDidMount = () => {
		let { productCode } = this.state;
		let cid = this.context.userDetails.cid;

		Promise.all([
			getProductDetails(productCode),
			getProductAvailableStocks(productCode),
			getStockTransactions(productCode),
			getStoreNames(cid),
		])
			.then((response) => {
				let data = response[0];
				this.setState({
					productName: data.name,
					purchasePrice: data.purchase_price,
					salesPrice: data.sales_price,
					gst: data.gst,
					unit: data.unit,
					hsnCode: data.hsn !== null ? data.hsn : "N/A",
					imageURI: data.image,
					currentStock: data.total_stock,
					availableStocks: response[1],
					transaction: response[2],
					storeNames: response[3],
					isLoading: false,
				});
			})
			.catch((error) => console.log(error));
	};

	setStoreName = (v) => {
		this.setState({
			storeNameID: v.id,
			storeName: v.name,
		});
	};

	setAvailableStock = (v) => {
		this.setState(
			{
				storeNameID: v.id,
				storeName: v.name,
				reduceUpdateStock: 0,
				quantity: "",
				batchNo: "",
			},
			() => {
				this.setState({ showLoader: true });
				let { productCode } = this.state;
				getTotalAvailableStock(productCode, v.id)
					.then((data) => {
						this.setState({
							showLoader: false,
							availableStock: parseFloat(data.total_stock),
						});
					})
					.catch((error) => console.log(error));
			}
		);
	};

	openAddStcokModal = () =>
		this.setState({
			isAddStockModalOpen: true,
			updatedStock: 0,
			quantity: "",
			batchNo: "",
			storeNameID: undefined,
			storeName: undefined,
			quantityValidationFailed: false,
			storeNameValidationFailed: false,
		});

	closeAddStockModal = () =>
		this.setState({
			isAddStockModalOpen: false,
		});

	openReduceStockModal = () =>
		this.setState({
			isReduceStockModalOpen: true,
			availableStock: this.state.currentStock,
			reduceUpdateStock: 0,
			quantity: "",
			batchNo: "",
			storeNameID: undefined,
			storeName: undefined,
			quantityValidationFailed: false,
			storeNameValidationFailed: false,
		});

	closeReduceStockModal = () =>
		this.setState({
			isReduceStockModalOpen: false,
		});

	increaseStock = () => {
		let { currentStock, quantity } = this.state;
		let updatedStock = 0;

		if (
			quantity.trim().length === 0 ||
			isNaN(quantity) ||
			parseInt(quantity) <= 0
		) {
			updatedStock = 0;
		} else {
			updatedStock = parseFloat(currentStock) + parseFloat(quantity);
		}

		this.setState({ updatedStock });
	};

	decreaseStock = () => {
		let { availableStock, quantity } = this.state;
		let updatedStock = 0;

		if (
			quantity.trim().length === 0 ||
			isNaN(quantity) ||
			parseInt(quantity) <= 0
		) {
			updatedStock = 0;
		} else {
			updatedStock = parseFloat(availableStock) - parseFloat(quantity);
		}

		this.setState({ reduceUpdateStock: updatedStock });
	};

	showDatepicker = () => this.setState({ isDatepickerOpen: true });


	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.date;
		this.setState({
			isDatepickerOpen: false,
			date: currentDate,
		});
	};

	showDatePicker = () => {
		this.setState({ isExpiryDatepickerOpen: true });
	  };
	
	  handleConfirm = (selectDate) => {
		let currentDate = selectDate || this.state.purchaseOrderDate;
		this.setState({
			isExpiryDatepickerOpen: false,
			expiryDate: currentDate,
		});
		this.hideDatePicker();
	  };
	
	  hideDatePicker = () => {
		this.setState({ isExpiryDatepickerOpen: false });
	  };

	getStockValue = () => {
		let { currentStock, purchasePrice } = this.state;
		let amt = parseFloat(purchasePrice) * parseFloat(currentStock);
		return amt.toFixed(2);
	};

	addProductStock = () => {
		this.setState(
			{
				quantityValidationFailed: false,
				storeNameValidationFailed: false,
			},
			() => {
				let { quantity, batchNo, expiryDate, currentStock, storeNameID } =
					this.state;
				if (!isNumber(quantity)) {
					this.setState({ quantityValidationFailed: true });
					return false;
				} else if (typeof storeNameID === "undefined") {
					this.setState({ storeNameValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let reqObj = {
						cid: this.context.userDetails.cid,
						product_code: this.state.productCode,
						store_id: storeNameID,
						unit: this.state.unit,
						purchase_price: this.state.purchasePrice,
						batch_no: batchNo.trim(),
						expiry_date:
							expiryDate !== null ? getFormattedDate(expiryDate) : "",
						quantity: quantity,
					};

					addStock(reqObj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								let updatedStock =
									parseFloat(currentStock) + parseFloat(reqObj.quantity);

								let txnData = this.state.transaction;
								txnData.push({
									id: new Date().getTime(),
									batch_no: reqObj.batch_no.length > 0 ? reqObj.batch_no : null,
									quantity: parseFloat(reqObj.quantity).toFixed(1),
									description: "Add Stock",
									txn_type: "CR",
									txn_date: moment().format("YYYY-MM-DD HH:mm:ss"),
								});

								this.setState({
									currentStock: updatedStock.toFixed(1),
									transaction: txnData,
									showLoader: false,
									isAddStockModalOpen: false,
								});
							} else {
								Alert.alert("Something went wrong!");
							}
						})
						.catch((error) => {
							this.setState({ showLoader: false });
							console.log(error);
						});
				}
			}
		);
	};

	reduceProductStock = () => {
		this.setState(
			{
				quantityValidationFailed: false,
				storeNameValidationFailed: false,
			},
			() => {
				let { quantity, batchNo, availableStock, currentStock, storeNameID } =
					this.state;
				if (typeof storeNameID === "undefined") {
					this.setState({ storeNameValidationFailed: true });
					return false;
				} else if (!isNumber(quantity)) {
					this.setState({ quantityValidationFailed: true });
					return false;
				} else if (parseFloat(quantity) > parseFloat(availableStock)) {
					Alert.alert("Warning", "Insufficient stock");
					return false;
				} else {
					this.setState({ showLoader: true });
					let reqObj = {
						cid: this.context.userDetails.cid,
						product_code: this.state.productCode,
						store_id: storeNameID,
						batch_no: batchNo.trim(),
						quantity: quantity,
					};

					reduceStock(reqObj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								let updatedStock =
									parseFloat(currentStock) - parseFloat(reqObj.quantity);

								let txnData = this.state.transaction;
								txnData.push({
									id: new Date().getTime(),
									batch_no: reqObj.batch_no.length > 0 ? reqObj.batch_no : null,
									quantity: parseFloat(reqObj.quantity).toFixed(1),
									description: "Reduce Stock",
									txn_type: "DR",
									txn_date: moment().format("YYYY-MM-DD HH:mm:ss"),
								});

								this.setState({
									currentStock: updatedStock.toFixed(1),
									transaction: txnData,
									showLoader: false,
									isReduceStockModalOpen: false,
								});
							} else {
								this.setState({ showLoader: false });
								Alert.alert(response.message);
							}
						})
						.catch((error) => {
							this.setState({ showLoader: false });
							console.log(error);
						});
				}
			}
		);
	};

	gotoEditItem = () =>
		this.props.navigation.navigate("EditItem", {
			productID: this.state.productID,
			productCode: this.state.productCode,
		});

	render = () => {
		let finanlStock = 0;
		return (
			<Container>
				<Header title={"Item Details"} />
				{this.state.isLoading ? (
					<Loader />
				) : (
					<View style={styles.container}>
						{!this.state.hideEdit ? (
							<View style={styles.itemTitleContainer}>
								<Text style={styles.headingText}>{this.state.productName}</Text>
								{this.context.userDetails.action_types.includes('Edit') ?
									<View style={[globalStyle.flexDirectionRow,globalStyle.mt10]}>
										<TouchableOpacity
											onPress={this.openAddStcokModal}
											style={[styles.capsule, { backgroundColor: Colors.primary }]}
										>
											<FontAwesome
												name="plus"
												size={12}
												color={Colors.white}
												style={[globalStyle.marginTop2,globalStyle.marginRight3]}
											/>
											<Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
												Stock
											</Text>
										</TouchableOpacity>

										<TouchableOpacity
											onPress={this.openReduceStockModal}
											style={[styles.capsule, { backgroundColor: Colors.tomato }]}
										>
											<FontAwesome
												name="minus"
												size={12}
												color={Colors.white}
												style={[globalStyle.marginTop2, globalStyle.marginRight3]}
											/>
											<Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
												Stock
											</Text>
										</TouchableOpacity>

										<TouchableOpacity
											onPress={this.gotoEditItem}
											style={[
												styles.capsule,
												{ backgroundColor: Colors.lightGrey },
											]}
										>
											<FontAwesome
												name="edit"
												size={12}
												color={Colors.textColor}
												style={[globalStyle.marginTop2,globalStyle.marginRight3]}
											/>
											<Text style={{ fontSize: Colors.textSize, color: Colors.textColor }}>
												Edit
											</Text>
										</TouchableOpacity>
									</View>
									: null}
							</View>
						) : null}

						{!this.state.hideEdit ? (<View style={styles.itemInfoContainer}>
							<View style={[globalStyle.flexDirectionRow,globalStyle.mb10]}>
								<View style={globalStyle.flex1 }>
									<Text style={styles.subText}>Sales Price</Text>
									<Text style={styles.titleText}>
										{"₹" + this.state.salesPrice}
									</Text>
								</View>
								<View style={globalStyle.flex1}>
									<Text style={styles.subText}>Purchase Price</Text>
									<Text style={styles.titleText}>
										{"₹" + this.state.purchasePrice}
									</Text>
								</View>
							</View>
							<View style={globalStyle.flexDirectionRow}>
								<View style={globalStyle.flex1}>
									<Text style={styles.subText}>Stock Quantity</Text>
									<Text style={styles.titleText}>
										{this.state.currentStock + " " + this.state.unit}
									</Text>
								</View>
								<View style={globalStyle.flex1}>
									<Text style={styles.subText}>Stock Value</Text>
									<Text style={styles.titleText}>
										{"₹" + this.getStockValue()}
									</Text>
								</View>
							</View>
						</View>) : null}

						<Tabs tabBarUnderlineStyle={styles.underlineStyle}>
							<Tab
								heading={"Details"}
								tabStyle={styles.inActiveTab}
								textStyle={styles.inActiveText}
								activeTabStyle={styles.activeTab}
								activeTextStyle={styles.activeText}
							>
								<View style={styles.itemInfoContainer}>
									<View style={[globalStyle.flexDirectionRow,globalStyle.mb10]}>
										<View style={globalStyle.flex1}>
											<Text style={styles.subText}>Item Code</Text>
											<Text style={styles.titleText}>
												{this.state.productCode}
											</Text>
										</View>
										<View style={globalStyle.flex1}>
											<Text style={styles.subText}>Measuring Unit</Text>
											<Text style={styles.titleText}>{this.state.unit}</Text>
										</View>
									</View>
									<View style={[globalStyle.flexDirectionRow,globalStyle.mb10]}>
										<View style={globalStyle.flex1}>
											<Text style={styles.subText}>Tax Rate</Text>
											<Text style={styles.titleText}>{this.state.gst}</Text>
										</View>
										<View style={globalStyle.flex1}>
											<Text style={styles.subText}>HSN Code</Text>
											<Text style={styles.titleText}>{this.state.hsnCode}</Text>
										</View>
									</View>
									<View style={styles.imagePicker}>
										<Image
											style={styles.imageHeight}
											source={{ uri: this.state.imageURI }}
										/>
									</View>
								</View>

								<ScrollView showsVerticalScrollIndicator={false}>
									<View style={styles.theadRow}>
										<View style={globalStyle.flex1}>
											<Text style={styles.titleText}>Batch No.</Text>
										</View>
										<View style={[globalStyle.flex1,globalStyle.alignItemsCenter]}>
											<Text style={styles.titleText}>Expiry Date</Text>
										</View>
										<View style={[globalStyle.flex1,globalStyle.alignItemsFlexEnd]}>
											<Text style={styles.titleText}>Quantity</Text>
										</View>
									</View>

									{(this.state.availableStocks || []).map((item) => (
										<View key={item.id.toString()} style={styles.tbodyRow}>
											<View style={globalStyle.flex1}>
												<Text style={styles.subText}>
													{item.batch_no !== null ? item.batch_no : "N/A"}
												</Text>
											</View>
											<View style={[globalStyle.flex1,globalStyle.alignItemsCenter]}>
												<Text style={styles.subText}>
													{moment(item.expiry_date, "YYYY-MM-DD").format(
														"DD/MM/YYYY"
													)}
												</Text>
											</View>
											<View style={[globalStyle.flex1,globalStyle.alignItemsFlexEnd]}>
												<Text style={styles.subText}>
													{item.quantity + " " + this.state.unit}
												</Text>
											</View>
										</View>
									))}
								</ScrollView>
							</Tab>
							<Tab
								heading={"Item Timeline"}
								tabStyle={styles.inActiveTab}
								textStyle={styles.inActiveText}
								activeTabStyle={styles.activeTab}
								activeTextStyle={styles.activeText}
							>
								<ScrollView showsVerticalScrollIndicator={false}>
									<View style={styles.theadRow}>
										<View style={globalStyle.flex1}>
											<Text style={styles.titleText}>Activity</Text>
										</View>
										<View style={[globalStyle.flex1,globalStyle.alignItemsCenter]}>
											<Text style={styles.titleText}>Change</Text>
										</View>
										<View style={globalStyle.flex1}>
											<Text style={styles.titleText}>Batch No.</Text>
										</View>
										<View style={globalStyle.flex1}>
											<Text style={styles.titleText}>Final Stock Unit</Text>
										</View>
									</View>
									{(this.state.transaction || []).map((item) => {
										if (item.txn_type === "CR") {
											finanlStock = finanlStock + parseFloat(item.quantity);
										} else {
											finanlStock = finanlStock - parseFloat(item.quantity);
										}

										return (
											<View key={item.id.toString()} style={styles.tbodyRow}>
												<View style={globalStyle.flex1}>
													<Text style={styles.titleText}>
														{item.description}
													</Text>
													<Text style={styles.subText}>
														{moment(
															item.txn_date,
															"YYYY-MM-DD HH:mm:ss"
														).format("DD MMM YYYY")}
													</Text>
												</View>
												<View style={[globalStyle.flex1,globalStyle.alignItemsCenter]}>
													<Text style={styles.subText}>
														{item.quantity + " " + this.state.unit}
													</Text>
												</View>
												<View style={globalStyle.flex1}>
													<Text style={styles.subText}>
														{item.batch_no !== null ? item.batch_no : "N/A"}
													</Text>
												</View>
												<View style={[globalStyle.flex1,globalStyle.alignItemsFlexEnd]}>
													<Text style={styles.subText}>
														{finanlStock.toFixed(1) + " " + this.state.unit}
													</Text>
												</View>
											</View>
										);
									})}
								</ScrollView>
							</Tab>
						</Tabs>
					</View>
				)}

				{/*Add Stock Modal*/}
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.isAddStockModalOpen}
					onRequestClose={this.closeAddStockModal}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.stockModalContainer}>
							<View style={styles.stockModalHeader}>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.headerBackBtnContainer}
									onPress={this.closeAddStockModal}
								>
									<Ionicons name="arrow-back" size={25} color={Colors.white} />
								</TouchableOpacity>
								<View style={styles.headerTitleContainer}>
									<Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
										Add Stock
									</Text>
								</View>
							</View>

							<View style={styles.stockModalBody}>
								<View
									style={[globalStyle.formBorder]}
								>
									<View style={styles.fieldBox}>
										<Text style={styles.labelName}>Current Stock:</Text>
										<TextInput
											editable={false}
											value={this.state.currentStock + " " + this.state.unit}
											style={styles.textfield}
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
											onChangeText={(quantity) =>
												this.setState(
													{
														quantity,
													},
													() => {
														this.increaseStock();
													}
												)
											}
											style={styles.textfield}
											autoCompleteType="off"
											keyboardType="numeric"
											placeholder="Enter Quantity To Add"
										/>
									</View>

									{this.state.updatedStock > 0 ? (
										<View style={styles.fieldBox}>
											<Text style={styles.labelName}>Updated Stock:</Text>
											<TextInput
												editable={false}
												value={
													this.state.updatedStock.toFixed(1) +
													" " +
													this.state.unit
												}
												style={styles.textfield}
											/>
										</View>
									) : null}

									<View style={styles.fieldBox}>
										<Text style={styles.labelName}>Batch No.</Text>
										<TextInput
											value={this.state.batchNo}
											onChangeText={(batchNo) => this.setState({ batchNo })}
											style={styles.textfield}
											autoCompleteType="off"
											placeholder="Enter Batch No."
										/>
									</View>

									<Dropdown
										label={"Store Name:"}
										placeholder="Select Store Name"
										value={this.state.storeName}
										items={this.state.storeNames}
										onChange={this.setStoreName}
										labelStyle={styles.labelName}
										textFieldStyle={styles.textfield}
										style={[
											styles.fieldBox,
											this.state.storeNameValidationFailed
												? styles.errorFieldBox
												: null,
										]}
									/>

									<View style={[styles.fieldBox]}>
										<Text style={styles.labelName}>Expiry Date:</Text>
										<TouchableOpacity
											activeOpacity={1}
											style={[globalStyle.flexDirectionRow,globalStyle.alignItemsCenter,globalStyle.width60]}
											onPress={() => {
												this.showDatePicker();
											}}
										>
											<Text style={[styles.textfield,{width:'auto'}]}>
												{this.state.expiryDate.toDateString()}
											</Text>
											<AntDesign name="calendar" color={Colors.primary} size={20} />
										</TouchableOpacity>
									</View>

									<DateTimePickerModal
										mode={"date"}
										display={Platform.OS == "ios" ? "inline" : "default"}
										isVisible={this.state.isExpiryDatepickerOpen}
										onConfirm={this.handleConfirm}
										onCancel={this.hideDatePicker}
									/>

									

								</View>

								<TouchableOpacity
									style={styles.saveBtn}
									onPress={this.addProductStock}
								>
									<Text style={styles.saveBtnText}>Save</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				{/*Reduce Stock Modal*/}
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.isReduceStockModalOpen}
					onRequestClose={this.closeReduceStockModal}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.stockModalContainer}>
							<View style={styles.stockModalHeader}>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.headerBackBtnContainer}
									onPress={this.closeReduceStockModal}
								>
									<Ionicons name="arrow-back" size={25} color={Colors.white} />
								</TouchableOpacity>
								<View style={styles.headerTitleContainer}>
									<Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
										Reduce Stock
									</Text>
								</View>
							</View>

							<View style={styles.stockModalBody}>
								<View style={styles.fieldBox}>
									<Text style={styles.labelName}>Current Stock:</Text>
									<TextInput
										editable={false}
										value={this.state.availableStock + " " + this.state.unit}
										style={styles.textfield}
									/>
								</View>

								<Dropdown
									label={"Store Name:"}
									placeholder="Select Store Name"
									value={this.state.storeName}
									items={this.state.storeNames}
									onChange={this.setAvailableStock}
									labelStyle={styles.labelName}
									textFieldStyle={styles.textfield}
									style={[
										styles.fieldBox,
										this.state.storeNameValidationFailed
											? styles.errorFieldBox
											: null,
									]}
								/>

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
										onChangeText={(quantity) =>
											this.setState(
												{
													quantity,
												},
												() => {
													this.decreaseStock();
												}
											)
										}
										style={styles.textfield}
										autoCompleteType="off"
										keyboardType="numeric"
										placeholder="Enter Quantity To Reduce"
									/>
								</View>

								{this.state.reduceUpdateStock > 0 ? (
									<View style={styles.fieldBox}>
										<Text style={styles.labelName}>Updated Stock:</Text>
										<TextInput
											editable={false}
											value={
												this.state.reduceUpdateStock.toFixed(1) +
												" " +
												this.state.unit
											}
											style={styles.textfield}
										/>
									</View>
								) : null}

								<View style={styles.fieldBox}>
									<Text style={styles.labelName}>Batch No.</Text>
									<TextInput
										value={this.state.batchNo}
										onChangeText={(batchNo) => this.setState({ batchNo })}
										style={styles.textfield}
										autoCompleteType="off"
										placeholder="Enter Batch No."
									/>
								</View>

								<TouchableOpacity
									style={styles.saveBtn}
									onPress={this.reduceProductStock}
								>
									<Text style={styles.saveBtnText}>Save</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				<OverlayLoader visible={this.state.showLoader} />
			</Container>
		);
	};
}

 const windowWidth = Dimensions.get("window").width;
 const windowHeight = Dimensions.get("window").height;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		// paddingHorizontal: 5,
// 	},
// 	headingText: {
// 		fontSize: Colors.lableSize,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},
// 	titleText: {
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: Colors.textSize,
// 		lineHeight: 22,
// 	},
// 	itemTitleContainer: {
// 		paddingVertical: 12,
// 		paddingHorizontal: 5,
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#eee",
// 	},
// 	capsule: {
// 		height: 25,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 10,
// 		paddingBottom: 2,
// 		borderRadius: 50,
// 		marginRight: 10,
// 	},
// 	editBtnText: {
// 		fontSize: Colors.textSize,
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	itemInfoContainer: {
// 		padding: 15,
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#eee",
// 	},
// 	scrollableTab: {
// 		marginTop: 10,
// 		backgroundColor: Colors.white,
// 		borderColor: "#FFF",
// 	},
// 	underlineStyle: {
// 		backgroundColor: Colors.primary,
// 		height: 3,
// 	},
// 	activeTab: {
// 		backgroundColor: Colors.white,
// 		paddingVertical: 3,
// 	},
// 	activeText: {
// 		fontSize: Colors.textSize,
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	inActiveTab: {
// 		backgroundColor: Colors.white,
// 		paddingVertical: 3,
// 	},
// 	inActiveText: {
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	imagePicker: {
// 		width: 50,
// 		height: 50,
// 		marginTop: 5,
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	theadRow: {
// 		flexDirection: "row",
// 		height: 50,
// 		alignItems: "center",
// 		paddingHorizontal: 10,
// 		backgroundColor: Colors.lightGrey,
// 		borderBottomColor: "#ddd",
// 		borderBottomWidth: 1,
// 	},
// 	tbodyRow: {
// 		flexDirection: "row",
// 		height: 50,
// 		alignItems: "center",
// 		paddingHorizontal: 10,
// 		borderBottomColor: "#ddd",
// 		borderBottomWidth: 1,
// 	},
// 	modalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	stockModalContainer: {
// 		flex: 1,
// 		width: windowWidth,
// 		height: windowHeight,
// 		backgroundColor: Colors.lightGrey,
// 	},
// 	stockModalHeader: {
// 		height: 55,
// 		flexDirection: "row",
// 		width: "100%",
// 		backgroundColor: Colors.primary,
// 		elevation: 1,
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 	},
// 	headerBackBtnContainer: {
// 		width: "15%",
// 		height: 55,
// 		paddingLeft: 8,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	headerTitleContainer: {
// 		width: "70%",
// 		paddingLeft: 20,
// 		height: 55,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	stockModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 		padding: 8,
// 	},
// 	fieldBox: {
// 		alignItems: "center",
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderBottomWidth: 1,
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		justifyContent: "space-between",
// 	},
// 	labelName: {
// 		color: Colors.labelColor,
// 		// lineHeight: 40,
// 		fontSize: Colors.lableSize,
// 		paddingLeft: 4,
// 		height: "auto",
// 		paddingVertical: 10,
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		width: '60%',
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	},
// 	saveBtn: {
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
// 	saveBtnText: {
// 		fontSize: Colors.textSize,
// 		color: "#fff",
// 		fontWeight: "bold",
// 	},
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// });
