import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	TextInput,
	TouchableOpacity,
	Dimensions,
	Modal,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getProducts } from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class 
Items extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			products: [],
			isSearchModalOpen: false,
			searchValue: "",
			searchData: [],
			ItemType:props.route.params.itemType,
		};

		this.searchInput = React.createRef();
	}

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener(
			"focus",
			this.onScreenFocus
		);
	}

	onScreenFocus = () => {
		this.setState(
			{
				isLoading: true,
				products: [],
			},
			() => {
				this.loadItems();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadItems = () => {
		let cid = this.context.userDetails.cid;
		let reqObj = {
            cid: cid,
            type: this.state.ItemType
        }
		getProducts(reqObj)
			.then((data) => {
				this.setState({
					isLoading: false,
					products: data,
				});
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadItems();
			}
		);
	};

	openSearchModal = () => {
		this.setState({
			isSearchModalOpen: true,
			searchValue: "",
			searchData: [],
		});

		setTimeout(() => {
			this.searchInput.current.focus();
		}, 500);
	};

	closeSearchModal = () => {
		this.setState({
			isSearchModalOpen: false,
			searchValue: "",
			searchData: [],
		});
	};

	searchProduct = () => {
		let { searchValue, products } = this.state;

		let data = products.filter((element) => {
			let name = element.name.toLowerCase();
			let index = name.indexOf(searchValue.toLowerCase());
			return index > -1;
		});

		this.setState({ searchData: data });
	};

	gotoAddItem = () => this.props.navigation.navigate("AddItem");

	gotoItemDetails = (item) => {
		this.closeSearchModal();
		this.props.navigation.navigate("ItemDetails", {
			productID: item.id,
			productCode: item.product_code,
		});
	};

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.gotoItemDetails.bind(this, item)}
		>
			<View style={styles.row}>
				<View style={styles.leftPart}>
					<Text style={styles.name}>{item.name}</Text>
					<Text style={styles.subText}>{"Type: " + item.type}</Text>
					<Text style={styles.subText}>
						{"Purchase Price: ₹" + item.purchase_price}
					</Text>
					{/* <Text style={styles.subText}>
						{"Sales Price: ₹" + item.sales_price}
					</Text> */}
				</View>
				<View style={styles.rightPart}>
					<View style={styles.qtyBox}>
						<Text style={styles.qtyText}>
							{item.total_stock + " " + item.unit}
						</Text>
					</View>
					<Ionicons name="chevron-forward" style={styles.iconStyle} />
				</View>
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<Container>
			<Header
				title={"Items"}
				searchAction={this.state.isLoading ? undefined : this.openSearchModal}
				addAction={this.state.isLoading || !this.context.userDetails.action_types.includes('Add') ? undefined : this.gotoAddItem}
			/>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.products}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.products.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.products.length === 0 ? styles.container : null
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
								style={styles.searchBackBtn}
								onPress={this.closeSearchModal}
							>
								<Ionicons name="arrow-back" size={25} color={Colors.white} />
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
												},
												() => {
													this.searchProduct();
												}
											)
										}
										autoCompleteType="off"
										placeholder="Search"
										placeholderTextColor={Colors.white}
										style={styles.searchField}
									/>
								</View>
							</View>
						</View>

						<View style={styles.searchModalBody}>
							{this.state.searchValue.trim().length > 0 ? (
								<FlatList
									data={this.state.searchData}
									keyExtractor={(item, index) => item.id.toString()}
									renderItem={this.renderListItem}
									initialNumToRender={this.state.searchData.length}
									keyboardShouldPersistTaps="handled"
									ListEmptyComponent={() => (
										<Text
											style={[globalStyle.mt10,globalStyle.detailText,{color: Colors.textColor}]}
										>
											No Result Found
										</Text>
									)}
								/>
							) : null}
						</View>
					</View>
				</View>
			</Modal>
		</Container>
	);
}

//  const windowHeight = Dimensions.get("window").height;
// const windowWidth = Dimensions.get("window").width;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 	},
// 	row: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 5,
// 	},
// 	leftPart: {
// 		width: "75%",
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		alignItems: "center",
// 	},
// 	name: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 14,
// 		lineHeight: 22,
// 	},
// 	qtyBox: {
// 		backgroundColor: Colors.primary,
// 		paddingHorizontal: 5,
// 		paddingVertical: 3,
// 		borderRadius: 3,
// 	},
// 	qtyText: {
// 		fontSize: 14,
// 		color: "#FFF",
// 	},
// 	iconStyle: {
// 		fontSize: 18,
// 		color: "#cecece",
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
// 		width: "100%",
// 		elevation: 5,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 		backgroundColor: Colors.primary,
// 	},
// 	searchBackBtn: {
// 		width: "10%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchContainer: {
// 		width: "90%",
// 		flexDirection: "row",
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchFieldBox: {
// 		width: "100%",
// 		height: 40,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		backgroundColor: "rgba(0,0,0, 0.1)",
// 		borderRadius: 50,
// 	},
// 	searchField: {
// 		width: "90%",
// 		padding: 5,
// 		color: Colors.white,
// 		fontSize: 15,
// 	},
// 	searchModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 	},
// });
