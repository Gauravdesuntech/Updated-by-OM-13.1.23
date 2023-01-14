import React from "react";
import {
<<<<<<< HEAD
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
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import moment from "moment";
import styles from "../../config/Styles";

export default class ProfileNew extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			
		};
		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		
	};

	componentDidUpdate() {
		
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
			ringNumber
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
				}  else if (typeof sex === "undefined") {
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
					
					<View style={styles.fieldBox} >
						<Text style={styles.labelName}>Age : </Text>
						<TextInput
							value={0}
							editable={false}
							style={styles.textfield}
							autoCompleteType="off"
						/>
					</View>

					
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

		</>
	);
=======
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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  DatePicker,
  InputDropdown,
  OverlayLoader,
  ModalMenu,
} from "../../component";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { getFormattedDate, calculateAge, getFileData } from "../../utils/Util";
import {
  getAnimalPedigree,
  saveAnimalPedigreeDetails,
  getParentAnimals,
  getCommonNameSections,
  getCommonNameEnclosures,
  getAnimalID,
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import moment from "moment";
import globalStyles from "../../config/Styles";
import styles from "./Styles";

export default class ProfileNew extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {};
    this.scrollViewRef = React.createRef();
  }

  componentDidMount = () => {};

  componentDidUpdate() {}

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

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.dob;
    this.setState({
      show: false,
      dob: currentDate,
      dobSelected: true,
      approxDOBSelected: false,
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
    this.setState(
      {
        showApproxDOB: false,
        approxDOB: currentDate,
        approxDOBSelected: true,
        dobSelected: false,
      },
      () => this.calCulateApproxAge(currentDate)
    );
  };

  showDatepicker = () => this.setState({ show: true });

  showSourceDatepicker = () => this.setState({ showSourceDate: true });

  showApproximateDOBpicker = () => this.setState({ showApproxDOB: true });

  calCulateApproxAge = (dob) => {
    let result = calculateAge(new Date(), dob);
    this.setState({
      approxAge: result.age,
      age: result.age,
    });
  };

  getCurrentAge = () => {
    let result = {
      age: "1",
    };
    let { dobSelected, approxDOBSelected, dob, approxDOB } = this.state;
    if (dobSelected == "true") {
      result = calculateAge(new Date(), dob);
      this.setState({ age: result.age, approxAge: 0 });
    }
    if (approxDOBSelected == "true") {
      result = calculateAge(new Date(), approxDOB);
      this.setState({ age: result.age });
    }
    this.setState({ showLoader: false });
  };

  handleApproxAge = (approxAge) => {
    let date = moment();
    let age = approxAge.split(" ");
    if (age[1] == "Y") {
      let dob = date.subtract(age[0], "years");
      this.setState({
        approxDOB: new Date(dob),
        approxDOBSelected: true,
        dobSelected: false,
        dob: new Date(),
      });
    }

    if (age[1] == "M") {
      let dob = date.subtract(age[0], "months");
      this.setState({
        approxDOB: new Date(dob),
        approxDOBSelected: true,
        dobSelected: false,
        dob: new Date(),
      });
    }

    this.setState({ approxAge: approxAge, age: approxAge });
  };
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
            obj.approxDOB = getFormattedDate(this.state.approxDOB);
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
                  ToastAndroid.show(msg, ToastAndroid.SHORT);
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
        <View style={globalStyles.listItemContainer}>
          <View
            style={[globalStyles.width85, globalStyles.justifyContentCenter]}
          >
            <Text style={globalStyles.titleText}>{item.animal_id}</Text>
            <Text style={globalStyles.subText}>{item.english_name}</Text>
            {identificationValues.length > 0 ? (
              <Text style={globalStyles.subText}>
                {identificationValues.join("-")}
              </Text>
            ) : null}
          </View>
          <View style={globalStyles.angelIconContainer}>
            <Ionicons
              name="chevron-forward"
              style={globalStyles.rightAngelIcon}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render = () => (
    <>
      <ScrollView ref={this.scrollViewRef} showsVerticalScrollIndicator={false}>
        <View style={globalStyles.container}>
          <View style={globalStyles.fieldBox}>
            <Text style={globalStyles.labelName}>Age : </Text>
            <TextInput
              value={0}
              editable={false}
              style={globalStyles.textfield}
              autoCompleteType="off"
            />
          </View>

          <TouchableOpacity
            style={globalStyles.button}
            onPress={this.savePedigreeData.bind(this)}
          >
            <Text style={globalStyles.textWhite}>Save Details</Text>
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
            style={globalStyles.item}
            onPress={this.setSexIdentificationType.bind(this, v.name)}
            key={v.id}
          >
            <Text style={globalStyles.itemtitle}>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>

      {/*Search Modal for Father and Mother*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isAnimalSearchModalOpen}
      >
        <View style={globalStyles.searchModalOverlay}>
          <View style={globalStyles.seacrhModalContainer}>
            <View style={globalStyles.searchModalHeader}>
              <TouchableOpacity
                activeOpacity={1}
                style={globalStyles.headerBackBtnContainer}
                onPress={this.closeSearchModal}
              >
                <Ionicons name="arrow-back" size={25} color={Colors.white} />
              </TouchableOpacity>
              <View style={globalStyles.headerTitleContainer}>
                <Text style={styles.headerTitleContainerText}>
                  {this.state.searchFor === "father"
                    ? "Select Father"
                    : "Select Mother"}
                </Text>
              </View>
            </View>
            <View style={globalStyles.searchModalBody}>
              <InputDropdown
                label={"Select Section:"}
                value={this.state.animalSectionName}
                isOpen={this.state.isAnimalSectionMenuOpen}
                items={this.state.animalSections}
                openAction={this.toggleAnimalSectionMenu}
                closeAction={this.toggleAnimalSectionMenu}
                setValue={this.setAnimalSection}
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={[globalStyles.fieldBox]}
              />

              <InputDropdown
                label={"Enclosure ID:"}
                value={this.state.parentEnclosureIDName}
                isOpen={this.state.isAnimalEnclosureMenuOpen}
                items={this.state.animalEnclosures}
                openAction={this.toggleAnimalEnclosureMenu}
                closeAction={this.toggleAnimalEnclosureMenu}
                setValue={this.setParentEnclosure}
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={[globalStyles.fieldBox]}
              />

              {typeof this.state.parentEnclosureIDName !== "undefined" ? (
                <View style={globalStyles.fieldBox}>
                  <TextInput
                    autoCompleteType="off"
                    autoCapitalize="none"
                    placeholder={"Type Animal Code"}
                    value={this.state.searchValue}
                    style={[
                      globalStyles.textfield,
                      globalStyles.animalCodeTextInput,
                    ]}
                    onChangeText={(searchValue) =>
                      this.setState({ searchValue })
                    }
                  />
                </View>
              ) : null}

              {this.state.isFetchingParent ? null : (
                <FlatList
                  contentContainerStyle={globalStyles.flex1}
                  data={this.getParentAnimalsData()}
                  keyExtractor={(item, index) => item.id.toString()}
                  renderItem={this.renderSearchItem}
                  initialNumToRender={this.state.parentAnimals.length}
                  ListEmptyComponent={() => (
                    <Text style={globalStyles.searchingText}>
                      No Result Found
                    </Text>
                  )}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
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
<<<<<<< HEAD
		
=======

>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
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
