import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Modal,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { BarCodeScanner } from "expo-barcode-scanner";
import Colors from "../config/colors";
import { searchCommonName, getAnimalPrintLabel } from "../services/APIServices";
import { Camera } from "expo-camera";
import AppContext from "../context/AppContext";
import moment from "moment";
import Dropdown from "./Dropdown";
import { Configs } from "../config";
import OptionsAfterScan from "../screen/OptionsAfterScan";
import { func } from "prop-types";
import globalStyles from "../config/Styles";

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
    marginTop: 60,
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
});
const taskReportDay = {
  Today: "today",
  Yesterday: "yesterday",
  "Last 7 day": "last_7_day",
  Custom: "custom",
};
const Header = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeName = route.name;

  const [isScanModalOpen, toggleScanModal] = useState(false);
  const [isScanning, setScanStatus] = useState(false);
  const [scanData, setScanData] = useState("");
  const [type, setType] = useState("");
  const menuRef = useRef(null);
  const taskReportMenuRef = useRef(null);
  const priorityRef = useRef(null);
  const medicalRef = useRef(null);
  const [show, setShow] = useState(false);
  const [showOptionsAfterScan, setShowOptionsAfterScan] = useState(false);

  const gotoHome = () => navigation.navigate("Home");
  const gotoVideo = () => props.onVideoPress();
  const toggleDrawer = () => navigation.toggleDrawer();
  const gotoBack = () => navigation.goBack();

  const openScaner = () => {
    Camera.requestCameraPermissionsAsync()
      .then((result) => {
        if (result.status === "granted") {
          toggleScanModal(true);
          setScanStatus(true);
        } else {
          Alert.alert("Please give the permission");
        }
      })
      .catch((error) => console.log(error));
  };

  const closeScanModal = () => {
    setScanStatus(false);
    toggleScanModal(false);
    setScanData("");
    setShowOptionsAfterScan(false);
  };

  const handleBarCodeScanned = ({ data }) => {
    let parsedData = JSON.parse(data);
    console.log(parsedData);
    if (parsedData.query == "details") {
      toggleScanModal(false);
      setType("animal");
      fetchAnimalDetails(parsedData);
    }
    if (parsedData.type == "Group") {
      setType("animal");
      setScanData(parsedData);
      setScanStatus(false);
      setShowOptionsAfterScan(true);
    } else if (parsedData.qr_code_type == "section") {
      setType("section");
      setScanData(parsedData);
      setScanStatus(false);
      setShowOptionsAfterScan(true);
    } else if (parsedData.qr_code_type == "enclosure") {
      setType("enclosure");
      setScanData(parsedData);
      setScanStatus(false);
      setShowOptionsAfterScan(true);
    } else if (parsedData.dept_code) {
      setType("staff");
      setScanData(parsedData);
      toggleScanModal(false);
    }
  };

  const showMenu = () => {
    menuRef.current.show();
  };

  const showPriorityMenu = () => {
    priorityRef.current.show();
  };

  const showMedicalFilterMenu = () => {
    medicalRef.current.show();
  };

  const onMenuItemChange = (type) => {
    menuRef.current.hide();
    props.onMenuItemChange(type);
  };

  const onPriorityItemChange = (type) => {
    priorityRef.current.hide();
    props.onPriorityItemChange(type);
  };

  const onMedicalFilterItemChange = (type) => {
    medicalRef.current.hide();
    props.onFilterItemChange(type);
  };

  const fetchAnimalDetails = (data) => {
    let searchData = {
      search_value: data.common_name,
    };
    searchCommonName(searchData)
      .then((data) => {
        setScanStatus(false);
        toggleScanModal(false);
        setScanData("");
        navigation.navigate("CommonNameDetails", {
          commonNameID: data[0].id,
          commonName: data[0].common_name,
          imageUri: data[0].image,
          description: data[0].description,
        });
      })
      .catch((error) => console.log(error));
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };
  const showTaskReportFilterMenu = () => {
    taskReportMenuRef.current.show();
  };

  const hideTaskReportMenu = (value) => {
    props.taskReportFilterQuery(value);
    taskReportMenuRef.current.hide();
  };

  // const func = () => {
  //   navigation.navigate("OptionsAfterScan", {
  //     scanData,
  //     toggleScanModal,
  //     type,
  //     closeScanModal,
  //     setShowOptionsAfterScan,
  //     gotoBack,
  //   });
  //   // toggleScanModal(false);
  // };

  useEffect(() => {
    if (showOptionsAfterScan) {
      toggleScanModal(false);
      navigation.navigate("OptionsAfterScan", {
        scanData,
        // toggleScanModal,
        type,
        closeScanModal,
        setShowOptionsAfterScan,
        gotoBack,
      });
    }
  }, [showOptionsAfterScan]);

  return (
    <>
      <StatusBar
        animated={true}
        barStyle={"dark-content"}
        showHideTransition={"fade"}
        backgroundColor={Colors.primary}
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={routeName === "Home" ? toggleDrawer : gotoBack}
          style={styles.headerLeft}
        >
          {routeName === "Home" ? (
            <FontAwesome name="navicon" size={22} color={Colors.white} />
          ) : (
            <Ionicons name="arrow-back" size={26} color={Colors.white} />
          )}
        </TouchableOpacity>
        {routeName !== "Home" ? (
          <>
            {routeName == "FeedingSectionMenu" ? (
              <>
                {props.title == "Allocation" ? (
                  <View style={[styles.headerMiddle]}>
                    <TouchableOpacity style={globalStyles.alignItemsCenter}>
                      <Text style={{ fontSize: 22, color: Colors.white }}>
                        {props.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.dateField]}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => props.calculate("minus")}
                      // style={{ paddingBottom: 15 }}
                    >
                      <Ionicons
                        name="caret-back-outline"
                        size={28}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        props.showDatePicker("date");
                      }}
                      style={globalStyles.alignItemsCenter}
                    >
                      <Text style={{ fontSize: 15, color: Colors.white }}>
                        {`${moment(props.title).format("DD-MMM-YY")} (${moment(
                          props.title
                        ).format("ddd")})`}
                      </Text>
                      {/* <Text style={{ fontSize: 10, color: Colors.white }}>
                        {moment(props.title).format("ddd")}
                      </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => props.calculate("add")}
                      // style={{ paddingBottom: 15 }}
                    >
                      <Ionicons
                        name="caret-forward-outline"
                        size={28}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <View
                style={[
                  routeName === "CommonNameList"
                    ? styles.headerCommonNameList
                    : styles.headerMiddle,
                ]}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontSize: 22, color: Colors.white }}
                >
                  {props.title}
                </Text>
                {routeName === "CommonNameList" && props.videoCam ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={gotoVideo}
                    style={globalStyles.p5}
                  >
                    <Ionicons name="videocam" size={20} color={Colors.white} />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: "70%",
                backgroundColor: Colors.white,
                width: "98%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                elevation: 5,
                borderRadius: 3,
                padding: 5,
              }}
            >
              <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                  }}
                  onPress={
                    typeof props.searchAction !== "undefined"
                      ? props.searchAction
                      : () => {}
                  }
                >
                  <View>
                    <Ionicons name="md-search" size={20} color={"#959595"} />
                  </View>
                  <View style={{ paddingLeft: 5, flex: 1 }}>
                    <Text style={{ color: "#959595" }}>{"Search "}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* <View>
                <TouchableOpacity activeOpacity={0.5} onPress={openScaner}>
                  <Ionicons
                    name="md-scan-outline"
                    size={20}
                    color={"#959595"}
                  />
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        )}

        {routeName !== "Home" ? (
          <View style={styles.headerRight}>
            {typeof props.blankIcon !== "undefined" ? (
              <TouchableOpacity activeOpacity={0.5} style={{ padding: 8 }}>
                <MaterialCommunityIcons
                  name={"axis-z-rotate-counterclockwise"}
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            ) : null}
            {routeName !== "Home" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={gotoHome}
                style={{ padding: 8 }}
              >
                <Ionicons name="home" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {props.sync !== undefined ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.sync}
                style={globalStyles.p5}
              >
                <MaterialCommunityIcons
                  name="sync"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {props.goToFeedingMaster !== undefined ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.goToFeedingMaster}
                style={globalStyles.p5}
              >
                <MaterialCommunityIcons
                  name="bowl-mix"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {props.showScanButton ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={openScaner}
                style={globalStyles.p5}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={18}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {props.showRelatedScanButton ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.openRelatedScaner}
                style={globalStyles.p5}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={18}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {typeof props.searchAction !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.searchAction}
                style={globalStyles.p10}
              >
                <Ionicons name="search" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {typeof props.chngPass !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.chngPass}
                style={globalStyles.p10}
              >
                <Ionicons name="key" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {typeof props.tagShowAction !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.tagShowAction}
                style={globalStyles.p10}
              >
                <AntDesign name="tags" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {typeof props.cameraAction !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.cameraAction}
                style={globalStyles.p5}
              >
                <FontAwesome
                  name="video-camera"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {typeof props.addAction !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.addAction}
                style={{ padding: 8 }}
              >
                <AntDesign name="pluscircleo" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {typeof props.editAction !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.editAction}
                style={{ padding: 8 }}
              >
                <AntDesign name="edit" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {typeof props.switchIcon !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.switchIcon}
                style={{ padding: 8 }}
              >
                <MaterialCommunityIcons
                  name={
                    props.switchIconStatus
                      ? "axis-z-rotate-clockwise"
                      : "axis-z-rotate-counterclockwise"
                  }
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {routeName == "JornalRecord" ? (
              <>
                {typeof props.filter !== "undefined" ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={props.filter}
                    style={globalStyles.p5}
                  >
                    {props.clickFilter ? (
                      <MaterialCommunityIcons
                        name="filter"
                        size={24}
                        color="white"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="filter-outline"
                        size={24}
                        color="white"
                      />
                    )}
                  </TouchableOpacity>
                ) : null}
              </>
            ) : null}
            {typeof props.switchUserIcon !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.switchUserIcon}
                style={{ padding: 3, width: 50, alignItems: "center" }}
              >
                <Ionicons
                  name={props.switchUserStatus ? "person" : "person-outline"}
                  size={20}
                  color={Colors.white}
                />
                {props.selectUserName != "" ? (
                  <Text style={{ fontSize: 10, color: Colors.white }}>
                    {props.selectUserName}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ) : null}
            {typeof props.exportCommonName !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.exportCommonName}
                style={globalStyles.p5}
              >
                <AntDesign name="export" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {typeof props.downloadMedicalRecord !== "undefined"
              ? props.downloadMedicalRecord(props.downloadItems)
              : null}

            {routeName == "TaskReport" ? (
              <Menu
                ref={taskReportMenuRef}
                button={
                  <TouchableOpacity onPress={showTaskReportFilterMenu}>
                    <Feather name={"filter"} size={20} color={"#fff"} />
                  </TouchableOpacity>
                }
              >
                {/**Crated By: Biswanath Nath
                 * Date: 08.12.2022
                 * IIFE used to create menu items
                 */}
                {(() => {
                  const menu = [];
                  for (const propery in taskReportDay) {
                    menu.push(
                      <MenuItem
                        key={taskReportDay[propery]}
                        onPress={() =>
                          hideTaskReportMenu(taskReportDay[propery])
                        }
                      >
                        <Text style={{ color: Colors.textColor }}>
                          {propery}
                        </Text>
                      </MenuItem>
                    );
                  }
                  return menu;
                })()}
              </Menu>
            ) : null}

            {routeName === "LowInventoryList" ? (
              <>
                <Menu
                  ref={menuRef}
                  button={
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={showMenu}
                      style={globalStyles.p5}
                    >
                      <Ionicons name="filter" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  }
                >
                  {(props.menuItems || []).map((item, index) => (
                    <MenuItem
                      key={index.toString()}
                      onPress={() => onMenuItemChange(item)}
                      disabled={props.selectedMenuItem === item}
                      disabledTextColor={Colors.mediumGrey}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Menu>
                <Menu
                  ref={priorityRef}
                  button={
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={showPriorityMenu}
                      style={globalStyles.p5}
                    >
                      <AntDesign name="filter" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  }
                >
                  {(props.priorityItems || []).map((item, index) => (
                    <MenuItem
                      key={index.toString()}
                      onPress={() => onPriorityItemChange(item.id)}
                      disabled={props.selectedPriorityItem === item.id}
                      disabledTextColor={Colors.mediumGrey}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.exportProducts}
                  style={globalStyles.p5}
                >
                  <AntDesign name="export" size={20} color={Colors.white} />
                </TouchableOpacity>
              </>
            ) : null}
            {routeName === "GetPrintLabel" ||
            routeName === "OptionsAfterScan" ||
            routeName === "TaskReport" ||
            routeName === "IncidentReport" ||
            routeName === "MedicalReport" ||
            routeName === "ObservationsReport" ? (
              props.isShowExportIcon ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.onPressExport}
                  style={globalStyles.p5}
                >
                  <AntDesign name="export" size={20} color={Colors.white} />
                </TouchableOpacity>
              ) : null
            ) : null}
            {routeName === "MedicalRecordsList" ? (
              <>
                <Menu
                  ref={medicalRef}
                  button={
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={showMedicalFilterMenu}
                      style={globalStyles.p5}
                    >
                      <Ionicons name="filter" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  }
                >
                  {(props.menuItems || []).map((item, index) => (
                    <MenuItem
                      key={index.toString()}
                      onPress={() => onMedicalFilterItemChange(item.id)}
                      disabled={props.selectedFilterItem === item.id}
                      disabledTextColor={Colors.mediumGrey}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : null}
            {routeName === "IncidentReportList" ? (
              <>
                {/* <Menu
									ref={medicalRef}
									button={
										<TouchableOpacity
											activeOpacity={0.5}
											onPress={showMedicalFilterMenu}
											style={globalStyles.p5}
										>
											<Ionicons name="filter" size={20} color={Colors.white} />
										</TouchableOpacity>
									}
								>
									{(props.menuItems || []).map((item, index) => (
										<MenuItem
											key={index.toString()}
											onPress={() => onMedicalFilterItemChange(item.id)}
											disabled={props.selectedFilterItem === item.id}
											disabledTextColor={Colors.mediumGrey}
										>
											{item.name}
										</MenuItem>
									))}
								</Menu> */}
              </>
            ) : null}
          </View>
        ) : null}
      </View>

      {/*Scan Modal*/}
      {/* <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={isScanModalOpen}
        onRequestClose={closeScanModal}
      >
        <SafeAreaView style={globalStyles.safeAreaViewStyle}>
          <View
            style={
              isScanning
                ? styles.scanModalOverlay
                : [styles.scanModalOverlay, { backgroundColor: Colors.white }]
            }
          >
            {isScanning ? (
              <>
                <View style={styles.qrCodeSacnBox}>
                  <Camera
                    onBarCodeScanned={handleBarCodeScanned}
                    barCodeScannerSettings={{
                      barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                    }}
                    style={StyleSheet.absoluteFill}
                  />
                  <BarCodeScanner
                    type={BarCodeScanner.Constants.Type.back}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeScanModal}
                >
                  <Ionicons
                    name="close-outline"
                    style={styles.cancelButtonText}
                  />
                </TouchableOpacity>
              </>
            ) : (
              // showOptionsAfterScan && func()
              <></>
            )}
          </View>
        </SafeAreaView>
      </Modal> */}
    </>
  );
};
export default Header;
