import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import { Header, OverlayLoader } from "../../component";
import {
  getCapitalizeTextWithoutExtraSpaces,
  getFileData,
} from "../../utils/Util";
import { manageSection } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import styles from "./Styles";
import DownloadFile from "../../component/DownloadFile";
import Dropdown from "../../component/Dropdown";
import { Configs } from "../../config";
import colors from "../../config/colors";

export default class AddSection extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    // console.log(props);
    super(props);
    this.state = {
      id:
        typeof props.route.params !== "undefined"
          ? props.route.params.item.id
          : 0,
      screentTitle:
        typeof props.route.params !== "undefined"
          ? props.route.params.screen_title
          : "Add Section",
      sectionName:
        typeof props.route.params !== "undefined"
          ? props.route.params.item.name
          : "",
      imageURI:
        typeof props.route.params !== "undefined"
          ? props.route.params.item.image
          : undefined,
      imageData: undefined,
      imageValidationFailed: false,
      sectionNameValidationFailed: false,
      showLoader: false,
      qrCode:
        typeof props.route.params !== "undefined"
          ? props.route.params.qr_image
          : null,

      selectedActiveStatus: typeof props.route.params !== "undefined"
      ? Configs.ACTIVE_STATUS.find((element)=> element.id == props.route.params.item.status)
      : Configs.ACTIVE_STATUS[0],
      selectedFeedStatus: typeof props.route.params !== "undefined"
      ? Configs.ACTIVE_STATUS.find((element)=> element.id == props.route.params.item.feed_status)
      : Configs.ACTIVE_STATUS[0],
      ip: props.route.params?.item?.live_ip_address
        ? props.route.params.item.live_ip_address
        : "rtsp://admin:Lset@123@",
    };

    this.scrollViewRef = React.createRef();
  }

  chooseIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              imageURI: result.uri,
              imageData: getFileData(result),
              imageValidationFailed: false,
            });
          }
        });
      } else {
        alert("Please allow permission to choose an icon");
      }
    });
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveData = () => {
    let { id, imageData, sectionName } = this.state;
    this.setState(
      {
        imageValidationFailed: false,
        sectionNameValidationFailed: false,
      },
      () => {
        if (parseInt(id) === 0 && typeof imageData === "undefined") {
          this.setState({ imageValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else if (sectionName.trim().length === 0) {
          this.setState({ sectionNameValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            name: getCapitalizeTextWithoutExtraSpaces(sectionName),
            status: this.state.selectedActiveStatus.id,
            feed_status: this.state.selectedFeedStatus.id,
            live_ip_address:
              this.state.ip == "rtsp://admin:Lset@123@" ? "" : this.state.ip,
          };

          if (typeof imageData !== "undefined") {
            obj.image = imageData;
          }

          manageSection(obj)
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
      <Header title={this.state.screentTitle} />
      <View style={globalStyles.container}>
        <ScrollView ref={this.scrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox, globalStyles.h50]}>
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                Choose Icon
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={globalStyles.imageContainer}
                onPress={this.chooseIcon}
              >
                {typeof this.state.imageURI !== "undefined" ? (
                  <Image
                    style={globalStyles.image_h40w40}
                    source={{ uri: this.state.imageURI }}
                  />
                ) : (
                  <Ionicons name="image" size={40} color={"#adadad"} />
                )}
              </TouchableOpacity>
            </View>
            {this.state.imageValidationFailed ? (
              <View style={globalStyles.mr10}>
                <Text style={globalStyles.errorText}>Choose an icon</Text>
              </View>
            ) : null}
            <View
              style={[
                globalStyles.fieldBox,
                { borderBottomWidth: 1, height: 50 },
              ]}
            >
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                Section Name
              </Text>
              <TextInput
                value={this.state.sectionName}
                onChangeText={(sectionName) => this.setState({ sectionName })}
                style={[globalStyles.textfield, globalStyles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.sectionNameValidationFailed ? (
                <Text style={globalStyles.errorText}>Enter Section Name</Text>
              ) : null}
            </View>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                Camera IP :{" "}
              </Text>
            </View>
            <TextInput
              value={this.state.ip}
              onChangeText={(ip) => this.setState({ ip })}
              style={[globalStyles.textfield, styles.cameraIpTeaxtInput]}
              multiline
              autoCompleteType="off"
              autoCapitalize="words"
            />
            <Dropdown
              label={"Status"}
              value={this.state.selectedActiveStatus?.name}
              items={Configs.ACTIVE_STATUS}
              onChange={(value) => {
                this.setState({ selectedActiveStatus: value });
              }}
              labelStyle={[globalStyles.labelName, globalStyles.pd0]}
              textFieldStyle={[globalStyles.textfield, globalStyles.width60]}
              style={[globalStyles.fieldBox, globalStyles.h50]}
            />
            <Dropdown
              label={"Feed Status"}
              value={this.state.selectedFeedStatus?.name}
              items={Configs.ACTIVE_STATUS}
              onChange={(value) => {
                this.setState({ selectedFeedStatus: value });
              }}
              labelStyle={[globalStyles.labelName, globalStyles.pd0]}
              textFieldStyle={[globalStyles.textfield, globalStyles.width60]}
              style={[globalStyles.fieldBox, globalStyles.h50]}
            />

            {this.state.qrCode !== null ? (
              <View style={globalStyles.qrCodeContainer}>
                <Image
                  source={{ uri: this.state.qrCode }}
                  style={globalStyles.qrImage}
                />
                <DownloadFile
                  url={this.state.qrCode}
                  viewStyle={globalStyles.downloadBtn}
                  textStyle={globalStyles.downloadFileButtonText}
                  design={<AntDesign name="download" size={20} />}
                  text={"Download QR"}
                />
              </View>
            ) : null}
          </View>
          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.saveData}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                {this.state.id == 0 ? "SAVE" : "UPDATE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
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
// 		padding: 8
// 	},
// 	imagePickerContainer: {
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
// 	imageContainer: {
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 	},
// 	image: {
// 		height: 40,
// 		width: 40,
// 	},
// 	defaultImgIcon: {
// 		fontSize: 40,
// 		color: "#adadad",
// 	},
// 	name: {
// 		color: Colors.labelColor,
//         // lineHeight: 40,
//         fontSize:Colors.lableSize,
//         paddingLeft: 4,
//         height: 'auto',
//         paddingVertical: 10
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 30,
// 	},
// 	inputText: {
// 		backgroundColor: "#fff",
//         height: 'auto',
//         flexWrap:'wrap',
//         fontSize: Colors.textSize,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
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
// 	pb0: {
// 		paddingBottom: 0,
// 	},
// 	mb0: {
// 		marginBottom: 0,
// 	},
// 	buttonText: {
// 		fontSize:Colors.lableSize,
// 		fontWeight: "bold",
// 	},
// 	saveBtnText: {
// 		color: Colors.primary,
// 		fontSize:Colors.lableSize,
// 	},
// 	exitBtnText: {
// 		color: Colors.activeTab,
// 		fontSize:Colors.lableSize,
// 	},
// 	errorText: {
// 		textAlign: "right",
// 		color: Colors.tomato,
// 		fontWeight: "bold",
// 		fontStyle: "italic",
// 	},
// });