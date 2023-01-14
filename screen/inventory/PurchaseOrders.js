import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	Dimensions,
	TouchableOpacity
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getPurchaseOrders } from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

//P for today
//A for previous pendings

export default class PurchaseOrders extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			activeTabKey: "P",
			purchaseOrders: [],
		};
	}

	componentDidMount = () => {
		this.focusListener = this.props.navigation.addListener(
			"focus",
			this.loadPurchaseOrders
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadPurchaseOrders = () => {
		let cid = this.context.userDetails.cid;
		let key = this.state.activeTabKey;
		this.setState({ isLoading: true });

		getPurchaseOrders(cid, key)
			.then((data) => {
				this.setState({
					isLoading: false,
					purchaseOrders: data.data,
				});
			})
			.catch((error) => console.log(error));
	};

	gotoAddPurchaseOrder = () =>
		this.props.navigation.navigate("AddPurchaseOrder");

	gotoPurchaseOrderDetails = (item) =>
		this.props.navigation.navigate("PurchaseOrderDetails", {
			poID: item.id,
			poNo: item.po_no,
			isConverted: item.is_converted === "Y",
			isApproved: item.is_approved === "Y",
		});

		setActiveTab = (key) =>
		this.setState(
			{
				activeTabKey: key,
			},
			() => {
				this.loadPurchaseOrders()
			}
		);


	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.context.userDetails.action_types.includes("Edit") ? this.gotoPurchaseOrderDetails.bind(this, item): null}
		>
			<View style={styles.row}>
				<View style={styles.leftPart}>
					<Text style={styles.name}>{"Request By: " + item.user_name}</Text>
					<Text style={styles.name}>{"Department: " + item.dept_name}</Text>
					<Text style={styles.subText}>
						{"Date: " + moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
					</Text>
					{/* <Text style={styles.subText}>{"Party: " + item.party_name}</Text> */}
					<Text style={styles.subText}>{"Amount: ₹" + item.amount}</Text>
				</View>
				<View style={styles.rightPart}>
					<Ionicons name="chevron-forward" style={styles.iconStyle} />
				</View>
			</View>
		</TouchableHighlight>
	);
	

	render = () => (
		<Container>
			<Header
				title={"Purchase Request"}
				addAction={this.state.isLoading==false && this.context.userDetails.action_types.includes("Add") ? this.gotoAddPurchaseOrder :
				undefined }
			/>
			<View style={styles.tabContainer}>
			<TouchableOpacity
					onPress={this.setActiveTab.bind(this, "P")}
					style={[
						styles.tab,
						this.state.activeTabKey === "P" ? styles.activeTab : null,
					]}
				>
					<Text
						style={
							this.state.activeTabKey === "P"
								? styles.activeText
								: styles.inActiveText
						}
					>
						Pending
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={this.setActiveTab.bind(this, "A")}
					style={[
						styles.tab,
						this.state.activeTabKey === "A" ? styles.activeTab : null,
					]}
				>
					<Text
						style={
							this.state.activeTabKey === "A"
								? styles.activeText
								: styles.inActiveText
						}
					>
						Approved
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.listContainer}>
				{this.state.isLoading ? (
					<Loader />
				) : (
					<FlatList
						ListEmptyComponent={() => <ListEmpty />}
						data={this.state.purchaseOrders}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderListItem}
						initialNumToRender={this.state.purchaseOrders.length}
						refreshing={this.state.isLoading}
						onRefresh={this.loadPurchaseOrders}
						contentContainerStyle={
							this.state.purchaseOrders.length === 0 ? styles.container : null
						}
					/>
				)}
			</View>
		</Container>
	);
}

// const styles = StyleSheet.create({
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
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
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
// 	tabContainer: {
// 		width: "100%",
// 		height: tabHeight,
// 		flexDirection: "row",
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#d1d1d1",
// 		borderTopWidth: 1,
// 		borderTopColor: Colors.primary,
// 		elevation: 1,
// 	},
// 	tab: {
// 		flex: 1,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		height: tabHeight,
// 	},
// 	underlineStyle: {
// 		backgroundColor: Colors.primary,
// 		height: 3,
// 	},
// 	activeTab: {
// 		height: tabHeight - 1,
// 		borderBottomWidth: 2,
// 		borderBottomColor: Colors.primary,
// 	},
// 	activeText: {
// 		fontSize: 14,
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	inActiveText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	listContainer: {
// 		flex: 1,
// 		padding: 8,
// 		height: windowHeight - tabHeight,
// 	},
// 	pendingStatus: {
// 		textAlign: "right",
// 		color: Colors.warning,
// 		fontStyle: "italic",
// 	},
// 	approveStatus: {
// 		textAlign: "right",
// 		color: Colors.success,
// 		fontStyle: "italic",
// 	},
// 	rejectStatus: {
// 		textAlign: "right",
// 		color: Colors.danger,
// 		fontStyle: "italic",
// 	},
// });
