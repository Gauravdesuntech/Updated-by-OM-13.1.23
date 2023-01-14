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
import { isNumber, getFormattedDate } from "../../utils/Util";
import {
	getParties,
	getProducts,
	getStoreNames,
	updateProductData,
	importStock,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import { SafeAreaView } from "react-native";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class Purchase extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			invoiceNo: "",
			invoiceDate: new Date(),
			partyID: undefined,
			partyName: undefined,
			parties: [],
			storeNames: [],
			products: [],
			isChecked: false,
			addedItems: [],
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
			expiryDate: new Date(),
			quantity: "",
			isItemGstChange: false,
			isDatepickerOpen: false,
			isExpiryDatepickerOpen: false,
			isAddItemModalOpen: false,
			invoiceNoValidationFailed: false,
			partyValidationFailed: false,
			itemNameValidationFailed: false,
			storeNameValidationFailed: false,
			purchasePriceValidationFailed: false,
			expiryDateValidationFailed: false,
			quantityValidationFailed: false,
			showLoader: false,
			type:'',
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
				});
			})
			.catch((error) => console.log(error));
	};

	gotoBack = () => {
		this.props.navigation.goBack();
	};


	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.invoiceDate;
		this.setState({
			isDatepickerOpen: false,
			invoiceDate: currentDate,
		});
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
			expiryDate:  new Date(),
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
					selectedItemExpiryDateMandatory,
					expiryDate,
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
				} else if (
					selectedItemExpiryDateMandatory === "Y" &&
					expiryDate === null
				) {
					this.setState({ expiryDateValidationFailed: true });
					return false;
				} else {
					let obj = {
						id: selectedItemID,
						name: this.state.selectedItemName,
						store_id: storeNameID,
						store_name: this.state.storeName,
						unit: this.state.selectedItemUnit,
						gst: this.state.selectedItemGST,
						batch_no: this.state.batchNo,
						expiry_date: this.state.expiryDate,
						quantity: this.state.quantity,
						price: parseFloat(this.state.selectedItemPurchasePrice).toFixed(2),
						amount: (
							this.state.quantity * this.state.selectedItemPurchasePrice
						).toFixed(2),
					};

					let index = addedItems.findIndex(
						(element) =>
							element.id === selectedItemID && element.store_id === storeNameID
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
		let index = addedItems.findIndex((element) => element.id === id);
		let obj = addedItems[index];
		let purchasePrice = this.getProductPurchasePrice(id);
		let gst = this.getProductGST(id);

		this.setState({
			selectedItemID: id,
			selectedItemName: obj.name,
			storeNameID: obj.store_id,
			storeName: obj.store_name,
			selectedItemUnit: obj.unit,
			selectedItemGST: obj.gst,
			selectedItemPurchasePrice: obj.price,
			itemPurchasePrice: purchasePrice,
			isChecked: parseFloat(obj.price) !== parseFloat(purchasePrice),
			isItemGstChange: parseFloat(obj.gst) !== parseFloat(gst),
			batchNo: obj.batch_no,
			expiryDate: obj.expiry_date,
			quantity: obj.quantity,
			isAddItemModalOpen: true,
		});
	};

	deleteItem = (id) => {
		this[`menuRef_${id}`].hide();
		let { addedItems } = this.state;
		let arr = addedItems.filter((element) => element.id !== id);
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
				invoiceNoValidationFailed: false,
				partyValidationFailed: false,
			},
			() => {
				let { invoiceNo, partyID, addedItems } = this.state;
				if (invoiceNo.trim().length === 0) {
					this.setState({ invoiceNoValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (typeof partyID === "undefined") {
					this.setState({ partyValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (addedItems.length === 0) {
					Alert.alert("Warning", "Please add atleast one item");
				} else {
					this.setState({ showLoader: true });
					let cid = this.context.userDetails.cid;
					let arr = addedItems.map((v, i) => ({
						product_code: v.id,
						store_id: v.store_id,
						price: v.price,
						unit: v.unit,
						gst: v.gst,
						batch_no: v.batch_no,
						expiry_date:
							v.expiry_date !== null ? getFormattedDate(v.expiry_date) : "",
						quantity: v.quantity,
						net_amount: v.amount,
					}));

					let reqObj = {
						cid: cid,
						invoice_no: invoiceNo,
						invoice_date: getFormattedDate(this.state.invoiceDate),
						party_id: partyID,
						total_amount: this.getTotalAmount(),
						items: JSON.stringify(arr),
					};

					importStock(reqObj)
	.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								this.setState(
									{
										showLoader: false,
										invoiceNo: "",
										partyID: undefined,
										partyName: undefined,
										addedItems: [],
									},
									() => {
										ToastAndroid.show(response.message, ToastAndroid.SHORT);
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

	showDatePicker = (type) => {
		this.setState({ isDatepickerOpen: true , type: type });
	  };
	
	  handleConfirm = (selectedDate) => {
		if(this.state.type == "invoiceDate"){
		let invoiceDate = selectedDate || this.state.invoiceDate;
		this.setState({
			invoiceDate: invoiceDate,
		});
		}else{
		let expiryDate = selectedDate || this.state.expiryDate;
		this.setState({
			expiryDate: expiryDate,
		});
		}
		this.hideDatePicker();
	  };
	
	  hideDatePicker = () => {
		this.setState({ isDatepickerOpen: false });
	  };

	renderItem = (item) => (
		<View key={item.id + "-" + item.store_id} style={styles.itemRow}>
			<View style={styles.itemRowHeading}>
				<Text style={styles.rowTitleText}>{item.name}</Text>
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
					ref={(ref) => (this[`menuRef_${item.id}`] = ref)}
					button={
						<TouchableOpacity
							activeOpacity={1}
							style={{ padding: 5 }}
							onPress={this.showMenu.bind(this, item.id)}
						>
							<FontAwesome
								name="ellipsis-v"
								size={20}
								color={Colors.textColor}
							/>
						</TouchableOpacity>
					}
				>
					<MenuItem onPress={this.editItem.bind(this, item.id)}>Edit</MenuItem>
					<MenuItem
						textStyle={{ color: Colors.tomato }}
						onPress={this.deleteItem.bind(this, item.id)}
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
			<Header title={"Material In"} />
			<View style={styles.container}>
				<ScrollView
					ref={this.formScrollViewRef}
					showsVerticalScrollIndicator={false}
				>
				<View style={globalStyle.formBorder}>
					<View
						style={[
							styles.fieldBox,
							this.state.invoiceNoValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Invoice No.</Text>
						<TextInput
							value={this.state.invoiceNo}
							onChangeText={(invoiceNo) => this.setState({ invoiceNo })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="none"
							placeholder="Enter Invoice No."
						/>
					</View>

					<View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Invoice Date:</Text>
              <TouchableOpacity
                activeOpacity={1}
                style={[globalStyle.flexDirectionRow,globalStyle.alignItemsCenter,globalStyle.width60]}
                onPress={() => {
                  this.showDatePicker("invoiceDate");
                }}
              >
                <Text style={[styles.textfield,{width: "auto"}]}>
                  {this.state.invoiceDate.toDateString()}
                </Text>
                <AntDesign name="calendar" color={Colors.primary} size={20} />
              </TouchableOpacity>
            </View>
			
					<Dropdown
						label={"Party:"}
						value={this.state.partyName}
						items={this.state.parties}
						onChange={this.setParty}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,globalStyle.bbw0,
							this.state.partyValidationFailed ? styles.errorFieldBox : null,
						]}
					/>
					</View>
					<View style={styles.addItemRow}>
						<Text style={{ fontSize: Colors.lableSize, color: Colors.textColor }}>
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
							<Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
								Add Item
							</Text>
						</TouchableOpacity>
					</View>

					{this.state.addedItems.length > 0 ? (
						<View style={styles.itemsContainer}>
							{this.state.addedItems.map((item) => this.renderItem(item))}
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
				<SafeAreaView style={[globalStyle.safeAreaViewStyle]}>
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
								<Text style={{ fontSize: Colors.headerSize, color: Colors.white }}>
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
								textFieldStyle={styles.textfield}
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
									style={styles.textfield}
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
									style={styles.textfield}
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
									style={styles.textfield}
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
									style={styles.textfield}
									autoCompleteType="off"
									keyboardType="number-pad"
									placeholder="Enter Quantity"
								/>
							</View>

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
                  this.showDatePicker("expiryDate");
                }}
              >
                <Text style={[styles.textfield,{width: "auto"}]}>
                  {this.state.expiryDate.toDateString()}
                </Text>
                <AntDesign name="calendar" color={Colors.primary} size={20} />
              </TouchableOpacity>
            </View>
							<TouchableOpacity style={styles.button} onPress={this.addItem}>
								<Text style={styles.textWhite}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				</SafeAreaView>
			</Modal>
			<DateTimePickerModal
              mode={"date"}
              display={Platform.OS == "ios" ? "inline" : "default"}
              isVisible={this.state.isDatepickerOpen}
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
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
// 		fontSize: Colors.lableSize,
// 		paddingLeft: 4,
// 		height: "auto",
// 		paddingVertical: 10,
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		width: "60%",
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	},
// 	radioButton: {
// 		flexDirection: "row",
// 		padding: 3,
// 	},
// 	radioButtonLabel: {
// 		fontSize: Colors.lableSize,
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
// 		fontSize: Colors.lableSize,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
// 	},
// 	rowSubText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: Colors.textSize,
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
// 		fontSize: Colors.lableSize,
// 		color: Colors.textColor,
// 	},
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// });
