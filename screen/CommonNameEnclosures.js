import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	Dimensions,
	Modal,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import {
	Header,
	ListEmpty,
	Loader,
	AnimalIdentificationTypeModal,
} from "../component";
import { getCommonNameEnclosures } from "../services/APIServices";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
import styles from './Styles'

export default class CommonNameEnclosures extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			enclosures: [],
			commonName:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.commonName
					: undefined,
			sectionID:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.sectionID
					: undefined,
			selectedEnclosureID: undefined,
			selectedEnclosureIDName: undefined,
			isSearching: true,
			isSearchModalOpen: false,
			searchValue: "",
			searchData: [],
		};

		this.searchInput = React.createRef();
		this.idetificationTypeModalRef = React.createRef();
	}

	componentDidMount() {
		this.loadCommonNameEnclosures();
	}

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadCommonNameEnclosures();
			}
		);
	};

	loadCommonNameEnclosures = () => {
		const { commonName, sectionID } = this.state;

		getCommonNameEnclosures(commonName, sectionID)
			.then((data) => {
				this.setState({
					enclosures: data,
					isLoading: false,
				});
			})
			.catch((error) => console.log(error));
	};

	openSearchModal = () => {
		this.setState({
			isSearching: true,
			searchValue: "",
			searchData: [],
			isSearchModalOpen: true,
		});

		setTimeout(() => {
			this.searchInput.current.focus();
		}, 500);
	};

	closeSearchModal = () => {
		this.setState({
			isSearching: true,
			searchValue: "",
			searchData: [],
			isSearchModalOpen: false,
		});
	};

	searchData = () => {
		let { searchValue, enclosures } = this.state;
		let data = enclosures.filter((item) => {
			let name = item.enclosure_id.toLowerCase();
			let index = name.indexOf(searchValue.toLowerCase());
			return index > -1;
		});

		this.setState({
			isSearching: false,
			searchData: data,
		});
	};

	gotoAnimalList = (item) => {
		this.closeSearchModal();
		this.props.navigation.navigate("AnimalsListEnclosure", {
			id: item.id,
			enclosureID: item.enclosure_id,
			screenName: item.enclosure_id,
			screen_title: "Edit Enclosure Id",
		});
	}

	gotoBack = () => this.props.navigation.goBack();

	onItemTap = (item) => {
		this.setState(
			{
				selectedEnclosureID: item.id,
				selectedEnclosureIDName: item.enclosure_id,
			},
			() => {
				this.idetificationTypeModalRef.current.openModal();
			}
		);
	};

	renderEnclosureItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.gotoAnimalList.bind(this, item)}
		>
			<View style={styles.view}>
				<View style={{ width: "85%", justifyContent: "center" }}>
					<Text style={styles.name}>{item.enclosure_id}</Text>
				</View>
				<View style={styles.rightSection}>
					<View style={styles.qtyContainer}>
						<Text style={styles.qty}>{item.count}</Text>
					</View>
					<Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
				</View>
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header
				title={"Enclosures of " + this.state.commonName}
				showScanButton={this.state.isLoading ? undefined : true}
				searchAction={this.state.isLoading ? undefined : this.openSearchModal}
			/>

			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.enclosures}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderEnclosureItem}
					initialNumToRender={this.state.enclosures.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.enclosures.length === 0 ? styles.container : null
					}
				/>
			)}

			{/*Search Modal*/}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isSearchModalOpen}
				onRequestClose={this.closeSearchModal}
			>
				<View style={styles.searchModalOverlay}>
					<View style={styles.seacrhModalContainer}>
						<View style={styles.searchModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.backBtnContainer}
								onPress={this.closeSearchModal}
							>
								<Ionicons name="arrow-back" size={28} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.searchContainer}>
								<View style={styles.searchFieldBox}>
									<Ionicons name="search" size={24} color={Colors.white} />
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
													this.searchData();
												}
											)
										}
										autoCompleteType="off"
										autoCapitalize="none"
										placeholder="Type Animal Class"
										placeholderTextColor={Colors.white}
										style={styles.searchField}
									/>
								</View>
							</View>
						</View>
						<View style={styles.searchModalBody}>
							{this.state.searchValue.trim().length > 0 ? (
								this.state.isSearching ? (
									<Text style={styles.searchingText}>Searching...</Text>
								) : (
									<FlatList
										data={this.state.searchData}
										keyExtractor={(item, index) => item.id.toString()}
										renderItem={this.renderEnclosureItem}
										initialNumToRender={this.state.searchData.length}
										ListEmptyComponent={() => (
											<Text style={styles.searchingText}>No Result Found</Text>
										)}
									/>
								)
							) : null}
						</View>
					</View>
				</View>
			</Modal>

			{/* Identification Types Modal */}
			<AnimalIdentificationTypeModal
				ref={this.idetificationTypeModalRef}
				title={this.state.selectedEnclosureIDName}
				commonName={this.state.commonName}
				enclosureID={this.state.selectedEnclosureID}
				{...this.props}
			/>
		</Container>
	);
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// const styles = StyleSheet.create({
// 	// container: {
// 	// 	flex: 1,
// 	// 	backgroundColor: "#fff",
// 	// 	paddingHorizontal: 5,
// 	// },
// 	// view: {
// 	// 	height: 50,
// 	// 	flexDirection: "row",
// 	// 	borderBottomColor: "#eee",
// 	// 	borderBottomWidth: 1,
// 	// 	paddingHorizontal: 5,
// 	// },
// 	// name: {
// 	// 	fontSize: 18,
// 	// 	color: Colors.textColor,
// 	// },
// 	// rightSection: {
// 	// 	width: "15%",
// 	// 	flexDirection: "row",
// 	// 	justifyContent: "flex-end",
// 	// 	alignItems: "center",
// 	// },
// 	// qtyContainer: {
// 	// 	height: 25,
// 	// 	width: 25,
// 	// 	borderRadius: 100,
// 	// 	backgroundColor: Colors.primary,
// 	// 	justifyContent: "center",
// 	// 	alignItems: "center",
// 	// },
// 	// qty: {
// 	// 	fontSize: 14,
// 	// 	color: "#FFF",
// 	// },
// 	// rightAngelIcon: {
// 	// 	fontSize: 18,
// 	// 	color: "#cecece",
// 	// },
// 	// modalContainer: {
// 	// 	flex: 1,
// 	// 	justifyContent: "center",
// 	// 	alignItems: "center",
// 	// 	backgroundColor: "rgba(0, 0, 0, 0.5)",
// 	// },
// 	// modalBody: {
// 	// 	backgroundColor: Colors.white,
// 	// 	width: windowWidth - 30,
// 	// 	minHeight: Math.floor(windowHeight / 4),
// 	// 	borderRadius: 3,
// 	// 	elevation: 5,
// 	// 	paddingBottom: 8,
// 	// },
// 	// centerAlign: {
// 	// 	alignItems: "center",
// 	// 	justifyContent: "center",
// 	// },
// 	// headerContainer: {
// 	// 	width: "100%",
// 	// 	height: 50,
// 	// 	flexDirection: "row",
// 	// 	borderBottomWidth: 1,
// 	// 	borderBottomColor: "#ddd",
// 	// 	paddingHorizontal: 8,
// 	// 	justifyContent: "space-between",
// 	// 	alignItems: "center",
// 	// },
// 	// headerTitle: {
// 	// 	fontSize: 18,
// 	// 	color: Colors.textColor,
// 	// },
// 	// closeButton: {
// 	// 	backgroundColor: "#ddd",
// 	// 	width: 25,
// 	// 	height: 25,
// 	// 	borderRadius: 40 / 2,
// 	// 	alignItems: "center",
// 	// 	justifyContent: "center",
// 	// 	elevation: 0,
// 	// },
// 	// closeButtonText: {
// 	// 	color: Colors.textColor,
// 	// 	fontSize: 22,
// 	// },
// 	// bodyRow: {
// 	// 	width: "100%",
// 	// 	paddingVertical: 5,
// 	// 	paddingHorizontal: 15,
// 	// 	flexDirection: "row",
// 	// 	justifyContent: "space-between",
// 	// 	alignItems: "center",
// 	// },
// 	// bodyText: {
// 	// 	fontSize: 16,
// 	// 	color: Colors.textColor,
// 	// },
// 	// loadingTextConatiner: {
// 	// 	flex: 1,
// 	// 	justifyContent: "center",
// 	// 	alignItems: "center",
// 	// },
// 	// loadingText: {
// 	// 	fontSize: 14,
// 	// 	color: Colors.textColor,
// 	// 	opacity: 0.8,
// 	// },
// 	// searchModalOverlay: {
// 	// 	justifyContent: "center",
// 	// 	alignItems: "center",
// 	// 	width: windowWidth,
// 	// 	height: windowHeight,
// 	// },
// 	// seacrhModalContainer: {
// 	// 	flex: 1,
// 	// 	width: windowWidth,
// 	// 	height: windowHeight,
// 	// 	backgroundColor: Colors.white,
// 	// },
// 	// searchModalHeader: {
// 	// 	height: 55,
// 	// 	width: "100%",
// 	// 	elevation: 5,
// 	// 	paddingHorizontal: 10,
// 	// 	flexDirection: "row",
// 	// 	alignItems: "center",
// 	// 	justifyContent: "flex-start",
// 	// 	backgroundColor: Colors.primary,
// 	// },
// 	// backBtnContainer: {
// 	// 	width: "10%",
// 	// 	height: 55,
// 	// 	alignItems: "flex-start",
// 	// 	justifyContent: "center",
// 	// },
// 	// searchContainer: {
// 	// 	width: "90%",
// 	// 	height: 55,
// 	// 	alignItems: "flex-start",
// 	// 	justifyContent: "center",
// 	// },
// 	// searchFieldBox: {
// 	// 	width: "100%",
// 	// 	height: 40,
// 	// 	paddingHorizontal: 10,
// 	// 	flexDirection: "row",
// 	// 	alignItems: "center",
// 	// 	justifyContent: "space-between",
// 	// 	backgroundColor: "rgba(0,0,0, 0.1)",
// 	// 	borderRadius: 50,
// 	// },
// 	// searchField: {
// 	// 	padding: 5,
// 	// 	width: "90%",
// 	// 	color: Colors.white,
// 	// 	fontSize: 15,
// 	// },
// 	// searchModalBody: {
// 	// 	flex: 1,
// 	// 	height: windowHeight - 55,
// 	// },
// 	// searchingText: {
// 	// 	fontSize: 12,
// 	// 	color: Colors.textColor,
// 	// 	opacity: 0.8,
// 	// 	alignSelf: "center",
// 	// 	marginTop: 20,
// 	// },
// });
