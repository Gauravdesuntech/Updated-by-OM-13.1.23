import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Colors, Configs } from "../../config";
import { Header, ListEmpty, Loader, AnimalSearchModal } from "../../component";
import {
  getSectionCommonNames,
  generateSectionCommonNameReport,
  getReportViewSection,
} from "../../services/APIServices";
import { fetchProfile } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import { capitalize } from "../../utils/Util";
import * as WebBrowser from "expo-web-browser";
import { TouchableOpacity } from "react-native-gesture-handler";
import { maybeOpenURL, openAppOnStore } from "../../utils/helper";
import Dialog from "react-native-dialog";
import DownloadFile from "../../component/DownloadFile";
import { Modal } from "react-native";
import globalStyles from "../../config/Styles";

const appName = "VLC";
const appStoreId = "650377962";
const appStoreLocale = "us";
const playStoreId = "org.videolan.vlc";

export default class CommonNames extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      commonNames: [],
      reportViewData: [],
      sectionID:
        typeof props.route.params !== "undefined"
          ? props.route.params.sectionID
          : undefined,
      sectionName:
        typeof props.route.params !== "undefined"
          ? props.route.params.sectionName
          : undefined,
      switchStatus: false,
      dialogVisible: false,
      downloadUrl: "",
      isModalOpen: false,
      section_live_ip: props.route.params.live_ip_address
        ? props.route.params.live_ip_address
        : undefined,
    };
    this.searchModalRef = React.createRef();
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  }

  onScreenFocus = () => {
    this.setState(
      {
        commonNames: [],
        isLoading: true,
      },
      () => {
        this.loadCommonNames();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  handelRefresh = () => {
    this.setState(
      {
        commonNames: [],
        isLoading: true,
      },
      () => {
        this.loadCommonNames();
      }
    );
  };

  toggleSwitch = () => {
    this.setState({
      switchStatus: !this.state.switchStatus,
    });
  };

  loadCommonNames = () => {
    const { sectionID } = this.state;
    let userid = this.context.userDetails.id;
    let paramObj = { cid: this.context.userDetails.cid };

    if (typeof sectionID !== "undefined") {
      paramObj.section_id = sectionID;
    }

    Promise.all([
      getSectionCommonNames(paramObj),
      fetchProfile({ userid }),
      getReportViewSection(paramObj),
    ])
      .then((response) => {
        console.log("getReportView --", response[2]);
        let data = response[0];
        this.context.setUserData(response[1].data);
        this.setState({
          commonNames: data,
          reportViewData: response[2],
          isLoading: false,
        });
      })
      .catch((error) => console.log(error));
  };

  openSearchModal = () => this.searchModalRef.current.openModal();

  gotoAddCommonNane = () => {
    this.props.navigation.navigate("AddCommonName", {
      classID: this.state.classID,
      categoryID: this.state.categoryID,
      subCategoryID: this.state.subCategoryID,
    });
  };

  onItemTap = (item) => {
    this.props.navigation.navigate("AnimalList", {
      commonName: item.common_name,
      sectionID: this.state.sectionID,
    });
  };

  onItemTapReport = (item) => {
    this.props.navigation.navigate("AnimalList", {
      commonName: item.common_name,
      sectionID: this.state.sectionID,
      enclosure_id: item.enclosure_id,
    });
  };

  gotoEditCommonName = (item) => {
    this.props.navigation.navigate("AddCommonName", {
      classID: this.state.classID,
      categoryID: this.state.categoryID,
      subCategoryID: this.state.subCategoryID,
      id: item.id,
      commonName: item.common_name,
      scientificName: item.scientific_name,
      taxonid: item.taxonid !== null ? item.taxonid : "",
      databaseName: item.database_name !== null ? item.database_name : "",
      description: item.description !== null ? item.description : "",
      funFacts: item.fun_facts !== null ? item.fun_facts : "",
      imageURI: item.image,
      coverImageURI: item.cover_image !== null ? item.cover_image : undefined,
    });
  };

  // Generate Excel And Save on device
  exportExcelReport = () => {
    let params = { cid: this.context.userDetails.cid };
    const { sectionID, sectionName } = this.state;

    if (typeof sectionID !== "undefined") {
      params["sectionID"] = sectionID;
    }

    if (typeof sectionName !== "undefined") {
      params["sectionName"] = sectionName;
    }

    generateSectionCommonNameReport(params)
      .then((response) => {
        let data = response.data;
        this.setState({
          downloadUrl: data.fileuri,
          isModalOpen: true,
        });
      })
      .catch((error) => console.log(error));
  };

  closeModal = () =>
    this.setState({
      isModalOpen: false,
    });

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleInstall = () => {
    this.setState(
      {
        dialogVisible: false,
      },
      () => {
        openAppOnStore({ appName, appStoreId, appStoreLocale, playStoreId });
      }
    );
  };

  renderListItem = ({ item }) => (
    <>
      <TouchableHighlight
        underlayColor={"#eee"}
        onPress={this.onItemTapReport.bind(this, item)}
        // onLongPress={this.gotoEditCommonName.bind(this, item)}
      >
        <View style={globalStyles.fieldBox}>
          <View
            style={[globalStyles.width20, globalStyles.justifyContentCenter]}
          >
            <Image
              style={globalStyles.image_h55w55}
              source={{ uri: item.image }}
              resizeMode="cover"
            />
          </View>
          <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
            <Text style={globalStyles.name}>
              {item.enclosure_id_name.toString()}
            </Text>
            <Text style={globalStyles.name}>
              {capitalize(item.english_name)}
            </Text>
            {this.context.userDetails.action_types.includes(
              Configs.USER_ACTION_TYPES_CHECKING.stats
            ) ? (
              <Text style={[globalStyles.name, { fontSize: 12 }]}>{`${
                item.total_male > 0 ? "M - " + item.total_male : ""
              } ${
                item.total_female > 0 ? " F - " + item.total_female : ""
              }`}</Text>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                width: "33%",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                // onPress={() => { maybeOpenURL("vlc://rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4", this.showDialog) }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 3,
                }}
              >
                <Ionicons name="videocam" size={18} color={"#fff"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 3,
                }}
              >
                <Ionicons name="videocam" size={18} color={"#fff"} />
              </TouchableOpacity>
            </View>
          </View>
          {this.context.userDetails.action_types.includes(
            Configs.USER_ACTION_TYPES_CHECKING.stats
          ) ? (
            <View style={globalStyles.rightSection}>
              <View style={globalStyles.qtyContainer}>
                <Text style={globalStyles.qty}>{item.total_animal}</Text>
              </View>
              {/* <Ionicons name="chevron-forward" style={globalStyles.rightAngelIcon} /> */}
            </View>
          ) : null}
        </View>
      </TouchableHighlight>
      <View
        style={{
          flexDirection: "row",
          width: "20%",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 5,
          left: 80,
        }}
      >
        {item.feed_ip == null || item.feed_ip == "" ? null : (
          <TouchableOpacity
            onPress={() => {
              maybeOpenURL("vlc://" + item.feed_ip, this.showDialog);
            }}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: "green",
              borderRadius: 3,
            }}
          >
            <Ionicons name="videocam" size={16} color={"#fff"} />
          </TouchableOpacity>
        )}
        {item.nest_ip == null || item.nest_ip == "" ? null : (
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: "grey",
              borderRadius: 3,
            }}
            onPress={() => {
              maybeOpenURL("vlc://" + item.nest_ip, this.showDialog);
            }}
          >
            <Ionicons name="videocam" size={16} color={"#fff"} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  renderItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={this.onItemTap.bind(this, item)}
      // onLongPress={this.gotoEditCommonName.bind(this, item)}
    >
      <View style={globalStyles.fieldBox}>
        <View style={[globalStyles.width20, globalStyles.justifyContentCenter]}>
          <Image
            style={globalStyles.image_h55w55}
            source={{ uri: item.image }}
            resizeMode="cover"
          />
        </View>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
          <Text style={globalStyles.labelName}>
            {capitalize(item.common_name)}
          </Text>
          {this.context.userDetails.action_types.includes(
            Configs.USER_ACTION_TYPES_CHECKING.stats
          ) ? (
            <Text style={[{ fontSize: 18, color: Colors.textColor }]}>{`${
              item.total_male_animal > 0 ? "M - " + item.total_male_animal : ""
            } ${
              item.total_female_animal > 0
                ? " F - " + item.total_female_animal
                : ""
            } ${
              item.total_infants > 0 ? " I - " + item.total_infants : ""
            }`}</Text>
          ) : null}
        </View>
        {this.context.userDetails.action_types.includes(
          Configs.USER_ACTION_TYPES_CHECKING.stats
        ) ? (
          <View style={globalStyles.rightSection}>
            <View style={globalStyles.qtyContainer}>
              <Text style={globalStyles.qty}>{item.total_animals}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              style={globalStyles.rightAngelIcon}
            />
          </View>
        ) : null}
      </View>
    </TouchableHighlight>
  );

  render = () => (
    <Container>
      <Header
        title={
          this.state.sectionName != undefined
            ? this.state.sectionName
            : "Common Names"
        }
        exportCommonName={this.exportExcelReport}
        switchIcon={this.toggleSwitch}
        videoCam={
          typeof this.state.section_live_ip == "undefined" ? false : true
        }
        onVideoPress={() => {
          maybeOpenURL("vlc://" + this.state.section_live_ip, this.showDialog);
        }}
        // showScanButton={this.state.isLoading ? undefined : true}
        // searchAction={this.state.isLoading ? undefined : this.openSearchModal}
        // addAction={this.state.isLoading ? undefined : this.gotoAddCommonNane}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={
            this.state.switchStatus
              ? this.state.commonNames
              : this.state.reportViewData
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={
            this.state.switchStatus ? this.renderItem : this.renderListItem
          }
          initialNumToRender={this.state.commonNames.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.state.commonNames.length === 0 ? globalStyles.container : null
          }
        />
      )}

      <AnimalSearchModal
        ref={this.searchModalRef}
        animalClass={this.state.classID}
        animalCategory={this.state.categoryID}
        animalSubCategory={this.state.subCategoryID}
        navigation={this.props.navigation}
      />

      {/* Dialog Box */}
      <Dialog.Container visible={this.state.dialogVisible}>
        <Dialog.Title>App Installation Required !!</Dialog.Title>
        <Dialog.Description>
          VLC player installation required to play
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        <Dialog.Button label="Install" onPress={this.handleInstall} />
      </Dialog.Container>

      {/* Modal for download file */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalOpen}
        onRequestClose={this.closeModal}
      >
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalBody}>
            <DownloadFile
              url={this.state.downloadUrl}
              viewStyle={globalStyles.downloadBtn}
              textStyle={globalStyles.downloadFileButtonText}
              design={<AntDesign name="download" size={20} />}
              text={"Download"}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={globalStyles.closerBtn}
              onPress={this.closeModal}
            >
              <Text style={globalStyles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 	},
