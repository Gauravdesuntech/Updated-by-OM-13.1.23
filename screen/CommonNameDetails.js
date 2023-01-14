import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
// import Svg, { Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as mime from "react-native-mime-types";
import ImageView from "react-native-image-viewing";
import { Video } from "expo-av";
import { Colors, Configs } from "../config";
import {
  Header,
  AnimalIdentificationTypeModal,
  ConfirmDialog,
} from "../component";
import OverlayLoader from "../component/OverlayLoader";
import { getFileData, capitalize } from "../utils/Util";
import {
  getCommonNameDetails,
  getAnimalsCount,
  getGalleryData,
  getCommonNameInfo,
  changeCommonNameCoverImage,
  delteCommonNameGalleryItem,
  exportCommonName,
} from "../services/APIServices";
import { fetchProfile } from "../services/UserManagementServices";
import AppContext from "../context/AppContext";
import * as WebBrowser from "expo-web-browser";
import Carousel from "react-native-snap-carousel";
import DownloadFile from "../component/DownloadFile";
import { SliderBox } from "react-native-image-slider-box";
import CachedImage from "expo-cached-image";
import globalStyles from "../config/Styles";
import styles from './Styles'


const windowHeight = Dimensions.get("window").height;
// const windowWidth = Dimensions.get("window").width;
const windowWidth = Dimensions.get("window").width;
const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDE_WIDTH = Math.round((SLIDER_WIDTH * 98) / 100);
const itemHorizontalMargin = (2 * SLIDER_WIDTH) / 100;
const ITEM_WIDTH = SLIDE_WIDTH + itemHorizontalMargin * 2;
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 2) / 3.1);

