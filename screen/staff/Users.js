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
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getUsers } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";

export default class Users extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      deptCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.deptCode
          : undefined,
      deptName:
        typeof props.route.params !== "undefined"
          ? props.route.params.deptName
          : undefined,
      desgCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.desgCode
          : undefined,
      desgName:
        typeof props.route.params !== "undefined"
          ? props.route.params.desgName
          : undefined,
      isLoading: true,
      users: [],
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
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
        users: [],
      },
      () => {
        this.loadUsers();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadUsers = () => {
    let reqObj = { cid: this.context.userDetails.cid };

    if (typeof this.state.deptCode !== "undefined") {
      reqObj.dept_code = this.state.deptCode;
    }

    if (typeof this.state.desgCode !== "undefined") {
      reqObj.desg_code = this.state.desgCode;
    }

    getUsers(reqObj)
      .then((data) => {
        this.setState({
          isLoading: false,
          users: data,
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
        this.loadUsers();
      }
    );
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

  renderSearchListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={
        this.context.userDetails?.action_types.includes("Edit")
          ? this.gotoEditUser.bind(this, item)
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

  renderListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={
        this.context.userDetails?.action_types.includes("Edit")
          ? this.gotoEditUser.bind(this, item)
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
            ]}
          >
            {item.full_name}
          </Text>
          {/* <Text style={[globalStyles.textfield, globalStyles.pd0]}>{"Department: " + item.dept_name}</Text> */}
          <Text style={[globalStyles.textfield, globalStyles.pd0]}>
            {"Designation: " + item.desg_name}
          </Text>
        </View>
        <View style={[{ width: "25%", padding: 5, alignItems: "flex-end" }]}>
          <Ionicons name="chevron-forward" size={18} color="#cecece" />
        </View>
      </View>
    </TouchableHighlight>
  );

  render = () => (
    <Container>
      <Header
        title={this.props.route.params.deptName}
        addAction={
          this.context.userDetails?.action_types.includes("Add")
            ? this.gotoAddUser
            : undefined
        }
        searchAction={this.state.isLoading ? undefined : this.openSearchModal}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.state.users}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderListItem}
          initialNumToRender={this.state.users.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.state.users.length === 0 ? globalStyles.container : null
          }
        />
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
                      <Text
                        style={{
                          color: Colors.textColor,
                          textAlign: "center",
                          marginTop: 10,
                        }}
                      >
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
// 		paddingVertical: 5,
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
