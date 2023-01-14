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
import { Header, MultiSelectDropdown, OverlayLoader } from "../../component";
import InputDropdown from "../../component/InputDropdown";
import Colors from "../../config/colors";
import { getAnimalGroups } from "../../services/APIServices";
import {
  manageDesignation,
  getDepartments,
} from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddDesignation extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      deptName:
        typeof props.route.params !== "undefined"
          ? props.route.params.deptName
          : "",
      deptCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.deptCode
          : undefined,
      id: props.route.params.hasOwnProperty("id") ? props.route.params.id : 0,
      name: props.route.params.hasOwnProperty("name")
        ? props.route.params.name
        : "",
      selectedAnimalClass: [],
      animalGroups: [],
      showLoader: true,
      desgNameValidationFailed: false,
      selectedAnimalClassValidationFailed: false,
      departments: [],

      isDeptMenuOpen: false,
      selectedDepartmentValidationFailed: false,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;
    let selectedClassIDs = this.props.route.params.hasOwnProperty(
      "selectedAnimalClass"
    )
      ? this.props.route.params.selectedAnimalClass
      : [];

    Promise.all([getAnimalGroups(cid), getDepartments(cid)])
      .then((response) => {
        let data = response[0];
        let selectedClass = (selectedClassIDs || []).map((v, i) => {
          let index = (data || []).findIndex((element) => element.id === v);
          return {
            id: data[index].id,
            name: data[index].group_name,
          };
        });

        let department = response[1].map((item) => {
          return {
            id: item.id,
            name: item.dept_name,
            value: item.dept_code,
          };
        });

        this.setState({
          showLoader: false,
          selectedAnimalClass: selectedClass,
          departments: department,
          animalGroups: data.map((v, i) => ({
            id: v.id,
            name: v.group_name,
          })),
        });
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  setAnimalClassPermission = (item) =>
    this.setState({ selectedAnimalClass: item });

  toggleDeptMenu = () =>
    this.setState({ isDeptMenuOpen: !this.state.isDeptMenuOpen });

  setDeptData = (v) =>
    this.setState({
      deptCode: v.value,
      deptName: v.name,
      isDeptMenuOpen: false,
    });

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  saveData = () => {
    let { name, selectedAnimalClass, deptCode } = this.state;
    this.setState(
      {
        desgNameValidationFailed: false,
        selectedAnimalClassValidationFailed: false,
        selectedDepartmentValidationFailed: false,
      },
      () => {
        if (name.trim().length === 0) {
          this.setState({ desgNameValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        }
        // else if (selectedAnimalClass.length === 0) {
        //   this.setState({ selectedAnimalClassValidationFailed: true });
        //   return false;
        // }
        else if (typeof deptCode == "undefined") {
          this.setState({ selectedDepartmentValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let arr = selectedAnimalClass.map((v, i) => v.id);

          let reqObj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            dept_code: this.state.deptCode,
            desg_name: getCapitalizeTextWithoutExtraSpaces(name),
            // animal_class: arr.join(","),
            animal_class: "",
          };

          manageDesignation(reqObj)
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

  render = () => (
    <Container>
      <Header
        title={
          parseInt(this.state.id) > 0 ? "Edit Designation" : "Add Designation"
        }
      />
      <View style={[globalStyles.container, globalStyles.p5]}>
        <ScrollView
          ref={this.formScrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View style={globalStyles.boxBorder}>
            <View>
              <InputDropdown
                label={"Department:"}
                value={this.state.deptName}
                isOpen={this.state.isDeptMenuOpen}
                items={this.state.departments}
                openAction={this.toggleDeptMenu}
                closeAction={this.toggleDeptMenu}
                setValue={this.setDeptData}
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={globalStyles.fieldBox}
              />
              {this.state.selectedDepartmentValidationFailed ? (
                <Text style={globalStyles.errorText}>Choose Department</Text>
              ) : null}
            </View>
            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Name:</Text>
              <TextInput
                value={this.state.name}
                onChangeText={(name) => this.setState({ name })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.desgNameValidationFailed ? (
                <Text style={globalStyles.errorText}>Enter designation</Text>
              ) : null}
            </View>

            {/* <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <MultiSelectDropdown
                label={"Animal Class:"}
                items={this.state.animalGroups}
                selectedItems={this.state.selectedAnimalClass}
                labelStyle={globalStyles.labelName}
                placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                selectedItemsContainer={globalStyles.selectedItemsContainer}
                onSave={this.setAnimalClassPermission}
              />
              {this.state.selectedAnimalClassValidationFailed ? (
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
// 		// lineHeight: 40,
// 		fontSize: 19,
// 		paddingLeft: 4,
// 		height: 'auto',
// 		paddingVertical: 10
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 20,
// 	},
// 	inputContainer: {
// 		alignItems: 'center',
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderBottomWidth: 1,
// 		backgroundColor: "#fff",
// 		height: 'auto',
// 		justifyContent: "space-between",
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
// 		height: 'auto',
// 		flexWrap: 'wrap',
// 		fontSize: 19,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
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
