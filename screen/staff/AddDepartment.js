import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import { Header, MultiSelectDropdown, OverlayLoader } from "../../component";
import { manageDepartment } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddDepartment extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
      name:
        typeof props.route.params !== "undefined"
          ? props.route.params.name
          : "",
      selectedMenues:
        typeof props.route.params !== "undefined"
          ? props.route.params.selectedMenues
          : [],
      deptNameValidationFailed: false,
      selectedMenuesValidationFailed: false,
      showLoader: false,
      isOpen: false,
    };

    this.formScrollViewRef = React.createRef();
  }

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  setMenuPermission = (item) => this.setState({ selectedMenues: item });

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  saveData = () => {
    let { name, selectedMenues } = this.state;
    this.setState(
      {
        deptNameValidationFailed: false,
        selectedMenuesValidationFailed: false,
      },
      () => {
        if (name.trim().length === 0) {
          this.setState({ deptNameValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        }
        // else if (selectedMenues.length === 0) {
        //   this.setState({ selectedMenuesValidationFailed: true });
        //   return false;
        // }
        else {
          this.setState({ showLoader: true });
          let arr = selectedMenues.map((v, i) => v.id);

          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            dept_name: getCapitalizeTextWithoutExtraSpaces(name),
            // menu_permission: arr.join(","),
            menu_permission: "",
          };

          manageDepartment(obj)
            .then((response) => {
              this.setState(
                {
                  showLoader: false,
                },
                () => {
                  this.gotoBack();
                }
              );
            })
            .catch((error) => {
              this.setState({ showLoader: false });
              console.log(error);
            });
        }
      }
    );
  };

  dropDownToggler = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render = () => (
    <Container>
      <Header
        title={
          parseInt(this.state.id) > 0 ? "Edit Department" : "Add Department"
        }
      />
      <View style={[globalStyles.container, globalStyles.p5]}>
        <ScrollView
          ref={this.formScrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>Department Name:</Text>
              <TextInput
                value={this.state.name}
                onChangeText={(name) => this.setState({ name })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.deptNameValidationFailed ? (
                <Text style={globalStyles.errorText}>
                  Enter department name
                </Text>
              ) : null}
            </View>

            {/* <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <MultiSelectDropdown
                label={"Menu Permission"}
                items={Configs.HOME_SCREEN_MENUES}
                selectedItems={this.state.selectedMenues}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setMenuPermission}
              />
              {this.state.selectedMenuesValidationFailed ? (
                <Text style={globalStyles.errorText}>Select an option</Text>
              ) : null}
            </View> */}
          </View>
          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              // style={globalStyles.button}
              onPress={this.saveData}
            >
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                SAVE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              // style={globalStyles.button}
              onPress={this.gotoBack}
            >
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>
                EXIT
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		padding: 8,
// 	},
// 	name: {
// 		color: Colors.labelColor,
//         // lineHeight: 40,
//         fontSize: 19,
//         paddingLeft: 4,
//         height: 'auto',
//         paddingVertical: 10
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 20,
// 	},
// 	inputContainer: {
// 		alignItems: 'center',
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderBottomWidth: 1,
//         backgroundColor: "#fff",
//         height: 'auto',
//         justifyContent: "space-between",
// 	},
// 	selectedItemsContainer: {
// 		width: "100%",
// 		height: "auto",
// 		backgroundColor: "#fff",
// 		paddingVertical: 8,
// 		flexDirection: "row",
// 		flexWrap: "wrap",
// 		alignItems: "flex-start",
// 	},
// 	placeholderStyle: {
// 		fontSize: 18,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	inputText: {
// 		backgroundColor: "#fff",
//         height: 'auto',
//         flexWrap:'wrap',
//         fontSize: 19,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
// 	},
// 	pb0: {
// 		paddingBottom: 0,
// 	},
// 	mb0: {
// 		marginBottom: 0,
// 	},
// 	button: {
// 		padding: 5,
// 	},
// 	buttonText: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 	},
// 	saveBtnText: {
// 		color: Colors.primary,
// 	},
// 	exitBtnText: {
// 		color: Colors.activeTab,
// 	},
// 	errorText: {
// 		textAlign: "right",
// 		color: Colors.tomato,
// 		fontWeight: "bold",
// 		fontStyle: "italic",
// 	},
// });
