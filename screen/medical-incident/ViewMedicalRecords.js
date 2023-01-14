import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Container } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { Header } from "../../component";
import { Colors } from "../../config";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import { Dimensions } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import ImageView from "react-native-image-viewing";
import globalStyles from "../../config/Styles";
import { capitalize } from "./../../utils/Util";
import CustomCheckbox from "../../component/tasks/AddTodo/CustomCheckBox";
import { manage_active_status } from "../../services/MedicalAndIncidenTServices";
import styles from "./Styles";

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
            <div style="width: 50%; text-align: left;font-size: 15px;">Case ID:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">#${
              item?.id ? item?.id : "N/A"
            }</div>
        </div>
        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Date:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${getFormattedDate(
              item.date,
              "DD/MM/YYYY"
            )}</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Types:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.ref ? capitalize(item?.ref) : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Diagonisis:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.diagnosis_name ? item?.diagnosis_name : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Affected Parts:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.affected_parts ? item?.affected_parts : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Diagonisis by:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.diagnosed_by_name ? item?.diagnosed_by_name : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Drug Name:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.drug_name ? item?.drug_name : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;font-size: 15px;">Dossage:</div>
            <div style="width: 50%; text-align: left;font-size: 15px;">${
              item?.dosage ? item?.dosage : "N/A"
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
              item?.reported_by_name ? item?.reported_by_name : "N/A"
            }</div>
        </div>

        <div style="display:flex;padding: 10px 5px; border-bottom: 1px solid gray;">
            <div style="width: 50%; text-align: left;">Status:</div>
            <div style="width: 50%; text-align: left;">${
              item.statusID == "P"
                ? "Pending"
                : item.statusID == "A"
                ? "Closed"
                : "Ongoing"
            }</div>
        </div>
    </div>`;

  if (item.image) {
    html += `<div style="background: white;margin: 0 auto;padding: 10px;margin-top: 10px;">
        <h5 style="margin:5px 5px 10px;">Attachments</h5>
    <div style="display: flex;flex-wrap: wrap;">
       ${renderImage(JSON.parse(item.image))}
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
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
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

