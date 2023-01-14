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
  emailExist,
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

export default class AddUser extends React.Component {
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
      email_exist: false,
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

        // console.log("employeer>>>>>>>>", response[6]);

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
          console.log(userData.username);
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

  checkEmail = (email) => {
    this.setState({ email , emailValidationFailed: false,});
    let emailRegx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let user_id = 0;
    if (parseInt(this.state.id) > 0) {
      user_id = this.state.id;
    }
    if (email.length > 5 && emailRegx.test(email)) {
      emailExist(email, user_id)
        .then((res) => {
          console.log(res);
          this.setState(
            {
              email_exist: res == true ? true : false,
              // mobile : res == true ? '' : mobile
            }
            // ,()=>console.log(this.state.mobile_exist)
          );
        })
        .catch((err) => console.log(err));
    } else {
      this.setState({
        emailValidationFailed: true,
        email_exist: true,
      })
    }

    // this.setState({ mobile })
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

        if (fullName.trim().length === 0) {
          this.setState({ fullNameValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (mobile.trim().length === 0 || !mobileRegx.test(mobile)) {
          this.setState({ mobileValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (email.trim().length === 0 || !emailRegx.test(email)) {
          this.setState({ emailValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (username.trim().length === 0) {
          this.setState({ usernameValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        } else if ((parseInt(id) === 0) & (password.trim().length < 6)) {
          this.setState({ passwordValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof deptCode === "undefined") {
          this.setState({ selectedDepartmentValidationFailed: true });
          return false;
        } else if (typeof desgCode === "undefined") {
          this.setState({ selectedDesignationValidationFailed: true });
          return false;
        }
        // else if (selectedActionTypes.length === 0) {
        //   this.setState({ actionTypesValidationFailed: true });
        //   return false;
        // } else if (selectJournalReview.length === 0) {
        //   this.setState({ journalReviewValidationFailed: true });
        //   return false;
        // }
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
            cid: this.context.userDetails.cid,
            full_name: getCapitalizeTextWithoutExtraSpaces(fullName),
            mobile: mobile,
            email: email,
            employeer_id: employeer_id,
            employeer_name: employeer_name,
            report_manager_id: report_manager_id,
            report_manager_name: report_manager_name,
            dept_code: this.state.deptCode,
            desg_code: this.state.desgCode,
            profile_image: imageData,
            // status: Number(activeStatus),
            // reason: reason,
            // action_types: selectedActionTypes.join(","),
            // journal_action_types: selectJournalReview.join(","),
            // animal_class: animalClass.join(","),
            // animal_category: categories.join(","),
            // animal_sub_category: subCategories.join(","),
            // animal_common_name: commonNames.join(","),
            // module_permissions: userModulePermissions.join(","),
          };
          if (parseInt(id) === 0) {
            reqObj.username = username;
            reqObj.password = password;
          }

          manageUser(reqObj)
            .then((response) => {
              // console.log(response);
              this.setState(
                {
                  showLoader: false,
                },
                () => {
                  Alert.alert(
                    response.message,
                    "Do you want to add permission now ?",
                    [
                      {
                        text: "Yes",
                        onPress: () =>
                          this.props.navigation.navigate("AddUserPermission", {
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
          parseInt(this.state.id) > 0
            ? "Edit User Basic Details"
            : "Add User Basic Details"
        }
        chngPass={parseInt(this.state.id) > 0 ? this.changePassword : undefined}
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
              onPress={this.choosePhoto}
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
            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Full Name</Text>
              <TextInput
                value={this.state.fullName}
                onChangeText={(fullName) => this.setState({ fullName })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
            {this.state.fullNameValidationFailed ? (
              <Text style={globalStyles.errorText}>Enter full name</Text>
            ) : null}

            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Mobile No.</Text>
              <TextInput
                value={this.state.mobile}
                onChangeText={this.checkMobile}
                style={[
                  globalStyles.textfield,
                  { width: this.state.mobile?.length == 10 ? "32%" : "60%" },
                ]}
                autoCompleteType="off"
                keyboardType="number-pad"
                maxLength={10}
              />
              {this.state.mobile?.length == 10 ? (
                this.state.mobile_exist ? (
                  <Entypo name="cross" size={24} color="red" />
                ) : (
                  <Ionicons name="checkmark-done" size={24} color="green" />
                )
              ) : null}
            </View>
            {this.state.mobileValidationFailed ? (
              <Text style={globalStyles.errorText}>
                Enter 10 digit mobile no.
              </Text>
            ) : null}
            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Official Email ID</Text>
              <TextInput
                value={this.state.email}
                onChangeText={this.checkEmail}
                style={[globalStyles.textfield, { width: this.state.email?.length > 5 ? "40%" : "60%" }]}
                autoCompleteType="off"
                autoCapitalize="none"
                multiline={true}
                keyboardType="email-address"
              />
              {this.state.email.length > 5 ?
                this.state.email_exist ? (
                  <Entypo name="cross" size={24} color="red" />
                ) : (
                  <Ionicons name="checkmark-done" size={24} color="green" />
                )
                : null
              }
            </View>
            {this.state.emailValidationFailed ? (
              <Text style={globalStyles.errorText}>
                Enter official email address
              </Text>
            ) : null}

            <View>
              <InputDropdown
                label={"Employeer"}
                value={this.state.employeer_name}
                isOpen={this.state.isEmployeerOpen}
                items={this.state.employeer}
                openAction={this.toggleEmployeerOption}
                closeAction={this.toggleEmployeerOption}
                setValue={this.setEmployeerData}
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={globalStyles.fieldBox}
              />
            </View>
            {this.state.selectedDepartmentValidationFailed ? (
              <Text style={globalStyles.errorText}>Choose Department</Text>
            ) : null}

            <View>
              <InputDropdown
                label={"Reporting Manager"}
                value={this.state.report_manager_name}
                isOpen={this.state.isReportManagerOpen}
                items={this.state.reportingManager}
                openAction={this.toggleReportManagerOption}
                closeAction={this.toggleReportManagerOption}
                setValue={this.setReportManagerData}
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={globalStyles.fieldBox}
              />
            </View>
            {this.state.selectedDepartmentValidationFailed ? (
              <Text style={globalStyles.errorText}>Choose Department</Text>
            ) : null}

            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>User Name</Text>
              <TextInput
                editable={parseInt(this.state.id) > 0 ? false : true}
                value={this.state.username}
                onChangeText={(username) => this.setState({ username })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="none"
              />
            </View>
            {this.state.usernameValidationFailed ? (
              <Text style={globalStyles.errorText}>Enter username</Text>
            ) : null}

            {parseInt(this.state.id) > 0 ? null : (
              <>
                <View style={globalStyles.fieldBox}>
                  <Text style={globalStyles.labelName}>Password</Text>
                  <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    style={[globalStyles.textfield, globalStyles.width60]}
                    autoCompleteType="off"
                    autoCapitalize="none"
                  />
                </View>
                {this.state.passwordValidationFailed ? (
                  <Text style={globalStyles.errorText}>
                    Password takes atleast 6 charecters
                  </Text>
                ) : null}
              </>
            )}

            <View>
              <InputDropdown
                label={"Department"}
                value={this.state.deptName}
                isOpen={this.state.isDeptMenuOpen}
                items={this.state.departments}
                openAction={this.toggleDeptMenu}
                closeAction={this.toggleDeptMenu}
                setValue={this.setDeptData}
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={globalStyles.fieldBox}
              />
            </View>
            {this.state.selectedDepartmentValidationFailed ? (
              <Text style={globalStyles.errorText}>Choose Department</Text>
            ) : null}

            <View>
              <InputDropdown
                label={"Designations"}
                value={this.state.desgName}
                isOpen={this.state.isDesgMenuOpen}
                items={this.state.designations}
                openAction={this.toggleDesgMenu}
                closeAction={this.toggleDesgMenu}
                setValue={this.setDesgData}
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={[globalStyles.fieldBox, globalStyles.bbw0]}
              />
            </View>
            {this.state.selectedDesignationValidationFailed ? (
              <Text style={globalStyles.errorText}>Choose Designation</Text>
            ) : null}
          </View>
          {this.state.qr_code_image !== null ? (
            <View style={globalStyles.qrCodeContainer}>
              <Image
                source={{ uri: this.state.qr_code_image }}
                style={globalStyles.qrDownloadImage}
              />
              <DownloadFile
                url={this.state.qr_code_image}
                viewStyle={globalStyles.downloadBtn}
                textStyle={globalStyles.downloadFileButtonText}
                design={<AntDesign name="download" size={20} />}
                text={"Download"}
              />
            </View>
          ) : null}

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              // disabled={this.state.mobile_exist || this.state.email_exist}
              // style={globalStyles.button}
              onPress={this.saveData}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  this.state.mobile_exist || this.state.email_exist
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
      <Modal
        isVisible={this.state.isChngPassword}
        coverScreen={false}
        onBackdropPress={() => this.setState({ isChngPassword: false })}
      >
        <View style={[globalStyles.popupContainer, globalStyles.mt60]}>
          <Text style={globalStyles.popupText}>Change Old Password</Text>
          <View style={[globalStyles.boxBorder, { marginTop: 10 }]}>
            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>New Password:</Text>
              <TextInput
                secureTextEntry={true}
                value={this.state.pass}
                onChangeText={(pass) => this.setState({ pass })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCapitalize="none"
                placeholder="Password"
              />
            </View>
            {this.state.passValidationFailed ? (
              <Text style={globalStyles.errorText}>
                Enter atleast 6 digit Password
              </Text>
            ) : null}

            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>Confirm Password:</Text>
              <TextInput
                value={this.state.cPass}
                onChangeText={(cPass) => this.setState({ cPass })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
            {this.state.cPassValidationFailed ? (
              <Text style={globalStyles.errorText}>
                Confirm Password not Match
              </Text>
            ) : null}
          </View>
          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              // style={globalStyles.button}
              onPress={this.savePassword}
            >
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                Confirm Change
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              // style={globalStyles.button}
              onPress={() => this.setState({ isChngPassword: false })}
            >
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
