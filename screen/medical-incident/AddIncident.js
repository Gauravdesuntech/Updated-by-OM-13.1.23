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
  Button,
  Pressable,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Modal as Modal2 } from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Header,
  Dropdown,
  OverlayLoader,
  MultiSelectDropdown,
} from "../../component";
import ModalMenu from "../../component/ModalMenu";
import InputDropdown from "../../component/InputDropdown";
import { Configs, Colors } from "../../config";
import { getFileData } from "../../utils/Util";
import {
  getIncidentTypes,
  addIncident,
} from "../../services/MedicalAndIncidenTServices";
import {
  getAnimalSections,
  getAllEnclosures,
  getAllAnimals,
} from "../../services/APIServices";
import { getAvailableDepartments } from "../../services/UserManagementServices";
import { getUsers } from "../../services/UserManagementServices";
import { todoList, userList } from "../../utils/api";
import AppContext from "../../context/AppContext";
import Modal from "react-native-modal";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import CustomCheckbox from "../../component/tasks/AddTodo/CustomCheckBox";
import RadioForm from "react-native-simple-radio-button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CachedImage from "expo-cached-image";
import styles from "../../config/Styles";
import { capitalize } from "./../../utils/Util";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import Priority from "../../component/tasks/AddTodo/Priority";
import ScannerButton from "../../component/ScannerButton";

