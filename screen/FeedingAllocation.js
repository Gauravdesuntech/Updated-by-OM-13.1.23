import React from "react";
import {
  StyleSheet,
  Text,
  View,
  // TouchableHighlight,
  FlatList,
  // Image,
  // Modal,
  TouchableOpacity,
  // TextInput,
  Dimensions,
  // SafeAreaView,
  // ActivityIndicator,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
// import {
//   Entypo,
//   Ionicons,
//   MaterialCommunityIcons,
//   MaterialIcons,
// } from "@expo/vector-icons";
import { Colors, Configs } from "../config";
import { Header, ListEmpty, Loader, MultiSelectDropdown2 } from "../component";
import {
  addSectionInChargeNew,
  // createFeedConfig,
  // getallFeedMenus,
  // getAllocationSections,
  // updateFeedWork,
  getNewSectionInChargeList,
  getUnassignedSectionList,
} from "../services/AllocationServices";
import AppContext from "../context/AppContext";
// import { capitalize, getFileData } from "../utils/Util";
// import Modal2 from "react-native-modal";
import colors from "../config/colors";
// import * as ImagePicker from "expo-image-picker";
import moment from "moment";
// import CustomCheckbox from "../component/tasks/AddTodo/CustomCheckBox";
// import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import { getAnimalSections } from "../services/APIServices";
import { ListUsers } from "../utils/api";
import Styles from "../config/Styles";

export default class FeedingAllocation extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      isLoading: false,
      sections: [],
      // users: [],
      // userObj: {},
      sectionInChargeList: [],
      assignedUsers: [],
      unAssignedUsers: [],
      unAssignedSections: [],
      // isSearching: true,
      // isSearchModalOpen: false,
      // searchValue: "",
      // searchData: [],
      // updateTask: false,
      // imageID: 0,
      // Images: [],
      // UploadData: [],
      // task_id: "",
      // isModalOpen: false,
      show: false,
      showheader: false,
      // time: moment(new Date()).format("HH:mm:ss"),
      // feedData: "",
      sectionData: "",
      // status: false,
      // today: new Date(),
      // showImage: false,
      // updateImages: [],
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
        this.getAllData();
      }
    );
  };

  getAllData = () => {
    this.setState({ isLoader: true });
    let cid = this.context.userDetails.cid;

    Promise.all([
      getAnimalSections(cid),
      getNewSectionInChargeList(),
      getUnassignedSectionList(),
    ])
      .then((response) => {
        let SectionData = response[0];

        let sectionInChargeList = response[1];

        let assignedUsers = sectionInChargeList.filter(
          (item) => item?.section_data.length
        );

        let unAssignedUsers = sectionInChargeList.filter(
          (item) => item?.section_data.length === 0
        );

        let unAssignedSections = response[2];

        console.log({ sectionInChargeList });

        this.setState({
          isLoading: false,
          sections: SectionData,
          sectionInChargeList,
          assignedUsers,
          unAssignedUsers,
          unAssignedSections,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoader: false });
      });
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.getAllData();
      }
    );
  };

  saveUser = (userId, sections) => {
    console.log({ userId, sections });
    const requestObj = {
      section_id: sections.map((item) => item.id).join(","),
      user_id: userId,
    };
    this.setState({ isLoading: true });

    addSectionInChargeNew(requestObj).then((response) => {
      console.log({ response });
      if (response.is_success) {
        // this.setState({ isLoading: false });
        this.getAllData();
        alert("Successfully Allocated");
        // this.gotoBack();
      } else {
        this.setState({ isLoading: false });
        alert("Sorry, Something went wrong !!");
      }
    });
  };

  setUsers = (userId, selectedSections) => {
    let tempSectionInChargeList = [...this.state.sectionInChargeList];

    tempSectionInChargeList.forEach((item, index) => {
      if (item.user_id === userId) {
        tempSectionInChargeList[index].section_data = [...selectedSections];
      }
    });

    let assignedUsers = tempSectionInChargeList.filter(
      (item) => item?.section_data.length
    );

    let unAssignedUsers = tempSectionInChargeList.filter(
      (item) => item?.section_data.length === 0
    );

    this.setState({
      sectionInChargeList: [...tempSectionInChargeList],
      assignedUsers,
      unAssignedUsers,
    });

    this.saveUser(userId, selectedSections);
  };

  renderAllocationListItem = ({ item }) => {
    return (
      <View
        style={{
          borderBottomColor: "#ddd0d0",
          borderBottomWidth: 1,
          padding: 1,
        }}
      >
        <View style={styles.view}>
          <View style={{ flex: 1, justifyContent: "flex-start" }}>
            <MultiSelectDropdown2
              label={item.name}
              items={this.state.sections}
              selectedItems={item?.section_data}
              labelStyle={styles.labelName}
              style={[
                styles.fieldBox,
                { flexDirection: "column", width: "100%" },
              ]}
              placeHolderContainer={styles.placeHolderContainer}
              placeholderStyle={styles.textfield}
              selectedItemsContainer={{
                width: "100%",
              }}
              onSave={(selectedSections) =>
                this.setUsers(item.user_id, selectedSections)
              }
              assignedUsers={this.state.assignedUsers}
              userId={item.user_id}
            />
          </View>
        </View>
      </View>
    );
  };

  render = () => {
    return (
      <Container>
        <Header
          navigation={this.props.navigation}
          title={"Allocation"}
          searchAction={this.state.isLoading ? undefined : this.openSearchModal}
          calculate={this.calculateDate}
          showDatePicker={this.showDatePickerheader}
        />

        {this.state.isLoading ? (
          <Loader />
        ) : (
          <ScrollView>
            {this.state.assignedUsers?.length === 0 &&
            this.state.unAssignedUsers?.length === 0 ? (
              <View style={{ marginVertical: "auto" }}>
                <ListEmpty />
              </View>
            ) : null}
            {this.state.unAssignedSections?.length ? (
              <View>
                <Text
                  style={[
                    Styles.sectionHeader,
                    {
                      marginBottom: 10,
                      fontSize: 26,
                      color: Colors.white,
                      height: 50,
                      lineHeight: 50,
                      paddingLeft: 10,
                      borderRadius: 0,
                    },
                  ]}
                >
                  Unassigned
                </Text>
                <View
                  style={{
                    marginHorizontal: 10,
                    marginBottom: 10,
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {this.state.unAssignedSections.map((element) => (
                    <View
                      key={element.id.toString()}
                      style={{
                        height: 25,
                        justifyContent: "center",
                        paddingHorizontal: 10,
                        paddingBottom: 2,
                        marginHorizontal: 3,
                        marginVertical: 5,
                        borderRadius: 2,
                        backgroundColor: Colors.primary,
                      }}
                    >
                      <Text style={{ fontSize: 15, color: Colors.white }}>
                        {element.name}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* <FlatList
                  data={this.state.unAssignedSections}
                  keyExtractor={(item, index) => item.id.toString()}
                  renderItem={({ item }) => <Text>{item.name}</Text>}
                  refreshing={this.state.isLoading}
                  onRefresh={this.handelRefresh}
                  // contentContainerStyle={
                  //   this.state.sections.length === 0 ? styles.container : null
                  // }
                /> */}
              </View>
            ) : null}
            {this.state.assignedUsers?.length ? (
              <View>
                <Text
                  style={[
                    Styles.sectionHeader,
                    {
                      marginBottom: 10,
                      fontSize: 26,
                      color: Colors.white,
                      height: 50,
                      lineHeight: 50,
                      paddingLeft: 10,
                      borderRadius: 0,
                    },
                  ]}
                >
                  Assigned
                </Text>
                <FlatList
                  data={this.state.assignedUsers}
                  keyExtractor={(item, index) => item.user_id.toString()}
                  renderItem={this.renderAllocationListItem}
                  refreshing={this.state.isLoading}
                  onRefresh={this.handelRefresh}
                  contentContainerStyle={
                    this.state.sections.length === 0 ? styles.container : null
                  }
                />
              </View>
            ) : null}
            {this.state.unAssignedUsers?.length ? (
              <View>
                {/* <Text
                  style={[
                    Styles.sectionHeader,
                    {
                      marginVertical: 10,
                      fontSize: 26,
                      color: Colors.white,
                      height: 50,
                      lineHeight: 50,
                      paddingLeft: 10,
                    },
                  ]}
                >
                  Unassigned
                </Text> */}
                {/* <FlatList
                  data={this.state.unAssignedUsers}
                  keyExtractor={(item, index) => item.user_id.toString()}
                  renderItem={this.renderAllocationListItem}
                  refreshing={this.state.isLoading}
                  onRefresh={this.handelRefresh}
                  contentContainerStyle={
                    this.state.sections.length === 0 ? styles.container : null
                  }
                /> */}
              </View>
            ) : null}
          </ScrollView>
        )}
      </Container>
    );
  };
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 1,
  },
  view: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  image: {
    width: 50,
    height: 50,
  },
  name: {
    fontSize: 18,
    color: Colors.textColor,
    marginBottom: 8,
  },
  qtyContainer: {
    height: 35,
    width: 35,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: {
    fontSize: 14,
    color: "#FFF",
  },
  btns: {
    fontSize: 18,
    color: colors.white,
  },
  angelIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconStyle: {
    fontSize: 18,
    color: "#cecece",
  },
  searchModalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
  },
  seacrhModalContainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: Colors.white,
  },
  searchModalHeader: {
    height: 55,
    width: "100%",
    elevation: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.primary,
  },
  backBtnContainer: {
    width: "10%",
    height: 55,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  searchBackground: {
    backgroundColor: Colors.primary,
  },
  searchContainer: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    padding: 5,
    marginTop: -5,
    marginBottom: 5,
    marginHorizontal: 8,
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 3,
    paddingVertical: 5,
    marginTop: 5,
    paddingHorizontal: 15,
    marginHorizontal: 15,
  },
  searchFieldBox: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0, 0.1)",
    borderRadius: 50,
  },
  searchField: {
    padding: 5,
    width: "90%",
    color: Colors.white,
    fontSize: 15,
  },
  searchModalBody: {
    flex: 1,
    height: windowHeight - 55,
  },
  searchingText: {
    fontSize: 12,
    color: Colors.textColor,
    opacity: 0.8,
    alignSelf: "center",
    marginTop: 20,
  },

  popupContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
    width: windowWidth - 40,
  },
  popupText: {
    fontSize: 16,
    color: Colors.black,
    alignSelf: "center",
  },
  pb0: {
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  mb0: {
    marginBottom: 0,
  },
  wrapper: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    width: "100%",
    // marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fieldBox: {
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    padding: 5,
    // borderRadius: 3,
    // borderColor: "#ddd",
    // borderWidth: 1,
    backgroundColor: "#fff",
    height: "auto",
    justifyContent: "space-between",
  },
  labelName: {
    color: Colors.labelColor,
    // lineHeight: 40,
    // fontSize: 19,
    // paddingLeft: 4,
    height: "auto",
    // paddingVertical: 10,
  },
  textfield: {
    backgroundColor: "#fff",
    height: "auto",
    flexWrap: "wrap",
    fontSize: 19,
    color: Colors.textColor,
    textAlign: "right",
    padding: 5,
  },
  dateField: {
    backgroundColor: "#fff",
    height: "auto",
    flexWrap: "wrap",
    fontSize: 19,
    color: Colors.textColor,
    textAlign: "left",
    width: "22%",
    padding: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveBtnText: {
    color: Colors.primary,
  },
  exitBtnText: {
    color: Colors.activeTab,
  },
  feedButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
    paddingVertical: 5,
    borderRadius: 3,
  },
  allocFeedButton: {
    width: "18%",
    height: 35,
    alignItems: "center",
    marginHorizontal: 2,
    justifyContent: "center",
    paddingHorizontal: 1,
    paddingVertical: 5,
    borderRadius: 3,
  },
});
