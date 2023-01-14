import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import ImageView from "react-native-image-viewing";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import {
  Header,
  InputDropdown,
  OverlayLoader,
  ConfirmDialog,
  MessageDialog,
} from "../../component";
import {
  getCapitalizeTextWithoutExtraSpaces,
  getFileData,
} from "../../utils/Util";
import {
  getAnimalSections,
  getAnimalEnclosureTypes,
  getAnimalEnclosureIdDetails,
  manageAnimalEnclosureID,
  deleteEnclosureidGalleryItem,
  downloadEnclosureIDQrcode,
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import DownloadFile from "../../component/DownloadFile";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import globalStyles from "../../config/Styles";
import styles from "./Styles";

export default class AddEnclosureType extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      sections: [],
      enclosureTypes: [],
      id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
      screentTitle:
        typeof props.route.params !== "undefined"
          ? props.route.params.screen_title
          : "Add Enclosure Id",
      enclosureID:
        typeof props.route.params !== "undefined"
          ? props.route.params.enclosure_id
          : "",
      sectionID: undefined,
      sectionName: undefined,
      enclosureTypeID: undefined,
      enclosureTypeName: undefined,
      imageURI: undefined,
      imageData: undefined,
      enclosureSize: "",
      capacity: "",
      sunlight: "",
      humidityLevel: "",
      qrCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.qr_code
          : null,
      galleryImages: [],
      galleryImageData: [],
      isSectionMenuOpen: false,
      isEnclosureTypeMenuOpen: false,
      sectionValidationFailed: false,
      enclosureTypeValidationFailed: false,
      enclosureIDValidationFailed: false,
      sizeValidationFailed: false,
      capacityValidationFailed: false,
      sunlightValidationFailed: false,
      humidityLevelValidationFailed: false,
      qrCodeValueValidationFailed: false,
      selectedImageIndex: 0,
      isImageViewOpen: false,
      selectedGalleryItemID: undefined,
      isConfirmDialogOpen: false,
      showLoader: true,
      feed_ip: props.route.params?.feed_ip
        ? props.route.params.feed_ip
        : "rtsp://admin:Lset@123@",
      nest_ip: props.route.params?.nest_ip
        ? props.route.params.nest_ip
        : "rtsp://admin:Lset@123@",
    };

    this.scrollViewRef = React.createRef();
    this.messageDialogRef = React.createRef();
  }

  componentDidMount = () => {
    let { id } = this.state;
    let cid = this.context.userDetails.cid;
    let methods = [getAnimalSections(cid), getAnimalEnclosureTypes(cid)];
    if (parseInt(id) > 0) {
      methods.push(getAnimalEnclosureIdDetails(id));
    }

    Promise.all(methods)
      .then((response) => {
        let stateObj = {
          showLoader: false,
          sections: response[0].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
          enclosureTypes: response[1].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
        };

        if (parseInt(id) > 0) {
          let data = response[2];
          stateObj.sectionID =
            data.section_id !== null ? data.section_id : undefined;
          stateObj.sectionName =
            data.section_name !== null ? data.section_name : undefined;
          stateObj.enclosureID = data.enclosure_id;
          stateObj.enclosureTypeID =
            data.enclosure_type_id !== null
              ? data.enclosure_type_id
              : undefined;
          stateObj.enclosureTypeName =
            data.enclosure_type_name !== null
              ? data.enclosure_type_name
              : undefined;
          stateObj.imageURI = data.image;
          stateObj.enclosureSize = data.size !== null ? data.size : "";
          stateObj.capacity = data.capacity !== null ? data.capacity : "";
          stateObj.sunlight = data.sunlight !== null ? data.sunlight : "";
          stateObj.humidityLevel =
            data.humidity_level !== null ? data.humidity_level : "";
          stateObj.galleryImages = data.gallery;
        }

        this.setState(stateObj);
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  chooseIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
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

  addGalleryImage = () => {
    let { galleryImages, galleryImageData } = this.state;
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            galleryImages.push({ uri: result.uri });
            galleryImageData.push(getFileData(result));

            this.setState({
              galleryImages: galleryImages,
              galleryImageData: galleryImageData,
            });
          }
        });
      } else {
        alert("Please allow permission to choose an icon");
      }
    });
  };

  openImageView = (index) =>
    this.setState({
      selectedImageIndex: index,
      isImageViewOpen: true,
    });

  closeImageView = () =>
    this.setState({
      selectedImageIndex: 0,
      isImageViewOpen: false,
    });

  toggleSectionMenu = () =>
    this.setState({
      isSectionMenuOpen: !this.state.isSectionMenuOpen,
    });

  toggleEnclosureTypeMenu = () =>
    this.setState({
      isEnclosureTypeMenuOpen: !this.state.isEnclosureTypeMenuOpen,
    });

  setSection = (v) => {
    this.setState({
      sectionID: v.value,
      sectionName: v.name,
      isSectionMenuOpen: false,
    });
  };

  setEnclosureType = (v) => {
    this.setState({
      enclosureTypeID: v.value,
      enclosureTypeName: v.name,
      isEnclosureTypeMenuOpen: false,
    });
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
    let { selectedGalleryItemID, galleryImages } = this.state;

    if (typeof selectedGalleryItemID !== "undefined") {
      this.setState({ showLoader: true });

      deleteEnclosureidGalleryItem(selectedGalleryItemID)
        .then((response) => {
          if (response.check === Configs.SUCCESS_TYPE) {
            let arr = galleryImages.filter(
              (item) => item.id !== selectedGalleryItemID
            );

            this.setState({
              showLoader: false,
              isConfirmDialogOpen: false,
              selectedGalleryItemID: undefined,
              galleryImages: arr,
            });
          } else {
            this.setState(
              {
                showLoader: false,
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
            showLoader: false,
            isConfirmDialogOpen: false,
            selectedGalleryItemID: undefined,
          });
        });
    }
  };

  downloadFile = async () => {
    let { id } = this.state;
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === "granted") {
      this.setState({ showLoader: true });
      let response = await downloadEnclosureIDQrcode(id);

      if (response.check === Configs.SUCCESS_TYPE) {
        let data = response.data;
        let fileUri = FileSystem.documentDirectory + data.file_name;
        let fileContent = data.file_content;

        await FileSystem.writeAsStringAsync(fileUri, fileContent, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);

        this.setState({ showLoader: false });
        this.messageDialogRef.current.openDialog(
          "Success",
          "File saved to your device"
        );
      } else {
        this.messageDialogRef.current.openDialog("Error", response.message);
      }
    } else {
      this.messageDialogRef.current.openDialog(
        "Alert",
        "Please grant the permission to save file"
      );
    }
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveData = () => {
    this.setState(
      {
        sectionValidationFailed: false,
        enclosureTypeValidationFailed: false,
        enclosureIDValidationFailed: false,
        sizeValidationFailed: false,
        capacityValidationFailed: false,
        sunlightValidationFailed: false,
        humidityLevelValidationFailed: false,
        qrCodeValueValidationFailed: false,
      },
      () => {
        let {
          sectionID,
          enclosureTypeID,
          enclosureID,
          enclosureSize,
          capacity,
          sunlight,
          humidityLevel,
        } = this.state;

        if (typeof sectionID === "undefined") {
          this.setState({ sectionValidationFailed: true });
          // this.scrollViewScrollTop();
          return false;
        } else if (typeof enclosureTypeID === "undefined") {
          this.setState({ enclosureTypeValidationFailed: true });
          // this.scrollViewScrollTop();
          return false;
        } else if (enclosureID.trim().length === 0) {
          this.setState({ enclosureIDValidationFailed: true });
          // this.scrollViewScrollTop();
          return false;
        } else if (enclosureSize.trim().length === 0) {
          this.setState({ sizeValidationFailed: true });
          // this.scrollViewScrollTop();
          return false;
        } else if (capacity.trim().length === 0) {
          this.setState({ capacityValidationFailed: true });
          // this.scrollViewScrollTop();
          return false;
        } else if (sunlight.trim().length === 0) {
          this.setState({ sunlightValidationFailed: true });
          return false;
        } else if (humidityLevel.trim().length === 0) {
          this.setState({ humidityLevelValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            section_id: sectionID,
            enclosure_type_id: enclosureTypeID,
            enclosure_id: getCapitalizeTextWithoutExtraSpaces(enclosureID),
            size: enclosureSize,
            capacity: capacity,
            sunlight: sunlight,
            humidity_level: humidityLevel,
            feed_ip:
              this.state.feed_ip == "rtsp://admin:Lset@123@"
                ? ""
                : this.state.feed_ip,
            nest_ip:
              this.state.nest_ip == "rtsp://admin:Lset@123@"
                ? ""
                : this.state.nest_ip,
          };

          if (typeof this.state.imageData !== "undefined") {
            obj.image = this.state.imageData;
          }

          if (this.state.galleryImageData.length > 0) {
            obj.gallery = this.state.galleryImageData;
          }

          manageAnimalEnclosureID(obj)
            .then((response) => {
              this.setState(
                {
                  showLoader: false,
                },
                () => {
                  this.gotoBack();
                }
              );
            })
            .catch((error) => {
              this.setState({ showLoader: false });
              console.log(error);
            });
        }
      }
    );
  };

  render = () => (
    <Container>
      <Header title={this.state.screentTitle} />
      <View style={globalStyles.container}>
        <KeyboardAwareScrollView ref={this.scrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={globalStyles.fieldBox}>
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                Choose Image
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={globalStyles.imageContainer}
                onPress={this.chooseIcon}
              >
                {typeof this.state.imageURI !== "undefined" ? (
                  <Image
                    style={globalStyles.image_h40w40}
                    source={{ uri: this.state.imageURI }}
                  />
                ) : (
                  <Ionicons name="image" size={40} color={"#adadad"} />
                )}
              </TouchableOpacity>
            </View>

            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Gallery</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.mh10}
              >
                {this.state.galleryImages.map((value, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    activeOpacity={1}
                    style={globalStyles.galleryGrid}
                    onPress={this.openImageView.bind(this, index)}
                    onLongPress={this.openItemRemoveDialog.bind(this, value.id)}
                  >
                    <Image
                      source={{ uri: value.uri }}
                      resizeMode="contain"
                      style={globalStyles.galleryImg}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                activeOpacity={1}
                style={globalStyles.galleryAddBtn}
                onPress={this.addGalleryImage}
              >
                <Ionicons name="add" size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View>
              <InputDropdown
                label={"Section"}
                value={this.state.sectionName}
                isOpen={this.state.isSectionMenuOpen}
                items={this.state.sections}
                openAction={this.toggleSectionMenu}
                closeAction={this.toggleSectionMenu}
                setValue={this.setSection}
                labelStyle={globalStyles.labelName}
                textFieldStyle={[globalStyles.inputText]}
                style={globalStyles.fieldBox}
              />
              {this.state.sectionValidationFailed ? (
                <Text style={globalStyles.errorText}>Choose Section</Text>
              ) : null}
            </View>

            <View>
              <InputDropdown
                label={"Enclosure Type"}
                value={this.state.enclosureTypeName}
                isOpen={this.state.isEnclosureTypeMenuOpen}
                items={this.state.enclosureTypes}
                openAction={this.toggleEnclosureTypeMenu}
                closeAction={this.toggleEnclosureTypeMenu}
                setValue={this.setEnclosureType}
                labelStyle={globalStyles.labelName}
                textFieldStyle={[globalStyles.inputText]}
                style={globalStyles.fieldBox}
              />
              {this.state.enclosureTypeValidationFailed ? (
                <Text style={globalStyles.errorText}>
                  Choose Enclosure Type
                </Text>
              ) : null}
            </View>

            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Enclosure ID</Text>
              <TextInput
                value={this.state.enclosureID}
                onChangeText={(enclosureID) => this.setState({ enclosureID })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.enclosureIDValidationFailed ? (
                <Text style={globalStyles.errorText}>Enter Enclosure ID</Text>
              ) : null}
            </View>

            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Size</Text>
              <TextInput
                value={this.state.enclosureSize}
                onChangeText={(enclosureSize) =>
                  this.setState({ enclosureSize })
                }
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.sizeValidationFailed ? (
                <Text style={globalStyles.errorText}>Enter Enclosure Size</Text>
              ) : null}
            </View>

            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Capacity</Text>
              <TextInput
                value={this.state.capacity}
                onChangeText={(capacity) => this.setState({ capacity })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.capacityValidationFailed ? (
                <Text style={globalStyles.errorText}>Enter Capacity</Text>
              ) : null}
            </View>

            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Sunlight</Text>
              <TextInput
                value={this.state.sunlight}
                onChangeText={(sunlight) => this.setState({ sunlight })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.sunlightValidationFailed ? (
                <Text style={globalStyles.errorText}>Enter Capacity</Text>
              ) : null}
            </View>

            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                Feed Camera IP :{" "}
              </Text>
            </View>
            <TextInput
              value={this.state.feed_ip}
              onChangeText={(feed_ip) => this.setState({ feed_ip })}
              style={[globalStyles.textfield, styles.cameraIpTeaxtInput]}
              multiline
              autoCompleteType="off"
              autoCapitalize="words"
            />
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                Nest Camera IP :{" "}
              </Text>
            </View>
            <TextInput
              value={this.state.nest_ip}
              onChangeText={(nest_ip) => this.setState({ nest_ip })}
              style={[globalStyles.textfield, styles.cameraIpTeaxtInput]}
              multiline
              autoCompleteType="off"
              autoCapitalize="words"
            />

            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Humidity Level</Text>
              <TextInput
                value={this.state.humidityLevel}
                onChangeText={(humidityLevel) =>
                  this.setState({ humidityLevel })
                }
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.humidityLevelValidationFailed ? (
                <Text style={globalStyles.errorText}>Enter Humidity Level</Text>
              ) : null}
            </View>

            {this.state.qrCode !== null ? (
              <View style={globalStyles.qrCodeContainer}>
                <Image
                  source={{ uri: this.state.qrCode }}
                  style={globalStyles.qrImage}
                />
                <DownloadFile
                  url={this.state.qrCode}
                  viewStyle={globalStyles.downloadBtn}
                  textStyle={globalStyles.downloadFileButtonText}
                  design={<AntDesign name="download" size={20} />}
                  text={"Download QR"}
                />
              </View>
            ) : null}
          </View>
          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.saveData}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                {this.state.id == 0 ? "SAVE" : "UPDATE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>
                EXIT
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <ImageView
        visible={this.state.isImageViewOpen}
        images={this.state.galleryImages}
        imageIndex={this.state.selectedImageIndex}
        onRequestClose={this.closeImageView}
      />

      <ConfirmDialog
        visible={this.state.isConfirmDialogOpen}
        onConfirm={this.removeGalleryItem}
        onCancel={this.closeItemRemoveDialog}
      />

      <MessageDialog ref={this.messageDialogRef} />
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

const windowWidth = Dimensions.get("window").width;
const galleryGridWidth = Math.floor((windowWidth - 20) / 4);
const galleryGridHeight = Math.floor((windowWidth - 20) / 4);
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		padding:8
// 	},
// 	chooseCatContainer: {
// 		alignItems: 'center',
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderBottomWidth: 1,
//         backgroundColor: "#fff",
//         height: 'auto',
//         justifyContent: "space-between",
// 	},
// 	imageContainer: {
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 	},
// 	image: {
// 		height: 40,
// 		width: 40,
// 	},
// 	defaultImgIcon: {
// 		fontSize: 40,
// 		color: "#adadad",
// 	},
// 	name: {
// 		color: Colors.labelColor,
//         // lineHeight: 40,
// 		fontSize:Colors.lableSize,
//         paddingLeft: 4,
//         height: 'auto',
//         paddingVertical: 10
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 30,
// 	},
// 	inputText: {
// 		backgroundColor: "#fff",
//         height: 'auto',
//         flexWrap:'wrap',
// 		fontSize:Colors.textSize,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
// 	},
// 	inputContainer: {
// 		alignItems: 'center',
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderBottomWidth: 1,
//         backgroundColor: "#fff",
//         height: 'auto',
//         justifyContent: "space-between",
// 	},
// 	pb0: {
// 		paddingBottom: 0,
// 	},
// 	mb0: {
// 		marginBottom: 0,
// 	},
// 	buttonText: {
// 		fontSize:Colors.lableSize,
// 		fontWeight: "bold",
// 	},
// 	saveBtnText: {
// 		color: Colors.primary,
// 		fontSize:Colors.lableSize,
// 	},
// 	exitBtnText: {
// 		color: Colors.activeTab,
// 		fontSize:Colors.lableSize,
// 	},
// 	errorText: {
// 		textAlign: "right",
// 		color: Colors.tomato,
// 		fontWeight: "bold",
// 		fontStyle: "italic",
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
// 	qrCodeContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		marginTop: 20,
// 	},
// 	downloadBtn: {
// 		flexDirection: "row",
// 		// paddingHorizontal: 10,
// 		paddingVertical: 8,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
// 		marginLeft: 20,
// 	},
// 	galleryContainer: {
// 		flex: 1,
// 		flexDirection: "row",
// 		alignItems: "flex-start",
// 		flexWrap: "wrap",
// 		paddingHorizontal: 10,
// 		marginVertical: 10,
// 	},
// 	galleryGrid: {
// 		width: galleryGridWidth,
// 		height: galleryGridHeight,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	galleryImg: {
// 		width: galleryGridWidth,
// 		height: galleryGridHeight,
// 		borderWidth: 1,
// 		borderColor: Colors.white,
// 	},
// 	galleryAddBtn: {
// 		width: galleryGridWidth,
// 		height: galleryGridHeight - 2,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		borderWidth: 1,
// 		borderStyle: "dashed",
// 		borderRadius: 1,
// 		borderColor: Colors.primary,
// 	},
// });
