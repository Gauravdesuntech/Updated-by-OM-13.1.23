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
import {
	getAnimalEnclosureIds,
	getAnimalEnclosureTypes,
	getAnimalSections,
	getSectionRelationDetails,
	manageSectionRelation,
} from "../services/APIServices";
import Header from "../component/Header";
import ModalMenu from "../component/ModalMenu";
import OverlayLoader from "../component/OverlayLoader";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
import styles from './Styles'



export default class AddSectionRelation extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			enclosureIds: [],
			enclosureTypes: [],
			sections: [],
			id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
			enclosureID: undefined,
			enclosureIDName: undefined,
			enclosureTypeID: undefined,
			enclosureTypeName: undefined,
			sectionID: undefined,
			sectionName: undefined,
			enclosureIDValidationFailed: false,
			enclosureTypeValidationFailed: false,
			sectionNameValidationFailed: false,
			isEnclosureIDMenuOpen: false,
			isEnclosureTypeMenuOpen: false,
			isSectionMenuOpen: false,
			showLoader: true,
		};

		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		const { id } = this.state;
		let cid = this.context.userDetails.cid;
		Promise.all([
			getAnimalEnclosureIds({ cid }),
			getAnimalEnclosureTypes(cid),
			getAnimalSections(cid),
		])
			.then((response) => {
				let stateObj = {
					enclosureIds: response[0],
					enclosureTypes: response[1],
					sections: response[2],
					showLoader: parseInt(id) > 0 ? true : false,
				};

				if (parseInt(id) > 0) {
					getSectionRelationDetails(id)
						.then((data) => {
							stateObj.enclosureID = data.enclosure_id;
							stateObj.enclosureIDName = data.enclosure_id_name;
							stateObj.enclosureTypeID = data.enclosure_type_id;
							stateObj.enclosureTypeName = data.enclosure_type_name;
							stateObj.sectionID = data.section_id;
							stateObj.sectionName = data.section_name;
							stateObj.showLoader = false;

							this.setState(stateObj);
						})
						.catch((error) => console.log(error));
				} else {
					this.setState(stateObj);
				}
			})
			.catch((error) => console.log(error));
	};

	toggleEnclosureIDMenu = () =>
		this.setState({
			isEnclosureIDMenuOpen: !this.state.isEnclosureIDMenuOpen,
		});

	toggleEnclosureTypeMenu = () =>
		this.setState({
			isEnclosureTypeMenuOpen: !this.state.isEnclosureTypeMenuOpen,
		});

	toggleSectionMenu = () =>
		this.setState({
			isSectionMenuOpen: !this.state.isSectionMenuOpen,
		});

	setEnclosureID = (v) => {
		this.setState({
			enclosureID: v.id,
			enclosureIDName: v.enclosure_id,
			isEnclosureIDMenuOpen: false,
		});
	};

	setEnclosureType = (v) => {
		this.setState({
			enclosureTypeID: v.id,
			enclosureTypeName: v.name,
			isEnclosureTypeMenuOpen: false,
		});
	};

	setSection = (v) => {
		this.setState({
			sectionID: v.id,
			sectionName: v.name,
			isSectionMenuOpen: false,
		});
	};

	gotoBack = () => {
		this.props.navigation.goBack();
	};

	scrollViewScrollTop = () => {
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
	};

	saveData = () => {
		let { enclosureID, enclosureTypeID, sectionID } = this.state;
		this.setState(
			{
				sectionNameValidationFailed: false,
				enclosureIDValidationFailed: false,
				enclosureTypeValidationFailed: false,
			},
			() => {
				if (typeof enclosureID === "undefined") {
					this.setState({ enclosureIDValidationFailed: true });
					this.scrollViewScrollTop();
					return false;
				} else if (typeof enclosureTypeID === "undefined") {
					this.setState({ enclosureTypeValidationFailed: true });
					this.scrollViewScrollTop();
					return false;
				} else if (typeof sectionID === "undefined") {
					this.setState({ sectionNameValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let obj = {
						id: this.state.id,
						cid: this.context.userDetails.cid,
						enclosure_id: enclosureID,
						enclosure_type_id: enclosureTypeID,
						section_id: sectionID,
					};

					manageSectionRelation(obj)
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
			<OverlayLoader visible={this.state.showLoader} />
			<Header
				leftIconName={"arrow-back"}
				title={"Add Section Relation"}
				leftIconShow={true}
				leftButtonFunc={this.gotoBack}
				rightIconShow={false}
			/>
			<View style={styles.container}>
				<ScrollView ref={this.scrollViewRef}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={this.toggleEnclosureIDMenu}
						style={styles.inputContainer}
					>
						<Text style={styles.name}>Enclosure ID</Text>
						<TextInput
							editable={false}
							value={this.state.enclosureIDName}
							style={styles.inputText}
						/>
						{this.state.enclosureIDValidationFailed ? (
							<Text style={styles.errorText}>Choose Enclosure ID</Text>
						) : null}
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={1}
						onPress={this.toggleEnclosureTypeMenu}
						style={styles.inputContainer}
					>
						<Text style={styles.name}>Enclosure Type</Text>
						<TextInput
							editable={false}
							value={this.state.enclosureTypeName}
							style={styles.inputText}
						/>
						{this.state.enclosureTypeValidationFailed ? (
							<Text style={styles.errorText}>Choose Enclosure Type</Text>
						) : null}
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={1}
						onPress={this.toggleSectionMenu}
						style={[styles.inputContainer, styles.pb0, styles.mb0]}
					>
						<Text style={styles.name}>Section</Text>
						<TextInput
							editable={false}
							value={this.state.sectionName}
							style={styles.inputText}
						/>
						{this.state.sectionNameValidationFailed ? (
							<Text style={styles.errorText}>Choose Section Name</Text>
						) : null}
					</TouchableOpacity>

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

			<ModalMenu
				visible={this.state.isEnclosureIDMenuOpen}
				closeAction={this.toggleEnclosureIDMenu}
			>
				{this.state.enclosureIds.map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setEnclosureID.bind(this, v)}
						key={v.id}
					>
						<Text style={styles.itemtitle}>{v.enclosure_id}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>

			<ModalMenu
				visible={this.state.isEnclosureTypeMenuOpen}
				closeAction={this.toggleEnclosureTypeMenu}
			>
				{this.state.enclosureTypes.map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setEnclosureType.bind(this, v)}
						key={v.id}
					>
						<Text style={styles.itemtitle}>{v.name}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>

			<ModalMenu
				visible={this.state.isSectionMenuOpen}
				closeAction={this.toggleSectionMenu}
			>
				{this.state.sections.map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setSection.bind(this, v)}
						key={v.id}
					>
						<Text style={styles.itemtitle}>{v.name}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>
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
// 		fontWeight: "800",
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
// 		color: "#444",
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
