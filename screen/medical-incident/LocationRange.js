import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import Base64 from "../../config/Base64";
import {
  Header,
  Dropdown,
  OverlayLoader,
  MultiSelectDropdown,
} from "../../component";
import {
  getUserList,
  manageRangeChange,
} from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../../config/Styles";
// import styles from "../../config/Styles";

export default class LocationRange extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      users: [],
      selectedUsers: [],
      range: null,
    };

    this.scrollViewRef = React.createRef();
    this.multiSelect = React.createRef();
  }

  componentDidMount = () => {
    getUserList()
      .then((response) => {
        this.setState({
          showLoader: false,
          users: response?.map((item) => ({
            id: item.id,
            name: item.full_name,
          })),
        });
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => this.props.navigation.goBack();

  setUsers = (user) => {
    if (user.length == 0) {
      alert("Select atleast 1 user");
      return;
    } else {
      this.setState({ selectedUsers: user });
    }
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveRange = () => {
    this.setState({ showLoader: true });
    let selectedUsers = this.state.selectedUsers.map((v, i) => ({ id: v.id }));
    let obj = { users: JSON.stringify(selectedUsers), value: this.state.range * 1000 };

    manageRangeChange(obj)
      .then((response) => {
        console.log({ response });
        this.setState({ showLoader: false }, () => {
          alert(response.message);
          this.gotoBack();
        });
      })
      .catch((error) => {
        this.setState({ showLoader: false });
        console.log(error);
      });
  };

  render = () => (
    <Container>
      <Header title={"Change Range"} />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          ref={this.scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.boxBorder}>
            <View style={[styles.fieldBox]}>
              <MultiSelectDropdown
                label={"Select Users"}
                isMandatory={true}
                items={this.state.users}
                selectedItems={this.state.selectedUsers}
                labelStyle={styles.labelName}
                placeHolderContainer={styles.placeHolderContainer}
                placeholderStyle={[styles.textfield]}
                selectedItemsContainer={[
                  styles.selectedItemsContainer,
                  { width: "60%" },
                ]}
                onSave={this.setUsers}
              />
            </View>
            <View style={[styles.fieldBox, { borderBottomWidth: 0 }]}>
              <Text style={styles.labelName}>Range: </Text>
              <TextInput
                value={this.state.dosage}
                onChangeText={(text) => this.setState({ range: text })}
                style={[styles.textfield, styles.width50 ,{textAlign: "center",}]}
                autoCompleteType="off"
                keyboardType="numeric"
                // placeholder="Enter Dosage"
              />
              <Text style={[styles.textfieldTime, { marginTop: 5 }]}>
                    KM
              </Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.button,{marginHorizontal: 80,}]} onPress={this.saveRange}>
            <Text style={styles.textWhite}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>

      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   body: {
//     flex: 9,
//     padding: 2,
//   },
//   fieldBox: {
//     alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     height: "auto",
//     justifyContent: "space-between",
//     marginBottom: 5,
//     marginTop: 5,
//     // shadowColor: "#999",
//     // shadowOffset: {
//     // 	width: 0,
//     // 	height: 1,
//     // },
//     // shadowOpacity: 0.22,
//     // shadowRadius: 2.22,
//     // elevation: 3,
//   },
//   labelName: {
//     color: Colors.labelColor,
//     // lineHeight: 40,
//     fontSize: 19,
//     paddingLeft: 4,
//     height: "auto",
//     paddingVertical: 10,
//   },
//   textfield: {
//     backgroundColor: "#fff",
//     height: "auto",

//     fontSize: 16,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//     width: "60%",
//   },
//   button: {
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     padding: 10,
//     marginHorizontal: 80,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.23,
//     shadowRadius: 2.62,
//     elevation: 4,
//     borderRadius: 20,
//     color: "#fff",
//     marginVertical: 10,
//     zIndex: 0,
//   },
//   textWhite: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   textInputIcon: {
//     position: "absolute",
//     bottom: 14,
//     right: 10,
//     marginLeft: 8,
//     color: "#0482ED",
//     zIndex: 99,
//   },
//   item: {
//     height: 35,
//     backgroundColor: "#00b386",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   itemtitle: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 18,
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
//   // multiSelectContainer: {
//   //     height: 'auto',
//   //     width: '100%',
//   //     borderRadius: 3,
//   //     borderColor: "#ddd",
//   //     borderWidth: 1,
//   //     backgroundColor: "#fff",
//   //     marginBottom: 5,
//   //     marginTop: 5,
//   //     shadowColor: "#999",
//   //     shadowOffset: {
//   //         width: 0,
//   //         height: 1,
//   //     },
//   //     shadowOpacity: 0.22,
//   //     shadowRadius: 2.22,
//   //     elevation: 3,
//   //     padding: 5,
//   // },
//   placeholderStyle: {
//     fontSize: 18,
//     color: Colors.textColor,
//     opacity: 0.8,
//   },
//   textfieldTime: {
//     justifyContent: "center",
//     height: 30,
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "center",
//   },
//   selectedItemsContainer: {
//     width: "60%",
//     height: "auto",
//     paddingVertical: 15,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//   },
//   placeHolderContainer: {
//     borderWidth: 0,
//   },
//   errorText: {
//     textAlign: "right",
//     color: Colors.tomato,
//     fontWeight: "bold",
//     fontStyle: "italic",
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//     marginVertical: 30,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   saveBtnText: {
//     color: Colors.primary,
//   },
//   exitBtnText: {
//     color: Colors.activeTab,
//   },
//   dropdownTextField: {
//     backgroundColor: "#fff",
//     height: "auto",

//     fontSize: 18,
//     color: Colors.textColor,
//     textAlign: "center",
//     padding: 5,
//     width: "50%",
//   },
// });