export default class AddIncident extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      isIncidentTypeMenuOpen: false,
      incidentTypes: [],
      incidentTypeId: props.route.params.item?.incident_type ?? undefined,
      sections: [],
      enclosures: [],
      refreshing: false,
      hasRefValidationError: false,
      animals: [],
      users: [],
      departments: [],
      id: props.route.params.item?.id ?? 0,
      typeName: props.route.params.item?.type_name ?? "",
      prority: props.route.params.hasOwnProperty("prority")
        ? props.route.params.prority
        : undefined,
      shortdesc: props.route.params.item?.short_desc ?? "",
      description: props.route.params.item?.description ?? "",
      learning: props.route.params.item?.learning ?? "",
      reported_by_name: props.route.params.item?.full_name ?? "",
      hasIncidentTypesValidationError: false,
      hasPriorityValidationError: false,
      hasDescriptionValidationError: false,
      hasSolutionValidationError: false,
      hasAssignTypeError: false,
      hasAssignValidationError: false,
      showLoader: false,
      priorityID: undefined,
      priorityName: props.route.params.item?.priority ?? undefined,
      solution: props.route.params.item?.solution ?? "",
      currentStatus: props.route.params.item?.status ?? "",
      to_be_closed_by: props.route.params.item?.to_be_closed_by ?? "",
      to_be_closed_by_id:
        props.route.params.item?.to_be_closed_by_id ?? undefined,
      isClosedByMenuOpen: false,
      isCategoryMenuOpen: false,
      category: [],
      selectedCategory: "",
      selectedCategory_id: undefined,
      selectedCategory_name: "",
      reported_by: props.route.params.item?.reported_by ?? "",
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
          name: "Others",
          value: "others",
        },
      ],
      notifyTypes: [
        {
          id: 1,
          label: "Departments",
          value: "Departments",
        },
        {
          id: 2,
          label: "Users",
          value: "Users",
        },
        {
          id: 4,
          label: "Reporting Manager",
          value: "Report_Manager",
        },
        {
          id: 3,
          label: "All",
          value: "All",
        },
      ],
      selectionTypeName: props.route.params?.item?.ref
        ? capitalize(props.route.params.item.ref)
        : props.route.params.selectionType
          ? capitalize(props.route.params.selectionType)
          : "",
      isSelectionTypeMenuOpen: false,
      selectionTypeId: props.route.params?.item?.ref
        ? props.route.params.item.ref
        : props.route.params.selectionType
          ? props.route.params.selectionType
          : undefined,
      ref_id: props.route.params?.item?.ref_id
        ? props.route.params.item.ref_id
        : props.route.params.ref_id
          ? props.route.params.ref_id
          : undefined,
      ref_name: props.route.params?.item?.ref_value
        ? props.route.params.item.ref_value
        : props.route.params.ref_name
          ? props.route.params.ref_name
          : undefined,
      isrefMenuOpen: false,

      isNotifyMenuOpen: false,

      isNotifyDepartmentMenuOpen: false,

      isNotifyUserMenuOpen: false,

      notification_type: "",
      notification_type_value: "",

      notification_type_department_name: "",
      notification_type_user: [],

      saveAndNotifyModalVisible: false,
      saveConfirmModalVisible: false,
      notifyUserModalVisible: false,
      saveAndCreateTaskModalVisible: false,

      section_id: props.route.params?.grand_parent_id
        ? props.route.params?.grand_parent_id
        : props.route.params?.parent_id
          ? props.route.params?.parent_id
          : "",
      section_name: props.route.params?.grand_parent_name
        ? props.route.params?.grand_parent_name
        : props.route.params?.parent_name
          ? props.route.params?.parent_name
          : "",
      enclosure_id: props.route.params?.grand_parent_id
        ? props.route.params?.parent_id
        : "",
      enclosure_name: props.route.params?.grand_parent_name
        ? props.route.params?.parent_name
        : "",
      sections: [],
      enclosuress: [],
      isSectionMenuOpen: false,
      isEnclosureMenuOpen: false,
      imageID: 0,
      incidentImages: [],
      incidentUploadData: [],
      isScanModal: false,
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
    if (this.state.id > 0) {
      if (this.props.route.params?.item.attachment) {
        let images = JSON.parse(this.props.route.params?.item.attachment).map(
          (element, index) => {
            return { id: index + 1, uri: element };
          }
        );
        this.setState({
          incidentImages: images,
          imageID: images.length,
          incidentUploadData: images.map((item) => {
            return getFileData(item);
          }),
        });
      }
    }

    this.setState({
      reported_by_name: this.context.userDetails.full_name,
      reported_by: this.context.userDetails.id,
    });
    let cid = this.context.userDetails.cid;
    const user_id = this.context.userDetails.id;
    Promise.all([
      getIncidentTypes(cid),
      getAnimalSections(cid),
      getAllEnclosures(cid),
      // getAllAnimals(cid),
      userList(cid),
      getAvailableDepartments(),
      todoList(user_id),
    ])
      .then((data) => {
        // console.log(data[3].data.data)
        this.setState({
          incidentTypes: data[0].map((v, i) => ({
            id: v.id,
            name: v.type_name,
            value: v.id,
          })),
          sections: data[1].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
          enclosures: data[2].map((v, i) => ({
            id: v.id,
            name: v.enclosure_id,
            value: v.id,
          })),
          // animals: data[3].map((v, i) => ({
          //     id: v.id,
          //     name: `${v.animal_id} | ${v.animal_name} | ${v.enclosure_name} | ${v.section_name}`,
          //     value: v.id,
          // })),
          users: data[3].data.data.map((v, i) => ({
            id: v.id,
            name: `${v.full_name} - ${v.dept_name}`,
          })),
          departments: data[4].map((v, i) => ({
            id: v.id,
            name: v.dept_name,
            value: v.dept_code,
          })),
          category: data[5].data.data.map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v,
          })),

          showLoader: false,
          refreshing: false,
        });
      })
      .catch((error) => console.log(error));
  };

  toggleNotifyUserMenuOpen = () =>
    this.setState({ isNotifyUserMenuOpen: !this.state.isNotifyUserMenuOpen });

  toggleNotifyDepartmentMenu = () =>
    this.setState({
      isNotifyDepartmentMenuOpen: !this.state.isNotifyDepartmentMenuOpen,
    });

  toggleIncidentTypeMenu = () =>
    this.setState({
      isIncidentTypeMenuOpen: !this.state.isIncidentTypeMenuOpen,
    });
  toggleSelectionTypeMenu = () =>
    this.setState({
      isSelectionTypeMenuOpen: !this.state.isSelectionTypeMenuOpen,
    });
  togglerefMenu = () =>
    this.setState({ isrefMenuOpen: !this.state.isrefMenuOpen });
  toggleClosedMenu = () =>
    this.setState({ isClosedByMenuOpen: !this.state.isClosedByMenuOpen });
  toggleNotifyMenu = () =>
    this.setState({ isNotifyMenuOpen: !this.state.isNotifyMenuOpen });
  toggleSectionMenu = () =>
    this.setState({ isSectionMenuOpen: !this.state.isSectionMenuOpen });
  toggleEnclosureMenu = () =>
    this.setState({ isEnclosureMenuOpen: !this.state.isEnclosureMenuOpen });

  gotoCategory = () => {
    this.props.navigation.goBack();
  };

  setCategoryData = (v) => {
    // console.log("closed_by********",v);return;
    this.setState({
      selectedCategory_id: v.id,
      selectedCategory_name: v.name,
      isCategoryMenuOpen: false,
      hasAssignValidationError: false,
    });
  };

  toggleCategoryMenu = () =>
    this.setState({ isCategoryMenuOpen: !this.state.isCategoryMenuOpen });

  gotoTask = (data) => {
    this.props.navigation.navigate("Todo", {
      screen: "AddCategoryItem",
      params: { task_id: data.task_id },
    });
  };

  setPriority = (v) => {
    this.setState({
      priorityID: v.id,
      priorityName: v.name,
    });
  };

  setIncidentTypeData = (v) =>
    this.setState({
      incidentTypeId: v.value,
      typeName: v.name,
      isIncidentTypeMenuOpen: false,
      hasIncidentTypesValidationError: false,
    });

  setSelectionTypeData = (v) => {
    this.setState({
      selectionTypeId: v.value,
      selectionTypeName: v.name,
      ref_id: undefined,
      ref_name: undefined,
      isSelectionTypeMenuOpen: false,
      hasTypeValidationError: false,
      hasRefValidationError: false
    });
  };

  setNotifyType = (v) => {
    let type = "";
    if (v == "All") {
      type = "All";
    } else if (v == "Report_Manager") {
      type = "Report_Manager";
    } else {
      type = "";
    }
    this.setState({
      isNotifyMenuOpen: false,
      notification_type: v,
      notification_type_value: type,
      hasAssignTypeError: false,
    });
  };

  setref = (v) => {
    this.setState({
      ref_id: v.id,
      ref_name: v.name,
      isrefMenuOpen: false,
    });
  };

  createTask = () => {
    let {
      id,
      selectionTypeId,
      ref_id,
      incidentTypeId,
      categoryName,
      priorityID,
      description,
      solution,
      to_be_closed_by,
    } = this.state;
    this.setState({
      hasIncidentTypesValidationError: false,
      hasDescriptionValidationError: false,
      hasTypeValidationError: false,
      hasRefValidationError: false
    });
    if (typeof selectionTypeId === "undefined") {
      this.setState({
        hasTypeValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      // this.scrollToScrollViewTop();
      return false;
    } else if (selectionTypeId != "others" && typeof ref_id === "undefined") {
      this.setState({
        hasRefValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      // this.scrollToScrollViewTop();
      return false;
    } else if (typeof incidentTypeId === "undefined") {
      this.setState({
        hasIncidentTypesValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      return false;
    } else if (description.trim().length === 0) {
      this.setState({
        hasDescriptionValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      return false;
    }
    // else if (solution.trim().length === 0) {
    //   this.setState({
    //     hasSolutionValidationError: true,
    //     notifyUserModalVisible: false,
    //     saveAndNotifyModalVisible: false,
    //     saveConfirmModalVisible: false,
    //     saveAndCreateTaskModalVisible: false,
    //   });
    //   return false;
    // }
    else {
      this.setState({ saveAndCreateTaskModalVisible: true });
    }
  };

  addIncidentTypes = () => {
    this.props.navigation.navigate("AddIncidentTypes");
  };

  setClosedByData = (v) => {
    // console.log("closed_by********",v);return;
    this.setState({
      to_be_closed_by_id: v.id,
      to_be_closed_by: v.name,
      isClosedByMenuOpen: false,
      hasAssignValidationError: false,
    });
  };

  scrollToScrollViewTop = () => {
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };

  saveData = (purpose) => {
    if (purpose == "task" && this.state.to_be_closed_by.trim().length === 0) {
      this.setState({
        hasAssignValidationError: true,
      });
      return false;
    } else if (
      purpose == "notify" &&
      this.state.notification_type.trim().length === 0
    ) {
      this.setState({
        hasAssignTypeError: true,
      });
      return false;
    } else {
      this.setState(
        {
          hasTypeValidationError: false,
          hasRefValidationError: false,
          hasClassNameValidationError: false,
          hasCategotyNameValidationError: false,
          hasPriorityValidationError: false,
          hasDescriptionValidationError: false,
          hasSolutionValidationError: false,
          hasAssignValidationError: false,
          showLoader: true,
        },
        () => {
          let notification_type_user = this.state.notification_type_user;
          if (notification_type_user.length > 0) {
            notification_type_user = JSON.stringify(
              this.state.notification_type_user
            );
          } else {
            notification_type_user = undefined;
          }
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            reported_by: this.state.reported_by,
            ref: this.state.selectionTypeId,
            selectionTypeName: this.state.selectionTypeName,
            ref_id: this.state.ref_id,
            ref_name: this.state.ref_name,
            prority: this.state.priorityName,
            description: this.state.description,
            learning: this.state.learning,
            incidentTypeId: this.state.incidentTypeId,
            notification_type: this.state.notification_type,
            notification_type_value: this.state.notification_type_value,
            notification_type_user: notification_type_user,
            short_desc: this.state.description,
            create_purpose: purpose,
          };

          // if (this.state.id > 0) {
          //     obj.solution = this.state.solution,
          //         obj.to_be_closed_by = this.state.to_be_closed_by,
          //         obj.to_be_closed_by_id = this.state.to_be_closed_by_id
          // }

          (obj.solution = this.state.solution),
            (obj.to_be_closed_by = this.state.to_be_closed_by),
            (obj.to_be_closed_by_id = this.state.to_be_closed_by_id),
            (obj.category_id = this.state.selectedCategory_id);

          //   console.log("Object>>>>>>>>", obj);
          addIncident(obj, this.state.incidentUploadData)
            .then((response) => {
              // let categories = this.context.categories;
              // categories.unshift(response.data);
              // this.context.setCategories(categories);
              // return;
              this.setState(
                {
                  showLoader: false,
                  notifyUserModalVisible: false,
                  saveAndNotifyModalVisible: false,
                  saveConfirmModalVisible: false,
                  saveAndCreateTaskModalVisible: false,
                },
                () => {
                  alert("Incident Created");
                  // console.log("response********", response);return;
                  // this.gotoCategory(response);
                  if (purpose == "task") {
                    this.gotoTask(response.data);
                  } else {
                    this.gotoCategory();
                  }
                }
              );
            })
            .catch((error) => {
              this.setState({ showLoader: false });
              alert("Something went wrong, Try Again!!");
              console.log(error);
            });
        }
      );
    }
  };

  getEnclosureBySection = (section_id) => {
    let cid = this.context.userDetails.cid;
    getAllEnclosures(cid, section_id)
      .then((res) => {
        this.setState({
          enclosuress: res.map((v, i) => ({
            id: v.id,
            name: v.enclosure_id,
            value: v.id,
          })),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getAnimalByEnclosure = (enclosure_id) => {
    let cid = this.context.userDetails.cid;
    getAllAnimals(cid, enclosure_id)
      .then((res) => {
        this.setState({
          animals: res.map((v, i) => ({
            id: v.animal_id,
            name: `${v.animal_id} | ${v.animal_name}  `,
            value: v.id,
          })),
          // | ${v.dna == null ? "N/A" : v.dna} | ${v.microchip == null ? "N/A" : v.microchip}
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setSection = (v) => {
    this.setState(
      {
        section_id: v.id,
        section_name: v.name,
        enclosure_id: "",
        enclosure_name: "",
        ref_id: undefined,
        ref_name: undefined,
        isSectionMenuOpen: false,
      },
      () => {
        this.getEnclosureBySection(v.id);
      }
    );
  };

  setEnclosure = (v) => {
    this.setState(
      {
        enclosure_id: v.id,
        enclosure_name: v.name,
        ref_id: undefined,
        ref_name: undefined,
        isEnclosureMenuOpen: false,
      },
      () => {
        this.getAnimalByEnclosure(v.id);
      }
    );
  };

  saveIncident = () => {
    let {
      id,
      selectionTypeId,
      incidentTypeId,
      categoryName,
      priorityID,
      ref_id,
      description,
      solution,
      to_be_closed_by,
    } = this.state;
    this.setState({
      hasIncidentTypesValidationError: false,
      hasDescriptionValidationError: false,
      hasTypeValidationError: false,
      hasRefValidationError: false
    });
    if (typeof selectionTypeId === "undefined") {
      this.setState({
        hasTypeValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      // this.scrollToScrollViewTop();
      return false;
    } else if (selectionTypeId != "others" && typeof ref_id === "undefined") {
      this.setState({
        hasRefValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      // this.scrollToScrollViewTop();
      return false;
    } else if (typeof incidentTypeId === "undefined") {
      this.setState({
        hasIncidentTypesValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      return false;
    } else if (description.trim().length === 0) {
      this.setState({
        hasDescriptionValidationError: true,
        notifyUserModalVisible: false,
        saveAndNotifyModalVisible: false,
        saveConfirmModalVisible: false,
        saveAndCreateTaskModalVisible: false,
      });
      return false;
    } else {
      this.setState({
        saveAndNotifyModalVisible: true,
      });
    }
  };

  chooseIncidentPhotos = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: false,
          quality: 1,
          //   presentationStyle: 0,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              incidentImages: [
                ...this.state.incidentImages,
                { id: Number(this.state.imageID) + 1, uri: result.uri },
              ],
              imageID: Number(this.state.imageID) + 1,
              incidentUploadData: [
                ...this.state.incidentUploadData,
                getFileData(result),
              ],
              // showLoader: true
            });
          }
        });
      } else {
        Alert.alert("Please allow permission to choose images");
      }
    });
  };

  openRelatedScaner = () => {
    Camera.requestCameraPermissionsAsync()
      .then((result) => {
        if (result.status === "granted") {
          this.setState({ isScanModal: !this.state.isScanModal });
        } else {
          Alert.alert("Please give the permission");
        }
      })
      .catch((error) => console.log(error));
  };

  handleBarCodeScanned = (data) => {
    try {
      let scanData = JSON.parse(data.data);
      let type = scanData.type ? scanData.type : scanData.qr_code_type;
      if (type == "Group") {
        this.setState({
          isScanModal: !this.state.isScanModal,

          selectionTypeName: "Animal",

          selectionTypeId: "animal",

          ref_id: scanData.animal_code,

          ref_name: scanData?.common_name,

          section_id: scanData.section_id,

          section_name: scanData.section_name,

          enclosure_id: scanData.enclosure_id,

          enclosure_name: scanData.enclosure_name,
        });
      } else {
        this.setState({
          isScanModal: !this.state.isScanModal,

          selectionTypeName: capitalize(type),

          selectionTypeId: type,

          ref_id: scanData.enclosure_db_id
            ? scanData.enclosure_db_id
            : scanData.animal_code
              ? scanData.animal_code
              : scanData.section_id,

          ref_name: scanData.animal_code
            ? scanData?.common_name
            : scanData.enclosure_id
              ? scanData.enclosure_id
              : scanData.section,

          section_id: scanData.section_id,

          section_name: scanData.section,

          enclosure_id: scanData.enclosure_db_id,

          enclosure_name: scanData.enclosure_id,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({ isScanModal: !this.state.isScanModal });
      alert("Wrong QR code scan !!");
    }
  };

  removeImage = (image) => {
    let arr = this.state.incidentImages;
    arr = arr.filter((element) => element.id !== image.id);
    let arr2 = this.state.incidentUploadData;
    let uploadImage = getFileData(image);
    arr2 = arr2.filter((element) => element.name !== uploadImage.name);
    this.setState({
      incidentImages: arr,
      incidentUploadData: arr2,
    });
  };
  closeScanModal = () => {
    this.setState({
      isScanModal: false,
    });
  };
  render = () => (

    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        title={
          parseInt(this.state.id) > 0 ? "Edit Incident" : "Report Incident"
        }
        // showRelatedScanButton={true}
        // openRelatedScaner={this.openRelatedScaner}
      />
      <View style={styles.body}>
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          ref={this.formScrollViewRef}
          style={{
            paddingHorizontal: Colors.formPaddingHorizontal,
            paddingBottom: 20,
            paddingTop: 10,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: Colors.formBorderRedius,
            }}
          >
            {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}> */}

            {/* {this.props.route.params?.prefilled ? (
              
            ) : null} */}
            <>
              <InputDropdown
                label={"Related To"}
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
              {/* </View> */}

              {this.state.selectionTypeId == "section" ? (
                // <View style={styles.inputContainer}>
                <InputDropdown
                  label={"Sections"}
                  value={this.state.ref_name}
                  isOpen={this.state.isrefMenuOpen}
                  items={this.state.sections}
                  openAction={this.togglerefMenu}
                  closeAction={this.togglerefMenu}
                  setValue={this.setref}
                  // placeholder="Select Sections"
                  labelStyle={styles.labelName}
                  textFieldStyle={styles.textfield}
                  style={[
                    styles.fieldBox,
                    this.state.hasRefValidationError
                      ? styles.errorFieldBox
                      : null,
                  ]}
                />
              ) : // </View>
                null}

              {this.state.selectionTypeId == "enclosure" ? (
                <>
                  {/* <View style={styles.inputContainer}> */}
                  <InputDropdown
                    label={"Section"}
                    value={this.state.section_name}
                    isOpen={this.state.isSectionMenuOpen}
                    items={this.state.sections}
                    openAction={this.toggleSectionMenu}
                    closeAction={this.toggleSectionMenu}
                    setValue={this.setSection}
                    // placeholder="Select Sections"
                    labelStyle={styles.labelName}
                    textFieldStyle={styles.textfield}
                    style={[styles.fieldBox]}
                  />
                  {/* </View> */}
                  {/* <View style={styles.inputContainer}> */}
                  <InputDropdown
                    label={"Enclosures"}
                    value={this.state.ref_name}
                    isOpen={this.state.isrefMenuOpen}
                    items={this.state.enclosuress}
                    openAction={this.togglerefMenu}
                    closeAction={this.togglerefMenu}
                    setValue={this.setref}
                    // placeholder="Select Enclosures"
                    labelStyle={styles.labelName}
                    textFieldStyle={styles.textfield}
                    style={[
                      styles.fieldBox,
                      this.state.hasRefValidationError
                        ? styles.errorFieldBox
                        : null,
                    ]}
                  />
                  {/* </View> */}
                </>
              ) : null}

              {this.state.selectionTypeId == "animal" ? (
                this.state.id == 0 ? (
                  <>
                    {/* <View style={styles.inputContainer}> */}
                    <InputDropdown
                      label={"Section"}
                      value={this.state.section_name}
                      isOpen={this.state.isSectionMenuOpen}
                      items={this.state.sections}
                      openAction={this.toggleSectionMenu}
                      closeAction={this.toggleSectionMenu}
                      setValue={this.setSection}
                      // placeholder="Select Sections"
                      labelStyle={styles.labelName}
                      textFieldStyle={styles.textfield}
                      style={[styles.fieldBox]}
                    />
                    {/* </View> */}
                    {/* <View style={styles.inputContainer}> */}
                    <InputDropdown
                      label={"Enclosures"}
                      value={this.state.enclosure_name}
                      isOpen={this.state.isEnclosureMenuOpen}
                      items={this.state.enclosuress}
                      openAction={this.toggleEnclosureMenu}
                      closeAction={this.toggleEnclosureMenu}
                      setValue={this.setEnclosure}
                      // placeholder="Select Enclosures"
                      labelStyle={styles.labelName}
                      textFieldStyle={styles.textfield}
                      style={[styles.fieldBox]}
                    />
                    {/* </View> */}
                  </>
                ) : null
              ) : null}

              {this.state.selectionTypeId == "animal" ? (
                // <View style={styles.inputContainer}>
                <InputDropdown
                  label={"Animals"}
                  value={this.state.ref_name}
                  isOpen={this.state.isrefMenuOpen}
                  items={this.state.animals}
                  openAction={this.togglerefMenu}
                  closeAction={this.togglerefMenu}
                  setValue={this.setref}
                  // placeholder="Select Animals"
                  labelStyle={styles.labelName}
                  textFieldStyle={styles.textfield}
                  style={[
                    styles.fieldBox,
                    this.state.hasRefValidationError
                      ? styles.errorFieldBox
                      : null,
                  ]}
                />
              ) : // </View>
                null}
            </>

            <InputDropdown
              label={"Incident Types"}
              value={this.state.typeName}
              isOpen={this.state.isIncidentTypeMenuOpen}
              items={this.state.incidentTypes}
              openAction={this.toggleIncidentTypeMenu}
              closeAction={this.toggleIncidentTypeMenu}
              setValue={this.setIncidentTypeData}
              // placeholder="Select Incident Types"
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[
                styles.fieldBox,
                this.state.hasIncidentTypesValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            // extraIcon={<Ionicons name="add-circle" color={Colors.primary} size={22} />}
            // extraFunc={this.addIncidentTypes}
            />
            {/* </View> */}
            {/* <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>
                Name
                <Text style={{ fontSize: 12 }}> {"(Short Desc):"}</Text>
              </Text>
              <TextInput
                value={this.state.shortdesc}
                onChangeText={(text) => this.setState({ shortdesc: text })}
                style={[styles.textfield, { width: "60%" }]}
                autoCompleteType="off"
                // placeholder="Enter Incident Name"
                autoCapitalize="words"
                maxLength={30}
              />
            </View> */}

            <View
              style={[
                styles.fieldBox,
                this.state.hasDescriptionValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Description:</Text>
              <TextInput
                multiline={true}
                value={this.state.description}
                onChangeText={(text) =>
                  this.setState({
                    description: text,
                    hasDescriptionValidationError: false,
                  })
                }
                style={[styles.textfield, { width: "60%" }]}
                autoCompleteType="off"
                autoCapitalize="words"
                maxLength={120}
              // placeholder="Enter Incident Description"
              />
            </View>

            {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
                        <View style={styles.flexRow}>
                            <View style={[styles.fiftyWidth, styles.centerY]}>
                                <Text style={styles.name}>Short Description</Text>
                            </View>
                            <View style={styles.fiftyWidth}>
                                <TextInput
                                    style={styles.inputTextArea}
                                    value={this.state.shortdesc}
                                    onChangeText={(shortdesc) => this.setState({ shortdesc })}
                                    autoCapitalize="words"
                                    autoCompleteType="off"
                                />
                            </View>
                        </View>
                        {this.state.hasDescriptionValidationError ? (
                            <Text style={styles.errorText}>Solution can not be blank</Text>
                        ) : null}
                    </View> */}
            {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}> */}

            {this.props.route.params?.prefilled ? null : (
              <></>
              // <>
              //   <InputDropdown
              //     label={"Related To"}
              //     value={this.state.selectionTypeName}
              //     isOpen={this.state.isSelectionTypeMenuOpen}
              //     items={this.state.selectionTypes}
              //     openAction={this.toggleSelectionTypeMenu}
              //     closeAction={this.toggleSelectionTypeMenu}
              //     setValue={this.setSelectionTypeData}
              //     // placeholder="Select Incident Related To"
              //     labelStyle={styles.labelName}
              //     textFieldStyle={styles.textfield}
              //     style={[
              //       styles.fieldBox,
              //       this.state.hasTypeValidationError
              //         ? styles.errorFieldBox
              //         : null,
              //     ]}
              //   />
              //   {/* </View> */}

              //   {this.state.selectionTypeId == "section" ? (
              //     // <View style={styles.inputContainer}>
              //     <InputDropdown
              //       label={"Sections"}
              //       value={this.state.ref_name}
              //       isOpen={this.state.isrefMenuOpen}
              //       items={this.state.sections}
              //       openAction={this.togglerefMenu}
              //       closeAction={this.togglerefMenu}
              //       setValue={this.setref}
              //       // placeholder="Select Sections"
              //       labelStyle={styles.labelName}
              //       textFieldStyle={styles.textfield}
              //       style={[styles.fieldBox]}
              //     />
              //   ) : // </View>
              //   null}

              //   {this.state.selectionTypeId == "enclosure" ? (
              //     <>
              //       {/* <View style={styles.inputContainer}> */}
              //       <InputDropdown
              //         label={"Section"}
              //         value={this.state.section_name}
              //         isOpen={this.state.isSectionMenuOpen}
              //         items={this.state.sections}
              //         openAction={this.toggleSectionMenu}
              //         closeAction={this.toggleSectionMenu}
              //         setValue={this.setSection}
              //         // placeholder="Select Sections"
              //         labelStyle={styles.labelName}
              //         textFieldStyle={styles.textfield}
              //         style={[styles.fieldBox]}
              //       />
              //       {/* </View> */}
              //       {/* <View style={styles.inputContainer}> */}
              //       <InputDropdown
              //         label={"Enclosures"}
              //         value={this.state.ref_name}
              //         isOpen={this.state.isrefMenuOpen}
              //         items={this.state.enclosuress}
              //         openAction={this.togglerefMenu}
              //         closeAction={this.togglerefMenu}
              //         setValue={this.setref}
              //         // placeholder="Select Enclosures"
              //         labelStyle={styles.labelName}
              //         textFieldStyle={styles.textfield}
              //         style={[styles.fieldBox]}
              //       />
              //       {/* </View> */}
              //     </>
              //   ) : null}

              //   {this.state.selectionTypeId == "animal" ? (
              //     this.state.id == 0 ? (
              //       <>
              //         {/* <View style={styles.inputContainer}> */}
              //         <InputDropdown
              //           label={"Section"}
              //           value={this.state.section_name}
              //           isOpen={this.state.isSectionMenuOpen}
              //           items={this.state.sections}
              //           openAction={this.toggleSectionMenu}
              //           closeAction={this.toggleSectionMenu}
              //           setValue={this.setSection}
              //           // placeholder="Select Sections"
              //           labelStyle={styles.labelName}
              //           textFieldStyle={styles.textfield}
              //           style={[styles.fieldBox]}
              //         />
              //         {/* </View> */}
              //         {/* <View style={styles.inputContainer}> */}
              //         <InputDropdown
              //           label={"Enclosures"}
              //           value={this.state.enclosure_name}
              //           isOpen={this.state.isEnclosureMenuOpen}
              //           items={this.state.enclosuress}
              //           openAction={this.toggleEnclosureMenu}
              //           closeAction={this.toggleEnclosureMenu}
              //           setValue={this.setEnclosure}
              //           // placeholder="Select Enclosures"
              //           labelStyle={styles.labelName}
              //           textFieldStyle={styles.textfield}
              //           style={[styles.fieldBox]}
              //         />
              //         {/* </View> */}
              //       </>
              //     ) : null
              //   ) : null}

              //   {this.state.selectionTypeId == "animal" ? (
              //     // <View style={styles.inputContainer}>
              //     <InputDropdown
              //       label={"Animals"}
              //       value={this.state.ref_name}
              //       isOpen={this.state.isrefMenuOpen}
              //       items={this.state.animals}
              //       openAction={this.togglerefMenu}
              //       closeAction={this.togglerefMenu}
              //       setValue={this.setref}
              //       // placeholder="Select Animals"
              //       labelStyle={styles.labelName}
              //       textFieldStyle={styles.textfield}
              //       style={[styles.fieldBox]}
              //     />
              //   ) : // </View>
              //   null}
              // </>
            )}

            {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
                        <Text style={styles.name}>Learning</Text>
                        <TextInput
                            multiline={true}
                            style={styles.inputTextArea}
                            value={this.state.learning}
                            onChangeText={(learning) => this.setState({ learning })}
                            autoCapitalize="words"
                            autoCompleteType="off"
                        />
                         {this.state.hasDescriptionValidationError ? (
                            <Text style={styles.errorText}>Enter description</Text>
                        ) : null}
                    </View>
                    */}

            {/* <View
              style={[
                styles.fieldBox,
                this.state.hasSolutionValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Comments:</Text>
              <TextInput
                multiline={true}
                value={this.state.solution}
                onChangeText={(text) =>
                  this.setState({
                    solution: text,
                    hasSolutionValidationError: false,
                  })
                }
                style={[styles.textfield, { width: "60%" }]}
                autoCompleteType="off"
                autoCapitalize="words"
                // placeholder="Enter Comments"
              />
            </View> */}

            {/* <View style={[styles.inputContainer, styles.mb0, styles.pb0]}> */}
            {/* <Dropdown
              label={"Priority:"}
              placeholder=" "
              value={this.state.priorityName}
              items={Configs.ITEM_PRIORITIES}
              onChange={this.setPriority}
              labelStyle={styles.labelName}
              textFieldStyle={[styles.textfield, { width: "60%" }]}
              style={[
                styles.fieldBox,
                this.state.hasPriorityValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            /> */}
            {/* </View> */}
            {/*
                    <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
                        <Text style={styles.name}>Reported By</Text>
                        <TextInput
                            style={styles.inputTextArea}
                            value={this.state.reported_by_name}
                            editable={false}
                            autoCapitalize="words"
                            autoCompleteType="off"
                        />

                    </View>
  */}
            <>
              {/*} <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
                            <InputDropdown
                                label={"Assign to"}
                                value={this.state.to_be_closed_by}
                                isOpen={this.state.isClosedByMenuOpen}
                                items={this.state.users}
                                openAction={this.toggleClosedMenu}
                                closeAction={this.toggleClosedMenu}
                                setValue={this.setClosedByData}
                                labelStyle={styles.name}
                                textFieldStyle={styles.inputText}
                            />
                            {this.state.hasDescriptionValidationError ? (
                                <Text style={styles.errorText}>Enter description</Text>
                            ) : null}
                            </View> */}

              {this.state.id > 0 ? (
                <View
                  style={[
                    styles.fieldBox,
                    this.state.hasSolutionValidationError
                      ? styles.errorFieldBox
                      : null,
                  ]}
                >
                  <Text style={styles.labelName}>Current Status:</Text>
                  <TextInput
                    multiline={true}
                    value={
                      this.state.currentStatus == "P" ? "Pending" : "Closed"
                    }
                    style={[styles.textfield, { width: "60%" }]}
                    editable={false}
                    autoCapitalize="words"
                    autoCompleteType="off"
                  />
                </View>
              ) : null}
              <View style={{ backgroundColor: Colors.white }}>
                <Text style={[styles.labelName, { marginLeft: 8 }]}>
                  Priority
                </Text>
                <Priority
                  priority={this.state.priorityName}
                  onPress={(text) => this.setState({ priorityName: text })}
                />
              </View>
              {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
                                <View style={[styles.fieldBox, { overflow: "visible" }]}>
                                    <Text style={styles.labelName}>{`Attach Photos`}</Text>
                                    <View style={{ width: '20%' }}>
                                        <Image
                                            style={{ height: 40, width: 40 }}
                                            source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg7yzGDPsVcl5FUNPV20ouJ_kacx7e-xVGOXe-BXQ&s'}}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>
                            </View> */}

              {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}> */}
              <View style={[styles.fieldBox, { borderBottomWidth: 0 }]}>
                <Text style={styles.labelName}>{`Attach Photos`}</Text>
                <TouchableOpacity onPress={this.chooseIncidentPhotos}>
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={30}
                    color="#444"
                  />
                </TouchableOpacity>
              </View>
              {this.state.incidentImages.length > 0 ? (
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "#444",
                    width: "100%",
                    height: 110,
                    justifyContent: "center",
                  }}
                >
                  <ScrollView
                    contentContainerStyle={{ alignItems: "center" }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.state.incidentImages.map((item, index) => {
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
              ) : null}
              {/* </View> */}
            </>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.saveIncident}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>
                Save & Notify
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={this.createTask}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>
                Save & Create Task
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity activeOpacity={1} onPress={this.gotoCategory}>
                            <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
                        </TouchableOpacity> */}
          </View>
        </KeyboardAwareScrollView>
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

      {/* show notify user popup */}
      <Modal
        isVisible={this.state.notifyUserModalVisible}
        coverScreen={false}
        onBackdropPress={() => this.setState({ notifyUserModalVisible: false })}
      >
        <View style={[styles.popupContainer, { marginTop: "60%" }]}>
          <Text style={styles.popupText}>Assign Type :</Text>
          <View style={{ padding: 10 }}>
            {/*} <InputDropdown
                            label={"Choose Type"}
                            value={this.state.notification_type}
                            isOpen={this.state.isNotifyMenuOpen}
                            items={this.state.notifyTypes}
                            openAction={this.toggleNotifyMenu}
                            closeAction={this.toggleNotifyMenu}
                            setValue={this.setNotifyType}
                            labelStyle={styles.name}
                            textFieldStyle={styles.inputText}
                        />
                */}
            <RadioForm
              radio_props={this.state.notifyTypes}
              initial={-1}
              animation={false}
              onPress={this.setNotifyType}
              buttonColor={"#63c3a5"}
              selectedButtonColor={"#63c3a5"}
              selectedLabelColor={Colors.textColor}
              labelColor={Colors.textColor}
              formHorizontal={false}
              labelHorizontal={true}
              labelStyle={{ marginHorizontal: 8 }}
              style={[styles.inputRadio]}
              buttonSize={15}
            />
            {this.state.hasAssignTypeError ? (
              <Text style={{ color: Colors.danger }}>
                Please Choose any assign type
              </Text>
            ) : null}
          </View>

          {this.state.notification_type == "Departments" ? (
            <View style={{ padding: 10 }}>
              <InputDropdown
                value={this.state.notification_type_department_name}
                label={"Choose Department"}
                items={this.state.departments}
                setValue={(v) => {
                  console.log(v);
                  this.setState({
                    isNotifyDepartmentMenuOpen: false,
                    notification_type_value: v.value,
                    notification_type_department_name: v.name,
                    notification_type_user: [],
                  });
                }}
                isOpen={this.state.isNotifyDepartmentMenuOpen}
                openAction={this.toggleNotifyDepartmentMenu}
                closeAction={this.toggleNotifyDepartmentMenu}
                placeholder=" "
                labelStyle={styles.labelName}
                textFieldStyle={styles.textfield}
                style={[
                  styles.fieldBox,
                  this.state.departmentValidationFailed
                    ? styles.errorFieldBox
                    : null,
                ]}
              />
            </View>
          ) : null}

          {this.state.notification_type == "Users" ? (
            <View style={{ padding: 10 }}>
              <MultiSelectDropdown
                label={"Choose User"}
                items={this.state.users}
                selectedItems={this.state.notification_type_user}
                labelStyle={styles.name}
                placeHolderContainer={styles.inputText}
                placeholderStyle={styles.placeholderStyle}
                selectedItemsContainer={styles.selectedItemsContainer}
                onSave={(v) => {
                  console.log(v);
                  this.setState({
                    notification_type_value: "",
                    notification_type_user: v,
                  });
                }}
              />
              {/* <InputDropdown
                                    label={"Choose User"}
                                    value={this.state.notification_type_user}
                                    items={this.state.users}
                                    setValue={(v) => {
                                        this.setState({
                                            isNotifyUserMenuOpen: false,
                                            notification_type_value: v.value,
                                            notification_type_user: v.name
                                        });
                                    }}
                                    isOpen={this.state.isNotifyUserMenuOpen}
                                    openAction={this.toggleNotifyUserMenuOpen}
                                    closeAction={this.toggleNotifyUserMenuOpen}
                                    labelStyle={styles.name}
                                    textFieldStyle={styles.inputText}
                                /> */}
            </View>
          ) : null}

          <View style={{ flexDirection: "row", marginTop: 40 }}>
            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.saveData("notify");
                }}
              >
                <Text style={styles.textWhite}>Save</Text>
              </Pressable>
            </View>

            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.setState({
                    saveConfirmModalVisible: false,
                    notifyUserModalVisible: false,
                    notification_type: "",
                  });
                }}
              >
                <Text style={styles.textWhite}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* save confirmation popup */}
      <Modal
        isVisible={this.state.saveConfirmModalVisible}
        coverScreen={false}
        onBackdropPress={() =>
          this.setState({ saveConfirmModalVisible: false })
        }
      >
        <View style={[styles.popupContainer, { marginTop: "60%" }]}>
          <Text style={styles.popupText}>Do you want to save?</Text>
          <View style={{ flexDirection: "row", marginTop: 40 }}>
            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.saveData("save");
                }}
              >
                <Text style={styles.textWhite}>Yes</Text>
              </Pressable>
            </View>

            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.setState({
                    saveConfirmModalVisible: false,
                  });
                }}
              >
                <Text style={styles.textWhite}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* save and notify popup */}
      <Modal
        isVisible={this.state.saveAndNotifyModalVisible}
        coverScreen={false}
        onBackdropPress={() =>
          this.setState({ saveAndNotifyModalVisible: false })
        }
      >
        <View style={[styles.popupContainer, { marginTop: "60%" }]}>
          <Text style={styles.popupText}>Do you want to save and notify?</Text>
          <View style={{ flexDirection: "row", marginTop: 40 }}>
            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.setState({
                    notifyUserModalVisible: true,
                    saveAndNotifyModalVisible: false,
                    notification_type: "",
                  });
                }}
              >
                <Text style={styles.textWhite}>Yes</Text>
              </Pressable>
            </View>

            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.setState({
                    saveAndNotifyModalVisible: false,
                    saveConfirmModalVisible: true,
                  });
                }}
              >
                <Text style={styles.textWhite}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* save and create Task popup */}
      <Modal
        isVisible={this.state.saveAndCreateTaskModalVisible}
        coverScreen={false}
        onBackdropPress={() =>
          this.setState({ saveAndCreateTaskModalVisible: false })
        }
      >
        <View style={[styles.popupContainer, { marginTop: "60%" }]}>
          <Text style={styles.popupText}>Save and Create Task</Text>
          <View style={{ padding: 10 }}>
            <InputDropdown
              label={"Category"}
              value={this.state.selectedCategory_name}
              isOpen={this.state.isCategoryMenuOpen}
              items={this.state.category}
              openAction={this.toggleCategoryMenu}
              closeAction={this.toggleCategoryMenu}
              setValue={this.setCategoryData}
              placeholder=" "
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[
                styles.fieldBox,
                this.state.hasAssignValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            />
          </View>


          <View style={{ padding: 10 }}>
            <InputDropdown
              label={"Assign to"}
              value={this.state.to_be_closed_by}
              isOpen={this.state.isClosedByMenuOpen}
              items={this.state.users}
              openAction={this.toggleClosedMenu}
              closeAction={this.toggleClosedMenu}
              setValue={this.setClosedByData}
              placeholder=" "
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[
                styles.fieldBox,
                this.state.hasAssignValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 40 }}>
            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.saveData("task");
                }}
              >
                <Text style={styles.textWhite}>Save</Text>
              </Pressable>
            </View>

            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.setState({
                    saveAndCreateTaskModalVisible: false,
                  });
                }}
              >
                <Text style={styles.textWhite}>Cancel</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {/*Scan Modal*/}
    
        <ScannerButton btnPress={this.openRelatedScaner} />

      <Modal2
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
         visible={this.state.isScanModal}
        onRequestClose={this.closeScanModal}
        // visible={this.state.toggleScanModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={styles.scanModalOverlay}>
            <View style={styles.qrCodeSacnBox}>
              <Camera
                onBarCodeScanned={this.handleBarCodeScanned}
                barCodeScannerSettings={{
                  barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                }}
                style={StyleSheet.absoluteFill}
              />
              {/* <BarCodeScanner
                   type={BarCodeScanner.Constants.Type.back}
                   barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                   onBarCodeScanned={handleBarCodeScanned}
                   style={StyleSheet.absoluteFill}
                 /> */}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={this.closeScanModal}
            >
              <Ionicons name="close-outline" style={styles.cancelButtonText} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal2>

    </Container>

  );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//     },
