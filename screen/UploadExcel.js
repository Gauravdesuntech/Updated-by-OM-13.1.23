import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Modal,
	ActivityIndicator,
} from "react-native";
import { Container } from "native-base";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { Header } from "../component";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
import styles from './Styles'

export default class UploadExcel extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			processingText: "Uploading...",
			isModalOpen: false,
			isProcessComplete: false,
			isUploadSuccess: true,
			fname: "Browse File",
			fileData: undefined,
			fileSelectValidationFailed: false,
		};
	}

	gotoBack = () => this.props.navigation.goBack();

	closeModal = () => {
		this.setState(
			{
				isModalOpen: false,
				isProcessComplete: false,
				processingText: "Uploading...",
			},
			() => {
				this.gotoBack();
			}
		);
	};

	browseFile = () => {
		let options = {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			multiple: false,
		};

		DocumentPicker.getDocumentAsync(options)
			.then((res) => {
				if (res.type === "success") {
					this.setState({
						fname: res.name,
						fileData: {
							uri: res.uri,
							name: res.name,
							type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						},
					});
				}
			})
			.catch((error) => console.log(error));
	};

	uploadFile = () => {
		this.setState(
			{
				fileSelectValidationFailed: false,
			},
			() => {
				let { fileData } = this.state;

				if (typeof fileData === "undefined") {
					this.setState({ fileSelectValidationFailed: true });
					return false;
				} else {
					this.setState(
						{
							isModalOpen: true,
							isProcessComplete: false,
						},
						() => {
							let formData = new FormData();
							formData.append("cid", this.context.userDetails.cid);
							formData.append("excel_file", this.state.fileData);

							let xhr = new XMLHttpRequest();
							xhr.open("POST", Configs.BASE_URL + "upload_excel/");

							// handle response
							xhr.onreadystatechange = () => {
								if (xhr.readyState === 4) {
									let response = JSON.parse(xhr.response);
									this.setState({
										isProcessComplete: true,
										isUploadSuccess: response.check === Configs.SUCCESS_TYPE,
										processingText: response.message,
									});
								}
							};

							// upload progress event
							xhr.upload.addEventListener("progress", (e) => {
								let percent_complete = Math.floor((e.loaded / e.total) * 100);
								if (percent_complete === 100) {
									this.setState({ processingText: "Processing..." });
								}
							});

							// set header
							xhr.setRequestHeader("Content-Type", "multipart/form-data");

							// send POST request to server side script
							xhr.send(formData);
						}
					);
				}
			}
		);
	};

	render = () => (
		<Container>
			<Header
				leftIconName={"arrow-back"}
				title={"Upload Excel"}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={this.gotoBack}
			/>
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Choose File</Text>
					<TouchableOpacity
						activeOpacity={1}
						onPress={this.browseFile}
						style={styles.inputGroup}
					>
						<View style={styles.inputGroupTextField}>
							<Text
								numberOfLines={1}
								ellipsizeMode="tail"
								style={{ fontSize: 14, color: Colors.textColor, opacity: 0.8 }}
							>
								{this.state.fname}
							</Text>
						</View>
						<View style={styles.inputGroupBtn}>
							<Text style={{ fontSize: 14, color: Colors.textColor }}>
								Browse
							</Text>
						</View>
					</TouchableOpacity>
					{this.state.fileSelectValidationFailed ? (
						<Text style={styles.errorText}>Choose an excel file</Text>
					) : null}
				</View>

				<TouchableOpacity
					activeOpacity={0.8}
					style={styles.submitBtn}
					onPress={this.uploadFile}
				>
					<Text style={styles.submitBtnText}>Submit</Text>
				</TouchableOpacity>
			</View>

			<Modal
				animationType="fade"
				transparent={true}
				statusBarTranslucent={true}
				visible={this.state.isModalOpen}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalBody}>
						{this.state.isProcessComplete ? (
							<>
								<Feather
									size={60}
									name={
										this.state.isUploadSuccess ? "check-circle" : "x-circle"
									}
									color={
										this.state.isUploadSuccess ? Colors.primary : Colors.tomato
									}
								/>
								<Text
									style={[
										styles.loadingText,
										{ opacity: 0.9, marginBottom: 30 },
									]}
								>
									{this.state.processingText}
								</Text>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.closeBtn}
									onPress={this.closeModal}
								>
									<Text style={styles.closeBtnText}>Close</Text>
								</TouchableOpacity>
							</>
						) : (
							<>
								<ActivityIndicator size="large" color={Colors.primary} />
								<Text style={styles.loadingText}>
									{this.state.processingText}
								</Text>
							</>
						)}
					</View>
				</View>
			</Modal>
		</Container>
	);
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 	},
// 	inputContainer: {
// 		marginVertical: 10,
// 		padding: 10,
// 	},
// 	label: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		marginBottom: 10,
// 	},
// 	inputGroup: {
// 		flexDirection: "row",
// 		borderWidth: 1,
// 		borderColor: "#ddd",
// 		borderRadius: 3,
// 		width: "100%",
// 	},
// 	inputGroupTextField: {
// 		height: 45,
// 		width: "75%",
// 		justifyContent: "center",
// 		paddingHorizontal: 8,
// 	},
// 	inputGroupBtn: {
// 		height: 45,
// 		width: "25%",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		borderLeftWidth: 1,
// 		borderLeftColor: "#ddd",
// 		backgroundColor: "#f2f2f2",
// 		borderTopRightRadius: 5,
// 		borderBottomRightRadius: 5,
// 	},
// 	errorText: {
// 		textAlign: "right",
// 		color: Colors.tomato,
// 		fontWeight: "bold",
// 		fontStyle: "italic",
// 		marginRight: 2,
// 	},
// 	submitBtn: {
// 		width: "96%",
// 		height: 45,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		backgroundColor: Colors.primary,
// 		borderRadius: 50,
// 		alignSelf: "center",
// 		marginTop: 25,
// 	},
// 	submitBtnText: {
// 		fontSize: 18,
// 		color: Colors.white,
// 		fontWeight: "bold",
// 		letterSpacing: 0.5,
// 	},
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0, 0, 0, 0.5)",
// 	},
// 	modalBody: {
// 		alignItems: "center",
// 		justifyContent: "center",
// 		backgroundColor: Colors.white,
// 		width: Math.floor((windowWidth * 70) / 100),
// 		minHeight: Math.floor(windowHeight / 4),
// 		padding: 15,
// 		borderRadius: 3,
// 		elevation: 5,
// 	},
// 	loadingText: {
// 		fontSize: 14,
// 		color: "#444",
// 		opacity: 0.6,
// 		marginTop: 10,
// 	},
// 	closeBtn: {
// 		position: "absolute",
// 		bottom: 10,
// 		padding: 10,
// 	},
// 	closeBtnText: {
// 		fontSize: 16,
// 		fontWeight: "bold",
// 		color: Colors.tomato,
// 	},
// });
