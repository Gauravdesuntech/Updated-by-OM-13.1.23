import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  StatusBar,
  Modal,
  Dimensions,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import PDFReader from "@hashiprobr/expo-pdf-reader";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import Colors from "../config/colors";
import { getAnimalPrintLabelForMutipleIds } from "../services/APIServices";
import OverlayLoader from "../component/OverlayLoader";
import ModalMenu from "../component/ModalMenu";
import * as Icons from "../assets/image";
import { Header } from "../component";
import { getAssignedTags, removeAssignedTag } from "../services/TagServices";
import AppContext from "../context/AppContext";

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    paddingHorizontal: 5,
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    width: "10%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerMiddle: {
    width: "58%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  headerCommonNameList: {
    flexDirection: "row",
    width: "58%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  dateField: {
    flexDirection: "row",
    width: "58%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 3,
    right: 20,
  },
  headerRight: {
    minWidth: "15%",
    maxWidth: "32%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  scanModalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: windowWidth,
    height: windowHeight,
  },
  qrCodeSacnBox: {
    width: Math.floor((windowWidth * 70) / 100),
    height: Math.floor((windowWidth * 70) / 100),
  },
  scanResultBox: {
    flex: 1,
    backgroundColor: Colors.white,
    width: "100%",
    alignItems: "center",
    // marginTop: 60,
  },
  modalView: {
    width: "98%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRadius: Colors.formBorderRedius,
    marginBottom: 30,
  },
  cancelButton: {
    position: "absolute",
    zIndex: 11,
    top: 30,
    left: 10,
    backgroundColor: Colors.lightGrey,
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 24,
  },
  textfield: {
    height: "auto",
    fontSize: Colors.textSize,
    color: Colors.textColor,
    textAlign: "left",
    padding: 5,
  },
  labelName: {
    color: Colors.labelColor,
    // lineHeight: 40,
    fontSize: Colors.lableSize,
    paddingLeft: 4,
    height: "auto",
    paddingVertical: 10,
  },
  fieldBox: {
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    padding: 5,
    borderRadius: 3,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    height: "auto",
    justifyContent: "space-between",
  },
  imgContainer: {
    width: "20%",
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    width: "72%",
    fontSize: 16,
    color: Colors.textColor,
  },
  btn: {
    // width: Math.floor(windowWidth / 2),
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  pl12: {
    paddingLeft: 12,
  },
  pr12: {
    paddingRight: 12,
  },
  view: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});

