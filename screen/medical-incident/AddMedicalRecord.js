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
  ToastAndroid,
  SafeAreaView,
  Pressable,
  RefreshControl,
} from "react-native";
import { Modal as Modal2 } from "react-native";
import { Container } from "native-base";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Header, Dropdown, OverlayLoader } from "../../component";
import ModalMenu from "../../component/ModalMenu";
import InputDropdown from "../../component/InputDropdown";
import { DatePicker } from "../../component";
import { Configs, Colors } from "../../config";
import { getFormattedDate, getFileData, capitalize } from "../../utils/Util";
import {
  getDiagnosis,
  addMedicalRecord,
  getMedicine,
  getAffectedParts,
  getRouteLists,
} from "../../services/MedicalAndIncidenTServices";
import {
  getAnimalSections,
  getAllEnclosures,
  getAllAnimals,
} from "../../services/APIServices";
import Modal from "react-native-modal";
import {
  getAvailableDepartments,
  getUsers,
} from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import * as DocumentPicker from "expo-document-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../../config/Styles";
import RadioForm from "react-native-simple-radio-button";
import MultiSelectforUser from "./../../component/MultiSelectforUser";
import MultiSelectDropdown from "./../../component/MultiSelectDropdown";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import Priority from "../../component/tasks/AddTodo/Priority";
import ScannerButton from "../../component/ScannerButton";

