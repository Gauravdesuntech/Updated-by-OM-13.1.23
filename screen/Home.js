import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  Modal,
  BackHandler,
  AppState,
  Linking,
  SafeAreaView,
} from "react-native";

import RNModal from "react-native-modal";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as Network from "expo-network";
import Colors from "../config/colors";
import { Header, AnimalSearchModal } from "../component";
import AppContext from "../context/AppContext";
import { Configs } from "../config";
import { OverlayLoader } from "../component";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  getAnimalGroups,
  getAnnouncement,
  getRandomCommonName,
  getDistanceand,
  manageDeviceLog,
  searchCommonName,
} from "../services/APIServices";
import {
  getUserDetails,
  getUserDetailsContext,
} from "../services/UserManagementServices";
import { getUserMenu, capitalize } from "../utils/Util";
import Carousel from "react-native-snap-carousel";
import { ScrollView } from "react-native-gesture-handler";
import { SliderBox } from "react-native-image-slider-box";
import CachedImage from "expo-cached-image";
import globalStyles from "../config/Styles";
import styles from "./Styles";
import ScannerButton from "../component/ScannerButton";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const windowScreenWidth = Dimensions.get("screen").width;
const windowScreenHeight = Dimensions.get("screen").height;
const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDE_WIDTH = Math.round((SLIDER_WIDTH * 98) / 100);
const itemHorizontalMargin = (2 * SLIDER_WIDTH) / 100;
const ITEM_WIDTH = SLIDE_WIDTH + itemHorizontalMargin; //remove *2 for padding carousal
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 2) / 3);