// 	view: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 3,
// 	},
// 	image: {
// 		width: 55,
// 		height: 55,
// 	},
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0, 0, 0, 0.5)",
// 	},

// 	loadingText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		opacity: 0.6,
// 		marginTop: 10,
// 	},
// 	closerBtn: {
// 		top:20,
// 		bottom: 10,
// 		padding: 10
// 	},
// 	closeBtnText: {
// 		fontSize: 16,
// 		fontWeight: "bold",
// 		color: Colors.tomato,
// 	},
// 	modalBody: {
// 		alignItems: "center",
// 		justifyContent: "center",
// 		backgroundColor: Colors.white,
// 		width: Math.floor((windowWidth * 60) / 100),
// 		minHeight: Math.floor(windowHeight / 5),
// 		padding: 15,
// 		borderRadius: 3,
// 		elevation: 5,
// 	},
// 	downloadBtn: {
// 		flexDirection: "row",
// 		paddingHorizontal: 20,
// 		paddingVertical: 8,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
// 	},
// 	name: {
// 		fontSize: 18,
// 		color: Colors.textColor,
// 	},
// 	rightSection: {
// 		width: "15%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	qtyContainer: {
// 		height: 35,
// 		width: 35,
// 		borderRadius: 100,
// 		backgroundColor: Colors.primary,
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	qty: {
// 		fontSize: 14,
// 		color: "#FFF",
// 	},
// 	rightAngelIcon: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},
// });
