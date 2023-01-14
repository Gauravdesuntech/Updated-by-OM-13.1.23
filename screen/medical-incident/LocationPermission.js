import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Switch,
} from "react-native";
import { Container } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";
import {
  getUserList,
  manageLocationPermission,
} from "../../services/UserManagementServices";

export default class LocationPermission extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      users: [],
    };
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
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getUserList()
          .then((response) => {
            console.log({ response });
            this.setState({
              isLoading: false,
              users: response,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  // let cid = this.context.userDetails.cid;

  togglePermission = (userId, toggleVal) => {
    let cid = this.context.userDetails.cid;

    let obj = { cid, id: userId, value: toggleVal === "1" ? "0" : "1" };

    this.setState({ isLoading: true });

    manageLocationPermission(obj)
      .then((response) => {
        this.setState({ isLoading: false }, () => {
          alert(response.message);
        });

        this.loadUsers();
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  };

  renderItem = ({ item }) => (
    <View
      // onPress={this.gotoEdit.bind(this, item)}
      style={[
        styles.fieldBox,
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
      ]}
    >
      <Text style={styles.labelName}>{item.full_name}</Text>
      <Switch
        // trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={item.location_status === "1" ? Colors.primary : ""}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() =>
          this.togglePermission(item.id, item.location_status)
        }
        value={item.location_status === "1"}
      />
      {/* <TouchableOpacity
        activeOpacity={0.5}
        onPress={props.togglePermission}
        style={{ padding: 8 }}
      >
        <MaterialCommunityIcons
          name={
            // props.switchIconStatus
            //   ? "axis-z-rotate-clockwise"
            //   :
            "axis-z-rotate-counterclockwise"
          }
          size={25}
          color={Colors.primary}
        />
      </TouchableOpacity> */}
    </View>
  );

  render = () => (
    <Container>
      <Header
        title={"Permission"}
        // addAction={this.gotoAddDiagnosis}
      />
      <View style={styles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.users}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            // initialNumToRender={this.state.users.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loadUsers}
            contentContainerStyle={
              this.state.users.length === 0 ? styles.container : null
            }
          />
        )}
      </View>
    </Container>
  );
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 	},
// 	tabContainer: {
// 		width: "100%",
// 		height: tabHeight,
// 		flexDirection: "row",
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#d1d1d1",
// 		borderTopWidth: 1,
// 		borderTopColor: Colors.primary,
// 		elevation: 1,
// 	},
// 	tab: {
// 		flex: 1,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		height: tabHeight,
// 	},
// 	underlineStyle: {
// 		backgroundColor: Colors.primary,
// 		height: 3,
// 	},
// 	activeTab: {
// 		height: tabHeight - 1,
// 		borderBottomWidth: 2,
// 		borderBottomColor: Colors.primary,
// 	},
// 	activeText: {
// 		fontSize: 14,
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	inActiveText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	listContainer: {
// 		flex: 1,
// 		padding: 8,
// 		height: windowHeight - tabHeight,
// 	},
// 	pl12: {
// 		paddingLeft: 12,
// 	},
// 	btn: {
// 		// width: Math.floor(windowWidth / 2),
// 		paddingVertical: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
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
// 	rejectStatus: {
// 		textAlign: "right",
// 		color: Colors.danger,
// 		fontStyle: "italic",
// 	},
//     title: {
// 		width: "72%",
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},

// });
