import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Configs from "../config/Configs";
import Colors from "../config/colors";
import { getIdentificationTypeCount } from "../services/APIServices";

export default class AnimalIdentificationTypeModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false,
			isLoading: true,
			identificationData: null,	
		};
	}

	openModal = () => {
		this.setState(
			{
				isModalOpen: true,
				isLoading: true,
				identificationData: null,
			},
			() => {
				let { commonName, enclosureID, gender } = this.props;

				getIdentificationTypeCount(commonName, enclosureID, gender)
					.then((data) => {
						this.setState({
							isLoading: false,
							identificationData: data,
						});
					})
					.catch((error) => console.log(error));
			}
		);
	};

	closeModal = () => {
		this.setState({
			isModalOpen: false,
			isLoading: true,
			identificationData: null,
		});
	};

	gotoAnimalList = (type, gender) => {
		this.setState(
			{
				isModalOpen: false,
				isLoading: true,
				identificationData: null,
			},
			() => {
				this.props.navigation.navigate("AnimalsList", {
					commonName: this.props.commonName,
					enclosureID: this.props.enclosureID,
					identificationType: type,
					gender: gender
				});
			}
		);
	};

	render = () => (
		<Modal
			animationType="fade"
			transparent={true}
			statusBarTranslucent={true}
			visible={this.state.isModalOpen}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalBody}>
					<View style={styles.headerContainer}>
						<TouchableOpacity
							onPress={this.gotoAnimalList.bind(this, 'total', this.props.gender)}
						>
						<Text style={styles.headerTitle}>{`${this.props.title} - ${this.state.identificationData ?this.state.identificationData.total : 0} nos`}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={this.closeModal}
						>
							<Ionicons name="close-outline" style={styles.closeButtonText} />
						</TouchableOpacity>
					</View>

					{this.state.isLoading ? (
						<View style={styles.loadingTextConatiner}>
							<Text style={styles.loadingText}>Loading...</Text>
						</View>
					) : this.state.identificationData !== null ? (
						<>
							{Configs.ANIMAL_IDENTIFICATION_TYPES_TEMP.map((v, i) => (
								<TouchableOpacity
									key={v.id}
									style={styles.bodyRow}
									onPress={this.gotoAnimalList.bind(this, v.value, this.props.gender)}
								>
									<Text style={styles.bodyText}>{v.name}</Text>
									<Text style={styles.bodyText}>
										{this.state.identificationData[v.id]}
									</Text>
								</TouchableOpacity>
							))}
							{/* <View style={styles.bodyRow}>
								<Text style={styles.bodyText}>Total</Text>
								<Text style={styles.bodyText}>
									{this.state.identificationData.total}
								</Text>
							</View> */}
						</>
					) : (
						<Text style={styles.bodyText}>{"No Result Found!"}</Text>
					)}
				</View>
			</View>
		</Modal>
	);
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalBody: {
		backgroundColor: Colors.white,
		width: windowWidth - 30,
		minHeight: Math.floor(windowHeight / 4),
		borderRadius: 3,
		elevation: 5,
		paddingBottom: 8,
	},
	headerContainer: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		paddingHorizontal: 8,
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 18,
		color: Colors.textColor,
	},
	closeButton: {
		backgroundColor: "#ddd",
		width: 25,
		height: 25,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
		elevation: 0,
	},
	closeButtonText: {
		color: Colors.textColor,
		fontSize: 22,
	},
	loadingTextConatiner: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		fontSize: 14,
		color: Colors.textColor,
		opacity: 0.8,
	},
	bodyRow: {
		width: "100%",
		paddingVertical: 5,
		paddingHorizontal: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	bodyText: {
		fontSize: 16,
		color: Colors.textColor,
	},
});
