import React, { Component, useState, useCallback, useEffect, useContext, useRef } from "react";
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

export default function Chat_function() {
  const context = useContext(AppContext)
  const refRBSheet = useRef()
  const [isLoading, setisLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastID, setlastID] = useState(0);
  const [nextID, setnextID] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sendimageURI, setSendimageURI] = useState(undefined);
  const [sendimageData, setSendimageData] = useState(undefined);
  const [imageURI, setImageURI] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);
  const [res_abort, setRes_abort] = useState(false);
  const [is_image_loading, setIs_image_loading] = useState(false);
  const [upload_image, setUpload_image] = useState(false);

  useEffect(() => {
    console.log('....useEffect.....')
    loadData();
    {
      upload_image ?
        onImage_upload()
        : null
    }
  }, [upload_image])

  const loadData = () => {
    setisLoading(true);
    firebase
      .database()
      .ref(
        "message/" +
        `group1`
      )
      .on("value", (value) => {

        if ((value.val()) != null) {
          let arrayOfObj = Object.entries(value.val()).map((e) => e[1]);
          let lastObject = arrayOfObj.slice(-1);
          setMessages(arrayOfObj.reverse());
          setlastID(parseInt(lastObject[0]._id));
          setnextID(parseInt(lastObject[0]._id) + 1);
          setisLoading(false);
        } else {
          setnextID(1);
          setisLoading(false);
        }
      });
  }

  const onSend = (messages = []) => {
    // console.log('..............onSend................', context.userDetails.user_code);
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    let date = new Date().getTime();
    if (messages[0]?.image) {
      firebase
        .database()
        .ref(
          "message/" +
          `group1`
        )
        .push()
        .set({
          _id: nextID,
          createdAt: date,
          text: messages[0].text,
          user: {
            _id: context.userDetails.user_code,
            name: context.userDetails.full_name,
          },
          image: messages[0]?.image,
        })
        .catch(alert);
    } else {
      firebase
        .database()
        .ref(
          "message/" +
          `group1`
        )
        .push()
        .set({
          _id: nextID,
          createdAt: date,
          text: messages[0].text,
          user: {
            _id: context.userDetails.user_code,
            name: context.userDetails.full_name,
          },
        })
        .catch(alert);
    }
  }

  const renderBubble = (props) => {
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



  const openSendCamera = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        };

        ImagePicker.launchCameraAsync().then((result) => {
          // console.log('.........result......', result);
          if (!result.cancelled) {
            setSendimageURI(result.uri);
            setSendimageData(getFileData(result));
            setIs_image_loading(true)
            setUpload_image(true)
            // onImage_upload(result)
            refRBSheet.current.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  }

  const chooseSendImage = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          // console.log('.........result......', result);
          if (!result.cancelled) {
            setSendimageURI(result.uri);
            setSendimageData(getFileData(result));
            setIs_image_loading(true)
            // onImage_upload(result)
            setUpload_image(true)
            refRBSheet.current.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };

  const handelProgress = (event) => {
    if (event.lengthComputable) {
      setUploadProgress(Math.round((event.loaded * 100) / event.total))
    }
  }

  const onImage_upload = () => {
    console.log('.........uploading................');
    return new Promise((resolve, reject) => {
      let res_data = null
      const xhr = new XMLHttpRequest();
      if (res_abort) {
        xhr.abort();
        alert('.........xhr.abort()......called................');
        setIs_image_loading(false)
        setRes_abort(false)
        setUpload_image(false)
        return reject(xhr.statusText);
      }

      const formData = new FormData();

      formData.append("send_from", context.userDetails.user_code)
      formData.append("image", sendimageData)

      xhr.upload.addEventListener('progress', handelProgress)
      xhr.upload.addEventListener('loadend', () => {
        setUploadProgress(100)
      })
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          () => (xhr.response);
          console.log('..........response...2.......', JSON.parse(xhr.response))
          res_data = JSON.parse(xhr.response);
          if (res_abort == false) {
            if (res_data.is_success) {
              let link = [{ text: ``, image: res_data.data }]
              // onSend(link)
              setIs_image_loading(false)
              setRes_abort(false)
              setUpload_image(false)
            }
            else {
              alert(res_data.message)
              setIs_image_loading(false)
              setRes_abort(false)
              setUpload_image(false)
            }
          } else {
            setIs_image_loading(false)
            setRes_abort(false)
            setUpload_image(false)
          }
        }
      }
      xhr.open('POST', Configs.BASE_URL_APP + "chat/add_image")
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(formData)

    })
  }


  const actionBtn = () => {
    return (
      <TouchableOpacity style={{ margin: 8 }}
        onPress={() => refRBSheet.current.open()}
      >
        <Ionicons name="attach" size={24} color="black" />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={"Chat"}
      />
      {isLoading ?
        <View style={{ flex: 1 }}>
          <Loader />
        </View>
        :
        <>
          {is_image_loading ?
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
                  value={uploadProgress}
                  backgroundColorOnComplete={Colors.primary}
                  backgroundColor={Colors.primary}
                />
              </View>
              <Text style={{ alignSelf: 'center', margin: 10, marginBottom: 30 }}>{uploadProgress} %</Text>
              <TouchableOpacity
                style={{ width: 100, height: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: '25%', borderRadius: 3 }}
                onPress={() => {
                  setRes_abort(true);
                  setUpload_image(true);
                }}>
                <Text style={{ color: Colors.white, }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            :
            <>
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: context.userDetails.user_code,
                }}
                renderBubble={renderBubble}
                renderActions={actionBtn}
              />
              <RBSheet
                ref={refRBSheet}
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
                    onPress={openSendCamera}
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
                    onPress={chooseSendImage}
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