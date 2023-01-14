import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { Header, Dropdown, OverlayLoader } from "../../component";
import { isNumber } from "../../utils/Util";
import {
	getProducts,
	getStoreNames,
	getTotalAvailableStock,
	transferStock,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class StockTransfer extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			products: [],
			sourceStoreNames: [],
			destinationStoreNames: [],
			itemCode: undefined,
			itemName: "",
			itemUnit: "",
			sourceStoreID: undefined,
			sourceStoreName: undefined,
			destinationStoreID: undefined,
			destinationStoreName: undefined,
			itemAvailableStock: "",
			quantity: "",
			itemNameValidationFailed: false,
			sourceStoreValidationFailed: false,
			destionationStoreValidationFailed: false,
			quantityValidationFailed: false,
			showLoader: true,
		};

		this.formScrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let cid = this.context.userDetails.cid;

		Promise.all([getStoreNames(cid), getProducts({ cid })])
			.then((response) => {
				this.setState({
					showLoader: false,
					sourceStoreNames: response[0],
					destinationStoreNames: response[0],
					products: (response[1] || []).map((v, i) => ({
						id: v.product_code,
						name: v.name,
						unit: v.unit,
						total_stock: v.total_stock,
					})),
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ showLoader: false });
			});
	};

	setItemData = (item) => {
		this.setState({
			itemCode: item.id,
			itemName: item.name,
			itemUnit: item.unit,
			itemAvailableStock: item.total_stock,
			sourceStoreID: undefined,
			sourceStoreName: undefined,
			destinationStoreID: undefined,
			destinationStoreName: undefined,
			quantity: "",
		});
	};

	setAvailableQuantity = (v) => {
		let { itemCode } = this.state;
		if (typeof itemCode !== "undefined") {
			this.setState(
				{
					sourceStoreID: v.id,
					sourceStoreName: v.name,
					quantity: "",
				},
				() => {
					this.setState({ showLoader: true });
					getTotalAvailableStock(itemCode, v.id)
						.then((data) => {
							this.setState({
								showLoader: false,
								itemAvailableStock: data.total_stock,
							});
						})
						.catch((error) => console.log(error));
				}
			);
		} else {
			Alert.alert("Warning", "Please select an item name");
		}
	};

	setDestionationStore = (v) => {
		this.setState({
			destinationStoreID: v.id,
			destinationStoreName: v.name,
			quantity: "",
		});
	};

	saveData = () => {
		this.setState(
			{
				itemNameValidationFailed: false,
				sourceStoreValidationFailed: false,
				destionationStoreValidationFailed: false,
				quantityValidationFailed: false,
			},
			() => {
				let {
					itemCode,
					sourceStoreID,
					destinationStoreID,
					quantity,
					itemAvailableStock,
				} = this.state;

				if (typeof itemCode === "undefined") {
					this.setState({ itemNameValidationFailed: true });
					return false;
				} else if (typeof sourceStoreID === "undefined") {
					this.setState({ sourceStoreValidationFailed: true });
					return false;
				} else if (typeof destinationStoreID === "undefined") {
					this.setState({ destionationStoreValidationFailed: true });
					return false;
				} else if (sourceStoreID === destinationStoreID) {
					Alert.alert(
						"Warning",
						"Select different store for source and destionation."
					);
				} else if (
					!isNumber(quantity) ||
					(isNumber(quantity) && parseFloat(quantity) <= 0)
				) {
					this.setState({ quantityValidationFailed: true });
					return false;
				} else if (parseFloat(quantity) > parseFloat(itemAvailableStock)) {
					Alert.alert("Warning", "Insufficient quantity");
				} else {
					this.setState({ showLoader: true });
					let reqObj = {
						cid: this.context.userDetails.cid,
						product_code: itemCode,
						unit: this.state.itemUnit,
						source_store_id: sourceStoreID,
						destination_store_id: destinationStoreID,
						quantity: quantity,
					};

					transferStock(reqObj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								this.setState(
									{
										showLoader: false,
										itemCode: undefined,
										itemName: "",
										itemUnit: "",
										sourceStoreID: undefined,
										sourceStoreName: undefined,
										destinationStoreID: undefined,
										destinationStoreName: undefined,
										itemAvailableStock: "",
										quantity: "",
									},
									() => {
										Alert.alert("Success", response.message);
									}
								);
							} else {
								Alert.alert("Failure", response.message);
							}
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	render = () => (
		<Container>
			<Header title={"Transfer Stock"} />
			<View style={styles.container}>
				<ScrollView
					ref={this.formScrollViewRef}
					showsVerticalScrollIndicator={false}
				>
					<View style={globalStyle.formBorder}>
					<Dropdown
						label={"Item:"}
						placeholder="Select an Item Name"
						value={this.state.itemName}
						items={this.state.products}
						onChange={this.setItemData}
						labelStyle={styles.labelName}
						textFieldStyle={[styles.textfield, globalStyle.width60]}
						style={[
							styles.fieldBox,
							this.state.itemNameValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>Available Quantity:</Text>
						<TextInput
							editable={false}
							style={[styles.textfield, globalStyle.width60]}
							value={this.state.itemAvailableStock + " " + this.state.itemUnit}
						/>
					</View>

					<Dropdown
						label={"Source Store:"}
						value={this.state.sourceStoreName}
						items={this.state.sourceStoreNames}
						onChange={this.setAvailableQuantity}
						labelStyle={styles.labelName}
						textFieldStyle={[styles.textfield, globalStyle.width60]}
						style={[
							styles.fieldBox,
							this.state.sourceStoreValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>

					<Dropdown
						label={"Destination Store:"}
						value={this.state.destinationStoreName}
						items={this.state.destinationStoreNames}
						onChange={this.setDestionationStore}
						labelStyle={styles.labelName}
						textFieldStyle={[styles.textfield, globalStyle.width60]}
						style={[
							styles.fieldBox,
							this.state.destionationStoreValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>

					<View
						style={[
							styles.fieldBox,
							this.state.quantityValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Quantity:</Text>
						<TextInput
							value={this.state.quantity}
							onChangeText={(quantity) => this.setState({ quantity })}
							style={[styles.textfield, globalStyle.width60]}
							autoCompleteType="off"
							keyboardType="number-pad"
							placeholder="Enter Quantity"
						/>
					</View>
					</View>

					<TouchableOpacity
						activeOpacity={1}
						style={styles.button}
						onPress={this.saveData}
					>
						<Text style={styles.textWhite}>Save</Text>
					</TouchableOpacity>
				</ScrollView>
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
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
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
