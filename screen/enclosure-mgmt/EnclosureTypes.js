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
  SafeAreaView,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, ListEmpty, Loader } from "../../component";
import { getAnimalEnclosureTypes } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";

export default class EnclosureTypes extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      enclosureTypes: [],
      isSearching: true,
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
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
        this.loadEnclosureTypes();
      }
    );
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadEnclosureTypes();
      }
    );
  };

  loadEnclosureTypes = () => {
    let cid = this.context.userDetails.cid;
    getAnimalEnclosureTypes(cid)
      .then((data) => {
        this.setState({
          isLoading: false,
          enclosureTypes: data,
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
    let { searchValue, enclosureTypes } = this.state;
    let data = enclosureTypes.filter((item) => {
      let name = item.name.toLowerCase();
      let index = name.indexOf(searchValue.toLowerCase());
      return index > -1;
    });

    this.setState({
      isSearching: false,
      searchData: data,
    });
  };

  gotoAddEnclosureType = () => {
    this.props.navigation.navigate("AddEnclosureType");
  };

  gotoEditEnclosureType = (item) => {
    this.closeSearchModal();
    this.props.navigation.navigate("AddEnclosureType", {
      id: item.id,
      name: item.name,
      screen_title: "Edit Enclosure Type",
    });
  };

  checkEditActionPermissions = (item) => {
    if (this.context.userDetails.action_types.includes("Edit")) {
      this.gotoEditEnclosureType(item);
    }
  };

  gotoAnimalList = (item) => {
    this.closeSearchModal();
    this.props.navigation.navigate("AnimalsListEnclosure", {
      enclosureType: item.id,
      screenName: item.name,
      screen_title: "Edit Enclosure Id",
    });
  };

  renderListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={this.checkEditActionPermissions.bind(this, item)}
      onLongPress={this.gotoAnimalList.bind(this, item)}
    >
      <View style={globalStyles.fieldBox}>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
          <Text style={[globalStyles.labelName]}>{item.name}</Text>
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
        return this.gotoAddEnclosureType;
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
        title={"Enclosure Types"}
        searchAction={this.state.isLoading ? undefined : this.openSearchModal}
        addAction={this.checkAddActionPermissions()}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.state.enclosureTypes}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderListItem}
          initialNumToRender={this.state.enclosureTypes.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.state.enclosureTypes.length === 0
              ? globalStyles.container
              : null
          }
        />
      )}

      {/*Search Modal*/}
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
        </SafeAreaView>
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
// });
