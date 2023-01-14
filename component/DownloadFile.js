import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AntDesign, Feather } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import OverlayLoader from './OverlayLoader';
import { getMedicineImages } from '../services/MedicalAndIncidenTServices';
import * as WebBrowser from 'expo-web-browser';
import { Configs } from '../config';

const { StorageAccessFramework } = FileSystem;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});



function DownloadFile(props) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [downloadProgress, setDownloadProgress] = React.useState();
  const [isLoading, setIsLoading] = useState(false)
  const [isFileSave, setIsFileSave] = useState(false)

  // console.log(props.url);
  const downloadPath = FileSystem.documentDirectory + (Platform.OS == 'android' ? '' : '');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const ensureDirAsync = async (dir, intermediates = true) => {
    const props = await FileSystem.getInfoAsync(dir)
    if (props.exist && props.isDirectory) {
      return props;
    }
    let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates })
    return await ensureDirAsync(dir, intermediates)
  }

  const downloadCallback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };

  const downloadMedicalImages = () => {
    // console.log("Hello",props.extra);
    getMedicineImages(props.extra).then((res)=>{
      // console.log("res Url>>>>>>>",res);
      download(res.url)
    }).catch((err)=>{
      console.log(err);
    })
  }



  const download = async (link) => {
    setIsLoading(true)
    let fileUrl = link;
    // let name = new Date().valueOf();
    // name += Configs.SEGMENT ? `${fileUrl.split("/")[7]}` : `${fileUrl.split("/")[6]}`;
    let name = fileUrl.substring(fileUrl.lastIndexOf("/") + 1, fileUrl.length);
    if (Platform.OS == 'ios') {
      let result = await WebBrowser.openBrowserAsync(link);
      console.log(result)
      setIsLoading(false)
      return
    }else{
      const dir = ensureDirAsync(downloadPath);
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      downloadPath + name,
      {},
      downloadCallback
    );
 

    try {
      const { uri } = await downloadResumable.downloadAsync();
      if (Platform.OS == 'android')
        saveAndroidFile(uri, name)
    } catch (e) {
      setIsLoading(false)
      console.error('download error:', e);
    }
  }

  const saveAndroidFile = async (fileUri, fileName) => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        setIsLoading(false)
        return;
      }

      try {
        let ext = fileName.split('.')[1]
        await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, `application/${ext}`)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, { encoding: FileSystem.EncodingType.Base64 });
            await schedulePushNotification(fileUri, fileName)
            //   alert('Downloaded Successfully')
            setIsLoading(false)
            setIsFileSave(true)
          })
          .catch((e) => {
            setIsLoading(false)
          });
      } catch (e) {
        setIsLoading(false)
        throw new Error(e);
      }

    } catch (err) {
    }
  }

  return (
    <>
     {props?.extra ? <>
      <OverlayLoader visible={isLoading}/>
      {isFileSave ? 
        <>
        <Feather name="check-circle" size={20} color="#63c3a5" />
          <Text
            style={[
              styles.loadingText,
              { opacity: 0.9, fontSize: 14, marginTop:3,marginLeft: 3 },
            ]}
          >
            File saved
          </Text>
        </>
        :
        <TouchableOpacity
          style={
            props.viewStyle ? props.viewStyle : styles.downloadBtn
          }
          onPress={downloadMedicalImages}
        >
          {props.design}
          <Text style={props.textStyle}>{props.text}</Text>
        </TouchableOpacity>
        }

     </> : <>
     <OverlayLoader visible={isLoading}/>
      {isFileSave ? 
        <>
        <Feather name="check-circle" size={25} color="#63c3a5" />
          <Text
            style={[
              styles.loadingText,
              { opacity: 0.9,marginLeft: 5,color:"#63c3a5"  },
            ]}
          >
            File saved to your device
          </Text>
        </>
        :
        <TouchableOpacity
          style={
            props.viewStyle ? props.viewStyle : styles.downloadBtn
          }
          onPress={()=>{download(props.url)}}
        >
          {props.design}
          <Text style={props.textStyle}>{props.text}</Text>
        </TouchableOpacity>
        }

     </> }
        
      
    </>
  );

}

const styles = StyleSheet.create({
  downloadBtn: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
    marginLeft: 20,
  },
})

async function schedulePushNotification(fileUri, fileName) {
  // console.log(fileName);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: fileName,
      body: 'Download complete ',
      data: { data: fileUri },
      sound: 'Message.wav',
    },
    trigger: { seconds: 2, channelId: fileName, },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  // if (Device.isDevice) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  // console.log(token);
  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync("fileName", {
      name: "fileName",
      sound: 'Message.wav',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF0000',
      enableLights: true,
      enableVibrate: true,
    });
  }

  return token;
}

export default DownloadFile