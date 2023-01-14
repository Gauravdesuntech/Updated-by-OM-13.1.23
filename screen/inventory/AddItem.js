import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import {
  Header,
  DatePicker,
  Dropdown,
  RadioButton,
  OverlayLoader,
} from "../../component";
import {
  getItemTypes,
  getStoreNames,
  manageProduct,
} from "../../services/InventoryManagmentServices";
import {
  getFileData,
  isNumber,
  getFormattedDate,
  getCapitalizeTextWithoutExtraSpaces,
} from "../../utils/Util";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class AddInventoryItem extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      storeNames: [],
      imageURI: undefined,
      imageData: undefined,
      itemName: "",
      itemType: undefined,
      storeNameID: undefined,
      storeName: undefined,
      unitID: undefined,
      unitName: undefined,
      purchasePrice: "",
      salesPrice: "",
      hsnCode: "",
      gst: "",
      reorederLevel: "",
      priorityID: undefined,
      priorityName: undefined,
      isExpiryDateMandatory: true,
      hasOpeningStock: false,
      openingStock: undefined,
      batchNo: "",
      date: new Date(),
      isDatepickerOpen: false,
      itemNameValidationFailed: false,
      itemTypeValidationFailed: false,
      storeNameValidationFailed: false,
      unitValidationFailed: false,
      gstValidationFailed: false,
      purchasePriceValidationFailed: false,
      salesPriceValidationFailed: false,
      reorderLevelValidationFailed: false,
      priorityValidationFailed: false,
      openingStockValidationFailed: false,
      expiryDateValidationFailed: false,
      showLoader: true,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;
    Promise.all([getItemTypes(cid), getStoreNames(cid)])
      .then((response) => {
        this.setState({
          showLoader: false,
          categories: (response[0] || []).map((v, i) => ({
            id: v.id,
            name: v.type,
          })),
          storeNames: response[1],
        });
      })
      .catch((error) => console.log(error));
  };

  toggleExpiryDateMandatory = () =>
    this.setState({ isExpiryDateMandatory: !this.state.isExpiryDateMandatory });

  toggleOpeningStock = () =>
    this.setState({ hasOpeningStock: !this.state.hasOpeningStock });

  setItemType = (v) => {
    this.setState({
      itemType: v.name,
    });
  };

  setStoreName = (v) => {
    this.setState({
      storeNameID: v.id,
      storeName: v.name,
    });
  };

  setUnit = (v) => {
    this.setState({
      unitID: v.value,
      unitName: v.name,
    });
  };

  setPriority = (v) => {
    this.setState({
      priorityID: v.id,
      priorityName: v.name,
    });
  };

  showDatePicker = () => {
    this.setState({ isDatepickerOpen: true });
  };

  handleConfirm = (selectDate) => {
    console.log(selectDate);
    let currentDate = selectDate || this.state.date;
    this.setState({
      isDatepickerOpen: false,
      date: currentDate,
    });
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({ isDatepickerOpen: false });
  };

  chooseIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        this.setState({
          imageURI: undefined,
          imageData: undefined,
        });

        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              imageURI: result.uri,
              imageData: getFileData(result),
            });
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an icon");
      }
    });
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  addItem = () => {
    this.setState(
      {
        itemNameValidationFailed: false,
        itemTypeValidationFailed: false,
        storeNameValidationFailed: false,
        unitValidationFailed: false,
        gstValidationFailed: false,
        purchasePriceValidationFailed: false,
        salesPriceValidationFailed: false,
        reorderLevelValidationFailed: false,
        priorityValidationFailed: false,
        openingStockValidationFailed: false,
        expiryDateValidationFailed: false,
      },
      () => {
        let {
          itemName,
          itemType,
          storeNameID,
          unitID,
          gst,
          purchasePrice,
          salesPrice,
          reorederLevel,
          priorityID,
          hasOpeningStock,
          openingStock,
          isExpiryDateMandatory,
          date,
        } = this.state;

        if (itemName.trim().length === 0) {
          this.setState({ itemNameValidationFailed: true });
          alert("Fill All Field...");
          return false;
        } else if (typeof itemType === "undefined") {
          this.setState({ itemTypeValidationFailed: true });
          alert("Fill All Field...");

          return false;
        } else if (typeof unitID === "undefined") {
          this.setState({ unitValidationFailed: true });
          alert("Fill All Field...");

          return false;
        } else if (gst.trim().length > 0 && !isNumber(gst)) {
          this.setState({ gstValidationFailed: true });
          alert("Fill All Field...");

          return false;
        } else if (isNumber(gst) && parseFloat(gst) <= 0) {
          this.setState({ gstValidationFailed: true });
          alert("Fill All Field...");

          return false;
        } else if (
          !isNumber(purchasePrice) ||
          (isNumber(purchasePrice) && parseFloat(purchasePrice) <= 0)
        ) {
          this.setState({ purchasePriceValidationFailed: true });
          alert("Fill All Field...");
          return false;
        } else if (typeof priorityID === "undefined") {
          this.setState({ priorityValidationFailed: true });
          alert("Fill All Field...");
          return false;
        } else if (
          !isNumber(reorederLevel) ||
          (isNumber(reorederLevel) && parseFloat(reorederLevel) < 0)
        ) {
          this.setState({ reorderLevelValidationFailed: true });
          alert("Fill All Field...");
          return false;
        } else if (
          hasOpeningStock &&
          (!isNumber(openingStock) ||
            (isNumber(openingStock) && parseFloat(openingStock) <= 0))
        ) {
          this.setState({ openingStockValidationFailed: true });
          alert("Fill All Field...");
          return false;
        } else if (hasOpeningStock && typeof storeNameID === "undefined") {
          this.setState({ storeNameValidationFailed: true });
          alert("Fill All Field...");
          return false;
        } else if (isExpiryDateMandatory && hasOpeningStock && date === null) {
          this.setState({ expiryDateValidationFailed: true });
          alert("Fill All Field...");
          return false;
        } else {
          this.setState({ showLoader: true });
          let reqObj = {
            cid: this.context.userDetails.cid,
            name: getCapitalizeTextWithoutExtraSpaces(itemName),
            type: itemType,
            unit: unitID,
            hsn: this.state.hsnCode,
            gst: gst,
            purchase_price: purchasePrice,
            sales_price: salesPrice,
            priority: priorityID,
            reorder_level: reorederLevel,
            expiry_date_mandatory: isExpiryDateMandatory ? "Y" : "N",
          };

          if (typeof this.state.imageData !== "undefined") {
            reqObj.image = this.state.imageData;
          }

          if (hasOpeningStock) {
            reqObj.store_id = storeNameID;
            reqObj.opening_stock = openingStock;
            reqObj.batch_no = this.state.batchNo;
            reqObj.expiry_date =
              this.state.date !== null ? getFormattedDate(this.state.date) : "";
          }

          manageProduct(reqObj)
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
      <Header title={"Create New Item"} />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          ref={this.formScrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[globalStyle.formBorder]}
          >
            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>Choose Image</Text>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.imagePicker}
                onPress={this.chooseIcon}
              >
                {typeof this.state.imageURI !== "undefined" ? (
                  <Image
                    style={[styles.imageHeight]}
                    source={{ uri: this.state.imageURI }}
                  />
                ) : (
                  <Ionicons
                    name="image"
                    style={{ fontSize: 40, color: "#adadad" }}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.itemNameValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Item Name:</Text>
              <TextInput
                value={this.state.itemName}
                onChangeText={(itemName) => this.setState({ itemName })}
                style={[styles.textfield, globalStyle.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
                placeholder="Enter Item Name"
              />
            </View>

            <Dropdown
              label={"Item Type:"}
              placeholder="Select Item Type"
              value={this.state.itemType}
              items={this.state.categories}
              onChange={this.setItemType}
              labelStyle={styles.labelName}
              textFieldStyle={[styles.textfield, globalStyle.width60]}
              style={[
                styles.fieldBox,
                this.state.itemTypeValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            />

            <Dropdown
              label={"Unit:"}
              placeholder="Select Unit"
              value={this.state.unitName}
              items={Configs.UNITS}
              onChange={this.setUnit}
              labelStyle={styles.labelName}
              textFieldStyle={[styles.textfield, globalStyle.width60]}
              style={[
                styles.fieldBox,
                this.state.unitValidationFailed ? styles.errorFieldBox : null,
              ]}
            />

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>HSN Code:</Text>
              <TextInput
                value={this.state.hsnCode}
                onChangeText={(hsnCode) => this.setState({ hsnCode })}
                style={[styles.textfield, globalStyle.width60]}
                autoCompleteType="off"
                placeholder="Enter HSN Code"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.gstValidationFailed ? styles.errorFieldBox : null,
              ]}
            >
              <Text style={styles.labelName}>GST:</Text>
              <TextInput
                value={this.state.gst}
                onChangeText={(gst) => this.setState({ gst })}
                style={[styles.textfield, globalStyle.width60]}
                autoCompleteType="off"
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.purchasePriceValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Purchase Price:</Text>
              <TextInput
                value={this.state.purchasePrice}
                onChangeText={(purchasePrice) =>
                  this.setState({ purchasePrice })
                }
                style={[styles.textfield, globalStyle.width60]}
                autoCompleteType="off"
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.salesPriceValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Sales Price:</Text>
              <TextInput
                value={this.state.salesPrice}
                onChangeText={(salesPrice) => this.setState({ salesPrice })}
                style={[styles.textfield, globalStyle.width60]}
                autoCompleteType="off"
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <Dropdown
              label={"Priority:"}
              placeholder="Select Priority"
              value={this.state.priorityName}
              items={Configs.ITEM_PRIORITIES}
              onChange={this.setPriority}
              labelStyle={styles.labelName}
              textFieldStyle={[styles.textfield, globalStyle.width60]}
              style={[
                styles.fieldBox,
                this.state.priorityValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            />

            <View
              style={[
                styles.fieldBox,
                this.state.reorderLevelValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Reorder Level:</Text>
              <TextInput
                value={this.state.reorederLevel}
                onChangeText={(reorederLevel) =>
                  this.setState({ reorederLevel })
                }
                style={[styles.textfield, globalStyle.width60]}
                autoCompleteType="off"
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View
              style={[
                styles.fieldBox,globalStyle.justifyContentFlexStart,globalStyle.bbw0
              ]}
            >
              <Text
                style={{ fontSize: Colors.textSize, color: Colors.textColor }}
              >
                {"Expiry Date is Mandatory? "}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.radioField}
                onPress={this.toggleExpiryDateMandatory}
              >
                <RadioButton status={this.state.isExpiryDateMandatory} />
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.radioField}
                onPress={this.toggleExpiryDateMandatory}
              >
                <RadioButton status={!this.state.isExpiryDateMandatory} />
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.fieldBox,globalStyle.justifyContentFlexStart,
                !this.state.hasOpeningStock ? { borderBottomWidth: 0 } : null,
              ]}
            >
              <Text
                style={{ fontSize: Colors.textSize, color: Colors.textColor }}
              >
                {"Has Opening Stock? "}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.radioField}
                onPress={this.toggleOpeningStock}
              >
                <RadioButton status={this.state.hasOpeningStock} />
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.radioField}
                onPress={this.toggleOpeningStock}
              >
                <RadioButton status={!this.state.hasOpeningStock} />
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>

            {this.state.hasOpeningStock ? (
              <>
                <View
                  style={[
                    styles.fieldBox,
                    this.state.openingStockValidationFailed
                      ? styles.errorFieldBox
                      : null,
                  ]}
                >
                  <Text style={styles.labelName}>Opening Stock:</Text>
                  <TextInput
                    value={this.state.openingStock}
                    onChangeText={(openingStock) =>
                      this.setState({ openingStock })
                    }
                    style={[styles.textfield, globalStyle.width60]}
                    autoCompleteType="off"
                    keyboardType="numeric"
                    placeholder="Enter Opening Stock"
                  />
                </View>

                <View style={styles.fieldBox}>
                  <Text style={styles.labelName}>Batch No.</Text>
                  <TextInput
                    value={this.state.batchNo}
                    onChangeText={(batchNo) => this.setState({ batchNo })}
                    style={[styles.textfield, globalStyle.width60]}
                    autoCompleteType="off"
                    autoCapitalize="none"
                    placeholder="Enter Batch No."
                  />
                </View>

                <Dropdown
                  label={"Store Name:"}
                  placeholder="Select Store Name"
                  value={this.state.storeName}
                  items={this.state.storeNames}
                  onChange={this.setStoreName}
                  labelStyle={styles.labelName}
                  textFieldStyle={[styles.textfield, globalStyle.width60]}
                  style={[
                    styles.fieldBox,
                    this.state.storeNameValidationFailed
                      ? styles.errorFieldBox
                      : null,
                  ]}
                />

                <View
                  style={[
                    styles.fieldBox,
                    this.state.expiryDateValidationFailed
                      ? styles.errorFieldBox
                      : null,
                  ]}
                >
                  <Text style={styles.labelName}>Expiry Date:</Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[globalStyle.flexDirectionRow,globalStyle.alignItemsCenter,globalStyle.width60]}
                    onPress={() => {
                      this.showDatePicker();
                    }}
                  >
                    <Text style={[styles.textfield]}>
                      {this.state.date.toDateString()}
                    </Text>
                    <AntDesign
                      name="calendar"
                      color={Colors.primary}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  mode={"date"}
                  display={Platform.OS == "ios" ? "inline" : "default"}
                  isVisible={this.state.isDatepickerOpen}
                  onConfirm={this.handleConfirm}
                  onCancel={this.hideDatePicker}
                  minimumDate={new Date()}
                />
              </>
            ) : null}
          </View>

          <TouchableOpacity style={styles.button} onPress={this.addItem}>
            <Text style={styles.textWhite}>Save</Text>
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
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   radioField: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   radioText: {
//     marginLeft: 8,
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
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
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
// });
