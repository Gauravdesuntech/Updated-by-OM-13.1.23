import React from "react";
import {
  LogBox,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  AppState,
  Platform,
  BackHandler,
  Alert,
  Button,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import Colors from "./config/colors";
import Configs from "./config/Configs";
import GlobalState from "./context/GlobalState";
import Navigation from "./navigation/Navigation";
import { getUserData } from "./utils/Util";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as Network from "expo-network";
import { manageDeviceLog, getDistanceand } from "./services/APIServices";
import * as Location from "expo-location";
import { Linking } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ScreenCapture from "expo-screen-capture";

// For on/off Screen Capture comment line no. 126

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      isReady: false,
      userDetails: null,
      appState: AppState.currentState,
      location: {},
      permissionStatus: "",
    };

    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
  }

  async componentDidMount() {
    this.allowPermission();
    // For get the AppState
    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          this.AppStateFunc();
          // console.log("App has come to the foreground!");
        }
        this.setState({ appState: nextAppState });
      }
    );

    // this.backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.backAction
    // );

    this.connectionSubscription = NetInfo.addEventListener(
      this.handleConnectionInfoChange
    );

    this.notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    this.responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
  }

  AppStateFunc = async () => {
    // const media = await MediaLibrary.getPermissionsAsync();
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Warning", "Allow Permission to Use App", [
        {
          text: "Go to Setting",
          onPress: () => {
            Linking.openSettings();
            this.backAction();
          },
        },
        {
          text: "Close App",
          style: "cancel",
          onPress: () => this.backAction(),
        },
      ]);
      return;
    } 
    // else {
    //   this.getLocation();
    // }

    // if (this.state.userDetails != null) {
    //   this.getDeviceDetails();
    // }
  };

  backAction = () => {
    if (Platform.OS == "ios") {
      Alert.alert("Warning"[{ text: "ok", onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    BackHandler.exitApp();
    return true;
  };

  allowPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    const media = await MediaLibrary.requestPermissionsAsync();

    // for stop screen capture
    // await ScreenCapture.preventScreenCaptureAsync();

    if (status !== "granted") {
      Alert.alert("Warning", "Allow Permission to Use App", [
        {
          text: "Go to Setting",
          onPress: () => {
            Linking.openSettings();
            this.backAction();
          },
        },
        {
          text: "Close App",
          style: "cancel",
          onPress: () => this.backAction(),
        },
      ]);
      return;
    } 
    // else {
    //   this.getLocation();
    // }
  };

  // getLocation = async () => {
  //   let location = await Location.getCurrentPositionAsync();
  //   this.setState({ location: location });

  //   let userLat_Lng = {
  //     lat: location.coords.latitude,
  //     lng: location.coords.longitude,
  //   };
  //   getDistanceand(Configs.LONG_LAT, userLat_Lng).then((res) => {
  //     let distance = res.rows[0].elements[0].distance.value;
  //     if (distance >= Configs.DISTANCE_REQUIRED) {
  //       alert(
  //         "Your distance from location " +
  //           res.rows[0].elements[0].distance.value +
  //           " meters"
  //       );
  //       this.backAction();
  //       // For stop app if location distance more than 1KM
  //     }
  //   });
  // };

  // getDeviceDetails = async () => {
  //   let obj = {
  //     user_id: this.state.userDetails.id,
  //     user_name: this.state.userDetails.full_name,
  //     cid: this.state.userDetails.cid,
  //     device_details: JSON.stringify({
  //       brand: Device.brand,
  //       manufacturer: Device.manufacturer,
  //       modelName: Device.modelName,
  //       modelId: Device.modelId,
  //       osName: Device.osName,
  //       osVersion: Device.osVersion,
  //       osBuildId: Device.osBuildId,
  //       deviceName: Device.deviceName,
  //       DeviceType: Device.DeviceType,
  //       androidId: Platform.OS == "android" ? Application.androidId : "",
  //       buildVersion: Application.nativeBuildVersion,
  //       ipAddress: await Network.getIpAddressAsync(),
  //       networkState: await Network.getNetworkStateAsync(),
  //     }),
  //   };

  //   manageDeviceLog(obj)
  //     .then((res) => {})
  //     .catch((err) => console.log(err));
  // };

  componentWillUnmount = () => {
    this.appStateSubscription.remove();
    Notifications.removeNotificationSubscription(
      this.notificationListener.current
    );
    Notifications.removeNotificationSubscription(this.responseListener.current);
    this.connectionSubscription && this.connectionSubscription();
    // BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  };

  handleConnectionInfoChange = (state) => {
    this.setState({ isConnected: state.isConnected });
  };

  loadFont = () => {
    let fontSources = {
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    };

    Font.loadAsync(fontSources)
      .then((res) => {
        if (Configs.ignoreWarnings) {
          LogBox.ignoreAllLogs(true);
        }
        this.setState({ isReady: true });
      })
      .catch((error) => console.log(error));
  };

  onStart = async () => {
    let fontSources = {
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    };

    Promise.all([Font.loadAsync(fontSources), getUserData()])
      .then((response) => {
        this.setState(
          {
            userDetails: response[1],
            isReady: true,
          },
          () => this.hideScreen()
        );
      })
      .catch((error) => console.log(error));
  };

  hideScreen = async () => {
    await SplashScreen.hideAsync();
  };

  onFinish = async () => {
    console.log("Done");
  };

  render = () => (
    <SafeAreaView style={styles.container}>
      {this.state.isReady ? (
        this.state.isConnected ? (
          <GlobalState userDetails={this.state.userDetails}>
            <Navigation />
          </GlobalState>
        ) : (
          <View style={styles.offlineView}>
            <Ionicons name="cloud-offline" size={50} color={Colors.tomato} />
            <Text style={styles.offlineText}>You are offline</Text>
          </View>
        )
      ) : (
        <AppLoading
          startAsync={this.onStart}
          onFinish={this.onFinish}
          onError={console.log}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  offlineView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.lightGrey,
  },
  offlineText: {
    fontSize: 14,
    color: Colors.textColor,
  },
  container: {
    flex: 1,
  },
});
