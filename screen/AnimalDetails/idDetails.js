import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ToastAndroid,
	Image,
	Alert,
	Dimensions,
	Modal,
	FlatList,
	TouchableHighlight,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { DatePicker } from "../../component";
import InputDropdown from "../../component/InputDropdown";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import {
	createAnimalProfile,
	getAnimalProfileData,
	getAnimalFarms,
	getAnimalOrigins,
	getAnimalOwners,
	getAnimalEnclosureTypes,
	getAnimalEnclosureIds,
	getCommonNameSections,
	getCommonNameEnclosures,
	getParentAnimals,
} from "../../services/APIServices";
import { getFileData, getFormattedDate } from "../../utils/Util";
import OverlayLoader from "../../component/OverlayLoader";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class IdDetails extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			showLoader: true,
			animalFarms: [],
			animalOrigins: [],
			animalOwners: [],
			enclosureTypes: [],
			enclosureIds: [],
			id:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.id
					: 0,
			fullName:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.scientificName
					: "",
			englishName:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.commonName
					: "",
			groupID:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.classID
					: undefined,
			categoryID:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.categoryID
					: undefined,
			subCategoryID:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.subCategoryID
					: undefined,
			animalType:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.animalType
					: Configs.ANIMAL_TYPE_INDIVIDUAL,
			database:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.databaseName
					: undefined,
			taxoinid:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.taxonid
					: "",
			animalID: "",
			enclosureTypeID: undefined,
			enclosureType: undefined,
			enclosureId: undefined,
			enclosureIDName: undefined,
			source: undefined,
			father: "",
			mother: "",
			referenceNumber: "",
			date: new Date(),
			farm: undefined,
			origin: undefined,
			owner: undefined,
			identificationType: undefined,
			gender: undefined,
			dna: "",
			microchip: "",
			ringNumber: "",
			imageURI: undefined,
			imageData: undefined,
			slNo: "",
			pariveshID: "",
			description: "",
			remarks: "",
			isSourceMenuOpen: false,
			isDatepickerOpen: false,
			isFarmMenuOpen: false,
			isOrigniMenuOpen: false,
			isOwnerMenuOpen: false,
			isEnclosureTypeMenuOpen: false,
			isEnclosureIDMenuOpen: false,
			isIdentificationTypeMenuOpen: false,
			isGenderMenuOpen: false,
			isSourceValidationFailed: false,
			isTaxoinidValidationFailed: false,
			isSerialNoValidationFailed: false,
			isPariveshIDValidationFailed: false,
			isFarmValidationFailed: false,
			isOriginValidationFailed: false,
			isOwnerValidationFailed: false,
			isEnclosureTypeValidationFailed: false,
			isEnclosureIDValidationFailed: false,
			isIdentificationTypeValidationFailed: false,
			isGenderValidationFailed: false,
			isIdentificationValueValidationFailed: false,
			isDNAValueValidationFailed: false,
			isMicrochipValueValidationFailed: false,
			isRingNumberValueValidationFailed: false,
			isDescriptionValidsationFailed: false,
			isRemarksValidationFailed: false,
			animalSections: [],
			animalEnclosures: [],
			parentAnimals: [],
			isAnimalSearchModalOpen: false,
			isAnimalSectionMenuOpen: false,
			isAnimalEnclosureMenuOpen: false,
			animalSectionName: undefined,
			parentEnclosureID: undefined,
			parentEnclosureIDName: undefined,
			searchValue: "",
			searchFor: undefined,
			isFetchingParent: true,
		};
		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let { id, englishName } = this.state;
		let cid = this.context.userDetails.cid;
		let animalID = this.context.selectedAnimalID;
		Promise.all([
			getAnimalFarms(cid),
			getAnimalOrigins(),
			getAnimalOwners(),
			getAnimalEnclosureTypes(cid),
			getCommonNameSections(englishName),
			getAnimalProfileData(animalID),
		])
			.then((response) => {
				let stateObj = {
					animalFarms: response[0].map((v, i) => ({
						id: v.id,
						name: v.name,
						value: v.name,
					})),
					animalOrigins: response[1].map((v, i) => ({
						id: v.id,
						name: v.name,
						value: v.name,
					})),
					animalOwners: response[2].map((v, i) => ({
						id: v.id,
						name: v.name,
						value: v.name,
					})),
					enclosureTypes: response[3].map((v, i) => ({
						id: v.id,
						name: v.name,
						value: v.name,
					})),
					animalSections: response[4].map((v, i) => ({
						id: v.section_id,
						name: v.section_name,
						value: v.enclosure_ids,
					})),
					showLoader: false,
				};

					let data = response[5];
					stateObj.fullName = data.full_name !== null ? data.full_name : "";
					stateObj.englishName =
						data.english_name !== null ? data.english_name : "";
					stateObj.groupID = data.group_id;
					stateObj.categoryID = data.category_id;
					stateObj.subCategoryID =
						data.sub_category_id !== null ? data.sub_category_id : undefined;
					stateObj.animalType =
						data.type !== null ? data.type : Configs.ANIMAL_TYPE_INDIVIDUAL;
					stateObj.animalID = data.animal_id;
					stateObj.database =
						data.databasee !== null ? data.databasee : undefined;
					stateObj.taxoinid = data.taxonid !== null ? data.taxonid : "";
					stateObj.enclosureTypeID =
						data.enclosure_type_id !== null
							? data.enclosure_type_id
							: undefined;
					stateObj.enclosureType =
						data.enclosure_type_name !== null
							? data.enclosure_type_name
							: undefined;
					stateObj.enclosureId =
						data.enclosure_id !== null ? data.enclosure_id : undefined;
					stateObj.enclosureIDName =
						data.enclosure_id_name !== null
							? data.enclosure_id_name
							: undefined;

					stateObj.farm = data.farm !== null ? data.farm : undefined;
					stateObj.origin = data.origin !== null ? data.origin : undefined;
					stateObj.owner = data.owner !== null ? data.owner : undefined;
					
					stateObj.pariveshID =
						data.parivesh_id !== null ? data.parivesh_id : "";
					stateObj.description =
						data.description !== null ? data.description : "";
					stateObj.remarks = data.remarks !== null ? data.remarks : "";
					stateObj.gender = data.gender !== null ? data.gender : "";

					this.getEnclosureIds(data.enclosure_type_id);


				this.setState(stateObj);
			})
			.catch((error) => console.log(error));
	};



	toggleSourceMenu = () =>
		this.setState({ isSourceMenuOpen: !this.state.isSourceMenuOpen });

	showDatepicker = () => this.setState({ isDatepickerOpen: true });

	toggleFarmMenu = () =>
		this.setState({ isFarmMenuOpen: !this.state.isFarmMenuOpen });

	toggleOriginMenu = () =>
		this.setState({ isOrigniMenuOpen: !this.state.isOrigniMenuOpen });

	toggleOwnerMenu = () =>
		this.setState({ isOwnerMenuOpen: !this.state.isOwnerMenuOpen });

	toggleEnclosureTypeMenu = () =>
		this.setState({
			isEnclosureTypeMenuOpen: !this.state.isEnclosureTypeMenuOpen,
		});

	toggleEnclosureIDMenu = () =>
		this.setState({
			isEnclosureIDMenuOpen: !this.state.isEnclosureIDMenuOpen,
		});

	toggleIdentificationTypeMenu = () =>
		this.setState({
			isIdentificationTypeMenuOpen: !this.state.isIdentificationTypeMenuOpen,
		});

	toggleGenderMenu = () =>
		this.setState({
			isGenderMenuOpen: !this.state.isGenderMenuOpen,
		});

	toggleAnimalSectionMenu = () =>
		this.setState({
			isAnimalSectionMenuOpen: !this.state.isAnimalSectionMenuOpen,
		});

	toggleAnimalEnclosureMenu = () =>
		this.setState({
			isAnimalEnclosureMenuOpen: !this.state.isAnimalEnclosureMenuOpen,
		});

	setSource = (v) => {
		this.setState({
			source: v.value,
			isSourceMenuOpen: false,
		});
	};

	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.date;
		this.setState({
			isDatepickerOpen: false,
			date: currentDate,
		});
	};

	setFarmData = (v) => {
		this.setState({
			farm: v.value,
			isFarmMenuOpen: false,
		});
	};

	setOriginData = (v) => {
		this.setState({
			origin: v.value,
			isOrigniMenuOpen: false,
		});
	};

	setOwnerData = (v) => {
		this.setState({
			owner: v.value,
			isOwnerMenuOpen: false,
		});
	};

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
					enclosureIds: data.map((v, i) => ({
						id: v.id,
						name: v.enclosure_id,
						value: v.enclosure_id,
					})),
					showLoader: false,
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

	setIdentificationType = (v) => {
		this.setState({
			identificationType: v.value,
			isIdentificationTypeMenuOpen: false,
		});
	};

	setGender = (v) => {
		this.setState({
			gender: v.value,
			isGenderMenuOpen: false,
		});
	};

	setAnimalSection = (v) => {
		this.setState(
			{
				animalSectionName: v.name,
				isAnimalSectionMenuOpen: false,
				parentEnclosureID: undefined,
				parentEnclosureIDName: undefined,
				isFetchingParent: true,
				parentAnimals: [],
				searchValue: "",
				showLoader: true,
			},
			() => {
				let { englishName } = this.state;
				let ids = v.value.join(",");

				getCommonNameEnclosures(englishName, v.id)
					.then((data) => {
						this.setState({
							showLoader: false,
							animalEnclosures: data.map((v, i) => ({
								id: v.id,
								name: v.enclosure_id,
								value: v.id,
							})),
						});
					})
					.catch((error) => console.log(error));
			}
		);
	};

	setParentEnclosure = (v) => {
		let { englishName } = this.state;

		this.setState(
			{
				parentEnclosureID: v.value,
				parentEnclosureIDName: v.name,
				isAnimalEnclosureMenuOpen: false,
				isFetchingParent: true,
				parentAnimals: [],
				searchValue: "",
				showLoader: true,
			},
			() => {
				getParentAnimals(englishName, v.value)
					.then((data) => {
						this.setState({
							isFetchingParent: false,
							showLoader: false,
							parentAnimals: data,
						});
					})
					.catch((error) => console.log(error));
			}
		);
	};

	getParentAnimalsData = () => {
		let { parentAnimals, searchValue } = this.state;

		let data = parentAnimals.filter((element) => {
			let animalID = element.animal_id.toLowerCase();
			let index = animalID.indexOf(searchValue.toLowerCase());
			return index > -1;
		});

		return data;
	};

	openSearchModal = (searchFor) => {
		this.setState({
			isAnimalSearchModalOpen: true,
			searchFor: searchFor,
			animalSectionName: undefined,
			animalEnclosures: [],
			parentEnclosureID: undefined,
			parentEnclosureIDName: undefined,
			isFetchingParent: true,
			parentAnimals: [],
			searchValue: "",
		});
	};

	closeSearchModal = () => {
		this.setState({
			isAnimalSearchModalOpen: false,
			searchFor: "",
			animalSectionName: undefined,
			animalEnclosures: [],
			parentEnclosureID: undefined,
			parentEnclosureIDName: undefined,
			isFetchingParent: true,
			parentAnimals: [],
			searchValue: "",
		});
	};

	selectParent = (animalCode) => {
		let stateObj = {
			isAnimalSearchModalOpen: false,
			searchFor: "",
			animalSectionName: undefined,
			animalEnclosures: [],
			parentEnclosureID: undefined,
			parentEnclosureIDName: undefined,
			isFetchingParent: true,
			parentAnimals: [],
			searchValue: "",
		};

		if (this.state.searchFor === "father") {
			stateObj.father = animalCode;
		} else {
			stateObj.mother = animalCode;
		}

		this.setState(stateObj);
	};

	scrollViewScrollTop = () => {
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
	};

	saveProfileData = () => {
		let {
			enclosureType,
			enclosureId,
			farm,
			origin,
			owner,
			gender,
		} = this.state;

		this.setState(
			{
				isEnclosureTypeValidationFailed: false,
				isEnclosureIDValidationFailed: false,
				isSourceValidationFailed: false,
				isFarmValidationFailed: false,
				isOriginValidationFailed: false,
				isOwnerValidationFailed: false,
				isIdentificationTypeValidationFailed: false,
				isGenderValidationFailed: false,
				isDNAValueValidationFailed: false,
				isMicrochipValueValidationFailed: false,
				isRingNumberValueValidationFailed: false,
			},
			() => {
				if (typeof enclosureType === "undefined") {
					this.setState({ isEnclosureTypeValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof enclosureId === "undefined") {
					this.setState({ isEnclosureIDValidationFailed: true });
					this.scrollViewScrollTop();
				}  else if (typeof farm === "undefined") {
					this.setState({ isFarmValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof origin === "undefined") {
					this.setState({ isOriginValidationFailed: true });
				} else if (typeof owner === "undefined") {
					this.setState({ isOwnerValidationFailed: true });
				} else {
					this.setState({ showLoader: true });

					let obj = {
						id: this.state.id,
						cid: this.context.userDetails.cid,
						animal_id: this.state.animalID,
						full_name: this.state.fullName,
						english_name: this.state.englishName,
						animal_group: this.state.groupID,
						category: this.state.categoryID,
						sub_category:
							typeof this.state.subCategoryID !== "undefined"
								? this.state.subCategoryID
								: "",
						type: this.state.animalType,
						databasee:
							typeof this.state.database !== "undefined"
								? this.state.database
								: "",
						taxonid: this.state.taxoinid,
						enclosure_type: this.state.enclosureTypeID,
						enclosure_id: enclosureId,
						parivesh_id: this.state.pariveshID,
						farm: farm,
						origin: origin,
						owner: owner,
						description: this.state.description,
						remarks: this.state.remarks,
						sex: this.state.gender
					};

					if (typeof this.state.imageData !== "undefined") {
						obj.image = this.state.imageData;
					}

					createAnimalProfile(obj)
						.then((response) => {
							this.setState(
								{
									showLoader: false,
								},
								() => {
									ToastAndroid.show("Changes made successfully", ToastAndroid.SHORT);
								}
							);
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	renderSearchItem = ({ item }) => {
		let identificationValues = [];
		if (item.dna !== null) {
			identificationValues.push(item.dna);
		}
		if (item.microchip !== null) {
			identificationValues.push(item.microchip);
		}
		if (item.ring_number !== null) {
			identificationValues.push(item.ring_number);
		}

		return (
			<TouchableHighlight
				underlayColor={"#eee"}
				onPress={this.selectParent.bind(this, item.animal_id)}
			>
				<View style={styles.listItemContainer}>
					<View style={{ width: "85%", justifyContent: "center" }}>
						<Text style={styles.titleText}>{item.animal_id}</Text>
						<Text style={styles.subText}>{item.english_name}</Text>
						{identificationValues.length > 0 ? (
							<Text style={styles.subText}>
								{identificationValues.join("-")}
							</Text>
						) : null}
					</View>
					<View style={styles.angelIconContainer}>
						<Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
					</View>
				</View>
			</TouchableHighlight>
		);
	};

	render = () => (
		<>
			<ScrollView ref={this.scrollViewRef} showsVerticalScrollIndicator={false}>
				<View style={styles.container}>
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

					

					<InputDropdown
						label={"Location:"}
						isMandatory={true}
						value={this.state.farm}
						isOpen={this.state.isFarmMenuOpen}
						items={this.state.animalFarms}
						openAction={this.toggleFarmMenu}
						closeAction={this.toggleFarmMenu}
						setValue={this.setFarmData}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.isFarmValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<InputDropdown
						label={"Origin:"}
						isMandatory={true}
						value={this.state.origin}
						isOpen={this.state.isOrigniMenuOpen}
						items={this.state.animalOrigins}
						openAction={this.toggleOriginMenu}
						closeAction={this.toggleOriginMenu}
						setValue={this.setOriginData}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.isOriginValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<InputDropdown
						label={"Owner:"}
						isMandatory={true}
						value={this.state.owner}
						isOpen={this.state.isOwnerMenuOpen}
						items={this.state.animalOwners}
						openAction={this.toggleOwnerMenu}
						closeAction={this.toggleOwnerMenu}
						setValue={this.setOwnerData}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.isOwnerValidationFailed ? styles.errorFieldBox : null,
						]}
					/>


					

					<View
						style={[
							styles.fieldBox,
							this.state.isPariveshIDValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Parivesh ID:</Text>
						<TextInput
							value={this.state.pariveshID}
							onChangeText={(pariveshID) => this.setState({ pariveshID })}
							style={styles.textfield}
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.isDescriptionValidsationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Condition on arrival :</Text>
						<TextInput
							value={this.state.description}
							onChangeText={(description) => this.setState({ description })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.isRemarksValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Remarks :</Text>
						<TextInput
							value={this.state.remarks}
							onChangeText={(remarks) => this.setState({ remarks })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<TouchableOpacity
						style={styles.button}
						onPress={this.saveProfileData}
					>
						<Text style={styles.textWhite}>Save Details</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/*Search Modal for Father and Mother*/}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isAnimalSearchModalOpen}
			>
				<View style={styles.searchModalOverlay}>
					<View style={styles.seacrhModalContainer}>
						<View style={styles.searchModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.headerBackBtnContainer}
								onPress={this.closeSearchModal}
							>
								<Ionicons name="arrow-back" size={25} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.headerTitleContainer}>
								<Text
									style={{
										fontSize: 20,
										color: Colors.white,
									}}
								>
									{this.state.searchFor === "father"
										? "Select Father"
										: "Select Mother"}
								</Text>
							</View>
						</View>
						<View style={styles.searchModalBody}>
							<InputDropdown
								label={"Select Section:"}
								value={this.state.animalSectionName}
								isOpen={this.state.isAnimalSectionMenuOpen}
								items={this.state.animalSections}
								openAction={this.toggleAnimalSectionMenu}
								closeAction={this.toggleAnimalSectionMenu}
								setValue={this.setAnimalSection}
								labelStyle={styles.labelName}
								textFieldStyle={styles.textfield}
								style={[styles.fieldBox]}
							/>

							<InputDropdown
								label={"Enclosure ID:"}
								value={this.state.parentEnclosureIDName}
								isOpen={this.state.isAnimalEnclosureMenuOpen}
								items={this.state.animalEnclosures}
								openAction={this.toggleAnimalEnclosureMenu}
								closeAction={this.toggleAnimalEnclosureMenu}
								setValue={this.setParentEnclosure}
								labelStyle={styles.labelName}
								textFieldStyle={styles.textfield}
								style={[styles.fieldBox]}
							/>

							{typeof this.state.parentEnclosureIDName !== "undefined" ? (
								<View style={styles.fieldBox}>
									<TextInput
										autoCompleteType="off"
										autoCapitalize="none"
										placeholder={"Type Animal Code"}
										value={this.state.searchValue}
										style={[
											styles.textfield,
											{ width: "100%", textAlign: "left", fontSize: 14 },
										]}
										onChangeText={(searchValue) =>
											this.setState({ searchValue })
										}
									/>
								</View>
							) : null}

							{this.state.isFetchingParent ? null : (
								<FlatList
									contentContainerStyle={{ flex: 1 }}
									data={this.getParentAnimalsData()}
									keyExtractor={(item, index) => item.id.toString()}
									renderItem={this.renderSearchItem}
									initialNumToRender={this.state.parentAnimals.length}
									ListEmptyComponent={() => (
										<Text style={styles.searchingText}>No Result Found</Text>
									)}
								/>
							)}
						</View>
					</View>
				</View>
			</Modal>

			<OverlayLoader visible={this.state.showLoader} />
		</>
	);
}

// const windowHeight = Dimensions.get("window").height;
// const windowWidth = Dimensions.get("window").width;

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
		
// 		fontSize: 12,
// 		color: Colors.textColor,
// 		textAlign: "right",
// 		width: "60%",
// 		padding: 5,
// 	},
// 	labelName: {
// 		color: Colors.textColor,
// 		lineHeight: 40,
// 		fontSize: 14,
// 		paddingLeft: 4,
// 	},
// 	imagePicker: {
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 		alignItems: "center",
// 		justifyContent: "center",
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
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// 	searchModalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	seacrhModalContainer: {
// 		flex: 1,
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 		elevation: 5,
// 	},
// 	searchModalHeader: {
// 		height: 55,
// 		flexDirection: "row",
// 		width: "100%",
// 		backgroundColor: Colors.primary,
// 		elevation: 1,
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 	},
// 	headerBackBtnContainer: {
// 		width: "20%",
// 		height: 55,
// 		paddingLeft: 8,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	headerTitleContainer: {
// 		width: "80%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 		padding: 6,
// 	},
// 	searchingText: {
// 		fontSize: 12,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		alignSelf: "center",
// 		marginTop: 20,
// 	},
// 	listItemContainer: {
// 		flexDirection: "row",
// 		paddingHorizontal: 6,
// 		paddingVertical: 5,
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 	},
// 	titleText: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 14,
		
// 	},
// 	angelIconContainer: {
// 		width: "15%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	rightAngelIcon: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},
// });
