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
	getRequestItemDetails,
	manageRequestItem,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class RequestItemDetails extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			poID:
				typeof props.route.params !== "undefined" ? props.route.params.reqID : 0,
			poNo:
				typeof props.route.params !== "undefined"
					? props.route.params.reqNo
					: null,
			isConverted:
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
		};
	}

	componentDidMount = () => {
		let { poNo } = this.state;
		getRequestItemDetails(poNo)
			.then((data) => {
				console.log("Response =>", data)
				this.setState({
					isLoading: false,
					poData: data,
					userCode: this.context.userDetails.user_code
				});
			})
			.catch((error) => console.log(error));		
	};

	gotoBack = () => this.props.navigation.goBack();

	toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	showDatepicker = () => this.setState({ isDatepickerOpen: true });

	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.invoiceDate;
		this.setState({
			isDatepickerOpen: false,
			invoiceDate: currentDate,
		});
	};

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

	submitRequest = (status) => {
		let { poData, poNo, poID } = this.state;
			let reqObj = {
				cid: this.context.userDetails.cid,
				status: status,
				approvedBy: this.context.userDetails.user_code,
				req_no: poNo,
				id: poID
			};

			this.setState({ showLoader: true });
			manageRequestItem(reqObj)
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
	};

	render = () => {
		return (
			<Container>
				<Header title={"Request Details"} />
				{this.state.isLoading ? (
					<Loader />
				) : (
					<>
					<View style={styles.container}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.itemInfoContainer}>
								<View style={[globalStyle.flexDirectionRow,globalStyle.mb10]}>
									<View style={globalStyle.flex1}>
										<Text style={styles.subText}>Request No.</Text>
										<Text style={styles.titleText}>
											{"#" + this.state.poNo}
										</Text>
									</View>
									<View style={globalStyle.flex1}>
										<Text style={styles.subText}>Requested By</Text>
										<Text style={styles.titleText}>
											{this.state.poData.full_name}
										</Text>
									</View>
								</View>
								<View style={globalStyle.flexDirectionRow}>
									<View style={globalStyle.flex1}>
										<Text style={styles.subText}>Date</Text>
										<Text style={styles.titleText}>
											{moment(this.state.poData.req_date, "YYYY-MM-DD").format(
												"DD/MM/YYYY"
											)}
										</Text>
									</View>
								</View>
							</View>

							<View style={styles.theadRow}>
								<View style={globalStyle.flex1}>
									<Text style={styles.titleText}>Name</Text>
								</View>
								<View style={[globalStyle.flex05,globalStyle.alignItemsCenter]}>
									<Text style={styles.titleText}>Quantity</Text>
								</View>
								<View style={[globalStyle.flex1,globalStyle.alignItemsFlexEnd]}>
									<Text style={styles.titleText}>Description</Text>
								</View>
							</View>

							{(this.state.poData.items || []).map((item) => (
								<View key={item.id.toString()} style={styles.tbodyRow}>
									<View style={globalStyle.flex1}>
										<Text style={styles.subText}>{item.product_name}</Text>
									</View>
									<View style={[globalStyle.flex05,globalStyle.alignItemsCenter]}>
										<Text style={styles.subText}>{item.quantity}</Text>
									</View>
									<View style={[globalStyle.flex1,globalStyle.alignItemsFlexEnd]}>
										<Text style={styles.subText}>{item.description}</Text>
									</View>
								</View>
							))}
						</ScrollView>
					</View>
					
					{!this.state.isConverted ? (
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
					</>
				)}

				<OverlayLoader visible={this.state.showLoader} />
			</Container>
		);
	};
}

// const windowHeight = Dimensions.get("window").height;
// const windowWidth = Dimensions.get("window").width;
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
// 	theadRow: {
// 		flex: 1,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 8,
// 		paddingVertical: 15,
// 		backgroundColor: Colors.lightGrey,
// 		borderBottomColor: "#ddd",
// 		borderBottomWidth: 1,
// 	},
// 	tbodyRow: {
// 		flex: 1,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 5,
// 		paddingVertical: 5,
// 		borderBottomColor: "#ddd",
// 		borderBottomWidth: 1,
// 	},
// 	button: {
// 		width: "100%",
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
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0, 0, 0, 0.5)",
// 	},
// 	modalBody: {
// 		backgroundColor: Colors.white,
// 		width: Math.floor((windowWidth * 90) / 100),
// 		minHeight: Math.floor(windowHeight / 3),
// 		borderRadius: 3,
// 		elevation: 5,
// 	},
// 	modalHeader: {
// 		width: "100%",
// 		height: 50,
// 		flexDirection: "row",
// 		backgroundColor: Colors.primary,
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		borderTopLeftRadius: 5,
// 		borderTopRightRadius: 5,
// 		paddingHorizontal: 10,
// 	},
// 	modalTitle: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 		color: Colors.white,
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
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
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
// });