//     body: {
//         flex: 9,
//     },
//     textWhite: {
//         fontSize: 15,
//         lineHeight: 21,
//         fontWeight: 'bold',
//         letterSpacing: 0.25,
//         color: '#fff',
//     },
//     button: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 32,
//         borderRadius: 4,
//         elevation: 3,
//         backgroundColor: Colors.primary
//     },
//     popupContainer: {
//         backgroundColor: '#fff',
//         paddingTop: 20,
//         paddingBottom: 20
//     },
//     popupText: {
//         fontSize: 16,
//         color: Colors.black,
//         alignSelf: "center"
//     },
//     wrapper: {
//         borderWidth: 1,
//         borderColor: '#e5e5e5',
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//         borderRadius: 3,
//         width: '100%',
//         // marginTop: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between'
//     },
//     chooseCatContainer: {
//         flexDirection: "row",
//         marginVertical: 10,
//         paddingHorizontal: 10,
//         alignItems: "center",
//         justifyContent: "space-between",
//     },
//     imageContainer: {
//         borderColor: "#ccc",
//         borderWidth: 1,
//         padding: 3,
//         backgroundColor: "#fff",
//         borderRadius: 3,
//     },
//     image: {
//         height: 40,
//         width: 40,
//     },
//     defaultImgIcon: {
//         fontSize: 50,
//         color: "#adadad",
//     },
//     name: {
//         fontSize: 18,
//         color: Colors.textColor,
//         marginBottom: 10,
//     },
//     buttonsContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-evenly",
//         marginVertical: 30,
//     },
//     inputText: {
//         height: 50,
//         borderColor: "#ccc",
//         borderWidth: 1,
//         fontSize: 18,
//         backgroundColor: "#f9f6f6",
//         paddingHorizontal: 10,
//         color: Colors.textColor,
//     },
//     inputTextArea: {
//         borderWidth: 1,
//         borderColor: "#ccc",
//         backgroundColor: "#f9f6f6",
//         textAlignVertical: "top",
//         padding: 10,
//         fontSize: 18,
//         color: Colors.textColor,
//         borderRadius: 3
//     },
//     inputContainer: {
//     },
//     flexRow: {
//         flexDirection: 'row'
//     },
//     centerY: {
//         justifyContent: 'center',
//     },
//     fiftyWidth: {
//         width: '50%'
//     },
//     pb0: {
//         paddingBottom: 0,
//     },
//     mb0: {
//         marginBottom: 0,
//     },
//     buttonText: {
//         fontSize: 18,
//         fontWeight: "bold",
//     },
//     saveBtnText: {
//         color: Colors.primary,
//     },
//     exitBtnText: {
//         color: Colors.activeTab,
//     },
//     item: {
//         height: 35,
//         backgroundColor: "#00b386",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     itemtitle: {
//         color: "#fff",
//         textAlign: "center",
//         fontSize: 18,
//     },
//     errorText: {
//         textAlign: "right",
//         color: Colors.tomato,
//         fontWeight: "bold",
//         fontStyle: "italic",
//     },

