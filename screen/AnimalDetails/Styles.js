// Created By Tuhin
// Created on 25/11/2011

import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../config/colors";

const styles = StyleSheet.create({
  pl0: { paddingLeft: 0 },
  width45: { width: "45%" },
  animalImage: { height: 30, width: 30 },
  animalDefaultImage: { fontSize: 40, color: "#adadad" },
  headerTitleContainerText: {
    fontSize: 20,
    color: Colors.white,
  },
  btnText: {
    color: Colors.white,
    fontSize: Colors.lableSize,
  },
  submitBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  multiLineTextInput: {
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    shadowColor: "#999",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default styles;
