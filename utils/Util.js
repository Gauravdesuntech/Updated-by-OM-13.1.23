import AsyncStorage from "@react-native-async-storage/async-storage";
import * as mime from "react-native-mime-types";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import moment from "moment";
import { Configs } from "../config";
import * as Device from "expo-device";
import * as Permissions from "expo-permissions";

const STORAGE_KEY = "@zooapp_user_data";

export const getUserData = async () => {
  try {
    let rawData = await AsyncStorage.getItem(STORAGE_KEY);
    return rawData !== null ? JSON.parse(rawData) : null;
  } catch (e) {
    throw new Error("failed data retrieve from device");
  }
};

export const saveUserData = async (value) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (e) {
    throw new Error("failed data save to device");
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    throw new Error("failed to remove data from device");
  }
};

export const getRequestUrl = (url, requestObj = {}) => {
  let params = [];

  for (const [key, value] of Object.entries(requestObj)) {
    params.push(key + "=" + value);
  }

  if (params.length > 0) {
    url += "/?" + params.join("&");
  }

  return url;
};

export const getPostRequestOptions = (requestObj = {}) => {
  let formdata = new FormData();
  for (const [key, value] of Object.entries(requestObj)) {
    formdata.append(key, value);
  }

  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    body: formdata,
  };

  return requestOptions;
};

export const getFileData = (obj) => {
  let uri = obj.uri;

  let arr = uri.split("/");
  let fileName = arr[arr.length - 1];

  let extArr = fileName.split(".");
  let extention = extArr[extArr.length - 1];

  return {
    uri: uri,
    name: fileName,
    type: mime.lookup(fileName),
  };
};

export const getFormattedDate = (dateStr, formatType = "YYYY-MM-DD") => {
  var d = new Date(dateStr);

  //prepare day
  let day = d.getDate();
  day = day < 10 ? "0" + day : day;

  //prepare month
  let month = d.getMonth() + 1;
  month = month < 10 ? "0" + month : month;

  //prepare year
  let year = d.getFullYear();

  let date = undefined;
  switch (formatType) {
    case "DD/MM/YYYY":
      date = day + "/" + month + "/" + year;
      break;
    case "DD.MM.YYYY":
      date = day + "." + month + "." + year;
      break;
    default:
      date = year + "-" + month + "-" + day;
  }

  return date;
};

//This takes php date format and returns to js comaptible
export const convertDate = (date) => {
  if (date == "") {
    return false;
  }
  return new Date(Date.parse(date));
};

export const getCurrentTime = () => {
  let date = new Date();

  let hours = date.getHours();
  hours = hours < 10 ? "0" + hours : hours;

  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return hours + ":" + minutes;
};

export const getDelay = (startTime, endTime) => {
  let startArr = startTime.split(":");
  let startHour = typeof startArr[0] !== "undefined" ? startArr[0] : 0;
  let startMinute = typeof startArr[1] !== "undefined" ? startArr[1] : 0;
  let startSecond = typeof startArr[2] !== "undefined" ? startArr[2] : 0;

  let endArr = endTime.split(":");
  let endHour = typeof endArr[0] !== "undefined" ? endArr[0] : 0;
  let endMinute = typeof endArr[1] !== "undefined" ? endArr[1] : 0;
  let endSecond = typeof endArr[2] !== "undefined" ? endArr[2] : 0;

  let startDate = new Date();
  startDate.setHours(startHour);
  startDate.setMinutes(startMinute);
  startDate.setSeconds(startSecond);

  let endDate = new Date();
  endDate.setHours(endHour);
  endDate.setMinutes(endMinute);
  endDate.setSeconds(endSecond);

  let diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;

  // calculate hours
  let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  let minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  if (hours > 0 || minutes > 0) {
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return "-" + hours + ":" + minutes;
  } else {
    return 0;
  }
};

export const toFixedNoRounding = (num, fixed) => {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
};

export const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const isEmail = (email) => {
  var regx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return regx.test(email);
};

export const isMobile = (no) => {
  var regx = /^\d{10}$/;
  return regx.test(no);
};

export const getDeviceToken = async () => {
  let token = null;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === "granted") {
      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: Configs.TOKEN_EXPERIENCEID,
        })
      ).data;
    } else {
      alert("Sorry but we will not be able to send you notification");
      console.log("Failed to get push token for push notification!");
      return;
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
};

// export const getDeviceToken = async () => {
// 	let token = null;

// 	if (Device.isDevice) {
// 		const { status: existingStatus } = await Permissions.getAsync(
// 			Permissions.NOTIFICATIONS
// 		);
// 		let finalStatus = existingStatus;

// 		if (existingStatus !== "granted") {
// 			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
// 			finalStatus = status;
// 		}
// 		if (finalStatus === "granted") {
// 			token = await Notifications.getExpoPushTokenAsync({experienceId: '@desuntechnology/animalcaredevelopment'});
// 		} else {
// 			console.log("Failed to get push token for push notification!");
// 		}
// 	} else {
// 		console.log("Must use physical device for Push Notifications");
// 	}

// 	if (Platform.OS === "android") {
// 		Notifications.setNotificationChannelAsync("default", {
// 			name: "default",
// 			importance: Notifications.AndroidImportance.MAX,
// 			vibrationPattern: [0, 250, 250, 250],
// 			lightColor: "#FF231F7C",
// 		});
// 	}

// 	return token;
// };

export const capitalize = (s) => {
  let str = s && s.toLowerCase();
  if(str == null){
    return "N/A";
  }else{
  return str[0].toUpperCase() + str.slice(1);
  }
};

export const calculateAge = (date1, date2) => {
  var date1 = moment(date1, "DD.MM.YYYY");
  var date2 = moment(date2, "DD.MM.YYYY");
  let age;
  let days = date1.diff(date2, "days");
  if (days >= 365) {
    age = date1.diff(date2, "year") + " Y";
  } else {
    age = date1.diff(date2, "months") + " M";
  }

  let obj = {
    days: days,
    age: age,
  };

  return obj;
};

export function getUserMenu(user_module) {
  let userMenuItems = [];
  let currentMenus = Configs.HOME_SCREEN_MENUES;
  if (user_module.length == 0) {
    return userMenuItems;
  }

  for (let i = 0; i < currentMenus.length; i++) {
    let item = user_module.find((menu) => menu == currentMenus[i].id);

    if (item !== undefined) {
      userMenuItems.push(currentMenus[i]);
    }
  }

  return userMenuItems;
}

export const showDate = (date) => {
  let m = moment(date);

  return m.format("MMMM YYYY");
};

export const getCapitalizeTextWithoutExtraSpaces = (text) => {
  const words = text.replace(/\s+/g, " ").trim().split(" ");

  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

export const substractDays = (days = 1, format = "YYYY-MM-DD") => {
  return moment(new Date()).subtract(days, "days").format(format)
}