//     fieldBox: {
//         alignItems: 'center',
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
//         // marginBottom: 5,
//         // marginTop: 5,
//         // shadowColor: "#999",
//         // shadowOffset: {
//         // 	width: 0,
//         // 	height: 1,
//         // },
//         // shadowOpacity: 0.22,
//         // shadowRadius: 2.22,
//         // elevation: 3,
//     },
//     labelName: {
//         color: Colors.labelColor,
//         // lineHeight: 40,
//         fontSize: 19,
//         paddingLeft: 4,
//         height: 'auto',
//         paddingVertical: 10
//     },
//     textfield: {
//         backgroundColor: "#fff",
//         height: 'auto',
//         flexWrap:'wrap',
//         fontSize: 19,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
//     },
//     RadioinputContainer: {
//         flexDirection: "row",
//         // width: '100%',
//         // justifyContent:'center',
//         // alignItems:'center'
//     },
//     Radioname: {
//         fontSize: 18,
//         color: Colors.textColor,
//         top: 8,
//     },
//     inputRadio: {
//         // justifyContent:'center',
//         // alignItems:'center',
//         padding: 10,
//         width: '62%',
//         marginTop: 5,
//         flexWrap: 'wrap',
//         // paddingHorizontal: 10,
//     },
//     placeholderStyle: {
//         fontSize:Colors.textSize,
//         color: Colors.textColor,
//         opacity: 0.8,
//     },
//     selectedItemsContainer: {
//         width: "100%",
//         height: "auto",
//         borderColor: "#ccc",
//         borderWidth: 1,
//         backgroundColor: "#f9f6f6",
//         paddingVertical: 8,
//         flexDirection: "row",
//         flexWrap: "wrap",
//         alignItems: "flex-start",
//     },
//     errorFieldBox: {
//         borderWidth: 1,
//         borderColor: Colors.tomato,
//     },

// });
