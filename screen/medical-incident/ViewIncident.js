import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Container } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { Header, OverlayLoader } from "../../component";
import { Colors } from "../../config";
import {
  getIncidentTypes,
  manage_active_status,
  updateIncidentStatus,
} from "../../services/MedicalAndIncidenTServices";
import {
  getAnimalSections,
  getAllEnclosures,
  getAllAnimals,
} from "../../services/APIServices";
import { getUsers } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import { Dimensions } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import ImageView from "react-native-image-viewing";
import globalStyles from "../../config/Styles";
import { capitalize } from "./../../utils/Util";
import CustomCheckbox from "../../component/tasks/AddTodo/CustomCheckBox";
import PDFReader from "@hashiprobr/expo-pdf-reader";

const renderImage = (prop) => {
  const images = prop.map((item) => {
    return `<div style="width:100px;margin: 0 3px;">
            <img src="${item}" width="100%" height="auto">
        </div>`;
  });
  return images;
};

const htmlRender = (item) => {
  let html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>App Html Table</title>
<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
</style>
</head>

<body style="background: lightgray;">
<main style="font-family: 'Roboto',sans-serif;">
    <div style="background: white;width:100%;margin: 0 auto;">
    <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">ID:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">#${
              item?.id ? item?.id : "N/A"
            }</div>
        </div>
        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Types:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.ref ? capitalize(item?.ref) : "N/A"
            }</div>
        </div>`;

  if (item.ref == "animal") {
    html += `<div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
                <div style="width: 50%; text-align: left;font-size: 15px;">Animal:</div>
                <div style="width: 50%; text-align: left;font-size: 15px;">${
                  item?.ref_value ? item?.ref_value : "N/A"
                }</div>
             </div>
             <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
                <div style="width: 50%; text-align: left;font-size: 15px;">Section:</div>
                <div style="width: 50%; text-align: left;font-size: 15px;">${
                  item?.section ? item?.section : "N/A"
                }</div>
             </div>
             <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
                <div style="width: 50%; text-align: left;font-size: 15px;">Enclosure:</div>
                <div style="width: 50%; text-align: left;font-size: 15px;">${
                  item?.enclosure ? item?.enclosure : "N/A"
                }</div>
             </div>
             <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
                <div style="width: 50%; text-align: left;font-size: 15px;">Common Name:</div>
                <div style="width: 50%; text-align: left;font-size: 15px;">${
                  item?.english_name ? item?.english_name : "N/A"
                }</div>
             </div>
             `;
  }
  if (item.ref == "section") {
    html += `<div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
                <div style="width: 50%; text-align: left;font-size: 15px;">Section:</div>
                <div style="width: 50%; text-align: left;font-size: 15px;">${
                  item?.ref_value ? item?.ref_value : "N/A"
                }</div>
             </div>`;
  }
  if (item.ref == "enclosure") {
    html += `<div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
                <div style="width: 50%; text-align: left;font-size: 15px;">Enclosure:</div>
                <div style="width: 50%; text-align: left;font-size: 15px;">${
                  item?.ref_value ? item?.ref_value : "N/A"
                }</div>
             </div>`;
  }

  html += `<div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Incident Types:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.type_name ? item?.type_name : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Description:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.description ? item?.description : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Priority:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.priority ? item?.priority : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Reported By:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.full_name ? item?.full_name : "N/A"
            }</div>
        </div>


        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;">Status:</div>
            <div style="width: 50%; text-align: left;">${
              item.status == "A" ? "Closed" : "Pending"
            }</div>
        </div>`;

  if (item.attachment) {
    html += `<div style="background: white;margin: 0 auto;padding: 10px;margin-top: 10px;">
                    <h5 style="margin:5px 5px 10px;">Attachments</h5>
                <div style="display: flex;flex-wrap: wrap;">
                    ${renderImage(JSON.parse(item.attachment))}
                </div>`;
  }

  html += `</div>
            </main>		
            </body>
            </html>`;

  const download_data = async () => {
    const { uri } = await Print.printToFileAsync({
      html,
    });
    console.log(uri);
    await shareAsync(uri, { UTI: ".jpeg", mimeType: "application/jpeg" });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={download_data}
      style={globalStyles.p5}
    >
      <AntDesign name="export" size={20} color={Colors.white} />
    </TouchableOpacity>
  );
};

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
      animals: [],
      users: [],
      id: props.route.params.item?.id ?? 0,
      typeName: props.route.params.item?.type_name ?? "",
      prority: props.route.params.hasOwnProperty("prority")
        ? props.route.params.prority
        : undefined,
      description: props.route.params.item?.description ?? "",
      reported_by_name: props.route.params.item?.full_name ?? "",
      hasIncidentTypesValidationError: false,
      hasPriorityValidationError: false,
      hasDescriptionValidationError: false,
      showLoader: true,
      priorityID: undefined,
      priorityName: props.route.params.item?.priority ?? undefined,
      solution: props.route.params.item?.solution ?? "",
      currentStatus: props.route.params.item?.status ?? "",
      to_be_closed_by: props.route.params.item?.to_be_closed_by ?? "",
      to_be_closed_by_id:
        props.route.params.item?.to_be_closed_by_id ?? undefined,
      isClosedByMenuOpen: false,
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
      ],
      selectionTypeName: props.route.params.item?.ref ?? "",
      isSelectionTypeMenuOpen: false,
      selectionTypeId: props.route.params.item?.ref ?? undefined,
      ref_id: props.route.params.item?.ref_id ?? undefined,
      ref_name: props.route.params.item?.ref_value ?? "",
      isrefMenuOpen: false,
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
      is_active: true,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    // this.setState({
    //     reported_by_name: this.context.userDetails.full_name,
    //     reported_by: this.context.userDetails.id
    // })
    let cid = this.context.userDetails.cid;
    Promise.all([
      getIncidentTypes(cid),
      getAnimalSections(cid),
      getAllEnclosures(cid),
      getAllAnimals(cid),
      getUsers(cid),
    ])
      .then((data) => {
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
          animals: data[3].map((v, i) => ({
            id: v.id,
            name: v.animal_id,
            value: v.id,
          })),
          users: data[4].map((v, i) => ({
            id: v.id,
            name: v.full_name,
            value: v.id,
          })),
          showLoader: false,
        });
      })
      .catch((error) => console.log(error));
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
  toggleClosedMenu = () =>
    this.setState({ isClosedByMenuOpen: !this.state.isClosedByMenuOpen });

  gotoCategory = () => {
    this.props.navigation.goBack();
  };

  handleSubmit = () => {
    Alert.alert("Warning!!", "Do you want to hide this record ?", [
      { text: "Yes", onPress: () => this.manageStatus() },
      { text: "No" },
    ]);
  };

  manageStatus = () => {
    let obj = {
      ref: "incident_reporting",
      id: this.state.id,
    };
    manage_active_status(obj)
      .then((res) => {
        Alert.alert("Success", "Incident Report " + res.message, [
          { text: "OK", onPress: () => this.props.navigation.goBack() },
        ]);
      })
      .catch((err) => console.log(err));
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
    });

  setSelectionTypeData = (v) =>
    this.setState({
      selectionTypeId: v.value,
      selectionTypeName: v.name,
      ref_id: undefined,
      ref_name: "",
      isSelectionTypeMenuOpen: false,
    });

  setref = (v) => {
    this.setState({
      ref_id: v.id,
      ref_name: v.name,
      isrefMenuOpen: false,
    });
  };

  setClosedByData = (v) => {
    this.setState({
      to_be_closed_by_id: v.id,
      to_be_closed_by: v.name,
      isClosedByMenuOpen: false,
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
      selectionTypeId,
      incidentTypeId,
      categoryName,
      priorityID,
      description,
    } = this.state;
    this.setState(
      {
        hasTypeValidationError: false,
        hasClassNameValidationError: false,
        hasCategotyNameValidationError: false,
        hasPriorityValidationError: false,
        hasDescriptionValidationError: false,
      },
      () => {
        if (typeof selectionTypeId === "undefined") {
          this.setState({ hasTypeValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof incidentTypeId === "undefined") {
          this.setState({ hasIncidentTypesValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (description.trim().length === 0) {
          this.setState({ hasDescriptionValidationError: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            status: "A",
          };

          updateIncidentStatus(obj)
            .then((response) => {
              // let categories = this.context.categories;
              // categories.unshift(response.data);
              // this.context.setCategories(categories);

              this.setState(
                {
                  showLoader: false,
                },
                () => {
                  this.gotoCategory();
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

  openGalleryImageViewer = (id) => {
    let galleryImages = JSON.parse(this.props.route.params.item.attachment);
    let index = galleryImages.findIndex((item) => item === id);
    // console.log(index);
    this.setState({
      selectedGalleryImageIndex: index > -1 ? index : 0,
      isGalleryImageViewerOpen: true,
    });
  };

  closeGalleryImageViewer = () =>
    this.setState({
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
    });

  getGalleryImages = () => {
    let images = JSON.parse(this.props.route.params.item.attachment);
    let data = (images || []).map((item, index) => {
      return {
        id: index,
        uri: item,
      };
    });
    // console.log(data);
    return data;
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        title={"Incident Details"}
        downloadMedicalRecord={htmlRender}
        downloadItems={this.props.route.params.item}
      />
      {/* <PDFReader
        source={{
          uri: "https://www.africau.edu/images/default/sample.pdf",
        }}
      /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={globalStyles.container}
      >
        <View style={globalStyles.form}>
          <View style={globalStyles.rowContainer}>
            <View style={[globalStyles.row]}>
              <View style={globalStyles.rowLeft}>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                  ID:{" "}
                </Text>
              </View>
              <View style={globalStyles.rowRight}>
                <Text style={[globalStyles.textfield]}>#{this.state.id}</Text>
              </View>
            </View>
            <View style={[globalStyles.row]}>
              <View style={globalStyles.rowLeft}>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                  Types:{" "}
                </Text>
              </View>
              <View style={globalStyles.rowRight}>
                <Text style={[globalStyles.textfield]}>
                  {this.state?.selectionTypeName
                    ? capitalize(this.state?.selectionTypeName)
                    : "N/A"}
                </Text>
              </View>
            </View>
            {this.state?.selectionTypeName == "others" ? null : (
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    {capitalize(this.state?.selectionTypeName)}:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {this.state?.ref_name ? this.state?.ref_name : "N/A"}
                  </Text>
                </View>
              </View>
            )}
            <View style={[globalStyles.row]}>
              <View style={globalStyles.rowLeft}>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                  Incident Types:{" "}
                </Text>
              </View>
              <View style={globalStyles.rowRight}>
                <Text style={[globalStyles.textfield]}>
                  {this.state?.typeName ? this.state?.typeName : "N/A"}
                </Text>
              </View>
            </View>
            <View style={[globalStyles.row, { height: "auto" }]}>
              <View style={globalStyles.rowLeft}>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                  Description:{" "}
                </Text>
              </View>
              <View style={globalStyles.rowRight}>
                <Text style={[globalStyles.textfield]}>
                  {this.state?.description ? this.state?.description : "N/A"}
                </Text>
              </View>
            </View>
            <View style={[globalStyles.row]}>
              <View style={globalStyles.rowLeft}>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                  Priority:{" "}
                </Text>
              </View>
              <View style={globalStyles.rowRight}>
                <Text style={[globalStyles.textfield]}>
                  {this.state?.priorityName ? this.state?.priorityName : "N/A"}
                </Text>
              </View>
            </View>
            <View style={[globalStyles.row]}>
              <View style={globalStyles.rowLeft}>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                  Reported By:{" "}
                </Text>
              </View>
              <View style={globalStyles.rowRight}>
                <Text style={[globalStyles.textfield]}>
                  {this.state?.reported_by_name
                    ? this.state?.reported_by_name
                    : "N/A"}
                </Text>
              </View>
            </View>
            {/* <View style={[globalStyles.row]}>
                            <View style={globalStyles.rowLeft}>
                                <Text style={[globalStyles.labelName, globalStyles.pd0]}>Solution: </Text>
                            </View>
                            <View style={globalStyles.rowRight}>
                                <Text style={[globalStyles.textfield,]}>{this.state?.solution ? this.state?.solution : 'N/A'}</Text>
                            </View>
                        </View>
                        <View style={[globalStyles.row]}>
                            <View style={globalStyles.rowLeft}>
                                <Text style={[globalStyles.labelName, globalStyles.pd0]}>To be closed by: </Text>
                            </View>
                            <View style={globalStyles.rowRight}>
                                <Text style={[globalStyles.textfield,]}>{this.state?.to_be_closed_by ? this.state?.to_be_closed_by : 'N/A'}</Text>
                            </View>
                        </View>
                        */}
            <View style={[globalStyles.row, globalStyles.bbw0]}>
              <View style={globalStyles.rowLeft}>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                  Current Status:{" "}
                </Text>
              </View>
              <View style={globalStyles.rowRight}>
                <Text style={[globalStyles.textfield]}>
                  {this.state.currentStatus == "P" ? "Pending" : "Closed"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            globalStyles.width100,
            globalStyles.justifyContentCenter,
            globalStyles.alignItemsCenter,
            globalStyles.pv5,
          ]}
        >
          <TouchableOpacity
            style={globalStyles.incidentbtnCover}
            onPress={this.handleSubmit}
          >
            <Text style={globalStyles.incidentbtns}>HIDE</Text>
          </TouchableOpacity>
        </View>
        {/* {this.state.currentStatus == 'P' ? (
                    <View style={globalStyles.buttonsContainer}>
                        <TouchableOpacity activeOpacity={1} onPress={this.addCategory}>
                            <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>APPROVE</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    null
                )} */}
        {this.props.route.params.item.attachment ? (
          <>
            <View style={globalStyles.h10}></View>
            <View
              style={[
                globalStyles.form,
                globalStyles.viewIncidentAndObservationAttachment,
              ]}
            >
              <View>
                <Text style={globalStyles.textSub}>Attachments</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={globalStyles.scrollViewImageContainer}
              >
                {JSON.parse(this.props.route.params.item.attachment).length > 0
                  ? JSON.parse(this.props.route.params.item.attachment).map(
                      (item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            activeOpacity={1}
                            style={globalStyles.mh4}
                            onPress={this.openGalleryImageViewer.bind(
                              this,
                              item
                            )}
                          >
                            <Image
                              source={{ uri: item }}
                              style={globalStyles.incidentAndObservationImage}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        );
                      }
                    )
                  : null}
              </ScrollView>
            </View>
            <ImageView
              visible={this.state.isGalleryImageViewerOpen}
              images={this.getGalleryImages()}
              imageIndex={this.state.selectedGalleryImageIndex}
              onRequestClose={this.closeGalleryImageViewer}
            />
          </>
        ) : null}
      </ScrollView>
    </Container>
  );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 8,
//         backgroundColor: 'rgba(68,68,68,0.1)',

//     },
//     textSub: {
//         margin: 10,
//         color: Colors.textColor,
//         fontWeight: 'bold'
//     },
//     CardBox: {
//         width: '100%',
//         shadowColor: "#999",
//         shadowOffset: {
//             width: 0,
//             height: 0,
//         },
//         shadowOpacity: 0.10,
//         shadowRadius: 2.22,
//         elevation: 3,
//         borderRadius: 1,
//         paddingLeft: 10,
//         paddingTop: 10
//     },
//     galleryContainer: {
//         height: 120,
//         marginTop: 15,
//         paddingHorizontal: 4,
//     },
//     imageGrid: {
//         height: 120,
//         width: 88,
//         borderRadius: 3,
//         // marginHorizontal: 4,
//     },
//     rowContainer: {

//         borderColor: "#d2d1cd",
//         borderRadius: 10,
//         paddingVertical: 2,
//         borderRadius: 3,
//         // paddingHorizontal: 5,
//     },

//     row: {
//         marginTop: 0,
//         flexDirection: 'row',
//         marginBottom: 0,
//         borderBottomWidth: 1,
//         borderBottomColor: '#cfcfcf',
//         borderRadius: 3,
//         height: 45

//     },
//     rowLeft: {
//         width: '40%',
//         backgroundColor: '#fff',
//         paddingLeft: 10,
//         justifyContent: 'center',
//         marginTop: 0,
//         borderRadius: 3,
//         // paddingTop:1,
//         // paddingBottom:1,
//     },
//     rowRight: {
//         width: '58%',
//         marginLeft: 5,
//         backgroundColor: '#fff',
//         marginVertical: 5,
//         textAlign: 'center',
//         borderRadius: 3,
//         justifyContent: 'center',
//         // paddingBottom: 6
//     },
//     inputLable: {
//         fontSize: 14,
//         color: Colors.black,
//         marginBottom: 0,
//         opacity: 0.8,
//     },
//     inputContainer: {
//         width: "100%",
//         // marginBottom: 25,
//         borderRadius: 10
//     },
//     form: {
//         flex: 1,
//         backgroundColor: '#fff',
//         paddingVertical: 0,
//         paddingHorizontal: 0,
//         borderWidth: 1,
//         borderColor: 'rgba(68,68,68,0.1)',
//         borderRadius: 3,

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
//     buttonsContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-evenly",
//         marginVertical: 30,
//     },
// });
