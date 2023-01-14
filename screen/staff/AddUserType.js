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
import Colors from "../../config/colors";
import {
  getAnimalGroups,
  getAllCategory,
  getAllSubCategory,
  getCommonNames,
} from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddUserType extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      animalCategories: [],
      animalSubCategories: [],
      id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
      name:
        typeof props.route.params !== "undefined"
          ? props.route.params.name
          : undefined,
      selectedAnimalCategories:
        typeof props.route.params !== "undefined"
          ? props.route.params.selectedAnimalCategories
          : [],
      selectedAnimalSubCategories:
        typeof props.route.params !== "undefined"
          ? props.route.params.selectedAnimalSubCategories
          : [],
      showLoader: true,
    };
  }

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;
    Promise.all([getAllCategory(cid), getAllSubCategory(cid)])
      .then((response) => {
        this.setState({
          showLoader: false,
          animalCategories: response[0].map((v, i) => ({
            id: v.id,
            name: getCapitalizeTextWithoutExtraSpaces(v.cat_name),
          })),
          animalSubCategories: response[1].map((v, i) => ({
            id: v.id,
            name: getCapitalizeTextWithoutExtraSpaces(v.cat_name),
          })),
        });
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  setAnimalCategoryPermission = (item) =>
    this.setState({ selectedAnimalCategories: item });

  setAnimalSubCategoryPermission = (item) =>
    this.setState({ selectedAnimalSubCategories: item });

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        title={parseInt(this.state.id) > 0 ? "Edit User Type" : "Add User Type"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={styles.container}>
        <ScrollView ref={this.formScrollViewRef}>
          <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
            <Text style={styles.name}>User Type:</Text>
            <TextInput
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
              style={styles.inputText}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <MultiSelectDropdown
              label={"Animal Category"}
              items={this.state.animalCategories}
              selectedItems={this.state.selectedAnimalCategories}
              labelStyle={styles.name}
              placeHolderContainer={styles.inputText}
              placeholderStyle={styles.placeholderStyle}
              selectedItemsContainer={styles.selectedItemsContainer}
              onSave={this.setAnimalCategoryPermission}
            />
          </View>

          <View style={styles.inputContainer}>
            <MultiSelectDropdown
              label={"Animal Sub Category"}
              items={this.state.animalSubCategories}
              selectedItems={this.state.selectedAnimalSubCategories}
              labelStyle={styles.name}
              placeHolderContainer={styles.inputText}
              placeholderStyle={styles.placeholderStyle}
              selectedItemsContainer={styles.selectedItemsContainer}
              onSave={this.setAnimalSubCategoryPermission}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={this.gotoBack}
            >
              <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={this.gotoBack}
            >
              <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
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
// 	},
// 	name: {
// 		fontSize: 18,
// 		color: Colors.textColor,
// 		marginBottom: 10,
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 30,
// 	},
// 	inputContainer: {
// 		marginVertical: 10,
// 		padding: 10,
// 	},
// 	selectedItemsContainer: {
// 		width: "100%",
// 		height: "auto",
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		backgroundColor: "#f9f6f6",
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
// 		height: 50,
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		fontSize: 18,
// 		backgroundColor: "#f9f6f6",
// 		paddingHorizontal: 10,
// 		color: Colors.textColor,
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
