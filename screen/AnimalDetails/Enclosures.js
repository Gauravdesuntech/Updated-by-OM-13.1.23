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
import { getAnimalEnclosureHistory } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class Enclosures extends React.Component {
	static contextType = AppContext;

	state = {
		isLoading: true,
		historyData: [],
	};

	componentDidMount() {
		this.loadEnclosureHistory();
	}

	loadEnclosureHistory = () => {
		getAnimalEnclosureHistory(this.context.selectedAnimalID)
			.then((data) => {
				this.setState({
					isLoading: false,
					historyData: data,
				});
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadEnclosureHistory();
			}
		);
	};

	gotoAddEnclosureRecord = () =>
		this.props.navigation.navigate("EnclosureRecordEntry");

	renderItem = ({ item }) => (
		<TouchableWithoutFeedback>
			<View style={styles.CardBox}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingRight: 5,
					}}
				>
					<Text style={[styles.labelName,styles.pd0]}>
						{"Enclosure ID: "}
						<Text style={[styles.textfield,styles.width60]}>{item.enclosure_id_name}</Text>
					</Text>
					{parseInt(item.is_active) > 0 ? (
						<Text
							style={[
								styles.labelName,styles.pd0,
								{
									textAlign: "right",
									color: Colors.primary,
									fontStyle: "italic",
								},
							]}
						>
							Active
						</Text>
					) : null}
				</View>
				<Text style={[styles.labelName,styles.pd0]}>
					{"Enclosure Type: "}
					<Text style={[styles.textfield,styles.width60]}>{item.enclosure_type}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					{"Created On: "}
					<Text style={[styles.textfield,styles.width60]}>{item.created_on}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					{"Created By: "}
					<Text style={[styles.textfield,styles.width60]}>
						{item.changed_by !== null ? item.changed_by : "N/A"}
					</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					{"Reason: "}
					<Text numberOfLines={2} ellipsizeMode="tail" style={[styles.textfield,styles.width60]}>
						{item.reason !== null ? item.reason : "N/A"}
					</Text>
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);

	render = () => (
		<View style={styles.container}>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.historyData}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderItem}
					initialNumToRender={this.state.historyData.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.historyData.length === 0 ? styles.container : null
					}
				/>
			)}
			{/* <TouchableOpacity
				style={styles.button}
				onPress={this.gotoAddEnclosureRecord}
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
// });
