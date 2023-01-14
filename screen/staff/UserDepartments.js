import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  SafeAreaView,
  SectionList,
  RefreshControl,
  ScrollView,
  Switch,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import {
  getAvailableDepartments,
  getUsers,
  manage_status,
} from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import styles from "./Styles";
import colors from "../../config/colors";
import Modal2 from "react-native-modal";

export default class UserDepartments extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      nextScreen: props.route.params.nextScreen,
      editScreen: props.route.params.editScreen,
      isLoading: true,
      departments: [],
      users: [],
      isSearchModalOpen: false,
      isChngStatus: false,
      userStatusDetails: "",
      searchValue: "",
      searchData: [],
      activeSections: [],
    };

    this.searchInput = React.createRef();
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
        isLoading: true,
        departments: [],
      },
      () => {
        this.loadAvailableDepartments();
        this.loadUsers();
      }
    );
  };

  loadUsers = () => {
    let reqObj = { cid: this.context.userDetails.cid, is_sections: 1 };
    getUsers(reqObj)
      .then((data) => {
        let dataArr = [];
        for (let key in data) {
          dataArr.push({ title: key, data: data[key].sort((a, b) => Number(b.status) - Number(a.status)) });
        }

        // console.log("user Data>>>>>>>>>>>", dataArr[0]);
        this.setState({
          isLoading: false,
          users: dataArr.sort((a, b) => Number(a.title) - Number(b.title)),
        });
      })
      .catch((error) => console.log(error));
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadAvailableDepartments = () => {
    getAvailableDepartments()
      .then((data) => {
        this.setState({
          isLoading: false,
          departments: data,
        });
      })
      .catch((error) => console.log(error));
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadAvailableDepartments();
      }
    );
  };

  searchUser = () => {
    let { searchValue, users } = this.state;

    let data = users.filter((element) => {
      let name = element.full_name.toLowerCase();
      let index = name.indexOf(searchValue.toLowerCase());
      return index > -1;
    });

    this.setState({ searchData: data });
  };

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

  gotoUserListing = (item) => {
    this.props.navigation.navigate(this.state.nextScreen, {
      id: item.id,
      deptCode: item.dept_code,
      deptName: item.dept_name,
      desgCode: item.desg_code,
      desgName: item.desg_name,
      employeer_name: item.employeer_name,
      employeer_id: item.employeer_id,
      report_manager_id: item.report_manager_id,
      report_manager_name: item.report_manager_name,
    });
  };

  gotoUserStatus = (item) => {
    let obj = '';
    if (item) {
      obj = {
        id: item.id,
        status: Boolean(Number(item.status)),
        reason: "",
      }
    }
    this.setState({
      isChngStatus: !this.state.isChngStatus,
      userStatusDetails: obj
    });
  };

  chngStatus = () => {
    this.setState({
      isChngStatus: false,
      isLoading : true
    });
    let obj = {
      user_id: this.state.userStatusDetails.id,
      status: Number(this.state.userStatusDetails.status)
    }
    manage_status(obj).then((res)=>{
      alert(res.message)
      this.onScreenFocus();
    }).catch((err)=>console.log(err))
  };

  toggleSwitch = () => {
    let obj = this.state.userStatusDetails;
    obj.status = !this.state.userStatusDetails.status
    this.setState({
      userStatusDetails: obj
    });
  };

  gotoAddUser = () =>
    this.props.navigation.navigate("AddUser", {
      deptCode: this.state.deptCode,
      deptName: this.state.deptName,
      desgCode: this.state.desgCode,
      desgName: this.state.desgName,
    });

  gotoEditUser = (item) => {
    // console.log(item);return;
    this.props.navigation.navigate("AddUser", {
      id: item.id,
      deptCode: item.dept_code,
      deptName: item.dept_name,
      desgCode: item.desg_code,
      desgName: item.desg_name,
      employeer_name: item.employeer_name,
      employeer_id: item.employeer_id,
      report_manager_id: item.report_manager_id,
      report_manager_name: item.report_manager_name,
    });
  };

  handleSearchEdit(item) {
    this.props.navigation.navigate(this.state.editScreen, {
      id: item.id,
      deptCode: item.dept_code,
      deptName: item.dept_name,
      desgCode: item.desg_code,
      desgName: item.desg_name,
      employeer_name: item.employeer_name,
      employeer_id: item.employeer_id,
    });
  }

  renderSearchListItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor={"#eee"}
        onPress={() => {
          this.context.userDetails?.action_types.includes("Edit")
            ? this.handleSearchEdit.bind(this, item)
            : undefined;
        }}
      >
        <View style={globalStyles.row}>
          <View style={[globalStyles.leftPart, globalStyles.p5]}>
            <Text
              style={[
                globalStyles.labelName,
                globalStyles.pd0,
                globalStyles.text_bold,
              ]}
            >
              {item.full_name}
            </Text>
            <Text style={[globalStyles.textfield, globalStyles.pd0]}>
              {`Department: ${item.dept_name}`}
            </Text>
            <Text style={[globalStyles.textfield, globalStyles.pd0]}>
              {`Designation: ${item.desg_name}`}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderListItem = ({ item }) => {
    // console.log({ item });

    return (
      // <TouchableHighlight
      // 	underlayColor={"#eee"}
      // 	onPress={this.gotoUserListing.bind(this, item)}
      // >
      // 	<View style={[globalStyles.fieldBox,{height:50}]}>
      // 		<View style={[globalStyles.leftPart,{padding:5}]}>
      // 			<Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.text_bold]}>{item.dept_name}</Text>
      // 		</View>
      // 		<View style={[{padding:5,justifyContent:'flex-end'}]}>
      // 			<Ionicons name="chevron-forward" size={18} color="#cecece" />
      // 		</View>
      // 	</View>
      // </TouchableHighlight>

      <TouchableHighlight
        underlayColor={"#eee"}
        onPress={
          this.context.userDetails?.action_types.includes("Edit") && item.status == 1
            ? this.gotoUserListing.bind(this, item)
            : undefined
        }
        onLongPress={
          this.context.userDetails?.action_types.includes("Edit")
            ? this.gotoUserStatus.bind(this, item)
            : undefined
        }
      >
        <View style={globalStyles.row}>
          <View style={[globalStyles.leftPart, globalStyles.p5]}>
            <Text
              style={[
                globalStyles.labelName,
                globalStyles.pd0,
                globalStyles.text_bold,
                item.status == 0 ? { color: colors.mediumGrey } : { color: Colors.labelColor }
              ]}
            >
              {item.full_name}
            </Text>
            {/* <Text style={[globalStyles.textfield, globalStyles.pd0]}>{"Department: " + item.dept_name}</Text> */}
            <Text style={[globalStyles.textfield, globalStyles.pd0, item.status == 0 ? { color: colors.mediumGrey } : { color: Colors.labelColor }]}>
              {item.desg_name}
            </Text>
          </View>
          <View style={[styles.forwardIcon]}>
            {item.status == 0 ? <Text style={[globalStyles.textfield, globalStyles.pd0, item.status == 0 ? { color: colors.mediumGrey } : { color: Colors.labelColor }]}>
              InActive
            </Text> :
              <Ionicons name="chevron-forward" size={18} color="#cecece" />
            }
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render = () => (
    <Container>
      <Header
        title={"Users"}
        addAction={
          this.context.userDetails?.action_types.includes("Add")
            ? this.gotoAddUser
            : undefined
        }
      // searchAction={this.state.isLoading ? undefined : this.openSearchModal}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <ScrollView nestedScrollEnabled={true}>
          <Accordion
            sections={this.state.users}
            activeSections={this.state.activeSections}
            renderHeader={(section) => {
              return (
                <View style={globalStyles.sectionHeaderUser}>
                  <View style={globalStyles.sectionHeaderRight}>
                    <Text style={globalStyles.sectionHeaderTextUser}>
                      {section.title}{"  "}
                      <Ionicons name="caret-down" style={{ fontSize: 18, color: Colors.primary }} />
                    </Text>
                  </View>
                </View>
              );
            }}
            renderContent={(section) => {
              return (
                <FlatList
                  ListEmptyComponent={() => <ListEmpty />}
                  data={section.data}
                  keyExtractor={(item, index) => item.id.toString()}
                  renderItem={this.renderListItem}
                  initialNumToRender={section.data.length}
                  // refreshing={this.state.isLoading}
                  // onRefresh={this.handelRefresh}
                  contentContainerStyle={
                    this.state.departments.length === 0
                      ? globalStyles.container
                      : null
                  }
                />
              );
            }}
            onChange={(activeSections) => {
              this.setState({ activeSections });
            }}
          />
        </ScrollView>

        // <ScrollView
        //   nestedScrollEnabled={true}
        //   showsVerticalScrollIndicator={false}
        // >
        //   {/* <Text style={styles.title}>Sub Categories</Text> */}
        //   <View
        //     style={[
        //       styles.selectors,
        //       { flexDirection: "row", flexWrap: "wrap" },
        //     ]}
        //   >
        //     {this.state.users.map((section1, index) => (
        //       <TouchableOpacity
        //         key={section1.title}
        //         onPress={() => this.setSections(section1)}
        //       >
        //         <View
        //           // style={
        //           //   section1.isCatSelect ? styles.capsulePress : styles.capsule
        //           // }
        //         >
        //           <Text
        //             style={
        //               section1.isCatSelect
        //                 ? styles.capsuleTextPress
        //                 : styles.capsuleText
        //             }
        //           >
        //             {section1.name}
        //           </Text>
        //         </View>
        //       </TouchableOpacity>
        //     ))}
        //   </View>
        //   <Collapsible collapsed={false}>
        //     <View style={styles.content}>
        //       {this.state.tasks && this.state.tasks.length > 0 ? (
        //         <FlatList
        //           // horizontal={true}
        //           // showsHorizontalScrollIndicator={false}
        //           data={this.state.tasks}
        //           renderItem={this.renderTasksItem}
        //           keyExtractor={(item) => item.id.toString()}
        //         />
        //       ) : (
        //         <View style={{ justifyContent: "center" }}>
        //           <View
        //             style={{
        //               justifyContent: "center",
        //               textAlign: "center",
        //             }}
        //           >
        //             <Text
        //               style={{
        //                 color: Colors.primary,
        //                 textAlign: "center",
        //               }}
        //             >
        //               No Tasks Found
        //               {/* <Ionicons
        //                                                     name="sad-outline"
        //                                                     style={{ fontSize: 20, color: Colors.danger }}
        //                                                 /> */}
        //             </Text>
        //           </View>
        //         </View>
        //       )}
        //     </View>
        //   </Collapsible>
        // </ScrollView>

        // <SectionList
        //   sections={this.state.users}
        //   keyExtractor={(item, index) => item.id.toString()}
        //   renderItem={this.renderListItem}
        //   contentContainerStyle={
        //     this.state.users.length === 0 ? globalStyles.container : null
        //   }
        //   ListEmptyComponent={() => <ListEmpty />}
        //   stickySectionHeadersEnabled
        //   renderSectionHeader={({ section: { title } }) => {
        //     return (
        //       <View style={globalStyles.sectionHeader}>
        //         <View style={globalStyles.sectionHeaderRight}>
        //           <Text style={globalStyles.sectionHeaderText}>{title}</Text>
        //         </View>
        //       </View>
        //     );
        //   }}
        //   refreshControl={
        //     <RefreshControl
        //       refreshing={this.state.isLoading}
        //       onRefresh={this.handelRefresh}
        //     />
        //   }
        // />

        // <FlatList
        // 	ListEmptyComponent={() => <ListEmpty />}
        // 	data={this.state.departments}
        // 	keyExtractor={(item, index) => item.dept_code.toString()}
        // 	renderItem={this.renderListItem}
        // 	initialNumToRender={this.state.departments.length}
        // 	refreshing={this.state.isLoading}
        // 	onRefresh={this.handelRefresh}
        // 	contentContainerStyle={
        // 		this.state.departments.length === 0 ? globalStyles.container : null
        // 	}
        // />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isSearchModalOpen}
        onRequestClose={this.closeSearchModal}
      >
        <SafeAreaView style={globalStyles.safeAreaViewStyle}>
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
                            this.searchUser();
                          }
                        )
                      }
                      autoCompleteType="off"
                      placeholder="Search"
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
                    renderItem={this.renderSearchListItem}
                    initialNumToRender={this.state.searchData.length}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={() => (
                      <Text style={globalStyles.listEmptyComponentStyle}>
                        No Result Found
                      </Text>
                    )}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      {/* Change status */}
      <Modal2
        isVisible={this.state.isChngStatus}
        coverScreen={false}
        onBackdropPress={() => this.gotoUserStatus()}
      >
        <View style={[globalStyles.popupContainer, globalStyles.mt60]}>
          <View style={globalStyles.popupSwitch}>
            <Text style={globalStyles.popupText}>Change User Status</Text>
            <Switch
              trackColor={{ false: "#767577", true: Colors.primary }}
              thumbColor={this.state.userStatusDetails.status ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.toggleSwitch}
              value={this.state.userStatusDetails.status}
            />
          </View>
          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              // style={globalStyles.button}
              onPress={this.chngStatus}
            >
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                Confirm Change
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              // style={globalStyles.button}
              onPress={() => this.gotoUserStatus()}
            >
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal2>
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
// 	row: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 15,
// 	},
// 	leftPart: {
// 		width: "75%",
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	name: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 14,
// 		lineHeight: 22,
// 	},
// 	iconStyle: {
// 		fontSize: 18,
// 		color: "#cecece",
// 	},

// 	searchModalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	seacrhModalContainer: {
// 		flex: 1,
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 		elevation: 5,
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
// 	searchBackBtn: {
// 		width: "10%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchContainer: {
// 		width: "90%",
// 		flexDirection: "row",
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
// 		width: "90%",
// 		padding: 5,
// 		color: Colors.white,
// 		fontSize: 15,
// 	},
// 	searchModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 	}
// });