const OptionsAfterScan = (props) => {
  const navigation = useNavigation();
  const {
    userDetails: { cid },
  } = useContext(AppContext);

  const [tags, setTags] = useState([]);
  const [pdfUri, setPdfUri] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showGetPrintLabelModal, setShowGetPrintLabelModal] = useState(false);

  const {
    scanData,
    // toggleScanModal,
    type,
    // closeScanModal,
    setShowOptionsAfterScan,
    gotoBack,
  } = props.route.params;

  useEffect(() => {
    setShowOptionsAfterScan(false);
    fetchAssignedTags();
  }, []);

  const fetchAssignedTags = () => {
    setShowLoader(true);

    let obj = {
      cid,
      type,
      ref_id:
        type === "enclosure"
          ? scanData.enclosure_db_id
          : type === "section"
          ? scanData.section_id
          : scanData.id,
    };
    getAssignedTags(obj)
      .then((response) => {
        console.log({ response });
        setTags(response);
        setShowLoader(false);
      })
      .catch((error) => console.log(error));
  };

  const deleteTagHandler = (tagItem) => {
    setShowLoader(true);

    let obj = {
      cid,
      id: tagItem?.id,
    };
    removeAssignedTag(obj)
      .then((response) => {
        console.log({ response });
        setShowLoader(false);
        fetchAssignedTags();
        Alert.alert("Successfully Removed");
      })
      .catch((error) => console.log(error));
  };

  const htmlForGetPrintLabel = (data, scannedData, isShowAnimalData = true) => {
    let html = "";

    if (scannedData.qr_code_type === "section" && !isShowAnimalData) {
      html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 0px">`;

      const chunkSize = 2;
      for (let i = 0; i < data?.length; i += chunkSize) {
        const chunk = data?.slice(i, i + chunkSize);
        html += ` <div
        style="display: flex; justify-content: space-between; margin-top: 15px"
      >`;
        chunk?.forEach((item) => {
          html += `<div
                    style="
                      width: 39%;
                      padding: 15px 15px 0 15px;
                      border: 1px solid red;
                      text-align: center;
                    "
                    >
                    <img src=${item?.qr} style="width: 55%; height: auto" />
                    <h3 style="margin: 12px">${item?.name}</h3>
                    </div>`;
        });

        html += ` </div>`;
      }
      html += `</main>
        </body>
      </html>
      `;
    }

    if (scannedData.qr_code_type === "section" && isShowAnimalData) {
      html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 20px">`;

      data?.forEach((item, index) => {
        html += `<div
        style="
          display: flex;
          border: 1px solid red;
          width: 100%;
          align-items: center;
          margin: 15px auto 0 auto;
        "
      >
        <div style="width: 35%; padding: 15px; text-align: center">
          <img src=${item?.qr} style="width: 100%; height: auto" />
        </div>
        <div style="width: 75%; text-align: left">
          <h2 style="margin: 12px">${item?.name}</h2>
        </div>
      </div>
     `;

        const chunkSize = 2;
        for (let i = 0; i < item?.animal_data?.length; i += chunkSize) {
          const chunk = item?.animal_data?.slice(i, i + chunkSize);
          html += `<div
          style="display: flex; margin-top: 15px; justify-content: space-between"
        >`;
          chunk?.forEach((animal) => {
            html += `<div
                      style="
                        display: flex;
                        width: 45%;
                        align-items: center;
                        border: 1px solid blue;
                        padding: 10px;
                      "
                    >
                      <div style="width: 35%">
                        <img src=${
                          animal?.image
                        } style="width: 100%; height: auto" />
                      </div>
                      <div style="width: 65%; padding: 0 12px; font-size: 12px">
                        <p style="font-size: 19px;font-weight: 900;margin: 0;font-family: 'Roboto',sans-serif;">${
                          animal?.english_name
                        }</p>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">(${
                          animal?.full_name
                        })</small><br>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">DNA: ${
                          animal?.dna || "N/A"
                        }</small><br>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Microchip: ${
                          animal?.microchip || "N/A"
                        }</small><br>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Ring Number: ${
                          animal?.ring_number || "N/A"
                        }</small>
                      </div>
                    </div>`;
          });

          html += ` </div>`;
        }
      });

      html += `</main>
      </body>
      
      </html>`;
    }

    if (scannedData.qr_code_type === "enclosure" && !isShowAnimalData) {
      html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 0px">`;

      const chunkSize = 2;
      for (let i = 0; i < data?.length; i += chunkSize) {
        const chunk = data?.slice(i, i + chunkSize);
        html += ` <div
        style="display: flex; justify-content: space-between; margin-top: 15px"
      >`;
        chunk?.forEach((item) => {
          html += ` <div
            style="
              width: 39%;
              padding: 15px 15px 0 15px;
              border: 1px solid red;
              text-align: center;
            "
          >
            <img src=${item?.qr_code} style="width: 55%; height: auto" />
            <h3 style="margin: 12px">${item?.enclosure_name}</h3>
          </div>`;
        });

        html += ` </div>`;
      }

      html += `</main>
        </body>
      </html>
      `;
    }

    if (scannedData.qr_code_type === "enclosure" && isShowAnimalData) {
      html = `<!DOCTYPE html>
       <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 20px">`;

      const chunkSize = 2;
      let combineAnimalArr = [];
      for (let i = 0; i < data?.length; i += chunkSize) {
        combineAnimalArr = [];
        const chunk = data?.slice(i, i + chunkSize);
        html += `<div style="display: flex; justify-content: space-between; margin-top: 15px">`;
        chunk?.forEach((item) => {
          html += `<div
                    style="
                    width: 44%;
                    padding: 15px 15px 0 15px;
                    text-align: center;
                    border: 1px solid red;
                    "
                    >
                    <img src=${item?.qr_code} style="width: 80%; height: auto" />
                    <h3 style="margin: 12px">${item?.enclosure_name}</h3>
                    <p style="font-size: 12px">
                    ${item?.section_name}
                    </p>
                    </div>`;

          item?.animal_data?.forEach((animal) =>
            combineAnimalArr.push({ ...animal })
          );
        });

        html += `</div>`;

        const chunkSize1 = 2;
        for (let i = 0; i < combineAnimalArr?.length; i += chunkSize1) {
          const chunk1 = combineAnimalArr?.slice(i, i + chunkSize1);
          html += `<div style="display: flex; margin-top: 15px; justify-content: space-between">`;
          chunk1?.forEach((animal) => {
            html += ` <div
            style="
              display: flex;
              width: 45%;
              align-items: center;
              border: 1px solid blue;
              padding: 10px;
            "
          >
            <div style="width: 35%">
              <img src=${animal?.image} style="width: 100%; height: auto" />
            </div>
            <div style="width: 65%; padding: 0 12px; font-size: 12px">
            <p style="font-size: 19px;font-weight: 900;margin: 0;font-family: 'Roboto',sans-serif;">${
              animal?.english_name
            }</p>
            <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">(${
              animal?.full_name
            })</small><br>
            <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">DNA: ${
              animal?.dna || "N/A"
            }</small><br>
            <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Microchip: ${
              animal?.microchip || "N/A"
            }</small><br>
            <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Ring Number: ${
              animal?.ring_number || "N/A"
            }</small>
            </div>
          </div>`;
          });
          html += `</div>`;
        }

        html += `</div>`;
      }

      html += `</main>
        </body>
      </html>
      `;
    }

    return html;
  };

  const toggleShowGetPrintLabelModal = () => {
    setShowGetPrintLabelModal((prevState) => !prevState);
  };

  const getPrintLabel = async (isShowAnimalData) => {
    let html = "";
    setShowLoader(true);
    let id = scanData.section_id;
    if (scanData.qr_code_type == "enclosure") {
      id = scanData.enclosure_db_id;
    }
    await getAnimalPrintLabelForMutipleIds({
      type,
      id: id,
      purpose: isShowAnimalData ? "with_animal" : "without_animal",
    })
      .then((data) => {
        html = htmlForGetPrintLabel(data, scanData, isShowAnimalData);
      })
      .catch((error) => console.log(error));

    const { uri } = await Print.printToFileAsync({
      html,
    });

    setPdfUri(uri);
    setShowPdf(true);
    setShowLoader(false);
  };

  const exportPdf = async () => {
    await shareAsync(pdfUri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  };

  return (
    <ScrollView contentContainerStyle={showPdf ? { height: "100%" } : {}}>
      <OverlayLoader visible={showLoader} />
      {showPdf ? (
        <>
          <Header
            title="Get Print Label"
            isShowGetPrintLabel={showPdf}
            getPrintLabel={exportPdf}
          />
          <PDFReader
            source={{
              uri: pdfUri,
            }}
          />
        </>
      ) : null}
      {!showPdf ? (
        <View style={styles.scanResultBox}>
          <Text
            style={[styles.labelName, { fontWeight: "bold", fontSize: 20 }]}
          >
            {type == "enclosure"
              ? "Enclosure"
              : type == "section"
              ? "Section"
              : "Animal"}
          </Text>
          <View style={styles.modalView}>
            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Name:</Text>
              <Text style={[styles.textfield, {width: '60%'}]}>
                {type == "enclosure"
                  ? scanData.enclosure_id
                  : type == "section"
                  ? scanData.section
                  : scanData?.common_name}
              </Text>
            </View>
            {type == "enclosure" ? (
              <>
                <View style={[styles.fieldBox]}>
                  <Text style={styles.labelName}>Section Name:</Text>
                  <Text style={[styles.textfield, {width: '60%'}]}>
                    {scanData.section}
                  </Text>
                </View>
                <View style={[styles.fieldBox]}>
                  <Text style={styles.labelName}>Enclosure Type:</Text>
                  <Text style={[styles.textfield, {width: '60%'}]}>
                    {scanData.enclosure_type}
                  </Text>
                </View>
              </>
            ) : null}
            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Tags:</Text>
              <View
                style={{
                  marginRight: 10,
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {tags?.map((element) => (
                  <TouchableOpacity
                    key={element.id.toString()}
                    onLongPress={() => {
                      Alert.alert("", "Do you want to remove the tag?", [
                        {
                          text: "Yes",
                          onPress: () => deleteTagHandler(element),
                          style: "cancel",
                        },
                        { text: "No", onPress: () => "" },
                      ]);
                    }}
                    style={{
                      height: 32,
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      marginHorizontal: 3,
                      marginVertical: 5,
                      borderRadius: 2,
                      backgroundColor: Colors.white,
                      borderColor: Colors.primary,
                      borderWidth: 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Image
                      style={{ height: 25, width: 25, marginRight: 10 }}
                      source={{ uri: element.tag_icon }}
                    />
                    <Text style={{ fontSize: 15, color: Colors.primary }}>
                      {element.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setShowOptionsAfterScan(false);
                // toggleScanModal(false);
                navigation.push("FeedingSectionMenu", {
                  sectionID: scanData.section_id,
                });
              }}
              style={[
                styles.btn,
                styles.pl12,
                {
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={Icons.feedIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Feeding</Text>
              {/* <Ionicons
                  name="chevron-forward"
                  style={styles.rightAngelIcon}
                /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowOptionsAfterScan(false);
                // toggleScanModal(false);
                navigation.push("AddIncident", {
                  prefilled: true,
                  status: "P",
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
                  parent_id:
                    type == "enclosure"
                      ? scanData.section_id
                      : type == "animal"
                      ? scanData.enclosure_db_id
                      : "",
                  parent_name:
                    type == "enclosure"
                      ? scanData.section
                      : type == "animal"
                      ? scanData.enclosure_name
                      : "",
                  grand_parent_id: type == "animal" ? scanData.section_id : "",
                  grand_parent_name:
                    type == "animal" ? scanData.section_name : "",
                  selectionType: type,
                });
              }}
              style={[
                styles.btn,
                styles.pl12,
                {
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={Icons.incidentReportIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Add Incident</Text>
              {/* <Ionicons
                  name="chevron-forward"
                  style={styles.rightAngelIcon}
                /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowOptionsAfterScan(false);
                // toggleScanModal(false);
                navigation.push("AddMedicalRecord", {
                  prefilled: true,
                  status: "p",
                  ref_id: scanData.enclosure_db_id
                    ? scanData.enclosure_db_id
                    : scanData.id
                    ? scanData.id
                    : scanData.section_id,
                  ref_name: scanData.id
                    ? scanData?.common_name
                    : scanData.enclosure_id
                    ? scanData.enclosure_id
                    : scanData.section,
                  parent_id:
                    type == "enclosure"
                      ? scanData.section_id
                      : type == "animal"
                      ? scanData.enclosure_db_id
                      : "",
                  grand_parent_id: type == "animal" ? scanData.section_id : "",
                  parent_name:
                    type == "enclosure"
                      ? scanData.section
                      : type == "animal"
                      ? scanData.enclosure_name
                      : "",
                  grand_parent_name:
                    type == "animal" ? scanData.section_name : "",
                  selectionType: type,
                });
              }}
              style={[
                styles.btn,
                styles.pl12,
                {
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={Icons.medicalIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Add Medical</Text>
              {/* <Ionicons
                  name="chevron-forward"
                  style={styles.rightAngelIcon}
                /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowOptionsAfterScan(false);
                // toggleScanModal(false);
                navigation.push("AddObservation", {
                  prefilled: true,
                  status: "P",
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
                  parent_id:
                    type == "enclosure"
                      ? scanData.section_id
                      : type == "animal"
                      ? scanData.enclosure_db_id
                      : "",
                  parent_name:
                    type == "enclosure"
                      ? scanData.section
                      : type == "animal"
                      ? scanData.enclosure_name
                      : "",
                  grand_parent_id: type == "animal" ? scanData.section_id : "",
                  grand_parent_name:
                    type == "animal" ? scanData.section_name : "",
                  selectionType: type,
                });
              }}
              style={[
                styles.btn,
                styles.pl12,
                {
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={Icons.observationIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Add Observations</Text>
              {/* <Ionicons
                  name="chevron-forward"
                  style={styles.rightAngelIcon}
                /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowOptionsAfterScan(false);
                // toggleScanModal(false);
                navigation.push("AddCategoryItem", {
                  category_id: "",
                  title: scanData.section
                    ? scanData.section
                    : scanData.section_name,
                  ref_id: scanData.enclosure_db_id
                    ? scanData.enclosure_db_id
                    : scanData.id
                    ? scanData.id
                    : scanData.section_id,
                  ref_name: scanData.id
                    ? scanData?.common_name
                    : scanData.enclosure_id
                    ? scanData.enclosure_id
                    : scanData.section,
                  parent_id:
                    type == "enclosure"
                      ? scanData.section_id
                      : type == "animal"
                      ? scanData.enclosure_db_id
                      : "",
                  parent_name:
                    type == "enclosure"
                      ? scanData.section
                      : type == "animal"
                      ? scanData.enclosure_name
                      : "",
                  grand_parent_id: type == "animal" ? scanData.section_id : "",
                  grand_parent_name:
                    type == "animal" ? scanData.section_name : "",
                  selectionType: type,
                });
              }}
              style={[
                styles.btn,
                styles.pl12,
                {
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={Icons.taskIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Add Task</Text>
              {/* <Ionicons
                  name="chevron-forward"
                  style={styles.rightAngelIcon}
                /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowOptionsAfterScan(false);
                // toggleScanModal(false);
                navigation.push("TagAssign", {
                  prefilled: true,
                  ref_id: scanData.enclosure_db_id
                    ? scanData.enclosure_db_id
                    : scanData.id
                    ? scanData.id
                    : scanData.section_id,
                  ref_name: scanData.id
                    ? scanData?.common_name
                    : scanData.enclosure_id
                    ? scanData.enclosure_id
                    : scanData.section,
                  parent_id:
                    type == "enclosure"
                      ? scanData.section_id
                      : type == "animal"
                      ? scanData.enclosure_db_id
                      : "",
                  grand_parent_id: type == "animal" ? scanData.section_id : "",
                  parent_name:
                    type == "enclosure"
                      ? scanData.section
                      : type == "animal"
                      ? scanData.enclosure_name
                      : "",
                  grand_parent_name:
                    type == "animal" ? scanData.section_name : "",
                  selectionType: type,
                });
              }}
              style={[
                styles.btn,
                styles.pl12,
                {
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={Icons.tagIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Add Tags</Text>
              {/* <Ionicons
                  name="chevron-forward"
                  style={styles.rightAngelIcon}
                /> */}
            </TouchableOpacity>
            {(type == "enclosure" || type == "section") && (
              <TouchableOpacity
                onPress={() => {
                  setShowOptionsAfterScan(false);
                  // toggleScanModal(false);
                  navigation.push("ChangeEnclosure", { scanData });
                }}
                style={[
                  styles.btn,
                  styles.pl12,
                  {
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                  },
                ]}
              >
                <View style={styles.imgContainer}>
                  <Image
                    style={styles.image}
                    source={Icons.enclousreIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>Change Enclosure</Text>
                {/* <Ionicons
                    name="chevron-forward"
                    style={styles.rightAngelIcon}
                  /> */}
              </TouchableOpacity>
            )}
            {type == "enclosure" ? (
              <TouchableOpacity
                onPress={() => {
                  setShowOptionsAfterScan(false);
                  // toggleScanModal(false);
                  navigation.push("AnimalsListEnclosure", {
                    id: scanData.enclosure_db_id,
                    enclosureID: scanData.enclosure_id,
                    screenName: scanData.enclosure_id,
                    screen_title: "Scanning Details",
                  });
                }}
                style={[
                  styles.btn,
                  styles.pl12,
                  {
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                  },
                ]}
              >
                <View style={styles.imgContainer}>
                  <Image
                    style={styles.image}
                    source={Icons.enclousreIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>Enclosure</Text>
                {/* <Ionicons
                    name="chevron-forward"
                    style={styles.rightAngelIcon}
                  /> */}
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                setShowOptionsAfterScan(false);
                // toggleScanModal(false);
                navigation.push("EnclosureIds", {
                  sectionID: scanData.section_id,
                  title: scanData.section,
                });
              }}
              style={[
                styles.btn,
                styles.pl12,
                {
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.imgContainer}>
                <Image
                  style={styles.image}
                  source={Icons.sectionIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Section</Text>
              {/* <Ionicons
                  name="chevron-forward"
                  style={styles.rightAngelIcon}
                /> */}
            </TouchableOpacity>
            {(type == "enclosure" || type == "section") && (
              <TouchableOpacity
                onPress={() => {
                  toggleShowGetPrintLabelModal();
                  // closeScanModal();
                  setShowOptionsAfterScan(false);
                }}
                style={[
                  styles.btn,
                  styles.pl12,
                  {
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                  },
                ]}
              >
                <View style={styles.imgContainer}>
                  <Image
                    style={styles.image}
                    source={Icons.printerIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>Get Print Label</Text>
                {/* <Ionicons
                    name="chevron-forward"
                    style={styles.rightAngelIcon}
                  /> */}
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              gotoBack();
              setShowOptionsAfterScan(false);
              // closeScanModal();
            }}
            style={{
              marginTop: 20,
              padding: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: Colors.tomato,
                fontWeight: "bold",
              }}
            >
              Close
            </Text>

            <ModalMenu
              visible={showGetPrintLabelModal}
              modalBoxStyle={{
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 10,
                height: "100%",
                justifyContent: "center",
              }}
              modalBodyStyle={{
                backgroundColor: Colors.white,
                height: 150,
                maxHeight: parseInt(windowHeight / 3),
                bottom: 0,
                padding: 10,
                marginHorizontal: 30,
                color: Colors.black,
                borderRadius: 4,
                paddingVertical: 20,
              }}
              scrollViewStyle={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: "100%",
              }}
              closeAction={toggleShowGetPrintLabelModal}
            >
              <TouchableOpacity
                activeOpacity={4}
                style={{}}
                onPress={() => {
                  getPrintLabel(true);
                  toggleShowGetPrintLabelModal();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  With Animal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.item}
                onPress={() => {
                  getPrintLabel(false);
                  toggleShowGetPrintLabelModal();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  Without Animal
                </Text>
              </TouchableOpacity>
            </ModalMenu>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default OptionsAfterScan;
