import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import { Container } from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Dropdown, OverlayLoader } from "../../component";
import {
  getCapitalizeTextWithoutExtraSpaces,
  isNumber,
} from "../../utils/Util";
import {
  getItemTypes,
  getProducts,
  getRecipeDetails,
  manageRecipe,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class AddRecipe extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
      recipeCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.recipeCode
          : undefined,
      recipeName:
        typeof props.route.params !== "undefined"
          ? props.route.params.recipeName
          : "",
      recipeItems: [],
      isAddItemModalOpen: false,
      itemType: undefined,
      selectedItemID: undefined,
      selectedItemName: undefined,
      selectedItemUnit: undefined,
      quantity: "",
      itemTypes: [],
      items: [],
      recipeNameValidationFailed: false,
      recipeItemValidationFailed: false,
      itemTypeValidationFailed: false,
      itemNameValidationFailed: false,
      quantityValidationFailed: false,
      showLoader: true,
    };
  }

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;
    let { recipeCode } = this.state;
    let methods = [getItemTypes(cid)];

    if (typeof recipeCode !== "undefined") {
      methods.push(getRecipeDetails(recipeCode));
    }

    Promise.all(methods)
      .then((response) => {
        let stateObj = {
          showLoader: false,
          itemTypes: response[0].map((v, i) => ({
            id: v.id,
            name: v.type,
          })),
        };

        if (typeof recipeCode !== "undefined") {
          let data = response[1];
          stateObj.recipeName = data.name;
          stateObj.recipeItems = data.items;
        }

        this.setState(stateObj);
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  setItemType = (v) => {
    this.setState(
      {
        itemType: v.name,
        showLoader: true,
        itemTypeValidationFailed: false,
      },
      () => {
        let reqObj = {
          cid: this.context.userDetails.cid,
          type: v.name,
        };

        getProducts(reqObj)
          .then((data) => {
            this.setState({
              showLoader: false,
              items: data.map((v, i) => ({
                id: v.product_code,
                name: v.name,
                unit: v.unit,
              })),
            });
          })
          .catch((error) => {
            this.setState({ showLoader: false });
            console.log(error);
          });
      }
    );
  };

  setItemData = (v) => {
    this.setState({
      selectedItemID: v.id,
      selectedItemName: v.name,
      selectedItemUnit: v.unit,
      itemNameValidationFailed: false,
    });
  };

  openAddItemModal = () =>
    this.setState({
      items: [],
      itemType: undefined,
      selectedItemID: undefined,
      selectedItemName: undefined,
      selectedItemUnit: undefined,
      quantity: "",
      recipeItemValidationFailed: false,
      isAddItemModalOpen: true,
    });

  closeAddItemModal = () =>
    this.setState({
      items: [],
      itemType: undefined,
      selectedItemID: undefined,
      selectedItemName: undefined,
      selectedItemUnit: undefined,
      quantity: "",
      recipeItemValidationFailed: false,
      isAddItemModalOpen: false,
    });

  addItem = () => {
    this.setState(
      {
        itemTypeValidationFailed: false,
        itemNameValidationFailed: false,
        quantityValidationFailed: false,
      },
      () => {
        let {
          itemType,
          selectedItemName,
          quantity,
          recipeItems,
          selectedItemID,
        } = this.state;

        if (typeof itemType === "undefined") {
          this.setState({ itemTypeValidationFailed: true });
          return false;
        } else if (typeof selectedItemName === "undefined") {
          this.setState({ itemNameValidationFailed: true });
          return false;
        } else if (
          !isNumber(quantity) ||
          (isNumber(quantity) && parseFloat(quantity) <= 0)
        ) {
          this.setState({ quantityValidationFailed: true });
          return false;
        } else {
          let index = recipeItems.findIndex(
            (element) => element.id === selectedItemID
          );

          if (index > -1) {
            Alert.alert("Already Added!");
          } else {
            if (typeof selectedItemID !== "undefined") {
              recipeItems.push({
                id: new Date().getTime(),
                product_code: selectedItemID,
                product_name: this.state.selectedItemName,
                unit: this.state.selectedItemUnit,
                quantity: parseFloat(this.state.quantity).toFixed(1),
              });
            }

            this.setState({
              items: [],
              recipeItems: recipeItems,
              isAddItemModalOpen: false,
            });
          }
        }
      }
    );
  };

  removeItem = (id) => {
    let { recipeItems } = this.state;
    let arr = recipeItems.filter((element) => element.id !== id);
    this.setState({ recipeItems: arr });
  };

  saveData = () => {
    this.setState(
      {
        recipeNameValidationFailed: false,
        recipeItemValidationFailed: false,
      },
      () => {
        let { recipeCode, recipeName, recipeItems } = this.state;
        if (recipeName.trim().length === 0) {
          this.setState({ recipeNameValidationFailed: true });
          return false;
        } else if (recipeItems.length === 0) {
          this.setState({ recipeItemValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let cid = this.context.userDetails.cid;
          let arr = recipeItems.map((v, i) => ({
            cid: cid,
            product_code: v.product_code,
            unit: v.unit,
            quantity: v.quantity,
          }));

          let reqObj = {
            id: this.state.id,
            cid: cid,
            name: getCapitalizeTextWithoutExtraSpaces(recipeName),
            items: JSON.stringify(arr),
          };

          if (typeof recipeCode !== "undefined") {
            reqObj.recipe_code = recipeCode;
          }

          manageRecipe(reqObj)
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

  renderItem = (item) => (
    <View key={item.id.toString()} style={styles.itemRow}>
      <View style={[globalStyle.flex1,globalStyle.justifyContentCenter]}>
        <Text style={styles.rowTitleText}>{item.product_name}</Text>
      </View>
      <View style={[globalStyle.flex05,globalStyle.justifyContentCenter]}>
        <Text style={styles.rowSubText}>{item.quantity + " " + item.unit}</Text>
      </View>
      <View style={[globalStyle.flex05,globalStyle.alignItemsFlexEnd]}>
        <TouchableOpacity
          activeOpacity={1}
          style={globalStyle.p3}
          onPress={this.removeItem.bind(this, item.id)}
        >
          <Ionicons name="close-circle" size={18} color={Colors.tomato} />
        </TouchableOpacity>
      </View>
    </View>
  );

  render = () => (
    <Container>
      <Header
        title={
          parseInt(this.state.id) > 0 ? "Edit Recipe" : "Create New Recipe"
        }
      />
      <View style={styles.container}>
        <View
          style={[
            styles.fieldBox,
            this.state.recipeNameValidationFailed ? styles.errorFieldBox : null,
          ]}
        >
          <Text style={styles.labelName}>Recipe Name:</Text>
          <TextInput
            value={this.state.recipeName}
            onChangeText={(recipeName) => this.setState({ recipeName })}
            style={styles.textfield}
            autoCompleteType="off"
            autoCapitalize="words"
            placeholder="Enter Recipe Name"
          />
        </View>

        <View
          style={[
            styles.addItemRow,
            this.state.recipeItemValidationFailed ? styles.errorFieldBox : null,
          ]}
        >
          <Text style={styles.labelName}>Recipe Items:</Text>
          <TouchableOpacity
            onPress={this.openAddItemModal}
            style={[styles.capsule, { backgroundColor: Colors.mediumGrey }]}
          >
            <FontAwesome
              name="plus"
              size={10}
              color={Colors.white}
              style={[globalStyle.marginRight3,globalStyle.marginTop2]}
            />
            <Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
              Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {this.state.recipeItems.length > 0 ? (
          <View style={styles.itemsContainer}>
            {this.state.recipeItems.map((item) => this.renderItem(item))}
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={this.saveData}>
          <Text style={styles.textWhite}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isAddItemModalOpen}
        onRequestClose={this.closeAddItemModal}
      >
        <SafeAreaView style={[globalStyle.safeAreaViewStyle]}>
          <View style={styles.modalOverlay}>
            <View style={styles.itemModalContainer}>
              <View style={styles.itemModalHeader}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.headerBackBtnContainer}
                  onPress={this.closeAddItemModal}
                >
                  <Ionicons name="arrow-back" size={25} color={Colors.white} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                  <Text
                    style={{ fontSize: Colors.textSize, color: Colors.white }}
                  >
                    Add Item
                  </Text>
                </View>
              </View>

              <View style={styles.itemModalBody}>
                <Dropdown
                  label={"Item Type:"}
                  value={this.state.itemType}
                  items={this.state.itemTypes}
                  onChange={this.setItemType}
                  labelStyle={styles.labelName}
                  textFieldStyle={styles.textfield}
                  style={[
                    styles.fieldBox,
                    this.state.itemTypeValidationFailed
                      ? styles.errorFieldBox
                      : null,
                  ]}
                />

                <Dropdown
                  label={"Item Name:"}
                  value={this.state.selectedItemName}
                  items={this.state.items}
                  onChange={this.setItemData}
                  labelStyle={styles.labelName}
                  textFieldStyle={styles.textfield}
                  style={[
                    styles.fieldBox,
                    this.state.itemNameValidationFailed
                      ? styles.errorFieldBox
                      : null,
                  ]}
                />

                <View style={styles.fieldBox}>
                  <Text style={styles.labelName}>Unit:</Text>
                  <TextInput
                    editable={false}
                    value={this.state.selectedItemUnit}
                    style={styles.textfield}
                  />
                </View>

                <View
                  style={[
                    styles.fieldBox,
                    this.state.quantityValidationFailed
                      ? styles.errorFieldBox
                      : null,
                  ]}
                >
                  <Text style={styles.labelName}>Quantity:</Text>
                  <TextInput
                    value={this.state.quantity}
                    onChangeText={(quantity) => this.setState({ quantity })}
                    style={styles.textfield}
                    autoCompleteType="off"
                    keyboardType="number-pad"
                    placeholder="Enter Quantity"
                  />
                </View>

                <TouchableOpacity style={styles.button} onPress={this.addItem}>
                  <Text style={styles.textWhite}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 8,
//   },
//   fieldBox: {
//     alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderBottomWidth: 1,
//     backgroundColor: "#fff",
//     height: "auto",
//     justifyContent: "space-between",
//   },
//   labelName: {
//     color: Colors.labelColor,
//     // lineHeight: 40,
//     fontSize: Colors.lableSize,
//     paddingLeft: 4,
//     height: "auto",
//     paddingVertical: 10,
//   },
//   imagePicker: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     padding: 3,
//     backgroundColor: "#fff",
//     borderRadius: 3,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   textfield: {
//     backgroundColor: "#fff",
//     height: "auto",
//     width: "60%",
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   addItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginVertical: 5,
//     paddingHorizontal: 5,
//   },
//   capsule: {
//     height: 25,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingBottom: 2,
//     borderRadius: 50,
//   },
//   itemsContainer: {
//     marginTop: 5,
//     marginBottom: 10,
//     paddingHorizontal: 5,
//     borderRadius: 3,
//   },
//   itemRow: {
//     flexDirection: "row",
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   rowTitleText: {
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     fontWeight: "bold",
//   },
//   rowSubText: {
//     color: Colors.textColor,
//     opacity: 0.8,
//     fontSize: Colors.textSize,
//   },
//   button: {
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     padding: 10,
//     // shadowColor: "#000",
//     // shadowOffset: {
//     // 	width: 0,
//     // 	height: 2,
//     // },
//     // shadowOpacity: 0.23,
//     // shadowRadius: 2.62,
//     // elevation: 4,
//     borderRadius: 20,
//     color: "#fff",
//     marginVertical: 10,
//   },
//   textWhite: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   modalOverlay: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: windowWidth,
//     height: windowHeight,
//   },
//   itemModalContainer: {
//     flex: 1,
//     width: windowWidth,
//     height: windowHeight,
//     backgroundColor: Colors.lightGrey,
//   },
//   itemModalHeader: {
//     height: 55,
//     flexDirection: "row",
//     width: "100%",
//     backgroundColor: Colors.primary,
//     elevation: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//   },
//   headerBackBtnContainer: {
//     width: "15%",
//     height: 55,
//     paddingLeft: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerTitleContainer: {
//     width: "70%",
//     paddingLeft: 20,
//     height: 55,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   itemModalBody: {
//     flex: 1,
//     height: windowHeight - 55,
//     padding: 8,
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
// });
