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
import { Header, OverlayLoader } from "../../component";
import { Colors } from "../../config";
import { addIncidentTypes } from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import styles from "./Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddIncidentTypes extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      type_name: props.route.params?.item?.type_name ?? "",
      showLoader: false,
      hasIncidentTypeNameValidationError: false,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {};

  gotoBack = () => this.props.navigation.goBack();

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  addType = () => {
    let { type_name } = this.state;
    this.setState(
      {
        hasIncidentTypeNameValidationError: false,
      },
      () => {
        if (type_name.trim().length === 0) {
          this.setState({ hasIncidentTypeNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            type_name: getCapitalizeTextWithoutExtraSpaces(type_name),
          };

          addIncidentTypes(obj)
            .then((response) => {
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((error) => console.log(error));
        }
      }
    );
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={this.state.id > 0 ? "Update" : "Add Incident Types"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={[globalStyles.container, styles.formPaddingHorizontal]}>
        <ScrollView ref={this.formScrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>Incident Type Name</Text>
              <TextInput
                value={this.state.type_name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(type_name) => this.setState({ type_name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.hasIncidentTypeNameValidationError ? (
                <Text style={globalStyles.errorText}>
                  Enter Incident Type name
                </Text>
              ) : null}
            </View>
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addType}>
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
//         padding : 8,
//         paddingHorizontal:Colors.formPaddingHorizontal,
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
//         borderRadius: Colors.formBorderRedius,
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
//     },
// });
