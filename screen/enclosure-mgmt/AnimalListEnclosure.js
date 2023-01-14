import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import Base64 from "../../config/Base64";
import Colors from "../../config/colors";
import { Header } from "../../component";
import ListEmpty from "../../component/ListEmpty";
import Loader from "../../component/Loader";
import {
  getAnimalsEnclosureBased,
  exportAnimals,
  getEnclosureHistory,
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import { IosAuthorizationStatus } from "expo-notifications";
import { getAllIncidentReports } from "../../services/MedicalAndIncidenTServices";
import DownloadFile from "../../component/DownloadFile";
import globalStyles from "../../config/Styles";
import styles from "./Styles";

const tabHeight = 50;

export default class AnimalsListEnclosure extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      animals: [],
      commonName:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.commonName
          : undefined,
      animalType:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.animalType
          : undefined,
      enclosureID:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.enclosureID
          : undefined,
      enc_ID:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.id
          : undefined,
      identificationType:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.identificationType
          : undefined,
      gender:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.gender
          : undefined,
      idOfEnclosure:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.id
          : undefined,
      screenName:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.screenName
          : undefined,
      enclosureType:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.enclosureType
          : undefined,
      selectedIDs: [],
      processingText: "Processing...",
      isModalOpen: false,
      isFileSaved: false,
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
      activeTabKey: "P",
      downloadUrl: "",
    };

    this.searchInput = React.createRef();
  }

  componentDidMount() {
    this.loadAnimals();
  }

  onScreenFocus = () => {
    this.setState(
      {
        isLoading: true,
        animals: [],
        activeTabKey: "P",
      },
      () => {
        this.loadAnimals();
        // this.EnclosureHistory();
      }
    );
  };

  handelRefresh = () => {
    this.setState(
      {
        animals: [],
        isLoading: true,
      },
      () => {
        this.loadAnimals();
        // this.EnclosureHistory();
      }
    );
  };

  loadAnimals = () => {
    const { animalType, enclosureID, idOfEnclosure, enclosureType } =
      this.state;
    this.setState({
      isLoading: true,
    });
    let params = {};
    if (this.state.activeTabKey == "P") {
      if (typeof animalType !== "undefined") {
        params.type = animalType;
      }
      if (typeof idOfEnclosure !== "undefined") {
        params.enclosure_id = idOfEnclosure;
      }
      if (typeof enclosureType !== "undefined") {
        params.enclosure_type = enclosureType;
      }

      getAnimalsEnclosureBased(params)
        .then((data) => {
          console.log(".....data......loadAnimals......>>", data);
          this.setState({
            animals: data,
            isLoading: false,
          });
        })
        .catch((error) => console.log(error));
    }
  };
  EnclosureHistory = () => {
    let user_id = this.context.userDetails.id;
    this.setState({
      isLoading: true,
    });
    const { animalType, enclosureID, idOfEnclosure, enclosureType, enc_ID } =
      this.state;
    let params = {};
    if (this.state.activeTabKey == "H") {
      if (typeof animalType !== "undefined") {
        params.type = animalType;
      }
      if (typeof idOfEnclosure !== "undefined") {
        params.enclosure_id = idOfEnclosure;
      }
      if (typeof enclosureType !== "undefined") {
        params.enclosure_type = enclosureType;
      }

      getEnclosureHistory(user_id, enc_ID)
        .then((data) => {
          console.log(".....data.....EnclosureHistory.........>>", data);
          this.setState({
            animals: data,
            isLoading: false,
          });
        })
        .catch((error) => console.log(error));
    }
  };
  loadIncidentReports = () => {
    let cid = this.context.userDetails.cid;
    let user_id = this.context.userDetails.id;
    if (this.state.activeTabKey == "A") {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          getAllIncidentReports(cid, this.state.enc_ID, user_id)
            .then((data) => {
              console.log("......data...>>", data);
              this.setState({
                isLoading: false,
                animals: data,
              });
            })
            .catch((error) => console.log(error));
        }
      );
    }
  };
  gotoBack = () => this.props.navigation.goBack();

  setActiveTab = (key) => {
    console.log("..............key...........", key);
    this.setState(
      {
        activeTabKey: key,
      },
      () => {
        this.loadAnimals();
        this.EnclosureHistory();
        this.loadIncidentReports();
      }
    );
  };

  checkEditActionPermissions = (item) => {
    if (this.context.userDetails.action_types.includes("Edit")) {
      this.gotoEditAnimal(item);
    }
  };

  gotoEditAnimal = (item) => {
    this.context.setAnimalID(item.animal_id);

    this.props.navigation.navigate("Animals", {
      id: item.id,
      classID: item.animal_group,
      categoryID: item.category,
      subCategoryID: item.sub_category !== null ? item.sub_category : undefined,
      animalType: item.type,
      commonName: item.english_name,
      scientificName: item.full_name,
      databaseName: item.database !== null ? item.database : undefined,
      taxonid: item.taxonid !== null ? item.taxonid : "",
    });
  };

  toggleItemSelect = (id) => {
    id = parseInt(id);
    let arr = this.state.selectedIDs;
    let index = arr.findIndex((element) => element === id);

    if (index > -1) {
      arr = arr.filter((element) => element !== id);
    } else {
      arr.push(id);
    }

    this.setState({ selectedIDs: arr });
  };

  exportList = () => {
    let { selectedIDs } = this.state;
    let ids = selectedIDs.join(",");
    exportAnimals(ids)
      .then((response) => {
        let data = response.data;
        this.setState({
          downloadUrl: data.fileuri,
          isModalOpen: true,
        });
      })
      .catch((error) => console.log(error));
  };

  downloadFile = (fileName, fileUri) => {
    let documentDirectory = FileSystem.documentDirectory + fileName;

    FileSystem.downloadAsync(fileUri, documentDirectory)
      .then(({ uri }) => {
        this.saveFile(uri);
      })
      .catch((error) => console.log(error));
  };

  saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      this.setState({ isFileSaved: true });
    } else {
      alert("Please grant the permission");
    }
  };

  closeModal = () =>
    this.setState({
      isModalOpen: false,
      isFileSaved: false,
      processingText: "Processing...",
      selectedIDs: [],
    });

  openSearchModal = () => {
    this.setState({
      isSearchModalOpen: true,
      searchValue: "",
      searchData: [],
    });

    setTimeout(() => {
      this.searchInput.current.focus();
    }, 500);
  };

  closeSearchModal = () => {
    this.setState({
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
    });
  };

  searchAnimal = () => {
    let { searchValue, animals } = this.state;

    let data = animals.filter((element) => {
      let animalID = element.animal_id.toLowerCase();
      let index = animalID.indexOf(searchValue.toLowerCase());
      return index > -1;
    });

    this.setState({ searchData: data });
  };

  onSearchItemSelect = (item) => {
    this.setState(
      {
        isSearchModalOpen: false,
        searchValue: "",
        searchData: [],
      },
      () => {
        this.gotoEditAnimal(item);
      }
    );
  };

  renderSearchItem = ({ item }) => {
    let identificationValues = [];
    if (item.dna !== null) {
      identificationValues.push(item.dna);
    }
    if (item.microchip !== null) {
      identificationValues.push(item.microchip);
    }
    if (item.ring_number !== null) {
      identificationValues.push(item.ring_number);
    }

    return (
      <TouchableHighlight
        underlayColor={"#eee"}
        onPress={this.onSearchItemSelect.bind(this, item)}
      >
        <View style={globalStyles.fieldBox}>
          <View style={[globalStyles.checkboxImgContainer, styles.width15]}>
            <Image
              style={globalStyles.image_h55w55}
              source={{ uri: item.image }}
              resizeMode="contain"
            />
          </View>
          <View
            style={[
              globalStyles.flex1,
              globalStyles.justifyContentCenter,
              globalStyles.pl5,
            ]}
          >
            <Text style={[globalStyles.labelName, globalStyles.pd0]}>
              {item.animal_id}
            </Text>
            {identificationValues.length > 0 ? (
              <Text style={[globalStyles.inputText, globalStyles.width60]}>
                {identificationValues.join("-")}
              </Text>
            ) : null}
          </View>
          <View activeOpacity={1} style={globalStyles.iconContainer}>
            <Ionicons
              name="chevron-forward"
              style={globalStyles.rightAngelIcon}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderAnimalItem = ({ item }) => {
    let { selectedIDs } = this.state;
    let isChecked = selectedIDs.includes(parseInt(item.id));

    let identificationValues = [];
    let dnaIdentificationValues = [];
    let ringNumberIdentificationValues = [];
    let microchipIdentificationValues = [];
    if (item.dna !== null) {
      identificationValues.push(item.dna);
      dnaIdentificationValues.push(item.dna);
    }
    if (item.microchip !== null) {
      identificationValues.push(item.microchip);
      microchipIdentificationValues.push(item.microchip);
    }
    if (item.ring_number !== null) {
      identificationValues.push(item.ring_number);
      ringNumberIdentificationValues.push(item.ring_number);
    }
    if (this.state.activeTabKey === "P") {
      return (
        <View style={globalStyles.fieldBox}>
          <View style={globalStyles.checkboxImgContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={globalStyles.p3}
              onPress={this.toggleItemSelect.bind(this, item.id)}
            >
              <MaterialCommunityIcons
                name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
                color={Colors.primary}
                size={22}
              />
            </TouchableOpacity>
            <Image
              style={globalStyles.image_h55w55}
              source={{ uri: item.image }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[globalStyles.width75, globalStyles.flexDirectionRow]}
            onPress={this.checkEditActionPermissions.bind(this, item)}
          >
            <View
              style={[
                globalStyles.flex1,
                globalStyles.justifyContentCenter,
                globalStyles.pl5,
              ]}
            >
              <View style={globalStyles.flexDirectionRow}>
                <Text
                  style={[globalStyles.labelName, globalStyles.pd0]}
                >{`${item.animal_id}`}</Text>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>{` ${
                  item.gender ? "- " + item.gender : ""
                }`}</Text>
                <Text style={[globalStyles.labelName, globalStyles.pd0]}>{`  ${
                  item.age && item.age <= 1 ? "(infant)" : ""
                }`}</Text>
              </View>

              {dnaIdentificationValues.length > 0 ? (
                <Text style={[globalStyles.inputText, globalStyles.width60]}>
                  {`DNA: ${dnaIdentificationValues}`}
                </Text>
              ) : null}

              {microchipIdentificationValues.length > 0 ? (
                <Text style={[globalStyles.inputText, globalStyles.width60]}>
                  {`Micro Chip: ${microchipIdentificationValues}`}
                </Text>
              ) : null}

              {ringNumberIdentificationValues.length > 0 ? (
                <Text style={[globalStyles.inputText, globalStyles.width60]}>
                  {`Ring Number: ${ringNumberIdentificationValues}`}
                </Text>
              ) : null}

              <View>
                {item.english_name ? (
                  <Text
                    style={[globalStyles.labelName, globalStyles.pd0]}
                  >{`Common Name: ${item.english_name}`}</Text>
                ) : null}
                {item.section ? (
                  <Text
                    style={[globalStyles.labelName, globalStyles.pd0]}
                  >{`Section: ${item.section}`}</Text>
                ) : null}
              </View>
            </View>
            <View style={globalStyles.iconContainer}>
              <Ionicons
                name="chevron-forward"
                style={globalStyles.rightAngelIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.activeTabKey === "H") {
      return (
        <TouchableHighlight underlayColor={"#eee"} style={globalStyles.CardBox}>
          <View style={globalStyles.leftPart}>
            <Text
              style={[globalStyles.labelName, globalStyles.pd0]}
            >{`#${item.request_number}`}</Text>
            <Text style={[globalStyles.labelName, globalStyles.pd0]}>
              {"Animals : "}
              <Text style={[globalStyles.inputText, globalStyles.width60]}>
                {item.animal_id}
              </Text>
            </Text>
            <Text style={[globalStyles.labelName, globalStyles.pd0]}>
              {"Requested By: "}
              <Text style={[globalStyles.inputText, globalStyles.width60]}>
                {item.changed_by_name}
              </Text>
            </Text>
            <Text style={[globalStyles.labelName, globalStyles.pd0]}>
              {"Reason: "}
              <Text style={[globalStyles.inputText, globalStyles.width60]}>
                {item.change_reason}
              </Text>
            </Text>
            <Text style={[globalStyles.labelName, globalStyles.pd0]}>
              {"Status: "}
              <Text style={[globalStyles.inputText, globalStyles.width60]}>
                {item.status}
              </Text>
            </Text>
          </View>
        </TouchableHighlight>
      );
    } else if (this.state.activeTabKey === "A") {
      return (
        <TouchableOpacity style={globalStyles.CardBox}>
          <View
            style={[
              globalStyles.flexDirectionRow,
              globalStyles.justifyContentBetween,
              globalStyles.pr5,
            ]}
          >
            <Text style={[globalStyles.labelName, globalStyles.pd0]}>
              {"ID: "}
              <Text style={[globalStyles.inputText, globalStyles.width60]}>
                {"#" + item.id}
              </Text>
            </Text>
            <Text
              style={[
                globalStyles.labelName,
                globalStyles.pd0,
                item.status === "P"
                  ? globalStyles.pendingStatus
                  : globalStyles.approveStatus,
              ]}
            >
              {item.status === "P" ? "Pending" : "Closed"}
            </Text>
          </View>
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Reference. "}
            <Text
              style={[globalStyles.inputText, globalStyles.width60]}
            >{`${item.ref_value}( ${item.ref} )`}</Text>
          </Text>
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Reported By. "}
            <Text style={[globalStyles.inputText, globalStyles.width60]}>
              {item?.full_name ?? "N/A"}
            </Text>
          </Text>
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Date: "}
            <Text style={[globalStyles.inputText, globalStyles.width60]}>
              {moment(item.created_on, "YYYY-MM-DD").format("DD/MM/YYYY")}
            </Text>
          </Text>
        </TouchableOpacity>
      );
    }
  };

  render = () => (
    <Container>
      <Header
        title={this.state.screenName}
        showScanButton={this.state.isLoading ? undefined : true}
        searchAction={this.state.isLoading ? undefined : this.openSearchModal}
      />
      <View style={globalStyles.tabContainer}>
        <TouchableOpacity
          onPress={() => this.setActiveTab("P")}
          style={[
            globalStyles.tab,
            this.state.activeTabKey === "P" ? globalStyles.activeTab : null,
          ]}
        >
          <Text
            style={
              this.state.activeTabKey === "P"
                ? globalStyles.activeTexttab
                : globalStyles.inActiveText
            }
          >
            Inmate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setActiveTab("A")}
          style={[
            globalStyles.tab,
            this.state.activeTabKey === "A" ? globalStyles.activeTab : null,
          ]}
        >
          <Text
            style={
              this.state.activeTabKey === "A"
                ? globalStyles.activeTexttab
                : globalStyles.inActiveText
            }
          >
            Incident
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setActiveTab("H")}
          style={[
            globalStyles.tab,
            this.state.activeTabKey === "H" ? globalStyles.activeTab : null,
          ]}
        >
          <Text
            style={
              this.state.activeTabKey === "H"
                ? globalStyles.activeTexttab
                : globalStyles.inActiveText
            }
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.state.animals}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderAnimalItem}
          initialNumToRender={this.state.animals.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.state.animals.length === 0 ? globalStyles.container : null
          }
        />
      )}

      {this.state.selectedIDs.length > 0 ? (
        <TouchableOpacity
          style={globalStyles.floatingBtn}
          onPress={this.exportList}
        >
          <Feather name="download" style={globalStyles.floatingBtnText} />
        </TouchableOpacity>
      ) : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalOpen}
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
              style={globalStyles.closeBtn}
              onPress={this.closeModal}
            >
              <Text style={globalStyles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*Search Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isSearchModalOpen}
        onRequestClose={this.closeSearchModal}
      >
        <View style={globalStyles.searchModalOverlay}>
          <View style={globalStyles.seacrhModalContainer}>
            <View style={globalStyles.searchModalHeader}>
              <TouchableOpacity
                activeOpacity={1}
                style={globalStyles.searchBackBtn}
                onPress={this.closeSearchModal}
              >
                <Ionicons name="arrow-back" size={25} color={Colors.white} />
              </TouchableOpacity>

              <View style={globalStyles.searchContainer}>
                <View style={globalStyles.searchFieldBox}>
                  <Ionicons name="search" size={24} color={Colors.white} />
                  <TextInput
                    ref={this.searchInput}
                    value={this.state.searchValue}
                    onChangeText={(searchValue) =>
                      this.setState(
                        {
                          searchValue: searchValue,
                        },
                        () => {
                          this.searchAnimal();
                        }
                      )
                    }
                    autoCompleteType="off"
                    placeholder="Search by animal ID"
                    placeholderTextColor={Colors.white}
                    style={globalStyles.searchField}
                  />
                </View>
              </View>
            </View>
            <View style={globalStyles.searchModalBody}>
              {this.state.searchValue.trim().length > 0 ? (
                <FlatList
                  data={this.state.searchData}
                  keyExtractor={(item, index) => item.id.toString()}
                  renderItem={this.renderSearchItem}
                  initialNumToRender={this.state.searchData.length}
                  ListEmptyComponent={() => (
                    <Text
                      style={[
                        {
                          color: Colors.textColor,
                        },
                        globalStyles.textAlignCenter,
                        globalStyles.mt10,
                      ]}
                    >
                      No Result Found
                    </Text>
                  )}
                />
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 5,
//   },
//   view: {
//     flexDirection: "row",
//     borderBottomColor: "#eee",
//     borderBottomWidth: 1,
//     paddingHorizontal: 5,
//     paddingVertical: 3,
//   },
//   image: {
//     width: 55,
//     height: 55,
//   },
//   checkboxImgContainer: {
//     width: "25%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingRight: 5,
//   },
//   name: {
//     fontSize: 18,
//     color: Colors.textColor,
//   },
//   subText: {
//     color: Colors.textColor,
//     opacity: 0.8,
//     fontSize: 14,

//   },
//   iconContainer: {
//     width: "15%",
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   rightAngelIcon: {
//     fontSize: 18,
//     color: "#cecece",
//   },
//   floatingBtn: {
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     width: 50,
//     height: 50,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.23,
//     shadowRadius: 2.62,
//     elevation: 4,
//     borderRadius: 50 / 2,
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//   },
//   floatingBtnText: {
//     fontSize: 28,
//     color: Colors.white,
//     position: "absolute",
//     top: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalBody: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.white,
//     width: Math.floor((windowWidth * 70) / 100),
//     minHeight: Math.floor(windowHeight / 4),
//     padding: 15,
//     borderRadius: 3,
//     elevation: 5,
//   },
//   downloadBtn: {
// 		flexDirection: "row",
// 		paddingHorizontal: 20,
// 		paddingVertical: 8,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
// 	},
//   loadingText: {
//     fontSize: 14,
//     color: Colors.textColor,
//     opacity: 0.6,
//     marginTop: 10,
//   },
//   closeBtn: {
//     position: "absolute",
//     bottom: 10,
//     padding: 10,
//   },
//   closeBtnText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: Colors.tomato,
//   },
//   searchModalOverlay: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.white,
//     width: windowWidth,
//     height: windowHeight,
//   },
//   seacrhModalContainer: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     width: windowWidth,
//     height: windowHeight,
//     elevation: 5,
//   },
//   searchModalHeader: {
//     height: 55,
//     width: "100%",
//     elevation: 5,
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     backgroundColor: Colors.primary,
//   },
//   searchBackBtn: {
//     width: "15%",
//     height: 55,
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   searchContainer: {
//     width: "85%",
//     flexDirection: "row",
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   searchFieldBox: {
//     width: "100%",
//     height: 40,
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "rgba(0,0,0, 0.1)",
//     borderRadius: 50,
//   },
//   searchField: {
//     width: "90%",
//     padding: 5,
//     color: Colors.white,
//     fontSize: 15,
//   },
//   searchModalBody: {
//     flex: 1,
//     height: windowHeight - 55,
//   },
//   tabContainer: {
//     width: "100%",
//     height: tabHeight,
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#d1d1d1",
//     borderTopWidth: 1,
//     borderTopColor: Colors.primary,
//     elevation: 1,
//   },
//   tab: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     height: tabHeight,
//   },
//   underlineStyle: {
//     backgroundColor: Colors.primary,
//     height: 3,
//   },
//   activeTab: {
//     height: tabHeight - 1,
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.primary,
//   },
//   activeText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   inActiveText: {
//     fontSize: 14,
//     color: Colors.textColor,
//     opacity: 0.8,
//   },
//   CardBox: {
//     marginLeft:5,
//     marginRight:5,
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 3,
// 	},
// 	labelName: {
// 		fontSize: 12,
// 		paddingLeft: 4,

// 		color: Colors.textColor,
// 		opacity: 0.9,
// 		textAlign: "left",
// 		fontWeight: "bold",
// 		flex: 1,
// 		width: "100%",
// 	},
// 	mc: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		marginLeft: 5,
// 		fontSize: 12,
// 		fontWeight: "500",
// 	},
// 	pendingStatus: {
// 		textAlign: "right",
// 		color: Colors.warning,
// 		fontStyle: "italic",
// 	},
// 	approveStatus: {
// 		textAlign: "right",
// 		color: Colors.success,
// 		fontStyle: "italic",
// 	},
// });
