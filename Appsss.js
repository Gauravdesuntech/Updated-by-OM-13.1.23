import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import Colors from "./config/colors";
import Configs from "./config/Configs";
import GlobalState from "./context/GlobalState";
import Navigation from "./navigation/Navigation";
import { getUserData } from "./utils/Util";
import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [userDetails, setUserDetails] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    // Net Info Listener
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isInternetReachable)
            // console.log(state,state.isInternetReachable, isConnected)
          });
         
          return () =>{
            unsubscribe();
          }

    }, [isConnected]);


    //Notification Listener
    useEffect(() => {
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log(notification);
            });
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, []);




    useEffect(() => {
        let fontSources = {
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            ...Ionicons.font,
        };
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Promise.all([Font.loadAsync(fontSources), getUserData()])
                    .then((response) => {
                        console.log("Reponse from user Details")
                        setUserDetails(response[1])
                    })
                    .catch((error) => console.log(error));
                    // await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (e) {
                console.warn(e);
            } finally {
                console.log("Finally")
                setAppIsReady(true);
            }
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        console.log("Calling")
        if (appIsReady) {
            console.log("Calling 2")
            await SplashScreen.hideAsync();
            console.log("Calling 3")
        }
        console.log("Called Out side")
    }, [appIsReady]);

    if (!appIsReady) {
        return (
            <View style={{flex: 1, backgroundColor: "#01c796"}}>
                <Image resizeMode={'cover'} source={require('./assets/splash.png')} />
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            {isConnected ? (
					<GlobalState userDetails={userDetails}>
						<Navigation />
					</GlobalState>
				) : (
					<View style={styles.offlineView}>
						<Ionicons name="cloud-offline" size={50} color={Colors.tomato} />
						<Text style={styles.offlineText}>You are offline</Text>
					</View>
				)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
	offlineView: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.lightGrey,
	},
	offlineText: {
		fontSize: 14,
		color: Colors.textColor,
	},
	container: {
		flex: 1,
	},
});
