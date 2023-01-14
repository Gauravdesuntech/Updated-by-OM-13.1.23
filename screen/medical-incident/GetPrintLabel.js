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
import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import PDFReader from "@hashiprobr/expo-pdf-reader";
import {
  Header,
  Dropdown,
  OverlayLoader,
  MultiSelectDropdown,
} from "../../component";
import ModalMenu from "../../component/ModalMenu";
import InputDropdown from "../../component/InputDropdown";
import { Configs, Colors } from "../../config";
import { capitalize } from "../../utils/Util";
import {
  getAnimalSections,
  getAllEnclosures,
  getAllAnimals,
  getAnimalPrintLabelForMutipleIds,
} from "../../services/APIServices";
import { getUsers } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../../config/Styles";

export default class GetPrintLabel extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      sections: [],
      enclosures: [],
      users: [],
      refreshing: false,

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
      selectedRefs: [],

      isrefMenuOpen: false,
      isClosedByMenuOpen: false,
      showLoader: false,

      setShowLoader: false,
      showGetPrintLabelModal: false,

      showPdf: false,
      pdfUri: "",
      html: "",
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
    let cid = this.context.userDetails.cid;
    Promise.all([getAnimalSections(cid), getAllEnclosures(cid), getUsers(cid)])
      .then((data) => {
        this.setState({
          sections: data[0].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
          enclosures: data[1].map((v, i) => ({
            id: v.id,
            name: v.enclosure_id,
            value: v.id,
          })),
          showLoader: false,
          refreshing: false,
        });
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  setRecordStatus = (v) => {
    this.setState({
      statusID: v.id,
      statusName: v.name,
    });
  };

  toggleNotifyDepartmentMenu = () =>
    this.setState({
      isNotifyDepartmentMenuOpen: !this.state.isNotifyDepartmentMenuOpen,
    });

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
      ref_name: "",
      isSelectionTypeMenuOpen: false,
    });

  setref = (v) => {
    console.log({ v });
    this.setState({
      // ref_id: v.id,
      // ref_name: v.name,
      // isrefMenuOpen: false,

      selectedRefs: v,
    });
  };

  setSection = (v) => {
    this.setState(
      {
        section_id: v.id,
        section_name: v.name,
        enclosure_id: "",
        enclosure_name: "",
        ref_id: "",
        ref_name: "",
        isSectionMenuOpen: false,
      },
      () => {
        this.getEnclosureBySection(v.id);
      }
    );
  };

  setEnclosure = (v) => {
    this.setState({
      enclosure_id: v.id,
      enclosure_name: v.name,
      ref_id: "",
      ref_name: "",
      isEnclosureMenuOpen: false,
    });
  };

  setShowLoader = (bool) => {
    this.setState({
      showLoader: bool,
    });
  };

  togglerefMenu = () =>
    this.setState({ isrefMenuOpen: !this.state.isrefMenuOpen });

  toggleSectionMenu = () =>
    this.setState({ isSectionMenuOpen: !this.state.isSectionMenuOpen });

  toggleEnclosureMenu = () =>
    this.setState({ isEnclosureMenuOpen: !this.state.isEnclosureMenuOpen });

  toggleClosedMenu = () =>
    this.setState({ isClosedByMenuOpen: !this.state.isClosedByMenuOpen });

  toggleShowGetPrintLabelModal = () => {
    this.setState({
      showGetPrintLabelModal: !this.state.showGetPrintLabelModal,
    });
  };

  htmlForGetPrintLabel = (
    data,
    type,
    section_name,
    enclosure_name,
    isShowAnimalData = true
  ) => {
    let html = "";

    if (type === "section" && !isShowAnimalData) {
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

    if (type === "section" && isShowAnimalData) {
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

    if (type === "enclosure" && !isShowAnimalData) {
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

    if (type === "enclosure" && isShowAnimalData) {
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

  getPrintLabel = async (isShowAnimalData) => {
    let html = "";
    this.setShowLoader(true);
    let refIds = this.state.selectedRefs.map((item) => item.id).join(",");
    await getAnimalPrintLabelForMutipleIds({
      type: this.props.route.params.type,
      id: refIds,
      purpose: isShowAnimalData ? "with_animal" : "without_animal",
    })
      .then((data) => {
        console.log({ data });
        html = this.htmlForGetPrintLabel(
          data,
          this.props.route.params.type,
          this.state.section_name
            ? this.state.section_name
            : this.state.ref_name,
          this.state.ref_name,
          isShowAnimalData
        );
        this.setShowLoader(false);
      })
      .catch((error) => {
        console.log(error), this.setShowLoader(false);
      });

    this.setShowLoader(true);
    const { uri } = await Print.printToFileAsync({
      html,
    });
    console.log({ uri });
    this.setState({ showPdf: true, pdfUri: uri, showLoader: false });
    this.setState({ showLoader: false });
  };

  exportPdf = async () => {
    await shareAsync(this.state.pdfUri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  };

  render = () => (
    <SafeAreaView style={styles.container}>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        title={"Get Print Label"}
        isShowGetPrintLabel={this.state.showPdf}
        getPrintLabel={this.exportPdf}
      />
      {this.state.showPdf ? (
        <PDFReader
          source={{
            uri: this.state.pdfUri,
          }}
        />
      ) : null}
      {!this.state.showPdf ? (
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
            <View style={styles.boxBorder}>
              <>
                {this.props.route.params.type == "section" ? (
                  // <InputDropdown
                  //   label={"Sections"}
                  //   value={this.state.ref_name}
                  //   isOpen={this.state.isrefMenuOpen}
                  //   items={this.state.sections}
                  //   openAction={this.togglerefMenu}
                  //   closeAction={this.togglerefMenu}
                  //   setValue={this.setref}
                  //   labelStyle={styles.labelName}
                  //   textFieldStyle={styles.textfield}
                  //   style={[styles.fieldBox]}
                  // />
                  <MultiSelectDropdown
                    label={"Sections"}
                    isMandatory={true}
                    items={this.state.sections}
                    selectedItems={this.state.selectedRefs}
                    labelStyle={styles.labelName}
                    //   placeholder={''}
                    placeHolderContainer={styles.placeHolderContainer}
                    placeholderStyle={[styles.textfield]}
                    selectedItemsContainer={[
                      styles.selectedItemsContainer,
                      { width: "60%" },
                    ]}
                    onSave={this.setref}
                  />
                ) : null}

                {this.props.route.params.type == "enclosure" ? (
                  <>
                    <InputDropdown
                      label={"Section"}
                      value={this.state.section_name}
                      isOpen={this.state.isSectionMenuOpen}
                      items={this.state.sections}
                      openAction={this.toggleSectionMenu}
                      closeAction={this.toggleSectionMenu}
                      setValue={this.setSection}
                      labelStyle={styles.labelName}
                      textFieldStyle={styles.textfield}
                      style={[styles.fieldBox]}
                    />
                    <View style={[styles.fieldBox, { borderBottomWidth: 0 }]}>
                      <MultiSelectDropdown
                        label={"Enclosures"}
                        isMandatory={true}
                        items={this.state.enclosuress}
                        selectedItems={this.state.selectedRefs}
                        labelStyle={styles.labelName}
                        //   placeholder={''}
                        placeHolderContainer={styles.placeHolderContainer}
                        placeholderStyle={[styles.textfield]}
                        selectedItemsContainer={[
                          styles.selectedItemsContainer,
                          { width: "60%" },
                        ]}
                        onSave={this.setref}
                      />
                    </View>

                    {/* <InputDropdown
                    label={"Enclosures"}
                    value={this.state.ref_name}
                    isOpen={this.state.isrefMenuOpen}
                    items={this.state.enclosuress}
                    openAction={this.togglerefMenu}
                    closeAction={this.togglerefMenu}
                    setValue={this.setref}
                    labelStyle={styles.labelName}
                    textFieldStyle={styles.textfield}
                    style={[styles.fieldBox]}
                  /> */}
                    {/* </View> */}
                  </>
                ) : null}
              </>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.toggleShowGetPrintLabelModal}
              >
                <Text style={[styles.buttonText, styles.saveBtnText]}>
                  Get Print Label
                </Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
                <Text style={[styles.buttonText, styles.exitBtnText]}>
                  EXIT
                </Text>
              </TouchableOpacity>
            </View>

            <ModalMenu
              visible={this.state.showGetPrintLabelModal}
              modalBoxStyle={{
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 10,
                height: "100%",
                justifyContent: "center",
              }}
              modalBodyStyle={{
                backgroundColor: Colors.white,
                height: 150,
                // maxHeight: parseInt(windowHeight / 3),
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
              closeAction={this.toggleShowGetPrintLabelModal}
            >
              <TouchableOpacity
                activeOpacity={4}
                onPress={() => {
                  this.getPrintLabel(true);
                  this.toggleShowGetPrintLabelModal();
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
                onPress={() => {
                  this.getPrintLabel(false);
                  this.toggleShowGetPrintLabelModal();
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
          </KeyboardAwareScrollView>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
