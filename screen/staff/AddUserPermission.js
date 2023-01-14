import React from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Container } from "native-base";
import {
  Header,
  Checkbox,
  MultiSelectDropdown,
  OverlayLoader,
  InputDropdown,
} from "../../component";

import {
  getAnimalGroups,
  getAllCategory,
  getAllSubCategory,
  getCommonNames,
} from "../../services/APIServices";
import {
  getUserDetails,
  manageUser,
  getDepartments,
  getDesignations,
  getEmplyeer,
  getReportingManager,
  getUsers,
  manage_password,
  manageUserPermission,
} from "../../services/UserManagementServices";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import AppContext from "../../context/AppContext";
import {
  getCapitalizeTextWithoutExtraSpaces,
  getFileData,
} from "../../utils/Util";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DownloadFile from "../../component/DownloadFile";
import globalStyles from "../../config/Styles";
import MultiSelectforUser from "./../../component/MultiSelectforUser";
import { mobileExist } from "./../../services/UserManagementServices";
import Modal from "react-native-modal";

export default class AddUserPermission extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      animalGroups: [],
      animalCategories: [],
      animalSubCategories: [],
      animalCommonNames: [],
      departments: [],
      designations: [],
      modulePermissions: [],
      id: props.route.params.hasOwnProperty("id") ? props.route.params.id : 0,
      deptCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.deptCode
          : undefined,
      deptName:
        typeof props.route.params !== "undefined"
          ? props.route.params.deptName
          : undefined,
      desgCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.desgCode
          : undefined,
      desgName:
        typeof props.route.params !== "undefined"
          ? props.route.params.desgName
          : undefined,
      username: "",
      password: "",
      fullName: "",
      mobile: "",
      email: "",
      qr_code_image: null,
      selectedActionTypes: [],
      selectJournalReview: [],
      selectedModulePermissions: [],
      selectedAnimalGroups: [],
      selectedAnimalCategories: [],
      selectedAnimalSubCategories: [],
      selectedAnimalCommonNames: [],
      showLoader: true,
      fullNameValidationFailed: false,
      mobileValidationFailed: false,
      emailValidationFailed: false,
      usernameValidationFailed: false,
      passwordValidationFailed: false,
      actionTypesValidationFailed: false,
      modulePermissionsValidationFailed: false,
      animalClassValidationFailed: false,
      animalCategoryValidationFailed: false,
      animalSubCategoryValidationFailed: false,
      animalCommonNameValidationFailed: false,
      selectedDesignationValidationFailed: false,
      selectedDepartmentValidationFailed: false,
      journalReviewValidationFailed: false,
      isDeptMenuOpen: false,
      isDesgMenuOpen: false,
      isEmployeerOpen: false,
      isReportManagerOpen: false,
      imageURI: undefined,
      imageData: undefined,
      employeer: [],
      reportingManager: [],
      employeer_name:
        typeof props.route.params !== "undefined"
          ? props.route.params.employeer_name
          : undefined,
      employeer_id:
        typeof props.route.params !== "undefined"
          ? props.route.params.employeer_id
          : undefined,
      report_manager_name:
        typeof props.route.params !== "undefined"
          ? props.route.params.report_manager_name
          : undefined,
      report_manager_id:
        typeof props.route.params !== "undefined"
          ? props.route.params.report_manager_id
          : undefined,
      activeStatus: true,
      reason: "",
      mobile_exist: false,
      cPass: "",
      pass: "",
      isChngPassword: false,
      passValidationFailed: false,
      cPassValidationFailed: false,
    };

    this.formScrollViewRef = React.createRef();
    this.messageDialogRef = React.createRef();
  }

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;
    let methods = [
      getAnimalGroups(cid),
      getAllCategory(cid),
      getAllSubCategory(cid),
      getCommonNames({ cid }),
      getDepartments(cid),
      getDesignations({ cid }),
      getEmplyeer(cid),
      getUsers(cid),
    ];

    if (parseInt(this.state.id) > 0) {
      console.log("zHell0o");
      methods.push(getUserDetails(this.state.id));
    }

    Promise.all(methods)
      .then((response) => {
        let animalGroups = response[0].map((v, i) => ({
          id: v.id,
          name: v.group_name,
        }));

        let animalCategories = response[1].map((v, i) => ({
          id: v.id,
          name: v.cat_name,
        }));

        let animalSubCategories = response[2].map((v, i) => ({
          id: v.id,
          name: v.cat_name,
        }));

        let animalCommonNames = response[3].map((v, i) => ({
          id: v.id,
          name: v.common_name,
        }));

        let department = response[4].map((item) => {
          return {
            id: item.id,
            name: item.dept_name,
            value: item.dept_code,
          };
        });

        let designation = response[5].map((item) => {
          return {
            id: item.id,
            name: item.desg_name,
            value: item.desg_code,
          };
        });

        let employeer = response[6].map((item) => {
          return {
            id: item.id,
            name: item.name,
            value: item.id,
          };
        });

        console.log("employeer>>>>>>>>", response[6]);

        let reportingManagers = response[7].map((item) => {
          return {
            id: item.id,
            name: item.full_name,
            value: item.id,
          };
        });

        let stateObj = {
          showLoader: false,
          animalGroups: animalGroups,
          animalCategories: animalCategories,
          animalSubCategories: animalSubCategories,
          animalCommonNames: animalCommonNames,
          departments: department,
          designations: designation,
          employeer: employeer,
          modulePermissions: Configs.HOME_SCREEN_MENUES,
          reportingManager: reportingManagers,
        };

        if (parseInt(this.state.id) > 0) {
          let userData = response[8];
          let selectedAnimalGroups = animalGroups.filter((element) =>
            (userData.animal_class || []).includes(element.id)
          );

          let selectedAnimalCategories = animalCategories.filter((element) =>
            (userData.animal_category || []).includes(element.id)
          );

          let selectedAnimalSubCategories = animalSubCategories.filter(
            (element) =>
              (userData.animal_sub_category || []).includes(element.id)
          );

          let selectedAnimalCommonNames = animalCommonNames.filter((element) =>
            (userData.animal_common_name || []).includes(element.id)
          );

          let selectedModulePermissions = Configs.HOME_SCREEN_MENUES.filter(
            (element) =>
              (userData.module_permissions || []).includes(element.id)
          );
          console.log(userData.action_types);
          stateObj.fullName = userData.full_name;
          stateObj.mobile = userData.mobile;
          stateObj.email = userData.email;
          stateObj.username = userData.username;
          stateObj.qr_code_image = userData.qr_code_image;
          stateObj.selectedActionTypes = userData.action_types;
          stateObj.selectJournalReview = userData.journal_action_types;
          stateObj.selectedAnimalGroups = selectedAnimalGroups;
          stateObj.selectedAnimalCategories = selectedAnimalCategories;
          stateObj.selectedAnimalSubCategories = selectedAnimalSubCategories;
          stateObj.selectedAnimalCommonNames = selectedAnimalCommonNames;
          stateObj.selectedModulePermissions = selectedModulePermissions;
          stateObj.imageURI = userData
            ? Configs.PROFILE_URL + userData.image
            : undefined;
        }

        this.setState(stateObj);
        // this.setState({ mobile_exist : false,})
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => this.props.navigation.goBack();
  toggleEmployeerOption = () =>
    this.setState({ isEmployeerOpen: !this.state.isEmployeerOpen });
  toggleReportManagerOption = () =>
    this.setState({ isReportManagerOpen: !this.state.isReportManagerOpen });
  toggleDeptMenu = () =>
    this.setState({ isDeptMenuOpen: !this.state.isDeptMenuOpen });
  toggleDesgMenu = () =>
    this.setState({ isDesgMenuOpen: !this.state.isDesgMenuOpen });

  setEmployeerData = (v) =>
    this.setState({
      employeer_id: v.value,
      employeer_name: v.name,
      isEmployeerOpen: false,
    });

  setReportManagerData = (v) =>
    this.setState({
      report_manager_id: v.value,
      report_manager_name: v.name,
      isReportManagerOpen: false,
    });

  setDeptData = (v) =>
    this.setState({
      deptCode: v.value,
      deptName: v.name,
      desgCode: undefined,
      desgName: "",
      isDeptMenuOpen: false,
    });

  setDesgData = (v) =>
    this.setState({
      desgCode: v.value,
      desgName: v.name,
      isDesgMenuOpen: false,
    });

  setDesignation = (v) =>
    this.setState({
      designation: v.name,
    });

  setActionType = (type) => {
    let { selectedActionTypes } = this.state;

    if (selectedActionTypes.includes(type)) {
      selectedActionTypes = selectedActionTypes.filter(
        (element) => element !== type
      );
    } else {
      selectedActionTypes.push(type);
    }

    this.setState({ selectedActionTypes });
  };

  setJournalReview = (type) => {
    let { selectJournalReview } = this.state;

    if (selectJournalReview.includes(type)) {
      selectJournalReview = selectJournalReview.filter(
        (element) => element !== type
      );
    } else {
      selectJournalReview.push(type);
    }

    this.setState({ selectJournalReview });
  };

  status = () => {
    this.setState({ activeStatus: !this.state.activeStatus });
  };

  setSelectedModulePermissions = (item) =>
    this.setState({ selectedModulePermissions: item });

  setSelectedAnimalGroups = (item) =>
    this.setState({ selectedAnimalGroups: item });

  setSelectedAnimalCategories = (item) =>
    this.setState({ selectedAnimalCategories: item });

  setSelectedAnimalSubCategories = (item) =>
    this.setState({ selectedAnimalSubCategories: item });

  setSelectedAnimalCommonNames = (item) =>
    this.setState({ selectedAnimalCommonNames: item });

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  downloadFile = () => {
    let fileName = new Date().valueOf();
    fileName += ".png";
    FileSystem.downloadAsync(
      this.state.qr_code_image,
      FileSystem.documentDirectory + fileName
    )
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        // this.messageDialogRef.current.openDialog(
        // 	"Success",
        // 	"File saved to your device"
        // );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  checkMobile = (mobile) => {
    this.setState({ mobile });
    let user_id = 0;
    if (parseInt(this.state.id) > 0) {
      user_id = this.state.id;
    }
    if (mobile.length == 10) {
      mobileExist(mobile, user_id)
        .then((res) => {
          console.log(res);
          this.setState(
            {
              mobile_exist: res == true ? true : false,
              // mobile : res == true ? '' : mobile
            }
            // ,()=>console.log(this.state.mobile_exist)
          );
        })
        .catch((err) => console.log(err));
    }

    // this.setState({ mobile })
  };

  saveData = () => {
    let {
      id,
      fullName,
      mobile,
      email,
      employeer_id,
      employeer_name,
      report_manager_id,
      report_manager_name,
      username,
      password,
      deptCode,
      desgCode,
      selectedActionTypes,
      selectJournalReview,
      selectedAnimalGroups,
      selectedAnimalCategories,
      selectedAnimalSubCategories,
      selectedAnimalCommonNames,
      imageData,
      selectedModulePermissions,
      activeStatus,
      reason,
    } = this.state;

    this.setState(
      {
        fullNameValidationFailed: false,
        mobileValidationFailed: false,
        emailValidationFailed: false,
        usernameValidationFailed: false,
        passwordValidationFailed: false,
        actionTypesValidationFailed: false,
        journalReviewValidationFailed: false,
        animalClassValidationFailed: false,
        animalCategoryValidationFailed: false,
        animalSubCategoryValidationFailed: false,
        animalCommonNameValidationFailed: false,
        selectedDesignationValidationFailed: false,
        selectedDepartmentValidationFailed: false,
        qrCodeValueValidationFailed: false,
      },
      () => {
        let mobileRegx = /^\d{10}$/;
        let emailRegx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        if (selectedActionTypes.length === 0) {
          this.setState({ actionTypesValidationFailed: true });
          return false;
        } else if (selectJournalReview.length === 0) {
          this.setState({ journalReviewValidationFailed: true });
          return false;
        }
        // else if (selectedAnimalGroups.length === 0) {
        // 	this.setState({ animalClassValidationFailed: true });
        // 	return false;
        // } else if (selectedAnimalCategories.length === 0) {
        // 	this.setState({ animalCategoryValidationFailed: true });
        // 	return false;
        // } else if (selectedAnimalSubCategories.length === 0) {
        // 	this.setState({ animalSubCategoryValidationFailed: true });
        // 	return false;
        // } else if (selectedAnimalCommonNames.length === 0) {
        // 	this.setState({ animalCommonNameValidationFailed: true });
        // 	return false;
        // }
        else {
          this.setState({ showLoader: true });
          let animalClass = selectedAnimalGroups.map((v, i) => v.id);
          let categories = selectedAnimalCategories.map((v, i) => v.id);
          let subCategories = selectedAnimalSubCategories.map((v, i) => v.id);
          let commonNames = selectedAnimalCommonNames.map((v, i) => v.id);
          let userModulePermissions = selectedModulePermissions.map(
            (v, i) => v.id
          );
          let reqObj = {
            id: this.state.id,
            // status: Number(activeStatus),
            // reason: reason,
            action_types: selectedActionTypes.join(","),
            journal_action_types: selectJournalReview.join(","),
            animal_class: animalClass.join(","),
            animal_category: categories.join(","),
            animal_sub_category: subCategories.join(","),
            animal_common_name: commonNames.join(","),
            module_permissions: userModulePermissions.join(","),
          };
          //   if (parseInt(id) === 0) {
          //     reqObj.username = username;
          //     reqObj.password = password;
          //   }

          manageUserPermission(reqObj)
            .then((response) => {
              this.setState(
                {
                  showLoader: false,
                },
                () => {
                  Alert.alert(
                    response.message,
                    "Do you want to add profile details now ?",
                    [
                      {
                        text: "Yes",
                        onPress: () =>
                          this.props.navigation.navigate("EditUserProfile", {
                            id: response.id,
                          }),
                      },
                      {
                        text: "No",
                        style: "cancel",
                        onPress: () => this.gotoBack(),
                      },
                    ]
                  );
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

  choosePhoto = () => {
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
            });
          }
        });
      } else {
        Alert.alert("Please allow permission to choose an icon");
      }
    });
  };

  changePassword = () => {
    this.setState({ isChngPassword: !this.state.isChngPassword });
  };

  savePassword = () => {
    this.setState({
      passValidationFailed: false,
      cPassValidationFailed: false,
      showLoader: true,
    });
    if ((parseInt(this.state.id) > 0) & (this.state.pass.trim().length < 6)) {
      this.setState({ passValidationFailed: true, showLoader: false });
      return false;
    } else if (this.state.pass != this.state.cPass) {
      this.setState({ cPassValidationFailed: true, showLoader: false });
      return false;
    } else {
      let obj = {
        user_id: this.state.id,
        password: this.state.pass,
      };
      manage_password(obj)
        .then((res) => {
          this.setState(
            { showLoader: false, isChngPassword: false, pass: "", cPass: "" },
            () => {
              alert(res.message);
            }
          );
        })
        .catch((err) => {
          console.log(err);
          this.setState({ showLoader: false });
        });
    }
  };

  render = () => (
    <Container>
      <Header
        title={
          this.state.showLoader == false
            ? this.state.fullName.split(" ")[0] + "'s Permissions"
            : ""
        }
      />
      <View style={[globalStyles.container, globalStyles.p5]}>
        <ScrollView ref={this.formScrollViewRef} nestedScrollEnabled>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              marginTop: 5,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              //   onPress={this.choosePhoto}
              style={{ borderRadius: 100, overflow: "hidden", borderWidth: 1 }}
            >
              {typeof this.state.imageURI !== "undefined" ? (
                <Image
                  style={{ height: 75, width: 75 }}
                  source={{ uri: this.state.imageURI }}
                />
              ) : (
                <Ionicons
                  name="image"
                  style={{ fontSize: 60, color: "#adadad" }}
                />
              )}
            </TouchableOpacity>
            {this.state.fullNameValidationFailed ? (
              <Text style={globalStyles.errorText}>Choose a Image</Text>
            ) : null}
          </View>
          <View style={globalStyles.boxBorder}>
            <View style={{ padding: 10 }}>
              <Text style={[globalStyles.labelName, { marginBottom: 0 }]}>
                Action Type:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                  flexWrap: "wrap",
                }}
              >
                {Configs.USER_ACTION_TYPES.map((item) => (
                  <Checkbox
                    key={item.id}
                    activeOpacity={1}
                    label={item.name}
                    checked={this.state.selectedActionTypes.includes(item.id)}
                    checkedColor={Colors.primary}
                    uncheckedColor={Colors.primary}
                    onChange={this.setActionType.bind(this, item.id)}
                    labelStyle={[globalStyles.labelName, globalStyles.mb0]}
                  />
                ))}
              </View>
            </View>
            {this.state.actionTypesValidationFailed ? (
              <Text style={globalStyles.errorText}>
                Choose atleast one action type
              </Text>
            ) : null}

            <View style={{ padding: 10 }}>
              <Text style={[globalStyles.labelName, { marginBottom: 0 }]}>
                Journal Review:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {Configs.JOURNAL_REVIEW_MENU.map((item) => (
                  <Checkbox
                    key={item.id}
                    activeOpacity={1}
                    label={item.name}
                    checked={this.state.selectJournalReview.includes(item.id)}
                    checkedColor={Colors.primary}
                    uncheckedColor={Colors.primary}
                    onChange={this.setJournalReview.bind(this, item.id)}
                    labelStyle={[globalStyles.labelName, globalStyles.mb0]}
                  />
                ))}
              </View>
              {this.state.journalReviewValidationFailed ? (
                <Text style={globalStyles.errorText}>
                  Choose atleast one journal review
                </Text>
              ) : null}
            </View>

            {/* <View style={{ borderColor: "#ddd", borderBottomWidth: 1 }}>
              <Text style={[globalStyles.labelName, { marginBottom: 0 }]}>
                Status:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Checkbox
                  activeOpacity={1}
                  label={this.state.activeStatus ? "Active" : "Inactive"}
                  checked={this.state.activeStatus}
                  checkedColor={Colors.primary}
                  uncheckedColor={Colors.primary}
                  onChange={this.status.bind()}
                  labelStyle={[globalStyles.labelName, globalStyles.mb0]}
                />
              </View>
            </View>
            {this.state.activeStatus ? null : (
              <View style={globalStyles.fieldBox}>
                <Text style={globalStyles.labelName}>Reason</Text>
                <TextInput
                  value={this.state.reason}
                  multiline={true}
                  onChangeText={(reason) => this.setState({ reason })}
                  style={[globalStyles.textfield, globalStyles.width60]}
                  autoCompleteType="off"
                  autoCapitalize="none"
                />
              </View>
            )} */}

            <View style={globalStyles.fieldBox}>
              <MultiSelectforUser
                label={"Module Permissions"}
                items={this.state.modulePermissions}
                selectedItems={this.state.selectedModulePermissions}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setSelectedModulePermissions}
                listView={true}
              />
            </View>

            <View style={globalStyles.fieldBox}>
              <MultiSelectforUser
                label={"Animal Class"}
                items={this.state.animalGroups}
                selectedItems={this.state.selectedAnimalGroups}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setSelectedAnimalGroups}
                listView={true}
              />
            </View>
            {this.state.animalClassValidationFailed ? (
              <Text style={globalStyles.errorText}>Select an option</Text>
            ) : null}

            <View style={globalStyles.fieldBox}>
              <MultiSelectforUser
                label={"Animal Category"}
                items={this.state.animalCategories}
                selectedItems={this.state.selectedAnimalCategories}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setSelectedAnimalCategories}
                listView={true}
              />
            </View>
            {this.state.animalCategoryValidationFailed ? (
              <Text style={globalStyles.errorText}>Select an option</Text>
            ) : null}

            <View style={globalStyles.fieldBox}>
              <MultiSelectforUser
                label={"Animal Sub Category"}
                items={this.state.animalSubCategories}
                selectedItems={this.state.selectedAnimalSubCategories}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setSelectedAnimalSubCategories}
                listView={true}
              />
            </View>
            {this.state.animalSubCategoryValidationFailed ? (
              <Text style={globalStyles.errorText}>Select an option</Text>
            ) : null}

            <View
              style={[
                globalStyles.fieldBox,
                globalStyles.pb0,
                globalStyles.bbw0,
              ]}
            >
              <MultiSelectforUser
                label={"Animal Common Names"}
                items={this.state.animalCommonNames}
                selectedItems={this.state.selectedAnimalCommonNames}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setSelectedAnimalCommonNames}
                listView={true}
              />
            </View>
            {this.state.animalCommonNameValidationFailed ? (
              <Text style={globalStyles.errorText}>Select an option</Text>
            ) : null}
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              disabled={this.state.mobile_exist}
              // style={globalStyles.button}
              onPress={this.saveData}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  this.state.mobile_exist
                    ? globalStyles.exitBtnText
                    : globalStyles.saveBtnText,
                ]}
              >
                {this.state.id == 0 ? "SAVE" : "UPDATE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              // style={globalStyles.button}
              onPress={this.gotoBack}
            >
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>
                BACK
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		padding: 8
// 	},
// 	fieldBox: {
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
// 	name: {
// 		color: Colors.labelColor,
//         // lineHeight: 40,
//         fontSize: 19,
//         paddingLeft: 4,
//         height: 'auto',
//         paddingVertical: 10
// 	},
// 	inputText: {
// 		backgroundColor: "#fff",
//         height: 'auto',
//         flexWrap:'wrap',
//         fontSize: 19,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
// 	},
// 	downloadBtn: {
// 		flexDirection: "row",
// 		// width: "45%",
// 		paddingHorizontal: 10,
// 		paddingVertical: 6,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
// 		marginHorizontal: 10,
// 	},
// 	selectedItemsContainer: {
// 		width: "100%",
// 		height: "auto",
// 		backgroundColor: "#fff",
// 		paddingVertical: 8,
// 		flexDirection: "row",
// 		flexWrap: "wrap",
// 		alignItems: "flex-start",
// 	},
// 	qrCodeContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		marginTop: 20,
// 	},
// 	placeholderStyle: {
// 		fontSize: 18,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 30,
// 	},
// 	button: {
// 		padding: 5,
// 	},
// 	saveBtnText: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	exitBtnText: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 		color: Colors.activeTab,
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
// 	errorText: {
// 		textAlign: "right",
// 		color: Colors.tomato,
// 		fontWeight: "bold",
// 		fontStyle: "italic",
// 	},
// 	fieldBox: {
// 		alignItems: 'center',
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		height: 'auto',
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 	},
// 	imagePicker: {
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 2,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 		alignItems: "flex-end",
// 		justifyContent: "center",
// 	},
// });
