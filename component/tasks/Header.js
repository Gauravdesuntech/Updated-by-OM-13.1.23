import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";

import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import Colors from "../../config/colors";
import Theme from "../../Theme";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Actions } from "react-native-router-flux";
import { height } from "react-native-daterange-picker/src/modules";
import { deleteTask } from "../../utils/api";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";

class Header extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      filterBy: "",
    };
  }

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = (value) => {
    let filter = "";
    if (value == "all_task") {
      filter = "All Tasks";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else if (value == "today_task") {
      filter = "Today's Tasks";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else if (value == "due_tomorrow_task") {
      filter = "Task Due Tomorrow";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else if (value == "over_due_task") {
      filter = "Over Due Task";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else if (value == "critical_task") {
      filter = "Critical Tasks Due";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else if (value == "compelete_task") {
      filter = "Completed Tasks";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else if (value == "coming_task") {
      filter = "Tasks due for next 7 days";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else if (value == "clear") {
      this.context.unsetFilterDetails();
    } else if (value == "extra") {
      filter = "Additional Tasks";
      this.context.setFilterDetails({
        id: value,
        name: filter,
      });
    } else {
      filter = "";
    }
    // this.setState({
    //     filterBy:filter
    // })
    this._menu.hide();
    // this.props.navigation.push("Todo", { 'filterQuery': value});
    this.props.filterQuery(value);
  };

  showMenu = () => {
    this._menu.show();
  };

  gotoHome = () => this.props.navigation.navigate("Home");
  gotoPermanent = () => {
    const title = "permanent";
    const id = 1;
    const items = [];
    this.props.navigation.push("NewAssignScreen", { items, title, id });
  };
  gotoEdit = () => {
    const id = this.props.task_id;
    this.props.navigation.push("AddCategoryItem", { task_id: id });
  };
  gotoDelete = () => {
    const id = this.props.task_id;
    console.log("Delete", id);
    deleteTask(id)
      .then((res) => {
        alert("Task Deleted");
        this.props.navigation.goBack();
      })
      .catch((err) => console.log(err));
  };
  gotoDelicate = () => {
    const title = "delicate";
    const id = 1;
    const items = [];
    this.props.navigation.push("NewAssignScreen", { items, title, id });
  };
  gotoSearchByTasks = () => this.props.navigation.navigate("SearchByTasks");

  render() {
    return (
      <View style={styles.container}>
        {this.props.route === "ViewItem" ? (
          <>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name={"ios-arrow-back"} size={20} color={"#fff"} />
            </TouchableOpacity>
            <Text style={styles.title}>{this.props.title}</Text>

            {/* home menu icon here */}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.gotoHome}
              style={globalStyles.p3}
            >
              <Ionicons name="home" size={20} color={Colors.white} />
            </TouchableOpacity>

            {/* edit menu icon here */}
            {/* {this.props.created_by==this.context.userDetails.id || this.props.assign.indexOf(this.context.userDetails.id) > - 1 ? */}
            {this.props.created_by == this.context.userDetails.id ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={this.gotoEdit}
                  style={globalStyles.p3}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>

                {/* delete menu icon here */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={this.gotoDelete}
                  style={globalStyles.p3}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </>
            ) : null}
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name={"ios-arrow-back"} size={25} color={"#fff"} />
            </TouchableOpacity>

            <View>
              {this.props.title == "TO DO LIST" ? null : (
                <Text style={styles.title}>{this.props.title}</Text>
              )}
              {this.props.title2 == true &&
              this.context.filterDetails != null ? (
                <Text
                  style={[
                    styles.title,
                    {
                      fontSize: 12,
                      marginLeft: 2,
                      flexWrap: "wrap",
                      width: 100,
                    },
                  ]}
                >
                  filter by {this.context.filterDetails.name}
                </Text>
              ) : null}
            </View>

            {/* home menu icon here */}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.gotoHome}
              style={globalStyles.p3}
            >
              <Ionicons name="home" size={20} color={Colors.white} />
            </TouchableOpacity>

            {!this.props.leftIcon ? null : (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push(
                    this.props.leftNavTo,
                    this.props.params
                  )
                }
              >
                <Ionicons name={this.props.leftIcon} size={20} color={"#fff"} />
              </TouchableOpacity>
            )}

            {!this.props.goToCompleteTaskIcon ? null : (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push(
                    this.props.goToCompleteTaskIcon,
                    this.props.params
                  )
                }
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: Colors.white,
                  }}
                >
                  C
                </Text>
              </TouchableOpacity>
            )}

            {/* Delicate Assign icon here */}
            {/* {this.props.params == "assign_user" ? null : (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.gotoDelicate}
                style={globalStyles.p3}
              >
                <MaterialCommunityIcons
                  name="alpha-d"
                  size={30}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )} */}
            {/* Permanent Assign icon here
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.gotoPermanent}
                    style={globalStyles.p5}
                >
                    <Text style={{ fontSize: 25, fontWeight: "bold", color: Colors.white }}>R</Text>
                </TouchableOpacity> */}
            {/* filter for user icon here */}
            {this.props.title == "Search Tasks" ? null : (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.gotoSearchByTasks}
                style={globalStyles.p5}
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )}

            {this.props.showRelatedScanButton ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.props.openRelatedScaner}
                style={globalStyles.p5}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={18}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}

            {this.props.title == "TO DO LIST" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.props.switchCategory}
                style={globalStyles.p3}
              >
                <MaterialCommunityIcons
                  name={
                    this.props.switchCategoryStatus
                      ? "axis-z-rotate-clockwise"
                      : "axis-z-rotate-counterclockwise"
                  }
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {this.props.title == "TO DO LIST" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.props.switchUserIcon}
                style={globalStyles.p3}
              >
                <Ionicons
                  name={
                    this.props.switchUserStatus ? "person" : "person-outline"
                  }
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ) : null}
            {this.props.title == "TO DO LIST" || this.props.filterQuery ? (
              <>
                {/* <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.props.extra}
                    style={globalStyles.p3}
                >
                {this.props.adv==true ? <MaterialCommunityIcons name="alpha-a-box-outline" size={30} color={Colors.white} />:<MaterialCommunityIcons name="alpha-a" size={30} color={Colors.white} /> }
                </TouchableOpacity> */}

                <Menu
                  ref={this.setMenuRef}
                  button={
                    <TouchableOpacity onPress={this.showMenu}>
                      <Feather
                        name={this.props.rightIcon}
                        size={20}
                        color={"#fff"}
                      />
                    </TouchableOpacity>
                  }
                >
                  <MenuItem onPress={this.hideMenu.bind(this, "all_task")}>
                    <Text style={{ color: Colors.textColor }}>All Tasks</Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={this.hideMenu.bind(this, "today_task")}>
                    <Text style={{ color: Colors.textColor }}>
                      Today's Tasks
                    </Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onPress={this.hideMenu.bind(this, "due_tomorrow_task")}
                  >
                    <Text style={{ color: Colors.textColor }}>
                      Task Due Tomorrow
                    </Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={this.hideMenu.bind(this, "over_due_task")}>
                    <Text style={{ color: Colors.textColor }}>
                      Over Due Task
                    </Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={this.hideMenu.bind(this, "critical_task")}>
                    <Text style={{ color: Colors.textColor }}>
                      Critical Tasks Due
                    </Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onPress={this.hideMenu.bind(this, "compelete_task")}
                  >
                    <Text style={{ color: Colors.textColor }}>
                      Completed Tasks
                    </Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={this.hideMenu.bind(this, "coming_task")}>
                    <Text style={{ color: Colors.textColor }}>
                      Tasks due for next 7 days
                    </Text>
                  </MenuItem>
                  <MenuItem onPress={this.hideMenu.bind(this, "extra")}>
                    <Text style={{ color: Colors.textColor }}>
                      Additional Tasks
                    </Text>
                  </MenuItem>
                  <MenuItem onPress={this.hideMenu.bind(this, "clear")}>
                    <Text style={{ color: Colors.textColor }}>
                      Clear Filter
                    </Text>
                  </MenuItem>
                </Menu>
              </>
            ) : null}

            {/* menu for dropdown starts here */}
          </>
        )}
      </View>
    );
  }
}
export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 20, //SUBHASH : Change header size here
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
  },
});
