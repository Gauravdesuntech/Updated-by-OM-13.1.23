import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import Base64 from "../../config/Base64";
import {
  Header,
  Dropdown,
  OverlayLoader,
  MultiSelectDropdown,
} from "../../component";
import MultiSelect from "react-native-multiple-select";
import {
  Ionicons,
  // FontAwesome,
  // AntDesign,
  // MaterialCommunityIcons,
  // Feather,
} from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import {
  getCommonNames,
  getAnimals,
  getAnimalEnclosureTypes,
  getAnimalEnclosureIds,
  animalChangeEnclosure,
  getApprovalUser,
  getAnimalSections,
} from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import globalStyles from "../../config/Styles";

export default class ChangeEnclosure extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      isDatepickerOpen: false,
      commonNames: [],
      animals: [],
      sections: [],
      enclosureIds: [],
      commonName: undefined,
      identificationType: undefined,
      animalCode: undefined,
      enclosureId: undefined,
      fromEnclosureId:
        props.route.params !== "undefined"
          ? props.route.params?.scanData?.enclosure_db_id
          : undefined,
      enclosureIDName: undefined,
      fromEnclosureIDName:
        props.route.params !== "undefined"
          ? props.route.params?.scanData?.enclosure_id
          : undefined,
      enclosureTypeID: undefined,
      fromEnclosureTypeID:
        props.route.params !== "undefined"
          ? props.route.params?.scanData?.section_id
          : undefined,
      enclosureType: undefined,
      fromEnclosureType:
        props.route.params !== "undefined"
          ? props.route.params?.scanData?.section
          : undefined,
      changedBy: "",
      reason: "",
      date: new Date(),
      commonNameValidationFailed: false,
      identificationTypeValidationFailed: false,
      animalCodeValidationFailed: false,
      isEnclosureTypeValidationFailed: false,
      isEnclosureIDValidationFailed: false,
      changedByValidationFailed: false,
      reasonValidationFailed: false,
      selectedAnimalsValidationFailed: false,
      isFromEnclosureTypeValidationFailed: false,
      isFromEnclosureIDValidationFailed: false,
      selectApprovalUserValidationFailed: false,
      selectedAnimal: [],
      approvalUser: [],
      selectedApprovalUser: undefined,
      selectedApprovalUserName: undefined,
      isScanModal: false,
      scanField: "",
    };

    this.scrollViewRef = React.createRef();
    this.multiSelect = React.createRef();
  }

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;
    let user_id = this.context.userDetails.id;
    Promise.all([
      getCommonNames({ cid }),
      getAnimalSections(cid),
      getApprovalUser(cid, user_id),
    ])
      .then((response) => {
        this.setState({
          showLoader: false,
          commonNames: response[0].map((v, i) => ({
            id: v.id,
            name: v.common_name,
          })),
          sections: response[1].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.name,
          })),
          approvalUser: response[2].map((v, i) => ({
            id: v.id,
            name: v.full_name,
            value: v.full_name,
          })),
        });
      })
      .catch((error) => console.log(error));

    if (this.props.route.params !== "undefined") {
      this.getEnclosureIds(this.props.route.params?.scanData?.section_id);

      if (this.props.route.params?.scanData?.enclosure_db_id) {
        this.getAnimalCodes();
      }
    }
  };

  gotoBack = () => this.props.navigation.goBack();

  showDatepicker = () => this.setState({ isDatepickerOpen: true });

  setCommonName = (v) => {
    this.setState(
      {
        showLoader: true,
        commonName: v.name,
        identificationType: undefined,
        animalCode: undefined,
      },
      () => {
        this.getAnimalCodes();
      }
    );
  };

  setIdentificationType = (v) => {
    this.setState(
      {
        showLoader: true,
        identificationType: v.name,
        animalCode: undefined,
      },
      () => {
        this.getAnimalCodes();
      }
    );
  };

  setEnclosureType = (v) => {
    this.setState(
      {
        enclosureTypeID: v.id,
        enclosureType: v.value,
        enclosureId: undefined,
        enclosureIDName: undefined,
        showLoader: true,
      },
      () => {
        this.getEnclosureIds(v.id);
      }
    );
  };

  setFromEnclosureType = (v) => {
    this.setState(
      {
        fromEnclosureTypeID: v.id,
        fromEnclosureType: v.value,
        enclosureId: undefined,
        fromEnclosureIDName: undefined,
        showLoader: true,
      },
      () => {
        this.getEnclosureIds(v.id);
      }
    );
  };

  getAnimalCodes = () => {
    let { fromEnclosureId, fromEnclosureTypeID } = this.state;
    let params = {};

    if (typeof fromEnclosureId !== "undefined") {
      params.enclosure_id = fromEnclosureId;
    }
    if (typeof fromEnclosureTypeID !== "undefined") {
      params.section_id = fromEnclosureTypeID;
    }

    if (Object.keys(params).length > 0) {
      getAnimals(params)
        .then((data) => {
          this.setState({
            animals: data.map((v, i) => ({
              id: v.animal_id,
              name: v.ring_number == null ? v.animal_id+" || "+v.english_name : v.animal_id+" || "+v.english_name+" || "+v.ring_number,
            })),
            showLoader: false,
          });
        })
        .catch((error) => console.log(error));
    } else {
      this.setState({ showLoader: false });
    }
  };

  setAnimalCode = (v) => {
    this.setState({
      animalCode: v.name,
    });
  };

  getEnclosureIds = (enclosureTypeID) => {
    let reqObj = {
      cid: this.context.userDetails.cid,
      section_id: enclosureTypeID,
    };

    getAnimalEnclosureIds(reqObj)
      .then((data) => {
        this.setState({
          showLoader: false,
          enclosureIds: data.map((v, i) => ({
            id: v.id,
            name: v.enclosure_id,
            value: v.enclosure_id,
          })),
        });
      })
      .catch((error) => console.log(error));
  };

  setApprovalUser = (v) => {
    this.setState({
      selectedApprovalUser: v.id,
      selectedApprovalUserName: v.value,
    });
  };

  setEnclosureID = (v) => {
    this.setState({
      enclosureId: v.id,
      enclosureIDName: v.value,
    });
  };

  setFromEnclosureID = (v) => {
    this.setState(
      {
        fromEnclosureId: v.id,
        fromEnclosureIDName: v.value,
      },
      () => {
        this.getAnimalCodes();
      }
    );
  };

  onChangeDate = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.date;
    this.setState({
      isDatepickerOpen: false,
      date: currentDate,
    });
  };

  setAnimals = (item) => this.setState({ selectedAnimal: item });

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveEnclosureRecord = () => {
    this.setState(
      {
        commonNameValidationFailed: false,
        identificationTypeValidationFailed: false,
        animalCodeValidationFailed: false,
        isEnclosureTypeValidationFailed: false,
        isEnclosureIDValidationFailed: false,
        changedByValidationFailed: false,
        reasonValidationFailed: false,
        selectedAnimalsValidationFailed: false,
        isFromEnclosureTypeValidationFailed: false,
        isFromEnclosureIDValidationFailed: false,
        selectApprovalUserValidationFailed: false,
      },
      () => {
        let {
          selectedAnimal,
          enclosureTypeID,
          enclosureId,
          fromEnclosureTypeID,
          fromEnclosureId,
          date,
          changedBy,
          reason,
          selectedApprovalUserName,
        } = this.state;
        if (typeof fromEnclosureTypeID === "undefined") {
          this.setState({ isFromEnclosureTypeValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (typeof fromEnclosureId === "undefined") {
          this.setState({ isFromEnclosureIDValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (typeof enclosureTypeID === "undefined") {
          this.setState({ isEnclosureTypeValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (typeof enclosureId === "undefined") {
          this.setState({ isEnclosureIDValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (selectedAnimal.length === 0) {
          this.setState({ selectedAnimalsValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (reason.trim().length === 0) {
          this.setState({ reasonValidationFailed: true });
          return false;
        } else if (typeof selectedApprovalUserName === 0) {
          this.setState({ selectApprovalUserValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let selectedAnimals = selectedAnimal.map((v, i) => v.id);
          let obj = {
            animal_id: selectedAnimals.join(","),
            enclosure_type: enclosureTypeID,
            enclosure_id: enclosureId,
            prev_enclosures_type: fromEnclosureTypeID,
            prev_enclosure_id: fromEnclosureId,
            changed_by: this.context.userDetails.id,
            change_reason: reason,
            approval_user: this.state.selectedApprovalUser,
          };

          animalChangeEnclosure(obj)
            .then((response) => {
              this.setState(
                {
                  animals: [],
                  enclosureIds: [],
                  commonName: undefined,
                  identificationType: undefined,
                  animalCode: undefined,
                  enclosureId: undefined,
                  enclosureIDName: undefined,
                  enclosureTypeID: undefined,
                  enclosureType: undefined,
                  fromEnclosureTypeID: undefined,
                  fromEnclosureType: undefined,
                  fromEnclosureId: undefined,
                  fromEnclosureIDName: undefined,
                  changedBy: "",
                  reason: "",
                  date: new Date(),
                  showLoader: false,
                  selectedAnimal: [],
                  selectedApprovalUser: undefined,
                  selectedApprovalUserName: undefined,
                },
                () => {
                  alert(response.message);
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

  openRelatedScaner = (scanField) => {
    Camera.requestCameraPermissionsAsync()
      .then((result) => {
        if (result.status === "granted") {
          this.setState({ isScanModal: !this.state.isScanModal, scanField });
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
      console.log({ scanData });
      let type = scanData.type ? scanData.type : scanData.qr_code_type;
      if (type == "Group") {
        this.setState({
          isScanModal: !this.state.isScanModal,
        });
        alert("This is animal QR code");
      } else {
        if (this.state.scanField === "from") {
          this.setState({
            isScanModal: !this.state.isScanModal,
            fromEnclosureId: scanData?.enclosure_db_id,
            fromEnclosureIDName: scanData?.enclosure_id,
            fromEnclosureTypeID: scanData?.section_id,
            fromEnclosureType: scanData?.section,
          });
        } else {
          this.setState({
            isScanModal: !this.state.isScanModal,
            enclosureId: scanData?.enclosure_db_id,
            enclosureIDName: scanData?.enclosure_id,
            enclosureTypeID: scanData?.section_id,
            enclosureType: scanData?.section,
          });
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({ isScanModal: !this.state.isScanModal });
      alert("Wrong QR code scan !!");
    }
  };

  render = () => (
    <Container>
      <Header title={"Change Enclosure"} />
      <View style={globalStyles.container}>
        <KeyboardAwareScrollView
          ref={this.scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              globalStyles.mt5,
              globalStyles.ml10,
              globalStyles.flexDirectionRow,
              globalStyles.alignItemsCenter,
              globalStyles.justifyContentBetween,
            ]}
          >
            <Text>From :</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.openRelatedScaner("from")}
              style={globalStyles.p5}
            >
              <Ionicons name="qr-code-outline" size={25} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <View style={globalStyles.boxBorder}>
            <Dropdown
              isMandatory={true}
              label={"Sections:"}
              // placeholder="Select Sections"
              value={this.state.fromEnclosureType}
              items={this.state.sections}
              onChange={this.setFromEnclosureType}
              labelStyle={globalStyles.labelName}
              textFieldStyle={[globalStyles.textfield, globalStyles.width60]}
              style={[globalStyles.fieldBox]}
            />

            <Dropdown
              isMandatory={true}
              label={"Enclosure ID:"}
              // placeholder="Select Enclosure ID"
              value={this.state.fromEnclosureIDName}
              items={this.state.enclosureIds}
              onChange={this.setFromEnclosureID}
              labelStyle={globalStyles.labelName}
              textFieldStyle={[globalStyles.textfield, globalStyles.width60]}
              style={[
                globalStyles.fieldBox,
                this.state.isFromEnclosureIDValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            />

            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <MultiSelectDropdown
                label={"Select Animals"}
                isMandatory={true}
                items={this.state.animals}
                selectedItems={this.state.selectedAnimal}
                labelStyle={globalStyles.labelName}
                //   placeholder={''}
                placeHolderContainer={globalStyles.placeHolderContainer}
                placeholderStyle={[globalStyles.textfield]}
                selectedItemsContainer={[
                  globalStyles.selectedItemsContainer,
                  globalStyles.width60,
                ]}
                onSave={this.setAnimals}
              />
              {this.state.selectedAnimalsValidationFailed ? (
                <Text style={globalStyles.errorText}>Select an option</Text>
              ) : null}
            </View>
          </View>

          <View
            style={[
              globalStyles.mt5,
              globalStyles.ml10,
              globalStyles.flexDirectionRow,
              globalStyles.alignItemsCenter,
              globalStyles.justifyContentBetween,
            ]}
          >
            <Text>To : </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.openRelatedScaner("to")}
              style={globalStyles.p5}
            >
              <Ionicons name="qr-code-outline" size={25} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <View style={globalStyles.boxBorder}>
            <Dropdown
              isMandatory={true}
              label={"Sections:"}
              // placeholder="Select Sections"
              value={this.state.enclosureType}
              items={this.state.sections}
              onChange={this.setEnclosureType}
              labelStyle={globalStyles.labelName}
              textFieldStyle={[globalStyles.textfield, globalStyles.width60]}
              style={[
                globalStyles.fieldBox,
                this.state.isEnclosureTypeValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            />

            <Dropdown
              isMandatory={true}
              label={"Enclosure ID:"}
              // placeholder="Select Enclosure ID"
              value={this.state.enclosureIDName}
              items={this.state.enclosureIds}
              onChange={this.setEnclosureID}
              labelStyle={globalStyles.labelName}
              textFieldStyle={[globalStyles.textfield, globalStyles.width60]}
              style={[
                globalStyles.fieldBox,
                this.state.isEnclosureIDValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            />

            <View
              style={[
                globalStyles.fieldBox,
                this.state.changedByValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={globalStyles.labelName}>
                Changed By: <Text style={{ color: Colors.tomato }}> *</Text>
              </Text>
              <Text style={[globalStyles.textfield, globalStyles.width60]}>
                {this.context.userDetails.full_name}
              </Text>
              {/* <TextInput
							value={this.state.changedBy}
							style={globalStyles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
							onChangeText={(changedBy) => this.setState({ changedBy })}
						/> */}
            </View>

            <View
              style={[
                globalStyles.fieldBox,
                this.state.reasonValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={globalStyles.labelName}>
                Reason: <Text style={{ color: Colors.tomato }}> *</Text>
              </Text>
              <TextInput
                value={this.state.reason}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
                onChangeText={(reason) => this.setState({ reason })}
              />
            </View>

            <Dropdown
              isMandatory={true}
              label={"Approval From:"}
              // placeholder="Select Approval From"
              value={this.state.selectedApprovalUserName}
              items={this.state.approvalUser}
              onChange={this.setApprovalUser}
              labelStyle={globalStyles.labelName}
              textFieldStyle={[globalStyles.textfield, globalStyles.width60]}
              style={[
                globalStyles.fieldBox,
                globalStyles.bbw0,
                this.state.selectApprovalUserValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            />
          </View>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={this.saveEnclosureRecord}
          >
            <Text style={globalStyles.textWhite}>Make Request</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>

      {/*Scan Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={this.state.isScanModal}
        onRequestClose={this.closeScanModal}
      >
        <SafeAreaView style={globalStyles.safeAreaViewStyle}>
          <View style={globalStyles.scanModalOverlay}>
            <View style={globalStyles.qrCodeSacnBox}>
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
              style={globalStyles.cancelButton}
              onPress={this.closeScanModal}
            >
              <Ionicons
                name="close-outline"
                style={globalStyles.cancelButtonText}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 8,
//   },
//   fieldBox: {
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
//   textfield: {
//     backgroundColor: "#fff",
//     height: "auto",

//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   button: {
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     padding: 10,
//     borderRadius: 20,
//     color: "#fff",
//     marginVertical: 10,
//     zIndex: 0,
//   },
//   textWhite: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   labelName: {
//     color: Colors.labelColor,
//     // lineHeight: 40,
//     fontSize: Colors.lableSize,
//     paddingLeft: 4,
//     height: "auto",
//     paddingVertical: 10,
//   },
//   textInputIcon: {
//     position: "absolute",
//     bottom: 14,
//     right: 10,
//     marginLeft: 8,
//     color: "#0482ED",
//     zIndex: 99,
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
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
//   multiSelectContainer: {
//     height: "auto",
//     width: "100%",
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     marginBottom: 5,
//     marginTop: 8,
//     // shadowColor: "#999",
//     // shadowOffset: {
//     // 	width: 0,
//     // 	height: 1,
//     // },
//     // shadowOpacity: 0.22,
//     // shadowRadius: 2.22,
//     // elevation: 3,
//     padding: 5,
//   },
//   placeholderStyle: {
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     opacity: 0.8,
//   },
//   placeHolderContainer: {
//     borderWidth: 0,
//   },
//   errorText: {
//     textAlign: "right",
//     color: Colors.tomato,
//     fontWeight: "bold",
//     fontStyle: "italic",
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
//   selectedItemsContainer: {
// 	width: "100%",
// 	height: "auto",
// 	backgroundColor: "#fff",
// 	paddingVertical: 8,
// 	flexDirection: "row",
// 	flexWrap: "wrap",
// 	alignItems: "flex-start",
// },
// });
