import React from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { Container } from "native-base";
import { Colors } from "../config";
import { addFarm } from "../services/APIServices";
import Header from "../component/Header";
import OverlayLoader from "../component/OverlayLoader";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
import styles from './Styles'



export default class AddLocation extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
			screenTitle:
				typeof props.route.params !== "undefined"
					? props.route.params.screen_title
					: "Add Location",
			branchCode:
				typeof props.route.params !== "undefined"
					? props.route.params.branch_code
					: "",
			locationName:
				typeof props.route.params !== "undefined"
					? props.route.params.name
					: "",
			branchCodeValidationFailed: false,
			locationNameValidationFailed: false,
			showLoader: false,
		};

		this.formScrollViewRef = React.createRef();
	}

	gotoBack = () => {
		this.props.navigation.goBack();
	};

	saveData = () => {
		let { branchCode, locationName } = this.state;
		this.setState(
			{
				branchCodeValidationFailed: false,
				locationNameValidationFailed: false,
			},
			() => {
				if (branchCode.trim().length === 0) {
					this.setState({ branchCodeValidationFailed: true });
					this.formScrollViewRef.current.scrollTo({
						x: 0,
						y: 0,
						animated: true,
					});
					return false;
				} else if (locationName.trim().length === 0) {
					this.setState({ locationNameValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let obj = {
						id: this.state.id,
						cid: this.context.userDetails.cid,
						branch_code: branchCode,
						name: locationName,
					};

					addFarm(obj)
						.then((response) => {
							let locations = this.context.locations;
							let id = response.data.id;
							let index = locations.findIndex((element) => element.id === id);
							if (index > -1) {
								locations[index] = response.data;
							} else {
								locations.unshift(response.data);
							}

							this.context.setLocations(locations);
							this.setState({ showLoader: false });
							this.gotoBack();
						})
						.catch((error) => {
							this.setState({ showLoader: false });
							console.log(error);
						});
				}
			}
		);
	};

	render = () => (
		<Container>
			<OverlayLoader visible={this.state.showLoader} />
			<Header
				leftIconName={"arrow-back"}
				title={this.state.screenTitle}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={this.gotoBack}
			/>
			<View style={styles.container}>
				<ScrollView ref={this.formScrollViewRef}>
					<View style={styles.inputContainer}>
						<Text style={styles.name}>Branch Code</Text>
						<TextInput
							value={this.state.branchCode}
							onChangeText={(branchCode) => this.setState({ branchCode })}
							style={styles.inputText}
							autoCompleteType="off"
							autoCapitalize="characters"
						/>
						{this.state.branchCodeValidationFailed ? (
							<Text style={styles.errorText}>Enter branch code</Text>
						) : null}
					</View>

					<View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
						<Text style={styles.name}>Location Name</Text>
						<TextInput
							value={this.state.locationName}
							onChangeText={(locationName) => this.setState({ locationName })}
							style={styles.inputText}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
						{this.state.locationNameValidationFailed ? (
							<Text style={styles.errorText}>Enter location name</Text>
						) : null}
					</View>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity activeOpacity={1} onPress={this.saveData}>
							<Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
						</TouchableOpacity>

						<TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
							<Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</Container>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 	},
// 	chooseCatContainer: {
// 		flexDirection: "row",
// 		marginVertical: 10,
// 		paddingHorizontal: 10,
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 	},
// 	imageContainer: {
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 	},
// 	image: {
// 		height: 50,
// 		width: 50,
// 	},
// 	defaultImgIcon: {
// 		fontSize: 50,
// 		color: "#adadad",
// 	},
// 	name: {
// 		fontSize: Colors.lableSize,
// 		color: Colors.textColor,
// 		marginBottom: 10,
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 30,
// 	},
// 	inputText: {
// 		height: 50,
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		fontSize: Colors.textSize,
// 		backgroundColor: "#f9f6f6",
// 		paddingHorizontal: 10,
// 		color: Colors.textColor,
// 	},
// 	inputTextArea: {
// 		height: 150,
// 		borderWidth: 1,
// 		borderColor: "#ccc",
// 		backgroundColor: "#f9f6f6",
// 		textAlignVertical: "top",
// 		padding: 10,
// 	},
// 	inputContainer: {
// 		marginVertical: 10,
// 		padding: 10,
// 	},
// 	pb0: {
// 		paddingBottom: 0,
// 	},
// 	mb0: {
// 		marginBottom: 0,
// 	},
// 	buttonText: {
// 		fontSize: Colors.textSize,
// 		fontWeight: "bold",
// 	},
// 	saveBtnText: {
// 		color: Colors.primary,
// 	},
// 	exitBtnText: {
// 		color: Colors.activeTab,
// 	},
// 	item: {
// 		height: 35,
// 		backgroundColor: "#00b386",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	itemtitle: {
// 		color: "#fff",
// 		textAlign: "center",
// 		fontSize: Colors.textSize,
// 	},
// 	errorText: {
// 		textAlign: "right",
// 		color: Colors.tomato,
// 		fontWeight: "bold",
// 		fontStyle: "italic",
// 	},
// });
