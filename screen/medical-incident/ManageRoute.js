import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import Header from "../../component/Header";
import OverlayLoader from "../../component/OverlayLoader";
import { Colors } from "../../config";
import {
  addRoute,
  updateRoute,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class ManageRoute extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? null,
      name: props.route.params?.item?.name ?? "",
      showLoader: false,
    };
  }

  componentDidMount = () => {};

  gotoBack = () => this.props.navigation.goBack();

  onSave = () => {
    if (this.state.name == "") {
      Alert.alert("Validation Error", "Please enter a name");
      return;
    }

    if (this.state.id == null) {
      this.setState(
        {
          showLoader: true,
        },
        () => {
          addRoute({
            cid: this.context.userDetails.cid,
            name: getCapitalizeTextWithoutExtraSpaces(this.state.name),
          })
            .then((response) => {
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((err) => {
              console.log(err, "err");
              this.setState({ showLoader: false });
              Alert.alert("Server Error", "Please try again leter");
            });
        }
      );
    } else {
      this.setState(
        {
          showLoader: true,
        },
        () => {
          updateRoute({
            id: this.state.id,
            name: getCapitalizeTextWithoutExtraSpaces(this.state.name),
          })
            .then((response) => {
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((err) => {
              console.log(err, "err");
              this.setState({ showLoader: false });
              Alert.alert("Server Error", "Please try again leter");
            });
        }
      );
    }
  };

  getTitle = () => {
    return this.state.id == null ? "Add Route" : "Update Route";
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={this.getTitle()}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View
        style={[
          globalStyles.container,
          { padding: Colors.formPaddingHorizontal },
        ]}
      >
        <ScrollView ref={this.formScrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>Name</Text>
              <TextInput
                value={this.state.name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(name) => this.setState({ name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.onSave}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                SAVE
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
    </Container>
  );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         padding: 8
//     },
//     chooseCatContainer: {
//         flexDirection: "row",
//         marginVertical: 10,
//         paddingHorizontal: 10,
//         alignItems: "center",
//         justifyContent: "space-between",
//     },
//     imageContainer: {
//         borderColor: "#ccc",
//         borderWidth: 1,
//         padding: 3,
//         backgroundColor: "#fff",
//         borderRadius: 3,
//     },
//     image: {
//         height: 50,
//         width: 50,
//     },
//     defaultImgIcon: {
//         fontSize: 50,
//         color: "#adadad",
//     },
//     name: {
//         color: Colors.labelColor,
//         // lineHeight: 40,
//         fontSize:Colors.lableSize,
//         paddingLeft: 4,
//         height: 'auto',
//         paddingVertical: 10
//     },
//     buttonsContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-evenly",
//         marginVertical: 30,
//     },
//     inputText: {
//         backgroundColor: "#fff",
//         height: 'auto',
//         flexWrap:'wrap',
//         fontSize: Colors.textSize,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
//         width:'60%'
//     },
//     inputTextArea: {
//         height: 150,
//         borderWidth: 1,
//         borderColor: "#ccc",
//         backgroundColor: "#f9f6f6",
//         textAlignVertical: "top",
//         padding: 10,
//     },
//     inputContainer: {
//         alignItems: 'center',
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderWidth: 1,
//         backgroundColor: "#fff",
//         height: 'auto',
//         justifyContent: "space-between",
//     },
//     pb0: {
//         paddingBottom: 0,
//     },
//     mb0: {
//         marginBottom: 0,
//     },
//     buttonText: {
//         fontSize:Colors.lableSize,
//         fontWeight: "bold",
//     },
//     saveBtnText: {
//         color: Colors.primary,
//         fontSize:Colors.lableSize,
//     },
//     exitBtnText: {
//         color: Colors.activeTab,
//         fontSize:Colors.lableSize,
//     },
//     item: {
//         height: 35,
//         backgroundColor: "#00b386",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     itemtitle: {
//         color: "#fff",
//         textAlign: "center",
//         fontSize: 18,
//     },
//     errorText: {
//         textAlign: "right",
//         color: Colors.tomato,
//         fontWeight: "bold",
//         fontStyle: "italic",
//     }
// });
