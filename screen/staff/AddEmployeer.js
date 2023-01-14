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
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import { Header, OverlayLoader } from "../../component";
import { manageEmployeer } from "../../services/UserManagementServices";
import AppContext from "../../context/AppContext";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddEmployeer extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
      name:
        typeof props.route.params !== "undefined"
          ? props.route.params.name
          : "",
      address:
        typeof props.route.params !== "undefined"
          ? props.route.params.address
          : "",
      employNameValidationFailed: false,
      employAddValidationFailed: false,
      showLoader: false,
      isOpen: false,
    };

    this.formScrollViewRef = React.createRef();
  }

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  saveData = () => {
    let { name, address } = this.state;
    this.setState(
      {
        employNameValidationFailed: false,
        employAddValidationFailed: false,
      },
      () => {
        if (name.trim().length === 0) {
          this.setState({ employNameValidationFailed: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (address.trim().length === 0) {
          this.setState({ employAddValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });

          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            name: getCapitalizeTextWithoutExtraSpaces(name),
            address: address,
          };

          manageEmployeer(obj)
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
        title={parseInt(this.state.id) > 0 ? "Edit Employeer" : "Add Employeer"}
      />
      <View style={styles.container}>
        <ScrollView
          ref={this.formScrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 3 }}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.name}>Employeer Name</Text>
              <TextInput
                value={this.state.name}
                onChangeText={(name) => this.setState({ name })}
                style={[styles.inputText, { width: "50%" }]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.employNameValidationFailed ? (
                <Text style={styles.errorText}>Enter employeer name</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.name}>Employeer Address</Text>
              <TextInput
                value={this.state.address}
                onChangeText={(address) => this.setState({ address })}
                style={[styles.inputText, { width: "50%" }]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.employAddValidationFailed ? (
                <Text style={styles.errorText}>Enter employeer address</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={this.saveData}
            >
              <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={this.gotoBack}
            >
              <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },
  name: {
    color: Colors.labelColor,
    // lineHeight: 40,
    fontSize: 19,
    paddingLeft: 4,
    height: "auto",
    paddingVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  inputContainer: {
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    padding: 5,
    borderRadius: 3,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    height: "auto",
    justifyContent: "space-between",
  },
  selectedItemsContainer: {
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  placeholderStyle: {
    fontSize: 18,
    color: Colors.textColor,
    opacity: 0.8,
  },
  inputText: {
    backgroundColor: "#fff",
    height: "auto",
    flexWrap: "wrap",
    fontSize: 19,
    color: Colors.textColor,
    textAlign: "left",
    padding: 5,
  },
  pb0: {
    paddingBottom: 0,
  },
  mb0: {
    marginBottom: 0,
  },
  button: {
    padding: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveBtnText: {
    color: Colors.primary,
  },
  exitBtnText: {
    color: Colors.activeTab,
  },
  errorText: {
    textAlign: "right",
    color: Colors.tomato,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
