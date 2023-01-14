import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, ListEmpty, Loader } from "../../component";
import {
  getAnimalEnclosureIds,
  exportSection,
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import * as WebBrowser from "expo-web-browser";
import DownloadFile from "../../component/DownloadFile";
import globalStyles from "../../config/Styles";

export default class EnclosureIds extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      sectionID:
        typeof props.route.params !== "undefined"
          ? props.route.params.sectionID
          : undefined,
      isLoading: true,
      enclosureIds: [],
      isSearching: true,
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
      downloadUrl: "",
      isModalOpen: false,
    };

    this.searchInput = React.createRef();
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
        isLoading: true,
      },
      () => {
        this.loadEnclosureIds();
      }
    );
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadEnclosureIds();
      }
    );
  };

  loadEnclosureIds = () => {
    let { sectionID } = this.state;
    let reqObj = { cid: this.context.userDetails.cid };
    if (typeof sectionID !== "undefined") {
      reqObj.section_id = sectionID;
    }

    getAnimalEnclosureIds(reqObj)
      .then((data) => {
        this.setState({
          isLoading: false,
          enclosureIds: data,
        });
      })
      .catch((error) => console.log(error));
  };

  openSearchModal = () => {
    this.setState({
      isSearching: true,
      searchValue: "",
      searchData: [],
      isSearchModalOpen: true,
    });

    setTimeout(() => {
      this.searchInput.current.focus();
    }, 500);
  };

  closeSearchModal = () => {
    this.setState({
      isSearching: true,
      searchValue: "",
      searchData: [],
      isSearchModalOpen: false,
    });
  };

  searchData = () => {
    let { searchValue, enclosureIds } = this.state;
    let data = enclosureIds.filter((item) => {
      let name = item.enclosure_id.toLowerCase();
      let index = name.indexOf(searchValue.toLowerCase());
      return index > -1;
    });

    this.setState({
      isSearching: false,
      searchData: data,
    });
  };

  gotoAddEnclosureID = () => {
    this.props.navigation.navigate("AddEnclosureId");
  };

  gotoEditEnclosureId = (item) => {
    console.log(item);
    this.closeSearchModal();
    this.props.navigation.navigate("AddEnclosureId", {
      id: item.id,
      enclosure_id: item.enclosure_id,
      qr_code_value: item.qr_code_value,
      qr_code: item.qr_code,
      feed_ip: item.feed_ip,
      nest_ip: item.nest_ip,
      screen_title: "Edit Enclosure Id",
    });
  };

  gotoAnimalList = (item) => {
    console.log(item);
    this.closeSearchModal();
    this.props.navigation.navigate("AnimalsListEnclosure", {
      id: item.id,
      enclosureID: item.enclosure_id,
      screenName: item.enclosure_id,
      screen_title: "Edit Enclosure Id",
    });
  };

  exportSection = () => {
    const { sectionID } = this.state;
    exportSection(sectionID)
      .then((response) => {
        let data = response.data;
        this.setState({
          downloadUrl: data.fileuri,
          isModalOpen: true,
        });
      })
      .catch((err) => console.log(err));
  };
  closeModal = () =>
    this.setState({
      isModalOpen: false,
    });
  checkEditActionPermissions = (item) => {
    if (this.context.userDetails.action_types.includes("Edit")) {
      this.gotoEditEnclosureId(item);
    }
  };

  renderListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={this.gotoAnimalList.bind(this, item)}
      onLongPress={this.checkEditActionPermissions.bind(this, item)}
    >
      <View style={globalStyles.fieldBox}>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
          <Text style={[globalStyles.labelName]}>{item.enclosure_id}</Text>
          {/* <Text style={[globalStyles.name, { fontSize: 12 }]}>
					{
					item.total_male_animal > 0 ? "M - "+item.total_male_animal:'' + 
					item.total_female_animal > 0 ? ", F - "+item.total_female_animal:''
					}
					</Text> */}
        </View>
        <View style={globalStyles.angelIconContainer}>
          <Ionicons name="chevron-forward" size={18} color="#cecece" />
        </View>
      </View>
    </TouchableHighlight>
  );

  checkAddActionPermissions = () => {
    if (this.state.isLoading == false) {
      if (this.context.userDetails.action_types.includes("Add")) {
        return this.gotoAddEnclosureID;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  render = () => (
    <Container>
      <Header
        title={this.props.route.params.title}
        searchAction={this.state.isLoading ? undefined : this.openSearchModal}
        addAction={this.checkAddActionPermissions()}
        exportCommonName={this.state.isLoading ? undefined : this.exportSection}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.state.enclosureIds}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderListItem}
          initialNumToRender={this.state.enclosureIds.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.state.enclosureIds.length === 0 ? globalStyles.container : null
          }
        />
      )}
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
                style={globalStyles.backBtnContainer}
                onPress={this.closeSearchModal}
              >
                <Ionicons name="arrow-back" size={28} color={Colors.white} />
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
                          isSearching: true,
                        },
                        () => {
                          this.searchData();
                        }
                      )
                    }
                    autoCompleteType="off"
                    autoCapitalize="none"
                    placeholder="Search"
                    placeholderTextColor={Colors.white}
                    style={globalStyles.searchField}
                  />
                </View>
              </View>
            </View>
            <View style={globalStyles.searchModalBody}>
              {this.state.searchValue.trim().length > 0 ? (
                this.state.isSearching ? (
                  <Text style={globalStyles.searchingText}>Searching...</Text>
                ) : (
                  <FlatList
                    data={this.state.searchData}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderListItem}
                    initialNumToRender={this.state.searchData.length}
                    ListEmptyComponent={() => (
                      <Text style={globalStyles.searchingText}>
                        No Result Found
                      </Text>
                    )}
                  />
                )
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 	},
// 	view: {
// 		flexDirection: "row",
// 		height: 50,
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 	},
// 	name: {
// 		fontSize: 18,
// 		color: Colors.textColor,
// 	},
// 	angelIconContainer: {
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	iconStyle: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},
// 	searchModalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	seacrhModalContainer: {
// 		flex: 1,
// 		width: windowWidth,
// 		height: windowHeight,
// 		backgroundColor: Colors.white,
// 	},
// 	searchModalHeader: {
// 		height: 55,
// 		width: "100%",
// 		elevation: 5,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 		backgroundColor: Colors.primary,
// 	},
// 	backBtnContainer: {
// 		width: "10%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchContainer: {
// 		width: "90%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchFieldBox: {
// 		width: "100%",
// 		height: 40,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		backgroundColor: "rgba(0,0,0, 0.1)",
// 		borderRadius: 50,
// 	},
// 	searchField: {
// 		padding: 5,
// 		width: "90%",
// 		color: Colors.white,
// 		fontSize: 15,
// 	},
// 	searchModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 	},
// 	searchingText: {
// 		fontSize: 12,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		alignSelf: "center",
// 		marginTop: 20,
// 	},
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0, 0, 0, 0.5)",
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
// });
