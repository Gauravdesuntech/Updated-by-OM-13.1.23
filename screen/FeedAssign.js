import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Header,
  Loader,
  MultiSelectDropdown,
  Dropdown,
  OverlayLoader,
} from "../component";

// import Dropdown from "./Dropdown";
// import { Header } from "../component";
import Spinner from "../component/tasks/Spinner";
import { Colors } from "../config";
import AppContext from "../context/AppContext";
import { ListUsers } from "../utils/api";
import {
  addSectionInCharge,
  editSectionInCharge,
} from "../services/AllocationServices";
import { getAnimalSections } from "../services/APIServices";

export default class FeedAssign extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      isLoader: false,
      users: [],
      selectedUsers: [],
      // this.props.route.params.inChargeData.users.map((v) => {
      //   return { id: v.id, name: v.full_name };
      // }),
      // sections: [this.props.route.params.inChargeData],
      sections: [],
      // selectedSection: [this.props.route.params.inChargeData],
      selectedSection: "",
      // editable:
      //   this.props.route.params.inChargeData.users.length > 0 ? true : false,
      // section_name: this.props.route.params.inChargeData.name,
    };
  }

  componentDidMount = () => {
    this.onFocus = this.props.navigation.addListener("focus", () => {
      this.getAllData();
    });
  };

  componentWillUnmount() {
    this.onFocus();
  }

  getAllData = () => {
    this.setState({ isLoader: true });
    let cid = this.context.userDetails.cid;

    // ListUsers()
    //   .then((res) => {
    //     let data = res.data.data.map((item) => {
    //       return {
    //         id: item.id,
    //         name: item.full_name,
    //         user_code: item.user_code,
    //       };
    //     });
    //     console.log({ userData: data });
    //     this.setState({ users: data, isLoader: false });
    //   })

    Promise.all([getAnimalSections(cid), ListUsers()])
      .then((response) => {
        let SectionData = response[0];
        let userData = response[1].data.data.map((item) => {
          return {
            id: item.id,
            name: item.full_name,
            user_code: item.user_code,
          };
        });
        this.setState({
          isLoader: false,
          sections: SectionData,
          users: userData,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoader: false });
      });
  };

  handleSubmit = () => {
    if (this.state.selectedUsers.length == 0) {
      alert("Select atleast 1 user");
      return;
    } else {
      this.setState({ isLoader: true });
      let users = this.state.selectedUsers.map((v, i) => v.id);
      // let sections = this.state.selectedSection.map((v, i) => v.id);
      let sections = this.state.selectedSection.id;
      let obj = {
        // section_id: sections.join(","),
        section_id: sections,
        user_id: users.join(","),
      };
      console.log(obj);
      let submit = "";
      let msg = "";
      // if (this.state.editable) {
      //   submit = editSectionInCharge(obj);
      //   msg = "Edit Successfully Done !!";
      // } else {
      //   submit = addSectionInCharge(obj);
      //   msg = "Added Successfully !!";
      // }
      submit = addSectionInCharge(obj);
      msg = "Added Successfully !!";

      submit
        .then((res) => {
          console.log(res);
          if (res.is_success) {
            this.setState({ isLoader: false });
            alert(msg);
            this.gotoBack();
          } else {
            this.setState({ isLoader: false });
            alert("Sorry, Something went wrong !!");
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isLoader: true });
        });
    }
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  setUsers = (user) => {
    if (user.length == 0) {
      alert("Select atleast 1 user");
      return;
    } else {
      this.setState({ selectedUsers: user });
    }
  };

  setSection = (item) => {
    this.setState({ selectedSection: item });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={this.state.section_name} />
        {this.state.isLoader ? (
          <OverlayLoader />
        ) : (
          <View style={styles.body}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.multiSelectContainer}>
                <MultiSelectDropdown
                  label={"Select Users"}
                  isMandatory={true}
                  items={this.state.users}
                  selectedItems={this.state.selectedUsers}
                  labelStyle={styles.labelName}
                  style={styles.fieldBox}
                  placeHolderContainer={styles.placeHolderContainer}
                  placeholderStyle={styles.textfield}
                  selectedItemsContainer={styles.selectedItemsContainer}
                  onSave={this.setUsers}
                />
              </View>
              <View style={styles.multiSelectContainer}>
                {/* <MultiSelectDropdown
                  label={"Select Sections"}
                  // disabled={true}
                  isMandatory={true}
                  items={this.state.sections}
                  selectedItems={this.state.selectedSection}
                  labelStyle={styles.labelName}
                  style={styles.fieldBox}
                  placeHolderContainer={styles.placeHolderContainer}
                  placeholderStyle={styles.textfield}
                  selectedItemsContainer={styles.selectedItemsContainer}
                  onSave={this.setSection}
                /> */}
                <Dropdown
                  label={"Select Section:"}
                  isMandatory={true}
                  value={this.state.selectedSection.name}
                  items={this.state.sections}
                  onChange={this.setSection}
                  labelStyle={styles.labelName}
                  textFieldStyle={styles.dropdownTextField}
                  style={styles.fieldBox}
                  selectedItemsContainer={styles.selectedItemsContainer}
                />
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity activeOpacity={1} onPress={this.handleSubmit}>
                  <Text style={[styles.buttonText, styles.saveBtnText]}>
                    SAVE
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
                  <Text style={[styles.buttonText, styles.exitBtnText]}>
                    EXIT
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    flex: 9,
    padding: 2,
  },
  fieldBox: {
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    padding: 5,
    borderRadius: 3,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    height: "auto",
    justifyContent: "space-between",
    marginBottom: 5,
    marginTop: 5,
    // shadowColor: "#999",
    // shadowOffset: {
    // 	width: 0,
    // 	height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },
  labelName: {
    color: Colors.labelColor,
    // lineHeight: 40,
    fontSize: 19,
    paddingLeft: 4,
    height: "auto",
    paddingVertical: 10,
  },
  textfield: {
    backgroundColor: "#fff",
    height: "auto",

    fontSize: 12,
    color: Colors.textColor,
    textAlign: "right",
    padding: 5,
    width: "60%",
  },
  button: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 20,
    color: "#fff",
    marginVertical: 10,
    zIndex: 0,
  },
  textWhite: {
    color: "#fff",
    fontWeight: "bold",
  },
  textInputIcon: {
    position: "absolute",
    bottom: 14,
    right: 10,
    marginLeft: 8,
    color: "#0482ED",
    zIndex: 99,
  },
  item: {
    height: 35,
    backgroundColor: "#00b386",
    alignItems: "center",
    justifyContent: "center",
  },
  itemtitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  errorFieldBox: {
    borderWidth: 1,
    borderColor: Colors.tomato,
  },
  // multiSelectContainer: {
  //     height: 'auto',
  //     width: '100%',
  //     borderRadius: 3,
  //     borderColor: "#ddd",
  //     borderWidth: 1,
  //     backgroundColor: "#fff",
  //     marginBottom: 5,
  //     marginTop: 5,
  //     shadowColor: "#999",
  //     shadowOffset: {
  //         width: 0,
  //         height: 1,
  //     },
  //     shadowOpacity: 0.22,
  //     shadowRadius: 2.22,
  //     elevation: 3,
  //     padding: 5,
  // },
  placeholderStyle: {
    fontSize: 18,
    color: Colors.textColor,
    opacity: 0.8,
  },
  selectedItemsContainer: {
    width: "60%",
    height: "auto",
    paddingVertical: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  placeHolderContainer: {
    borderWidth: 0,
  },
  errorText: {
    textAlign: "right",
    color: Colors.tomato,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  errorFieldBox: {
    borderWidth: 1,
    borderColor: Colors.tomato,
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
  dropdownTextField: {
    backgroundColor: "#fff",
    height: "auto",

    fontSize: 18,
    color: Colors.textColor,
    textAlign: "center",
    padding: 5,
    width: "50%",
  },
});
