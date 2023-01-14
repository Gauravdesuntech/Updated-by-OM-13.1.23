import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import { Header, OverlayLoader } from "../../component";
import { manageAnimalEnclosureType } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddEnclosureType extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
      screentTitle:
        typeof props.route.params !== "undefined"
          ? props.route.params.screen_title
          : "Add Enclosure Type",
      enclosureTypeName:
        typeof props.route.params !== "undefined"
          ? props.route.params.name
          : "",
      enclosureTypeNameValidationFailed: false,
      showLoader: false,
    };

    this.scrollViewRef = React.createRef();
  }

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveData = () => {
    let { enclosureTypeName } = this.state;
    this.setState(
      {
        enclosureTypeNameValidationFailed: false,
      },
      () => {
        if (enclosureTypeName.trim().length === 0) {
          this.setState({ enclosureTypeNameValidationFailed: true });
          this.scrollViewScrollTop();
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            name: getCapitalizeTextWithoutExtraSpaces(enclosureTypeName),
          };

          manageAnimalEnclosureType(obj)
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
      <View style={styles.container}>
        <ScrollView ref={this.scrollViewRef}>
          <View style={styles.formBorder}>
            <View style={[styles.fieldBox, styles.bbw0]}>
              <Text style={styles.labelName}>Enclosure Type</Text>
              <TextInput
                value={this.state.enclosureTypeName}
                onChangeText={(enclosureTypeName) =>
                  this.setState({ enclosureTypeName })
                }
                style={[styles.textfield, styles.width60]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.enclosureTypeNameValidationFailed ? (
                <Text style={styles.errorText}>Enter Enclosure Type</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.saveData}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
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
// 		padding : 8,
// 		borderRadius: Colors.formBorderRedius,
// 		paddingHorizontal:Colors.formPaddingHorizontal,
// 	},
// 	name: {
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
