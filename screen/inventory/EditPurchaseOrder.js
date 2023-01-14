import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Modal,
	Dimensions,
	Alert,
	ToastAndroid,
	ScrollView,
} from "react-native";
import { Container } from "native-base";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Menu, { MenuItem } from "react-native-material-menu";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { Header, DatePicker, Dropdown, OverlayLoader } from "../../component";
import { isNumber, getFormattedDate, convertDate } from "../../utils/Util";
import {
	getParties,
	getProducts,
	getStoreNames,
	updateProductData,
	updatePurchaseOrder,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class EditPurchaseOrder extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			purchaseOrderDate: convertDate(props.route.params.poData.po_date),
			partyID: 0,
			partyName: undefined,
			parties: [],
			storeNames: [],
			products: [],
			isChecked: false,
			addedItems: props.route.params.poData.items,
			selectedItemID: undefined,
			selectedItemName: undefined,
			selectedItemUnit: undefined,
			selectedItemGST: "0",
			selectedItemPurchasePrice: "0",
			itemGst: "0",
			itemPurchasePrice: "0",
			selectedItemExpiryDateMandatory: undefined,
			storeNameID: undefined,
			storeName: undefined,
			batchNo: "",
			expiryDate: null,
			quantity: "",
			isItemGstChange: false,
			isDatepickerOpen: false,
			isAddItemModalOpen: false,
			partyValidationFailed: false,
			itemNameValidationFailed: false,
			storeNameValidationFailed: false,
			purchasePriceValidationFailed: false,
			expiryDateValidationFailed: false,
			quantityValidationFailed: false,
			showLoader: true,
			purchaseNumber: this.props.route.params.poNo,
			userCode: undefined,
		};

		this.formScrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let cid = this.context.userDetails.cid;
		Promise.all([getParties(cid), getStoreNames(cid), getProducts({ cid })])
			.then((response) => {
				this.setState({
					showLoader: false,
					parties: response[0],
					storeNames: response[1],
					products: response[2].map((v, i) => ({
						id: v.product_code,
						name: v.name,
						unit: v.unit,
						gst: v.gst,
						purchase_price: v.purchase_price,
						expiry_date_mandatory: v.expiry_date_mandatory,
					})),
					userCode: this.context.userDetails.user_code
				});
			})
			.catch((error) => console.log(error));
	};

	showDatePicker = () => {
		this.setState({ isDatepickerOpen: true });
	  };
	
	  handleConfirm = (selectDate) => {
		console.log(selectDate);
		let currentDate = selectDate || this.state.purchaseOrderDate;
		this.setState({
			isDatepickerOpen: false,
			purchaseOrderDate: currentDate,
		});
		this.hideDatePicker();
	  };
	
	  hideDatePicker = () => {
		this.setState({ isDatepickerOpen: false });
	  };


	setParty = (v) => {
		this.setState({
			partyID: v.id,
			partyName: v.name,
		});
	};

	setStoreName = (v) => {
		this.setState({
			storeNameID: v.id,
			storeName: v.name,
		});
	};

	setItemData = (v) => {
		this.setState({
			selectedItemID: v.id,
			selectedItemName: v.name,
			selectedItemUnit: v.unit,
			selectedItemGST: v.gst,
			itemGst: v.gst,
			selectedItemPurchasePrice: v.purchase_price,
			itemPurchasePrice: v.purchase_price,
			selectedItemExpiryDateMandatory: v.expiry_date_mandatory,
		});
	};

	openAddItemModal = () =>
		this.setState({
			selectedItemID: undefined,
			selectedItemName: undefined,
			selectedItemUnit: undefined,
			selectedItemGST: "0",
			itemGst: "0",
			storeNameID: undefined,
			storeName: undefined,
			selectedItemExpiryDateMandatory: undefined,
			selectedItemPurchasePrice: "0",
			itemPurchasePrice: "0",
			isChecked: false,
			batchNo: "",
			expiryDate: null,
			quantity: "",
			isAddItemModalOpen: true,
		});

	closeAddItemModal = () =>
		this.setState({
			isAddItemModalOpen: false,
		});

	toggleCheckboxCheck = () =>
		this.setState({ isChecked: !this.state.isChecked });

	toggleGSTUpdate = () =>
		this.setState({ isItemGstChange: !this.state.isItemGstChange });

	addItem = () => {
		this.setState(
			{
				itemNameValidationFailed: false,
				storeNameValidationFailed: false,
				purchasePriceValidationFailed: false,
				quantityValidationFailed: false,
				expiryDateValidationFailed: false,
			},
			() => {
				let {
					selectedItemID,
					storeNameID,
					selectedItemPurchasePrice,
					quantity,
					addedItems,
				} = this.state;

				if (typeof selectedItemID === "undefined") {
					this.setState({ itemNameValidationFailed: true });
					return false;
				} else if (typeof storeNameID === "undefined") {
					this.setState({ storeNameValidationFailed: true });
					return false;
				} else if (
					!isNumber(selectedItemPurchasePrice) ||
					(isNumber(selectedItemPurchasePrice) &&
						parseFloat(selectedItemPurchasePrice) <= 0)
				) {
					this.setState({ purchasePriceValidationFailed: true });
					return false;
				} else if (
					!isNumber(quantity) ||
					(isNumber(quantity) && parseFloat(quantity) <= 0)
				) {
					this.setState({ quantityValidationFailed: true });
					return false;
				} else {
					let obj = {
						product_code: selectedItemID,
						product_name: this.state.selectedItemName,
						store_id: storeNameID,
						store_name: this.state.storeName,
						unit: this.state.selectedItemUnit,
						gst: this.state.selectedItemGST,
						quantity: this.state.quantity,
						price: parseFloat(this.state.selectedItemPurchasePrice).toFixed(2),
						amount: (
							this.state.quantity * this.state.selectedItemPurchasePrice
						).toFixed(2),
					};
                    
					let index = addedItems.findIndex(
						(element) =>
							element.product_code === selectedItemID && element.store_id === storeNameID
					);

					if (index > -1) {
						addedItems[index] = obj;
					} else {
						addedItems.push(obj);
					}

					let itemObj = { product_code: selectedItemID };
					if (this.state.isChecked) {
						itemObj.purchase_price = this.state.selectedItemPurchasePrice;
					}
					if (this.state.isItemGstChange) {
						itemObj.gst = this.state.selectedItemGST;
					}

					if (Object.keys(itemObj).length > 1) {
						this.setState({ showLoader: true });
						updateProductData(itemObj).then((response) => {
							this.setState({
								showLoader: false,
								addedItems: addedItems,
								isAddItemModalOpen: false,
							});
						});
					} else {
						this.setState({
							addedItems: addedItems,
							isAddItemModalOpen: false,
						});
					}
				}
			}
		);
	};

	showMenu = (id) => {
		this[`menuRef_${id}`].show();
	};

	getProductPurchasePrice = (productCode) => {
		let { products } = this.state;
		let index = products.findIndex((element) => element.id === productCode);
		return products[index].purchase_price;
	};

	getProductGST = (productCode) => {
		let { products } = this.state;
		let index = products.findIndex((element) => element.id === productCode);
		return products[index].gst;
	};

	editItem = (id) => {
		this[`menuRef_${id}`].hide();

		let { addedItems } = this.state;
		let index = addedItems.findIndex((element) => element.product_code === id);
		let obj = addedItems[index];
		let purchasePrice = this.getProductPurchasePrice(id);
		let gst = this.getProductGST(id);

		this.setState({
			selectedItemID: id,
			selectedItemName: obj.product_name,
			storeNameID: obj.store_id,
			storeName: obj.store_name,
			selectedItemUnit: obj.unit,
			selectedItemGST: obj.gst,
			selectedItemPurchasePrice: obj.price,
			itemPurchasePrice: purchasePrice,
			isChecked: parseFloat(obj.price) !== parseFloat(purchasePrice),
			isItemGstChange: parseFloat(obj.gst) !== parseFloat(gst),
			quantity: obj.quantity,
			isAddItemModalOpen: true,
		});
	};

	deleteItem = (id) => {
		this[`menuRef_${id}`].hide();
		let { addedItems } = this.state;
		let arr = addedItems.filter((element) => element.product_code !== id);
		this.setState({ addedItems: arr });
	};

	scrollToScrollViewTop = () =>
		this.formScrollViewRef.current.scrollTo({
			x: 0,
			y: 0,
			animated: true,
		});

	saveData = () => {
		this.setState(
			{
				partyValidationFailed: false,
			},
			() => {
				let { partyID, addedItems, userCode } = this.state;
				if (typeof partyID === "undefined") {
					this.setState({ partyValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (addedItems.length === 0) {
					Alert.alert("Warning", "Please add atleast one item");
				} else {
					this.setState({ showLoader: true });
					let cid = this.context.userDetails.cid;
					let poItems = addedItems.map((v, i) => ({
						product_code: v.product_code,
						store_id: v.store_id,
						price: v.price,
						unit: v.unit,
						gst: v.gst,
						quantity: v.quantity,
						net_amount: v.amount,
					}));
					let reqObj = {
						cid: cid,
						po_date: getFormattedDate(this.state.purchaseOrderDate),
						party_id: partyID,
						total_amount: this.getTotalAmount(),
						items: JSON.stringify(poItems),
						created_by: userCode,
                        po_no: this.state.purchaseNumber
					};

					updatePurchaseOrder(reqObj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								this.setState(
									{
										showLoader: false,
									},
									() => {
										this.props.navigation.navigate("PurchaseOrders");
									}
								);
							} else {
								this.setState({ showLoader: false });
								Alert.alert("Error", response.message);
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

	renderItem = (item, index) => (
		<View key={item.product_code + "-" + item.store_id + "-" + index + "-" + item.id} style={styles.itemRow}>
			<View style={styles.itemRowHeading}>
				<Text style={styles.rowTitleText}>{item.product_name}</Text>
				<Text style={styles.rowTitleText}>{"₹" + item.amount}</Text>
			</View>
			<View style={styles.itemRowBody}>
				<View>
					<Text style={styles.rowSubText}>
						{"Price: ₹" + item.price + "/" + item.unit}
					</Text>
					<Text style={styles.rowSubText}>{"Quantity: " + item.quantity}</Text>
				</View>
				<Menu
					ref={(ref) => (this[`menuRef_${item.product_code}`] = ref)}
					button={
						<TouchableOpacity
							activeOpacity={1}
							style={{ padding: 5 }}
							onPress={this.showMenu.bind(this, item.product_code)}
						>
							<FontAwesome
								name="ellipsis-v"
								size={20}
								color={Colors.textColor}
							/>
						</TouchableOpacity>
					}
				>
					<MenuItem onPress={this.editItem.bind(this, item.product_code)}>Edit</MenuItem>
					<MenuItem
						textStyle={{ color: Colors.tomato }}
						onPress={this.deleteItem.bind(this, item.product_code)}
					>
						Delete
					</MenuItem>
				</Menu>
			</View>
		</View>
	);

	getTotalAmount = () => {
		let { addedItems } = this.state;
		let amount = 0;
		addedItems.forEach((v, i) => {
			amount += parseFloat(v.amount);
		});

		return amount.toFixed(2);
	};

	render = () => (
		<Container>
			<Header title={"Edit Request"} />
			<View style={styles.container}>
				<ScrollView
					ref={this.formScrollViewRef}
					showsVerticalScrollIndicator={false}
				>
				<View
            style={globalStyle.formBorder}
          >
		  <View style={[styles.fieldBox]}>
		  <Text style={styles.labelName}>Purchase Date:</Text>
		  <TouchableOpacity
			activeOpacity={1}
			style={[globalStyle.flexDirectionRow,globalStyle.alignItemsCenter,globalStyle.width50]}
			onPress={() => {
			  this.showDatePicker();
			}}
		  >
			<Text style={[styles.textfield]}>
			  {this.state.purchaseOrderDate.toDateString()}
			</Text>
			<AntDesign name="calendar" color={Colors.primary} size={20} />
		  </TouchableOpacity>
		</View>

		<DateTimePickerModal
		  mode={"date"}
		  display={Platform.OS == "ios" ? "inline" : "default"}
		  isVisible={this.state.isDatepickerOpen}
		  onConfirm={this.handleConfirm}
		  onCancel={this.hideDatePicker}
		/>


					<View style={[styles.fieldBox,globalStyle.bbw0]}>
						<Text style={styles.labelName}>Purchase Number:</Text>
							<TextInput
								editable={false}
								value={this.state.purchaseNumber}
								style={[styles.textfield,globalStyle.width50]}
							/>
					</View>
					</View>
					{/* <Dropdown
						label={"Party:"}
						value={this.state.partyName}
						items={this.state.parties}
						onChange={this.setParty}
						labelStyle={styles.labelName}
						textFieldStyle={[styles.textfield,{width:'50%'}]}
						style={[
							styles.fieldBox,
							this.state.partyValidationFailed ? styles.errorFieldBox : null,
						]}
					/> */}

					<View style={styles.addItemRow}>
						<Text style={[globalStyle.fontSize16,{color: Colors.textColor }]}>
							ITEMS:
						</Text>
						<TouchableOpacity
							onPress={this.openAddItemModal}
							style={[styles.capsule, { backgroundColor: Colors.mediumGrey }]}
						>
							<FontAwesome
								name="plus"
								size={10}
								color={Colors.white}
								style={[globalStyle.marginRight3,globalStyle.marginTop2]}
							/>
							<Text style={[globalStyle.fontSize,{color: Colors.white }]}>
								Add Item
							</Text>
						</TouchableOpacity>
					</View>

					{this.state.addedItems.length > 0 ? (
						<View style={styles.itemsContainer}>
							{this.state.addedItems.map((item, index) => this.renderItem(item, index))}
							<View style={styles.totalRow}>
								<Text style={styles.rowTitleText}>Total:</Text>
								<Text style={styles.rowTitleText}>
									{"₹" + this.getTotalAmount()}
								</Text>
							</View>
						</View>
					) : null}

					<TouchableOpacity style={styles.button} onPress={this.saveData}>
						<Text style={styles.textWhite}>Save</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={this.state.isAddItemModalOpen}
				onRequestClose={this.closeAddItemModal}
			>
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
									Add Item
								</Text>
							</View>
						</View>

						<View style={styles.itemModalBody}>
							<Dropdown
								label={"Item:"}
								value={this.state.selectedItemName}
								items={this.state.products}
								onChange={this.setItemData}
								labelStyle={styles.labelName}
								textFieldStyle={[styles.textfield,globalStyle.width50]}
								style={[
									styles.fieldBox,
									this.state.itemNameValidationFailed
										? styles.errorFieldBox
										: null,
								]}
							/>

							<View style={styles.fieldBox}>
								<Text style={styles.labelName}>Unit:</Text>
								<TextInput
									editable={false}
									value={this.state.selectedItemUnit}
									style={[styles.textfield,globalStyle.width50]}
								/>
							</View>

							<View
								style={[
									styles.fieldBox,
									this.state.purchasePriceValidationFailed
										? styles.errorFieldBox
										: null,
								]}
							>
								<Text style={styles.labelName}>Purchase Price:</Text>
								<TextInput
									value={this.state.selectedItemPurchasePrice}
									onChangeText={(selectedItemPurchasePrice) =>
										this.setState({ selectedItemPurchasePrice })
									}
									style={[styles.textfield,globalStyle.width50]}
									autoCompleteType="off"
									keyboardType="numeric"
									placeholder="Enter Price"
								/>
							</View>
							{parseFloat(this.state.itemPurchasePrice) !==
							parseFloat(this.state.selectedItemPurchasePrice) ? (
								<TouchableOpacity
									activeOpacity={1}
									onPress={this.toggleCheckboxCheck}
									style={styles.checkBoxRow}
								>
									<Ionicons
										name={this.state.isChecked ? "checkbox" : "square-outline"}
										color={Colors.primary}
										size={18}
									/>
									<Text style={styles.checkBoxLabel}>
										Update price for item
									</Text>
								</TouchableOpacity>
							) : null}

							<View style={styles.fieldBox}>
								<Text style={styles.labelName}>GST Percentage:</Text>
								<TextInput
									value={this.state.selectedItemGST}
									onChangeText={(selectedItemGST) =>
										this.setState({ selectedItemGST })
									}
									style={[styles.textfield,globalStyle.width50]}
									autoCompleteType="off"
									keyboardType="numeric"
									placeholder="Enter GST Percentage"
								/>
							</View>
							{parseFloat(this.state.itemGst) !==
							parseFloat(this.state.selectedItemGST) ? (
								<TouchableOpacity
									activeOpacity={1}
									onPress={this.toggleGSTUpdate}
									style={styles.checkBoxRow}
								>
									<Ionicons
										name={
											this.state.isItemGstChange ? "checkbox" : "square-outline"
										}
										color={Colors.primary}
										size={18}
									/>
									<Text style={styles.checkBoxLabel}>
										Update GST percentage for item
									</Text>
								</TouchableOpacity>
							) : null}

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
									style={[styles.textfield,globalStyle.width50]}
									autoCompleteType="off"
									keyboardType="number-pad"
									placeholder="Enter Quantity"
								/>
							</View>

							<Dropdown
								label={"Store Name:"}
								placeholder="Select Store Name"
								value={this.state.storeName}
								items={this.state.storeNames}
								onChange={this.setStoreName}
								labelStyle={styles.labelName}
								textFieldStyle={[styles.textfield,globalStyle.width50]}
								style={[
									styles.fieldBox,
									this.state.storeNameValidationFailed
										? styles.errorFieldBox
										: null,
								]}
							/>

							<TouchableOpacity style={styles.button} onPress={this.addItem}>
								<Text style={styles.textWhite}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			<OverlayLoader visible={this.state.showLoader} />
		</Container>
	);
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
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
// 		fontSize: 19,
// 		paddingLeft: 4,
// 		height: "auto",
// 		paddingVertical: 10,
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: "auto",
	
// 		fontSize: 19,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	},
// 	radioButton: {
// 		flexDirection: "row",
// 		padding: 3,
// 	},
// 	radioButtonLabel: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		marginLeft: 5,
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
// 		borderRadius: 3,
// 	},
// 	itemRow: {
// 		paddingVertical: 5,
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#eee",
// 	},
// 	itemRowHeading: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		alignItems: "center",
// 	},
// 	itemRowBody: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		alignItems: "center",
// 		paddingRight: 10,
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
// 		fontSize: 14,
// 	},
// 	totalRow: {
// 		paddingVertical: 5,
// 		borderBottomWidth: 1,
// 		borderColor: "#eee",
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
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
// 	itemModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 		padding: 8,
// 	},
// 	checkBoxRow: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingVertical: 5,
// 	},
// 	checkBoxLabel: {
// 		marginLeft: 5,
// 		fontSize: 12,
// 		color: Colors.textColor,
// 	},
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// });
