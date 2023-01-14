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
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../component/Header";
import ModalMenu from "../component/ModalMenu";
import OverlayLoader from "../component/OverlayLoader";
import InputDropdown from "../component/InputDropdown";
import { Colors } from "../config";
import {
  getCapitalizeTextWithoutExtraSpaces,
  getFileData,
} from "../utils/Util";
import {
  getAnimalGroups,
  getAllCategory,
  addSubCategory,
} from "../services/APIServices";
import { getAllTags } from "../services/TagServices";
import AppContext from "../context/AppContext";
import { MultiSelectDropdown } from "../component";
//import Styles from "../config/Styles";
import globalStyles from "../config/Styles";
import styles from './Styles'


export default class AddSubCategory extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      isAnimalClassMenuOpen: false,
      isCategoryMenuOpen: false,
      permissionGranted: false,
      animalClass: [],
      categories: [],
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
      id: props.route.params.hasOwnProperty("id") ? props.route.params.id : 0,
      subCategoryName: props.route.params.hasOwnProperty("subCategoryName")
        ? props.route.params.subCategoryName
        : "",
      prority: props.route.params.hasOwnProperty("prority")
        ? props.route.params.prority
        : 1,
      // priority section off so static value sent to api
      description: props.route.params.hasOwnProperty("description")
        ? props.route.params.description
        : "",
      imageURI: props.route.params.hasOwnProperty("imageUri")
        ? props.route.params.imageUri
        : undefined,
      coverImageURI: props.route.params.hasOwnProperty("coverImageURI")
        ? props.route.params.coverImageURI
        : undefined,
      scientificName: props.route.params.hasOwnProperty("scientificName")
        ? this.props.route.params.scientificName
        : "",
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
      hasClassNameValidationError: false,
      hasCategotyNameValidationError: false,
      hasSubCategotyNameValidationError: false,
      hasPriorityValidationError: false,
      hasDescriptionValidationError: false,
      showLoader: false,
    };
    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    console.log(props.route.params.assignedTags);
    let { classID } = this.state;
    let cid = this.context.userDetails.cid;

    this.setState({ showLoader: true });

    Promise.all([
      getAnimalGroups(cid),
      getAllCategory(cid, classID),
      getAllTags(cid),
    ])
      .then((response) => {
        this.setState({
          animalClass: response[0].map((v, i) => ({
            id: v.id,
            name: v.group_name,
            value: v.id,
          })),
          categories: response[1].map((v, i) => ({
            id: v.id,
            name: v.cat_name,
            value: v.id,
          })),
          tags: response[2]?.data,
          showLoader: false,
        });
      })
      .catch((error) => console.log(error));
  };

  toggleAnimalClassMenu = () =>
    this.setState({ isAnimalClassMenuOpen: !this.state.isAnimalClassMenuOpen });

  toggleCategoryMenu = () =>
    this.setState({ isCategoryMenuOpen: !this.state.isCategoryMenuOpen });

  toggleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  chooseIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        this.setState({
          imageURI: undefined,
          imageData: undefined,
        });

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
              hasImageURIValidationError: false,
            });
          }
        });
      } else {
        Alert.alert("Please allow permission to choose an icon");
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

  setClassData = (v) =>
    this.setState(
      {
        classID: v.value,
        className: v.name,
        isAnimalClassMenuOpen: false,
        categoryID: undefined,
        categoryName: undefined,
        showLoader: true,
      },
      () => {
        let cid = this.context.userDetails.cid;
        getAllCategory(cid, v.id).then((catArr) => {
          this.setState({
            categories: catArr.map((v, i) => ({
              id: v.id,
              name: v.cat_name,
              value: v.id,
            })),
            showLoader: false,
          });
        });
      }
    );

  setCategoryData = (v) => {
    this.setState({
      categoryID: v.value,
      categoryName: v.name,
      isCategoryMenuOpen: false,
    });
  };

  setPriority = (v) => {
    this.setState({ prority: v, modalVisible: false });
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

  addCategory = () => {
    let {
      id,
      imageData,
      classID,
      categoryID,
      subCategoryName,
      prority,
      description,
      scientificName,
      coverImageData,
    } = this.state;
    this.setState(
      {
        hasImageURIValidationError: false,
        hasClassNameValidationError: false,
        hasCategotyNameValidationError: false,
        hasSubCategotyNameValidationError: false,
        hasPriorityValidationError: false,
        hasDescriptionValidationError: false,
      },
      () => {
        if (parseInt(id) === 0 && typeof imageData === "undefined") {
          this.setState({ hasImageURIValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof classID === "undefined") {
          this.setState({ hasClassNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof categoryID === "undefined") {
          this.setState({ hasCategotyNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (subCategoryName.trim().length === 0) {
          this.setState({ hasSubCategotyNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof prority === "undefined") {
          this.setState({ hasPriorityValidationError: true });
          return false;
        } else if (description.trim().length === 0) {
          this.setState({ hasDescriptionValidationError: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            class_id: classID,
            cat_name: getCapitalizeTextWithoutExtraSpaces(subCategoryName),
            prority: prority,
            description: description,
            parent_cat: categoryID,
            scientificName: getCapitalizeTextWithoutExtraSpaces(scientificName),
            tag_id: this.state.selectedTags?.map((item) => item.id).join(","),
          };

          if (typeof imageData !== "undefined") {
            obj.cat_icon = this.state.imageData;
          }

          if (typeof coverImageData !== "undefined") {
            obj.cover_image = coverImageData;
          }

          addSubCategory(obj)
            .then((response) => {
              // let subCategories = this.context.subCategories;
              // subCategories.unshift(response.data);
              // this.context.setSubCategories(subCategories);

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
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={
          parseInt(this.state.id) > 0 ? "Edit Sub Category" : "Add Sub Category"
        }
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
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
              <Text style={styles.name}>Choose Icon</Text>
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
                <Text style={styles.errorText}>Choose an icon</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <Text style={styles.name}>Cover Image</Text>
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

            <View>
              <InputDropdown
                label={"Animal Class"}
                value={this.state.className}
                isOpen={this.state.isAnimalClassMenuOpen}
                items={this.state.animalClass}
                openAction={this.toggleAnimalClassMenu}
                closeAction={this.toggleAnimalClassMenu}
                setValue={this.setClassData}
                labelStyle={styles.name}
                textFieldStyle={styles.inputText}
                style={styles.inputContainer}
              />
              {this.state.hasClassNameValidationError ? (
                <Text style={styles.errorText}>Choose animal class</Text>
              ) : null}
            </View>

            <View>
              <InputDropdown
                label={"Animal Category"}
                value={this.state.categoryName}
                isOpen={this.state.isCategoryMenuOpen}
                items={this.state.categories}
                openAction={this.toggleCategoryMenu}
                closeAction={this.toggleCategoryMenu}
                setValue={this.setCategoryData}
                labelStyle={styles.name}
                textFieldStyle={styles.inputText}
                style={styles.inputContainer}
              />
              {this.state.hasCategotyNameValidationError ? (
                <Text style={styles.errorText}>Choose animal category</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.name}>Sub Category Name</Text>
              <TextInput
                multiline={true}
                value={this.state.subCategoryName}
                onChangeText={(subCategoryName) =>
                  this.setState({ subCategoryName })
                }
                style={styles.inputText}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.hasSubCategotyNameValidationError ? (
                <Text style={styles.errorText}>Enter sub category name</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.name}>Scientific Name</Text>
              <TextInput
                multiline={true}
                value={this.state.scientificName}
                onChangeText={(scientificName) =>
                  this.setState({ scientificName })
                }
                style={styles.inputText}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            {/* <View style={styles.inputContainer}>
						<Text style={styles.name}>Choose Priority</Text>
						<TouchableOpacity
							activeOpacity={1}
							onPress={this.toggleModalVisible}
							style={[styles.inputText, { justifyContent: "center" }]}
						>
							<Text style={{ fontSize: 18 }}>{this.state.prority}</Text>
						</TouchableOpacity>
						{this.state.hasPriorityValidationError ? (
							<Text style={styles.errorText}>Choose priority</Text>
						) : null}
					</View> */}

            <View style={[styles.inputContainer]}>
              <Text style={styles.name}>Description</Text>
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

          <View style={styles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addCategory}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ModalMenu
        visible={this.state.modalVisible}
        closeAction={this.toggleModalVisible}
      >
        {[1, 2, 3, 4, 5].map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setPriority.bind(this, v)}
            key={i}
          >
            <Text style={styles.itemtitle}>{v}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   chooseCatContainer: {
//     alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     height: "auto",
//     justifyContent: "space-between",
//     marginBottom: 5,
//     marginTop: 5,
//   },
//   imageContainer: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     padding: 3,
//     backgroundColor: "#fff",
//     borderRadius: 3,
//   },
//   image: {
//     height: 50,
//     width: 50,
//   },
//   defaultImgIcon: {
//     fontSize: 40,
//     color: "#adadad",
//   },
//   name: {
//     color: Colors.labelColor,
//     // lineHeight: 40,
//     fontSize: Colors.lableSize,
//     paddingLeft: 4,
//     height: "auto",
//     paddingVertical: 10,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//     marginVertical: 30,
//   },
//   inputText: {
//     backgroundColor: "#fff",
//     height: "auto",
//     flexWrap: "wrap",
//     fontSize: Colors.textSize,
//     width: "50%",
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   inputTextArea: {
//     backgroundColor: "#fff",
//     height: "auto",
//     flexWrap: "wrap",
//     fontSize: Colors.textSize,
//     width: "50%",
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   inputContainer: {
//     alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderBottomWidth: 1,
//     backgroundColor: "#fff",
//     height: "auto",
//     justifyContent: "space-between",
//   },
//   pb0: {
//     paddingBottom: 0,
//   },
//   mb0: {
//     marginBottom: 0,
//   },
//   buttonText: {
//     fontSize: Colors.textSize,
//     fontWeight: "bold",
//   },
//   saveBtnText: {
//     color: Colors.primary,
//   },
//   exitBtnText: {
//     color: Colors.activeTab,
//   },
//   item: {
//     height: 35,
//     backgroundColor: "#00b386",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   itemtitle: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: Colors.textSize,
//   },
//   errorText: {
//     textAlign: "right",
//     color: Colors.tomato,
//     fontWeight: "bold",
//     // fontStyle: "italic",
//   },
//   coverImg: {
//     height: 40,
//     width: 170,
//   },
// });
