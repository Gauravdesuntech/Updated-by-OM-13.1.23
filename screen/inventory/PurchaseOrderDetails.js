import React from "react";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Alert,
	TextInput,
	Modal,
	Dimensions,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { Header, DatePicker, Loader, OverlayLoader } from "../../component";
import { getFormattedDate } from "../../utils/Util";
import {
	getPurchaseOrderDetails,
	convertToPurchase,
	approvePurchaseRequest,
	rejectPurchaseRequest
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";


export default class PurchaseOrderDetails extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			poID:
				typeof props.route.params !== "undefined" ? props.route.params.poID : 0,
			poNo:
				typeof props.route.params !== "undefined"
					? props.route.params.poNo
					: null,
			isConverted:
				typeof props.route.params !== "undefined"
					? props.route.params.isConverted
					: false,
			isApproved:
				typeof props.route.params !== "undefined"
					? props.route.params.isConverted
					: false,		
			poData: null,
			invoiceNo: "",
			invoiceDate: new Date(),
			isDatepickerOpen: false,
			isModalOpen: false,
			invoiceNoValidationFailed: false,
			showLoader: false,
			userCode: undefined,
			approveClicked: 0
		};
	}

	componentDidMount = () => {
		let { poNo } = this.state;
		getPurchaseOrderDetails(poNo)
			.then((data) => {
				this.setState({
					isLoading: false,
					poData: data,
					userCode: this.context.userDetails.user_code
				});
			})
			.catch((error) => console.log(error));		
	};

	gotoPurchaseEdit = () => this.props.navigation.navigate('EditPurchaseOrder',{poNo : this.state.poNo, poData: this.state.poData});

	toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	showDatepicker = () => this.setState({ isDatepickerOpen: true });

	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.invoiceDate;
		this.setState({
			isDatepickerOpen: false,
			invoiceDate: currentDate,
		});
	};

	approveRequest = () => {
		let { poNo } = this.state;
		let cid = this.context.userDetails.cid;
		let reqObj = {
			cid: cid,
			poNo: poNo,
			updated_by: this.context.userDetails.user_code
		};
		this.setState({ 
			showLoader: true ,
			approveClicked: this.state.approveClicked+1
		},()=>{
			approvePurchaseRequest(reqObj)
			.then((data) => {
				if(data.check == 'success'){
					Alert.alert(
						'Request approved successfully',
						'',
						[
							{ text: "OK", onPress: () => console.log("OK Pressed") }
						  ]
					)
				}else{
					Alert.alert(
						'Failed to process',
						'',
						[
							{ text: "OK", onPress: () => console.log("OK Pressed") }
						  ]
					)
				}
				this.setState({
					showLoader: false,
					userCode: this.context.userDetails.user_code
				});
			})
			.catch((error) => console.log(error));
		});
	}


	rejectRequest = () => {
		let { poNo } = this.state;
		let cid = this.context.userDetails.cid;
		let reqObj = {
			cid: cid,
			poNo: poNo,
			updated_by: this.context.userDetails.user_code
		};
		this.setState({ 
			showLoader: true ,
		},()=>{
			rejectPurchaseRequest(reqObj)
			.then((data) => {
				if(data.check == 'success'){
					Alert.alert(
						'Request rejected successfully',
						'',
						[
							{ text: "OK", onPress: () => this.props.navigation.goBack() }
						  ]
					)
				}else{
					Alert.alert(
						'Failed to process',
						'',
						[
							{ text: "OK", onPress: () => console.log("OK Pressed") }
						  ]
					)
				}
				this.setState({
					showLoader: false,
					userCode: this.context.userDetails.user_code
				});
			})
			.catch((error) => console.log(error));
		});
	}

	saveData = () => {
		this.setState(
			{
				invoiceNoValidationFailed: false,
			},
			() => {
				let { invoiceNo } = this.state;
				if (invoiceNo.trim().length === 0) {
					this.setState({ invoiceNoValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let cid = this.context.userDetails.cid;
					let reqObj = {
						cid: cid,
						po_id: this.state.poID,
						invoice_no: invoiceNo,
						invoice_date: getFormattedDate(this.state.invoiceDate),
						updated_by: this.context.userDetails.user_code
					};

					convertToPurchase(reqObj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								this.setState({
									showLoader: false,
									invoiceNo: "",
									invoiceDate: new Date(),
									isModalOpen: false,
									isConverted: true,
								});
								Alert.alert("Success", response.message);
							} else {
								this.setState({ showLoader: false });
								Alert.alert("Error", response.message);
							}
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	render = () => {
		return (
			<Container>
				<Header title={"Request Details"} />
				{this.state.isLoading ? (
					<Loader />
				) : (
					<View style={styles.container}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.itemInfoContainer}>
								<View style={{ flexDirection: "row", marginBottom: 10 }}>
									<View style={{ flex: 1 }}>
										<Text style={styles.subText}>Request No.</Text>
										<Text style={styles.titleText}>
											{"#" + this.state.poNo}
										</Text>
									</View>
									<View style={{ flex: 1 }}>
										<Text style={styles.subText}>Date</Text>
										<Text style={styles.titleText}>
											{moment(this.state.poData.po_date, "YYYY-MM-DD").format(
												"DD/MM/YYYY"
											)}
										</Text>
									</View>
								</View>
							</View>

							<View style={styles.theadRow}>
								<View style={{ flex: 1 }}>
									<Text style={styles.titleText}>Name</Text>
								</View>
								<View style={{ flex: 0.5, alignItems: "flex-end" }}>
									<Text style={styles.titleText}>Price</Text>
								</View>
								<View style={{ flex: 0.5, alignItems: "center" }}>
									<Text style={styles.titleText}>Quantity</Text>
								</View>
								<View style={{ flex: 0.5, alignItems: "flex-end" }}>
									<Text style={styles.titleText}>Amount</Text>
								</View>
							</View>

							{(this.state.poData.items || []).map((item) => (
								<View key={item.id.toString()} style={styles.tbodyRow}>
									<View style={{ flex: 1, flexDirection:'row' }}>
										<Text style={styles.subText}>{item.product_name}  </Text>
										{this.context.userDetails.action_types.includes("Edit") ? <TouchableOpacity onPress={this.gotoPurchaseEdit}><Ionicons name="create-outline" size={14} style={{color:Colors.textColor,opacity: 0.8}} /></TouchableOpacity> : null }
										
									</View>
									<View style={{ flex: 0.5, alignItems: "flex-end" }}>
										<Text style={styles.subText}>{item.price}</Text>
									</View>
									<View style={{ flex: 0.5, alignItems: "center" }}>
										<Text style={styles.subText}>{item.quantity}</Text>
										<Text style={styles.subText}>{item.unit}</Text>
									</View>
									<View style={{ flex: 0.5, alignItems: "flex-end" }}>
										<Text style={styles.subText}>{item.amount}</Text>
									</View>
								</View>
							))}

							<View
								style={[
									styles.tbodyRow,
									{ borderBottomWidth: 0, marginBottom: 25 },
								]}
							>
								<View style={{ flex: 1 }}>
									<Text style={styles.titleText}>Total:</Text>
								</View>
								<View style={{ flex: 1, alignItems: "flex-end" }}>
									<Text style={styles.titleText}>
										<FontAwesome
											name="rupee"
											color={Colors.textColor}
											size={12}
										/>
										{this.state.poData.total_amount}
									</Text>
								</View>
							</View>

							{!this.state.isConverted && this.state.approveClicked === 0 ? (
								<View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
								<TouchableOpacity
									style={styles.buttonSec}
									onPress={this.approveRequest}
								>
									<Text style={styles.textWhite}>Approve</Text>
								</TouchableOpacity>
								
								{/* <TouchableOpacity
									style={styles.button}
									onPress={this.gotoPurchaseEdit}
								>
									<Text style={styles.textWhite}>Edit</Text>
								</TouchableOpacity> */}
								<TouchableOpacity
									style={[styles.buttonSec, {backgroundColor: Colors.danger}]}
									onPress={this.rejectRequest}
								>
									<Text style={styles.textWhite}>Reject</Text>
								</TouchableOpacity>
								</View>
							) : this.state.isApproved ? ( 
								<TouchableOpacity
									style={styles.button}
									onPress={this.toggleModal}
								>
									<Text style={styles.textWhite}>Convert to Purchase</Text>
								</TouchableOpacity>
							) : null}
						</ScrollView>
					</View>
				)}

				<Modal
					animationType="fade"
					transparent={true}
					statusBarTranslucent={true}
					visible={this.state.isModalOpen}
					onRequestClose={this.toggleModal}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalBody}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Purchase Details</Text>

								<TouchableOpacity
									activeOpacity={1}
									style={{ padding: 4 }}
									onPress={this.toggleModal}
								>
									<Ionicons
										name="close-circle-outline"
										color={Colors.white}
										size={24}
									/>
								</TouchableOpacity>
							</View>

							<View style={{ padding: 15 }}>
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
										autoCapitalize="characters"
										placeholder="Enter Invoice No."
									/>
								</View>

								<DatePicker
									onPress={this.showDatepicker}
									show={this.state.isDatepickerOpen}
									onChange={this.onChangeDate}
									date={this.state.invoiceDate}
									mode={"date"}
									label={"Invoice Date:"}
									style={{ width: "100%" }}
								/>

								<TouchableOpacity style={styles.button} onPress={this.saveData}>
									<Text style={styles.textWhite}>Submit</Text>
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

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	titleText: {
		fontSize: 14,
		color: Colors.textColor,
		fontWeight: "bold",
	},
	subText: {
		color: Colors.textColor,
		opacity: 0.8,
		fontSize: 14,
		lineHeight: 22,
	},
	itemInfoContainer: {
		height: 80,
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	theadRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 15,
		backgroundColor: Colors.lightGrey,
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
	},
	tbodyRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 5,
		paddingVertical: 5,
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
	},
	buttonSec: {
		width: 150,
		alignItems: "center",
		padding: 10,
		backgroundColor: Colors.primary,
		// shadowColor: "#000",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 2,
		// },
		// shadowOpacity: 0.23,
		// shadowRadius: 2.62,
		// elevation: 4,
		borderRadius: 20,
		color: "#fff",
		marginVertical: 10,
	},
	button: {
		width: "100%",
		alignItems: "center",
		backgroundColor: Colors.primary,
		padding: 10,
		// shadowColor: "#000",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 2,
		// },
		// shadowOpacity: 0.23,
		// shadowRadius: 2.62,
		// elevation: 4,
		borderRadius: 20,
		color: "#fff",
		marginVertical: 10,
	},
	textWhite: {
		color: "#fff",
		fontWeight: "bold",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalBody: {
		backgroundColor: Colors.white,
		width: Math.floor((windowWidth * 90) / 100),
		minHeight: Math.floor(windowHeight / 3),
		borderRadius: 3,
		elevation: 5,
	},
	modalHeader: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "space-between",
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		paddingHorizontal: 10,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.white,
	},
	fieldBox: {
		width: "100%",
		overflow: "hidden",
		flexDirection: "row",
		padding: 5,
		borderRadius: 3,
		borderColor: "#ddd",
		borderWidth: 1,
		backgroundColor: "#fff",
		height: 50,
		justifyContent: "space-between",
		marginBottom: 5,
		marginTop: 5,
		// shadowColor: "#999",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 1,
		// },
		// shadowOpacity: 0.22,
		// shadowRadius: 2.22,
		// elevation: 3,
	},
	labelName: {
		color: Colors.textColor,
		lineHeight: 40,
		fontSize: 14,
		paddingLeft: 4,
	},
	textfield: {
		backgroundColor: "#fff",
		height: 40,
		
		fontSize: 12,
		color: Colors.textColor,
		textAlign: "right",
		width: "60%",
		padding: 5,
	},
	errorFieldBox: {
		borderWidth: 1,
		borderColor: Colors.tomato,
	},
});
