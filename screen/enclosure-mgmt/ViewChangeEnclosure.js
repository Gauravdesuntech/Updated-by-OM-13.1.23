import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ImageBackground,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import Base64 from "../../config/Base64";
import { Header, Dropdown, OverlayLoader } from "../../component";
import MultiSelect from "react-native-multiple-select";
import {
  getCommonNames,
  getAnimals,
  getAnimalEnclosureTypes,
  getAnimalEnclosureIds,
  animalChangeEnclosureUpdate,
} from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";

export default class ChangeEnclosure extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    console.log(props.route.params.item);
    this.state = {
      showLoader: true,
      isDatepickerOpen: false,
      commonNames: [],
      animals: [],
      enclosureTypes: [],
      enclosureIds: [],
      rejectModal: false,
      reject_reason: "",
      request_no:
        props.route.params.item !== "undefined"
          ? props.route.params.item.request_number
          : undefined,
      enclosureId:
        props.route.params.item !== "undefined"
          ? props.route.params.item.enclosure_id
          : undefined,
      fromEnclosureId:
        props.route.params.item !== "undefined"
          ? props.route.params.item.prev_enclosure_id
          : undefined,
      enclosureIDName:
        props.route.params.item !== "undefined"
          ? props.route.params.item.enclosure_id_name
          : undefined,
      fromEnclosureIDName:
        props.route.params.item !== "undefined"
          ? props.route.params.item.prev_enclosure_id_name
          : undefined,
      enclosureTypeID:
        props.route.params.item !== "undefined"
          ? props.route.params.item.enclosure_type
          : undefined,
      fromEnclosureTypeID:
        props.route.params.item !== "undefined"
          ? props.route.params.item.prev_enclosures_type
          : undefined,
      enclosureType:
        props.route.params.item !== "undefined"
          ? props.route.params.item.enclosure_type_name
          : undefined,
      fromEnclosureType:
        props.route.params.item !== "undefined"
          ? props.route.params.item.prev_enclosures_type_name
          : undefined,
      changedBy:
        props.route.params.item !== "undefined"
          ? props.route.params.item.changed_by
          : undefined,
      reason:
        props.route.params.item !== "undefined"
          ? props.route.params.item.change_reason
          : undefined,
      changed_by_name:
        props.route.params.item !== "undefined"
          ? props.route.params.item.changed_by_name
          : undefined,
      status:
        props.route.params.item !== "undefined"
          ? props.route.params.item.status
          : undefined,
      date: new Date(),
      commonNameValidationFailed: false,
      identificationTypeValidationFailed: false,
      animalCodeValidationFailed: false,
      isEnclosureTypeValidationFailed: false,
      isEnclosureIDValidationFailed: false,
      changedByValidationFailed: false,
      reasonValidationFailed: false,
      selectedAnimal:
        props.route.params.item !== "undefined"
          ? props.route.params.item.animal_id.split(",")
          : [],
      note:
        props.route.params.item.notes !== "undefined"
          ? props.route.params.item.notes
          : "",
    };

    this.scrollViewRef = React.createRef();
    this.multiSelect = React.createRef();
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedAnimal: selectedItems });
  };

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;

    Promise.all([getCommonNames({ cid }), getAnimalEnclosureTypes(cid)])
      .then((response) => {
        this.setState({
          showLoader: false,
          commonNames: response[0].map((v, i) => ({
            id: v.id,
            name: v.common_name,
          })),
          enclosureTypes: response[1].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.name,
          })),
        });
      })
      .catch((error) => console.log(error));
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
      params.enclosure_type = fromEnclosureTypeID;
    }

    if (Object.keys(params).length > 0) {
      getAnimals(params)
        .then((data) => {
          this.setState({
            animals: data.map((v, i) => ({
              id: v.animal_id,
              name: v.animal_id,
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
      enclosure_type_id: enclosureTypeID,
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

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveEnclosureRecord = (status) => {
    this.setState(
      {
        commonNameValidationFailed: false,
        identificationTypeValidationFailed: false,
        animalCodeValidationFailed: false,
        isEnclosureTypeValidationFailed: false,
        isEnclosureIDValidationFailed: false,
        changedByValidationFailed: false,
        reasonValidationFailed: false,
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
          reject_reason,
        } = this.state;
        if (typeof fromEnclosureTypeID === "undefined") {
          this.setState({ commonNameValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (typeof fromEnclosureId === "undefined") {
          this.setState({ identificationTypeValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (typeof selectedAnimal.length === 0) {
          this.setState({ animalCodeValidationFailed: true });
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
        } else if (reason.trim().length === 0) {
          this.setState({ reasonValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {};

          if (status == "changed") {
            obj = {
              animal_id: JSON.stringify(selectedAnimal),
              request_number: this.state.request_no,
              status: status,
              enclosure_type: enclosureTypeID,
              enclosure_id: enclosureId,
              user_id: this.context.userDetails.id,
            };
          } else {
            obj = {
              notes: this.state.note,
              request_number: this.state.request_no,
              status: status,
              approved_by: this.context.userDetails.id,
              user_id: this.context.userDetails.id,
            };
          }

          if (status == "rejected") {
            obj.rejection_reason = reject_reason;
          }
          animalChangeEnclosureUpdate(obj)
            .then((response) => {
              console.log(response);
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

  rejectRequest = () => {
    this.setState(
      {
        rejectModal: !this.state.rejectModal,
      },
      () => {
        this.saveEnclosureRecord("rejected");
      }
    );
  };

  toggleRejectModal = () => {
    this.setState({
      rejectModal: !this.state.rejectModal,
    });
  };

  renderButton = () => {
    // if (this.state.status == "pending") {
    //   if (
    //     this.context.userDetails.id ==
    //     this.props.route.params.item.approval_user
    //   ) {
    //     return (
    //       <View
    //         style={{ flexDirection: "row", justifyContent: "space-around" }}
    //       >
    //         <TouchableOpacity
    //           style={globalStyles.button}
    //           onPress={this.saveEnclosureRecord.bind(this, "approved")}
    //         >
    //           <Text style={globalStyles.textWhite}>Approve</Text>
    //         </TouchableOpacity>

    //         <TouchableOpacity
    //           style={[globalStyles.button, { backgroundColor: Colors.danger }]}
    //           onPress={this.toggleRejectModal}
    //         >
    //           <Text style={globalStyles.textWhite}>Reject</Text>
    //         </TouchableOpacity>
    //       </View>
    //     );
    //   }
    // }

    if (this.state.status == "approved") {
      if (
        this.context.userDetails.id === this.props.route.params.item.changed_by
      ) {
        return (
          <View>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.width100]}
              onPress={this.saveEnclosureRecord.bind(this, "changed")}
            >
              <Text style={globalStyles.textWhite}>Confirm Movement</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  };

  renderNote = () => {
    if (this.state.status == "pending") {
      if (
        this.context.userDetails.id ==
        this.props.route.params.item.approval_user
      ) {
        return (
          <View style={globalStyles.fieldBox}>
            <Text style={globalStyles.labelName}>Note:</Text>
            <TextInput
              value={this.state.note}
              style={globalStyles.textfield}
              autoCompleteType="off"
              autoCapitalize="words"
              onChangeText={(note) => this.setState({ note })}
            />
          </View>
        );
      }
    }

    if (this.state.status == "approved") {
      if (
        this.context.userDetails.id === this.props.route.params.item.changed_by
      ) {
        return (
          <View style={globalStyles.fieldBox}>
            <Text style={globalStyles.labelName}>Note:</Text>
            <Text style={globalStyles.textfield}>{this.state.note}</Text>
          </View>
        );
      }
    }

    return null;
  };

  render = () => (
    <Container>
      <Header title={"View Enclosure"} />
      <View style={globalStyles.container}>
        <ScrollView
          ref={this.scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text>From : </Text>
          </View>
          <View style={globalStyles.boxBorder}>
            <View
              style={[
                globalStyles.fieldBox,
                this.state.changedByValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={globalStyles.labelName}>
                Section: <Text style={{ color: Colors.tomato }}> *</Text>
              </Text>
              <Text style={globalStyles.textfield}>
                {this.state.fromEnclosureType}
              </Text>
            </View>

            <View
              style={[
                globalStyles.fieldBox,
                globalStyles.bbw0,
                this.state.changedByValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={globalStyles.labelName}>
                Enclosure ID: <Text style={{ color: Colors.tomato }}> *</Text>
              </Text>
              <Text style={globalStyles.textfield}>
                {this.state.fromEnclosureIDName}
              </Text>
            </View>
          </View>

          <View>
            <Text>To : </Text>
          </View>
          <View style={globalStyles.boxBorder}>
            <View
              style={[
                globalStyles.fieldBox,
                this.state.changedByValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={globalStyles.labelName}>
                Section: <Text style={{ color: Colors.tomato }}> *</Text>
              </Text>
              <Text style={globalStyles.textfield}>
                {this.state.enclosureType}
              </Text>
            </View>
            <View
              style={[
                globalStyles.fieldBox,
                globalStyles.bbw0,
                this.state.changedByValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={globalStyles.labelName}>
                Enclosure ID: <Text style={{ color: Colors.tomato }}> *</Text>
              </Text>
              <Text style={globalStyles.textfield}>
                {this.state.enclosureIDName}
              </Text>
            </View>
          </View>

          <View>
            <Text>Animals : </Text>
          </View>
          <View style={globalStyles.boxBorder}>
            <View style={globalStyles.multiSelectContainer}>
              {this.state.selectedAnimal.map((item) => {
                return (
                  <View
                    style={[
                      globalStyles.selectedItem,
                      {
                        width: item.length * 8 + 60,
                        justifyContent: "center",
                        height: 40,
                        borderColor: Colors.primary,
                      },
                    ]}
                    key={item}
                  >
                    <Text
                      style={[
                        {
                          flex: 1,
                          color: Colors.white,
                          fontSize: Colors.textSize,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item}
                    </Text>
                  </View>
                );
              })}
            </View>

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
              <Text style={globalStyles.textfield}>
                {this.state.changed_by_name}
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
                globalStyles.bbw0,
                this.state.changedByValidationFailed
                  ? globalStyles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={globalStyles.labelName}>
                Reason: <Text style={{ color: Colors.tomato }}> *</Text>
              </Text>
              <Text style={globalStyles.textfield}>{this.state.reason}</Text>
            </View>
          </View>

          {this.renderNote()}

          {this.renderButton()}
        </ScrollView>
      </View>

      <OverlayLoader visible={this.state.showLoader} />

      {/* Reject Reason Modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.rejectModal}
        onRequestClose={() => {
          this.toggleRejectModal(!this.state.rejectModal);
        }}
      >
        <ImageBackground
          style={globalStyles.container}
          blurRadius={this.state.rejectModal ? 2 : 0}
          source={require("../../assets/bg.jpg")}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <View>
                <Text>Reject Reason</Text>
              </View>
              <TextInput
                style={globalStyles.input}
                onChangeText={(text) => {
                  this.setState({ reject_reason: text });
                }}
                value={this.state.reject_reason}
                placeholder="Enter Reject Reason"
                autoCompleteType="off"
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                underlineColorAndroid="transparent"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.toggleRejectModal(!this.state.rejectModal);
                  }}
                  style={[globalStyles.btn, globalStyles.btnDanger]}
                >
                  <Text style={globalStyles.btnText}>cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.rejectRequest}
                  style={[globalStyles.btn, globalStyles.btnSuccess]}
                >
                  <Text style={globalStyles.btnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Modal>
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
//     // shadowColor: "#999",
//     // shadowOffset: {
//     //     width: 0,
//     //     height: 1,
//     // },
//     // shadowOpacity: 0.22,
//     // shadowRadius: 2.22,
//     // elevation: 3,
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
//     // shadowColor: "#000",
//     // shadowOffset: {
//     //     width: 0,
//     //     height: 2,
//     // },
//     // shadowOpacity: 0.23,
//     // shadowRadius: 2.62,
//     // elevation: 4,
//     borderRadius: 20,
//     color: "#fff",
//     marginVertical: 10,
//     zIndex: 0,
//     width: "40%",
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
//     // justifyContent: "space-between",
//   },
//   selectedItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingLeft: 15,
//     paddingTop: 3,
//     paddingRight: 3,
//     paddingBottom: 3,
//     margin: 3,
//     borderRadius: 20,
//     borderWidth: 2,
//     backgroundColor: Colors.primary,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 10,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     width: 300,
//     margin: 12,
//     borderWidth: 1,
//     padding: 10,
//     borderColor: "#ddd",
//     alignSelf: "flex-start",
//   },
//   btn: {
//     width: 100,
//     height: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 3,
//     marginBottom: 5,
//   },
//   btnExtra: {
//     width: 130,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 3,
//     marginBottom: 5,
//   },
//   btnDanger: {
//     backgroundColor: Colors.danger,
//   },
//   btnSuccess: {
//     backgroundColor: Colors.success,
//   },
//   btnText: { color: Colors.white },
// });
