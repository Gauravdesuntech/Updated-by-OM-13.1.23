import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../component/Header";
import OverlayLoader from "../component/OverlayLoader";
import InputDropdown from "../component/InputDropdown";
import { Colors } from "../config";
import {
  getCapitalizeTextWithoutExtraSpaces,
  getFileData,
} from "../utils/Util";
import { getAnimalDatabases, manageCommonName } from "../services/APIServices";
import { getAllTags } from "../services/TagServices";
import AppContext from "../context/AppContext";
import * as WebBrowser from "expo-web-browser";
import { generateURL } from "../utils/helper";
import DownloadFile from "../component/DownloadFile";
import { MultiSelectDropdown } from "../component";
////import Styles from "../config/Styles";
import globalStyles from "../config/Styles";
import styles from './Styles'


export default class AddCommonName extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
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
      permissionGranted: false,
      id: props.route.params.hasOwnProperty("id") ? props.route.params.id : 0,
      commonName: props.route.params.hasOwnProperty("commonName")
        ? props.route.params.commonName
        : "",
      scientificName: props.route.params.hasOwnProperty("scientificName")
        ? props.route.params.scientificName
        : "",
      taxonid: props.route.params.hasOwnProperty("taxonid")
        ? props.route.params.taxonid
        : "",
      databaseName: props.route.params.hasOwnProperty("databaseName")
        ? props.route.params.databaseName
        : undefined,
      database: [],
      description: props.route.params.hasOwnProperty("description")
        ? props.route.params.description
        : "",
      funFacts: props.route.params.hasOwnProperty("funFacts")
        ? props.route.params.funFacts
        : "",
      imageURI: props.route.params.hasOwnProperty("imageURI")
        ? props.route.params.imageURI
        : undefined,
      coverImageURI: props.route.params.hasOwnProperty("coverImageURI")
        ? props.route.params.coverImageURI
        : undefined,
      qrCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.qr_code
          : null,
      selectedTags: props.route.params.hasOwnProperty("assignedTags")
        ? props.route.params.assignedTags.map((item) => ({
            id: item.id,
            name: item.tag_name,
          }))
        : undefined,
      tags: [],
      imageData: undefined,
      coverImageData: undefined,
      hasImageURIValidationError: false,
      coverImageValidationError: false,
      hasCommonNameValidationError: false,
      hasScientificNameValidationError: false,
      hsaTaxoinidValidationError: false,
      hasDatabaseValidationError: false,
      hasDescriptionValidationError: false,
      hasFunFactsValidationError: false,
      showLoader: true,
      isDropdownOpen: false,
    };
    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    console.log(this.state.qrCode);
    let cid = this.context.userDetails.cid;

    Promise.all([getAnimalDatabases(cid), getAllTags(cid)]).then((data) => {
      this.setState({
        showLoader: false,
        database: data[0].map((v, i) => ({
          id: v.id,
          name: v.name,
          value: v.name,
        })),
        tags: data[1]?.data,
      });
    });
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  chooseIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              imageURI: result.uri,
              imageData: getFileData(result),
              hasImageURIValidationError: false,
            });
          }
        });
      } else {
        alert("Please allow permission to choose an icon");
      }
    });
  };

  chooseCoverImage = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [17, 4],
          quality: 0.8,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              coverImageURI: result.uri,
              coverImageData: getFileData(result),
              coverImageValidationError: false,
            });
          }
        });
      } else {
        alert("Please allow permission to choose cover image");
      }
    });
  };

  downloadFile = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };

  toggleDropdown = () =>
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });

  setDatabaseName = (item) => {
    this.setState({
      databaseName: item.value,
      isDropdownOpen: false,
    });
  };

  setSelectectTags = (item) => {
    this.setState({
      selectedTags: item,
    });
  };

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  saveData = () => {
    let {
      id,
      imageData,
      coverImageData,
      commonName,
      scientificName,
      taxonid,
      databaseName,
      description,
      funFacts,
    } = this.state;
    let qr_url = generateURL("CommonNameDetails", {
      commonNameID: id,
      commonName: commonName,
    });
    // console.log("URL ************",qr_url);return;
    this.setState(
      {
        hasImageURIValidationError: false,
        coverImageValidationError: false,
        hasCommonNameValidationError: false,
        hasScientificNameValidationError: false,
        hsaTaxoinidValidationError: false,
        hasDatabaseValidationError: false,
        hasDescriptionValidationError: false,
        hasFunFactsValidationError: false,
      },
      () => {
        if (parseInt(id) === 0 && typeof imageData === "undefined") {
          this.setState({ hasImageURIValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (
          parseInt(id) === 0 &&
          typeof coverImageData === "undefined"
        ) {
          this.setState({ coverImageValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (commonName.trim().length === 0) {
          this.setState({ hasCommonNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (scientificName.trim().length === 0) {
          this.setState({ hasScientificNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (taxonid.trim().length === 0) {
          this.setState({ hsaTaxoinidValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof databaseName === "undefined") {
          this.setState({ hasDatabaseValidationError: true });
          return false;
        } else if (description.trim().length === 0) {
          this.setState({ hasDescriptionValidationError: true });
          return false;
        } else if (funFacts.trim().length === 0) {
          this.setState({ hasFunFactsValidationError: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            scientific_name:
              getCapitalizeTextWithoutExtraSpaces(scientificName),
            common_name: getCapitalizeTextWithoutExtraSpaces(commonName),
            animal_class: this.state.classID,
            category: this.state.categoryID,
            taxonid: taxonid,
            database_name: databaseName,
            description: description,
            fun_facts: funFacts,
            qr_value: qr_url,
            tag_id: this.state.selectedTags?.map((item) => item.id).join(","),
          };

          if (imageData !== "undefined") {
            obj.image = imageData;
          }
          if (typeof coverImageData !== "undefined") {
            obj.cover_image = coverImageData;
          }
          if (typeof this.state.subCategoryID !== "undefined") {
            obj.sub_category = this.state.subCategoryID;
          }

          manageCommonName(obj)
            .then((response) => {
              this.setState({ showLoader: false });
              this.gotoBack();
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
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={
          parseInt(this.state.id) > 0 ? "Edit Common Name" : "Add Common Name"
        }
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={styles.container}>
          <ScrollView
            ref={this.formScrollViewRef}
            style={{
              paddingHorizontal: 10,
              paddingBottom: 20,
              paddingTop: 10,
              marginBottom: 20,
            }}
          >
            <View
              style={globalStyles.formBorder}
                
            >
              <View style={styles.inputContainer}>
                <Text style={styles.name}>
                  Profile Image <Text style={styles.mandatory}>*</Text>
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  // style={styles.imageContainer}
                  onPress={this.chooseIcon}
                >
                  {typeof this.state.imageURI !== "undefined" ? (
                    <Image
                      style={styles.image}
                      source={{ uri: this.state.imageURI }}
                    />
                  ) : (
                    <Ionicons name="image" style={styles.defaultImgIcon} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.hasImageURIValidationError ? (
                <View style={{ marginRight: 10 }}>
                  <Text style={styles.errorText}>Choose profile image</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Text style={styles.name}>
                  Cover Image <Text style={styles.mandatory}>*</Text>
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  // style={styles.imageContainer}
                  onPress={this.chooseCoverImage}
                >
                  {typeof this.state.coverImageURI !== "undefined" ? (
                    <Image
                      style={styles.coverImg}
                      source={{ uri: this.state.coverImageURI }}
                    />
                  ) : (
                    <Ionicons name="image" style={styles.defaultImgIcon} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.coverImageValidationError ? (
                <View style={{ marginRight: 10 }}>
                  <Text style={styles.errorText}>Choose cover image</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Text style={styles.name}>
                  Common Name <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  maxLength={20}
                  value={this.state.commonName}
                  onChangeText={(commonName) => this.setState({ commonName })}
                  style={[styles.inputText, { width: "60%" }]}
                  autoCompleteType="off"
                  autoCapitalize="words"
                />
                {this.state.hasCommonNameValidationError ? (
                  <Text style={styles.errorText}>Enter common name</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.name}>
                  Scientific Name <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  value={this.state.scientificName}
                  onChangeText={(scientificName) =>
                    this.setState({ scientificName })
                  }
                  maxLength={20}
                  style={[styles.inputText, , { width: "60%" }]}
                  autoCompleteType="off"
                  autoCapitalize="words"
                />
                {this.state.hasScientificNameValidationError ? (
                  <Text style={styles.errorText}>Enter scientific name</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.name}>
                  Taxoinid <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  maxLength={15}
                  value={this.state.taxonid}
                  onChangeText={(taxonid) => this.setState({ taxonid })}
                  style={[styles.inputText, { width: "60%" }]}
                  autoCompleteType="off"
                  autoCapitalize="characters"
                />
                {this.state.hsaTaxoinidValidationError ? (
                  <Text style={styles.errorText}>Enter taxoinid</Text>
                ) : null}
              </View>

              <View>
                <InputDropdown
                  label={"Database"}
                  isMandatory={true}
                  value={this.state.databaseName}
                  isOpen={this.state.isDropdownOpen}
                  items={this.state.database}
                  openAction={this.toggleDropdown}
                  closeAction={this.toggleDropdown}
                  setValue={this.setDatabaseName}
                  labelStyle={styles.name}
                  textFieldStyle={styles.inputText}
                  style={styles.inputContainer}
                />
                {this.state.hasDatabaseValidationError ? (
                  <Text style={styles.errorText}>Select database name</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.name}>
                  Description <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  multiline={true}
                  style={styles.inputTextArea}
                  value={this.state.description}
                  onChangeText={(description) => this.setState({ description })}
                  autoCapitalize="words"
                  autoCompleteType="off"
                />
                {this.state.hasDescriptionValidationError ? (
                  <Text style={styles.errorText}>Enter description</Text>
                ) : null}
              </View>

              <View style={[styles.inputContainer, { borderBottomWidth: 0 }]}>
                <Text style={styles.name}>
                  Fun Facts <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  multiline={true}
                  style={styles.inputTextArea}
                  value={this.state.funFacts}
                  onChangeText={(funFacts) => this.setState({ funFacts })}
                  autoCapitalize="words"
                  autoCompleteType="off"
                />
                {this.state.hasFunFactsValidationError ? (
                  <Text style={styles.errorText}>Enter Fun Facts</Text>
                ) : null}
              </View>

              {this.state.qrCode == null &&
              this.state.qrCode == undefined ? null : (
                <View style={styles.qrCodeContainer}>
                  <Image
                    source={{ uri: this.state.qrCode }}
                    style={{ height: 200, width: 200 }}
                  />
                  <DownloadFile
                    url={this.state.qrCode}
                    viewStyle={styles.downloadBtn}
                    textStyle={{
                      fontSize: Colors.textSize,
                      marginHorizontal: 5,
                    }}
                    design={<AntDesign name="download" size={20} />}
                    text={"Download"}
                  />
                </View>
              )}

              <View style={[styles.inputContainer, { borderBottomWidth: 0 }]}>
                <MultiSelectDropdown
                  label={"Tags"}
                  items={this.state.tags}
                  selectedItems={this.state.selectedTags}
                  labelStyle={styles.name}
                  placeHolderContainer={globalStyles.textfield}
                  placeholderStyle={globalStyles.placeholderStyle}
                  selectedItemsContainer={[
                    globalStyles.selectedItemsContainer,
                    globalStyles.width60,
                  ]}
                  onSave={this.setSelectectTags}
                  listView={true}
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.saveData}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

//const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  // },
  // chooseCatContainer: {
  //   alignItems: "center",
  //   width: "100%",
  //   overflow: "hidden",
  //   flexDirection: "row",
  //   padding: 5,
  //   borderRadius: 3,
  //   borderColor: "#ddd",
  //   borderWidth: 1,
  //   backgroundColor: "#fff",
  //   height: "auto",
  //   justifyContent: "space-between",
  //   marginBottom: 5,
  //   marginTop: 5,
  // },
  // imageContainer: {
  //   borderColor: "#ccc",
  //   borderWidth: 1,
  //   padding: 3,
  //   backgroundColor: "#fff",
  //   borderRadius: 3,
  // },
  // image: {
  //   height: 50,
  //   width: 50,
  // },
  // coverImg: {
  //   height: 40,
  //   width: 170,
  // },
  // defaultImgIcon: {
  //   fontSize: 40,
  //   color: "#adadad",
  // },
  // name: {
  //   color: Colors.labelColor,
  //   // lineHeight: 40,
  //   fontSize: Colors.lableSize,
  //   paddingLeft: 4,
  //   height: "auto",
  //   paddingVertical: 10,
  // },
  // buttonsContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-evenly",
  //   marginVertical: 30,
  // },
  // inputText: {
  //   height: 50,
  //   // borderColor: "#ccc",
  //   // borderWidth: 1,
  //   fontSize: Colors.textSize,
  //   // backgroundColor: "#f9f6f6",
  //   paddingHorizontal: 10,
  //   color: Colors.textColor,
  // },
  // inputTextArea: {
  //   // backgroundColor: "#fff",
  //   // height: 'auto',

  //   // fontSize: 12,
  //   // color: Colors.textColor,
  //   // textAlign: "right",
  //   // padding: 5,
  //   width: "60%",
  //   // borderColor: "#ccc",
  //   // borderWidth: 1,
  //   fontSize: Colors.textSize,
  //   // backgroundColor: "#f9f6f6",
  //   alignItems: "center",
  //   paddingHorizontal: 10,
  //   color: Colors.textColor,
  // },
  // inputContainer: {
  //   alignItems: "center",
  //   width: "100%",
  //   overflow: "hidden",
  //   flexDirection: "row",
  //   padding: 5,
  //   borderRadius: 3,
  //   borderColor: "#ddd",
  //   borderBottomWidth: 1,
  //   backgroundColor: "#fff",
  //   height: "auto",
  //   justifyContent: "space-between",
  // },
  // pb0: {
  //   paddingBottom: 0,
  // },
  // mb0: {
  //   marginBottom: 0,
  // },
  // buttonText: {
  //   fontSize: Colors.textSize,
  //   fontWeight: "bold",
  // },
  // saveBtnText: {
  //   color: Colors.primary,
  // },
  // exitBtnText: {
  //   color: Colors.activeTab,
  // },
  // mandatory: {
  //   color: Colors.tomato,
  //   fontSize: Colors.textSize,
  //   fontWeight: "bold",
  // },
  // errorText: {
  //   textAlign: "right",
  //   color: Colors.tomato,
  //   fontWeight: "bold",
  //   fontStyle: "italic",
  // },
  // qrCodeContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginTop: 20,
  // },
  // downloadBtn: {
  //   flexDirection: "row",
  //   paddingHorizontal: 20,
  //   paddingVertical: 8,
  //   borderWidth: StyleSheet.hairlineWidth,
  //   borderRadius: 3,
  //   marginLeft: 20,

  // },
//});
