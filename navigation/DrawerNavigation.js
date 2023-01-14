import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Colors from "../config/colors";
import Constants from "expo-constants"
import MainStackNavigation from "./StackNavigation";
import { Ionicons, FontAwesome, Octicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const styles = StyleSheet.create({
  drawerTop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    position: "relative",
    top: -5,
  },
  itemText: {
    marginLeft: -22,
  },
  iconStyle: {
    width: 25,
    color: Colors.textColor,
    fontSize: 20,
  },
});

const CustomDrawerContent = (props) => {
  const gotoLocation = () => props.navigation.navigate("Location");
  const gotoSettings = () => props.navigation.navigate("Settings");

  const gotoLogout = () => props.navigation.navigate("Logout");
  const gotoUpdate = () => props.navigation.navigate("VersionCheck");

  const gotoSync = () => props.navigation.navigate("Sync");
  const version = Constants.manifest.version;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerTop}>
        <Image
          source={require("../assets/image/logo.png")}
          resizeMode="cover"
        />
      </View>
      <DrawerItemList {...props} />

      <DrawerItem
        label={({ focused, color }) => (
          <Text style={[styles.itemText, { color }]}>{"Locations"}</Text>
        )}
        icon={({ focused, color }) => (
          <FontAwesome
            name="map-marker"
            style={[styles.iconStyle, focused ? { color: "#FFF" } : null]}
          />
        )}
        onPress={gotoLocation}
      />

      <DrawerItem
        label={({ focused, color }) => (
          <Text style={[styles.itemText, { color }]}>{"Settings"}</Text>
        )}
        icon={({ focused, color }) => (
          <Ionicons
            name="settings"
            style={[styles.iconStyle, focused ? { color: "#FFF" } : null]}
          />
        )}
        onPress={gotoSettings}
      />

      <DrawerItem
        label={({ focused, color }) => (
          <Text style={[styles.itemText, { color }]}>App Version                   v{version}</Text>
        )}
        icon={({ focused, color }) => (
          <Octicons name="versions" style={[styles.iconStyle, focused ? { color: "#FFF" } : null]} />
        )}
        onPress={gotoUpdate}
      />
      {/* <DrawerItem
        label={({ focused, color }) => (
          <Text style={[styles.itemText, { color }]}>{"Sync with Server"}</Text>
        )}
        icon={({ focused, color }) => (
          <Ionicons
            name="sync"
            style={[styles.iconStyle, focused ? { color: "#FFF" } : null]}
          />
        )}
        onPress={gotoSync}
      /> */}
      <DrawerItem
        label={({ focused, color }) => (
          <Text style={[styles.itemText, { color }]}>{"Sign Out"}</Text>
        )}
        icon={({ focused, color }) => (
          <Ionicons
            name="power"
            style={[styles.iconStyle, focused ? { color: "#FFF" } : null]}
          />
        )}
        onPress={gotoLogout}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContentOptions={{
      activeTintColor: "#fff",
      activeBackgroundColor: "#00B386",
      backgroundColor: "#E1FFF8",
      itemStyle: { marginVertical: 5 },
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Home"
      component={MainStackNavigation}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={[styles.itemText, { color }]}>{"Home"}</Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <Ionicons
            name="md-home"
            // size={20}
            // color={focused ? "#fff" : color}
            style={[styles.iconStyle, focused ? { color: "#FFF" } : null]}
          />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default DrawerNavigator;
