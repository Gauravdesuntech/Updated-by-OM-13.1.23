import React from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../config";
import { addGroup } from "../services/APIServices";
import { getFileData } from "../utils/Util";
import Header from "../component/Header";
import OverlayLoader from "../component/OverlayLoader";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
import styles from './Styles'


export default class AddGroup extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
			imageURI:
				typeof props.route.params !== "undefined"
					? props.route.params.imageURI
					: undefined,
			imageData: undefined,
			groupName:
				typeof props.route.params !== "undefined"
					? props.route.params.groupName
					: "",
			description:
				typeof props.route.params !== "undefined"
					? props.route.params.groupDetails
					: "",
			groupImageValidationFailed: false,
			groupNameValidationFailed: false,
			descriptionValidationFailed: false,
			showLoader: false,
		};

		this.formScrollViewRef = React.createRef();
	}

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					imageURI: undefined,
					imageData: undefined,
				});

				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: false,
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						this.setState({
							imageURI: result.uri,
							imageData: getFileData(result),
							groupImageValidationFailed: false,
						});
					}
				});
			} else {
				Alert.alert("Please allow permission to choose an icon");
			}
		});
	};

	gotoBack = () => {
		this.props.navigation.goBack();
	};

	scrollToScrollViewTop = () =>
		this.formScrollViewRef.current.scrollTo({
			x: 0,
			y: 0,
			animated: true,
		});

	addGroup = () => {
		let { id, imageData, groupName, description } = this.state;
		this.setState(
			{
				groupImageValidationFailed: false,
				groupNameValidationFailed: false,
				descriptionValidationFailed: false,
			},
			() => {
				if (parseInt(id) === 0 && typeof imageData === "undefined") {
					this.setState({ groupImageValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (groupName.trim().length === 0) {
					this.setState({ groupNameValidationFailed: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (description.trim().length === 0) {
					this.setState({ descriptionValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let obj = {
						id: this.state.id,
						cid: this.context.userDetails.cid,
						group_name: groupName,
						group_details: description,
					};

					if (typeof imageData !== "undefined") {
						obj.image = imageData;
					}

					addGroup(obj)
						.then((response) => {
							// let groups = this.context.groups;
							// groups.unshift(response.data);
							// this.context.setGroups(groups);

							this.setState(
								{
									showLoader: false,
								},
								() => {
									this.gotoBack();
								}
							);
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
				title={
					parseInt(this.state.id) > 0 ? "Edit Animal Class" : "Add Animal Class"
				}
			/>
			<View style={styles.container}>
				<ScrollView ref={this.formScrollViewRef}>
					<View style={styles.chooseCatContainer}>
						<Text style={styles.name}>Choose Icon</Text>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.imageContainer}
							onPress={this.chooseIcon}
						>
							{typeof this.state.imageURI !== "undefined" ? (
								<Image
									style={styles.image}
									source={{ uri: this.state.imageURI }}
								/>
							) : (
								<Ionicons name="image" style={styles.defaultImgIcon} />
							)}
						</TouchableOpacity>
					</View>
					{this.state.groupImageValidationFailed ? (
						<View style={{ marginRight: 10 }}>
							<Text style={styles.errorText}>Choose an icon</Text>
						</View>
					) : null}

					<View style={styles.inputContainer}>
						<Text style={styles.name}>Group Name</Text>
						<TextInput
							value={this.state.groupName}
							onChangeText={(groupName) => this.setState({ groupName })}
							style={styles.inputText}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
						{this.state.groupNameValidationFailed ? (
							<Text style={styles.errorText}>Enter group name</Text>
						) : null}
					</View>

					<View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
						<Text style={styles.name}>Group Details</Text>
						<TextInput
							multiline={true}
							numberOfLines={10}
							style={styles.inputTextArea}
							value={this.state.description}
							onChangeText={(description) => this.setState({ description })}
							autoCapitalize="words"
							autoCompleteType="off"
						/>
						{this.state.descriptionValidationFailed ? (
							<Text style={styles.errorText}>Enter group details</Text>
						) : null}
					</View>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity activeOpacity={1} onPress={this.addGroup}>
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
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
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
