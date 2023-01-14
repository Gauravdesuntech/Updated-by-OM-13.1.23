import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import { Header, Dropdown, RadioButton, OverlayLoader } from "../../component";
import {
  getCapitalizeTextWithoutExtraSpaces,
  isEmail,
  isMobile,
} from "../../utils/Util";
import {
  manageParty,
  getPartyDetails,
} from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from './Style'
import globalStyle from  '../../config/Styles'

export default class AddParty extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    let id =
      typeof props.route.params !== "undefined" ? props.route.params.id : 0;

    this.state = {
      id: id,
      partyName: "",
      emailID: "",
      mobileNo: "",
      partyType: "Customer",
      address: "",
      city: "",
      stateCode: undefined,
      stateName: undefined,
      pan: "",
      gstin: "",
      billingAddress: "",
      shippingAddress: "",
      accountNo: "",
      bankName: "",
      branchName: "",
      ifsc: "",
      balance: "",
      partyNameValidationFailed: false,
      emailIDValidationFailed: false,
      mobileNoValidationFailed: false,
      addressValidationFailed: false,
      stateValidationFailed: false,
      showLoader: parseInt(id) > 0 ? true : false,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    let { id } = this.state;
    if (parseInt(id) > 0) {
      getPartyDetails(id)
        .then((data) => {
          console.log(data.address);
          this.setState({
            partyName: data.name !== null ? data.name : "",
            emailID: data.email !== null ? data.email : "",
            mobileNo: data.mobile !== null ? data.mobile : "",
            partyType: data.type,
            address: data.address !== null ? data.address : "",
            city: data.city !== null ? data.city : "",
            stateCode: data.state_code !== null ? data.state_code : undefined,
            stateName: data.state !== null ? data.state : undefined,
            pan: data.pan !== null ? data.pan : "",
            gstin: data.gstin !== null ? data.gstin : "",
            billingAddress:
              data.billing_address !== null ? data.billing_address : "",
            shippingAddress:
              data.shipping_address !== null ? data.shipping_address : "",
            accountNo: data.account_no !== null ? data.account_no : "",
            bankName: data.bank_name !== null ? data.bank_name : "",
            branchName: data.branch !== null ? data.branch : "",
            ifsc: data.ifsc !== null ? data.ifsc : "",
            balance: data.balance !== null ? data.balance : "",
            showLoader: false,
          });
        })
        .catch((error) => console.log(error));
    }
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  togglePartyType = () => {
    this.setState({
      partyType: this.state.partyType === "Customer" ? "Supplier" : "Customer",
    });
  };

  setStateData = (v) => {
    this.setState({
      stateCode: v.id,
      stateName: v.name,
    });
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
        partyNameValidationFailed: false,
        emailIDValidationFailed: false,
        mobileNoValidationFailed: false,
        addressValidationFailed: false,
        stateValidationFailed: false,
      },
      () => {
        let { partyName, emailID, mobileNo, address, stateCode } = this.state;
        if (partyName.trim().length === 0) {
          this.setState({ partyNameValidationFailed: true });

          return false;
        } else if (emailID.trim().length === 0 || !isEmail(emailID)) {
          this.setState({ emailIDValidationFailed: true });

          return false;
        } else if (!isMobile(mobileNo)) {
          this.setState({ mobileNoValidationFailed: true });

          return false;
        } else if (address.trim().length === 0) {
          this.setState({ addressValidationFailed: true });

          return false;
        } else if (typeof stateCode === "undefined") {
          this.setState({ stateValidationFailed: true });

          return false;
        } else {
          this.setState({ showLoader: true });
          let reqObj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            name: getCapitalizeTextWithoutExtraSpaces(partyName),
            email: emailID,
            mobile: mobileNo,
            address: address,
            city: this.state.city,
            state: this.state.stateName,
            type: this.state.partyType,
            pan: this.state.pan,
            gstin: this.state.gstin,
            state_code: this.state.stateCode,
            billing_address: this.state.billingAddress,
            shipping_address: this.state.shippingAddress,
            account_no: this.state.accountNo,
            bank_name: getCapitalizeTextWithoutExtraSpaces(this.state.bankName),
            branch: getCapitalizeTextWithoutExtraSpaces(this.state.branchName),
            ifsc: this.state.ifsc,
            balance: this.state.balance,
          };

          manageParty(reqObj)
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
        title={parseInt(this.state.id) > 0 ? "Edit Party" : "Create New Party"}
      />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          ref={this.formScrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[globalStyle.formBorder]}
          >
            <View
              style={[
                styles.fieldBox,
                this.state.partyNameValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Party Name:</Text>
              <TextInput
                value={this.state.partyName}
                onChangeText={(partyName) => this.setState({ partyName })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="words"
                placeholder="Enter Party Name"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.emailIDValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Email ID:</Text>
              <TextInput
                value={this.state.emailID}
                onChangeText={(emailID) => this.setState({ emailID })}
                style={styles.textfield}
                autoCompleteType="off"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter Email ID"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.mobileNoValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Mobile No.</Text>
              <TextInput
                value={this.state.mobileNo}
                onChangeText={(mobileNo) => this.setState({ mobileNo })}
                style={styles.textfield}
                autoCompleteType="off"
                keyboardType="number-pad"
                placeholder="Enter Contact No."
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.addressValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Address:</Text>
              <TextInput
                multiline
                value={this.state.address}
                onChangeText={(address) => this.setState({ address })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>City:</Text>
              <TextInput
                value={this.state.city}
                onChangeText={(city) => this.setState({ city })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="words"
                placeholder="Enter City"
              />
            </View>

            <Dropdown
              label={"State:"}
              value={this.state.stateName}
              items={Configs.STATES}
              onChange={this.setStateData}
              labelStyle={styles.labelName}
              textFieldStyle={styles.textfield}
              placeholder="Select State Name"
              style={[
                styles.fieldBox,
                this.state.stateValidationFailed ? styles.errorFieldBox : null,
              ]}
            />

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>Party Type:</Text>
              <View
                style={[globalStyle.flexDirectionRow,globalStyle.alignItemsCenter,globalStyle.width60]}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.radioButton}
                  onPress={this.togglePartyType}
                >
                  <RadioButton status={this.state.partyType === "Customer"} />
                  <Text style={styles.radioButtonLabel}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.radioButton}
                  onPress={this.togglePartyType}
                >
                  <RadioButton status={this.state.partyType === "Supplier"} />
                  <Text style={styles.radioButtonLabel}>Supplier</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>PAN:</Text>
              <TextInput
                value={this.state.pan}
                onChangeText={(pan) => this.setState({ pan })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>GSTIN:</Text>
              <TextInput
                value={this.state.gstin}
                onChangeText={(gstin) => this.setState({ gstin })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="characters"
              />
            </View>

            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Billing Address:</Text>
              <TextInput
                multiline
                value={this.state.billingAddress}
                onChangeText={(billingAddress) =>
                  this.setState({ billingAddress })
                }
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.fieldBox]}>
              <Text style={styles.labelName}>Shipping Address:</Text>
              <TextInput
                multiline
                value={this.state.shippingAddress}
                onChangeText={(shippingAddress) =>
                  this.setState({ shippingAddress })
                }
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>Account No.</Text>
              <TextInput
                value={this.state.accountNo}
                onChangeText={(accountNo) => this.setState({ accountNo })}
                style={styles.textfield}
                autoCompleteType="off"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>Bank Name:</Text>
              <TextInput
                value={this.state.bankName}
                onChangeText={(bankName) => this.setState({ bankName })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>Branch:</Text>
              <TextInput
                value={this.state.branchName}
                onChangeText={(branchName) => this.setState({ branchName })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.labelName}>IFSC:</Text>
              <TextInput
                value={this.state.ifsc}
                onChangeText={(ifsc) => this.setState({ ifsc })}
                style={styles.textfield}
                autoCompleteType="off"
                autoCapitalize="characters"
              />
            </View>

            <View style={[styles.fieldBox, { borderBottomWidth: 0 }]}>
              <Text style={styles.labelName}>Balance:</Text>
              <TextInput
                value={this.state.balance}
                onChangeText={(balance) => this.setState({ balance })}
                style={styles.textfield}
                autoCompleteType="off"
                keyboardType="number-pad"
                placeholder="0"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.saveData}>
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
//     width: "60%",
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   textareaBox: {
//     flexDirection: "column",
//     height: 130,
//   },
//   textarea: {
//     height: 130,
//     paddingHorizontal: 5,
//     textAlignVertical: "top",
//     color: Colors.textColor,
//   },
//   radioButton: {
//     flexDirection: "row",
//     padding: 3,
//   },
//   radioButtonLabel: {
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     marginLeft: 5,
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
