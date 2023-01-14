import * as firebase from "firebase";
import "@firebase/auth";
// 'use-strict';

// const firebase = require('firebase');
// const APP_BASE = 'https://your-unique-url.firebaseapp.com/'


const firebaseConfig = {
  apiKey: "AIzaSyDxHA_wOsunootIBYKZ-Cfjr-qOf_GtOow",
  authDomain: "zoo-app-adb4d.firebaseapp.com",
  databaseURL: "https://zoo-app-adb4d-default-rtdb.firebaseio.com",
  projectId: "zoo-app-adb4d",
  storageBucket: "zoo-app-adb4d.appspot.com",
  messagingSenderId: "609710231118",
  appId: "1:609710231118:web:3f98f6b07450e458eafd1f",
  measurementId: "G-KYQWM3N1E7"
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app();
}

export default firebase;