import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import { Header, DatePicker } from "../../component";
import ModalMenu from "../../component/ModalMenu";
import OverlayLoader from "../../component/OverlayLoader";
import {
	getIncidentTypes,
	saveAnimalIncidentRecord,
	getAnimalIncidentDetails,
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class IncidentRecordEntry extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			showLoader: true,
			isIncidentTypeMenuOpen: false,
			isDatepickerOpen: false,
			incidentTypesArr: [],
			id:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.id
					: 0,
			incidentType: undefined,
			incidentDescription: "",
			priority: "",
			reportedBy: "",
			solution: "",
			toBeClosedBy: "",
			dateOfDetah: new Date(),
			placeOfDeath: "",
			incidentTypeValidationFailed: false,
			incidentDescriptionValidationFailed: false,
			priorityValidationFailed: false,
			reportedByValidationFailed: false,
			solutionValidationFailed: false,
			toBeClosedByValidationFailed: false,
			placeOfDeathValidationFailed: false,
		};

		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let { id } = this.state;
		getIncidentTypes()
			.then((arr) => {
				this.setState({
					incidentTypesArr: arr,
					showLoader: parseInt(id) > 0 ? true : false,
				});

				if (parseInt(id) > 0) {
					getAnimalIncidentDetails(id)
						.then((data) => {
							this.setState({
								incidentType: data.incident_type,
								incidentDescription: data.description,
								priority: data.priority,
								reportedBy: data.reported_by,
								solution: data.solution,
								toBeClosedBy: data.to_be_closed_by,
								showLoader: false,
							});
						})
						.catch((error) => console.log(error));
				}
			})
			.catch((error) => console.log(error));
	};

	gotoBack = () => this.props.navigation.goBack();

	toggleIncidentTypeMenu = () => {
		this.setState({
			isIncidentTypeMenuOpen: !this.state.isIncidentTypeMenuOpen,
		});
	};

	setIncidentType = (v) => {
		this.setState({
			incidentType: v.type_name,
			isIncidentTypeMenuOpen: false,
		});
	};

	showDatepicker = () => this.setState({ isDatepickerOpen: true });

	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.dateOfDetah;
		this.setState({
			isDatepickerOpen: false,
			dateOfDetah: currentDate,
		});
	};

	scrollViewScrollTop = () => {
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
	};

	saveIncidentProfileData = () => {
		let {
			incidentType,
			incidentDescription,
			priority,
			reportedBy,
			solution,
			toBeClosedBy,
		} = this.state;
		this.setState(
			{
				incidentTypeValidationFailed: false,
				incidentDescriptionValidationFailed: false,
				priorityValidationFailed: false,
				reportedByValidationFailed: false,
				solutionValidationFailed: false,
				toBeClosedByValidationFailed: false,
			},
			() => {
				if (typeof incidentType === "undefined") {
					this.setState({ incidentTypeValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (incidentDescription.trim().length === 0) {
					this.setState({ incidentDescriptionValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (priority.trim().length === 0) {
					this.setState({ priorityValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (reportedBy.trim().length === 0) {
					this.setState({ reportedByValidationFailed: true });
				} else if (solution.trim().length === 0) {
					this.setState({ solutionValidationFailed: true });
				} else if (toBeClosedBy.trim().length === 0) {
					this.setState({ toBeClosedByValidationFailed: true });
				} else {
					this.setState({ showLoader: true });
					let obj = {
						id: this.state.id,
						animal_code: this.context.selectedAnimalID,
						incident_type: incidentType,
						description: incidentDescription,
						priority: priority,
						reported_by: reportedBy,
						solution: solution,
						to_be_closed_by: toBeClosedBy,
					};

					saveAnimalIncidentRecord(obj)
						.then((response) => {
							let id = response.data.id;
							let animalIncidents = this.context.animalEnclosures;
							let index = animalIncidents.findIndex(
								(element) => element.id === id
							);

							if (index > -1) {
								animalIncidents[index] = response.data;
							} else {
								animalIncidents.unshift(response.data);
							}

							this.context.setAnimalIncidents(animalIncidents);
							this.setState({ showLoader: false });
							this.gotoBack();
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	render = () => (
		<Container>
			<Header
				leftIconName={"arrow-back"}
				title={"Incident Record Entry"}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={this.gotoBack}
			/>
			<ScrollView ref={this.scrollViewRef}>
				<View style={styles.container}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={this.toggleIncidentTypeMenu}
						style={[
							styles.fieldBox,
							this.state.incidentTypeValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Incident Type :</Text>
						<TextInput
							editable={false}
							value={this.state.incidentType}
							style={styles.textfield}
							placeholder="Select Incident Type"
						/>
					</TouchableOpacity>

					{this.state.incidentType === "Dead" ? (
						<>
							<DatePicker
								onPress={this.showDatepicker}
								show={this.state.isDatepickerOpen}
								onChange={this.onChangeDate}
								date={this.state.dateOfDetah}
								mode={"date"}
								label={"Date:"}
							/>

							<View
								style={[
									styles.fieldBox,
									this.state.placeOfDeathValidationFailed
										? styles.errorFieldBox
										: null,
								]}
							>
								<Text style={styles.labelName}>Place :</Text>
								<TextInput
									value={this.state.placeOfDeath}
									onChangeText={(placeOfDeath) =>
										this.setState({ placeOfDeath })
									}
									style={styles.textfield}
									autoCompleteType="off"
									autoCapitalize="words"
								/>
							</View>
						</>
					) : null}

					<View
						style={[
							styles.fieldBox,
							{ flexDirection: "column", height: 130 },
							this.state.incidentDescriptionValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Incident Description :</Text>
						<TextInput
							multiline={true}
							numberOfLines={10}
							value={this.state.incidentDescription}
							onChangeText={(incidentDescription) =>
								this.setState({ incidentDescription })
							}
							autoCompleteType="off"
							autoCapitalize="words"
							style={{
								height: 130,
								textAlignVertical: "top",
							}}
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.priorityValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Priority :</Text>
						<TextInput
							value={this.state.priority}
							onChangeText={(priority) => this.setState({ priority })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.reportedByValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Reported By :</Text>
						<TextInput
							value={this.state.reportedBy}
							onChangeText={(reportedBy) => this.setState({ reportedBy })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.solutionValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Solution :</Text>
						<TextInput
							value={this.state.solution}
							onChangeText={(solution) => this.setState({ solution })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.toBeClosedByValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>To be closed by :</Text>
						<TextInput
							value={this.state.toBeClosedBy}
							onChangeText={(toBeClosedBy) => this.setState({ toBeClosedBy })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<TouchableOpacity
						style={styles.button}
						onPress={this.saveIncidentProfileData}
					>
						<Text style={styles.textWhite}>Save Details</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
			<ModalMenu
				visible={this.state.isIncidentTypeMenuOpen}
				closeAction={this.toggleIncidentTypeMenu}
			>
				{this.state.incidentTypesArr.map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setIncidentType.bind(this, v)}
						key={v.id.toString()}
					>
						<Text style={styles.itemtitle}>{v.type_name}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>
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
// 		backgroundColor: "#fff",
// 		height: 50,
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
		
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		textAlign: "right",
// 		width: "50%",
// 		padding: 5,
// 	},
// 	labelName: {
// 		color: Colors.textColor,
// 		lineHeight: 40,
// 		fontSize: 14,
// 		paddingLeft: 4,
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
// 		marginTop: 10,
// 	},
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
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
