import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import Header from "../../../component/Header";
import OverlayLoader from "../../../component/OverlayLoader";
import { Colors } from "../../../config";
import AppContext from "../../../context/AppContext";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import globalStyles from "../../../config/Styles";
import { InputDropdown, MultiSelectDropdown } from "../../../component";
import { getfeedtype, getfoods, getUnitsAndStores, managefoods } from "../../../services/KitchenServices";
import moment from "moment";

export default class AddFoods extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      types: [],
      status_list: [
        { id: 1, name: "Yes", value: "Y" },
        { id: 0, name: "No", value: "N" },
      ],
      showLoader: false,
      name: "",
      Protein: "",
      Energy: "",
      Fat: "",
      Fiber: "",
      Carbs: "",
      Minerals: "",
      Sugar: "",
      Vitamin_A: "",
      Vitamin_B: "",
      Vitamin_C: "",
      Vitamin_D: "",
      Vitamin_B_12: "",
      Calcium: "",
      Potassium: "",
      Iron: "",
      Sodium: "",
      status: 1,
      type: "",
      type_name: "",
      status_name: "Yes",
      hsn: "",
      gst: "",
      purchase_price: "",
      sale_price: "",
      opening_stock: "",
      batch_no: "",
      isTypeMenuOpen: false,
      isStatusMenuOpen: false,
      expiry_field: "",
      unit: "",
      unit_name: "",
      has_opening_stock: "",
      has_opening_stock_name: "",
      expiry_field_name: "",
      isUnitMenuOpen: false,
      store_id: "",
      store_name: "",
      isstore_nameMenuOpen: false,
      isexpiry_fieldMenuOpen: false,
      ishas_opening_stockMenuOpen: false,
      opening_stock: "",
      batch_no: "",
      expiry_date: new Date(),
      units_List: [],
      stores_List: [],
      show: false,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    this.setState(
      {
        showLoader: true,
      });
    if (this.state.id > 0) {
      getfoods(this.state.id)
        .then((data) => {
          let food_data = data.data[0];
          this.setState({
            name: food_data.name,
            Protein: food_data.protin,
            Energy: food_data.energy,
            Fat: food_data.fat,
            Fiber: food_data.fiber,
            Carbs: food_data.carbs,
            Minerals: food_data.minarels,
            Sugar: food_data.sugar,
            Vitamin_A: food_data.vitamin_a,
            Vitamin_B: food_data.vitamin_b,
            Vitamin_C: food_data.vitamin_c,
            Vitamin_D: food_data.vitamin_d,
            Vitamin_B_12: food_data.vitamin_b_12,
            Calcium: food_data.calcium,
            Potassium: food_data.potassium,
            Iron: food_data.iron,
            Sodium: food_data.sodium,
            status: food_data.status,
            type: food_data.feed_type,
            type_name: food_data.feed_type_name,
            status_name: food_data.status == 1 ? "Yes" : "No",
          });
        })
        .catch((error) => console.log(error));
    }

    getfeedtype()
      .then((data) => {
        let result = data.data.map((type) => {
          return {
            id: type.id,
            name: type.feed_type_name
          }
        })
        this.setState({
          showLoader: false,
          types: result
        });
      })
      .catch((error) => console.log(error));

    getUnitsAndStores()
      .then((data) => {
        // console.log("Units>>>>>>>>>",data);
        let result = data.units.map((unit) => {
          return {
            id: unit.id,
            name: unit.unit_name
          }
        })
        this.setState({
          showLoader: false,
          units_List: result,
          stores_List: data.stores
        });
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => this.props.navigation.goBack();

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  toggleStatusMenu = () => {
    this.setState({
      isStatusMenuOpen: !this.state.isStatusMenuOpen,
    });
  };
  handleSetStatus = (item) => {
    this.setState({
      status: item.id,
      status_name: item.name,
      isStatusMenuOpen: !this.state.isStatusMenuOpen,
    });
  };


  toggleTypeMenu = () => {
    this.setState({
      isTypeMenuOpen: !this.state.isTypeMenuOpen,
    });
  };
  handleSetType = (item) => {
    this.setState({
      type: item.id,
      type_name: item.name,
      isTypeMenuOpen: !this.state.isTypeMenuOpen,
    });
  };


  toggleUnitMenu = () => {
    this.setState({
      isUnitMenuOpen: !this.state.isUnitMenuOpen,
    });
  };
  handleSetUnit = (item) => {
    this.setState({
      unit: item.id,
      unit_name: item.name,
      isUnitMenuOpen: !this.state.isUnitMenuOpen,
    });
  };


  toggleexpiry_fieldMenu = () => {
    this.setState({
      isexpiry_fieldMenuOpen: !this.state.isexpiry_fieldMenuOpen,
    });
  };
  handleSetexpiry_field = (item) => {
    this.setState({
      expiry_field: item.value,
      expiry_field_name: item.name,
      isexpiry_fieldMenuOpen: !this.state.isexpiry_fieldMenuOpen,
    });
  };


  togglehas_opening_stockMenu = () => {
    this.setState({
      ishas_opening_stockMenuOpen: !this.state.ishas_opening_stockMenuOpen,
    });
  };
  handleSethas_opening_stock = (item) => {
    this.setState({
      has_opening_stock: item.id,
      has_opening_stock_name: item.name,
      ishas_opening_stockMenuOpen: !this.state.ishas_opening_stockMenuOpen,
    });
  };


  togglestore_nameMenu = () => {
    this.setState({
      isstore_nameMenuOpen: !this.state.isstore_nameMenuOpen,
    });
  };
  handleSetstore_name = (item) => {
    this.setState({
      store_id: item.id,
      store_name: item.name,
      isstore_nameMenuOpen: !this.state.isstore_nameMenuOpen,
    });
  };

  showDatePicker = () => {
    this.setState({ show: true });
  };

  handleConfirm = (selectDate) => {
    this.setState({
      expiry_date: selectDate,
    });
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({ show: false });
  };



  addFood = () => {
    this.setState(
      {
        showLoader: false,
      },
      () => {
        let obj = {
          id: this.state.id,
          name: this.state.name,
          unit: this.state.unit_name,
          feed_type: this.state.type,
          energy: this.state.Energy,
          protin: this.state.Protein,
          fat: this.state.Fat,
          fiber: this.state.Fiber,
          carbs: this.state.Carbs,
          minarels: this.state.Minerals,
          sugar: this.state.Sugar,
          vitamin_a: this.state.Vitamin_A,
          vitamin_b: this.state.Vitamin_B,
          vitamin_c: this.state.Vitamin_C,
          vitamin_d: this.state.Vitamin_D,
          vitamin_b_12: this.state.Vitamin_B_12,
          calcium: this.state.Calcium,
          iron: this.state.Iron,
          potassium: this.state.Potassium,
          sodium: this.state.Sodium,
          status: this.state.status,
          created_by: this.context.userDetails.id,
          hsn: this.state.hsn,
          gst: this.state.gst,
          purchase_price: this.state.purchase_price,
          sale_price: this.state.sale_price,
          opening_stock: this.state.opening_stock,
          batch_no: this.state.batch_no,
          expiry_field: this.state.expiry_field,
          expiry_date: moment(this.state.expiry_date).format("YYYY-MM-DD"),
          unit: this.state.unit_name,
          store_name: this.state.store_id,
          item_type: this.state.type_name,
          has_opening_stock: this.state.has_opening_stock,
        };
        // console.log("Object?>>>>>>>>>",obj);
        managefoods(obj)
          .then((response) => {
            // console.log(response);
            this.setState({
              showLoader: false,
            });
            Alert.alert(
              "Success",
              response
            );
            this.gotoBack();
          })
          .catch((error) => console.log(error));
      }
    );
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={parseInt(this.state.id) > 0 ? "Edit Food" : "Add Food"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View
        style={[globalStyles.container, { padding: Colors.formPaddingHorizontal }]}
      >
        <ScrollView ref={this.formScrollViewRef} showsVerticalScrollIndicator={false}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Name</Text>
              <TextInput
                value={this.state.name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(name) => this.setState({ name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
            <InputDropdown
              label="Feed Type*"
              value={this.state.type_name}
              isOpen={this.state.isTypeMenuOpen}
              items={this.state.types}
              openAction={this.toggleTypeMenu}
              closeAction={this.toggleTypeMenu}
              setValue={this.handleSetType}
              // placeholder="Select Sections"
              labelStyle={globalStyles.labelName}
              textFieldStyle={globalStyles.textfield}
              style={[globalStyles.fieldBox]}
            />

            {this.state.id > 0 ? null : 
            <>
            <InputDropdown
              label="Unit*"
              value={this.state.unit_name}
              isOpen={this.state.isUnitMenuOpen}
              items={this.state.units_List}
              openAction={this.toggleUnitMenu}
              closeAction={this.toggleUnitMenu}
              setValue={this.handleSetUnit}
              // placeholder="Select Sections"
              labelStyle={globalStyles.labelName}
              textFieldStyle={globalStyles.textfield}
              style={[globalStyles.fieldBox]}
            />
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>HSN Code *</Text>
              <TextInput
                value={this.state.hsn}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(hsn) => this.setState({ hsn })}
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>GST *</Text>
              <TextInput
                value={this.state.gst}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(gst) => this.setState({ gst })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Purchase Price *</Text>
              <TextInput
                value={this.state.purchase_price}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(purchase_price) => this.setState({ purchase_price })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Sales Price *</Text>
              <TextInput
                value={this.state.sale_price}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(sale_price) => this.setState({ sale_price })}
                keyboardType="number-pad"
              />
            </View>
            </>
            }
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Energy *</Text>
              <TextInput
                value={this.state.Energy}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Energy) => this.setState({ Energy })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Protein *</Text>
              <TextInput
                value={this.state.Protein}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Protein) => this.setState({ Protein })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Fat *</Text>
              <TextInput
                value={this.state.Fat}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Fat) => this.setState({ Fat })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Fiber *</Text>
              <TextInput
                value={this.state.Fiber}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Fiber) => this.setState({ Fiber })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Carbs *</Text>
              <TextInput
                value={this.state.Carbs}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Carbs) => this.setState({ Carbs })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Minerals *</Text>
              <TextInput
                value={this.state.Minerals}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Minerals) => this.setState({ Minerals })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Sugar *</Text>
              <TextInput
                value={this.state.Sugar}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Sugar) => this.setState({ Sugar })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Vitamin A *</Text>
              <TextInput
                value={this.state.Vitamin_A}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Vitamin_A) => this.setState({ Vitamin_A })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Vitamin B *</Text>
              <TextInput
                value={this.state.Vitamin_B}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Vitamin_B) => this.setState({ Vitamin_B })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Vitamin C *</Text>
              <TextInput
                value={this.state.Vitamin_C}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Vitamin_C) => this.setState({ Vitamin_C })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Vitamin D *</Text>
              <TextInput
                value={this.state.Vitamin_D}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Vitamin_D) => this.setState({ Vitamin_D })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Vitamin B 12 *</Text>
              <TextInput
                value={this.state.Vitamin_B_12}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Vitamin_B_12) => this.setState({ Vitamin_B_12 })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Calcium *</Text>
              <TextInput
                value={this.state.Calcium}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Calcium) => this.setState({ Calcium })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Iron *</Text>
              <TextInput
                value={this.state.Iron}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Iron) => this.setState({ Iron })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Potassium *</Text>
              <TextInput
                value={this.state.Potassium}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Potassium) => this.setState({ Potassium })}
                keyboardType="number-pad"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Sodium *</Text>
              <TextInput
                value={this.state.Sodium}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(Sodium) => this.setState({ Sodium })}
                keyboardType="number-pad"
              />
            </View>
            {this.state.id > 0 ? null :
            <>
            <InputDropdown
              label="Expiry Date Mandatory ? *"
              value={this.state.expiry_field_name}
              isOpen={this.state.isexpiry_fieldMenuOpen}
              items={this.state.status_list}
              openAction={this.toggleexpiry_fieldMenu}
              closeAction={this.toggleexpiry_fieldMenu}
              setValue={this.handleSetexpiry_field}
              // placeholder="Select Sections"
              labelStyle={globalStyles.labelName}
              textFieldStyle={globalStyles.textfield}
              style={[globalStyles.fieldBox]}
            />
            <InputDropdown
              label="Has Opening Stock ? *"
              value={this.state.has_opening_stock_name}
              isOpen={this.state.ishas_opening_stockMenuOpen}
              items={this.state.status_list}
              openAction={this.togglehas_opening_stockMenu}
              closeAction={this.togglehas_opening_stockMenu}
              setValue={this.handleSethas_opening_stock}
              // placeholder="Select Sections"
              labelStyle={globalStyles.labelName}
              textFieldStyle={globalStyles.textfield}
              style={[globalStyles.fieldBox]}
            />
            {this.state.has_opening_stock == 1 ? <>

            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Opening Stock</Text>
              <TextInput
                value={this.state.opening_stock}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(opening_stock) => this.setState({ opening_stock })}
                keyboardType="number-pad"
              />
            </View>

            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Batch Number </Text>
              <TextInput
                value={this.state.batch_no}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(batch_no) => this.setState({ batch_no })}
                keyboardType="number-pad"
              />
            </View>

            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Expiry Date</Text>
              <TouchableOpacity
                onPress={() => {
                  this.showDatePicker();
                }}
                style={{ width: "60%", justifyContent: "center" }}
              >
                <Text style={[globalStyles.textfield]}>
                  {moment(this.state.expiry_date).format("Do MMM YY (ddd)")}{""}
                </Text>
              </TouchableOpacity>
            </View>

            <InputDropdown
              label="Store Name"
              value={this.state.store_name}
              isOpen={this.state.isstore_nameMenuOpen}
              items={this.state.stores_List}
              openAction={this.togglestore_nameMenu}
              closeAction={this.togglestore_nameMenu}
              setValue={this.handleSetstore_name}
              // placeholder="Select Sections"
              labelStyle={globalStyles.labelName}
              textFieldStyle={globalStyles.textfield}
              style={[globalStyles.fieldBox]}
            />

            </>
            : null }

              </>
              }

            <InputDropdown
              label="Status*"
              value={this.state.status_name}
              isOpen={this.state.isStatusMenuOpen}
              items={this.state.status_list}
              openAction={this.toggleStatusMenu}
              closeAction={this.toggleStatusMenu}
              setValue={this.handleSetStatus}
              // placeholder="Select Sections"
              labelStyle={globalStyles.labelName}
              textFieldStyle={globalStyles.textfield}
              style={[globalStyles.fieldBox, globalStyles.bbw0]}
            />
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addFood}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <DateTimePickerModal
        mode="date"
        display={Platform.OS == "ios" ? "inline" : "default"}
        isVisible={this.state.show}
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
      />
    </Container>
  );
}