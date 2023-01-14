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
import Header from "../../component/Header";
import OverlayLoader from "../../component/OverlayLoader";
import { Colors } from "../../config";
import { addDiagnosisName } from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import MultiSelectforUser from "../../component/MultiSelectforUser";
import { userList } from "../../services/UserManagementServices";
import moment from "moment";
import RadioForm from "react-native-simple-radio-button";
import { addAnnouncement } from "../../services/APIServices";
import { join } from "lodash";
import DocumentUpload from "../../component/tasks/DocumentUpload";
import Upload from "../../component/tasks/AddTodo/Upload";
import { MultiSelectDropdown } from "../../component";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddAnnouncement extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      title: props.route.params?.item?.diagnosis ?? "",
      description: props.route.params?.item?.description ?? "",
      showLoader: false,
      hasTitleValidationError: false,
      hasDescriptionValidationError: false,
      users: [],
      selectedUser: [],
      duration: [
        {
          id: 1,
          label: "24 Hours",
          value: "24",
        },
        {
          id: 2,
          label: "48 Hours",
          value: "48",
        },
        {
          id: 3,
          label: "72 Hours",
          value: "72",
        },
        {
          id: 4,
          label: "96 Hours",
          value: "96",
        },
      ],
      duration_id: 0,
      selectedDuration: "24",
      selectedImage: null,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  };

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.getAllData();
      }
    );
  };

  onScreenFocus = () => {
    this.setState(
      {
        showLoader: true,
      },
      () => {
        this.getAllData();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  getAllData = () => {
    userList()
      .then((res) => {
        this.setState({
          users: res.data.map((v, i) => ({
            id: v.id,
            name: `${v.full_name} - ${v.dept_name}`,
          })),
          // selectedUser: res.data.map((v, i) => ({
          //     id: v.id,
          //     name: `${v.full_name} - ${v.dept_name}`,
          // })),
          showLoader: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  gotoBack = () => this.props.navigation.goBack();

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  setSelectedUsers = (item) => this.setState({ selectedUser: item });

  setSelectedImage = (item) => {
    console.log({ item });
    this.setState({ selectedImage: item });
  };

  setDuration = (v) => {
    console.log(v);
    this.setState({
      selectedDuration: v,
      // duration_id : v.id
    });
  };
  addAnnouncement = () => {
    let {
      title,
      description,
      selectedUser,
      users,
      selectedDuration,
      selectedImage,
    } = this.state;
    this.setState(
      {
        hasTitleValidationError: false,
        hasDescriptionValidationError: false,
      },
      () => {
        if (title.trim().length === 0) {
          this.setState({ hasTitleValidationError: true });
          return false;
          // } else if (description.trim().length === 0) {
          //   this.setState({ hasDescriptionValidationError: true });
          //   return false;
        } else {
          this.setState({ showLoader: true });
          let selectUserId =
            selectedUser.length > 0
              ? selectedUser.map((user) => {
                  return { id: user.id };
                })
              : users.map((user) => {
                  return { id: user.id };
                });
          let obj = {
            title: getCapitalizeTextWithoutExtraSpaces(title),
            description: description,
            created_by: this.context.userDetails.id,
            duration: selectedDuration,
            users: JSON.stringify(selectUserId),
            created_at: moment(new Date()).format("Y-M-D H:m:s"),
            image: selectedImage?.imagebase64,
          };

          addAnnouncement(obj)
            .then((response) => {
              console.log({ response });
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((error) => console.log(error));
        }
      }
    );
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={"Add Announcement"}
        leftIconShow={true}
        leftButtonFunc={this.gotoBack}
      />
      <View
        style={[globalStyles.container, { padding: Colors.formPaddingHorizontal }]}
      >
        <ScrollView ref={this.formScrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Title</Text>
              <TextInput
                value={this.state.title}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(title) => this.setState({ title })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.hasIncidentTypeNameValidationError ? (
                <Text style={globalStyles.errorText}>Enter title</Text>
              ) : null}
            </View>

            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Description</Text>
              <TextInput
                multiline={true}
                // numberOfLines={10}
                value={this.state.description}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(description) => this.setState({ description })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>Image</Text>
            </View>
            <Upload
              uploadable={true}
              type={"image"}
              items={this.state.selectedImage}
              topBorder={true}
              singleUpload={true}
              onChange={this.setSelectedImage}
            />
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Duration</Text>
              <View style={[globalStyles.textfield, { width: "65%" }]}>
                <RadioForm
                  radio_props={this.state.duration}
                  initial={Number(this.state.selectedDuration) > 96 ? -1 : 0}
                  animation={false}
                  onPress={this.setDuration}
                  buttonColor={"#63c3a5"}
                  selectedButtonColor={"#63c3a5"}
                  selectedLabelColor={Colors.textColor}
                  labelColor={Colors.textColor}
                  formHorizontal={true}
                  labelHorizontal={true}
                  labelStyle={{ marginHorizontal: 8 }}
                  style={[globalStyles.inputRadio, { width: "100%" }]}
                  buttonSize={15}
                />
                <View
                  style={{
                    borderColor: "#ddd",
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    width: "40%",
                    alignSelf: "flex-end",
                    paddingLeft: 15,
                  }}
                >
                  <TextInput
                    value={this.state.selectedDuration}
                    style={[globalStyles.textfieldTime]}
                    onChangeText={(selectedDuration) =>
                      this.setState({ selectedDuration })
                    }
                    keyboardType="numeric"
                  />
                  <Text style={[globalStyles.textfieldTime, { marginTop: 5 }]}>
                    Hours
                  </Text>
                </View>
              </View>
            </View>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <MultiSelectDropdown
                label={"Select User"}
                items={this.state.users}
                selectedItems={this.state.selectedUser}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setSelectedUsers}
              />
            </View>
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addAnnouncement}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
