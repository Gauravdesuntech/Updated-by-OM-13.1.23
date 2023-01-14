import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { Container } from "native-base";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import {
  Header,
  DatePicker,
  Dropdown,
  OverlayLoader,
  MessageDialog,
} from "../../component";
import { isNumber, getFormattedDate } from "../../utils/Util";
import { getDepartments } from "../../services/UserManagementServices";
import {
  getProducts,
  getStoreNames,
  getTotalAvailableStock,
  addConsumption,
  getItemTypes,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class AddConsumption extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      products: [],
      storeNames: [],
      availabeStocks: [],
      deptCode: undefined,
      deptName: undefined,
      date: new Date(),
      itemCode: undefined,
      itemName: "",
      itemUnit: "",
      storeNameID: undefined,
      storeName: undefined,
      itemAvailableStock: "",
      stockID: undefined,
      batchNo: "",
      batchNoLabel: "",
      quantity: "",
      addedItems: [],
      isDatepickerOpen: false,
      departmentValidationFailed: false,
      itemNameValidationFailed: false,
      storeNameValidationFailed: false,
      batchNoValidationFailed: false,
      quantityValidationFailed: false,
      isAddItemModalOpen: false,
      showLoader: true,
      itemTypes: [],
      unitsChange: false,
      itemTypeName: undefined,
      currentProducts: [],
      status:
        typeof props.route.params === "undefined"
          ? "P"
          : props.route.params.status,
    };

    this.formScrollViewRef = React.createRef();
    this.messageDialogRef = React.createRef();
  }

  componentDidMount = () => {
    this.loadData();
  };

  loadData = () => {
    let cid = this.context.userDetails.cid;

    Promise.all([
      getStoreNames(cid),
      getProducts({ cid }),
      getDepartments(cid),
      getItemTypes(cid),
    ])
      .then((response) => {
        this.setState({
          showLoader: false,
          storeNames: response[0],
          products: (response[1] || []).map((v, i) => ({
            id: v.product_code,
            name: v.name,
            unit: v.unit,
            total_stock: v.total_stock,
          })),
          departments: (response[2] || []).map((v, i) => ({
            id: v.id,
            name: v.dept_name,
            dept_code: v.dept_code,
          })),
          itemTypes: (response[3] || []).map((v, i) => ({
            id: v.id,
            name: v.type,
          })),
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ showLoader: false });
      });
  };

  // showDatepicker = () => this.setState({ isDatepickerOpen: true });

  setDepartment = (v) => {
    this.setState({
      deptCode: v.dept_code,
      deptName: v.name,
    });
  };

  // onChangeDate = (event, selectedDate) => {
  // 	let currentDate = selectedDate || this.state.date;
  // 	this.setState({
  // 		isDatepickerOpen: false,
  // 		date: currentDate,
  // 	});
  // };

  showDatePicker = () => {
    this.setState({ isDatepickerOpen: true });
  };

  handleConfirm = (selectDate) => {
    let currentDate = selectDate || this.state.date;
    this.setState({
      isDatepickerOpen: false,
      date: currentDate,
    });
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({ show: false });
  };

  openAddItemModal = () =>
    this.setState({
      itemCode: undefined,
      itemName: "",
      itemUnit: "",
      storeNameID: undefined,
      storeName: undefined,
      itemAvailableStock: "",
      stockID: undefined,
      batchNo: "",
      batchNoLabel: "",
      quantity: "",
      isAddItemModalOpen: true,
    });

  closeAddItemModal = () =>
    this.setState({
      isAddItemModalOpen: false,
      unitsChange: false,
    });

  setItemData = (item) => {
    this.setState({
      itemCode: item.id,
      itemName: item.name,
      itemUnit: item.unit,
      itemAvailableStock: item.total_stock,
      storeNameID: undefined,
      storeName: undefined,
    });
  };

  setItemTypeData = (item) => {
    this.setState(
      {
        itemTypeName: item.name,
        itemTypeId: item.id,
      },
      () => {
        this.getProductsData(this.state.itemTypeName);
      }
    );
  };

  getProductsData = (itemTypeName) => {
    let cid = this.context.userDetails.cid;
    getProducts({ cid: cid, type: itemTypeName })
      .then((response) => {
        console.log("Response==?>", response);
        this.setState({
          showLoader: false,
          products: (response || []).map((v, i) => ({
            id: v.product_code,
            name: v.name,
            unit: v.unit,
            total_stock: v.total_stock,
          })),
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ showLoader: false });
      });
  };

  setAvailableQuantity = (v) => {
    let { itemCode } = this.state;
    if (typeof itemCode !== "undefined") {
      this.setState(
        {
          storeNameID: v.id,
          storeName: v.name,
          quantity: "",
          batchNo: "",
        },
        () => {
          this.setState({ showLoader: true });
          getTotalAvailableStock(itemCode, v.id)
            .then((data) => {
              this.setState({
                showLoader: false,
                itemAvailableStock: parseFloat(data.total_stock),
              });
            })
            .catch((error) => console.log(error));
        }
      );
    } else {
      Alert.alert("Warning", "Please select an item name");
    }
  };

  addItem = () => {
    this.setState(
      {
        itemNameValidationFailed: false,
        batchNoValidationFailed: false,
        quantityValidationFailed: false,
      },
      () => {
        let {
          itemCode,
          storeNameID,
          itemAvailableStock,
          quantity,
          addedItems,
        } = this.state;
        storeNameID = 0;
        if (typeof itemCode === "undefined") {
          this.setState({ itemNameValidationFailed: true });
          return false;
        } else if (typeof storeNameID === "undefined") {
          this.setState({ storeNameValidationFailed: true });
          return false;
        } else if (
          !isNumber(quantity) ||
          (isNumber(quantity) && parseFloat(quantity) <= 0)
        ) {
          this.setState({ quantityValidationFailed: true });
          return false;
        } else if (parseFloat(quantity) > parseFloat(itemAvailableStock)) {
          Alert.alert("Warning", "Insufficient quantity");
        } else {
          let obj = {
            id: itemCode,
            name: this.state.itemName,
            unit: this.state.itemUnit,
            store_id: 0,
            batch_no: 0,
            quantity: parseFloat(quantity).toFixed(1),
          };

          let index = addedItems.findIndex(
            (element) =>
              element.id === itemCode && element.store_id === storeNameID
          );

          if (index > -1) {
            addedItems[index] = obj;
          } else {
            addedItems.push(obj);
          }

          this.setState({
            addedItems: addedItems,
            isAddItemModalOpen: false,
          });
        }
      }
    );
  };

  deleteItem = (id) => {
    let { addedItems } = this.state;
    let arr = addedItems.filter((element) => element.id !== id);
    this.setState({ addedItems: arr });
  };

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  saveData = () => {
    this.setState(
      {
        departmentValidationFailed: false,
      },
      () => {
        let { deptCode, addedItems } = this.state;

        if (typeof deptCode === "undefined") {
          this.setState({ departmentValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (addedItems.length === 0) {
          this.messageDialogRef.current.openDialog(
            "Warning",
            "Please add atleast one item"
          );
        } else {
          this.setState({ showLoader: true });
          let cid = this.context.userDetails.cid;
          let uid = this.context.userDetails.user_code;
          let referenceNo = "Staff" + "/" + deptCode;

          let itemsArr = addedItems.map((v, i) => ({
            product_code: v.id,
            store_id: v.store_id,
            unit: v.unit,
            batch_no: v.batch_no,
            quantity: v.quantity,
            status: this.state.status,
          }));

          let reqObj = {
            cid: cid,
            uid: uid,
            reference_no: referenceNo,
            consumption_date: getFormattedDate(this.state.date),
            status: this.state.status,
            items: JSON.stringify(itemsArr),
          };

          addConsumption(reqObj)
            .then((response) => {
              if (response.check === Configs.SUCCESS_TYPE) {
                this.setState(
                  {
                    addedItems: [],
                    deptCode: undefined,
                    deptName: undefined,
                    showLoader: false,
                  },
                  () => {
                    this.messageDialogRef.current.openDialog(
                      response.check.toString().toUpperCase(),
                      response.message
                    );
                  }
                );
              } else {
                this.messageDialogRef.current.openDialog(
                  response.check.toString().toUpperCase(),
                  response.message
                );
              }
            })
            .catch((error) => {
              console.log(error);
              this.setState({ showLoader: false });
            });
        }
      }
    );
  };

  renderItem = (item, index) => (
    <View
      key={item.id}
      style={[
        styles.itemRow,
        index === 0 ? { borderTopWidth: 1, borderTopColor: "#eee" } : null,
      ]}
    >
      <View style={globalStyle.width90}>
        <Text style={styles.rowTitleText}>
        {item.name}
        </Text>
        <Text style={styles.rowSubText}>
          {"Quantity: " + item.quantity + " " + item.unit}
        </Text>
      </View>
      <View style={styles.itemRemoveContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.deleteItem.bind(this, item.id)}
        >
          <Ionicons name="close-circle" size={20} color={Colors.tomato} />
        </TouchableOpacity>
      </View>
    </View>
  );

  render = () => (
    <Container>
      <Header title={"Request Requisition"} />
      <View style={styles.container}>
        <ScrollView
          ref={this.formScrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 3 }}
          >
            <Dropdown
              isMandatory={true}
              label={"Department:"}
              // placeholder="Select Department Name"
              value={this.state.deptName}
              items={this.state.departments}
              onChange={this.setDepartment}
              labelStyle={styles.labelName}
              textFieldStyle={[styles.textfield, globalStyle.width50]}
              style={[
                styles.fieldBox,
                this.state.departmentValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            />

            <Dropdown
              label={"Item Type:"}
              // placeholder="Select Type"
              value={this.state.itemTypeName}
              items={this.state.itemTypes}
              onChange={this.setItemTypeData}
              labelStyle={styles.labelName}
              textFieldStyle={[styles.textfield, globalStyle.width50]}
              style={[
                styles.fieldBox,
                this.state.itemNameValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            />

            {/* <DatePicker
						onPress={this.showDatepicker}
						show={this.state.isDatepickerOpen}
						onChange={this.onChangeDate}
						date={this.state.date}
						mode={"date"}
						label={"Date:"}
					/> */}

            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Date:</Text>
              <TouchableOpacity
                activeOpacity={1}
                style=
                {[ globalStyle.flexDirectionRow,globalStyle.alignItemsCenter,
                  globalStyle.width50]}
                onPress={() => {
                  this.showDatePicker();
                }}
              >
                <Text style={[styles.textfield]}>
                  {this.state.date.toDateString()}
                </Text>
                <AntDesign name="calendar" color={Colors.primary} size={20} />
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              mode={"date"}
              display={Platform.OS == "ios" ? "inline" : "default"}
              isVisible={this.state.isDatepickerOpen}
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
            <View style={styles.addItemRow}>
              <Text style={styles.labelName}>ITEMS:</Text>
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

            {this.state.addedItems.length > 0 ? (
              <View style={styles.itemsContainer}>
                {this.state.addedItems.map((item, index) =>
                  this.renderItem(item, index)
                )}
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button}
            onPress={this.saveData}
          >
            <Text style={styles.textWhite}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isAddItemModalOpen}
        onRequestClose={this.closeAddItemModal}
      >
        <SafeAreaView style={[ globalStyle.no_bg_color,globalStyle.flex1]}>
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
                  <Text style={{ fontSize: Colors.textSize, color: Colors.white }}>
                    Add Item
                  </Text>
                </View>
              </View>

              <View style={styles.itemModalBody}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 3,
                  }}
                >
                  <Dropdown
                    label={"Item:"}
                    value={this.state.itemName}
                    items={this.state.products}
                    onChange={this.setItemData}
                    labelStyle={styles.labelName}
                    textFieldStyle={[styles.textfield, globalStyle.width50]}
                    style={[
                      styles.fieldBox,
                      this.state.itemNameValidationFailed
                        ? styles.errorFieldBox
                        : null,
                    ]}
                  />

                  <Dropdown
                    label={"Store Name:"}
                    // placeholder="Select Store Name"
                    value={this.state.storeName}
                    items={this.state.storeNames}
                    onChange={this.setAvailableQuantity}
                    labelStyle={styles.labelName}
                    textFieldStyle={[styles.textfield, globalStyle.width50]}
                    style={[
                      styles.fieldBox,
                      this.state.storeNameValidationFailed
                        ? styles.errorFieldBox
                        : null,
                    ]}
                  />

                  {/* <View style={styles.fieldBox}>
								<Text style={styles.labelName}>Batch No.</Text>
								<TextInput
									value={this.state.batchNo}
									onChangeText={(batchNo) => this.setState({ batchNo })}
									style={styles.textfield}
									autoCompleteType="off"
									autoCapitalize="none"
									// placeholder="Enter Batch No."
								/>
							</View> */}

                  <View style={styles.fieldBox}>
                    <Text style={styles.labelName}>Available Quantity:</Text>
                    <TextInput
                      editable={false}
                      style={[styles.textfield,globalStyle.width50]}
                      value={
                        this.state.itemAvailableStock +
                        " " +
                        this.state.itemUnit
                      }
                    />
                  </View>

                  {/* <View style={styles.fieldBox}>
								<Text style={styles.labelName}>Unit :</Text>
								<TextInput
									editable={false}
									style={styles.textfield}
									value={ this.state.itemUnit }
								/>
							</View> */}

                  <View
                    style={[
                      styles.fieldBox,globalStyle.bbw0,
                      this.state.quantityValidationFailed
                        ? styles.errorFieldBox
                        : null,
                    ]}
                  >
                    <Text style={styles.labelName}>Quantity:</Text>
                    <TextInput
                      value={this.state.quantity}
                      onChangeText={(quantity) => this.setState({ quantity })}
                      style={[styles.textfield, globalStyle.width50]}
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      // placeholder="Enter Quantity"
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.addItem}>
                  <Text style={styles.textWhite}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <MessageDialog ref={this.messageDialogRef} />
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const windowWidth = Dimensions.get("screen").width;
// const windowHeight = Dimensions.get("screen").height;
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
//   textfield: {
//     backgroundColor: "#fff",
//     height: "auto",

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
//     marginVertical: 5,
//     paddingHorizontal: 5,
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   itemRemoveContainer: {
//     width: "10%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   rowTitleText: {
//     fontSize: Colors.headerSize,
//     color: Colors.textColor,
//     fontWeight: "bold",
//     lineHeight: 24,
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
//   checkBoxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 5,
//   },
//   checkBoxLabel: {
//     marginLeft: 5,
//     fontSize: Colors.lableSize,
//     color: Colors.textColor,
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
// });
