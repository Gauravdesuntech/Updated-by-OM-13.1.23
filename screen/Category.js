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
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Configs } from "../config";
import { Header, Loader, ListEmpty, AnimalSearchModal } from "../component";
import AppContext from "../context/AppContext";
import {
  getAllCategory,
  fetchCategoryCoverPhoto,
} from "../services/APIServices";
import { fetchProfile } from "../services/UserManagementServices";
import { capitalize } from "../utils/Util";
import Carousel from "react-native-snap-carousel";
import { height } from "react-native-daterange-picker/src/modules";
import { SliderBox } from "react-native-image-slider-box";
import CachedImage from "expo-cached-image";

import globalStyles from "../config/Styles";
import ScannerButton from "../component/ScannerButton";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
// import styles from './Styles'
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const windowScreenWidth = Dimensions.get("screen").width;
const windowScreenHeight = Dimensions.get("screen").height;
const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDE_WIDTH = Math.round((SLIDER_WIDTH * 98) / 100);
const itemHorizontalMargin = (2 * SLIDER_WIDTH) / 100;
const ITEM_WIDTH = SLIDE_WIDTH + itemHorizontalMargin; //remove *2 for padding carousal
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 2) / 3);


export default class Category extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      isLoading: true,
      toggleScanModal: false,
      toggleScanStatus: false,
      toggleShowOptionsAfterScan:false,
      scanData:"",
      
      classID:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.classID
          : undefined,
      className:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.className
          : undefined,
      coverPhotos: [],
      showTags: false,
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
        categories: [],
        isLoading: true,
      },
      () => {
        this.loadCategories();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadCategories = () => {
    let cid = this.context.userDetails.cid;
    let userid = this.context.userDetails.id;
    let { classID } = this.state;

    let categoryID =
      typeof this.props.route.params !== "undefined"
        ? this.props.route.params.categoryID
        : undefined;

    Promise.all([
      getAllCategory(cid, classID),
      fetchProfile({ userid }),
      fetchCategoryCoverPhoto(cid, classID),
    ])
      .then((response) => {
        let data = response[0];
        let matchArr = (data || []).filter(
          (element) => element.id === categoryID
        );

        let remainArr = (data || []).filter(
          (element) => element.id !== categoryID
        );
        this.context.setUserData(response[1].data);
        // let filteredImages = response[2].map((x)=>{
        // 	if(x.cover_image){
        // 		return {
        // 			id: x.id,
        // 			common_name: x.cat_name,
        // 			cover_image:x.cover_image,
        // 		}
        // 	}
        // })
        this.setState({
          isLoading: false,
          categories: [...matchArr, ...remainArr],
          coverPhotos: response[2],
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
        this.loadCategories();
      }
    );
  };

  openSearchModal = () => this.searchModalRef.current.openModal();

  gotoSubCategoryList = (item) => {
    this.props.navigation.navigate("SubCategory", {
      classID: this.state.classID,
      className: this.state.className,
      categoryID: item.id,
      categoryName: item.cat_name,
    });
  };

  gotoCommonNameList = (item) => {
    this.props.navigation.navigate("CommonNames", {
      classID: this.state.classID,
      className: this.state.className,
      categoryID: item.id,
      categoryName: item.cat_name,
      isSubCategoryEmpty: true,
      screenName: item.cat_name,
    });
  };

  gotoEditCategory = (item) => {
    this.props.navigation.navigate("Add Category", {
      id: item.id,
      imageUri: item.cat_icon,
      coverImageURI: item.cover_image,
      classID: this.state.classID,
      className: this.state.className,
      categoryName: item.cat_name,
      prority: item.prority,
      description: item.description !== null ? item.description : "",
      scientificName: item.scientificName !== null ? item.scientificName : "",
      assignedTags: item?.tags,
    });
  };

  checkAddActionPermissions = () => {
    if (this.state.isLoading == false) {
      if (this.context.userDetails.action_types.includes("Add")) {
        return this.gotoAddCategory;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  checkEditActionPermissions = (item) => {
    if (this.context.userDetails.action_types.includes("Edit")) {
      this.gotoEditCategory(item);
    }
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
    console.log(parsedData);
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

  toggleShowTags = () => this.setState({ showTags: !this.state.showTags });

  renderCategoryItem = ({ item }) => {
    // console.log("cat nameeee" ,item.total_sub_cat,item.cat_name)
    return (
      <TouchableHighlight
        underlayColor={"#eee"}
        onLongPress={this.checkEditActionPermissions.bind(this, item)}
        // onPress={this.gotoSubCategoryList.bind(this, item)}
        onPress={
          item.total_sub_cat > 0
            ? this.gotoSubCategoryList.bind(this, item)
            : this.gotoCommonNameList.bind(this, item)
        }
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
            <Text style={styles.name}>{`${capitalize(item.cat_name)}`}</Text>
            <Text>
              {item.scientificName?.length > 0 ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    color: Colors.textColor,
                  }}
                >{`( ${capitalize(item.scientificName)} )`}</Text>
              ) : null}
            </Text>

            {this.state.showTags && (
              <View
                style={{
                  marginRight: 10,
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {item.tags?.map((element) => (
                  <View
                    key={element.id.toString()}
                    // onLongPress={() => {
                    //   Alert.alert("", "Do you want to remove the tag?", [
                    //     {
                    //       text: "Yes",
                    //       onPress: () => deleteTagHandler(element),
                    //       style: "cancel",
                    //     },
                    //     { text: "No", onPress: () => "" },
                    //   ]);
                    // }}
                    style={{
                      height: 32,
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      marginHorizontal: 3,
                      marginVertical: 5,
                      borderRadius: 2,
                      backgroundColor: Colors.white,
                      borderColor: Colors.primary,
                      borderWidth: 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Image
                      style={{ height: 25, width: 25, marginRight: 10 }}
                      source={{ uri: element.tag_icon }}
                    />
                    <Text style={{ fontSize: 15, color: Colors.primary }}>
                      {element.tag_name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* <Text style={[styles.name,{fontSize: 12}]}>{`M - ${item.total_male_animal}, F - ${item.total_female_animal}`}</Text> */}
          </View>
          {this.context.userDetails.action_types.includes(
            Configs.USER_ACTION_TYPES_CHECKING.stats
          ) ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <View style={styles.qtyContainer}>
                {/* <Text style={styles.qty}>{item.total_common_name}</Text> */}
                <Text style={styles.qty}>{item.total_animal}</Text>
              </View>
              {/* <Ionicons name="chevron-forward" style={styles.iconStyle} /> */}
            </View>
          ) : null}
        </View>
      </TouchableHighlight>
    );
  };

  gotoAddCategory = () => {
    this.props.navigation.navigate("Add Category", {
      classID: this.state.classID,
      className: this.state.className,
    });
  };

  _renderItem = ({ item, index }, parallaxProps) => {
    return (
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
          {/* <Image style={styles.sliderImage} source={{ uri: item.cover_image }} resizeMode="cover" /> */}
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 2,
            backgroundColor: "rgba(0,0,0,0.3)",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingHorizontal: 10,
            borderRadius: 2,
            right: 0,
          }}
        >
          <View>
            <Text
              style={{ fontSize: 16, paddingVertical: 5, color: Colors.white }}
            >{`${item.cat_name}`}</Text>
          </View>
          {/* <View>
						<Text>{item.description.slice(0, 50)}</Text>
					</View> */}
        </View>
      </View>
    );
  };

  render = () => {
    // const carouselItems = this.state.coverPhotos.map((x)=>{
    // 	if(x.cover_image==null){
    // 		return null
    // 	}else{
    // 	return (
    // 		// x.cover_image
    // 	  {
    // 		id: x.id,
    // 		common_name: x.cat_name,
    // 		cover_image:x.cover_image,
    // 	  }
    // 	)
    // 	}
    //   })
    

    return (
      <Container>
        <Header
          title={
            typeof this.state.className !== "undefined"
              ? this.state.className
              : "Categories"
          }
          //  showScanButton={this.state.isLoading ? undefined : true}

          searchAction={this.state.isLoading ? undefined : this.openSearchModal}
          addAction={this.checkAddActionPermissions()}
          tagShowAction={this.toggleShowTags}
        />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            <View style={styles.carouselConatainer}>
              {/* <Carousel
							layout={'default'}
							inactiveSlideOpacity={0.6}
							inactiveSlideScale={0.65}
							firstItem={0}
							sliderWidth={SLIDER_WIDTH}
							itemWidth={ITEM_WIDTH}
							data={this.state.coverPhotos}
							renderItem={this._renderItem}
							containerCustomStyle={{ overflow: 'hidden' }}
							contentContainerCustomStyle={{ overflow: 'hidden' }}
							lockScrollWhileSnapping={true}
							activeAnimationType={'timing'}
							activeSlideAlignment={'center'}
							autoplay
							loop
						/> */}
              <SliderBox
                images={this.state.coverPhotos}
                firstItem={0}
                sliderBoxHeight={ITEM_HEIGHT}
                parentWidth={SLIDER_WIDTH}
                ImageComponentStyle={{
                  borderRadius: 2,
                  width: "99.25%",
                  marginTop: 2,
                }}
                paginationBoxVerticalPadding={20}
                autoplay
                circleLoop
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
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => <ListEmpty />}
              data={this.state.categories}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={this.renderCategoryItem}
              initialNumToRender={this.state.categories.length}
              refreshing={this.state.isLoading}
              onRefresh={this.handelRefresh}
              contentContainerStyle={
                this.state.categories.length === 0 ? styles.container_category : null
              }
            />
          </>
        )}
        {/* Scannr button */}
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
          navigation={this.props.navigation}
        />
        
      </Container>
      
    );
  };
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
    alignItems: "center",
    justifyContent: "center",
  },
  sliderImage: {
    height: ITEM_HEIGHT,
    width: ITEM_WIDTH,
  },
  carouselConatainer: {
    marginBottom: 5,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 1,
    height: ITEM_HEIGHT,
  },
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
    // backgroundColor: Colors.white,
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
