import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { addCategory, getPriority } from "../../utils/api";
import { Picker } from "@react-native-picker/picker";
import Header from "../../component/tasks/Header";
import Footer from "../../component/tasks/Footer";
import Theme from "../../Theme";
import ImgToBase64 from "react-native-image-base64";
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import {
  getCapitalizeTextWithoutExtraSpaces,
  getFileData,
} from "../../utils/Util";
import { Colors, Configs } from "../../config";

const sampleimg = "https://www.pngarts.com/files/6/Vector-Carrot-PNG-Photo.png";

class AddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: sampleimg,
      loading: false,
      imagebase64: "",
      dafaultPriority: "",
      priorityLoading: true,
      priorities: [],
      imageData: undefined,
    };
  }

  componentDidMount() {
    // this.getPermissionAsync();
    this.getPriorityList();
  }

  getPriorityList = () => {
    // getPriority()
    //   .then((response) => {
    //     console.log("Priority Response",response.data.data);
    //     const sources = response.data;
    //     let priorities = sources.data.map((a, index) => {
    //       return {
    //         id: a.id,
    //         title: a.name,
    //       };
    //     });
    //     this.setState({
    //       status: priorities.length === 0 ? "No Priority Available" : "",
    //       priorities: priorities,
    //       priorityLoading: false,
    //     });
    //   })
    //   .catch((error) => {
    //     this.setState({
    //       priorities: [],
    //       priorityLoading: false,
    //     });
    //     showError(error);
    //   });
    let priorities = Configs.PRIORITY_FOR_CATEGORY_ADD.map((a, index) => {
      return {
        id: a.id,
        title: a.name,
      };
    });
    this.setState({
      status: priorities.length === 0 ? "No Priority Available" : "",
      priorities: priorities,
      priorityLoading: false,
    });
  };

  priorityChangeHandler = (value) => {
    this.setState({
      dafaultPriority: value,
    });
  };

  _pickImage = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          base64: true,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              image: result.uri,
              imageData: getFileData(result),
              imagebase64: result.base64,
              type: result.type,
            });
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an icon");
      }
    });

    // try {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         base64: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });
    //     if (!result.cancelled) {
    //         this.setState({
    //             image: result.uri,
    //             imagebase64: result.base64,
    //             type:result.type
    //         });
    //     }
    // } catch (E) {
    //     console.log(E,"E");
    // }
  };

  // getPermissionAsync = async () => {
  //     const { status, expires, permissions } = await Permissions.getAsync(
  //         Permissions.CAMERA_ROLL,
  //     );
  //     if (status !== 'granted') {
  //         alert('Hey! You have not enabled selected permissions');
  //         const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //         if (status !== 'granted') {
  //             alert('Sorry, we need camera roll permissions to make this work!');
  //         }
  //     }
  // };

  handleSubmit = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        let obj = {
          name: getCapitalizeTextWithoutExtraSpaces(this.state.category_name),
          priority: parseInt(this.state.dafaultPriority),
          description: this.state.description,
          image: this.state.imagebase64,
        };

        addCategory(obj)
          .then((response) => {
            const sources = response.data;
            alert(sources.type);
            this.setState({
              loading: false,
            });
            this.props.navigation.push("Todo");
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            showError(error);
          });
      }
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          style={{ borderColor: "red", borderWidth: 3 }}
          navigation={this.props.navigation}
          leftNavTo={"Todo"}
          title={"ADD A CATEGORY"}
          // leftIcon={'ios-arrow-back'}
          rightIcon={null}
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1, height: "80%" }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            style={styles.body}
          >
            <View>
              {/* TODO:Please add the functionality to pick the icon and store it in an array */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 3,
                  marginTop: 20,
                }}
              >
                <View style={styles.fieldBox}>
                  <Text style={styles.labelName}>Choose Icon</Text>
                  <TouchableOpacity
                    onPress={this._pickImage}
                    style={styles.itemWrapper}
                  >
                    <Image
                      source={{ uri: this.state.image }}
                      style={{ height: 35, width: 35, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Entries */}

                <View style={[styles.fieldBox]}>
                  <Text style={styles.labelName}>Category Name</Text>
                  <TextInput
                    maxLength={20}
                    onChangeText={(text) =>
                      this.setState({ category_name: text })
                    }
                    style={[styles.textfield, { width: "60%" }]}
                  />
                </View>

                <View style={[styles.fieldBox]}>
                  <Text style={styles.labelName}>Choose Priority</Text>
                  {this.state.priorityLoading == false ? (
                    <Picker
                      selectedValue={this.state.dafaultPriority}
                      onValueChange={(itemValue, itemIndex) =>
                        this.priorityChangeHandler(itemValue)
                      }
                      style={[styles.textfield, { width: "60%" }]}
                    >
                      {this.state.priorities.map((item) => {
                        return (
                          <Picker.Item
                            key={item.id.toString()}
                            label={item.title}
                            value={item.id}
                          />
                        );
                      })}
                    </Picker>
                  ) : (
                    <Spinner />
                  )}
                </View>

                <View style={[styles.fieldBox, { borderBottomWidth: 0 }]}>
                  <Text style={styles.labelName}>Description</Text>
                  <TextInput
                    multiline={true}
                    onChangeText={(text) =>
                      this.setState({ description: text })
                    }
                    style={[styles.textfield, { width: "60%" }]}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                  marginTop: 20,
                }}
              >
                {this.state.loading === true ? (
                  <TouchableOpacity>
                    <Spinner />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={this.handleSubmit}>
                    <Text style={styles.btns}>SAVE </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Todo")}
                >
                  <Text style={styles.btns}>EXIT </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>

        {/* <Footer /> */}
      </SafeAreaView>
    );
  }
}
export default AddCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    flex: 9,
    paddingHorizontal: 10,
  },
  itemWrapper: {
    height: 55,
    width: 55,
    borderWidth: 1,
    borderColor: "#7c7c7c50", //SUBHASH : choose icon border color , 50 value change it based on what you want
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#7c7c7c40", //SUBHASH :reduce opacity for box outline here
    backgroundColor: "#e5e5e550",
    marginTop: 10,
    fontSize: 16,
  },
  btns: {
    fontSize: 20,
    fontWeight: "bold",
    color: Theme.primary,
  },
  fieldBox: {
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
    // marginBottom: 5,
    // marginTop: 5,
    // shadowColor: "#999",
    // shadowOffset: {
    // 	width: 0,
    // 	height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },
  labelName: {
    color: Colors.labelColor,
    // lineHeight: 40,
    fontSize: 19,
    paddingLeft: 4,
    height: "auto",
    paddingVertical: 10,
  },
  textfield: {
    backgroundColor: "#fff",
    height: "auto",
    flexWrap: "wrap",
    fontSize: 19,
    color: Colors.textColor,
    textAlign: "left",
    padding: 5,
  },
});
