import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../config";

const ScannerButton = (props) => {
  return (
 
    <View style={style.scannerBtn}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => props.btnPress()}>
        <Ionicons name="md-scan-outline" size={30} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default ScannerButton;

const style = StyleSheet.create({
  scannerBtn: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    
  },
});
