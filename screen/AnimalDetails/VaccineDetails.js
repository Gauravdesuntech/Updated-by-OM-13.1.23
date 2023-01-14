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
import { getAnimalVaccineDetails } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class VaccineDetails extends React.Component {
	static contextType = AppContext;

	state = {
		isLoading: true,
	};

	componentDidMount = () => {
		this.loadAnimalVaccines();
	};

	loadAnimalVaccines = () => {
		getAnimalVaccineDetails(this.context.selectedAnimalID)
			.then((data) => {
				this.setState({ isLoading: false });
				this.context.setAnimalVaccines(data);
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadAnimalVaccines();
			}
		);
	};

	gotoVaccineRecordEdit = (id) => {
		this.props.navigation.navigate("VaccineRecordEntry", { id: id });
	};

	renderVaccineItem = ({ item }) => (
		<TouchableWithoutFeedback
			onPress={this.gotoVaccineRecordEdit.bind(this, item.id)}
		>
			<View style={styles.CardBox}>
				<Text style={[styles.labelName,styles.pd0]}>{item.vaccine_name}</Text>
				<Text style={[styles.textfield,styles.width60]}>{item.vaccine_type}</Text>
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
					data={this.context.animalVaccines}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderVaccineItem}
					initialNumToRender={this.context.animalVaccines.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.context.animalVaccines.length === 0 ? styles.container : null
					}
				/>
			)}
			<TouchableOpacity
				style={styles.addbutton}
				onPress={() => {
					this.props.navigation.navigate("VaccineRecordEntry");
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
// 		padding: 10,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
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
// 		opacity: 0.9,
		
// 		fontSize: 14,
// 		fontWeight: "bold",
// 	},
// 	labelName: {
// 		color: Colors.textColor,
		
// 		fontSize: 12,
// 	},
// 	fontBold: {
// 		fontWeight: "bold",
// 	},
// });
