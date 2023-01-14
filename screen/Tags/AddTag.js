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
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../component/Header";
import OverlayLoader from "../../component/OverlayLoader";
import { Colors } from "../../config";
import { manageTags, getTagGroups } from "../../services/TagServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";
import { InputDropdown } from "../../component";
import {
  getCapitalizeTextWithoutExtraSpaces,
  getFileData,
} from "../../utils/Util";
import Upload from "../../component/tasks/AddTodo/Upload";
import { translate } from "../Settings/LanguageSettigs/LanguageSettings";
import { translations } from "../Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class AddTag extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      tagName: props.route.params?.item?.name ?? "",
      tagGroupName: props.route.params?.item?.group_name ?? "",
      tagGroupId: props.route.params?.item?.group_id ?? "",
      tagGroups: [],
      selectionTypes: [
        {
          id: 1,
          name: "Section",
          value: "section",
        },
        {
          id: 2,
          name: "Enclosure",
          value: "enclosure",
        },
        {
          id: 3,
          name: "Animal",
          value: "animal",
        },
        {
          id: 4,
          name: "Category",
          value: "category",
        },
        {
          id: 5,
          name: "Subcategory",
          value: "sub_category",
        },
        {
          id: 6,
          name: "Common Name",
          value: "common_name",
        },
      ],
      selectionTypeName: props.route.params?.item?.assign_for ?? "",
      selectionTypeId: props.route.params?.item?.assign_for ?? "",
      isSelectionTypeMenuOpen: false,
      tagIconURI: props.route.params?.item?.tag_icon ?? undefined,
      tagIconData: undefined,
      tagIconValidationError: false,
      selectedImage: null,
      isGroupMenuOpen: false,
      tagNameError: false,
      tagGroupNameError: false,
      selectionTypeError: false,
      tagIconError: false,
      isLoading: false,
    };

    this.formScrollViewRef = React.createRef();
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
        tags: [],
      },
      () => {
        this.loadTagGroups();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  gotoBack = () => this.props.navigation.goBack();

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  loadTagGroups = () => {
    let cid = this.context.userDetails.cid;

    this.setState(
      {
        isLoading: true,
      },
      () => {
        getTagGroups(cid)
          .then((response) => {
            this.setState({
              isLoading: false,
              tagGroups: response.data,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  addTag = () => {
    let cid = this.context.userDetails.cid;
    this.setState(
      {
        tagNameError: false,
        tagGroupNameError: false,
        selectionTypeError: false,
        tagIconError: false,
      });

    if (this.state.selectionTypeId.length === 0) {
      this.setState({
        selectionTypeError: true,
      });

      return;
    }

    if (this.state.tagGroupName.length === 0) {
      this.setState({
        tagGroupNameError: true,
      });

      return;
    }


    if (this.state.tagName.trim().length === 0) {
      this.setState({
        tagNameError: true,
      });

      return;
    }

    // if (!this.state.selectedImage) {
    //   this.setState({
    //     tagIconError: true,
    //   });

    //   return;
    // }

    if (
      parseInt(this.state.id) === 0 &&
      typeof this.state.tagIconData === "undefined"
    ) {
      this.setState({ tagIconValidationError: true });
      this.scrollToScrollViewTop();
      return false;
    }

    this.setState(
      {
        isLoading: true,
      },
      () => {
        let obj = {
          cid,
          name: getCapitalizeTextWithoutExtraSpaces(this.state.tagName),
          id: this.state.id !== 0 ? this.state.id : undefined,
          group_id: this.state.tagGroupId,
          assign_for: this.state.selectionTypeId,
          // tag_icon: this.state.selectedImage?.imagebase64 || undefined,
        };

        if (typeof this.state.tagIconData !== "undefined") {
          obj.tag_icon = this.state.tagIconData;
        }

        manageTags(obj)
          .then((response) => {
            this.setState({
              isLoading: false,
            });
            Alert.alert(
              this.state.id === 0
                ? i18n.t("successfullyCreated")
                : i18n.t("successfullyUpdated")
            );
            this.gotoBack();
          })
          .catch((error) => console.log(error));
      }
    );
  };

  handleSetValues = (item) => {
    this.setState({
      tagGroupId: item.id,
      tagGroupName: item.name,
      isGroupMenuOpen: false,
    });
  };

  setSelectedImage = (item) => {
    this.setState({ selectedImage: item });
  };

  toggleSectionMenu = () => {
    this.setState({
      isGroupMenuOpen: !this.state.isGroupMenuOpen,
    });
  };

  toggleSelectionTypeMenu = () =>
  this.setState({
    isSelectionTypeMenuOpen: !this.state.isSelectionTypeMenuOpen,
  });

  setSelectionTypeData = (v) =>
    this.setState({
      selectionTypeId: v.value,
      selectionTypeName: v.name,
      selectedRef: [],
      ref_name: "",
      isSelectionTypeMenuOpen: false,
    });

  chooseTagIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          // aspect: [17, 4],
          // quality: 0.8,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              tagIconURI: result.uri,
              tagIconData: getFileData(result),
              tagIconValidationError: false,
            });
          }
        });
      } else {
        // alert("Please allow permission to choose cover image");
        alert("Please allow permission to upload file");
      }
    });
  };

  render = () => {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;

    return (
      <Container>
        <OverlayLoader visible={this.state.isLoading} />
        <Header
          leftIconName={"arrow-back"}
          title={"Add Tag"}
          leftIconShow={true}
          rightIconShow={false}
          leftButtonFunc={this.gotoBack}
        />
        <View
          style={[styles.container, { padding: Colors.formPaddingHorizontal }]}
        >
          <ScrollView ref={this.formScrollViewRef}>
            <View style={styles.boxBorder}>
              <InputDropdown
                label={i18n.t("assignfor")}
                value={this.state.selectionTypeName}
                isOpen={this.state.isSelectionTypeMenuOpen}
                items={this.state.selectionTypes}
                openAction={this.toggleSelectionTypeMenu}
                closeAction={this.toggleSelectionTypeMenu}
                setValue={this.setSelectionTypeData}
                // placeholder="Select Incident Related To"
                labelStyle={styles.labelName}
                textFieldStyle={styles.textfield}
                style={[
                  styles.fieldBox,
                  this.state.hasTypeValidationError
                    ? styles.errorFieldBox
                    : null,
                ]}
              />
              {this.state.selectionTypeError ? (
                // <Text style={styles.errorText}>Select tag group name</Text>
                <Text style={styles.errorText}>
                  {i18n.t("this_field_should_not_be_empty")}
                </Text>
              ) : null}

              <InputDropdown
                label={i18n.t("groupName")}
                value={this.state.tagGroupName}
                isOpen={this.state.isGroupMenuOpen}
                items={this.state.tagGroups}
                openAction={this.toggleSectionMenu}
                closeAction={this.toggleSectionMenu}
                setValue={this.handleSetValues}
                // placeholder="Select Sections"
                labelStyle={styles.labelName}
                textFieldStyle={styles.textfield}
                style={[styles.fieldBox]}
              />
              {this.state.tagGroupNameError ? (
                // <Text style={styles.errorText}>Select tag group name</Text>
                <Text style={styles.errorText}>
                  {i18n.t("this_field_should_not_be_empty")}
                </Text>
              ) : null}
              <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>{i18n.t("tagName")}</Text>
                <TextInput
                  value={this.state.tagName}
                  style={[styles.textfield, styles.width60]}
                  onChangeText={(tagName) => this.setState({ tagName })}
                  autoCompleteType="off"
                  autoCapitalize="words"
                />
                  </View>
                {this.state.tagNameError ? (
                  // <Text style={styles.errorText}>Enter tag name</Text>
                  <Text style={styles.errorText}>
                    {i18n.t("this_field_should_not_be_empty")}
                  </Text>
                ) : null}
              <View style={[styles.fieldBox,styles.bbw0]}>
                <Text style={styles.labelName}>{i18n.t("coverImage")}</Text>
                <TouchableOpacity
                  activeOpacity={1}
                  // style={styles.imageContainer}
                  onPress={this.chooseTagIcon}
                >
                  {typeof this.state.tagIconURI !== "undefined" ? (
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={{ uri: this.state.tagIconURI }}
                    />
                  ) : (
                    <Ionicons name="image" size={25} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.tagIconValidationError ? (
                <View style={{ marginRight: 10 }}>
                  {/* <Text style={styles.errorText}>Choose cover image</Text> */}
                  <Text style={styles.errorText}>
                    {i18n.t("this_field_should_not_be_empty")}
                  </Text>
                </View>
              ) : null}
              {/* <
               */}
              {/* <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>{`Upload Photo`}</Text>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.dateField}
                onPress={this.chooseIncidentPhotos}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={30}
                  color="#444"
                />
              </TouchableOpacity>
            </View>
            {this.state.medicalImages.length > 0 ? (
              <View style={[styles.fieldBox]}>
                <ScrollView
                  contentContainerStyle={{ alignItems: "center" }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.medicalImages.map((item, index) => {
                    return (
                      <View key={index}>
                        <Image
                          source={{ uri: item.uri }}
                          style={{
                            height: 100,
                            width: 100,
                            marginHorizontal: 3,
                            borderWidth: 0.6,
                            borderColor: "rgba(68,68,68,0.4)",
                          }}
                        />
                        <TouchableOpacity
                          style={{ position: "absolute", right: -2, top: -3 }}
                          onPress={() => {
                            this.removeImage(item);
                          }}
                        >
                          <Entypo
                            name="circle-with-cross"
                            size={24}
                            color="rgba(68,68,68,0.9)"
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null} */}
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity activeOpacity={1} onPress={this.addTag}>
                <Text style={[styles.buttonText, styles.saveBtnText]}>
                  {i18n.t("save")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
                <Text style={[styles.buttonText, styles.exitBtnText]}>
                  {i18n.t("exit")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Container>
    );
  };
}