export default class ViewMedicalRecord extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      id: props.route.params?.item?.id ?? 0,
      diagnosisID: props.route.params?.item?.diagnosis_name_id ?? undefined,
      diagnosisName: props.route.params?.item?.diagnosis_name ?? "",
      prority: props.route.params?.hasOwnProperty("prority")
        ? props.route.params?.prority
        : undefined,
      affectedParts: props.route.params?.item?.affected_parts ?? "",
      dosage: props.route.params?.item?.dosage ?? "",
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
      selectionTypeName: props.route.params?.item?.ref ?? "",
      selectionTypeId: props.route.params?.item?.ref ?? undefined,
      ref_id: props.route.params?.item?.ref_id ?? undefined,
      ref_name: props.route.params?.item?.ref_value ?? "",
      entryDate: props.route.params?.item?.date
        ? new Date(props.route.params?.item?.date)
        : new Date(),
      nextDate: props.route.params?.item?.next_treatment_date
        ? new Date(props.route.params?.item?.next_treatment_date)
        : new Date(),
      drugName: props.route.params?.item?.drug_name ?? "",
      drugID: props.route.params?.item?.drug_id ?? "",
      statusID: props.route.params?.item?.status ?? "P",
      statusName:
        props.route.params?.item?.status == "P"
          ? "Pending"
          : props.route.params?.item?.status == "A"
          ? "Approved"
          : "Ongoing",
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
      is_active: true,
    };
  }

  openGalleryImageViewer = (id) => {
    let galleryImages = JSON.parse(this.props.route.params.item.image);
    let index = galleryImages.findIndex((item) => item === id);
    // console.log(index);
    this.setState({
      selectedGalleryImageIndex: index > -1 ? index : 0,
      isGalleryImageViewerOpen: true,
    });
  };

  handleSubmit = () => {
    Alert.alert("Warning!!", "Do you want to hide this record ?", [
      { text: "Yes", onPress: () => this.manageStatus() },
      { text: "No" },
    ]);
  };

  manageStatus = () => {
    let obj = {
      ref: "medical_record",
      id: this.state.id,
    };
    manage_active_status(obj)
      .then((res) => {
        Alert.alert("Success", "Medical Report " + res.message, [
          { text: "OK", onPress: () => this.props.navigation.goBack() },
        ]);
      })
      .catch((err) => console.log(err));
  };

  closeGalleryImageViewer = () =>
    this.setState({
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
    });

  getGalleryImages = () => {
    let images = JSON.parse(this.props.route.params.item.image);
    let data = (images || []).map((item, index) => {
      return {
        id: index,
        uri: item,
      };
    });
    // console.log(data);
    return data;
  };

  render = () => {
    return (
      <Container>
        <Header
          title={"View Medical Record"}
          downloadMedicalRecord={htmlRender}
          downloadItems={this.props.route.params.item}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={globalStyles.container}
        >
          <View style={globalStyles.form}>
            <View style={globalStyles.rowContainer}>
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Case ID:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    #{this.state?.id}
                  </Text>
                </View>
              </View>
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Date:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {getFormattedDate(this.state.entryDate, "DD/MM/YYYY")}
                  </Text>
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
              {this.state.selectionTypeId == "section" ? (
                <View style={[globalStyles.row]}>
                  <View style={globalStyles.rowLeft}>
                    <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                      Sections:{" "}
                    </Text>
                  </View>
                  <View style={globalStyles.rowRight}>
                    <Text style={[globalStyles.textfield]}>
                      {this.state?.ref_name ? this.state?.ref_name : "N/A"}
                    </Text>
                  </View>
                </View>
              ) : null}
              {this.state.selectionTypeId == "enclosure" ? (
                <View style={[globalStyles.row]}>
                  <View style={globalStyles.rowLeft}>
                    <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                      Enclosure:{" "}
                    </Text>
                  </View>
                  <View style={globalStyles.rowRight}>
                    <Text style={[globalStyles.textfield]}>
                      {this.state?.ref_name ? this.state?.ref_name : "N/A"}
                    </Text>
                  </View>
                </View>
              ) : null}
              {this.state.selectionTypeId == "animal" ? (
                <View style={[globalStyles.row]}>
                  <View style={globalStyles.rowLeft}>
                    <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                      Animal:{" "}
                    </Text>
                  </View>
                  <View style={globalStyles.rowRight}>
                    <Text style={[globalStyles.textfield]}>
                      {this.state?.ref_name ? this.state?.ref_name : "N/A"}
                    </Text>
                  </View>
                </View>
              ) : null}
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Diagnosis:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {this.state?.diagnosisName
                      ? this.state?.diagnosisName
                      : "N/A"}
                  </Text>
                </View>
              </View>
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Affected Parts:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {this.state?.affectedParts
                      ? this.state?.affectedParts
                      : "N/A"}
                  </Text>
                </View>
              </View>
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Diagnosed by:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {this.state?.diagnosed_by
                      ? this.state?.diagnosed_by
                      : "N/A"}
                  </Text>
                </View>
              </View>
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Drug Name:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {this.state?.drugName ? this.state?.drugName : "N/A"}
                  </Text>
                </View>
              </View>
              <View style={[globalStyles.row]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Dosage:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {this.state?.dosage ? this.state?.dosage : "N/A"}
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
                    {this.state?.priorityName
                      ? this.state?.priorityName
                      : "N/A"}
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
                                    <Text style={[globalStyles.labelName, globalStyles.pd0]}>Next Treatment Date: </Text>
                                </View>
                                <View style={globalStyles.rowRight}>
                                    <Text style={[globalStyles.textfield,]}>{this.state?.nextDate ? getFormattedDate(this.state.nextDate, 'DD/MM/YYYY') : 'N/A'}</Text>
                                </View>
                            </View> */}
              <View style={[globalStyles.row, globalStyles.bbw0]}>
                <View style={globalStyles.rowLeft}>
                  <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                    Status:{" "}
                  </Text>
                </View>
                <View style={globalStyles.rowRight}>
                  <Text style={[globalStyles.textfield]}>
                    {this.state.statusID == "P"
                      ? "Pending"
                      : this.state.statusID == "A"
                      ? "Closed"
                      : "Ongoing"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              globalStyles.w100,
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
          {this.props.route.params.item.image ? (
            <>
              <View style={globalStyles.h10}></View>
              <View
                style={[
                  globalStyles.form,
                  styles.viewIncidentAndObservationAttachment,
                ]}
              >
                <View>
                  <Text style={globalStyles.textSub}>Attachments</Text>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingTop: 2,
                    padingHorizontal: 10,
                  }}
                >
                  {JSON.parse(this.props.route.params.item.image).length > 0
                    ? JSON.parse(this.props.route.params.item.image).map(
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
                                style={styles.viewMedicalRecordImage}
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
  };
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
// });
