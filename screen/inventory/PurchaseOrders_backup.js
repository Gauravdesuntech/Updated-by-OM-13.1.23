import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
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

export default class PurchaseOrders extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
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
		this.setState({ isLoading: true });

		getPurchaseOrders(cid)
			.then((data) => {
				this.setState({
					isLoading: false,
					purchaseOrders: data,
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
		});

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.gotoPurchaseOrderDetails.bind(this, item)}>
			<View style={styles.row}>
				<View style={styles.leftPart}>
					<Text style={styles.name}>{"Request Number: #" + item.po_no}</Text>
					<Text style={styles.subText}>
						{"Date: " + moment(item.po_date, "YYYY-MM-DD").format("DD/MM/YYYY")}
					</Text>
					{/* <Text style={styles.subText}>{"Party: " + item.party_name}</Text> */}
					<Text style={styles.subText}>{"Amount: ₹" + item.total_amount}</Text>
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
				addAction={this.state.isLoading ? undefined : this.gotoAddPurchaseOrder}
			/>
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
// });
