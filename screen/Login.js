import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { OverlayLoader } from "../component";
import { Colors } from "../config";
import Configs from "../config/Configs";
import { saveUserData, getDeviceToken } from "../utils/Util";
import { signin, saveDeviceToken } from "../services/UserManagementServices";
import AppContext from "../context/AppContext";
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as Network from "expo-network";
import { manageDeviceLog } from "../services/APIServices";
import globalStyles from "../config/Styles";
//import styles from './Styles'


export default class Login extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      secureText: true,
      showLoader: false,
      errorMessage: undefined,
      usernameValidationFailed: false,
      passwordValidationFailed: false,
    };
  }

  toggleSecureText = () =>
    this.setState({ secureText: !this.state.secureText });

  submitData = () => {
    this.setState(
      {
        errorMessage: undefined,
        usernameValidationFailed: false,
        passwordValidationFailed: false,
      },
      () => {
        let { username, password } = this.state;
        if (username.trim().length === 0) {
          this.setState({ usernameValidationFailed: true });
          return false;
        } else if (password.trim().length === 0) {
          this.setState({ passwordValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let reqObj = {
            username: username,
            password: password,
          };

          signin(reqObj).then((response) => {
            if (response.check === Configs.SUCCESS_TYPE) {
              getDeviceToken()
                .then((token) => {
                  console.log("Token>>>>>>>>>>>>", token);
                  if (token) {
                    let obj = {
                      cid: response.data.cid,
                      user_id: response.data.id,
                      token: token,
                    };
                    saveDeviceToken(obj)
                      .then((res) => {
                        this.setState({ showLoader: false });
                        saveUserData(response.data);
                        this.getDeviceDetails(response.data);
                        this.context.setUserData(response.data);
                      })
                      .catch((error) => {
                        this.setState({ showLoader: false });
                        saveUserData(response.data);
                        this.getDeviceDetails(response.data);
                        this.context.setUserData(response.data);
                        console.log(error);
                      });
                  } else {
                    this.setState({ showLoader: false });
                    saveUserData(response.data);
                    this.getDeviceDetails(response.data);
                    this.context.setUserData(response.data);
                    //Handle if token not found
                    console.log("Token not generated from device");
                  }
                })
                .catch((error) => {
                  this.setState({ showLoader: false });
                  saveUserData(response.data);
                  this.getDeviceDetails(response.data);
                  this.context.setUserData(response.data);
                  console.log(error);
                });
            } else {
              this.setState({
                showLoader: false,
                errorMessage: response.message,
              });
            }
          });
        }
      }
    );
  };

  getDeviceDetails = async (userDetails) => {
    let obj = {
      user_id: userDetails.id,
      user_name: userDetails.full_name,
      cid: userDetails.cid,
      device_details: JSON.stringify({
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
        modelId: Device.modelId,
        osName: Device.osName,
        osVersion: Device.osVersion,
        osBuildId: Device.osBuildId,
        deviceName: Device.deviceName,
        DeviceType: Device.DeviceType,
        androidId: Platform.OS == "android" ? Application.androidId : "",
        buildVersion: Application.nativeBuildVersion,
        ipAddress: await Network.getIpAddressAsync(),
        networkState: await Network.getNetworkStateAsync(),
      }),
    };
    manageDeviceLog(obj)
      .then((res) => {
        console.log("After Login Device Details....", res.check);
      })
      .catch((err) => console.log(err));
  };

  render = () => (
    <Container>
      <View style={styles.container}>
        <View
          style={[
            styles.fieldBox,
            this.state.usernameValidationFailed ? styles.errorFieldBox : null,
          ]}
        >
          <TextInput
            value={this.state.username}
            autoCapitalize="none"
            placeholder="Username"
            style={styles.textfield}
            placeholderTextColor={Colors.textColor}
            onChangeText={(username) => this.setState({ username })}
          />
        </View>
        <View
          style={[
            styles.fieldBox,
            this.state.passwordValidationFailed ? styles.errorFieldBox : null,
          ]}
        >
          <TextInput
            secureTextEntry={this.state.secureText}
            value={this.state.password}
            autoCapitalize="none"
            placeholder="Password"
            style={styles.textfield}
            placeholderTextColor={Colors.textColor}
            onChangeText={(password) => this.setState({ password })}
          />
          {this.state.password.trim().length > 0 ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.toggleSecureText}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={this.state.secureText ? "eye" : "eye-off"}
                color={Colors.textColor}
                size={20}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {typeof this.state.errorMessage !== "undefined" ? (
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={this.submitData}>
          <Text style={styles.textWhite}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  fieldBox: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 3,
    borderColor: Colors.primary,
    borderWidth: 1,
    height: 50,
    justifyContent: "space-between",
    marginVertical: 12,
  },
  textfield: {
    width: "100%",
    height: 50,
    paddingHorizontal: 8,
    fontSize: 16,
    color: Colors.textColor,
  },
  eyeBtn: {
    position: "absolute",
    top: 10,
    right: 1,
    padding: 3,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    shadowColor: Colors.lightGrey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 20,
    marginTop: 15,
  },
  textWhite: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 14,
    color: Colors.tomato,
    fontWeight: "bold",
  },
  errorFieldBox: {
    borderWidth: 1,
    borderColor: Colors.tomato,
  },
});
