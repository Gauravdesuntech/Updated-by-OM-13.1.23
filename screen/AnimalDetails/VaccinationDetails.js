import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import ListEmpty from "../../component/ListEmpty";
import Loader from "../../component/Loader";
import { getAnimalVaccinationDetails } from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class VaccinationDetails extends React.Component {
	static contextType = AppContext;

	state = {
		isLoading: true,
	};

	componentDidMount = () => {
		this.loadAnimalVaccinationData();
	};

	loadAnimalVaccinationData = () => {
		getAnimalVaccinationDetails(this.context.selectedAnimalID)
			.then((data) => {
				this.setState({ isLoading: false });
				this.context.setAnimalVaccinationDetails(data);
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadAnimalVaccinationData();
			}
		);
	};

	renderVaccineItem = ({ item }) => (
		<TouchableWithoutFeedback
			onPress={() => {
				this.props.navigation.navigate("VaccinationRecordEntry", {
					id: item.id,
				});
			}}
		>
			<View style={styles.CardBox}>
				<Text style={[styles.labelName,styles.pd0]}>{item.vaccine_name}</Text>
				<Text style={[styles.textfield,styles.width60]}>
					{"Next Date: " + getFormattedDate(item.next_date, "DD/MM/YYYY")}
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
					data={this.context.animalVaccinationDetails}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderVaccineItem}
					initialNumToRender={this.context.animalVaccinationDetails.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.context.animalVaccinationDetails.length === 0
							? styles.container
							: null
					}
				/>
			)}

			<TouchableOpacity
				style={styles.addbutton}
				onPress={() => {
					this.props.navigation.navigate("VaccinationRecordEntry");
				}}
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
// 	fieldBox: {
// 		// flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		// height: 50,
// 		paddingVertical: 10,
// 		justifyContent: "space-between",
// 		marginVertical: 5,
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 3,
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
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 	},
// 	vaccineName: {
// 		color: Colors.textColor,
// 		lineHeight: 22,
// 		fontSize: 14,
// 		fontWeight: "bold",
// 		paddingLeft: 4,
// 	},
// 	labelName: {
// 		color: Colors.textColor,
// 		lineHeight: 22,
// 		fontSize: 12,
// 		paddingLeft: 4,
// 	},
// });
