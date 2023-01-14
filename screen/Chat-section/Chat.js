import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { Header, Loader } from "../../component";
import AppContext from "../../context/AppContext";
import firebase from "../../config/firebase";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Colors } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { getFileData } from "../../utils/Util";
import Configs from "../../config/Configs";
import ProgressBarAnimated from 'react-native-progress-bar-animated';

export default class Chat extends React.Component {
    static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
 isLoading :false,
  messages:[],
  lastID:0,
  nextID:0,
  uploadProgress:0,
  sendimageURI:undefined,
  sendimageData:undefined,
  imageURI:undefined,
  imageData:undefined,
  res_abort:false,
  is_image_loading:false,
  upload_image:false,
    }
}

componentDidMount = () => {
    console.log('....componentDidMount.....');
    this.loadData(this.context.userDetails.dept_code);
  }

  loadData = (dept_code) => {
  this.setState({loading:true})
    firebase
      .database()
      .ref(
        "message/" +
        `${dept_code}`
      )
      .on("value", (value) => {

        if ((value.val()) != null) {
          let arrayOfObj = Object.entries(value.val()).map((e) => e[1]);
          let lastObject = arrayOfObj.slice(-1);
          this.setState({messages: arrayOfObj.reverse()});
          this.setState({lastID:parseInt(lastObject[0]._id)});
          this.setState({nextID:(parseInt(lastObject[0]._id) + 1)});
          this.setState({loading:false});
        } else {
            this.setState({nextID: 1});
            this.setState({loading:false});
        }
      });
  }

    onSend = (messages = []) => {
    // console.log('..............onSend................', context.userDetails.user_code);
    this.setState({messages:(previousMessages => GiftedChat.append(previousMessages, messages))})
    let date = new Date().getTime();
    if (messages[0]?.image) {
      firebase
        .database()
        .ref(
          "message/" +
          `${this.context.userDetails.dept_code}`
        )
        .push()
        .set({
          _id: this.state.nextID,
          createdAt: date,
          text: messages[0].text,
          user: {
            _id: this.context.userDetails.user_code,
            name: this.context.userDetails.full_name,
          },
          image: messages[0]?.image,
          sent: true,
        })
        .catch(alert);
    } else {
      firebase
        .database()
        .ref(
          "message/" +
          `${this.context.userDetails.dept_code}`
        )
        .push()
        .set({
          _id: this.state.nextID,
          createdAt: date,
          text: messages[0].text,
          user: {
            _id: this.context.userDetails.user_code,
            name: this.context.userDetails.full_name,
          },
          sent: true,
        })
        .catch(alert);
    }
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.primary,
            marginVertical: 2,
            padding: 2
          },
          left: {
            marginVertical: 2,
            padding: 2
          }
        }}
      />
    )
  }



   openSendCamera = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        };

        ImagePicker.launchCameraAsync().then((result) => {
          console.log('.........result......', result);
          if (!result.cancelled) {
            this.setState({
                sendimageURI: result.uri,
                sendimageData: getFileData(result),
  
              });
              this.setState({ is_image_loading: true })
              this.onImage_upload(result)
              this.RBSheetprofile.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  }

  chooseSendImage = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          console.log('.........result......', result);
          if (!result.cancelled) {
            this.setState({
                sendimageURI: result.uri,
                sendimageData: getFileData(result),
              });
              this.setState({ is_image_loading: true })
              this.onImage_upload(result)
              this.RBSheetprofile.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };

  handelProgress = (event) => {
    if (event.lengthComputable) {
      this.setState({ uploadProgress: (Math.round((event.loaded * 100) / event.total)) });
    }
  }

  onImage_upload = (result) => {
    console.log('.........uploading................');
    return new Promise((resolve, reject) => {
      let res_data = null
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("send_from", this.context.userDetails.user_code)
      formData.append("image", getFileData(result))

      xhr.upload.addEventListener('progress', this.handelProgress)
      xhr.upload.addEventListener('loadend', () => {
        this.setState({ uploadProgress: 100 })
      })
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          () => (xhr.response);
          console.log('..........response...2.......', JSON.parse(xhr.response))
          res_data = JSON.parse(xhr.response);
          if (this.state.res_abort == false) {
            if (res_data.is_success) {
              let link = [{ text: ``, image: res_data.data }]
              this.onSend(link)
              this.setState({ is_image_loading: false ,res_abort:false})
            }
            else {
              alert(res_data.message)
              this.setState({ is_image_loading: false,res_abort:false})
            }
          } else {
            this.setState({ is_image_loading: false ,res_abort:false})
          }
        }
      }
      xhr.open('POST', Configs.BASE_URL_APP + "chat/add_image")
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(formData)

      if (this.state.res_abort) {
        xhr.abort();
        alert('.........abort................');
        this.setState({ is_image_loading: false ,res_abort:false})
        return reject(xhr.statusText);
      }
    })
  }


 actionBtn = () => {
    return (
      <TouchableOpacity style={{ margin: 8 }}
        onPress={() => this.RBSheetprofile.open()}
      >
        <Ionicons name="attach" size={24} color="black" />
      </TouchableOpacity>
    )
  }

  render() {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={"Chat"}
      />
      {this.state.isLoading ?
        <View style={{ flex: 1 }}>
          <Loader />
        </View>
        :
        <>
          {this.state.is_image_loading ?
            <View style={styles.uploadingCon}>
              <Text style={{ alignSelf: 'center', margin: 10, }}>Uploading...</Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              >
                <ProgressBarAnimated
                  width={300}
                  value={this.state.uploadProgress}
                  backgroundColorOnComplete={Colors.primary}
                  backgroundColor={Colors.primary}
                />
              </View>
              <Text style={{ alignSelf: 'center', margin: 10, marginBottom: 30 }}>{this.state.uploadProgress} %</Text>
              <TouchableOpacity
                style={{ width: 100, height: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: '25%', borderRadius: 3 }}
                onPress={() => {
                    this.setState({ res_abort: true, is_image_loading: false })
                }}>
                <Text style={{ color: Colors.white, }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            :
            <>
              <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                  _id: this.context.userDetails.user_code,
                }}
                renderBubble={this.renderBubble}
                renderActions={this.actionBtn}
              />
              <RBSheet
               ref={(ref) => {
                this.RBSheetprofile = ref;
              }}
                closeOnPressMask={true}
                height={140}
                openDuration={250}
                customStyles={{
                  container: {
                    padding: 15,
                  },
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.openSendCamera}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor }}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.chooseSendImage}
                  >
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor, }}>
                      Choose Image
                    </Text>
                  </TouchableOpacity>
                </View>

              </RBSheet>
            </>
          }
        </>
      }
    </SafeAreaView>
  )
}
}


const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  uploadingCon: {
    marginTop: windowHeight / 3,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 40,
  },

});