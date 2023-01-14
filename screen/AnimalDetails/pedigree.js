import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ToastAndroid,
	Modal,
	FlatList,
	Dimensions,
	TouchableHighlight,
	Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import InputDropdown from "../../component/InputDropdown";
import { DatePicker } from "../../component";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import ModalMenu from "../../component/ModalMenu";
import OverlayLoader from "../../component/OverlayLoader";
import { getFormattedDate, calculateAge, getFileData, } from "../../utils/Util";
import {
	getAnimalPedigree,
	saveAnimalPedigreeDetails,
	getParentAnimals,
	getCommonNameSections,
	getCommonNameEnclosures,
	getAnimalID,
	uploadAnimalImages
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import moment from "moment";
import { Modal as NativeModal } from "react-native-modal";
import styles from "../../config/Styles";

export default class Pedigree extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
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
			showSourceDate: false,
			show: false,
			showApproxDOB: false,
			dobSelected: false,
			approxDOBSelected: false,
			dob: new Date(),
			approxDOB: new Date(),
			sourceDate: new Date(),
			approxAge: '',
			age: '',
			placeOfBirth: "",
			sex: "",
			sexIdentificationType: undefined,
			source: undefined,
			father: "",
			mother: "",
			referenceNumber: "",
			color: "",
			birthWeight: "",
			birth_type: "",
			conditionOnArrivalOrBirth: "",
			ringNumber: "",
			dna: "",
			microchip: "",
			animal_status: '',
			animal_dead_reason: '',

			isSexIdentificationTypeMenuOpen: false,
			isplaceOfBirthValidationFailed: false,
			isSexValidationFailed: false,
			isSexIdentificationTypeValidationFailed: false,
			isMotherValidationFailed: false,
			isFatherValidationFailed: false,
			isColorValidationFailed: false,
			isBirthWeightValidationFailed: false,
			isConditionOnArrivalOrBirthValidationFailed: false,
			isMicrochipValueValidationFailed: false,
			isRingNumberValueValidationFailed: false,
			isDNAValueValidationFailed: false,
			showLoader: true,
			isAnimalSearchModalOpen: false,
			isAnimalEnclosureMenuOpen: false,
			isAnimalSectionMenuOpen: false,
			searchFor: undefined,
			animalSectionName: undefined,
			animalEnclosures: [],
			parentEnclosureID: undefined,
			parentEnclosureIDName: undefined,
			isFetchingParent: true,
			parentAnimals: [],
			searchValue: "",
			isSourceMenuOpen: false,
			isSourceValidationFailed: false,
			animalSections: [],
			identificationType: undefined,
			isIdentificationTypeMenuOpen: false,
			imageURI: undefined,
			imageData: undefined,
			animalSingleimageURI: undefined,
			animalSingleimageData: undefined,
			animalImages: [],
			isGenderMenuOpen: false,
			isBirthTypeMenuOpen: false,
			isAnimalStatusMenuOpen: false,
			animalDeadReasonModalVisible: false
		};
		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		// let animalID = this.context.selectedAnimalID;
		let { id, englishName } = this.state;
		Promise.all([
			getCommonNameSections(englishName),
			parseInt(id) === 0 ? getAnimalID() : getAnimalPedigree(id)])
			.then((response) => {
				let stateObj = {
					animalSections: response[0].map((v, i) => ({
						id: v.section_id,
						name: v.section_name,
						value: v.enclosure_ids,
					}))
				}

				if (parseInt(id) > 0) {

					let data = response[1];
					let dob;
					let approxDOB;
					if (data.dobSelected == 'true') {
						dob = new Date(data.dob);
					} else {
						dob = new Date();
					}

					if (data.approxDOBSelected == 'true') {
						approxDOB = new Date(data.approxDOB);
					} else {
						approxDOB = new Date();
					}
					stateObj.dob = dob;
					stateObj.animalID = data.animal_id;
					stateObj.approxDOB = approxDOB;
					stateObj.dobSelected = data.dobSelected;
					stateObj.approxDOBSelected = data.approxDOBSelected;
					stateObj.approxAge = data.approxAge;
					stateObj.placeOfBirth = data.place_of_birth !== null ? data.place_of_birth : "";
					stateObj.sex = data.sex !== null ? data.sex : "";
					stateObj.mother = data.mother !== null ? data.mother : "";
					stateObj.father = data.father !== null ? data.father : "";
					stateObj.color = data.color !== null ? data.color : "";
					stateObj.birthWeight = data.birth_weight !== null ? data.birth_weight : "";
					stateObj.birth_type = data.birth_type !== null ? data.birth_type : "";
					stateObj.conditionOnArrivalOrBirth =
						data.condition_on_arrival_birth !== null
							? data.condition_on_arrival_birth
							: "";
					stateObj.englishName = data.english_name !== null ? data.english_name : "";
					stateObj.source = data.source !== null ? data.source : undefined;
					stateObj.father = data.father !== null ? data.father : "";
					stateObj.mother = data.mother !== null ? data.mother : "";
					stateObj.referenceNumber = data.ref_inv_no !== null ? data.ref_inv_no : "";
					stateObj.sourceDate = data.source_date !== null ? new Date(data.source_date) : new Date();
					stateObj.identificationType =
						data.identification_type !== null
							? data.identification_type
							: undefined;
					stateObj.dna = data.dna !== null ? data.dna : "";
					stateObj.microchip = data.microchip !== null ? data.microchip : "";
					stateObj.ringNumber = data.ring_number !== null ? data.ring_number : "";
					stateObj.animal_status = data.animal_status !== null ? data.animal_status : '';
					stateObj.animal_dead_reason = data.animal_dead_reason !== null ? data.animal_dead_reason : '';
					stateObj.imageURI = data.dna_image !== null ? `${Configs.IMAGE_URL}upload/icon/${data.dna_image}` : undefined;
					stateObj.animalImages = data.animal_images !== null ? data.animal_images.map((item)=>{return `${Configs.IMAGE_URL}upload/photos/${item}`}) : [];
				} else {
					stateObj.animalID = response[1];
				}
				this.setState(stateObj, () => { this.getCurrentAge() });
			})
			.catch((error) => console.log(error));

		console.log("Age", this.state.age)
	};

	componentDidUpdate() {
		// console.log("Age did update", this.state.age)
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
						});
					}
				});
			} else {
				Alert.alert("Please allow permission to choose an icon");
			}
		});
	};

	chooseAnimalPhotos = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					animalSingleimageURI: undefined,
					animalSingleimageData: undefined,
				});

				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: false,
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						this.setState({
							animalSingleimageURI: result.uri,
							animalSingleimageData: getFileData(result),
							animalImages: [...this.state.animalImages, result.uri],
							showLoader: true
						}, () => {
							this.docUploadHandler({
								data: getFileData(result)
							})
						});
					}
				});
			} else {
				Alert.alert("Please allow permission to choose an icon");
			}
		});
	};

	docUploadHandler = (data) => {
		data.animal_id = this.state.animalID;
		uploadAnimalImages(data)
		    .then((res) => {
				console.log("Response",res)
		        if (res.check == 'success') {
		            this.setState({ imageLoader: false, showLoader: false });
		        } else {
		            this.setState({ imageLoader: false, showLoader: false });
		            alert("Please reupload the last image")
		        }
		    })
		    .catch((err) => { console.log(err) })
	}

	onChangeDate = (event, selectedDate) => {
		const currentDate = selectedDate || this.state.dob;
		this.setState({
			show: false,
			dob: currentDate,
			dobSelected: true,
			approxDOBSelected: false
		});
	};

	onChangeSourceDate = (event, selectedDate) => {
		const currentDate = selectedDate || this.state.dob;
		this.setState({
			showSourceDate: false,
			sourceDate: currentDate,
		});
	};

	onChangeApproxDate = (event, selectedDate) => {
		const currentDate = selectedDate || this.state.dob;
		this.setState({
			showApproxDOB: false,
			approxDOB: currentDate,
			approxDOBSelected: true,
			dobSelected: false
		}, () => this.calCulateApproxAge(currentDate));
	};

	showDatepicker = () => this.setState({ show: true });

	showSourceDatepicker = () => this.setState({ showSourceDate: true });

	showApproximateDOBpicker = () => this.setState({ showApproxDOB: true });

	calCulateApproxAge = (dob) => {
		let result = calculateAge(new Date(), dob);
		this.setState({
			approxAge: result.age,
			age: result.age
		})
	}

	getCurrentAge = () => {
		let result = {
			"age": '1'
		};
		let { dobSelected, approxDOBSelected, dob, approxDOB } = this.state;
		if (dobSelected == 'true') {
			result = calculateAge(new Date(), dob);
			this.setState({ age: result.age, approxAge: 0, });
		}
		if (approxDOBSelected == 'true') {
			result = calculateAge(new Date(), approxDOB);
			this.setState({ age: result.age, });
		}
		this.setState({ showLoader: false });
	}

	handleApproxAge = (approxAge) => {
		let date = moment();
		let age = approxAge.split(" ");
		if (age[1] == 'Y') {
			let dob = date.subtract(age[0], 'years');
			this.setState({
				approxDOB: new Date(dob),
				approxDOBSelected: true,
				dobSelected: false,
				dob: new Date(),
			});
		}

		if (age[1] == 'M') {
			let dob = date.subtract(age[0], 'months');
			this.setState({
				approxDOB: new Date(dob),
				approxDOBSelected: true,
				dobSelected: false,
				dob: new Date(),
			});
		}

		this.setState({ approxAge: approxAge, age: approxAge });
	}
	toggleIdentificationTypeMenu = () =>
		this.setState({
			isIdentificationTypeMenuOpen: !this.state.isIdentificationTypeMenuOpen,
		});

	toggleSexIdentificationTypeMenu = () =>
		this.setState({
			isSexIdentificationTypeMenuOpen:
				!this.state.isSexIdentificationTypeMenuOpen,
		});

	setSexIdentificationType = (type) =>
		this.setState({
			sexIdentificationType: type,
			isSexIdentificationTypeMenuOpen: false,
		});

	setSource = (v) => {
		this.setState({
			source: v.value,
			isSourceMenuOpen: false,
		});
	};

	setIdentificationType = (v) => {
		this.setState({
			identificationType: v.value,
			isIdentificationTypeMenuOpen: false,
		});
	};
	toggleSourceMenu = () =>
		this.setState({ isSourceMenuOpen: !this.state.isSourceMenuOpen });

	toggleAnimalSectionMenu = () =>
		this.setState({
			isAnimalSectionMenuOpen: !this.state.isAnimalSectionMenuOpen,
		});

	toggleAnimalEnclosureMenu = () =>
		this.setState({
			isAnimalEnclosureMenuOpen: !this.state.isAnimalEnclosureMenuOpen,
		});
	toggleGenderMenu = () =>
		this.setState({
			isGenderMenuOpen: !this.state.isGenderMenuOpen,
		});

	toggleBirthTypeMenu = () => {
		this.setState({
			isBirthTypeMenuOpen: !this.state.isBirthTypeMenuOpen
		});
	}

	toggleAnimalStatusMenu = () => {
		this.setState({
			isAnimalStatusMenuOpen: !this.state.isAnimalStatusMenuOpen
		});
	}

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

	setGender = (v) => {
		this.setState({
			sex: v.value,
			isGenderMenuOpen: false,
		});
	};

	setBirthType = (v) => {
		this.setState({
			birth_type: v.value,
			isBirthTypeMenuOpen: false
		});
	}

	setAnimalStatus = (v) => {
		this.setState({
			animal_status: v.value,
			isAnimalStatusMenuOpen: false,
			animalDeadReasonModalVisible: (v.value == 'Dead') ? true : false
		});
	}

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

	getParentAnimalsData = () => {
		let { parentAnimals, searchValue } = this.state;

		let data = parentAnimals.filter((element) => {
			let animalID = element.animal_id.toLowerCase();
			let index = animalID.indexOf(searchValue.toLowerCase());
			return index > -1;
		});

		return data;
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

	scrollViewScrollTop = () =>
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });

	savePedigreeData = () => {
		let {
			placeOfBirth,
			sex,
			mother,
			father,
			color,
			birthWeight,
			conditionOnArrivalOrBirth,
			dobSelected,
			approxDOBSelected,
			source,
			identificationType,
			dna,
			microchip,
			ringNumber,
			birth_type,
			animal_status,
			animal_dead_reason
		} = this.state;

		this.setState(
			{
				isplaceOfBirthValidationFailed: false,
				isSexValidationFailed: false,
				isMotherValidationFailed: false,
				isFatherValidationFailed: false,
				isColorValidationFailed: false,
				isBirthWeightValidationFailed: false,
				isConditionOnArrivalOrBirthValidationFailed: false,
				isIdentificationTypeValidationFailed: false,
				isDNAValueValidationFailed: false,
				isMicrochipValueValidationFailed: false,
				isRingNumberValueValidationFailed: false,
			},
			() => {
				if (placeOfBirth.trim().length === 0) {
					this.setState({ isplaceOfBirthValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof sex === "undefined") {
					this.setState({ isSexValidationFailed: true });
				} else if (color.trim().length === 0) {
					this.setState({ isColorValidationFailed: true });
				} else if (birthWeight.trim().length === 0) {
					this.setState({ isBirthWeightValidationFailed: true });
				} else if (
					(identificationType === "DNA" ||
						identificationType === "DNA-Microchip" ||
						identificationType === "DNA-Ring Number" ||
						identificationType === "DNA-Microchip-Ring Number") &&
					dna.trim().length === 0
				) {
					this.setState({ isDNAValueValidationFailed: true });
				} else if (
					(identificationType === "Microchip" ||
						identificationType === "DNA-Microchip" ||
						identificationType === "Microchip-Ring Number" ||
						identificationType === "DNA-Microchip-Ring Number") &&
					microchip.trim().length === 0
				) {
					this.setState({ isMicrochipValueValidationFailed: true });
				} else if (
					(identificationType === "Ring Number" ||
						identificationType === "DNA-Ring Number" ||
						identificationType === "Microchip-Ring Number" ||
						identificationType === "DNA-Microchip-Ring Number") &&
					ringNumber.trim().length === 0
				) {
					this.setState({ isRingNumberValueValidationFailed: true });
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
						place_of_birth: placeOfBirth,
						sex: sex,
						sex_identification_type:
							typeof this.state.sexIdentificationType !== "undefined"
								? this.state.sexIdentificationType
								: "",
						mother: mother,
						father: father,
						color: color,
						birth_weight: birthWeight,
						birth_type: birth_type,
						condition_on_arrival_birth: conditionOnArrivalOrBirth,
						age: this.state.age,
						dobSelected: this.state.dobSelected,
						approxDOBSelected: this.state.approxDOBSelected,
						approxAge: this.state.approxAge,

						source: source,
						father: this.state.father,
						mother: this.state.mother,
						ref_inv_no: this.state.referenceNumber,
						source_date: getFormattedDate(this.state.sourceDate),
						identification_type: identificationType,
						dna: dna,
						microchip: microchip,
						ring_number: ringNumber,
						animal_status: animal_status,
						animal_dead_reason: animal_dead_reason
					};
					if (typeof this.state.imageData !== "undefined") {
						obj.image = this.state.imageData;
					}
					if (dobSelected) {
						obj.dob = getFormattedDate(this.state.dob);
					} else {
						obj.dob = getFormattedDate(this.state.approxDOB);
					}

					if (approxDOBSelected) {
						obj.approxDOB = getFormattedDate(this.state.approxDOB)
					} else {
						obj.approxDOB = null;
					}

					saveAnimalPedigreeDetails(obj)
						.then((response) => {
							this.context.setAnimalID(this.state.animalID);
							let msg =
								parseInt(this.state.id) > 0
									? "Profile Updated Successfully"
									: "Profile Created Successfully";
							this.setState(
								{
									showLoader: false,
								},
								() => {
									ToastAndroid.show(
										msg,
										ToastAndroid.SHORT
									);
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


					<View style={styles.fieldBox}>
						<Text style={styles.labelName}>Upload animal photos</Text>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.imagePicker}
							onPress={this.chooseAnimalPhotos}
						>

							{typeof this.state.animalSingleimageURI !== "undefined" ? (
								<Image
									style={{ height: 30, width: 30 }}
									source={{ uri: this.state.animalSingleimageURI }}
								/>
							) : (
								<Ionicons
									name="image"
									style={{ fontSize: 40, color: "#adadad" }}
								/>
							)}
						</TouchableOpacity>
					</View>

					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						{this.state.animalImages.length > 0 ?
							this.state.animalImages.map((item, index) => {
								return <Image key={index} source={{ uri: item }} style={{ height: 75, width: 75, marginHorizontal: 5 }} />
							})
							: null}
					</ScrollView>

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
							this.state.isIdentificationTypeValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>

					{this.state.identificationType === "DNA" ||
						this.state.identificationType === "DNA-Microchip" ||
						this.state.identificationType === "DNA-Ring Number" ||
						this.state.identificationType === "DNA-Microchip-Ring Number" ? (
						<>
							<View
								style={[
									styles.fieldBox,
									this.state.isDNAValueValidationFailed
										? styles.errorFieldBox
										: null,
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

							<View style={styles.fieldBox}>
								<Text style={styles.labelName}>Choose Image</Text>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.imagePicker}
									onPress={this.chooseIcon}
								>
									{typeof this.state.imageURI !== "undefined" ? (
										<Image
											style={{ height: 30, width: 30 }}
											source={{ uri: this.state.imageURI }}
										/>
									) : (
										<Ionicons
											name="image"
											style={{ fontSize: 40, color: "#adadad" }}
										/>
									)}
								</TouchableOpacity>
							</View>
						</>
					) : null}

					{this.state.identificationType === "Microchip" ||
						this.state.identificationType === "DNA-Microchip" ||
						this.state.identificationType === "Microchip-Ring Number" ||
						this.state.identificationType === "DNA-Microchip-Ring Number" ? (
						<View
							style={[
								styles.fieldBox,
								this.state.isMicrochipValueValidationFailed
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
								this.state.isRingNumberValueValidationFailed
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


					<InputDropdown
						label={"Transferred IN:"}
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
							this.state.isSourceValidationFailed ? styles.errorFieldBox : null,
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
						onPress={this.showSourceDatepicker}
						show={this.state.showSourceDate}
						onChange={this.onChangeSourceDate}
						date={this.state.sourceDate}
						mode={"date"}
						label={"Source Date:"}
					/>


					<DatePicker
						onPress={this.showDatepicker}
						show={this.state.show}
						onChange={this.onChangeDate}
						date={this.state.dob}
						mode={"date"}
						label={"Date of Birth :"}
					/>

					<DatePicker
						onPress={this.showApproximateDOBpicker}
						show={this.state.showApproxDOB}
						onChange={this.onChangeApproxDate}
						date={this.state.approxDOB}
						mode={"date"}
						label={"Approximate Date of Birth :"}
					/>

					<View style={styles.fieldBox} >
						<Text style={styles.labelName}>Approximate Age : </Text>
						<TextInput
							value={this.state.approxAge}
							onChangeText={(approxAge) => this.handleApproxAge(approxAge)}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View style={styles.fieldBox} >
						<Text style={styles.labelName}>Age : </Text>
						<TextInput
							value={this.state.age}
							editable={false}
							style={styles.textfield}
							autoCompleteType="off"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.isplaceOfBirthValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Place of Birth : </Text>
						<TextInput
							value={this.state.placeOfBirth}
							onChangeText={(placeOfBirth) => this.setState({ placeOfBirth })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					{/* <View
						style={[
							styles.fieldBox,
							this.state.isSexValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Sex : </Text>
						<TextInput
							value={this.state.sex}
							onChangeText={(sex) => this.setState({ sex })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View> */}

					<InputDropdown
						label={"Sex:"}
						isMandatory={true}
						value={this.state.sex}
						isOpen={this.state.isGenderMenuOpen}
						items={Configs.ANIMAL_GENDER}
						openAction={this.toggleGenderMenu}
						closeAction={this.toggleGenderMenu}
						setValue={this.setGender}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[
							styles.fieldBox,
							this.state.isSexValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					/>


					<TouchableOpacity
						activeOpacity={1}
						onPress={this.toggleSexIdentificationTypeMenu}
						style={[
							styles.fieldBox,
							this.state.isSexIdentificationTypeValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Sex Identification Type :</Text>
						<TextInput
							editable={false}
							value={this.state.sexIdentificationType}
							style={styles.textfield}
						/>
					</TouchableOpacity>

					<View
						style={[
							styles.fieldBox,
							this.state.isColorValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Color :</Text>
						<TextInput
							value={this.state.color}
							onChangeText={(color) => this.setState({ color })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.isBirthWeightValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Birth Weight :</Text>
						<TextInput
							value={this.state.birthWeight}
							onChangeText={(birthWeight) => this.setState({ birthWeight })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>

					<InputDropdown
						label={"Birth Type:"}
						isMandatory={true}
						value={this.state.birth_type}
						isOpen={this.state.isBirthTypeMenuOpen}
						items={Configs.ANIMAL_BIRTH_TYPE}
						openAction={this.toggleBirthTypeMenu}
						closeAction={this.toggleBirthTypeMenu}
						setValue={this.setBirthType}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={styles.fieldBox}
					/>

					<InputDropdown
						label={"Aminal Status:"}
						isMandatory={true}
						value={this.state.animal_status}
						isOpen={this.state.isAnimalStatusMenuOpen}
						items={Configs.ANIMAL_STATUS}
						openAction={this.toggleAnimalStatusMenu}
						closeAction={this.toggleAnimalStatusMenu}
						setValue={this.setAnimalStatus}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={styles.fieldBox}
					/>

					<TouchableOpacity
						style={styles.button}
						onPress={this.savePedigreeData.bind(this)}
					>
						<Text style={styles.textWhite}>Save Details</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<OverlayLoader visible={this.state.showLoader} />

			<ModalMenu
				visible={this.state.isSexIdentificationTypeMenuOpen}
				closeAction={this.toggleSexIdentificationTypeMenu}
			>
				{Configs.SEX_IDENTIFICATION_TYPES.map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setSexIdentificationType.bind(this, v.name)}
						key={v.id}
					>
						<Text style={styles.itemtitle}>{v.name}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>

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

			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.animalDeadReasonModalVisible}
			>
				<View style={styles.searchModalOverlay}>
					<View style={styles.seacrhModalContainer}>
						<View style={styles.searchModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.headerBackBtnContainer}
								onPress={() => {
									this.setState({
										animalDeadReasonModalVisible: false
									});
								}}
							>
								<Ionicons name="arrow-back" size={25} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.headerTitleContainer}>
								<Text
									style={{
										fontSize: 20,
										color: Colors.white
									}}
								>
									Reason
								</Text>
							</View>
						</View>

						<View style={styles.searchModalBody}>
							<TextInput
								value={this.state.animal_dead_reason}
								onChangeText={(animal_dead_reason) => this.setState({ animal_dead_reason })}
								multiline={true}
								numberOfLines={12}
								style={{
									padding: 5,
									borderWidth: 1,
									borderColor: Colors.lightGrey,
									shadowColor: "#999",
									shadowOffset: {
										width: 0,
										height: 1,
									},
									shadowOpacity: 0.22,
									shadowRadius: 2.22,
									elevation: 3,
								}}
								autoCompleteType="off"
							/>

							<TouchableOpacity
								style={styles.button}
								onPress={() => this.setState({ animalDeadReasonModalVisible: false })}
							>
								<Text style={styles.textWhite}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 	},
// 	popupContainer: {
// 		backgroundColor: '#fff',
// 		paddingTop: 20,
// 		paddingBottom: 20
// 	},
// 	popupText: {
// 		fontSize: 16,
// 		color: Colors.black,
// 		alignSelf: "center"
// 	},
// 	inputContainer: {
// 		marginVertical: 10,
// 		padding: 10,
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
// 		width: "55%",
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
// 		paddingVertical: 5,
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
// 	imagePicker: {
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// });