export default class CommonNameDetails extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      commonNameID:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.commonNameID
          : undefined,
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
      coverImageUri:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.coverImageUri
          : undefined,
      commonName:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.commonName
          : undefined,
      scientificName:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.scientificName
          : undefined,
      description:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.description
          : null,
      funfacts: null,
      taxonid:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.taxonid
          : "",
      databaseName:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.databaseName
          : undefined,
      totalAnimals: 0,
      totalEnclosures: 0,
      totalSections: 0,
      totalFemaleAnimal: 0,
      totalMaleAnimal: 0,
      totalInfants: 0,
      totalUnknownAnimals: 0,
      isLoading: true,
      isImportDataSet: false,
      totalIndividualAnimals: undefined,
      totalGroupAnimals: undefined,
      gallery: [],
      commonImages: [],
      selectedGalleryImageIndex: 0,
      selectedGalleryItemID: undefined,
      isGalleryImageViewerOpen: false,
      isUploadModalOpen: false,
      isUploading: true,
      uploadProgress: undefined,
      xhrRequest: undefined,
      showOverlayLoader: false,
      isPlaybackModalOpen: false,
      playbackURI: undefined,
      streamURI: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
      isImportModalOpen: false,
      isImporting: false,
      importData: null,
      activeTabKey: undefined,
      isAnimalAddModalOpen: false,
      isMediaExcelUploadModalOpen: false,
      isConfirmDialogOpen: false,
      exportCommonNameProcess: "Loading",
      isFileSaved: false,
      isModalOpen: false,
      isStramModeOpen: false,
      height: "",
      width: "",
      downloadUrl: "",
      isAnimalEditModalOpen: false,
    };

    this.idetificationTypeModalRef = React.createRef();
    this.maleIdetificationTypeModalRef = React.createRef();
    this.femaleIdetificationTypeModalRef = React.createRef();
    this.infantsIdetificationTypeModalRef = React.createRef();

    // console.log(props)
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
        isImportDataSet: false,
      },
      () => {
        this.loadInfo();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
    // this._renderItem();
  };

  gotoTabDetails = () => {
    this.props.navigation.navigate("CommonNameTabDetails", {
      commonNameID: this.state.commonNameID,
      classID: this.state.classID,
      categoryID: this.state.categoryID,
      subCategoryID: this.state.subCategoryID,
      imageUri: this.state.image,
      coverImageUri: this.state.coverImageUri,
      commonName: this.state.commonName,
      scientificName: this.state.scientificName,
      description: this.state.description,
      taxonid: this.state.taxonid !== null ? this.state.taxonid : "",
      databaseName:
        this.state.databaseName !== null ? this.state.databaseName : undefined,
    });
  };

  loadInfo = () => {
    let userid = this.context.userDetails.id;
    let { commonNameID, commonName } = this.state;
    Promise.all([
      getCommonNameDetails(commonName),
      getAnimalsCount(commonName),
      getGalleryData(commonNameID),
      getCommonNameInfo(commonNameID),
      fetchProfile({ userid }),
    ])
      .then((response) => {
        let data = response[0];
        this.context.setUserData(response[4].data);
        this.setState({
          isLoading: false,
          commonNameID: data.id,
          classID: data.animal_class,
          categoryID: data.category,
          subCategoryID:
            data.sub_category !== null ? data.sub_category : undefined,
          commonName: data.common_name,
          scientificName: data.scientific_name,
          coverImageUri: data.cover_image,
          description: data.description,
          funfacts: data.fun_facts,
          taxonid: data.taxonid !== null ? data.taxonid : "",
          databaseName:
            data.database_name !== null ? data.database_name : undefined,
          totalAnimals: data.total_animals,
          totalUndetermined: data.total_undetermined_animals,
          totalIndeterminate: data.total_indeterminate_animals,
          totalMaleAnimal: data.total_male_animals,
          totalFemaleAnimal: data.total_female_animals,
          totalInfants: data.total_infants,
          totalUnknownAnimals: data.total_unknown_animals,
          totalEnclosures: data.total_enclosures,
          totalSections: data.total_sections,
          totalIndividualAnimals: response[1].individual_animals,
          totalGroupAnimals: response[1].group_animals,
          gallery: response[2],
          isImportDataSet: true,
          importData: response[3],
        });
        this.combineImages();
        // console.log("Response>>>>>>>>>>>>>>>",response[0])
        // this._renderItem();
        // this._renderItem()
      })
      .catch((error) => console.log(error));
  };

  getImageSize = async (uri) =>
    new Promise((resolve) => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  combineImages = async () => {
    let { gallery, coverImageUri } = this.state;
    let coverImageUriArr = [coverImageUri];
    let galleryArr = [];
    let imageDimension = 0;
    for (const item of gallery) {
      imageDimension = await this.getImageSize(item.attachment);
      if (
        imageDimension[0] >= imageDimension[1] &&
        item.attachment_type === "image"
      ) {
        coverImageUriArr.push(item.attachment);
      }
    }
    let filteredImages = coverImageUriArr.map((x, index) => {
      if (x) {
        return {
          id: this.state.commonName + index + 1,
          name: false,
          cover_image: x,
        };
      }
    });
    // console.log("filteredImages?>>>>>>>>>>>",filteredImages);
    this.setState({
      commonImages: filteredImages,
    });
  };

  gotoBack = () => this.props.navigation.goBack();

  getGalleryImages = () => {
    let { gallery, coverImageUri } = this.state;
    let data = (gallery || []).map((item) => {
      if (item.attachment_type === "image") {
        return {
          id: item.id,
          uri: item.attachment,
        };
      }
    });
    return data;
  };

  openItemRemoveDialog = (id) =>
    this.setState({
      isConfirmDialogOpen: true,
      selectedGalleryItemID: id,
    });

  closeItemRemoveDialog = () =>
    this.setState({
      isConfirmDialogOpen: false,
      selectedGalleryItemID: undefined,
    });

  removeGalleryItem = () => {
    let { selectedGalleryItemID, gallery } = this.state;

    if (typeof selectedGalleryItemID !== "undefined") {
      this.setState({ showOverlayLoader: true });

      delteCommonNameGalleryItem(selectedGalleryItemID)
        .then((response) => {
          if (response.check === Configs.SUCCESS_TYPE) {
            let galleryData = gallery.filter(
              (item) => item.id !== selectedGalleryItemID
            );

            this.setState({
              showOverlayLoader: false,
              isConfirmDialogOpen: false,
              selectedGalleryItemID: undefined,
              gallery: galleryData,
            });
          } else {
            this.setState(
              {
                showOverlayLoader: false,
                isConfirmDialogOpen: false,
                selectedGalleryItemID: undefined,
              },
              () => {
                alert(response.message);
              }
            );
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            showOverlayLoader: false,
            isConfirmDialogOpen: false,
            selectedGalleryItemID: undefined,
          });
        });
    }
  };

  openGalleryImageViewer = (id) => {
    let galleryImages = this.getGalleryImages();
    let index = galleryImages.findIndex((item) => item.id === id);

    this.setState({
      selectedGalleryImageIndex: index > -1 ? index : 0,
      isGalleryImageViewerOpen: true,
    });
  };

  closeGalleryImageViewer = () =>
    this.setState({
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
    });

  changeCoverImage = () => {
    //Removed aspect: [17, 4], from options
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({ showOverlayLoader: true });
            let obj = {
              id: this.state.commonNameID,
              cover_image: getFileData(result),
            };

            changeCommonNameCoverImage(obj)
              .then((response) => {
                if (response.check === Configs.SUCCESS_TYPE) {
                  this.setState({
                    showOverlayLoader: false,
                    coverImageUri: response.data.cover_image,
                  });
                } else {
                  this.setState({ showOverlayLoader: false });
                  Alert.alert(response.message);
                }
              })
              .catch((error) => console.log(error));
          }
        });
      } else {
        Alert.alert("Please allow permission to choose an icon");
      }
    });
  };

  gotoAddAnimal = () => {
    this.setState(
      {
        isAnimalAddModalOpen: false,
      },
      () => {
        this.context.setAnimalID(undefined);
        this.props.navigation.navigate("Animals", {
          id: 0,
          classID: this.state.classID,
          categoryID: this.state.categoryID,
          subCategoryID: this.state.subCategoryID,
          animalType: Configs.ANIMAL_TYPE_INDIVIDUAL,
          commonName: this.state.commonName,
          scientificName: this.state.scientificName,
          databaseName: this.state.databaseName,
          taxonid: this.state.taxonid,
        });
      }
    );
  };

  gotoGenerateExcel = () => {
    this.setState(
      {
        isAnimalAddModalOpen: false,
      },
      () => {
        this.props.navigation.navigate("GenerateExcel", {
          classID: this.state.classID,
          categoryID: this.state.categoryID,
          subCategoryID: this.state.subCategoryID,
          scientificName: this.state.scientificName,
          commonName: this.state.commonName,
          databaseName: this.state.databaseName,
          taxonid: this.state.taxonid,
        });
      }
    );
  };

  gotoUploadExcel = () => {
    this.setState(
      {
        isAnimalAddModalOpen: false,
      },
      () => {
        this.props.navigation.navigate("UploadExcel");
      }
    );
  };

  gotoCommonNameEnclosures = () => {
    this.props.navigation.navigate("CommonNameEnclosures", {
      commonName: this.state.commonName,
    });
  };

  gotoCommonNameSections = () => {
    this.props.navigation.navigate("CommonNameSections", {
      commonName: this.state.commonName,
    });
  };

  openIdentificationTypeModal = () =>
    this.idetificationTypeModalRef.current.openModal();

  openMaleIdentificationTypeModal = () =>
    this.maleIdetificationTypeModalRef.current.openModal();

  openFemaleIdentificationTypeModal = () =>
    this.femaleIdetificationTypeModalRef.current.openModal();

  openInfantsIdentificationTypeModal = () =>
    this.infantsIdetificationTypeModalRef.current.openModal();

  toggleAnimalAddModal = () =>
    this.setState({ isAnimalAddModalOpen: !this.state.isAnimalAddModalOpen });

  toggleAnimalEditModal = () =>
    this.setState({ isAnimalEditModalOpen: !this.state.isAnimalEditModalOpen });

  toggleMediaExcelUploadModal = () =>
    this.setState({
      isMediaExcelUploadModalOpen: !this.state.isMediaExcelUploadModalOpen,
    });

  uploadMedia = () => {
    //close modal
    this.toggleMediaExcelUploadModal();

    let options = {
      type: "*/*",
      multiple: true,
      copyToCacheDirectory: true,
    };
    DocumentPicker.getDocumentAsync(options)
      .then((res) => {
        if (res.type === "success") {
          let mimeType = mime.lookup(res.name);

          if (mimeType.includes("image") || mimeType.includes("video")) {
            this.setState(
              {
                isUploadModalOpen: true,
                isUploading: true,
              },
              () => {
                let formData = new FormData();
                formData.append("common_name_id", this.state.commonNameID);
                formData.append("attachment", {
                  uri: res.uri,
                  name: res.name,
                  type: mime.lookup(res.name),
                });

                let xhr = new XMLHttpRequest();
                xhr.open("POST", Configs.BASE_URL + "add_to_gallery/");

                // upload progress event
                xhr.upload.addEventListener("progress", (e) => {
                  let percent_complete = Math.floor((e.loaded / e.total) * 100);
                  this.setState({
                    uploadProgress: percent_complete,
                    isUploading: percent_complete !== 100,
                  });
                });

                xhr.addEventListener("readystatechange", () => {
                  if (xhr.readyState === 4 && !xhr._aborted) {
                    let response = JSON.parse(xhr.responseText);
                    let gallery = this.state.gallery;
                    if (gallery.length > 0) {
                      gallery.unshift(response.data);
                    } else {
                      gallery.push(response.data);
                    }
                    this.setState({
                      gallery: gallery,
                    });
                  }
                });

                // AJAX request finished event
                xhr.addEventListener("load", (e) => {
                  this.setState({
                    isUploading: true,
                    isUploadModalOpen: false,
                    uploadProgress: undefined,
                    xhrRequest: undefined,
                  });
                });

                // set header
                xhr.setRequestHeader("Content-Type", "multipart/form-data");

                // send POST request to server side script
                xhr.send(formData);
                this.setState({ xhrRequest: xhr });
              }
            );
          } else {
            alert("Only accept image or video file");
          }
        }
      })
      .catch((error) => console.log(error));
  };

  abortUpload = () => {
    this.state.xhrRequest.abort();
    this.setState({
      isUploadModalOpen: false,
      isUploading: true,
      uploadProgress: undefined,
      xhrRequest: undefined,
    });
  };

  closeModal = () => {
    this.setState(
      {
        isModalOpen: false,
        isFileSaved: false,
        exportCommonNameProcess: "Processing...",
      },
      () => {
        this.gotoBack();
      }
    );
  };

  openPlaybackModal = (uri) =>
    this.setState({
      isPlaybackModalOpen: true,
      playbackURI: uri,
    });

  closePlaybackModal = () =>
    this.setState({
      isPlaybackModalOpen: false,
      playbackURI: undefined,
    });

  openStreamModal = (uri) =>
    this.setState({
      isStramModeOpen: true,
    });

  closeStreamModal = () =>
    this.setState({
      isStramModeOpen: false,
      streamURI: undefined,
    });

  importCommonNameData = () => {
    //close modal
    this.toggleMediaExcelUploadModal();

    let options = {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      multiple: false,
    };

    DocumentPicker.getDocumentAsync(options)
      .then((res) => {
        if (res.type === "success") {
          this.setState(
            {
              isImportModalOpen: true,
              isImporting: false,
            },
            () => {
              let formData = new FormData();
              formData.append("common_name_id", this.state.commonNameID);
              formData.append("excel_file", {
                uri: res.uri,
                name: res.name,
                type: mime.lookup(res.name),
              });

              let xhr = new XMLHttpRequest();
              xhr.open("POST", Configs.BASE_URL + "import_common_name_info/");

              // upload progress event
              xhr.upload.addEventListener("progress", (e) => {
                let percent_complete = Math.floor((e.loaded / e.total) * 100);
                this.setState({
                  isImporting: percent_complete === 100,
                });
              });

              xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4 && !xhr._aborted) {
                  let response = JSON.parse(xhr.responseText);

                  if (response.check === Configs.SUCCESS_TYPE) {
                    this.setState({ importData: response.data });
                  } else {
                    Alert.alert(response.message);
                  }
                }
              });

              // AJAX request finished event
              xhr.addEventListener("load", (e) => {
                this.setState({
                  isImportModalOpen: false,
                  isImporting: false,
                });
              });

              // set header
              xhr.setRequestHeader("Content-Type", "multipart/form-data");

              // send POST request to server side script
              xhr.send(formData);
              this.setState({ xhrRequest: xhr });
            }
          );
        }
      })
      .catch((error) => console.log(error));
  };

  exportCommonName = () => {
    const { commonName } = this.state;
    exportCommonName(commonName)
      .then((response) => {
        let data = response.data;
        this.setState({
          downloadUrl: data.fileuri,
          isModalOpen: true,
        });
      })
      .catch((error) => console.log(error));
  };

  downloadFile = (fileName, fileUri) => {
    let documentDirectory = FileSystem.documentDirectory + fileName;

    FileSystem.downloadAsync(fileUri, documentDirectory)
      .then(({ uri }) => {
        this.saveFile(uri);
      })
      .catch((error) => console.log(error));
  };

  saveFile = async (fileUri) => {
    const imageResult = await ImagePicker.getMediaLibraryPermissionsAsync();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // const persmissionAsk = await MediaLibrary.requestPermissionsAsync();

    // console.log("persmissionAsk of media library", imageResult, "getpersmissionAsk---", status)
    // return;
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("ZooApp", asset, false);
      this.setState({ isFileSaved: true });
    } else {
      alert("Please grant the permission");
    }
  };

  setActiveTabKey = (key) => {
    this.setState({ activeTabKey: key });
  };

  gotoAnimalList = (type, gender) => {
    this.props.navigation.navigate("AnimalsList", {
      commonName: this.state.commonName,
      enclosureID: this.state.enclosureID,
      identificationType: type,
      gender: gender,
    });
  };

  renderIntitialInfo = () => {
    return (
      <>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            this.state.gallery.length > 0 ? styles.galleryContainer : null
          }
        >
          {this.state.gallery.map((item) =>
            item.attachment_type === "image" ? (
              <TouchableOpacity
                key={item.id}
                activeOpacity={1}
                style={{ marginHorizontal: 4 }}
                onPress={this.openGalleryImageViewer.bind(this, item.id)}
                onLongPress={this.openItemRemoveDialog.bind(this, item.id)}
              >
                <Image
                  source={{ uri: item.attachment }}
                  // cacheKey={`${item.attachment.split('.')[1].split('/')[6]}-thumb`}
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
                  style={styles.imageGrid}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                style={styles.videoGrid}
                onPress={this.openPlaybackModal.bind(this, item.attachment)}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={60}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )
          )}
        </ScrollView>
        {/*<View style={{ paddingHorizontal: 8, paddingTop: 15 }}>
				<View style={styles.infoRow}>
					<View style={styles.w50}>
						<Text style={styles.infoTitle}>Origin</Text>
					</View>
					<View style={styles.w50}>
						<Text style={styles.infoDesc}>India</Text>
					</View>
				</View>
				<View style={styles.infoRow}>
					<View style={styles.w50}>
						<Text style={styles.infoTitle}>Size</Text>
					</View>
					<View style={styles.w50}>
						<Text style={styles.infoDesc}>16 - 18 cm</Text>
					</View>
				</View>
				<View style={styles.infoRow}>
					<View style={styles.w50}>
						<Text style={styles.infoTitle}>Weight</Text>
					</View>
					<View style={styles.w50}>
						<Text style={styles.infoDesc}>90 - 100 g</Text>
					</View>
				</View>
				<View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
					<View style={styles.w50}>
						<Text style={styles.infoTitle}>Lifespan</Text>
					</View>
					<View style={styles.w50}>
						<Text style={styles.infoDesc}>5 Years</Text>
					</View>
				</View>
					</View> */}
      </>
    );
  };

  renderTabData = () => {
    let { importData, activeTabKey } = this.state;
    if (importData === null) {
      return null;
    } else if (activeTabKey === "diet") {
      return (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 50,
              marginTop: 15,
            }}
          >
            {["S", "M", "T", "W", "T", "F", "S"].map((v, i) => (
              <TouchableOpacity
                key={v + "_" + i.toString()}
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: i === 0 ? "#444" : Colors.mediumGrey,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: Colors.white, fontSize: 12 }}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 50,
              marginTop: 10,
            }}
          >
            {["Breakfast", "Lunch", "Dinner", "Brunch"].map((v, i) => (
              <TouchableOpacity
                key={v}
                style={{
                  minWidth: 70,
                  height: 20,
                  backgroundColor: i === 0 ? "#fff280" : "#fffcdf",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 1,
                }}
              >
                <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ paddingHorizontal: 8, marginTop: 10 }}>
            <Text style={{ fontSize: 14, color: Colors.textColor }}>
              Fruits
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 3,
                marginBottom: 5,
              }}
            >
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/1.png")}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/2.png")}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/3.png")}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={{ fontSize: 14, color: Colors.textColor }}>Nuts</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 3,
                marginBottom: 10,
              }}
            >
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/4.png")}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/5.png")}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.imageBox} />
            </View>

            <Text style={{ fontSize: 14, color: Colors.textColor }}>
              Veggie
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 3,
                marginBottom: 5,
              }}
            >
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/6.png")}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/7.png")}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.imageBox}>
                <Image
                  style={{ height: 40, width: 40 }}
                  source={require("../assets/image/tab-icons/2/8.png")}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={{ fontSize: 14, color: Colors.textColor }}>
              Suppliements
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 3,
              }}
            >
              <View style={styles.imageBox} />
              <View style={styles.imageBox} />
              <View style={styles.imageBox} />
            </View>
          </View>
        </>
      );
    } else if (activeTabKey === "housing") {
      return (
        <View style={{ paddingHorizontal: 8, marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/1.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>(Sunlight / UV)</Text>
              <Text style={styles.housingImgSubText}>10 - 12 hrs</Text>
            </View>
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/2.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>Tempareture</Text>
              <Text style={styles.housingImgSubText}>18 - 22</Text>
            </View>
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/3.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>Humidity</Text>
              <Text style={styles.housingImgSubText}>40 - 60%</Text>
            </View>
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/4.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>Windflow</Text>
              <Text style={styles.housingImgSubText}>(away from draft)</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/5.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>Safety</Text>
              <Text style={styles.housingImgSubText}>(Predator proof)</Text>
            </View>
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/6.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>Hygiene</Text>
              <Text style={styles.housingImgSubText}>Easy to Clean</Text>
            </View>
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/7.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>Non Toxic</Text>
              <Text style={styles.housingImgSubText}>Materials/Paint</Text>
            </View>
            <View style={styles.housingGrid}>
              <View style={styles.housingImgBox}>
                <Image
                  style={styles.housingImage}
                  source={require("../assets/image/tab-icons/3/8.png")}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.housingImgTitle}>Good Drainage</Text>
              <Text style={styles.housingImgSubText}>System</Text>
            </View>
          </View>
          <Text
            style={{
              color: Colors.textColor,
              fontSize: 12,
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            {"Housing Size"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#f0f0f0",
              paddingVertical: 5,
            }}
          >
            <View style={{ flex: 1 }} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                Minimum Size
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                Bar Spacing
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                Cage
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                24" x 24" x 36"
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                18 - 24mm
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                Avairy
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                10ft x 10ft x 10ft
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ color: Colors.textColor, fontSize: 12 }}>
                18 - 24mm
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: Colors.textColor,
              fontSize: 12,
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            {"Nesting Type & Size"}
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <Image
              style={{ width: 90, height: 90 }}
              source={require("../assets/image/tab-icons/3/nesting.png")}
              resizeMode="contain"
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ paddingHorizontal: 8, paddingTop: 15 }}>
          {this.state.importData[activeTabKey].map((item) => (
            <View key={item.id} style={styles.infoRow}>
              <View style={styles.w50}>
                <Text style={styles.infoTitle}>{item.title}</Text>
              </View>
              <View style={styles.w50}>
                <Text style={styles.infoDesc}>{item.desc.toString()}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    }
  };

  checkAddActionPermissions = () => {
    if (this.state.isLoading == false) {
      if (this.context.userDetails.action_types.includes("Add")) {
        return this.toggleAnimalAddModal;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  checkEditActionPermissions = (item) => {
    if (this.state.isLoading == false) {
      if (this.context.userDetails.action_types.includes("Add")) {
        return this.toggleAnimalEditModal;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };
  // slider images
  _renderItem = ({ item, index }) => {
    // console.log("Image",item)

    return (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
        }}
      >
        <View key={index.toString()} style={styles.slide}>
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
      </View>
    );
  };

  render = () => {
    return (
      <Container>
        <Header
          // title={this.state.commonName}
          title={""}
          addAction={this.checkAddActionPermissions()}
          editAction={this.checkEditActionPermissions()}
          exportCommonName={
            this.state.isLoading ? undefined : this.exportCommonName
          }
          // cameraAction={this.state.isLoading ? undefined : this.openStreamModal}
        />
        <View style={styles.container_commonName}>
          <View style={{ width: windowWidth }}>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.coverImageUri === null
                  ? styles.noCoverImage
                  : { width: "100%", height: 250 }
              }
            >
              {this.state.coverImageUri === null ? (
                <Ionicons name="image" size={80} color={Colors.white} />
              ) : (
                <View style={[styles.carouselConatainer]}>
                  {/* <Carousel

									layout={'default'}
									inactiveSlideOpacity={0.6}
									inactiveSlideScale={0.65}
									firstItem={0}
									sliderWidth={SLIDER_WIDTH}
									itemWidth={ITEM_WIDTH}
									data={this.state.commonImages}
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
                    images={this.state.commonImages}
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
                // <Image
                // 	style={{ width: windowWidth, height: 250 }}
                // 	source={{ uri: this.state.coverImageUri }}
                // 	resizeMode="cover"
                // />
              )}
            </TouchableOpacity>
            {this.context.userDetails.action_types.includes(
              Configs.USER_ACTION_TYPES_CHECKING.stats
            ) ? (
              <>
                <View style={styles.countContainerLeft}>
                  <TouchableOpacity
                    style={[styles.countTextBtn, { alignSelf: "flex-start" }]}
                    onPress={
                      parseInt(this.state.totalEnclosures) > 0
                        ? this.gotoCommonNameEnclosures
                        : undefined
                    }
                  >
                    <Text style={styles.countText}>
                      {"Enclosures - "}
                      {this.state.isLoading ? (
                        <ActivityIndicator size={12} color={Colors.white} />
                      ) : (
                        this.state.totalEnclosures
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.countTextBtn, { alignSelf: "flex-start" }]}
                    onPress={
                      parseInt(this.state.totalSections) > 0
                        ? this.gotoCommonNameSections
                        : undefined
                    }
                  >
                    <Text style={styles.countText}>
                      {"Sections - "}
                      {this.state.isLoading ? (
                        <ActivityIndicator size={12} color={Colors.white} />
                      ) : (
                        this.state.totalSections
                      )}
                    </Text>
                  </TouchableOpacity>
                  {this.state.isLoading ? (
                    <ActivityIndicator size={12} color={Colors.white} />
                  ) : (
                    <>
                      {this.state.totalInfants > 0 ? (
                        <TouchableOpacity
                          onPress={this.openInfantsIdentificationTypeModal}
                          style={[
                            styles.countTextBtn,
                            { alignSelf: "flex-start" },
                          ]}
                        >
                          <Text style={styles.countText}>
                            {`Infants - ${this.state.totalInfants}`}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                </View>

                <View style={styles.countContainerRight}>
                  <View>
                    {this.state.totalMaleAnimal == 0 ? null : (
                      <TouchableOpacity
                        onPress={this.openMaleIdentificationTypeModal}
                        style={styles.countTextBtn}
                      >
                        <Text style={styles.countText}>
                          {"Male - "}
                          {this.state.isLoading ? (
                            <ActivityIndicator size={12} color={Colors.white} />
                          ) : (
                            this.state.totalMaleAnimal
                          )}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {this.state.totalFemaleAnimal == 0 ? null : (
                      <TouchableOpacity
                        onPress={this.openFemaleIdentificationTypeModal}
                        style={styles.countTextBtn}
                      >
                        <Text style={styles.countText}>
                          {"Female  - "}
                          {this.state.isLoading ? (
                            <ActivityIndicator size={12} color={Colors.white} />
                          ) : (
                            this.state.totalFemaleAnimal
                          )}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {this.state.totalUndetermined == 0 ? null : (
                      <TouchableOpacity
                        // onPress={this.openFemaleIdentificationTypeModal}
                        style={styles.countTextBtn}
                      >
                        <Text style={styles.countText}>
                          {"UD - "}
                          {this.state.isLoading ? (
                            <ActivityIndicator size={12} color={Colors.white} />
                          ) : (
                            this.state.totalUndetermined ?? 0
                          )}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {this.state.totalIndeterminate == 0 ? null : (
                      <TouchableOpacity
                        // onPress={this.openFemaleIdentificationTypeModal}
                        style={styles.countTextBtn}
                      >
                        <Text style={styles.countText}>
                          {"ID - "}
                          {this.state.isLoading ? (
                            <ActivityIndicator size={12} color={Colors.white} />
                          ) : (
                            this.state.totalIndeterminate ?? 0
                          )}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={this.gotoAnimalList.bind(
                        this,
                        "total",
                        this.props.gender
                      )}
                      style={styles.countTextBtn}
                    >
                      <Text style={styles.countText}>
                        {"Total - "}
                        {this.state.isLoading ? (
                          <ActivityIndicator size={12} color={Colors.white} />
                        ) : (
                          this.state.totalAnimals
                        )}
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
								onPress={this.openInfantsIdentificationTypeModal}
								style={styles.countTextBtn}
							>
							
								<Text style={styles.countText}>
									{"Infants - "}
									{this.state.isLoading ? (
										<ActivityIndicator size={12} color={Colors.white} />
									) : (
										this.state.totalInfants
									)}
								</Text>
							</TouchableOpacity> */}
                  </View>
                </View>
              </>
            ) : null}
          </View>
          {/* <View style={styles.svgContainer}>
					<Svg
						viewBox="0 0 500 150"
						preserveAspectRatio="none"
						height={150}
						width={"100%"}
					>
						<Path
							d="M0.28,76.47 C175.78,53.78 272.29,152.45 499.72,120.88 L500.00,150.00 L0.00,150.00 Z"
							fill={Colors.white}
							stroke={Colors.white}
						/>
					</Svg>
					<TouchableOpacity
						activeOpacity={1}
						onPress={this.changeProfileImage}
						style={styles.avatarContainer}
					>
						<Image
							style={styles.image}
							source={{ uri: this.state.imageUri }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<View style={styles.countContainer}>
						<TouchableOpacity
							onPress={this.toggleAnimalCountModal}
							style={{ flexDirection: "row", alignSelf: "flex-end" }}
						>
							<Text style={styles.countText}>
								{"Count - "}
								{this.state.isLoading ? (
									<ActivityIndicator size={12} color={Colors.white} />
								) : (
									this.state.totalAnimals
								)}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{ flexDirection: "row", alignSelf: "flex-end" }}
							onPress={
								parseInt(this.state.totalEnclosures) > 0
									? this.gotoCommonNameSections.bind(this, undefined)
									: undefined
							}
						>
							<Text style={styles.countText}>
								{"Enclosures - "}
								{this.state.isLoading ? (
									<ActivityIndicator size={12} color={Colors.white} />
								) : (
									this.state.totalEnclosures
								)}
							</Text>
						</TouchableOpacity>
					</View>
				</View> */}

          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 9 }}
          >
            <View style={{ width: "100%", paddingHorizontal: 8 }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.gotoTabDetails}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.commonName}
                >
                  {typeof this.state.commonName !== "undefined"
                    ? capitalize(this.state.commonName)
                    : null}
                </Text>
              </TouchableOpacity>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.scientificName}
              >
                {typeof this.state.scientificName !== "undefined"
                  ? capitalize(this.state.scientificName)
                  : null}
              </Text>

              {typeof this.state.activeTabKey === "undefined" ? (
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  style={{ height: 80 }}
                >
                  <Text style={styles.descriptionText}>
                    {this.state.description}
                  </Text>
                </ScrollView>
              ) : null}
            </View>

            {this.state.isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.textColor,
                    opacity: 0.8,
                  }}
                >
                  Loading...
                </Text>
              </View>
            ) : (
              <>
                {typeof this.state.activeTabKey === "undefined"
                  ? this.renderIntitialInfo()
                  : this.renderTabData()}
                <View style={styles.funFactsContainer}>
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
                      {this.state.funfacts !== null
                        ? this.state.funfacts
                        : "No data found!"}
                    </Text>
                  </View>
                </View>

                {/* {this.state.isImportDataSet ? (
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={this.toggleMediaExcelUploadModal}
									style={styles.uploadBtn}
								>
									<Text style={{ color: Colors.white, fontSize: 18 }}>
										Upload
									</Text>
								</TouchableOpacity>
							) : null} */}
              </>
            )}
          </ScrollView>
        </View>

        {/*Animal Add Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isAnimalAddModalOpen}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.animalCountBtn}
                onPress={this.gotoAddAnimal}
              >
                <Feather name="plus-circle" size={20} color={Colors.white} />
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Individual Entry
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.animalCountBtn}
                onPress={this.gotoGenerateExcel}
              >
                <Feather name="download" size={20} color={Colors.white} />
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Generate Bulk Format
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.animalCountBtn]}
                onPress={this.gotoUploadExcel}
              >
                <Feather name="upload" size={20} color={Colors.white} />
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Upload Bulk Data
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.toggleAnimalAddModal}
              >
                <Ionicons name="close-outline" style={styles.closeButtonText} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Animal Add Upload Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isAnimalEditModalOpen}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.animalCountBtn}
                onPress={this.uploadMedia}
              >
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Gallery Images
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.animalCountBtn]}
                onPress={this.importCommonNameData}
              >
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Upload Information
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.animalCountBtn, styles.mb0]}
                onPress={this.changeCoverImage}
              >
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Update Cover Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.toggleAnimalEditModal}
              >
                <Ionicons name="close-outline" style={styles.closeButtonText} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Media & Excel Upload Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isMediaExcelUploadModalOpen}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.animalCountBtn}
                onPress={this.uploadMedia}
              >
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Upload Media
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.animalCountBtn, styles.mb0]}
                onPress={this.importCommonNameData}
              >
                import DownloadFile from './../component/DownloadFile';
                <Text style={[styles.animalCountBtnText, { marginLeft: 5 }]}>
                  Upload Excel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.toggleMediaExcelUploadModal}
              >
                <Ionicons name="close-outline" style={styles.closeButtonText} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Media Upload Progress Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isUploadModalOpen}
        >
          <View style={styles.modalContainer}>
            <View style={styles.uploadModalBody}>
              {this.state.isUploading ? (
                <>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>
                    {"Uploading..."}
                    <Text style={styles.progressText}>
                      {typeof this.state.uploadProgress !== "undefined"
                        ? this.state.uploadProgress + "%"
                        : null}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.abortBtn}
                    onPress={this.abortUpload}
                  >
                    <Text style={styles.abortBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>{"Processing..."}</Text>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/*Video Playback Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isPlaybackModalOpen}
        >
          <View style={[styles.modalContainer, { backgroundColor: "#000" }]}>
            <View style={styles.playbackModalBody}>
              <Video
                useNativeControls={true}
                resizeMode="contain"
                isLooping={false}
                source={{
                  uri: this.state.playbackURI,
                }}
                style={styles.video}
                onLoadStart={() => this.setState({ showOverlayLoader: true })}
                onLoad={() => this.setState({ showOverlayLoader: false })}
              />
              <TouchableOpacity
                style={[styles.closeButton, { top: 10, right: 10 }]}
                onPress={this.closePlaybackModal}
              >
                <Ionicons name="close-outline" style={styles.closeButtonText} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Stram Playback Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isStramModeOpen}
          onRequestClose={() => {
            this.closeStreamModal();
          }}
        >
          <View
            style={[{ flex: 1, marginTop: 25 }, { backgroundColor: "#fff" }]}
          >
            <View style={[globalStyles.flexDirectionRow,{ backgroundColor: "red"}]}>
              <View style={globalStyles.flex1}>
                <Text>Text 1</Text>
              </View>
              <View>
                <Text>Text 2</Text>
              </View>
              <View>
                <Text>Text 3</Text>
              </View>
            </View>
          </View>
        </Modal>

        {/*Data Import Progress Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isImportModalOpen}
        >
          <View style={styles.modalContainer}>
            <View style={styles.uploadModalBody}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>
                {this.state.isImporting ? "Processing..." : "Uploading..."}
              </Text>
            </View>
          </View>
        </Modal>

        <AnimalIdentificationTypeModal
          ref={this.idetificationTypeModalRef}
          title={this.state.commonName}
          commonName={this.state.commonName}
          {...this.props}
        />

        <AnimalIdentificationTypeModal
          ref={this.maleIdetificationTypeModalRef}
          title={this.state.commonName}
          commonName={this.state.commonName}
          {...this.props}
          gender={"male"}
        />

        <AnimalIdentificationTypeModal
          ref={this.femaleIdetificationTypeModalRef}
          title={this.state.commonName}
          commonName={this.state.commonName}
          {...this.props}
          gender={"female"}
        />

        <AnimalIdentificationTypeModal
          ref={this.infantsIdetificationTypeModalRef}
          title={this.state.commonName}
          commonName={this.state.commonName}
          {...this.props}
          gender={"infants"}
        />

        <ImageView
          visible={this.state.isGalleryImageViewerOpen}
          images={this.getGalleryImages()}
          imageIndex={this.state.selectedGalleryImageIndex}
          onRequestClose={this.closeGalleryImageViewer}
        />

        <ConfirmDialog
          visible={this.state.isConfirmDialogOpen}
          onConfirm={this.removeGalleryItem}
          onCancel={this.closeItemRemoveDialog}
        />

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

        <OverlayLoader visible={this.state.showOverlayLoader} />
      </Container>
    );
  };
}

const galleryGridWidth = Math.floor((windowWidth - 10) / 4);
// const styles = StyleSheet.create({
//   carouselConatainer: {
//     marginBottom: 0,
//     position: "relative",
//     height: ITEM_HEIGHT,
//     backgroundColor: "#ff00",
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

//   container: {
//     flex: 1,
//     width: windowWidth,
//     backgroundColor: Colors.white,
//   },
//   noCoverImage: {
//     width: "100%",
//     height: 200,
//     backgroundColor: "#c9c9c9",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   svgContainer: {
//     width: windowWidth,
//     height: 200,
//     backgroundColor: Colors.primary,
//     justifyContent: "flex-end",
//   },
//   avatarContainer: {
//     position: "absolute",
//     padding: 3,
//     top: 20,
//     left: Math.floor((windowWidth - 150) / 2),
//     backgroundColor: Colors.yellowBg,
//     borderRadius: 100,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     borderRadius: 100,
//   },
//   countContainerLeft: {
//     position: "absolute",
//     bottom: 5,
//     left: 5,
//     paddingRight: 10,
//     backgroundColor: "rgba(0,0,0,0.2)",
//     padding: 5,
//     borderRadius: 2,
//   },
//   countContainerRight: {
//     position: "absolute",
//     bottom: 5,
//     right: 5,
//     paddingRight: 10,
//     backgroundColor: "rgba(0,0,0,0.2)",
//     padding: 5,
//     borderRadius: 2,
//   },
//   countTextBtn: {
//     flexDirection: "row",
//     alignSelf: "flex-end",
//     paddingVertical: 0,
//   },
//   countText: {
//     color: Colors.white,
//     fontSize: 14,
//   },
//   commonName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: Colors.chocolate,
//     alignSelf: "center",
//     lineHeight: 35,
//   },
//   scientificName: {
//     fontSize: 14,
//     color: Colors.lightBrown,
//     alignSelf: "center",
//     fontStyle: "italic",
//   },
//   descriptionText: {
//     color: Colors.textColor,
//     fontSize: 12,
//     marginTop: 10,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   infoRow: {
//     flexDirection: "row",
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   w50: {
//     width: "50%",
//     justifyContent: "center",
//   },
//   infoTitle: {
//     fontWeight: "bold",
//     fontSize: 12,
//     color: Colors.textColor,
//   },
//   infoDesc: {
//     fontSize: 12,
//     color: Colors.textColor,
//   },
//   iconBoxContainer: {
//     marginTop: 10,
//     paddingHorizontal: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   iconBox: {
//     width: 45,
//     height: 45,
//     backgroundColor: "#eeeeee",
//     borderRadius: 3,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   activeIconBox: {
//     backgroundColor: "#c9c9c9",
//   },
//   iconBoxImage: {
//     width: 28,
//     height: 28,
//   },
//   funFactsContainer: {
//     width: windowWidth,
//     height: 150,
//     paddingHorizontal: 8,
//     marginTop: 10,
//   },
//   funFactsBgImage: {
//     width: windowWidth - 16,
//     height: 150,
//   },
//   funtFatcsHeading: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: Colors.lightBrown,
//     position: "absolute",
//     top: 12,
//     left: 20,
//   },
//   funFactsTextContainer: {
//     position: "absolute",
//     top: 43,
//     left: 40,
//     width: Math.floor(windowWidth * 0.6),
//     height: 70,
//   },
//   funFactsText: {
//     fontSize: 12,
//     color: Colors.black,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalBody: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.white,
//     width: windowWidth - 30,
//     minHeight: Math.floor(windowHeight / 4),
//     padding: 15,
//     borderRadius: 3,
//     elevation: 8,
//   },
//   closeButton: {
//     position: "absolute",
//     zIndex: 11,
//     top: 5,
//     right: 5,
//     backgroundColor: "#ddd",
//     width: 25,
//     height: 25,
//     borderRadius: 40 / 2,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 0,
//   },
//   closeButtonText: {
//     color: "#444",
//     fontSize: 22,
//   },
//   btn: {
//     flexDirection: "row",
//     backgroundColor: Colors.primary,
//     borderRadius: 3,
//     padding: 10,
//     margin: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   animalCountBtn: {
//     flexDirection: "row",
//     width: 200,
//     height: 35,
//     marginBottom: 20,
//     borderWidth: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//     borderRadius: 3,
//   },
//   animalCountBtnText: {
//     fontSize: 16,
//     color: Colors.white,
//   },
//   mb0: {
//     marginBottom: 0,
//   },
//   tabComponent: {
//     paddingTop: 10,
//   },
//   ttl: {
//     width: "40%",
//     fontWeight: "bold",
//     fontSize: 16,
//     color: Colors.textColor,
//   },
//   desc: {
//     width: "60%",
//     fontSize: 15,
//     color: Colors.textColor,
//     marginBottom: 10,
//   },
//   galleryContainer: {
//     height: 120,
//     marginTop: 15,
//     paddingHorizontal: 4,
//   },
//   imageGrid: {
//     height: 120,
//     width: 88,
//     borderRadius: 3,
//     // marginHorizontal: 4,
//   },
//   videoGrid: {
//     height: 120,
//     width: 88,
//     borderRadius: 3,
//     marginHorizontal: 4,
//     backgroundColor: "#d1d1d1",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   uploadBtn: {
//     width: "100%",
//     height: 45,
//     backgroundColor: Colors.primary,
//     borderRadius: 3,
//     marginVertical: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   uploadModalBody: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.white,
//     width: Math.floor((windowWidth * 70) / 100),
//     minHeight: Math.floor(windowHeight / 4),
//     padding: 15,
//     borderRadius: 3,
//     elevation: 5,
//   },
//   loaderContainer: {
//     paddingTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loadingText: {
//     fontSize: 14,
//     color: "#444",
//     opacity: 0.6,
//     marginTop: 10,
//   },
//   closeBtn: {
//     position: "absolute",
//     bottom: 10,
//     padding: 10,
//   },
//   closeBtnText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: Colors.tomato,
//   },
//   progressText: {
//     marginTop: 10,
//     color: Colors.textColor,
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   abortBtn: {
//     marginTop: 15,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   abortBtnText: {
//     fontSize: 18,
//     color: Colors.tomato,
//     fontWeight: "bold",
//   },
//   playbackModalBody: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#000",
//     width: windowWidth,
//     height: windowHeight,
//     padding: 15,
//     borderRadius: 3,
//     elevation: 5,
//   },
//   video: {
//     alignSelf: "center",
//     width: "100%",
//     height: Math.floor(windowHeight / 4),
//   },
//   imageBox: {
//     width: Math.floor((windowWidth - 32) / 3),
//     height: 60,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 3,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   housingGrid: {
//     width: Math.floor((windowWidth - 46) / 4),
//     alignItems: "center",
//   },
//   housingImgBox: {
//     width: Math.floor((windowWidth - 46) / 4),
//     height: 60,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 3,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 5,
//   },
//   housingImage: {
//     width: 30,
//     height: 30,
//   },
//   housingImgTitle: {
//     color: Colors.textColor,
//     fontSize: 12,
//   },
//   housingImgSubText: {
//     color: Colors.textColor,
//     fontSize: 11,
//     opacity: 0.7,
//   },
//   downloadBtn: {
//     flexDirection: "row",
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderRadius: 3,
//   },
// });
