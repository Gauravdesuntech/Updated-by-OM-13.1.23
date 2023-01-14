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
import { getAnimalFeedingAssignments } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class FeedingAssignments extends React.Component {
	static contextType = AppContext;

	state = {
		isLoading: true,
	};

	componentDidMount = () => {
		this.loadAnimalFeedingAssignments();
	};

	loadAnimalFeedingAssignments = () => {
		getAnimalFeedingAssignments(this.context.selectedAnimalID)
			.then((data) => {
				this.setState({ isLoading: false });
				this.context.setAnimalFeedingAssignments(data);
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadAnimalFeedingAssignments();
			}
		);
	};

	gotoAssingNewFeeding = () =>
		this.props.navigation.navigate("FeedingAssignmentRecordEntry");

	gotoEditFeeding = (id) =>
		this.props.navigation.navigate("FeedingAssignmentRecordEntry", { id: id });

	renderItem = ({ item }) => (
		<TouchableWithoutFeedback
			onPress={this.gotoEditFeeding.bind(this, item.id)}
		>
			<View style={styles.CardBox}>
				<Text style={[styles.labelName,styles.pd0]}>
					Food : <Text style={[styles.textfield,styles.width60]}>{item.food_name}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Slot : <Text style={[styles.textfield,styles.width60]}>{item.slot_name}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Quantity : <Text style={[styles.textfield,styles.width60]}>{item.qty}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Unit : <Text style={[styles.textfield,styles.width60]}>{item.unit}</Text>
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
					data={this.context.animalFeedingAssignments}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderItem}
					initialNumToRender={this.context.animalFeedingAssignments.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.context.animalFeedingAssignments.length === 0
							? styles.container
							: null
					}
				/>
			)}
			<TouchableOpacity
				style={styles.addbutton}
				onPress={this.gotoAssingNewFeeding}
			>
				<Ionicons name="add" style={styles.plusIcon} />
			</TouchableOpacity>
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
// });
