import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	TextInput,
} from "react-native";
import { Container } from "native-base";
import { Header, DatePicker } from "../../component";
import Colors from "../../config/colors";
import OverlayLoader from "../../component/OverlayLoader";
import InputDropdown from "../../component/InputDropdown";
import {
	getAnimalEnclosureTypes,
	getAnimalEnclosureIds,
	animalChangeEnclosure,
} from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class EnclosureRecordEntry extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			showLoader: true,
			isEnclosureTypeMenuOpen: false,
			isEnclosureIDMenuOpen: false,
			isDatepickerOpen: false,
			enclosureTypes: [],
			enclosureIds: [],
			enclosureId: undefined,
			enclosureIDName: undefined,
			enclosureTypeID: undefined,
			enclosureType: undefined,
			changedBy: "",
			reason: "",
			date: new Date(),
			isEnclosureTypeValidationFailed: false,
			isEnclosureIDValidationFailed: false,
			changedByValidationFailed: false,
			reasonValidationFailed: false,
		};

		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let cid = this.context.userDetails.cid;

		getAnimalEnclosureTypes(cid)
			.then((data) => {
				this.setState({
					showLoader: false,
					enclosureTypes: data.map((v, i) => ({
						id: v.id,
						name: v.name,
						value: v.name,
					})),
				});
			})
			.catch((error) => console.log(error));
	};

	gotoBack = () => this.props.navigation.goBack();

	showDatepicker = () => this.setState({ isDatepickerOpen: true });

	toggleEnclosureTypeMenu = () =>
		this.setState({
			isEnclosureTypeMenuOpen: !this.state.isEnclosureTypeMenuOpen,
		});

	toggleEnclosureIDMenu = () =>
		this.setState({
			isEnclosureIDMenuOpen: !this.state.isEnclosureIDMenuOpen,
		});

	setEnclosureType = (v) => {
		this.setState(
			{
				enclosureTypeID: v.id,
				enclosureType: v.value,
				isEnclosureTypeMenuOpen: false,
				enclosureId: undefined,
				enclosureIDName: undefined,
				showLoader: true,
			},
			() => {
				this.getEnclosureIds(v.id);
			}
		);
	};

	getEnclosureIds = (enclosureTypeID) => {
		let reqObj = {
			cid: this.context.userDetails.cid,
			enclosure_type_id: enclosureTypeID,
		};

		getAnimalEnclosureIds(reqObj)
			.then((data) => {
				this.setState({
					showLoader: false,
					enclosureIds: data.map((v, i) => ({
						id: v.id,
						name: v.enclosure_id,
						value: v.enclosure_id,
					})),
				});
			})
			.catch((error) => console.log(error));
	};

	setEnclosureID = (v) => {
		this.setState({
			enclosureId: v.id,
			enclosureIDName: v.value,
			isEnclosureIDMenuOpen: false,
		});
	};

	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.date;
		this.setState({
			isDatepickerOpen: false,
			date: currentDate,
		});
	};

	scrollViewScrollTop = () => {
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
	};

	saveEnclosureRecord = () => {
		this.setState(
			{
				isEnclosureTypeValidationFailed: false,
				isEnclosureIDValidationFailed: false,
				changedByValidationFailed: false,
				reasonValidationFailed: false,
			},
			() => {
				let { enclosureTypeID, enclosureId, date, changedBy, reason } =
					this.state;
				if (typeof enclosureTypeID === "undefined") {
					this.setState({ isEnclosureTypeValidationFailed: true });
					this.scrollViewScrollTop();
					return false;
				} else if (typeof enclosureId === "undefined") {
					this.setState({ isEnclosureIDValidationFailed: true });
					this.scrollViewScrollTop();
					return false;
				} else if (changedBy.trim().length === 0) {
					this.setState({ changedByValidationFailed: true });
					return false;
				} else if (reason.trim().length === 0) {
					this.setState({ reasonValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let obj = {
						animal_id: this.context.selectedAnimalID,
						enclosure_type: enclosureTypeID,
						enclosure_id: enclosureId,
						changed_by: changedBy,
						reason: reason,
						created_on: getFormattedDate(date),
					};

					animalChangeEnclosure(obj)
						.then((response) => {
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
			<Header
				leftIconName={"arrow-back"}
				title={"Change Enclosure"}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={this.gotoBack}
			/>
			<View style={styles.container}>
				<ScrollView
					ref={this.scrollViewRef}
					showsVerticalScrollIndicator={false}
				>
					<InputDropdown
						label={"Enclosure Type:"}
						isMandatory={true}
						value={this.state.enclosureType}
						isOpen={this.state.isEnclosureTypeMenuOpen}
						items={this.state.enclosureTypes}
						openAction={this.toggleEnclosureTypeMenu}
						closeAction={this.toggleEnclosureTypeMenu}
						setValue={this.setEnclosureType}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.isEnclosureTypeValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>

					<InputDropdown
						label={"Enclosure ID:"}
						isMandatory={true}
						value={this.state.enclosureIDName}
						isOpen={this.state.isEnclosureIDMenuOpen}
						items={this.state.enclosureIds}
						openAction={this.toggleEnclosureIDMenu}
						closeAction={this.toggleEnclosureIDMenu}
						setValue={this.setEnclosureID}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.isEnclosureIDValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>

					<DatePicker
						onPress={this.showDatepicker}
						show={this.state.isDatepickerOpen}
						onChange={this.onChangeDate}
						date={this.state.date}
						mode={"date"}
						label={"Date:"}
					/>

					<View
						style={[
							styles.fieldBox,
							this.state.changedByValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>
							Changed By: <Text style={{ color: Colors.tomato }}> *</Text>
						</Text>
						<TextInput
							value={this.state.changedBy}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
							onChangeText={(changedBy) => this.setState({ changedBy })}
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.reasonValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>
							Reason: <Text style={{ color: Colors.tomato }}> *</Text>
						</Text>
						<TextInput
							value={this.state.reason}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
							onChangeText={(reason) => this.setState({ reason })}
						/>
					</View>

					<TouchableOpacity
						style={styles.button}
						onPress={this.saveEnclosureRecord}
					>
						<Text style={styles.textWhite}>Save Details</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>

			<OverlayLoader visible={this.state.showLoader} />
		</Container>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 	},
// 	fieldBox: {
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		height: 50,
// 		minHeight: 50,
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
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: 40,
		
// 		fontSize: 12,
// 		color: "#000",
// 		textAlign: "right",
// 		width: "60%",
// 		padding: 5,
// 	},
// 	button: {
// 		alignItems: "center",
// 		backgroundColor: Colors.primary,
// 		padding: 10,
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 2,
// 		},
// 		shadowOpacity: 0.23,
// 		shadowRadius: 2.62,
// 		elevation: 4,
// 		borderRadius: 20,
// 		color: "#fff",
// 		marginVertical: 10,
// 		zIndex: 0,
// 	},
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 	},
// 	labelName: {
// 		color: "#333",
// 		lineHeight: 40,
// 		fontSize: 14,
// 		paddingLeft: 4,
// 	},
// 	textInputIcon: {
// 		position: "absolute",
// 		bottom: 14,
// 		right: 10,
// 		marginLeft: 8,
// 		color: "#0482ED",
// 		zIndex: 99,
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
// 		fontSize: 18,
// 	},
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// });
