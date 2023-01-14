import React from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	FlatList,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getConsumptions } from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class Consumption extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			activeTabKey: "P",
			consumptions: [],
		};
	}

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener(
			"focus",
			this.onScreenFocus
		);
	}

	onScreenFocus = () => {
		console.log(this.context.userDetails)
		this.setState(
			{
				isLoading: true,
				activeTabKey: "P",
				consumptions: [],
			},
			() => {
				this.loadConsumptions();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadConsumptions = () => {
		let cid = this.context.userDetails.cid;
		let status = this.state.activeTabKey;

		this.setState(
			{
				isLoading: true,
			},
			() => {
				getConsumptions(cid, status)
					.then((data) => {
						this.setState({
							isLoading: false,
							consumptions: data,
						});
					})
					.catch((error) => console.log(error));
			}
		);
	};

	setActiveTab = (key) =>
		this.setState(
			{
				activeTabKey: key,
			},
			() => {
				this.loadConsumptions();
			}
		);

	gotoAddConsumption = () => {
		this.props.navigation.navigate("AddConsumption", {
			status: this.state.activeTabKey === "A" ? "A" : "P",
		});
	};
	checkAddActionPermissions = () => {
		if (this.state.isLoading == false) {
			if (this.context.userDetails.action_types.includes("Add")) {
				console.log("Hello");
				return this.gotoAddConsumption;
			} else {
				console.log("Bye");
				return undefined
			}
		} else {
			return undefined
		}
	}

	gotoConsumptionDetails = (id) =>
		this.props.navigation.navigate("ConsumptionDetails", {
			consumptionID: id,
			status: this.state.activeTabKey,
		});

	renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.CardBox}
			onPress={this.context.userDetails.action_types.includes("Edit") ? this.gotoConsumptionDetails.bind(this, item.id): null 
				}
		>
			<View
				style={[globalStyle.flexDirectionRow,globalStyle.justifyContentSpaceBetween,globalStyle.pr5]}
			>
				<Text style={styles.labelName}>
					{"ID: "}
					<Text style={styles.mc}>{"#" + item.id}</Text>
				</Text>
				<Text
					style={[
						styles.labelName,
						this.state.activeTabKey === "P"
							? styles.pendingStatus
							: this.state.activeTabKey === "A"
							? styles.approveStatus
							: styles.rejectStatus,
					]}
				>
					{this.state.activeTabKey === "P"
						? "Pending"
						: this.state.activeTabKey === "A"
						? "Approved"
						: "Rejected"}
				</Text>
			</View>
			<Text style={styles.labelName}>
				{"Reference No. "}
				<Text style={styles.mc}>{item.reference_no}</Text>
			</Text>
			<Text style={styles.labelName}>
				{"Requested By. "}
				<Text style={styles.mc}>{item.requested_user ? item.requested_user : 'N/A'}</Text>
			</Text>
			<Text style={styles.labelName}>
				{"Date: "}
				<Text style={styles.mc}>
					{moment(item.consumption_date, "YYYY-MM-DD").format("DD/MM/YYYY")}
				</Text>
			</Text>
		</TouchableOpacity>
	);

	render = () => (
		<Container>
			<Header title={"Material Request"} 
			addAction={this.checkAddActionPermissions()} 
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
						Requisition
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

				<TouchableOpacity
					onPress={this.setActiveTab.bind(this, "R")}
					style={[
						styles.tab,
						this.state.activeTabKey === "R" ? styles.activeTab : null,
					]}
				>
					<Text
						style={
							this.state.activeTabKey === "R"
								? styles.activeText
								: styles.inActiveText
						}
					>
						Rejected
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.listContainer}>
				{this.state.isLoading ? (
					<Loader />
				) : (
					<FlatList
						ListEmptyComponent={() => <ListEmpty />}
						data={this.state.consumptions}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderItem}
						initialNumToRender={this.state.consumptions.length}
						refreshing={this.state.isLoading}
						onRefresh={this.loadConsumptions}
						contentContainerStyle={
							this.state.consumptions.length === 0 ? styles.container : null
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
// 		padding: 8,
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
// 	CardBox: {
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
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
// 		fontSize: 12,
// 		paddingLeft: 4,
		
// 		color: Colors.textColor,
// 		opacity: 0.9,
// 		textAlign: "left",
// 		fontWeight: "bold",
// 		flex: 1,
// 		width: "100%",
// 	},
// 	mc: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		marginLeft: 5,
// 		fontSize: 12,
// 		fontWeight: "500",
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