export default class AddMedicalRecord extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      diagnosis: [],
      sections: [],
      enclosures: [],
      animals: [],
      users: [],
      departments: [],
      medicines: [],
      selectedMedicines: [],
      medicineIdStr: "",
      affected_parts: [],
      routes: [],
      toggleScanModal: false,
      toggleScanStatus: false,
      imageURI: props.route.params.item?.image
        ? Configs.MEDICAL_RECORD_UPLOAD_DATA_URL + props.route.params.item.image
        : [],
      imageData: [],
      docURI: props.route.params.item?.doc ? props.route.params.item.doc : [],
      docData: [],
      refreshing: false,
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
      ],

      id: props.route.params?.item?.id ?? 0,
      diagnosisID: props.route.params?.item?.diagnosis_name_id ?? undefined,
      diagnosisName: props.route.params?.item?.diagnosis_name ?? "",
      prority: props.route.params?.hasOwnProperty("prority")
        ? props.route.params?.prority
        : undefined,
      affected_parts_id: props.route.params?.item?.affected_parts_id ?? "",
      affectedParts: props.route.params?.item?.affected_parts ?? "",
      dosage: props.route.params?.item?.dosage ?? "",
      caseName: props.route.params?.item?.case_name ?? "",
      description: props.route.params?.item?.description ?? "",
      learning: props.route.params?.item?.learning ?? "",
      reported_by_name: props.route.params?.item?.reported_by_name ?? "",
      priorityName: props.route.params?.item?.priority ?? undefined,
      solution: props.route.params?.item?.solution ?? "",
      currentStatus: props.route.params?.item?.status ?? "",
      diagnosed_by: props.route.params?.item?.diagnosed_by_name ?? "",
      diagnosed_by_id: props.route.params?.item?.diagnosed_by_id ?? undefined,
      priorityID: undefined,
      reported_by: props.route.params?.item?.reported_by ?? "",
      selectionTypeName: props.route.params?.item?.ref
        ? capitalize(props.route.params.item.ref)
        : props.route.params.selectionType
        ? capitalize(props.route.params.selectionType)
        : "",
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
      entryDate: props.route.params?.item?.date
        ? new Date(props.route.params?.item?.date)
        : new Date(),
      nextDate: props.route.params?.item?.next_treatment_date
        ? new Date(props.route.params?.item?.next_treatment_date)
        : moment(new Date()).add(1, "days").format(),
      drugName: props.route.params?.item?.drug_name ?? "",
      drugID: props.route.params?.item?.drug_id ?? "",
      statusID: props.route.params?.item?.status ?? "A",
      statusName:
        props.route.params?.item?.status == "P"
          ? "Pending"
          : props.route.params?.item?.status == "A"
          ? "Approved"
          : "Ongoing",
      route_id: props.route.params?.item?.route_id ?? null,
      route_name: props.route.params?.item?.route_name ?? "",

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

      show: false,
      showNext: false,
      isrefMenuOpen: false,
      isClosedByMenuOpen: false,
      isDiagnosedByMenuOpen: false,
      isSelectionTypeMenuOpen: false,
      isAffectedPartsMenuOpen: false,
      isRoutesMenuOpen: false,
      hasDiagnosisValidationError: false,
      hasRefValidationError: false,
      hasPriorityValidationError: false,
      hasDescriptionValidationError: false,
      hasCaseNameValidationError: false,
      showLoader: false,
      modalVisible: false,
      statusModalVisible: false,
      isIncidentTypeMenuOpen: false,
      isDrugMenuOpen: false,
      isSectionMenuOpen: false,
      isEnclosureMenuOpen: false,
      imageID: 0,
      medicalImages: [],
      medicalUploadData: [],
      isNotifyMenuOpen: false,

      isNotifyDepartmentMenuOpen: false,

      isNotifyUserMenuOpen: false,

      notification_type: "",
      notification_type_value: "",

      notification_type_department_name: "",
      notification_type_user: [],
      hasAssignTypeError: false,

      saveAndNotifyModalVisible: false,
      saveConfirmModalVisible: false,
      notifyUserModalVisible: false,
      saveAndCreateTaskModalVisible: false,

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

  getAllData = () => {
    if (this.state.id > 0) {
      let routeImages =
        this.props.route.params.item.image == "null" ||
        this.props.route.params?.item.image == null
          ? []
          : JSON.parse(this.props.route.params.item.image);
      // console.log("routeImagesrouteImages",routeImages,this.props.route.params.item);
      // return
      let images = routeImages.map((element, index) => {
        return { id: index + 1, uri: element };
      });
      this.setState({
        medicalImages: images,
        imageID: images.length,
        medicalUploadData: images.map((item) => {
          return getFileData(item);
        }),
      });
    }

    this.setState({
      reported_by_name: this.context.userDetails.full_name,
      reported_by: this.context.userDetails.id,
    });
    let cid = this.context.userDetails.cid;
    Promise.all([
      getDiagnosis(cid),
      getAnimalSections(cid),
      getAllEnclosures(cid),
      // getAllAnimals(cid),
      getUsers(cid),
      getMedicine(cid),
      getAffectedParts(cid),
      getRouteLists(cid),
      getAvailableDepartments(),
    ])
      .then((data) => {
        let selectedMedicines;
        if (parseInt(this.state.id) > 0) {
          selectedMedicines = data[4].filter((element) =>
            (this.props.route.params?.item?.drug_id || []).includes(element.id)
          );
        }

        this.setState({
          selectedMedicines,
          diagnosis: data[0].map((v, i) => ({
            id: v.id,
            name: v.diagnosis,
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
          users: data[3].map((v, i) => ({
            id: v.id,
            name: `${v.full_name} | ${v.dept_name} `,
            value: v.id,
          })),
          medicines: data[4].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
          affected_parts: data[5].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
          routes: data[6].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
          departments: data[7].map((v, i) => ({
            id: v.id,
            name: v.dept_name,
            value: v.dept_code,
          })),
          showLoader: false,
          refreshing: false,
        });
      })
      .catch((error) => console.log(error));
  };

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.entryDate;
    this.setState({
      show: false,
      entryDate: currentDate,
    });
  };

  onChangeNextDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.nextDate;
    this.setState({
      showNext: false,
      nextDate: currentDate,
    });
  };

  toggleAffectedPartsMenu = () => {
    this.setState({
      isAffectedPartsMenuOpen: !this.state.isAffectedPartsMenuOpen,
    });
  };

  toggleRouteMenu = () => {
    this.setState({
      isRoutesMenuOpen: !this.state.isRoutesMenuOpen,
    });
  };

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
  toggleSectionMenu = () =>
    this.setState({ isSectionMenuOpen: !this.state.isSectionMenuOpen });
  toggleEnclosureMenu = () =>
    this.setState({ isEnclosureMenuOpen: !this.state.isEnclosureMenuOpen });
  toggleClosedMenu = () =>
    this.setState({ isClosedByMenuOpen: !this.state.isClosedByMenuOpen });
  toggleDiagnosedMenu = () =>
    this.setState({ isDiagnosedByMenuOpen: !this.state.isDiagnosedByMenuOpen });
  toggleDrugMenu = () =>
    this.setState({ isDrugMenuOpen: !this.state.isDrugMenuOpen });

  showDatepicker = () => this.setState({ show: true });

  showNextDatepicker = () => this.setState({ showNext: true });

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  setPriority = (v) => {
    this.setState({
      priorityID: v.id,
      priorityName: v.name,
    });
  };

  setRecordStatus = (v) => {
    this.setState({
      statusID: v.id,
      statusName: v.name,
    });
  };

  saveNotify = () => {
    let {
      id,
      selectionTypeId,
      diagnosisID,
      categoryName,
      statusID,
      description,
      caseName,
      learning,
      ref_id
    } = this.state;
    this.setState(
      {
        hasTypeValidationError: false,
        hasClassNameValidationError: false,
        hasCategotyNameValidationError: false,
        hasPriorityValidationError: false,
        hasDescriptionValidationError: false,
        hasCaseNameValidationError: false,
        hasDiagnosisValidationError: false,
        hasRefValidationError: false,
      },
      () => {
        if (typeof selectionTypeId === "undefined") {
          this.setState({ hasTypeValidationError: true });
          return false;
        } else if (typeof ref_id === "undefined") {
          this.setState({
            hasRefValidationError: true
          });
          // this.scrollToScrollViewTop();
          return false;
        }else if (typeof diagnosisID === "undefined") {
          this.setState({ hasDiagnosisValidationError: true });
          return false;
        } else if (description.trim().length === 0) {
          this.setState({ hasDescriptionValidationError: true });
          return false;
        }
        // else if (caseName.trim().length === 0) {
        //   this.setState({ hasCaseNameValidationError: true });
        //   return false;
        // }
        else {
          this.setState({
            saveAndNotifyModalVisible: true,
          });
        }
      }
    );
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
      notification_type_user: [],
      notification_type_department_name: [],
      hasAssignTypeError: false,
    });
  };

  toggleNotifyDepartmentMenu = () =>
    this.setState({
      isNotifyDepartmentMenuOpen: !this.state.isNotifyDepartmentMenuOpen,
    });

  saveMedicalData = (check) => {
    console.log(check);
    this.setState(
      {
        hasTypeValidationError: false,
        hasClassNameValidationError: false,
        hasCategotyNameValidationError: false,
        hasPriorityValidationError: false,
        hasDescriptionValidationError: false,
        hasCaseNameValidationError: false,
      },
      () => {
        if (this.state.notification_type.trim().length === 0 && check) {
          this.setState({ hasAssignTypeError: true });
          return false;
        } else {
          this.setState({ showLoader: true });
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
            date: getFormattedDate(this.state.entryDate),
            diagnosis_name: this.state.diagnosisName,
            diagnosis_name_id: this.state.diagnosisID,
            affected_parts: this.state.affectedParts,
            affected_parts_id: this.state.affected_parts_id,
            diagnosed_by_name: this.state.diagnosed_by,
            diagnosed_by_id: this.state.diagnosed_by_id,
            drug_id: this.state.medicineIdStr,
            dosage: this.state.dosage,
            next_treatment_date: getFormattedDate(this.state.nextDate),
            ref: this.state.selectionTypeId,
            ref_id: this.state.ref_id,
            description: this.state.description,
            case_name: this.state.description,
            learning: this.state.learning,
            prority: this.state.priorityName,
            reported_by: this.state.reported_by,
            status: this.state.statusID,
            route_id: this.state.route_id,
            route_name: this.state.route_name,
            notification_type: this.state.notification_type,
            notification_type_value: this.state.notification_type_value,
            notification_type_user: notification_type_user,
          };
          // console.log(obj);
          // this.0({ showLoader: false });
          // return;
          addMedicalRecord(obj, this.state.medicalUploadData)
            .then((response) => {
              ToastAndroid.show("Successfully Done !!", ToastAndroid.SHORT);
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
              alert("Something went wrong, Try Again!!");
              console.log(error);
            });
        }
      }
    );
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
            id: v.id,
            name: `${v.animal_id} | ${v.animal_name} `,
            value: v.id,
          })),
          // | ${v.enclosure_name} | ${v.section_name}
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setIncidentTypeData = (v) =>
    this.setState({
      diagnosisID: v.value,
      diagnosisName: v.name,
      isIncidentTypeMenuOpen: false,
    });

  setSelectionTypeData = (v) =>
    this.setState({
      selectionTypeId: v.value,
      selectionTypeName: v.name,
      ref_id: undefined,
      ref_name: undefined,
      isSelectionTypeMenuOpen: false,
    });

  setref = (v) => {
    this.setState({
      ref_id: v.id,
      ref_name: v.name,
      isrefMenuOpen: false,
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

  setClosedByData = (v) => {
    this.setState({
      diagnosed_by_id: v.id,
      diagnosed_by: v.name,
      isClosedByMenuOpen: false,
    });
  };

  setAffectedPartsData = (v) => {
    this.setState({
      affectedParts: v.name,
      affected_parts_id: v.id,
      isAffectedPartsMenuOpen: false,
    });
  };

  setRouteData = (v) => {
    this.setState({
      route_id: v.id,
      route_name: v.name,
      isRoutesMenuOpen: false,
    });
  };

  setDiagnosedByData = (v) => {
    this.setState({
      diagnosed_by_id: v.id,
      diagnosed_by: v.name,
      isDiagnosedByMenuOpen: false,
    });
  };

  setSelectedMedicines = (item) =>
    this.setState({
      selectedMedicines: item,
      medicineIdStr: item.map((e) => e.id).join(","),
    });

  setDrugData = (v) => {
    this.setState({
      drugID: v.id,
      drugName: v.name,
      isDrugMenuOpen: false,
    });
  };

  scrollToScrollViewTop = () => {
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };

  addCategory = () => {
    alert("Adding Records...");
    return;
  };
  addAffectedParts = () => {
    this.props.navigation.navigate("ManageAffectedParts");
  };
  addDiagnosis = () => {
    this.props.navigation.navigate("AddDiagnosis");
  };
  addRoutes = () => {
    this.props.navigation.navigate("ManageRoute");
  };

  chooseIncidentPhotos = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: false,
          quality: 1,
          // presentationStyle: 0,
          allowsMultipleSelection: true,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              medicalImages: [
                ...this.state.medicalImages,
                { id: Number(this.state.imageID) + 1, uri: result.uri },
              ],
              imageID: Number(this.state.imageID) + 1,
              medicalUploadData: [
                ...this.state.medicalUploadData,
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

  showDatePicker = (type) => {
    this.setState({ show: true, type: type });
  };

  handleConfirm = (selectDate) => {
    if (this.state.type == "entryDate") {
      this.setState({
        entryDate: selectDate,
        nextDate: moment(selectDate).add(1, "days").format(),
      });
    } else {
      this.setState({
        nextDate: selectDate,
      });
    }
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({ show: false });
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

  closeScanModal = () => {
    this.setState({ isScanModal: !this.state.isScanModal });
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

          ref_id: scanData.id,

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
            : scanData.id
            ? scanData.id
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
    let arr = this.state.medicalImages;
    arr = arr.filter((element) => element.id !== image.id);
    let arr2 = this.state.medicalUploadData;
    let uploadImage = getFileData(image);
    arr2 = arr2.filter((element) => element.name !== uploadImage.name);
    this.setState({
      medicalImages: arr,
      medicalUploadData: arr2,
    });
  };

  chooseDocument = () => {
    DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "vnd.ms-excel",
        "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ],
      copyToCacheDirectory: true,
    }).then((result) => {
      if (result.type === "success") {
        this.setState({
          docURI: result.name,
          docData: getFileData(result),
        });
      }
    });
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
    // scanData: "",
    // toggleShowOptionsAfterScan: false,
  });
};

  render = () => (
    <SafeAreaView style={styles.container}>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        title={parseInt(this.state.id) > 0 ? "Edit Record" : "Medical Record"}
        // showRelatedScanButton={true}
        
        openRelatedScaner={this.openRelatedScaner}
      />
      <View style={{ marginBottom: 50 }}>
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
            paddingTop: 5,
            marginBottom: 20,
          }}
        >
          {/* <View
            style={[
              styles.inputContainer,
              styles.pb0,
              styles.mb0,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <Text style={styles.name}>Select Document</Text>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.imagePicker}
              onPress={this.chooseDocument}
            >
              {typeof this.state.docURI !== "undefined" ? (
                <Text style={[styles.name, { fontSize: 14, width: 120 }]}>
                  {this.state.docURI}
                </Text>
              ) : (
                <Ionicons
                  name="document-text-outline"
                  style={{ fontSize: 40, color: "#adadad" }}
                />
              )}
            </TouchableOpacity>
          </View> */}
          
          <View style={styles.boxBorder}>
            {this.state.id == 0 ? null : (
              <Dropdown
                label={"Status:"}
                // placeholder="Select status"
                value={
                  this.state.statusID == "P"
                    ? "Pending"
                    : this.state.statusID == "A"
                    ? "Closed"
                    : "Ongoing"
                }
                items={Configs.MEDICAL_RECORD_STATUS}
                onChange={this.setRecordStatus}
                labelStyle={styles.labelName}
                textFieldStyle={[styles.textfield, { width: "60%" }]}
                style={[styles.fieldBox]}
              />
            )}

            {/* {this.props.route.params?.prefilled ? (
              
            ) : null} */}
            <>
              <InputDropdown
                label={"Related to"}
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
                ) : null
              ) : null}
                 
              {/* {this.state.selectionTypeId == 'enclosure' ? (
                        <View style={styles.inputContainer}>
                            <InputDropdown
                                label={"Enclosures"}
                                value={this.state.ref_name}
                                isOpen={this.state.isrefMenuOpen}
                                items={this.state.enclosures}
                                openAction={this.togglerefMenu}
                                closeAction={this.togglerefMenu}
                                setValue={this.setref}
                                labelStyle={styles.name}
                                textFieldStyle={styles.inputText}
                            />
                        </View>
                    ) : null} */}

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
            {/*<View
              style={[
                styles.fieldBox,
                this.state.hasCaseNameValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Name
                <Text style={{ fontSize: 12 }}> {'(Short Desc):'}</Text>
              </Text>
              <TextInput
                multiline={true}
                value={this.state.caseName}
                onChangeText={text => this.setState({ caseName: text })}
                style={[styles.textfield, styles.width60]}
                autoCompleteType="off"
                // placeholder="Enter Case Name"
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
                onChangeText={(text) => this.setState({ description: text })}
                style={[styles.textfield, styles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
                maxLength={120}
                // placeholder="Enter Medical Description"
              />
            </View>

            {/* <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Date: </Text>
              <TouchableOpacity style={{ width: '60%' }} onPress={() => { this.showDatePicker("entryDate") }}>
                <Text style={styles.dateField}>{moment(this.state.entryDate).format("DD-MM-YYYY")}</Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={[styles.inputContainer]}> */}

            {/* ==================================================================================================================================================== */}

            {this.props.route.params?.prefilled ? null : (
              <></>
              // <>
              //   <InputDropdown
              //     label={"Related to"}
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
              //           value={this.state.ref_name}
              //           isOpen={this.state.isrefMenuOpen}
              //           items={this.state.enclosuress}
              //           openAction={this.togglerefMenu}
              //           closeAction={this.togglerefMenu}
              //           setValue={this.setref}
              //           // placeholder="Select Enclosures"
              //           labelStyle={styles.labelName}
              //           textFieldStyle={styles.textfield}
              //           style={[styles.fieldBox]}
              //         />
              //         {/* </View> */}
              //       </>
              //     ) : null
              //   ) : null}

              //   {/* {this.state.selectionTypeId == 'enclosure' ? (
              //           <View style={styles.inputContainer}>
              //               <InputDropdown
              //                   label={"Enclosures"}
              //                   value={this.state.ref_name}
              //                   isOpen={this.state.isrefMenuOpen}
              //                   items={this.state.enclosures}
              //                   openAction={this.togglerefMenu}
              //                   closeAction={this.togglerefMenu}
              //                   setValue={this.setref}
              //                   labelStyle={styles.name}
              //                   textFieldStyle={styles.inputText}
              //               />
              //           </View>
              //       ) : null} */}

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

            {/* <View style={[styles.inputContainer, {}]}> */}

            <InputDropdown
              label={"Affected Parts"}
              value={this.state.affectedParts}
              isOpen={this.state.isAffectedPartsMenuOpen}
              items={this.state.affected_parts}
              openAction={this.toggleAffectedPartsMenu}
              closeAction={this.toggleAffectedPartsMenu}
              setValue={this.setAffectedPartsData}
              // placeholder="Select Affected Parts"
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[styles.fieldBox]}
              // extraIcon={<Ionicons name="add-circle" color={Colors.primary} size={22} />}
              // extraFunc={this.addAffectedParts}
            />
            {/* </View> */}

            {/* <View style={styles.inputContainer}> */}
            <InputDropdown
              label={"Diagnosis"}
              value={this.state.diagnosisName}
              isOpen={this.state.isIncidentTypeMenuOpen}
              items={this.state.diagnosis}
              openAction={this.toggleIncidentTypeMenu}
              closeAction={this.toggleIncidentTypeMenu}
              setValue={this.setIncidentTypeData}
              // placeholder="Select Diagnosis"
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[
                styles.fieldBox,
                this.state.hasDiagnosisValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
              // extraIcon={<Ionicons name="add-circle" color={Colors.primary} size={22} />}
              // extraFunc={this.addDiagnosis}
            />
            {/* </View> */}

            {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}> */}
            <View style={styles.fieldBox}>
              <MultiSelectDropdown
                label={"Select Drug"}
                items={this.state.medicines}
                selectedItems={this.state.selectedMedicines}
                labelStyle={styles.labelName}
                placeHolderContainer={styles.textfield}
                placeholderStyle={styles.placeholderStyle}
                selectedItemsContainer={styles.selectedItemsContainer}
                onSave={this.setSelectedMedicines}
                listView={true}
              />
            </View>
            {/* <MultiSelectDropdown
              label={"Select Drug"}
              items={this.state.medicines}
              // selectedItems={this.state.notification_type_user}
              labelStyle={styles.labelName}
              placeHolderContainer={styles.textfield}
              placeholderStyle={styles.placeholderStyle}
              selectedItemsContainer={styles.selectedItemsContainer}
              onSave={(value) => {
                let tempIdStr = "";
                value?.forEach(element => {
                  tempIdStr += element.id + ",";
                });
                tempIdStr = tempIdStr.substring(0, tempIdStr.length - 1);
                this.setState({medicineIdStr: tempIdStr})
              }}
            /> */}
            {/* <MultiSelectforUser
              // label={"Animal Category"}  

              label={"Choose User"}
              items={this.state.medicines}
              // selectedItems={this.state.notification_type_user}
              labelStyle={styles.labelName}
              placeHolderContainer={styles.textfield}
              placeholderStyle={styles.placeholderStyle}
              selectedItemsContainer={styles.selectedItemsContainer}

              listView={true}
              onSave={(v) => {
                console.log(v)
                // this.setState({
                //   notification_type_value: '',
                //   notification_type_user: v
                // });
              }}

							// items={this.state.animalCategories}
							// selectedItems={this.state.selectedAnimalCategories}
							// labelStyle={styles.labelName}
							// placeHolderContainer={styles.textfield}
							// placeholderStyle={styles.placeholderStyle}
							// selectedItemsContainer={styles.selectedItemsContainer}
							// onSave={this.setSelectedAnimalCategories}
							// listView={true}
						/> */}
            {/* </View> */}
            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Dosage:</Text>
              <TextInput
                value={this.state.dosage}
                onChangeText={(text) => this.setState({ dosage: text })}
                style={[styles.textfield, styles.width60]}
                autoCompleteType="off"
                // keyboardType="numeric"
                // placeholder="Enter Dosage"
              />
            </View>

            {/* <View style={styles.inputContainer}> */}
            <InputDropdown
              label={"Routes"}
              value={this.state.route_name}
              isOpen={this.state.isRoutesMenuOpen}
              items={this.state.routes}
              openAction={this.toggleRouteMenu}
              closeAction={this.toggleRouteMenu}
              setValue={this.setRouteData}
              // placeholder="Select Routes"
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[styles.fieldBox]}
              // extraIcon={<Ionicons name="add-circle" color={Colors.primary} size={22} />}
              // extraFunc={this.addRoutes}
            />
            {/* </View> */}

            {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}> */}

            {/* </View> */}

            {/* <View style={styles.inputContainer}> */}
            {/* <Dropdown
              label={"Severity:"}
              // placeholder="Select Severity"
              value={this.state.priorityName}
              items={Configs.ITEM_PRIORITIES}
              onChange={this.setPriority}
              labelStyle={styles.labelName}
              textFieldStyle={[styles.textfield, styles.width60]}
              style={[
                styles.fieldBox,
                this.state.hasPriorityValidationError
                  ? styles.errorFieldBox
                  : null,
              ]}
            /> */}
            <View style={{ backgroundColor: Colors.white }}>
              <Text style={[styles.labelName, { marginLeft: 8 }]}>
                Severity
              </Text>
              <Priority
                priority={this.state.priorityName}
                onPress={(text) => this.setState({ priorityName: text })}
              />
            </View>
            {/* </View> 

            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Next Treatment: </Text>
              <TouchableOpacity style={{ width: '60%' }} onPress={() => { this.showDatePicker("nextDate") }}>
                <Text style={[styles.dateField]}>{moment(this.state.nextDate).format("DD-MM-YYYY")}</Text>
              </TouchableOpacity>
            </View>
            */}
            {/* <View style={styles.inputContainer}>
            <DatePicker
              onPress={this.showNextDatepicker}
              show={this.state.showNext}
              onChange={this.onChangeNextDate}
              date={this.state.nextDate}
              mode={"date"}
              label={"Next Treatment Date :"}
            />
          </View> */}
            {
              this.state.id != 0 ? null : (
                // <View style={styles.inputContainer}>
                <Dropdown
                  label={"Status:"}
                  // placeholder="Select status"
                  value={
                    this.state.statusID == "P"
                      ? "Pending"
                      : this.state.statusID == "A"
                      ? "Closed"
                      : "Ongoing"
                  }
                  items={Configs.MEDICAL_RECORD_STATUS}
                  onChange={this.setRecordStatus}
                  labelStyle={styles.labelName}
                  textFieldStyle={[styles.textfield, styles.width60]}
                  style={[styles.fieldBox]}
                />
              )
              // </View>
            }
            {/*} <View
              style={[
                styles.fieldBox
              ]}
            >
              <Text style={styles.labelName}>Comments:</Text>
              <TextInput
                multiline={true}
                value={this.state.learning}
                onChangeText={text => this.setState({ learning: text })}
                style={[styles.textfield, styles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              // placeholder="Enter Comments"
              />
            </View>
            */}

            {/* <View style={[styles.inputContainer, styles.pb0, styles.mb0]}> */}
            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>{`Upload Photos`}</Text>
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
            ) : null}
            {/* </View> */}
            <InputDropdown
              label={"Diagnosed by"}
              value={this.state.diagnosed_by}
              isOpen={this.state.isDiagnosedByMenuOpen}
              items={this.state.users}
              openAction={this.toggleDiagnosedMenu}
              closeAction={this.toggleDiagnosedMenu}
              setValue={this.setDiagnosedByData}
              // placeholder="Select Diagnosed by"
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[styles.fieldBox]}
            />
            <View style={[styles.fieldBox, { borderBottomWidth: 0 }]}>
              <Text style={styles.labelName}>Reported By:</Text>
              <TextInput
                multiline={true}
                value={this.state.reported_by_name}
                style={[styles.textfield, styles.width60]}
                editable={false}
                autoCapitalize="words"
                autoCompleteType="off"
              />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            {/* <TouchableOpacity activeOpacity={1} onPress={this.testing}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity> */}

            <TouchableOpacity activeOpacity={1} onPress={this.saveNotify}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>
                Save & Notify
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
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

      <ModalMenu
        visible={this.state.statusModalVisible}
        closeAction={this.toggleModalVisible}
      >
        {[1, 2, 3].map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setRecordStatus.bind(this, v)}
            key={i}
          >
            <Text style={styles.itemtitle}>{v}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>

      {/* save and notify popup */}
      <Modal
        isVisible={this.state.saveAndNotifyModalVisible}
        coverScreen={false}
        onBackdropPress={() =>
          this.setState({ saveAndNotifyModalVisible: false })
        }
      >
        <View style={styles.popupContainer}>
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

      {/* save confirmation popup */}
      <Modal
        isVisible={this.state.saveConfirmModalVisible}
        coverScreen={false}
        onBackdropPress={() =>
          this.setState({ saveConfirmModalVisible: false })
        }
      >
        <View style={styles.popupContainer}>
          <Text style={styles.popupText}>Do you want to save?</Text>
          <View style={{ flexDirection: "row", marginTop: 40 }}>
            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.saveMedicalData(false);
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

      {/* show notify user popup */}
      <Modal
        isVisible={this.state.notifyUserModalVisible}
        coverScreen={false}
        onBackdropPress={() => this.setState({ notifyUserModalVisible: false })}
      >
        <View style={styles.popupContainer}>
          <Text style={styles.popupText}>Assign Type :</Text>
          <View style={{ padding: 10 }}>
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
                Plase Choose any assign type
              </Text>
            ) : null}
          </View>

          {this.state.notification_type == "Departments" ? (
            <InputDropdown
              value={this.state.notification_type_department_name}
              label={"Department"}
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
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              style={[styles.fieldBox]}
            />
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
                    notification_type_department_name: [],
                    notification_type_user: v,
                  });
                }}
              />
            </View>
          ) : null}

          <View style={{ flexDirection: "row", marginTop: 40 }}>
            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  this.saveMedicalData(true);
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
                    saveConfirmModalVisible: true,
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

      {/*Scan Modal*/}
      <ScannerButton btnPress={this.openScaner}/>
      <Modal2
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        // visible={this.state.isScanModal}
        visible={this.state.toggleScanModal}
        onRequestClose={this.closeScanModal}
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

      <DateTimePickerModal
        mode={"date"}
        display={Platform.OS == "ios" ? "inline" : "default"}
        isVisible={this.state.show}
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
      />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   body: {
//     flex: 9,
//   },
//   chooseCatContainer: {
//     flexDirection: "row",
//     marginVertical: 10,
//     paddingHorizontal: 10,
//     alignItems: "center",
//     justifyContent: "space-between",
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
//     fontSize: 50,
//     color: "#adadad",
//   },
//   name: {
//     fontSize: 18,
//     color: Colors.textColor,
//     marginBottom: 10,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//     marginVertical: 30,
//   },
//   inputText: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     fontSize: 18,
//     backgroundColor: "#f9f6f6",
//     paddingHorizontal: 10,
//     color: Colors.textColor,
//   },
//   inputTextArea: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     backgroundColor: "#f9f6f6",
//     textAlignVertical: "top",
//     padding: 10,
//     fontSize: 18,
//     color: Colors.textColor,
//     borderRadius: 3,
//   },
//   inputContainer: {
//   },
//   pb0: {
//     paddingBottom: 0,
//   },
//   mb0: {
//     marginBottom: 0,
//   },
//   buttonText: {
//     fontSize: 18,
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
//     fontSize: 18,
//   },
//   errorText: {
//     textAlign: "right",
//     color: Colors.tomato,
//     fontWeight: "bold",
//     fontStyle: "italic",
//   },
//   imagePicker: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     padding: 3,
//     backgroundColor: "#fff",
//     borderRadius: 3,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   width60:{
//     width:'60%'
//   },

//   fieldBox: {
//     alignItems: 'center',
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderBottomWidth: 1,
//     backgroundColor: "#fff",
//     height: 'auto',
//     justifyContent: "space-between",
//     // shadowColor: "#999",
//     // shadowOffset: {
//     // 	width: 0,
//     // 	height: 1,
//     // },
//     // shadowOpacity: 0.22,
//     // shadowRadius: 2.22,
//     // elevation: 3,
//   },
//   labelName: {
//     color: Colors.labelColor,
//     // lineHeight: 40,
//     fontSize: 19,
//     paddingLeft: 4,
//     height: 'auto',
//     paddingVertical: 10,
//     // width: '50%'
//   },
//   textfield: {
//     backgroundColor: "#fff",
//     height: 'auto',
//     flexWrap:'wrap',
//     fontSize: 19,
//     // width: '60%',
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   dateField: {
//     backgroundColor: "#fff",
//     height: 'auto',
//     fontSize: 19,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
// });
