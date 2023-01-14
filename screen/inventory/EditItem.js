import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	Alert,
	ScrollView,
} from "react-native";
import { Container } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import { Header, Dropdown, RadioButton, OverlayLoader } from "../../component";
import {
	getItemTypes,
	getProductDetails,
	manageProduct,
} from "../../services/InventoryManagmentServices";
import { getFileData, isNumber } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class EditInventoryItem extends React.Component {
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
			categories: [],
			storeNames: [],
			imageURI: undefined,
			imageData: undefined,
			itemName: "",
			itemType: undefined,
			unitID: undefined,
			unitName: undefined,
			purchasePrice: 0,
			salesPrice: 0,
			hsnCode: "",
			gst: 0,
			reorederLevel: "",
			priorityID: undefined,
			priorityName: undefined,
			isExpiryDateMandatory: true,
			itemNameValidationFailed: false,
			itemTypeValidationFailed: false,
			unitValidationFailed: false,
			gstValidationFailed: false,
			purchasePriceValidationFailed: false,
			salesPriceValidationFailed: false,
			priorityValidationFailed: false,
			reorderLevelValidationFailed: false,
			showLoader: true,
		};

		this.formScrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let { productCode } = this.state;
		let cid = this.context.userDetails.cid;

		Promise.all([getProductDetails(productCode), getItemTypes(cid)])
			.then((response) => {
				let data = response[0];
				let unitIndex = Configs.UNITS.findIndex(
					(element) => element.id === data.unit
				);
				let priorityIndex = Configs.ITEM_PRIORITIES.findIndex(
					(element) => element.id === data.priority
				);

				this.setState({
					showLoader: false,
					imageURI: data.image,
					itemName: data.name,
					itemType: data.type,
					unitID: data.unit,
					unitName: Configs.UNITS[unitIndex].name,
					purchasePrice: data.purchase_price,
					salesPrice: data.sales_price,
					isExpiryDateMandatory: data.expiry_date_mandatory === "Y",
					hsnCode: data.hsn,
					gst: data.gst,
					reorederLevel: data.reorder_level,
					priorityID: data.priority,
					priorityName: Configs.ITEM_PRIORITIES[priorityIndex].name,
					categories: (response[1] || []).map((v, i) => ({
						id: v.id,
						name: v.type,
					})),
				});
			})
			.catch((error) => console.log(error));
	};

	toggleExpiryDateMandatory = () =>
		this.setState({ isExpiryDateMandatory: !this.state.isExpiryDateMandatory });

	setItemType = (v) => {
		this.setState({
			itemType: v.name,
		});
	};

	setUnit = (v) => {
		this.setState({
			unitID: v.value,
			unitName: v.name,
		});
	};

	setPriority = (v) => {
		this.setState({
			priorityID: v.id,
			priorityName: v.name,
		});
	};

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					imageURI: undefined,
					imageData: undefined,
				});

				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: false,
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						this.setState({
							imageURI: result.uri,
							imageData: getFileData(result),
						});
					}
				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an icon");
			}
		});
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
				itemNameValidationFailed: false,
				itemTypeValidationFailed: false,
				unitValidationFailed: false,
				gstValidationFailed: false,
				purchasePriceValidationFailed: false,
				salesPriceValidationFailed: false,
				priorityValidationFailed: false,
				reorderLevelValidationFailed: false,
			},
			() => {
				let {
					itemName,
					itemType,
					unitID,
					purchasePrice,
					salesPrice,
					gst,
					reorederLevel,
					priorityID,
				} = this.state;
				if (itemName.trim().length === 0) {
					this.setState({ itemNameValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (typeof itemType === "undefined") {
					this.setState({ itemTypeValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (typeof unitID === "undefined") {
					this.setState({ unitValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (gst.trim().length > 0 && !isNumber(gst)) {
					this.setState({ gstValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (isNumber(gst) && parseFloat(gst) < 0) {
					this.setState({ gstValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (
					!isNumber(purchasePrice) ||
					(isNumber(purchasePrice) && parseFloat(purchasePrice) <= 0)
				) {
					this.setState({ purchasePriceValidationFailed: true });
					return false;
				} else if (
					!isNumber(salesPrice) ||
					(isNumber(salesPrice) && parseFloat(salesPrice) <= 0)
				) {
					this.setState({ salesPriceValidationFailed: true });
					return false;
				} else if (typeof priorityID === "undefined") {
					this.setState({ priorityValidationFailed: true });
					return false;
				} else if (
					!isNumber(reorederLevel) ||
					(isNumber(reorederLevel) && parseFloat(reorederLevel) < 0)
				) {
					this.setState({ reorderLevelValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let reqObj = {
						id: this.state.productID,
						cid: this.context.userDetails.cid,
						name: itemName,
						type: itemType,
						unit: unitID,
						hsn: this.state.hsnCode,
						gst: gst,
						purchase_price: purchasePrice,
						sales_price: salesPrice,
						priority: priorityID,
						reorder_level: reorederLevel,
						expiry_date_mandatory: this.state.isExpiryDateMandatory ? "Y" : "N",
					};

					if (typeof this.state.imageData !== "undefined") {
						reqObj.image = this.state.imageData;
					}

					manageProduct(reqObj)
						.then((response) => {
							this.setState(
								{
									showLoader: false,
								},
								() => {
									this.props.navigation.navigate("Items");
								}
							);
						})
						.catch((error) => {
							this.setState({ showLoader: false });
							console.log(error);
						});
				}
			}
		);
	};

	render = () => (
		<Container>
			<Header title={"Edit Item"} />
			<View style={styles.container}>
				<KeyboardAwareScrollView
					ref={this.formScrollViewRef}
					showsVerticalScrollIndicator={false}
				>
				<View style={[globalStyle.formBorder]}>
					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>Choose Image</Text>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.imagePicker}
							onPress={this.chooseIcon}
						>
							{typeof this.state.imageURI !== "undefined" ? (
								<Image
									style={styles.imageHeight}
									source={{ uri: this.state.imageURI }}
								/>
							) : (
								<Ionicons
									name="image"
									style={{ fontSize: 40, color: "#adadad" }}
								/>
							)}
						</TouchableOpacity>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.itemNameValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Item Name:</Text>
						<TextInput
							value={this.state.itemName}
							onChangeText={(itemName) => this.setState({ itemName })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
							placeholder="Enter Item Name"
						/>
					</View>

					<Dropdown
						label={"Item Type:"}
						placeholder="Select Item Type"
						value={this.state.itemType}
						items={this.state.categories}
						onChange={this.setItemType}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.itemTypeValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<Dropdown
						label={"Unit:"}
						placeholder="Select Unit"
						value={this.state.unitName}
						items={Configs.UNITS}
						onChange={this.setUnit}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.unitValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>HSN Code:</Text>
						<TextInput
							value={this.state.hsnCode}
							onChangeText={(hsnCode) => this.setState({ hsnCode })}
							style={styles.textfield}
							autoCompleteType="off"
							placeholder="Enter HSN Code"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.gstValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>GST:</Text>
						<TextInput
							value={this.state.gst.toString()}
							onChangeText={(gst) => this.setState({ gst })}
							style={styles.textfield}
							autoCompleteType="off"
							keyboardType="numeric"
							placeholder="0"
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
							value={this.state.purchasePrice.toString()}
							onChangeText={(purchasePrice) => this.setState({ purchasePrice })}
							style={styles.textfield}
							autoCompleteType="off"
							keyboardType="numeric"
							placeholder="0"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.salesPriceValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Sales Price:</Text>
						<TextInput
							value={this.state.salesPrice.toString()}
							onChangeText={(salesPrice) => this.setState({ salesPrice })}
							style={styles.textfield}
							autoCompleteType="off"
							keyboardType="numeric"
							placeholder="0"
						/>
					</View>

					<Dropdown
						label={"Priority:"}
						placeholder="Select Priority"
						value={this.state.priorityName}
						items={Configs.ITEM_PRIORITIES}
						onChange={this.setPriority}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.priorityValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<View
						style={[
							styles.fieldBox,
							this.state.reorderLevelValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Reorder Level:</Text>
						<TextInput
							value={this.state.reorederLevel}
							onChangeText={(reorederLevel) => this.setState({ reorederLevel })}
							style={styles.textfield}
							autoCompleteType="off"
							keyboardType="numeric"
							placeholder="0"
						/>
					</View>

					<View style={[styles.fieldBox,globalStyle.justifyContentFlexStart, !this.state.hasOpeningStock ? globalStyle.bbw0 : null]}>
						<Text style={styles.labelName}>
							{"Expiry Date is Mandatory? "}
						</Text>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.radioField}
							onPress={this.toggleExpiryDateMandatory}
						>
							<RadioButton status={this.state.isExpiryDateMandatory} />
							<Text style={styles.radioText}>Yes</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.radioField}
							onPress={this.toggleExpiryDateMandatory}
						>
							<RadioButton status={!this.state.isExpiryDateMandatory} />
							<Text style={styles.radioText}>No</Text>
						</TouchableOpacity>
					</View>
					</View>
					<TouchableOpacity style={styles.button} onPress={this.saveData}>
						<Text style={styles.textWhite}>Save</Text>
					</TouchableOpacity>
				</KeyboardAwareScrollView>
			</View>
			<OverlayLoader visible={this.state.showLoader} />
		</Container>
	);
}

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
// 	imagePicker: {
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		width:'60%',
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	},
// 	radioField: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		marginHorizontal: 5,
// 	},
// 	radioText: {
// 		marginLeft: 8,
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
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
