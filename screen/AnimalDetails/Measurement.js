import React, { useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	ScrollView,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";
import Colors from "../../config/colors";
import Loader from "../../component/Loader";
import ListEmpty from "../../component/ListEmpty";
import { getAnimalMeasurements } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class Measurement extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
	}

	componentDidMount = () => {
		getAnimalMeasurements(this.context.selectedAnimalID)
			.then((data) => {
				this.setState({ isLoading: false });
				this.context.setAnimalMeasurements(data);
			})
			.catch((error) => console.log(error));
	};

	gotoWeightRecordEntry = () =>
		this.props.navigation.navigate("MeasurementRecordEntry");

	getChartWidth = () => Dimensions.get("window").width - 20;

	getWidthData = () => {
		let { animalMeasurements } = this.context;
		let arr = [{ date: " ", weight: 0 }];

		animalMeasurements.forEach((v, i) => {
			arr.push({
				date: v.date,
				weight: parseInt(v.weight),
			});
		});

		return arr;
	};

	getHeightData = () => {
		let { animalMeasurements } = this.context;
		let arr = [{ date: " ", height: 0 }];

		animalMeasurements.forEach((v, i) => {
			arr.push({
				date: v.date,
				height: parseInt(v.height),
			});
		});

		return arr;
	};

	render = () => (
		<Container>
			{this.state.isLoading ? (
				<Loader />
			) : this.context.animalMeasurements.length === 0 ? (
				<ListEmpty />
			) : (
				<View style={styles.container}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<TouchableOpacity
							activeOpacity={1}
							onPress={this.gotoWeightRecordEntry}
							style={[styles.btn, styles.mt30]}
						>
							<Text style={styles.btnText}>Weight</Text>
						</TouchableOpacity>

						<VictoryChart
							width={this.getChartWidth()}
							theme={VictoryTheme.material}
						>
							<VictoryBar
								data={this.getWidthData()}
								x="date"
								y="weight"
								style={{ data: { fill: Colors.primary } }}
							/>
						</VictoryChart>

						<TouchableOpacity
							activeOpacity={1}
							onPress={this.gotoWeightRecordEntry}
							style={[styles.btn, styles.mt30]}
						>
							<Text style={styles.btnText}>Height</Text>
						</TouchableOpacity>

						<VictoryChart
							width={this.getChartWidth()}
							theme={VictoryTheme.material}
						>
							<VictoryBar
								data={this.getHeightData()}
								x="date"
								y="height"
								style={{ data: { fill: Colors.primary } }}
							/>
						</VictoryChart>
					</ScrollView>
				</View>
			)}

			<TouchableOpacity
				style={styles.addbutton}
				onPress={this.gotoWeightRecordEntry}
			>
				<Ionicons name="add" style={styles.plusIcon} />
			</TouchableOpacity>
		</Container>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		alignItems: "center",
// 		padding: 8,
// 	},
// 	mt30: {
// 		marginTop: 30,
// 	},
// 	btn: {
// 		paddingVertical: 10,
// 		paddingHorizontal: 50,
// 		borderWidth: 1.5,
// 		borderRadius: 3,
// 		borderColor: "#ccc",
// 		alignSelf: "center",
// 	},
// 	btnText: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		textAlign: "center",
// 	},
// 	fabButton: {
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
