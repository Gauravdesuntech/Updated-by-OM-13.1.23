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
	SafeAreaView,
} from "react-native";
import { Container } from "native-base";
import { Ionicons, FontAwesome,AntDesign } from "@expo/vector-icons";
import Menu, { MenuItem } from "react-native-material-menu";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { Header, DatePicker, Dropdown, OverlayLoader } from "../../component";
import { isNumber, getFormattedDate } from "../../utils/Util";
import {
	getParties,
	getProducts,
	getStoreNames,
	updateItemData,
	generateItemRequest,
	getItemRequestNumber,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class AddRequestingItems extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			itemRequestDate: new Date(),
			partyID: 0,
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
			itemRequestNumber: '',
			userCode: undefined,
			itemName: undefined,
		};

		this.formScrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let cid = this.context.userDetails.cid;
		Promise.all([getParties(cid), getStoreNames(cid), getProducts({ cid }), getItemRequestNumber(cid)])
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
					itemRequestNumber: response[3].data,
					userCode: this.context.userDetails.user_code
				});
			})
			.catch((error) => console.log(error));
	};

	// showDatepicker = () => this.setState({ isDatepickerOpen: true });

	// onChangeDate = (event, selectedDate) => {
	// 	let currentDate = selectedDate || this.state.itemRequestDate;
	// 	this.setState({
	// 		isDatepickerOpen: false,
	// 		itemRequestDate: currentDate,
	// 	});
	// };

	showDatePicker = () => {
		this.setState({ isDatepickerOpen: true });
	  };
	
	  handleConfirm = (selectDate) => {
		let currentDate = selectDate || this.state.itemRequestDate;
		this.setState({
		  isDatepickerOpen: false,
		  itemRequestDate: currentDate,
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
			itemDesc: "",
			itemName: "",
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
					itemName,
					quantity,
					addedItems,
				} = this.state;

				if (typeof itemName === "undefined") {
					this.setState({ itemNameValidationFailed: true });
					return false;
				} else if (
					!isNumber(quantity) ||
					(isNumber(quantity) && parseFloat(quantity) <= 0)
				) {
					this.setState({ quantityValidationFailed: true });
					return false;
				} else {
					let obj = {
						name: this.state.itemName,
						desc: this.state.itemDesc,
						quantity: this.state.quantity,
					};

					let index = addedItems.findIndex(
						(element) =>
							element.name === itemName
					);
	
					if (index > -1) {
						addedItems[index] = obj;
					} else {
						addedItems.push(obj);
					}

						this.setState({
							addedItems: addedItems,
							isAddItemModalOpen: false,
						});
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
		let index = addedItems.findIndex((element) => element.name === id);
		let obj = addedItems[index];
		console.log(obj)
		this.setState({
			itemName: obj.name,
			quantity: obj.quantity,
			itemDesc: obj.desc,
			isAddItemModalOpen: true,
		});
	};

	deleteItem = (id) => {
		this[`menuRef_${id}`].hide();
		let { addedItems } = this.state;
		let arr = addedItems.filter((element) => element.name !== id);
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
				let { addedItems, userCode } = this.state;
				 if (addedItems.length === 0) {
					Alert.alert("Warning", "Please add atleast one item");
				} else {
					this.setState({ showLoader: true });
					let cid = this.context.userDetails.cid;
					let poItems = addedItems.map((v, i) => ({
						name: v.name,
						desc: v.desc,
						quantity: v.quantity,
					}));

					let reqObj = {
						cid: cid,
						po_date: getFormattedDate(this.state.itemRequestDate),
						items: JSON.stringify(poItems),
						created_by: userCode
					};

					generateItemRequest(reqObj)
						.then((response) => {
							console.log(response)
							if (response.check === Configs.SUCCESS_TYPE) {
								this.setState(
									{
										showLoader: false,
									},
									() => {
										this.props.navigation.navigate("addUp");
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

	renderItem = (item) => (
		<View key={item.name + "-" + item.quantity} style={styles.itemRow}>
			<View style={styles.itemRowHeading}>
				<Text style={styles.rowTitleText}>{item.name}</Text>
			</View>
			<View style={styles.itemRowBody}>
				<View>
					<Text style={styles.rowSubText}>{"Quantity: " + item.quantity}</Text>
				</View>
				<Menu
					ref={(ref) => (this[`menuRef_${item.name}`] = ref)}
					button={
						<TouchableOpacity
							activeOpacity={1}
							style={globalStyle.p3}
							onPress={this.showMenu.bind(this, item.name)}
						>
							<FontAwesome
								name="ellipsis-v"
								size={20}
								color={Colors.textColor}
							/>
						</TouchableOpacity>
					}
				>
					<MenuItem onPress={this.editItem.bind(this, item.name)}>Edit</MenuItem>
					<MenuItem
						textStyle={{ color: Colors.tomato }}
						onPress={this.deleteItem.bind(this, item.name)}
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
			<Header title={"New Item Request"} />
			<View style={styles.container}>
				<ScrollView
					ref={this.formScrollViewRef}
					showsVerticalScrollIndicator={false}
				>
					<View style={[globalStyle.formBorder]}>
					{/* <DatePicker
						onPress={this.showDatepicker}
						show={this.state.isDatepickerOpen}
						onChange={this.onChangeDate}
						date={this.state.itemRequestDate}
						mode={"date"}
						label={"Request Date:"}
					/> */}
					 <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Request Date:</Text>
              <TouchableOpacity
                activeOpacity={1}
                style={[globalStyle.flexDirectionRow,globalStyle.alignItemsCenter,globalStyle.width50]}
                onPress={() => {
                  this.showDatePicker();
                }}
              >
                <Text style={[styles.textfield]}>
                  {this.state.itemRequestDate.toDateString()}
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

					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>Request Number:</Text>
							<TextInput
								editable={false}
								value={this.state.itemRequestNumber}
								style={[styles.textfield,globalStyle.width50]}
							/>
					</View>

					{/* <Dropdown
						label={"Party:"}
						value={this.state.partyName}
						items={this.state.parties}
						onChange={this.setParty}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.partyValidationFailed ? styles.errorFieldBox : null,
						]}
					/> */}

					<View style={styles.addItemRow}>
						<Text style={styles.labelName}>
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
								style={[globalStyle.marginTop2,globalStyle.marginRight3]}
							/>
							<Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
								Add Item
							</Text>
						</TouchableOpacity>
					</View>

					{this.state.addedItems.length > 0 ? (
						<View style={styles.itemsContainer}>
							{this.state.addedItems.map((item) => this.renderItem(item))}
						</View>
					) : null}
</View>
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
								<Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
									Add Item
								</Text>
							</View>
						</View>

						<View style={styles.itemModalBody}>
						<View
            style={globalStyle.formBorder}
          >
							<View style={styles.fieldBox}>
								<Text style={styles.labelName}>Item:</Text>
								<TextInput
									// placeholder={"Enter Item Name"}
									value={this.state.itemName}
									style={[styles.textfield,globalStyle.width50]}
									onChangeText={(val)=>{this.setState({itemName: val})}}
								/>
							</View>


							{/* <View
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
									// placeholder="Enter Price"
								/>
							</View> */}
							{/* {parseFloat(this.state.itemPurchasePrice) !==
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
							) : null} */}

							{/* <View style={styles.fieldBox}>
								<Text style={styles.labelName}>GST Percentage:</Text>
								<TextInput
									value={this.state.selectedItemGST}
									onChangeText={(selectedItemGST) =>
										this.setState({ selectedItemGST })
									}
									style={styles.textfield}
									autoCompleteType="off"
									keyboardType="numeric"
									// placeholder="Enter GST Percentage"
								/>
							</View> */}
							{/* {parseFloat(this.state.itemGst) !==
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
							) : null} */}

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
									// placeholder="Enter Quantity"
								/>
							</View>

							<View
								style={[
									styles.fieldBox2,globalStyle.bbw0,
									this.state.quantityValidationFailed
										? styles.errorFieldBox
										: null,
								]}
							>
								<Text style={styles.labelName}>Desc:</Text>
								<TextInput
									value={this.state.itemDesc}
									onChangeText={(itemDesc) => this.setState({ itemDesc })}
									style={[styles.textfield,globalStyle.width50]}
									autoCompleteType="off"
									// placeholder="Enter Description"
									multiline
        							// numberOfLines={4}
								/>
							</View>
							</View>

							{/* <Dropdown
								label={"Store Name:"}
								// placeholder="Select Store Name"
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
							/> */}

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
}

// const windowWidth = Dimensions.get("screen").width;
// const windowHeight = Dimensions.get("screen").height;
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
// 		// shadowColor: "#999",
// 		// shadowOffset: {
// 		// 	width: 0,
// 		// 	height: 1,
// 		// },
// 		// shadowOpacity: 0.22,
// 		// shadowRadius: 2.22,
// 		// elevation: 3,
// 	},
// 	fieldBox2: {
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
// 		// shadowColor: "#999",
// 		// shadowOffset: {
// 		// 	width: 0,
// 		// 	height: 1,
// 		// },
// 		// shadowOpacity: 0.22,
// 		// shadowRadius: 2.22,
// 		// elevation: 3,
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
	
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	},
// 	descfield: {
// 		backgroundColor: "#fff",
		
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "right",
// 		width: "50%",
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
// 		fontSize: Colors.textSize,
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
