import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	Image,
	Dimensions,
	ActivityIndicator,
	Modal,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";
import { Container } from "native-base";
import globalStyles from "../config/Styles";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Configs } from "../config";
import { Header, ListEmpty, Loader, AnimalSearchModal } from "../component";
import AppContext from "../context/AppContext";
import { getAllSubCategory, getSubCatCoverImage } from "../services/APIServices";
import { fetchProfile } from "../services/UserManagementServices";
import { capitalize } from "../utils/Util";
import Carousel from "react-native-snap-carousel";
import { height } from 'react-native-daterange-picker/src/modules';
import { SliderBox } from 'react-native-image-slider-box';
import CachedImage from 'expo-cached-image'
import ScannerButton from "../component/ScannerButton";
import { Camera } from "expo-camera";

const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDE_WIDTH = Math.round((SLIDER_WIDTH * 95) / 100);
const itemHorizontalMargin = (2 * SLIDER_WIDTH) / 100;
const ITEM_WIDTH = SLIDE_WIDTH + itemHorizontalMargin * 2;
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 2) / 3);
const windowScreenWidth = Dimensions.get("screen").width;
const windowScreenHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("window").width;

export default class SubCategory extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			subCategories: [],
			toggleScanModal: false,
			toggleScanStatus: false,
			
			classID:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.classID
					: undefined,
			className:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.className
					: undefined,
			categoryID:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.categoryID
					: undefined,
			categoryName:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.categoryName
					: undefined,
			coverImages: []
		};

		this.searchModalRef = React.createRef();
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
				subCategories: [],
				isLoading: true,
			},
			() => {
				this.loadSubCategories();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadSubCategories = () => {
		let cid = this.context.userDetails.cid;
		let userid = this.context.userDetails.id;
		let { categoryID } = this.state;

		let subCategoryID =
			typeof this.props.route.params !== "undefined"
				? this.props.route.params.subCategoryID
				: undefined;

		Promise.all([getAllSubCategory(cid, categoryID), fetchProfile({ userid }), getSubCatCoverImage(cid, categoryID)])
			.then((response) => {
				let data = response[0];
				let matchArr = (data || []).filter(
					(element) => element.id === subCategoryID
				);

				let remainArr = (data || []).filter(
					(element) => element.id !== subCategoryID
				);
				this.context.setUserData(response[1].data);
				this.setState(
					{
						isLoading: false,
						subCategories: [...matchArr, ...remainArr],
						coverImages: response[2].map((item) => {
							if (item.cover_image) {
								return item;
							}
						})
					},
					// () => {
					// 	if (data.length === 0) {
					// 		this.gotoCommonNameList({
					// 			isSubCategoryEmpty: true,
					// 		});
					// 	}
					// }
				);
			})
			.catch((error) => console.log(error));
	};

	openScaner = () => {
		Camera.requestCameraPermissionsAsync()
			.then((result) => {
				if (result.status === "granted") {
					this.setState({ toggleScanModal: true, toggleScanStatus: true });
				} else {
					Alert.alert("Please give the permission");
				}
			})
			.catch((error) => console.log(error));
	};

	closeScanModal = () => {
		this.setState({
			toggleScanModal: false,
			toggleScanStatus: false,
		});
	};

	handleBarCodeScanned = (data) => {
		try {
		  let scanData = JSON.parse(data.data);
		  let type = scanData.type ? scanData.type : scanData.qr_code_type;
		  if (type == "Group") {
			this.setState({
				toggleScanModal: !this.state.toggleScanModal,
	
			  selectionTypeName: "Animal",
	
			  selectionTypeId: "animal",
	
			  ref_id: scanData.animal_code,
	
			  ref_name: scanData?.common_name,
	
			  section_id: scanData.section_id,
	
			  section_name: scanData.section_name,
	
			  enclosure_id: scanData.enclosure_id,
	
			  enclosure_name: scanData.enclosure_name,
			});
		  } else {
			this.setState({
				toggleScanModal: !this.state.toggleScanModal,
	
			  selectionTypeName: capitalize(type),
	
			  selectionTypeId: type,
	
			  ref_id: scanData.enclosure_db_id
				? scanData.enclosure_db_id
				: scanData.animal_code
				  ? scanData.animal_code
				  : scanData.section_id,
	
			  ref_name: scanData.animal_code
				? scanData?.common_name
				: scanData.enclosure_id
				  ? scanData.enclosure_id
				  : scanData.section,
	
			  section_id: scanData.section_id,
	
			  section_name: scanData.section,
	
			  enclosure_id: scanData.enclosure_db_id,
	
			  enclosure_name: scanData.enclosure_id,
			});
		  }
		} catch (error) {
		  console.log(error);
		  this.setState({ toggleScanModal: !this.state.toggleScanModal });
		  alert("Wrong QR code scan !!");
		}
	  };

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadSubCategories();
			}
		);
	};

	openSearchModal = () => this.searchModalRef.current.openModal();

	gotoCommonNameList = (paramObj) => {
		this.props.navigation.navigate("CommonNames", {
			classID: this.state.classID,
			className: this.state.className,
			categoryID: this.state.categoryID,
			categoryName: this.state.categoryName,
			screenName: paramObj.subCategoryName,
			...paramObj,
		});
	};

	gotoEditSubCategory = (item) => {
		this.props.navigation.navigate("AddSubCategory", {
			classID: this.state.classID,
			className: this.state.className,
			categoryID: this.state.categoryID,
			categoryName: this.state.categoryName,
			id: item.id,
			imageUri: item.cat_icon,
			coverImageURI: item.cover_image,
			subCategoryName: item.cat_name,
			prority: item.prority,
			description: item.description !== null ? item.description : "",
			scientificName: item.scientificName !== null ? item.scientificName : "",
		});
	};

	renderSubCategoryItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onLongPress={this.checkEditActionPermissions.bind(this, item)}
			onPress={this.gotoCommonNameList.bind(this, {
				subCategoryID: item.id,
				subCategoryName: item.cat_name,
			})}
		>
			<View style={styles.view}>
				<View style={{ width: "20%", justifyContent: "center" }}>
					<Image
						style={styles.image}
						source={{ uri: item.cat_icon }}
						resizeMode="contain"
					/>
				</View>
				<View style={{ justifyContent: "center", flex: 1 }}>
					<Text style={styles.name}>{`${capitalize(item.cat_name)}`}
					</Text>
					<Text>
						{item.scientificName ? <Text style={{
							fontSize: 12, fontStyle: "italic",
							color: Colors.textColor,
						}}>{`( ${capitalize(item.scientificName)} )`}</Text> : null}
					</Text>
					{/* <Text style={[styles.name,{fontSize: 12}]}>{`M - ${item.total_male_animal}, F - ${item.total_female_animal}`}</Text> */}
				</View>
				{this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ? (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-end",
							alignItems: "center",
						}}
					>
						<View style={styles.qtyContainer}>
							<Text style={styles.qty}>{item.total_animals}</Text>
						</View>
						{/* <Ionicons name="chevron-forward" style={styles.iconStyle} /> */}
					</View>
				) : null}
			</View>
		</TouchableHighlight>
	);

	gotoBack = () => {
		this.props.navigation.goBack();
	};

	gotoAddSubCategory = () => {
		this.props.navigation.navigate("AddSubCategory", {
			classID: this.state.classID,
			className: this.state.className,
			categoryID: this.state.categoryID,
			categoryName: this.state.categoryName,
		});
	};

	checkAddActionPermissions = () => {
		if (this.state.isLoading == false) {
			if (this.context.userDetails.action_types.includes("Add")) {
				return this.gotoAddSubCategory;
			} else {
				return undefined
			}
		} else {
			return undefined
		}
	}

	checkEditActionPermissions = (item) => {
		if (this.context.userDetails.action_types.includes("Edit")) {
			this.gotoEditSubCategory(item)
		}
	}

	_renderItem = ({ item, index }, parallaxProps) => {
		return (
			<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
				<View key={item.id.toString()} style={styles.slide}>
					<CachedImage
						source={{
							uri: item.cover_image,
						}}
						cacheKey={`${item.id}-thumb`}
						placeholderContent={(
							// <Image  source={require('../assets/icon.png')} style={{height:150 , width: 200}}/>
							<ActivityIndicator
								color={Colors.primary}
								size="small"
								style={{
									flex: 1,
									justifyContent: "center",
								}}
							/>
						)}
						style={styles.sliderImage}
					/>
				</View>
				<View
					style={{
						position: 'absolute',
						bottom: 2,
						backgroundColor: 'rgba(0,0,0,0.3)',
						alignItems: 'flex-end',
						justifyContent: 'center',
						paddingHorizontal: 10,
						borderRadius: 2,
						right: 0
					}}>
					<View>
						<Text style={{ fontSize: 16, paddingVertical: 5, color: Colors.white }}>{`${item.cat_name}`}</Text>
					</View>
					{/* <View>
						<Text>{item.description.slice(0, 50)}</Text>
					</View> */}
				</View>
			</View>
		);
	}


	render = () => {
		const carouselItems = this.state.coverImages.map((x) => {

			return (
				// x.cover_image

				{
					id: x.id,
					common_name: x.cat_name,
					cover_image: x.cover_image,
				}
			)

		})
		//   console.log("carouselItems>>>>>>>>>>",carouselItems);
		return (
			<Container>
				<Header
					title={
						typeof this.state.categoryName !== "undefined"
							? this.state.categoryName
							: "Sub Categories"
					}
					// showScanButton={this.state.isLoading ? undefined : true}
					searchAction={this.state.isLoading ? undefined : this.openSearchModal}
					addAction={this.checkAddActionPermissions()}
				/>
				{this.state.isLoading ? (
					<Loader />
				) : (
					<>
						{this.state.coverImages.length > 0 ? (
							<View style={styles.carouselConatainer}>
								{/* <Carousel
								layout={'default'}
								inactiveSlideOpacity={0.6}
								inactiveSlideScale={0.65}
								firstItem={0}
								sliderWidth={SLIDER_WIDTH}
								itemWidth={ITEM_WIDTH}
								data={this.state.coverImages}
								renderItem={this._renderItem}
								containerCustomStyle={{ overflow: 'hidden' }}
								contentContainerCustomStyle={{ overflow: 'hidden' }}
								lockScrollWhileSnapping={true}
								activeAnimationType={'timing'}
								activeSlideAlignment={'center'}
								loop
								autoplay
							/> */}

								<SliderBox
									images={carouselItems}
									firstItem={0}
									sliderBoxHeight={ITEM_HEIGHT}
									parentWidth={SLIDER_WIDTH}
									ImageComponentStyle={{ borderRadius: 2, width: '99.25%', marginTop: 2 }}
									paginationBoxVerticalPadding={20}
									autoplay
									circleLoop
									resizeMethod={'resize'}
									resizeMode={'cover'}
									paginationBoxStyle={{
										position: "absolute",
										bottom: 0,
										padding: 0,
										alignItems: "center",
										alignSelf: "center",
										justifyContent: "center",
										paddingVertical: 10
									}}
									dotStyle={{
										width: 0,
										height: 0,
										borderRadius: 3,
										marginHorizontal: 0,
										padding: 0,
										margin: 0,
										backgroundColor: "rgba(128, 128, 128, 0.92)"
									}}
									imageLoadingColor={Colors.primary}
								/>
							</View>
						) : null}

						<FlatList
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
							ListEmptyComponent={() => <ListEmpty />}
							data={this.state.subCategories}
							keyExtractor={(item, index) => item.id.toString()}
							renderItem={this.renderSubCategoryItem}
							initialNumToRender={this.state.subCategories.length}
							refreshing={this.state.isLoading}
							onRefresh={this.handelRefresh}
							contentContainerStyle={
								this.state.subCategories.length === 0 ? styles.container : null
							}
						/>
					</>

				)}
				<ScannerButton btnPress={this.openScaner} />
				<Modal
              animationType="fade"
              transparent={true}
              statusBarTranslucent={true}
              visible={this.state.toggleScanModal}
              onRequestClose={this.closeScanModal}
            >
              <SafeAreaView style={globalStyles.safeAreaViewStyle}>
                <View
                  style={
                    this.state.toggleScanStatus
                      ? style.scanModalOverlay
                      : [
                          style.scanModalOverlay,
                          { backgroundColor: Colors.white },
                        ]
                  }
                >
                  {this.state.toggleScanStatus ? (
                    <>
                      <View style={style.qrCodeSacnBox}>
                        <Camera
                          onBarCodeScanned={this.handleBarCodeScanned}
                          barCodeScannerSettings={{
                            barCodeTypes: [
                              BarCodeScanner.Constants.BarCodeType.qr,
                            ],
                          }}
                          style={StyleSheet.absoluteFill}
                        />
                      </View>
                      <TouchableOpacity
                        style={style.cancelButton}
                        onPress={this.closeScanModal}
                      >
                        <Ionicons
                          name="close-outline"
                          style={style.cancelButtonText}
                          size={55}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    // showOptionsAfterScan && func()
                    <></>
                  )}
                </View>
              </SafeAreaView>
            </Modal>
				<AnimalSearchModal
					ref={this.searchModalRef}
					animalClass={this.state.classID}
					animalCategory={this.state.categoryID}
					navigation={this.props.navigation}
				/>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 5,
	},
	view: {
		flexDirection: "row",
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
		paddingVertical: 3,
	},
	image: {
		width: 55,
		height: 55,
	},
	name: {
		fontSize: 18,
		color: Colors.textColor,
	},
	qtyContainer: {
		height: 35,
		width: 35,
		borderRadius: 100,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	qty: {
		fontSize: 14,
		color: "#FFF",
	},
	iconStyle: {
		fontSize: 18,
		color: "#cecece",
	},
	slide: {
		width: SLIDE_WIDTH,
		height: ITEM_HEIGHT + 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sliderImage: {
		height: ITEM_HEIGHT,
		width: ITEM_WIDTH,
	},
	carouselConatainer: {
		marginBottom: 5,
		position: 'relative',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		elevation: 1,
		height: ITEM_HEIGHT,
	},
	scanModalOverlay: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		width: windowScreenWidth,
		height: windowScreenHeight,
	  },
	  qrCodeSacnBox: {
		width: Math.floor((windowWidth * 70) / 100),
		height: Math.floor((windowWidth * 70) / 100),
	  },
	  scanResultBox: {
		flex: 1,
		 backgroundColor: Colors.white,
		width: "100%",
		alignItems: "center",
		marginTop: 60,
	  },
});
const style = StyleSheet.create({
	scannerBtn: {
	  position: "absolute",
	  bottom: 25,
	  right: 25,
	  backgroundColor: Colors.primary,
	  width: 50,
	  height: 50,
	  borderRadius: 50,
	  alignItems: "center",
	  justifyContent: "center",
	},
	scanModalOverlay: {
	  justifyContent: "center",
	  alignItems: "center",
	  backgroundColor: "rgba(0, 0, 0, 0.8)",
	  width: windowScreenWidth,
	  height: windowScreenHeight,
	},
	qrCodeSacnBox: {
	  width: Math.floor((windowWidth * 70) / 100),
	  height: Math.floor((windowWidth * 70) / 100),
	},
	scanResultBox: {
	  flex: 1,
	  backgroundColor: Colors.white,
	  width: "100%",
	  alignItems: "center",
	  marginTop: 60,
	},
	modalView: {
	  width: "98%",
	  borderColor: "#ddd",
	  borderWidth: 1,
	  borderBottomWidth: 0,
	  borderRadius: Colors.formBorderRedius,
	  marginBottom: 30,
	},
	cancelButton: {
	  position: "absolute",
	  zIndex: 11,
	  top: 30,
	  left: 10,
	  backgroundColor: Colors.lightGrey,
	  width: 30,
	  height: 30,
	  borderRadius: 100,
	  alignItems: "center",
	  justifyContent: "center",
	  elevation: 3,
	},
	cancelButtonText: {
	  color: "#000",
	  fontSize: 24,
	},
	textfield: {
	  height: "auto",
	  fontSize: Colors.textSize,
	  color: Colors.textColor,
	  textAlign: "left",
	  padding: 5,
	},
  });