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
import { getAnimalFeedings } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class Feedings extends React.Component {
	static contextType = AppContext;

	state = {
		isLoading: true,
	};

	componentDidMount = () => {
		this.loadAnimalFeedings();
	};

	loadAnimalFeedings = () => {
		getAnimalFeedings(this.context.selectedAnimalID)
            .then((data) => {
				this.setState({ isLoading: false });
				this.context.setAnimalFeedingsData(data);
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadAnimalFeedings();
			}
		);
	};

	gotoAssingNewFeeding = () =>
		this.props.navigation.navigate("FeedingRecordEntry");
	
	gotoEditFeeding = (id) =>
		this.props.navigation.navigate("FeedingRecordEntry", {"id": id});
	
	renderItem = ({ item }) => (
		<TouchableWithoutFeedback
			onPress={this.gotoEditFeeding.bind(this, item.id)}
		>
			<View style={styles.CardBox}>
				<Text style={[styles.labelName,styles.pd0]}>
					Food :{" "}
					<Text style={[styles.textfield,styles.width60]}>{item.food_name}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Slot :{" "}
					<Text style={[styles.textfield,styles.width60]}>{item.slot_name}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Schedule Time :{" "}
					<Text style={[styles.textfield,styles.width60]}>{item.start_time + ' - ' + item.end_time}</Text>
				</Text>
				<Text style={[styles.labelName,styles.pd0]}>
					Actual Time :{" "}
					<Text style={[styles.textfield,styles.width60]}>{item.actule_time}</Text>
                </Text>
                <Text style={[styles.labelName,styles.pd0]}>
					Delay :{" "}
					<Text style={[styles.textfield,styles.width60]}>{item.delay}</Text>
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
					data={this.context.animalFeedings}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderItem}
					initialNumToRender={this.context.animalFeedings.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.context.animalFeedings.length === 0
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
		
// 		color: "#333",
// 		opacity: 0.9,
// 		textAlign: "left",
// 		fontWeight: "bold",
// 		flex: 1,
// 		width: "100%",
// 	},
// 	mc: {
// 		color: "#555",
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
