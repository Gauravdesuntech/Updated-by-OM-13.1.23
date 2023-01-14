import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
	ScrollView,
	Dimensions,
	Modal,
	ActivityIndicator,
	FlatList,
	Alert
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { Header, DatePicker } from "../component";
import OverlayLoader from "../component/OverlayLoader";
import InputDropdown from "../component/InputDropdown";
import {
	getAnimalFarms,
	getAnimalOrigins,
	getAnimalOwners,
	getAnimalEnclosureIds,
	generateExcel,
	getAnimalEnclosureTypes,
	getCommonNameSections,
	getCommonNameEnclosures,
	getParentAnimals,
} from "../services/APIServices";
import { getFormattedDate, } from "../utils/Util";
import AppContext from "../context/AppContext";
import * as WebBrowser from 'expo-web-browser';
import DownloadFile from "../component/DownloadFile";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import globalStyles from "../config/Styles";
import styles from './Styles'

export default class GenerateExcel extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			showLoader: true,
			processingText: "Processing...",
			isModalOpen: false,
			isFileSaved: false,
			classID:
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
			scientificName:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.scientificName
					: undefined,
			commonName:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.commonName
					: undefined,
			databaseName:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.databaseName
					: undefined,
			taxonid:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.taxonid
					: "",
			isEnclosureTypeMenuOpen: false,
			isEnclosureIDMenuOpen: false,
			isSourceMenuOpen: false,
			isDatepickerOpen: false,
			isLocationMenuOpen: false,
			isOriginMenuOpen: false,
			isOwnerMenuOpen: false,
			isIdentificationTypeMenuOpen: false,
			isAnimalSearchModalOpen: false,
			isAnimalSectionMenuOpen: false,
			isAnimalEnclosureMenuOpen: false,
			originArr: [],
			locationArr: [],
			ownersArr: [],
			enclosureTypes: [],
			enclosureIds: [],
			animalSections: [],
			animalEnclosures: [],
			enclosureTypeID: undefined,
			enclosureType: undefined,
			enclosureID: undefined,
			enclosureIDName: undefined,
			source: undefined,
			father: "",
			mother: "",
			referenceNumber: "",
			date: new Date(),
			location: undefined,
			origin: undefined,
			owner: undefined,
			identificationType: undefined,
			dna: "",
			microchip: "",
			ringNumber: "",
			pariveshID: "",
			description: "",
			remarks: "",
			quantity: "",
			animalSectionName: undefined,
			parentEnclosureID: undefined,
			searchValue: "",
			parentEnclosureIDName: undefined,
			enclosureTypeValidationFailed: false,
			enclosureIDValidationFailed: false,
			sourceValidationFailed: false,
			locationValidationFailed: false,
			originValidationFailed: false,
			ownerValidationFailed: false,
			identificationTypeValidationFailed: false,
			dnaValidationFailed: false,
			microchipValidationFailed: false,
			ringNumberValidationFailed: false,
			quantityValidationFailed: false,
			searchFor: undefined,
			isFetchingParent: true,
			parentAnimals: [],
			downloadUrl:""
		};

		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let cid = this.context.userDetails.cid;
		let { commonName } = this.state;

		Promise.all([
			getAnimalFarms(cid),
			getAnimalOrigins(cid),
			getAnimalOwners(cid),
			getAnimalEnclosureTypes(cid),
			getCommonNameSections(commonName),
		])
			.then((response) => {
				this.setState({
					showLoader: false,
					locationArr: response[0].map((v, i) => ({
						id: v.id,
						name: v.name,
						value: v.name,
					})),
					originArr: response[1].map((v, i) => ({
						id: v.id,
						name: v.name,
						value: v.name,
					})),
					ownersArr: response[2].map((v, i) => ({
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
				});
			})
			.catch((error) => console.log(error));
	};

	onChangeDate = (event, selectedDate) => {
		let currentDate = selectedDate || this.state.date;
		this.setState({
			isDatepickerOpen: false,
			date: currentDate,
		});
	};

	showDatepicker = () => this.setState({ isDatepickerOpen: true });

	gotoBack = () => this.props.navigation.goBack();

	toggleEnclosureTypeMenu = () =>
		this.setState({
			isEnclosureTypeMenuOpen: !this.state.isEnclosureTypeMenuOpen,
		});

	toggleEnclosureIDMenu = () =>
		this.setState({
			isEnclosureIDMenuOpen: !this.state.isEnclosureIDMenuOpen,
		});

	toggleSourceMenu = () =>
		this.setState({ isSourceMenuOpen: !this.state.isSourceMenuOpen });

	toggleLocationMenu = () =>
		this.setState({ isLocationMenuOpen: !this.state.isLocationMenuOpen });

	toggleOriginMenu = () =>
		this.setState({ isOriginMenuOpen: !this.state.isOriginMenuOpen });

	toggleOwnerMenu = () =>
		this.setState({ isOwnerMenuOpen: !this.state.isOwnerMenuOpen });

	toggleIdentificationTypeMenu = () =>
		this.setState({
			isIdentificationTypeMenuOpen: !this.state.isIdentificationTypeMenuOpen,
		});

	toggleAnimalSectionMenu = () =>
		this.setState({
			isAnimalSectionMenuOpen: !this.state.isAnimalSectionMenuOpen,
		});

	toggleAnimalEnclosureMenu = () =>
		this.setState({
			isAnimalEnclosureMenuOpen: !this.state.isAnimalEnclosureMenuOpen,
		});

	closeModal = () => {
		this.setState(
			{
				isModalOpen: false,
				isFileSaved: false,
				processingText: "Processing...",
			},
			() => {
				this.gotoBack();
			}
		);
	};

	openSearchModal = (searchFor) => {
		this.setState({
			isAnimalSearchModalOpen: true,
			searchFor: searchFor,
			animalSectionName: undefined,
			animalEnclosures: [],
			parentEnclosureID: undefined,
			parentEnclosureIDName: undefined,
			searchValue: "",
			parentAnimals: [],
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

	setEnclosureType = (v) => {
		this.setState(
			{
				enclosureTypeID: v.id,
				enclosureType: v.value,
				isEnclosureTypeMenuOpen: false,
				enclosureID: undefined,
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
			enclosureID: v.id,
			enclosureIDName: v.value,
			isEnclosureIDMenuOpen: false,
		});
	};

	setSource = (v) => {
		this.setState({
			source: v.value,
			father: "",
			mother: "",
			isSourceMenuOpen: false,
		});
	};

	setLocation = (v) => {
		this.setState({
			location: v.value,
			isLocationMenuOpen: false,
		});
	};

	setOrigin = (v) => {
		this.setState({
			origin: v.value,
			isOriginMenuOpen: false,
		});
	};

	setOwner = (v) => {
		this.setState({
			owner: v.value,
			isOwnerMenuOpen: false,
		});
	};

	setIdentificationType = (v) => {
		this.setState({
			identificationType: v.value,
			isIdentificationTypeMenuOpen: false,
		});
	};

	setAnimalSection = (v) => {
		this.setState(
			{
				animalSectionName: v.name,
				isAnimalSectionMenuOpen: false,
				parentEnclosureID: undefined,
				parentEnclosureIDName: undefined,
				searchValue: "",
				isFetchingParent: true,
				parentAnimals: [],
				showLoader: true,
			},
			() => {
				let { commonName } = this.state;
				let ids = v.value.join(",");

				getCommonNameEnclosures(commonName, v.id)
					.then((data) => {
						this.setState({
							animalEnclosures: data.map((v, i) => ({
								id: v.id,
								name: v.enclosure_id,
								value: v.id,
							})),
							showLoader: false,
						});
					})
					.catch((error) => console.log(error));
			}
		);
	};

	setParentEnclosure = (v) => {
		let { commonName } = this.state;
		this.setState(
			{
				parentEnclosureID: v.value,
				parentEnclosureIDName: v.name,
				isAnimalEnclosureMenuOpen: false,
				isFetchingParent: true,
				showLoader: true,
			},
			() => {
				getParentAnimals(commonName, v.value)
					.then((data) => {
						this.setState({
							showLoader: false,
							isFetchingParent: false,
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

	scrollViewScrollTop = () => {
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
	};

	submitData = () => {
		this.setState(
			{
				enclosureTypeValidationFailed: false,
				enclosureIDValidationFailed: false,
				sourceValidationFailed: false,
				locationValidationFailed: false,
				originValidationFailed: false,
				ownerValidationFailed: false,
				identificationTypeValidationFailed: false,
				dnaValidationFailed: false,
				microchipValidationFailed: false,
				ringNumberValidationFailed: false,
				quantityValidationFailed: false,
			},
			() => {
				let {
					enclosureTypeID,
					enclosureID,
					source,
					location,
					origin,
					owner,
					identificationType,
					dna,
					microchip,
					ringNumber,
					quantity,
				} = this.state;

				if (typeof enclosureTypeID === "undefined") {
					this.setState({ enclosureTypeValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof enclosureID === "undefined") {
					this.setState({ enclosureIDValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof source === "undefined") {
					this.setState({ sourceValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof location === "undefined") {
					this.setState({ locationValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof origin === "undefined") {
					this.setState({ originValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof owner === "undefined") {
					this.setState({ ownerValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof identificationType === "undefined") {
					this.setState({ identificationTypeValidationFailed: true });
				} else if (
					(identificationType === "DNA" ||
						identificationType === "DNA-Microchip" ||
						identificationType === "DNA-Ring Number" ||
						identificationType === "DNA-Microchip-Ring Number") &&
					dna.trim().length === 0
				) {
					this.setState({ dnaValidationFailed: true });
				} else if (
					(identificationType === "Microchip" ||
						identificationType === "DNA-Microchip" ||
						identificationType === "Microchip-Ring Number" ||
						identificationType === "DNA-Microchip-Ring Number") &&
					microchip.trim().length === 0
				) {
					this.setState({ microchipValidationFailed: true });
				} else if (
					(identificationType === "Ring Number" ||
						identificationType === "DNA-Ring Number" ||
						identificationType === "Microchip-Ring Number" ||
						identificationType === "DNA-Microchip-Ring Number") &&
					ringNumber.trim().length === 0
				) {
					this.setState({ ringNumberValidationFailed: true });
				} else if (quantity.trim().length === 0 || isNaN(quantity)) {
					this.setState({ quantityValidationFailed: true });
				} else if (parseInt(quantity) <= 0) {
					this.setState({ quantityValidationFailed: true });
				} else {
					this.setState({ isModalOpen: true });

					let obj = {
						animal_class: this.state.classID,
						category: this.state.categoryID,
						sub_category:
							typeof this.state.subCategoryID !== "undefined"
								? this.state.subCategoryID
								: "",
						scientific_name: this.state.scientificName,
						common_name: this.state.commonName,
						databasee: this.state.databaseName,
						taxonid: this.state.taxonid,
						enclosure_id: enclosureID,
						enclosure_type: enclosureTypeID,
						source: source,
						father: this.state.father,
						mother: this.state.mother,
						ref_inv_no: this.state.referenceNumber,
						source_date: getFormattedDate(this.state.date),
						location: location,
						origin: origin,
						owner: owner,
						identification_type: identificationType,
						dna: dna,
						microchip: microchip,
						ring_number: ringNumber,
						parivesh_id: this.state.pariveshID,
						description: this.state.description,
						remarks: this.state.remarks,
						quantity: quantity,
					};

					generateExcel(obj)
					.then((response) => {
						console.log(response);
						let data = response.data;
						this.setState(
							{
								downloadUrl: data.fileuri,
								isModalOpen: true,
							});
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
		<Container>
			<Header
				leftIconName={"arrow-back"}
				title={"Generate Excel"}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={this.gotoBack}
			/>
			<View style={styles.container}>
				<KeyboardAwareScrollView
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
							this.state.enclosureTypeValidationFailed
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
							this.state.enclosureIDValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>

					<InputDropdown
						label={"Source:"}
						isMandatory={true}
						value={this.state.source}
						isOpen={this.state.isSourceMenuOpen}
						items={Configs.ANIMAL_SOURCES}
						openAction={this.toggleSourceMenu}
						closeAction={this.toggleSourceMenu}
						setValue={this.setSource}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.sourceValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					{this.state.source === "In House Breading" ? (
						<>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.fieldBox}
								onPress={this.openSearchModal.bind(this, "father")}
							>
								<Text style={styles.labelName}>Father:</Text>
								<TextInput
									editable={false}
									value={this.state.father}
									onChangeText={(father) => this.setState({ father })}
									style={styles.textfield}
									autoCompleteType="off"
								/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.fieldBox}
								onPress={this.openSearchModal.bind(this, "mother")}
							>
								<Text style={styles.labelName}>Mother:</Text>
								<TextInput
									editable={false}
									value={this.state.mother}
									onChangeText={(mother) => this.setState({ mother })}
									style={styles.textfield}
									autoCompleteType="off"
								/>
							</TouchableOpacity>
						</>
					) : (
						<View style={styles.fieldBox}>
							<Text style={styles.labelName}>Reference/Invoice No.</Text>
							<TextInput
								value={this.state.referenceNumber}
								onChangeText={(referenceNumber) =>
									this.setState({ referenceNumber })
								}
								style={styles.textfield}
								autoCompleteType="off"
							/>
						</View>
					)}

					<DatePicker
						onPress={this.showDatepicker}
						show={this.state.isDatepickerOpen}
						onChange={this.onChangeDate}
						date={this.state.date}
						mode={"date"}
						label={"Date:"}
					/>

					<InputDropdown
						label={"Location:"}
						isMandatory={true}
						value={this.state.location}
						isOpen={this.state.isLocationMenuOpen}
						items={this.state.locationArr}
						openAction={this.toggleLocationMenu}
						closeAction={this.toggleLocationMenu}
						setValue={this.setLocation}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.locationValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<InputDropdown
						label={"Origin:"}
						isMandatory={true}
						value={this.state.origin}
						isOpen={this.state.isOriginMenuOpen}
						items={this.state.originArr}
						openAction={this.toggleOriginMenu}
						closeAction={this.toggleOriginMenu}
						setValue={this.setOrigin}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.originValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<InputDropdown
						label={"Owner:"}
						isMandatory={true}
						value={this.state.owner}
						isOpen={this.state.isOwnerMenuOpen}
						items={this.state.ownersArr}
						openAction={this.toggleOwnerMenu}
						closeAction={this.toggleOwnerMenu}
						setValue={this.setOwner}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.ownerValidationFailed ? styles.errorFieldBox : null,
						]}
					/>

					<InputDropdown
						label={"Identification Type:"}
						isMandatory={true}
						value={this.state.identificationType}
						isOpen={this.state.isIdentificationTypeMenuOpen}
						items={Configs.ANIMAL_IDENTIFICATION_TYPES}
						openAction={this.toggleIdentificationTypeMenu}
						closeAction={this.toggleIdentificationTypeMenu}
						setValue={this.setIdentificationType}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.identificationTypeValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>

					{this.state.identificationType === "DNA" ||
						this.state.identificationType === "DNA-Microchip" ||
						this.state.identificationType === "DNA-Ring Number" ||
						this.state.identificationType === "DNA-Microchip-Ring Number" ? (
						<View
							style={[
								styles.fieldBox,
								this.state.dnaValidationFailed ? styles.errorFieldBox : null,
							]}
						>
							<Text style={styles.labelName}>
								DNA:<Text style={{ color: Colors.tomato }}> *</Text>
							</Text>
							<TextInput
								value={this.state.dna}
								onChangeText={(dna) => this.setState({ dna })}
								style={styles.textfield}
								autoCompleteType="off"
							/>
						</View>
					) : null}

					{this.state.identificationType === "Microchip" ||
						this.state.identificationType === "DNA-Microchip" ||
						this.state.identificationType === "Microchip-Ring Number" ||
						this.state.identificationType === "DNA-Microchip-Ring Number" ? (
						<View
							style={[
								styles.fieldBox,
								this.state.microchipValidationFailed
									? styles.errorFieldBox
									: null,
							]}
						>
							<Text style={styles.labelName}>
								Microchip:<Text style={{ color: Colors.tomato }}> *</Text>
							</Text>
							<TextInput
								value={this.state.microchip}
								onChangeText={(microchip) => this.setState({ microchip })}
								style={styles.textfield}
								autoCompleteType="off"
							/>
						</View>
					) : null}

					{this.state.identificationType === "Ring Number" ||
						this.state.identificationType === "DNA-Ring Number" ||
						this.state.identificationType === "Microchip-Ring Number" ||
						this.state.identificationType === "DNA-Microchip-Ring Number" ? (
						<View
							style={[
								styles.fieldBox,
								this.state.ringNumberValidationFailed
									? styles.errorFieldBox
									: null,
							]}
						>
							<Text style={styles.labelName}>
								Ring Number:<Text style={{ color: Colors.tomato }}> *</Text>
							</Text>
							<TextInput
								value={this.state.ringNumber}
								onChangeText={(ringNumber) => this.setState({ ringNumber })}
								style={styles.textfield}
								autoCompleteType="off"
							/>
						</View>
					) : null}

					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>Parivesh ID:</Text>
						<TextInput
							value={this.state.pariveshID}
							onChangeText={(pariveshID) => this.setState({ pariveshID })}
							style={styles.textfield}
						/>
					</View>

					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>Condition on arrival :</Text>
						<TextInput
							value={this.state.description}
							onChangeText={(description) => this.setState({ description })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>Remarks :</Text>
						<TextInput
							value={this.state.remarks}
							onChangeText={(remarks) => this.setState({ remarks })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.quantityValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Quantity: <Text style={{ color: Colors.tomato }}> *</Text></Text>
						<TextInput
							value={this.state.quantity}
							onChangeText={(quantity) => this.setState({ quantity })}
							style={styles.textfield}
							autoCompleteType="off"
							keyboardType="numeric"
						/>
					</View>

					<TouchableOpacity style={styles.button} onPress={this.submitData}>
						<Text style={styles.textWhite}>Save Details</Text>
					</TouchableOpacity>
				</KeyboardAwareScrollView>
			</View>

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
								<Text style={{ fontSize: 20, color: Colors.white }}>
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

			{/* Excel Generating Process */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isModalOpen}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalBody}>
						<DownloadFile
							url={this.state.downloadUrl}
							viewStyle={styles.downloadBtn}
							textStyle={{ fontSize: 16, marginHorizontal: 5 }}
							design={<AntDesign name="download" size={20} />}
							text={"Download"}
						/>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.closeBtn}
							onPress={this.closeModal}
						>
							<Text style={styles.closeBtnText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<OverlayLoader visible={this.state.showLoader} />
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
// 	textfielddate: {
// 		backgroundColor: "#fff",
// 		height: 40,
// 		lineHeight: 30,
// 		fontSize: 12,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		width: "50%",
// 		padding: 5,
// 		fontWeight: "bold",
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
// 	},
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 	},
// 	labelName: {
// 		color: Colors.textColor,
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
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
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
// 		width: Math.floor((windowWidth * 60) / 100),
// 		minHeight: Math.floor(windowHeight / 5),
// 		padding: 15,
// 		borderRadius: 3,
// 		elevation: 5,
// 	},
// 	downloadBtn: {
// 		flexDirection: "row",
// 		paddingHorizontal: 20,
// 		paddingVertical: 8,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
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
