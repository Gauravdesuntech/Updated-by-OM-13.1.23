import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	FlatList,
} from "react-native";
import { Colors } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import ListEmpty from "../../component/ListEmpty";
import Loader from "../../component/Loader";
import { getAnimalIncidentReports } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import { getFormattedDate, convertDate } from "../../utils/Util";
import styles from "../../config/Styles";
const tabHeight = 50;

export default class IncidentReporting extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			activeTabKey: 'animal',
			id:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.id
					: 0,
			enclosureID: typeof this.props.route.params !== "undefined"
				? this.props.route.params.enclosureID
				: undefined,
		};
	}



	componentDidMount = () => {
		this.loadAnimalIncidents();
	};

	loadAnimalIncidents = () => {
		let ref = this.state.id;
		let ref_id = this.state.activeTabKey;

		if (this.state.activeTabKey != 'animal') {
			ref = this.state.enclosureID;
			ref_id = this.state.activeTabKey;
		}
		getAnimalIncidentReports(ref, ref_id)
			.then((data) => {
				console.log(data)
				this.setState({ isLoading: false });
				this.context.setAnimalIncidents(data);
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadAnimalIncidents();
			}
		);
	};

	setActiveTab = (key) =>
		this.setState(
			{
				activeTabKey: key,
			},
			() => this.loadAnimalIncidents()
		);

	gotoAddIncidentRecord = () =>
		this.props.navigation.navigate("IncidentRecordEntry");

	gotoEditIncidentRecord = (id) =>
		this.props.navigation.navigate("IncidentRecordEntry", { id: id });

	renderItem = ({ item }) => (
		<TouchableWithoutFeedback
			onPress={this.gotoEditIncidentRecord.bind(this, item.id)}
		>
			<View style={styles.CardBox}>
				<Text style={[styles.labelName,styles.pd0]}>
					Incident Type : <Text style={[styles.textfield,styles.width60]}>{item?.type_name}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Description :{" "}
					<Text style={[styles.textfield,styles.width60]} numberOfLines={2} ellipsizeMode="tail">
						{item.description}
					</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Solution :{" "}
					<Text style={[styles.textfield,styles.width60]} numberOfLines={2} ellipsizeMode="tail">
						{item.solution}
					</Text>
				</Text>

				<Text style={[styles.labelName,styles.pd0]}>
					Reported By : <Text style={[styles.textfield,styles.width60]}>{item?.full_name}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Status : <Text style={[styles.textfield,styles.width60]}>{item?.status == 'P' ? 'Pending' : item?.status == 'O' ? 'Ongoing' : 'Closed'}</Text>
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);

	render = () => (
		<View style={styles.container}>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<>
					{/* <View style={styles.tabContainer}>
						<TouchableOpacity
							onPress={this.setActiveTab.bind(this, "animal")}
							style={[
								styles.tab,
								this.state.activeTabKey === "animal" ? styles.activeTab : null,
							]}
						>
							<Text
								style={
									this.state.activeTabKey === "animal"
										? styles.activeText
										: styles.inActiveText
								}
							>
								Individual
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this.setActiveTab.bind(this, "enclosure")}
							style={[
								styles.tab,
								this.state.activeTabKey === "enclosure" ? styles.activeTab : null,
							]}
						>
							<Text
								style={
									this.state.activeTabKey === "enclosure"
										? styles.activeText
										: styles.inActiveText
								}
							>
								Enclosure
							</Text>
						</TouchableOpacity>

					</View> */}
					<FlatList
						ListEmptyComponent={() => <ListEmpty />}
						data={this.context.animalIncidents}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderItem}
						initialNumToRender={this.context.animalIncidents.length}
						refreshing={this.state.isLoading}
						onRefresh={this.handelRefresh}
						contentContainerStyle={
							this.context.animalIncidents.length === 0 ? styles.container : null
						}
					/>
				</>
			)}
			{/* <TouchableOpacity
				style={styles.button}
				onPress={this.gotoAddIncidentRecord}
			>
				<Ionicons name="add" style={styles.plusIcon} />
			</TouchableOpacity> */}
		</View>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
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
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 3,
// 	},
// 	labelName: {
// 		fontSize: 12,
// 		paddingLeft: 4,
		
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		fontWeight: "bold",
// 		flex: 1,
// 		width: "100%",
// 	},
// 	mc: {
// 		color: Colors.textColor,
// 		opacity: 0.9,
// 		marginLeft: 5,
// 		fontSize: 12,
// 		fontWeight: "500",
// 	},
// 	button: {
// 		alignItems: "center",
// 		backgroundColor: Colors.primary,
// 		width: 50,
// 		height: 50,
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 2,
// 		},
// 		shadowOpacity: 0.23,
// 		shadowRadius: 2.62,
// 		elevation: 4,
// 		borderRadius: 50 / 2,
// 		position: "absolute",
// 		bottom: 20,
// 		right: 20,
// 	},
// 	plusIcon: {
// 		fontSize: 24,
// 		color: Colors.white,
// 		position: "absolute",
// 		bottom: 12.5,
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
// });
