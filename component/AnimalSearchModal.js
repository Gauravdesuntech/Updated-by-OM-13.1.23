import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	Modal,
	FlatList,
	SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import Dropdown from "./Dropdown";
import {
	searchCommonName,
	searchAnimal,
	searchCategory,
	searchSubCategory,
	searchSection,
	searchEnclosure
} from "../services/APIServices";
import AppContext from "../context/AppContext";
import { capitalize } from "../utils/Util";
import { debounce } from "lodash";



export default class AnimalSearchModal extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isSearchModalOpen: false,
			isSearching: true,
			searchByLabel: Configs.SEARCH_TYPES[0]["name"],
			searchBy: Configs.SEARCH_TYPES[0]["id"],
			searchTitle: "Search " + Configs.SEARCH_TYPES[0]["name"],
			searchPlaceholder: "Type " + Configs.SEARCH_TYPES[0]["name"],
			searchValue: "",
			searchData: [],
		};

		this.searchInput = React.createRef();
	}

	openModal = () => {
		this.setState({
			isSearchModalOpen: true,
			isSearching: true,
			searchByLabel: Configs.SEARCH_TYPES[0]["name"],
			searchBy: Configs.SEARCH_TYPES[0]["id"],
			searchTitle: "Search " + Configs.SEARCH_TYPES[0]["name"],
			searchPlaceholder: "Type " + Configs.SEARCH_TYPES[0]["name"],
			searchValue: "",
			searchData: [],
		});

		setTimeout(() => {
			this.searchInput.current.focus();
		}, 500);
	};

	closeModal = () => {
		this.setState({
			isSearchModalOpen: false,
			isSearching: true,
			searchValue: "",
			searchData: [],
		});

		this.searchInput.current.blur();
	};

	setSearchType = (v) => {
		this.setState({
			searchBy: v.id,
			searchByLabel: v.name,
			searchTitle: "Search " + v.name,
			searchPlaceholder: "Type " + v.name,
			searchValue: "",
			searchData: [],
		});
	};

	searchDataDebounce = debounce(()=>{this.searchData()},900)

	searchData = () => {
		let cid = this.context.userDetails.cid;
		let { searchBy, searchValue } = this.state;
		let requestObj = {
			search_value: searchValue,
			cid: cid,
		};

		if (typeof this.props.animalClass !== "undefined") {
			requestObj.animal_class = this.props.animalClass;
		}
		if (typeof this.props.animalCategory !== "undefined") {
			requestObj.category = this.props.animalCategory;
		}
		if (typeof this.props.animalSubCategory !== "undefined") {
			requestObj.sub_category = this.props.animalSubCategory;
		}

		if (typeof this.props.section !== "undefined") {
			requestObj.section = this.props.section;
		}

		if (searchBy === "category") {
			searchCategory(requestObj)
				.then((data) => {
					this.setState({
						isSearching: false,
						searchData: data,
					});
				})
				.catch((error) => console.log(error));
		} else if (searchBy === "sub_category") {
			searchSubCategory(requestObj)
				.then((data) => {
					this.setState({
						isSearching: false,
						searchData: data,
					});
				})
				.catch((error) => console.log(error));
		} else if (searchBy === "common_name") {
			searchCommonName(requestObj)
				.then((data) => {
					this.setState({
						isSearching: false,
						searchData: data,
					});
				})
				.catch((error) => console.log(error));
		} else if (searchBy === "section") {
			searchSection(requestObj)
				.then((data) => {
					// console.log(data.length)
					// return;
					this.setState({
						isSearching: false,
						searchData: data,
					});
				})
				.catch((error) => console.log(error));
		}else if (searchBy === "enclosure") {
			searchEnclosure(requestObj)
				.then((data) => {
					// console.log(data)
					// return;
					this.setState({
						isSearching: false,
						searchData: data,
					});
				})
				.catch((error) => console.log(error));
		} else {
			searchAnimal(requestObj)
				.then((data) => {
					this.setState({
						isSearching: false,
						searchData: data,
					});
				})
				.catch((error) => console.log(error));
		}
	};

	gotoCategoryList = (item) => {
		this.closeModal();
		this.props.navigation.navigate("Category", {
			categoryID: item.id,
			classID: item.class_id,
			className: item.class_name,
		});
	};

	gotoSubCategoryList = (item) => {
		this.closeModal();
		this.props.navigation.navigate("SubCategory", {
			classID: item.class_id,
			className: item.class_name,
			categoryID: item.cat_id,
			categoryName: item.cat_name,
			subCategoryID: item.id,
		});
	};

	gotoCommonNameDetails = (item) => {
		this.closeModal();
		this.props.navigation.navigate("CommonNameDetails", {
			commonNameID: item.id,
			commonName: item.common_name,
			imageUri: item.image,
			description: item.description,
		});
	};

	gotoEditAnimal = (item) => {
		this.closeModal();
		this.context.setAnimalID(item.animal_id);

		this.props.navigation.navigate("Animals", {
			id: item.id,
			classID: item.animal_group,
			categoryID: item.category,
			subCategoryID: item.sub_category !== null ? item.sub_category : undefined,
			animalType: item.type,
			commonName: item.english_name,
			scientificName: item.full_name,
			databaseName:
				item.database_name !== null ? item.database_name : undefined,
			taxonid: item.taxonid !== null ? item.taxonid : "",
			enclosureID: item.enclosure_id
		});
	};


	gotoEnclosureIDs = (item) => {
		this.closeModal();
		this.props.navigation.navigate("CommonNameList", {
			sectionID: item.id,
			sectionName: item.name,
		});
	};

	gotoEnclosure = (item) => {
		this.closeModal();
		this.props.navigation.navigate("AnimalsListEnclosure", {
			id: item.id,
			enclosureID: item.enclosure_id,
			screenName: item.enclosure_id,
			screen_title: "Edit Enclosure Id",
		});
	}

	renderSearchItem = ({ item }) => {
		let { searchBy } = this.state;

		if (searchBy === "category") {
			return (
				<TouchableHighlight
					underlayColor={"#eee"}
					onPress={this.gotoCategoryList.bind(this, item)}
				>
					<View style={styles.listItemContainer}>
						<View style={{ width: "85%", justifyContent: "center" }}>
							<Text style={styles.titleText}>{`${item.cat_name ? capitalize(item.cat_name) : ''} ${ this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?  " - "+item.total_animals + " nos" : ''}`}</Text>

							{this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ? (
								<>
									<Text style={styles.subText}>
										{"Male: " + item.total_male_animals}
									</Text>
									<Text style={styles.subText}>
										{"Female: " + item.total_female_animals}
									</Text>
									<Text style={styles.subText}>
										{"Undetermined: " + item.total_unknown_animals}
									</Text>
									<Text style={styles.subText}>
										{"Infants: " + item.total_infants}
									</Text>
								</>
							) : null}


						</View>
						<View style={styles.angelIconContainer}>
							<Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
						</View>
					</View>
				</TouchableHighlight>
			);
		} else if (searchBy === "sub_category") {
			return (
				<TouchableHighlight
					underlayColor={"#eee"}
					onPress={this.gotoSubCategoryList.bind(this, item)}
				>
					<View style={styles.listItemContainer}>
						<View style={{ width: "85%", justifyContent: "center" }}>
							<Text style={styles.titleText}>{`${capitalize(item.sub_cat_name)} ${ this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?  " - "+item.total_animals + " nos" : ''}`}</Text>
							
							{this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ? (
								<>
									<Text style={styles.subText}>
										{"Male: " + item.total_male_animals}
									</Text>
									<Text style={styles.subText}>
										{"Female: " + item.total_female_animals}
									</Text>
									<Text style={styles.subText}>
										{"Undetermined: " + item.total_unknown_animals}
									</Text>
									<Text style={styles.subText}>
										{"Infants: " + item.total_infants}
									</Text>
								</>
							) : null}
						</View>
						<View style={styles.angelIconContainer}>
							<Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
						</View>
					</View>
				</TouchableHighlight>
			);
		} else if (searchBy === "common_name") {
			return (
				<TouchableHighlight
					underlayColor={"#eee"}
					onPress={this.gotoCommonNameDetails.bind(this, item)}
				>
					<View style={styles.listItemContainer}>
						<View style={{ width: "85%", justifyContent: "center" }}>
							<Text style={styles.titleText}>{`${capitalize(item.common_name)} ${ this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?  " - "+item.total_animals + " nos" : ''}`}</Text>
							<Text style={[styles.subText, { fontStyle: 'italic', fontSize: 12, fontWeight: 'bold' }]}>{`(${capitalize(item.scientific_name)})`}</Text>
							
							{this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ? (
								<>
									<Text style={styles.subText}>
										{"Male: " + item.total_male_animals}
									</Text>
									<Text style={styles.subText}>
										{"Female: " + item.total_female_animals}
									</Text>
									<Text style={styles.subText}>
										{"Undetermined: " + item.total_unknown_animals}
									</Text>
									<Text style={styles.subText}>
										{"Infants: " + item.total_infants}
									</Text>
								</>
							) : null}
						</View>
						<View style={styles.angelIconContainer}>
							<Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
						</View>
					</View>
				</TouchableHighlight>
			);
		} else if (searchBy === "section") {
			// console.log("Itemmmm", item.total_count['total_animal']); return null;
			return (
				<TouchableHighlight
					underlayColor={"#eee"}
					onPress={this.gotoEnclosureIDs.bind(this, item)}
				>
					<View style={styles.listItemContainer}>
						<View style={{ width: "85%", justifyContent: "center" }}>
							<Text style={styles.titleText}>{`${capitalize(item.name)} ${ this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?  " - "+item.total_count['total_animal'] + " nos" : ''}`}</Text>
							{this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ? (
								<>
									{/* <Text style={styles.subText}>
										{"Total: " + item.total_count['total_animal']}
									</Text> */}
									<Text style={styles.subText}>
										{"Male: " + item.total_male_animal['total_male_animal']}
									</Text>
									<Text style={styles.subText}>
										{"Female: " + item.total_female_animal['total_female_animal']}
									</Text>
								</>
							) : null}
						</View>
						<View style={styles.angelIconContainer}>
							<Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
						</View>
					</View>
				</TouchableHighlight>
			);
		} else if (searchBy === "enclosure") {
			// console.log("Itemmmm", item.total_count['total_animal']); return null;
			return (
				<TouchableHighlight
					underlayColor={"#eee"}
					onPress={this.gotoEnclosure.bind(this, item)}
				>
					<View style={styles.listItemContainer}>
						<View style={{ width: "85%", justifyContent: "center" }}>
							<Text style={styles.titleText}>{`${capitalize(item.enclosure_id)} ${ this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?  " - "+item.total_count['total_animal'] + " nos" : ''}`}</Text>
							{this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ? (
								<>
									{/* <Text style={styles.subText}>
										{"Total: " + item.total_count['total_animal']}
									</Text> */}
									<Text style={styles.subText}>
										{"Male: " + item.total_male_animal['total_male_animal']}
									</Text>
									<Text style={styles.subText}>
										{"Female: " + item.total_female_animal['total_female_animal']}
									</Text>
								</>
							) : null}
						</View>
						<View style={styles.angelIconContainer}>
							<Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
						</View>
					</View>
				</TouchableHighlight>
			);
		} else {
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
					onPress={this.gotoEditAnimal.bind(this, item)}
				>
					<View style={styles.listItemContainer}>
						<View style={{ width: "85%", justifyContent: "center" }}>
							<Text style={styles.titleText}>{`${item.animal_id} - ${item.gender ? item.gender : 'N/A'}`}</Text>
							<Text style={styles.subText}>{capitalize(item.english_name)}</Text>
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
		}
	};

	render = () => (
		<Modal
			animationType="fade"
			transparent={true}
			visible={this.state.isSearchModalOpen}
			onRequestClose={this.closeModal}
		>
			<SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
				<View style={styles.searchModalOverlay}>
					<View style={styles.seacrhModalContainer}>
						<View style={styles.searchModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.headerBackBtnContainer}
								onPress={this.closeModal}
							>
								<Ionicons name="arrow-back" size={26} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.headerTitleContainer}>
								<Text style={{ fontSize: 20, color: Colors.white }}>
									{this.state.searchTitle}
								</Text>
							</View>
						</View>

						<View style={styles.searchModalBody}>
							<View style={styles.searchInputBox}>
								<Dropdown
									label={"Search By:"}
									value={this.state.searchByLabel}
									items={Configs.SEARCH_TYPES}
									onChange={this.setSearchType}
									labelStyle={styles.dropdownLabel}
									textFieldStyle={styles.dropdownTextField}
									style={styles.dropdownStyle}
								/>

								<View style={styles.searchFieldBox}>
									<Ionicons name="search" size={24} color={Colors.textColor} />
									<TextInput
										ref={this.searchInput}
										value={this.state.searchValue}
										onChangeText={(searchValue) =>
											this.setState(
												{
													searchValue: searchValue,
													isSearching: true,
												},
												() => {
													this.searchDataDebounce();
												}
											)
										}
										autoCompleteType="off"
										autoCapitalize="none"
										placeholder={this.state.searchPlaceholder}
										style={styles.searchField}
									/>
								</View>
							</View>

							{this.state.searchValue.trim().length > 0 ? (
								this.state.isSearching ? (
									<Text style={styles.searchingText}>Searching...</Text>
								) : (
									<FlatList
										data={this.state.searchData}
										keyExtractor={(item, index) => item.id.toString()}
										renderItem={this.renderSearchItem}
										initialNumToRender={this.state.searchData.length}
										keyboardShouldPersistTaps="handled"
										ListEmptyComponent={() => (
											<Text style={styles.searchingText}>No Result Found</Text>
										)}
									/>
								)
							) : null}
						</View>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	searchModalOverlay: {
		justifyContent: "center",
		alignItems: "center",
		width: windowWidth,
		height: windowHeight+15,
	},
	seacrhModalContainer: {
		flex: 1,
		width: windowWidth,
		height: windowHeight,
		backgroundColor: Colors.lightGrey,
	},
	searchModalHeader: {
		height: 50,
		flexDirection: "row",
		width: "100%",
		backgroundColor: Colors.primary,
		elevation: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	headerBackBtnContainer: {
		width: "20%",
		height: 50,
		paddingLeft: 8,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	headerTitleContainer: {
		width: "80%",
		height: 50,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	searchModalBody: {
		flex: 1,
		height: windowHeight - 50,
	},
	searchInputBox: {
		elevation: 5,
		backgroundColor: Colors.white,
		padding: 8,
	},
	dropdownStyle: {
		alignItems: 'center',
		width: "100%",
		overflow: "hidden",
		flexDirection: "row",
		padding: 5,
		borderRadius: 10,
		borderColor: "#ddd",
		borderWidth: 1,
		backgroundColor: "#fff",
		height: 'auto',
		justifyContent: "space-between",
		marginBottom: 5,
		marginTop: 5,
	},
	dropdownTextField: {
		backgroundColor: "#fff",
		height: 'auto',

		fontSize: 12,
		color: Colors.textColor,
		textAlign: "right",
		padding: 5,
		width: '50%'
	},
	dropdownLabel: {
		color: Colors.textColor,
		lineHeight: 40,
		fontSize: 14,
		paddingLeft: 4,
		height: 'auto',
	},
	searchFieldBox: {
		width: "100%",
		height: 40,
		marginTop: 8,
		paddingLeft: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 50,
	},
	searchField: {
		padding: 5,
		width: "90%",
		color: Colors.textColor,
		fontSize: 15,
	},
	searchingText: {
		fontSize: 12,
		color: Colors.textColor,
		opacity: 0.8,
		alignSelf: "center",
		marginTop: 20,
	},
	listItemContainer: {
		flexDirection: "row",
		paddingHorizontal: 6,
		paddingVertical: 5,
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
	},
	titleText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.textColor,
	},
	subText: {
		color: Colors.textColor,
		fontSize: 14,
		
	},
	angelIconContainer: {
		width: "15%",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	rightAngelIcon: {
		fontSize: 18,
		color: "#ddd",
	},
});