export default class Home extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isSearching: true,
      isSearchModalOpen: false,
      isLoading: false,
      searchBy: "common_name",
      newMenuStatus: false,
      searchValue: "",
      searchData: [],
      menu: Configs.HOME_SCREEN_MENUES,
      animalGroups: [],
      randomAnimal: [],
      loadImage: "",
      announcement: null,
      showAnnouncement: false,
      toggleScanModal: false,
      toggleScanStatus: false,
      scanData: "",
      toggleShowOptionsAfterScan: false,
      type: "",

      appState: AppState.currentState,
      userDetails: null,
      distance: true,
    };
    this.searchModalRef = React.createRef();
  }

  setUserMenu() {
    this.context.unsetFilterDetails();
    this.setState({ isLoading: true });
    const userId = this.context.userDetails.id;
    let cid = this.context.userDetails.cid;
    Promise.all([
      getAnimalGroups(cid),
      getRandomCommonName(cid),
      getUserDetailsContext(userId),
    ])
      .then((response) => {
        this.setState({ isLoading: false });
        let userData = response[2].data;
        // let filteredImages = response[2].map((item)=>{
        // 	if(item.cover_image){
        // 		return item
        // 	}
        // })
        // console.log("bdcbisabd>>>>>",response[2].data);
        // return;
        this.context.setUserData(userData);
        // console.log("User>>>>>>>>>>>>>>",userData);
        this.setState({
          animalGroups: response[0],
          menu: getUserMenu(userData.module_permissions),
          newMenuStatus: true,
          randomAnimal: response[1],

          userDetails: userData,
        });
      })
      .catch((err) => {
        console.log("err---------", err);
      });
  }

  componentDidMount() {
    this.setUserMenu();
    this.focusListeners = this.props.navigation.addListener("focus", () => {
      this.setUserMenu();
      this.showAnnouncement();
    });
    // For get the AppState
    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          this.getLocation();
          // console.log("App has come to the foreground!");
        }
        this.setState({ appState: nextAppState });
      }
    );

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.appStateSubscription.remove();
    this.focusListeners();
    this.backHandler.remove();
  }

  showAnnouncement = () => {
    getAnnouncement()
      .then((res) => {
        // console.log(res);
        if (res != null) {
          let index = JSON.parse(res.users).filter(
            (element) => element.id == this.context.userDetails.id
          );
          // console.log(index.length);
          if (index.length > 0) {
            this.setState({ announcement: { ...res }, showAnnouncement: true });
            // Alert.alert(res.title, res.description, [{ text: "OK" }]);
            // <Modal animationType="slide" transparent={true} visible={true}>
            //   <View style={styles.modalbox}>
            //     <View style={styles.modalbody}>
            //       <View>
            //         <Text>{res.title}</Text>
            //       </View>
            //       <ScrollView contentContainerStyle={{}}>
            //         {res.description && res.image ? (
            //           <>
            //             <Text>{res.description}</Text>
            //             <Image source={{ uri: res.image }}></Image>
            //           </>
            //         ) : null}
            //         {res.description && !res.image ? (
            //           <>
            //             <Text>{res.description}</Text>
            //           </>
            //         ) : null}
            //         {!res.description && res.image ? (
            //           <>
            //             <Image source={{ uri: res.image }}></Image>
            //           </>
            //         ) : null}
            //       </ScrollView>
            //       <TouchableOpacity
            //         style={styles.closeButton}
            //         onPress={props.closeAction}
            //       >
            //         <Ionicons
            //           name="close-outline"
            //           style={styles.closeButtonText}
            //         />
            //       </TouchableOpacity>
            //     </View>
            //   </View>
            // </Modal>;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggleDrawer = () => this.props.navigation.toggleDrawer();
  // gotoRecordManagament = () => this.props.navigation.navigate("AnimalGroups");
  // gotoFeedManagament = () => this.props.navigation.navigate("FeedManagement");
  // gotoStaffManagament = () => this.props.navigation.navigate("Departments");
  gotoTaskManagament = () => this.props.navigation.navigate("Todo");

  // gotoEnclosureManagament = () =>
  // 	this.props.navigation.navigate("EnclosureMgmtHome");

  // gotoInventoryManagement = () =>
  // 	this.props.navigation.navigate("InventoryHome");

  openSearchModal = () => this.searchModalRef.current.openModal();

  checkEditActionPermissions = (item) => {
    if (this.context.userDetails.action_types.includes("Edit")) {
      this.gotoEditGroup(item);
    }
  };

  gotoCategory = (item) => {
    this.props.navigation.navigate("Category", {
      classID: item.id,
      className: item.group_name,
      enableAddButton: false,
    });
  };

  gotoEditGroup = (item) => {
    this.props.navigation.navigate("Add Group", {
      id: item.id,
      imageURI: item.image,
      groupName: item.group_name,
      groupDetails: item.group_details !== null ? item.group_details : "",
    });
  };

  fetchAnimalDetails = (data) => {
    let searchData = {
      search_value: data.common_name,
    };
    searchCommonName(searchData)
      .then((data) => {
        this.setState({
          toggleScanStatus: false,
          toggleScanModal: false,
          scanData: "",
        });
        navigation.navigate("CommonNameDetails", {
          commonNameID: data[0].id,
          commonName: data[0].common_name,
          imageUri: data[0].image,
          description: data[0].description,
        });
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
      scanData: "",
      toggleShowOptionsAfterScan: false,
    });
  };

  handleBarCodeScanned = ({ data }) => {
    let parsedData = JSON.parse(data);
    console.log(parsedData,"parseData");
    if (parsedData.query == "details") {
      this.setState({
        toggleScanModal: false,
        type: "animal",
      });
      this.fetchAnimalDetails(parsedData);
    }
    if (parsedData.type == "Group") {
      this.setState({
        toggleScanModal: false,
        type: "animal",
        scanData: parsedData,
        toggleScanStatus: false,
        toggleShowOptionsAfterScan: true,
      });
    } else if (parsedData.qr_code_type == "section") {
      this.setState({
        type: "section",
        toggleScanStatus: false,
        toggleShowOptionsAfterScan: true,
        scanData: parsedData,
      });
    } else if (parsedData.qr_code_type == "enclosure") {
      this.setState({
        type: "enclosure",
        scanData: parsedData,
        toggleScanStatus: false,
        toggleShowOptionsAfterScan: true,
      });
    } else if (parsedData.dept_code) {
      this.setState({
        type: "staff",
        scanData: parsedData,
        toggleScanModal: false,
      });
    }
  };
  goToBack = () => this.props.navigation.goBack();
  componentDidUpdate() {
    if (this.state.toggleShowOptionsAfterScan === true) {
      this.setState({ toggleScanModal: false });
      this.props.navigation.navigate("OptionsAfterScan", {
        scanData: this.state.scanData,
        // // toggleScanModal,
        type: this.state.type,
        closeScanModal: this.closeScanModal,
        setShowOptionsAfterScan: (value) =>
          this.setState({ toggleShowOptionsAfterScan: value }),
        gotoBack: this.goToBack,
      });
    }
  }

  _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <View key={item.id.toString()} style={styles.slide}>
            <CachedImage
              source={{
                uri: item.cover_image,
              }}
              cacheKey={`${item.id}-thumb`}
              placeholderContent={
                // <Image  source={require('../assets/icon.png')} style={{height:150 , width: 200}}/>
                <ActivityIndicator
                  color={Colors.primary}
                  size="small"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                />
              }
              style={styles.sliderImage}
            />
          </View>
          <View
            style={{
              position: "absolute",
              resizeMode: "cover",
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingHorizontal: 10,
              borderRadius: 2,
              right: 3,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  paddingVertical: 5,
                  color: Colors.white,
                }}
              >{`${item.common_name}`}</Text>
            </View>
            {/* <View>
						<Text>{item.fun_facts}</Text>
					</View> */}
          </View>
        </View>
        {/* <View style={styles.funFactsContainer}>
					<Image
						style={styles.funFactsBgImage}
						source={require("../assets/image/yellow-bg-map.png")}
						resizeMode="contain"
					/>
					<Text style={styles.funtFatcsHeading}>Fun Facts</Text>

					<View style={styles.funFactsTextContainer}>
						<Text
							numberOfLines={5}
							ellipsizeMode="tail"
							style={styles.funFactsText}
						>
							{item.fun_facts}
						</Text>
					</View>
				</View> */}
      </>
    );
  };

  renderItemMenu = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.screen != "") {
            this.props.navigation.navigate(item.screen);
          }
        }}
        style={[
          styles.btn,
          styles.pl12,
          {
            borderBottomColor: "#eee",
            borderBottomWidth: 1,
          },
        ]}
      >
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={item.icon} resizeMode="contain" />
        </View>
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderAnimalGroupItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: "white", marginLeft: 5, overflow: "hidden" }}
        activeOpacity={0.5}
        onPress={this.gotoCategory.bind(this, item)}
        // onLongPress={this.checkEditActionPermissions.bind(this, item)}
      >
        <View style={styles.view}>
          <View style={{ justifyContent: "center", overflow: "hidden" }}>
            <Image
              style={[styles.image, { height: 35, width: 35 }]}
              source={{ uri: item.image }}
              resizeMode="contain"
            />
          </View>
          <View style={{ justifyContent: "center", height: 25 }}>
            <Text style={styles.name}>{capitalize(item.group_name)}</Text>
            {/* <Text style={[styles.name,{fontSize: 12}]}>{`M - ${item.total_male_animal}, F - ${item.total_female_animal}`}</Text> */}
          </View>
          {/* {this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?
						(
							<View
								style={{
									flexDirection: "row",
									justifyContent: "flex-end",
									alignItems: "center",
								}}
							>
								<View style={styles.qtyContainer}>
									<Text style={styles.qty}>{item.total_animal}</Text>
								</View>
							</View>
						)
						: null} */}
        </View>
      </TouchableOpacity>
    );
  };

  backAction = () => {
    if (Platform.OS == "ios") {
      Alert.alert("Warning"[{ text: "ok", onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    BackHandler.exitApp();
    return true;
  };

  getLocation = async () => {
    let location = await Location.getCurrentPositionAsync();

    this.setState({ location: location });

    let userLat_Lng = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };

    // console.log("userLat_Lng>>>>>>",this.state.userDetails);

    getDistanceand(Configs.LONG_LAT, userLat_Lng).then((res) => {
      let distance = res.rows[0].elements[0].distance.value;
      // console.log({
      //   res,
      //   get_loc: this.state.userDetails.location_range,
      // });
      if (this.state.userDetails.location_status == 1) {
        if (distance >= Number(this.state.userDetails.location_range)) {
          alert(
            "Your distance from location " +
              res.rows[0].elements[0].distance.text
          );
          if (!Configs.ISDEV) {
            this.setState(
              {
                distance: false,
              },
              () => {
                setTimeout(() => {
                  this.backAction();
                }, 999);
              }
            );
          }

          // For stop app if location distance more than 1KM
        }
      }
    });
  };

  getDeviceDetails = async () => {
    // console.log(this.state.userDetails)
    let obj = {
      user_id: this.state.userDetails.id,
      user_name: this.state.userDetails.full_name,
      cid: this.state.userDetails.cid,
      device_details: JSON.stringify({
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
        modelId: Device.modelId,
        osName: Device.osName,
        osVersion: Device.osVersion,
        osBuildId: Device.osBuildId,
        deviceName: Device.deviceName,
        DeviceType: Device.DeviceType,
        androidId: Platform.OS == "android" ? Application.androidId : "",
        buildVersion: Application.nativeBuildVersion,
        ipAddress: await Network.getIpAddressAsync(),
        networkState: await Network.getNetworkStateAsync(),
      }),
    };

    manageDeviceLog(obj)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  render = () => {
    return (
      <Container>
        {this.state.distance ? (
          <>
            <Header title={"Home"} searchAction={this.openSearchModal} />
            {this.state.isLoading === true ? (
              <OverlayLoader visible={this.state.isLoading} />
            ) : (
              <View style={styles.Homecontainer}>
                <View style={styles.carouselConatainer}>
                  <SliderBox
                    images={this.state.randomAnimal}
                    firstItem={1}
                    sliderBoxHeight={ITEM_HEIGHT}
                    parentWidth={SLIDER_WIDTH}
                    ImageComponentStyle={{
                      borderRadius: 2,
                      width: "99.25%",
                      marginTop: 2,
                    }}
                    paginationBoxVerticalPadding={20}
                    autoplay
                    resizeMethod={"resize"}
                    resizeMode={"cover"}
                    paginationBoxStyle={{
                      position: "absolute",
                      bottom: 0,
                      padding: 0,
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      paddingVertical: 10,
                    }}
                    dotStyle={{
                      width: 0,
                      height: 0,
                      borderRadius: 3,
                      marginHorizontal: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: "rgba(128, 128, 128, 0.92)",
                    }}
                    imageLoadingColor={Colors.primary}
                  />
                </View>
                <View style={{ backgroundColor: "#ff00" }}>
                  <FlatList
                    data={this.state.animalGroups}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={this.renderAnimalGroupItem}
                    extraData={this.state.animalGroups}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.menu}
                  // data={Configs.HOME_SCREEN_MENUES}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={this.renderItemMenu}
                  extraData={this.state.newMenuStatus}
                  contentContainerStyle={{
                    alignSelf: "center",
                    marginTop: 5,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    borderWidth: 1,
                    width: "98%",
                    borderColor: "#eee",
                    borderBottomColor: "white",
                  }}
                />
                <ScannerButton btnPress={this.openScaner} />
              </View>
            )}
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
              navigation={this.props.navigation}
            />
            <RNModal
              coverScreen={true}
              style={{ height: "auto", width: "auto" }}
              isVisible={this.state.showAnnouncement}
              onBackdropPress={() => {
                this.setState({ showAnnouncement: false });
              }}
            >
              <View style={styles.modalbody}>
                <View>
                  <Text style={styles.modalTitleStyle}>
                    {this.state.announcement?.title}
                  </Text>
                </View>
                <ScrollView contentContainerStyle={{}}>
                  {this.state.announcement?.description ? (
                    <Text style={styles.modalTextStyle}>
                      {this.state.announcement?.description}
                    </Text>
                  ) : null}

                  {this.state.announcement?.image ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        style={styles.modalImageStyle}
                        source={{ uri: this.state.announcement?.image }}
                      />
                    </View>
                  ) : null}
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    this.setState({ showAnnouncement: false });
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    style={styles.closeButtonText}
                  />
                </TouchableOpacity>
              </View>
            </RNModal>
          </>
        ) : null}
      </Container>
    );
  };
}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   pl12: {
//     paddingLeft: 12,
//   },
//   pr12: {
//     paddingRight: 12,
//   },
//   btnContainer: {
//     paddingTop: 12,
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   btn: {
//     // width: Math.floor(windowWidth / 2),
//     paddingVertical: 10,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   imgContainer: {
//     width: "20%",
//   },
//   image: {
//     width: 40,
//     height: 40,
//     resizeMode: "contain",
//   },
//   title: {
//     width: "72%",
//     fontSize: 16,
//     color: Colors.textColor,
//   },
//   view: {
//     height: 70,
//     width: 70,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   shadwEffect: {
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 0.5,
//     },
//     shadowOpacity: 0.18,
//     shadowRadius: 1.0,
//   },
//   slide: {
//     width: SLIDE_WIDTH,
//     height: ITEM_HEIGHT,
//     alignItems: "center",
//     justifyContent: "center",
//     resizeMode: "cover",
//   },
//   sliderImage: {
//     height: ITEM_HEIGHT,
//     width: ITEM_WIDTH,
//   },
//   carouselConatainer: {
//     marginBottom: 0,
//     position: "relative",
//     height: ITEM_HEIGHT,
//   },
//   funFactsContainer: {
//     width: windowWidth,
//     height: 120,
//     paddingHorizontal: 8,
//     marginTop: 2,
//   },
//   funFactsBgImage: {
//     width: windowWidth - 16,
//     height: 120,
//   },
//   funtFatcsHeading: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: Colors.lightBrown,
//     position: "absolute",
//     top: 0,
//     left: 20,
//   },
//   funFactsTextContainer: {
//     position: "absolute",
//     top: 25,
//     left: 40,
//     width: Math.floor(windowWidth * 0.6),
//     height: 70,
//   },
//   funFactsText: {
//     fontSize: 12,
//     color: Colors.black,
//   },
//   name: {
//     fontSize: 12,
//     color: Colors.textColor,
//   },

//   modalbox: {
//     backgroundColor: "rgba(0,0,0,0.5)",
//     zIndex: 10,
//     height: "100%",
//     justifyContent: "center",
//   },
//   scrollViewStyle: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-around",
//     height: "100%",
//   },
//   modalbody: {
//     backgroundColor: Colors.white,
//     // height: 150,
//     // maxHeight: parseInt(windowHeight / 3),
//     bottom: 0,
//     padding: 10,
//     marginHorizontal: 30,
//     color: Colors.black,
//     borderRadius: 4,
//     paddingVertical: 20,
//   },
//   modalTitleStyle: {
//     textAlign: "center",
//     fontSize: 20,
//     marginBottom: 22,
//   },
//   modalTextStyle: {
//     textAlign: "center",
//     // fontSize: 20,
//     marginBottom: 22,
//   },
//   modalImageStyle: {
//     height: 250,
//     textAlign: "center",
//     width: 250,
//     // marginHorizontal: "auto",
//   },
//   closeButton: {
//     position: "absolute",
//     zIndex: 11,
//     top: 3,
//     right: 3,
//     backgroundColor: "#007968",
//     width: 30,
//     height: 30,
//     borderRadius: 40 / 2,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 0,
//   },
//   closeButtonText: {
//     color: "#fff",
//     fontSize: 26,
//   },
// });
