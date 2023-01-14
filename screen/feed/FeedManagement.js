import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { Container } from "native-base";
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import { Header, InputDropdown, OverlayLoader } from "../../component";
import {
	getAnimalGroups,
	getAllCategory,
	getAllSubCategory,
	getCommonNames,
	getAllAnimals,
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from './Styles'

export default class FeedManagement extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			animalGroups: [],
			animalCategories: [],
			animalSubCategories: [],
			animalCommonNames: [],
			allAnimals: [],
			allocationTypes: [
				{ id: "1", value: "class", name: "Class" },
				{ id: "2", value: "category", name: "Category" },
				{ id: "3", value: "sub_category", name: "Sub Category" },
				{ id: "4", value: "common_name", name: "Common Name" },
				{ id: "5", value: "animal", name: "Animal" },
			],
			items: [
				{ id: "1", name: "Hay + Pasture Grass", unit: "Kg" },
				{ id: "2", name: "Carrot", unit: "Kg" },
			],
			slots: [
				{ id: "1", value: "breakfast", name: "Breakfast" },
				{ id: "2", value: "lunch", name: "Lunch" },
				{ id: "3", value: "evening", name: "Evening" },
				{ id: "4", value: "dinner", name: "Dinner" },
			],
			allocatedTo: undefined,
			classID: undefined,
			className: undefined,
			categoryID: undefined,
			categoryName: undefined,
			subCategoryID: undefined,
			subCategoryName: undefined,
			commonNameID: undefined,
			commonName: undefined,
			animalID: undefined,
			animalCode: undefined,
			itemName: undefined,
			slot: undefined,
			quantity: "",
			unitID: undefined,
			unitName: undefined,
			batchNo: "",
			isAlloctaedToMenuOpen: false,
			isClassMenuOpen: false,
			isCategoryMenuOpen: false,
			isSubCategoryMenuOpen: false,
			isCommonNameMenuOpen: false,
			isAnimalMenuOpen: false,
			isItemMenuOpen: false,
			isSlotMenuOpen: false,
			isUnitMenuOpen: false,
			showLoader: false,
		};
	}

	toggleAllocatedToMenu = () =>
		this.setState({
			isAlloctaedToMenuOpen: !this.state.isAlloctaedToMenuOpen,
		});

	toggleClassMenu = () =>
		this.setState({
			isClassMenuOpen: !this.state.isClassMenuOpen,
		});

	toggleCategoryMenu = () =>
		this.setState({
			isCategoryMenuOpen: !this.state.isCategoryMenuOpen,
		});

	toggleSubCategoryMenu = () =>
		this.setState({
			isSubCategoryMenuOpen: !this.state.isSubCategoryMenuOpen,
		});

	toggleCommonNameMenu = () =>
		this.setState({
			isCommonNameMenuOpen: !this.state.isCommonNameMenuOpen,
		});

	toggleAnimalMenu = () =>
		this.setState({
			isAnimalMenuOpen: !this.state.isAnimalMenuOpen,
		});

	toggleItemMenu = () =>
		this.setState({
			isItemMenuOpen: !this.state.isItemMenuOpen,
		});

	toggleSlotMenu = () =>
		this.setState({
			isSlotMenuOpen: !this.state.isSlotMenuOpen,
		});

	toggleUnitMenu = () =>
		this.setState({
			isUnitMenuOpen: !this.state.isUnitMenuOpen,
		});

	setAllocatedTo = (v) => {
		let allocatedTo = v.name;
		let cid = this.context.userDetails.cid;

		this.setState(
			{
				allocatedTo: allocatedTo,
				isAlloctaedToMenuOpen: false,
				showLoader: true,
			},
			() => {
				if (allocatedTo === "Class") {
					getAnimalGroups(cid)
						.then((data) => {
							this.setState({
								showLoader: false,
								animalGroups: data.map((v, i) => ({
									id: v.id,
									name: v.group_name,
									value: v.group_name,
								})),
							});
						})
						.catch((error) => console.log(error));
				} else if (allocatedTo === "Category") {
					getAllCategory(cid)
						.then((data) => {
							this.setState({
								showLoader: false,
								animalCategories: data.map((v, i) => ({
									id: v.id,
									name: v.cat_name,
									value: v.cat_name,
								})),
							});
						})
						.catch((error) => console.log(error));
				} else if (allocatedTo === "Sub Category") {
					getAllSubCategory(cid)
						.then((data) => {
							this.setState({
								showLoader: false,
								animalSubCategories: data.map((v, i) => ({
									id: v.id,
									name: v.cat_name,
									value: v.cat_name,
								})),
							});
						})
						.catch((error) => console.log(error));
				} else if (allocatedTo === "Common Name") {
					getCommonNames({ cid })
						.then((data) => {
							this.setState({
								showLoader: false,
								animalCommonNames: data.map((v, i) => ({
									id: v.id,
									name: v.common_name,
									value: v.common_name,
								})),
							});
						})
						.catch((error) => console.log(error));
				} else {
					getAllAnimals(cid)
						.then((data) => {
							this.setState({
								showLoader: false,
								allAnimals: data.map((v, i) => ({
									id: v.id,
									name: v.animal_id,
									value: v.animal_id,
								})),
							});
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	setClass = (v) => {
		this.setState({
			classID: v.id,
			className: v.name,
			isClassMenuOpen: false,
		});
	};

	setCategory = (v) => {
		this.setState({
			categoryID: v.id,
			categoryName: v.name,
			isCategoryMenuOpen: false,
		});
	};

	setSubCategory = (v) => {
		this.setState({
			subCategoryID: v.id,
			subCategoryName: v.name,
			isSubCategoryMenuOpen: false,
		});
	};

	setCommonName = (v) => {
		this.setState({
			commonNameID: v.id,
			commonName: v.name,
			isCommonNameMenuOpen: false,
		});
	};

	setAnimal = (v) => {
		this.setState({
			animalID: v.id,
			animalCode: v.name,
			isAnimalMenuOpen: false,
		});
	};

	setItem = (v) => {
		this.setState({
			itemName: v.name,
			isItemMenuOpen: false,
		});
	};

	setSlot = (v) => {
		this.setState({
			slot: v.name,
			isSlotMenuOpen: false,
		});
	};

	setUnit = (v) => {
		this.setState({
			unitID: v.value,
			unitName: v.name,
			isUnitMenuOpen: false,
		});
	};

	gotoBack = () => {
		this.props.navigation.goBack();
	};

	render = () => (
		<Container>
			<Header title={"Feed Mgmt"} />
			<View style={styles.container}>
				<InputDropdown
					label={"Allocated To:"}
					value={this.state.allocatedTo}
					isOpen={this.state.isAlloctaedToMenuOpen}
					items={this.state.allocationTypes}
					openAction={this.toggleAllocatedToMenu}
					closeAction={this.toggleAllocatedToMenu}
					setValue={this.setAllocatedTo}
					labelStyle={styles.labelName}
					textFieldStyle={styles.textfield}
					style={[styles.fieldBox]}
				/>
				{this.state.allocatedTo === "Class" ? (
					<InputDropdown
						label={"Class:"}
						value={this.state.className}
						isOpen={this.state.isClassMenuOpen}
						items={this.state.animalGroups}
						openAction={this.toggleClassMenu}
						closeAction={this.toggleClassMenu}
						setValue={this.setClass}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[styles.fieldBox]}
					/>
				) : null}
				{this.state.allocatedTo === "Category" ? (
					<InputDropdown
						label={"Category:"}
						value={this.state.categoryName}
						isOpen={this.state.isCategoryMenuOpen}
						items={this.state.animalCategories}
						openAction={this.toggleCategoryMenu}
						closeAction={this.toggleCategoryMenu}
						setValue={this.setCategory}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[styles.fieldBox]}
					/>
				) : null}
				{this.state.allocatedTo === "Sub Category" ? (
					<InputDropdown
						label={"Sub Category:"}
						value={this.state.subCategoryName}
						isOpen={this.state.isSubCategoryMenuOpen}
						items={this.state.animalSubCategories}
						openAction={this.toggleSubCategoryMenu}
						closeAction={this.toggleSubCategoryMenu}
						setValue={this.setSubCategory}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[styles.fieldBox]}
					/>
				) : null}
				{this.state.allocatedTo === "Common Name" ? (
					<InputDropdown
						label={"Common Name:"}
						value={this.state.commonName}
						isOpen={this.state.isCommonNameMenuOpen}
						items={this.state.animalCommonNames}
						openAction={this.toggleCommonNameMenu}
						closeAction={this.toggleCommonNameMenu}
						setValue={this.setCommonName}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[styles.fieldBox]}
					/>
				) : null}
				{this.state.allocatedTo === "Animal" ? (
					<InputDropdown
						label={"Animal:"}
						value={this.state.animalCode}
						isOpen={this.state.isAnimalMenuOpen}
						items={this.state.allAnimals}
						openAction={this.toggleAnimalMenu}
						closeAction={this.toggleAnimalMenu}
						setValue={this.setAnimal}
						labelStyle={styles.labelName}
						textFieldStyle={styles.textfield}
						style={[styles.fieldBox]}
					/>
				) : null}
				<InputDropdown
					label={"Item:"}
					value={this.state.itemName}
					isOpen={this.state.isItemMenuOpen}
					items={this.state.items}
					openAction={this.toggleItemMenu}
					closeAction={this.toggleItemMenu}
					setValue={this.setItem}
					labelStyle={styles.labelName}
					textFieldStyle={styles.textfield}
					style={[styles.fieldBox]}
					placeholder="Select Item Name"
				/>
				<InputDropdown
					label={"Slot:"}
					value={this.state.slot}
					isOpen={this.state.isSlotMenuOpen}
					items={this.state.slots}
					openAction={this.toggleSlotMenu}
					closeAction={this.toggleSlotMenu}
					setValue={this.setSlot}
					labelStyle={styles.labelName}
					textFieldStyle={styles.textfield}
					style={[styles.fieldBox]}
					placeholder="Select Slot"
				/>
				<View style={styles.fieldBox}>
					<Text style={styles.labelName}>Quantity:</Text>
					<TextInput
						value={this.state.quantity}
						onChangeText={(quantity) => this.setState({ quantity })}
						style={styles.textfield}
						autoCompleteType="off"
						keyboardType="numeric"
						placeholder="Enter Quantity"
					/>
				</View>
				<InputDropdown
					label={"Unit:"}
					value={this.state.unitName}
					isOpen={this.state.isUnitMenuOpen}
					items={Configs.UNITS}
					openAction={this.toggleUnitMenu}
					closeAction={this.toggleUnitMenu}
					setValue={this.setUnit}
					labelStyle={styles.labelName}
					textFieldStyle={styles.textfield}
					style={[styles.fieldBox]}
					placeholder="Select Unit"
				/>
				<View style={styles.fieldBox}>
					<Text style={styles.labelName}>Batch No.</Text>
					<TextInput
						value={this.state.batchNo}
						onChangeText={(batchNo) => this.setState({ batchNo })}
						style={styles.textfield}
						autoCompleteType="off"
						placeholder="Enter Batch No."
					/>
				</View>
				<TouchableOpacity style={styles.button}>
					<Text style={styles.textWhite}>Save</Text>
				</TouchableOpacity>
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
// 	labelName: {
// 		color: Colors.textColor,
// 		lineHeight: 40,
// 		fontSize: 14,
// 		paddingLeft: 4,
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
// });
