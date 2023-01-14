// Created By Tuhin
// Created on 25/11/2011

import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../config/colors";

const styles = StyleSheet.create({
  userProfileImageContainer: {
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
  },
  userProfileImage: { height: 75, width: 75 },
  defaultProfileImageIcon: { fontSize: 60, color: "#adadad" },
  forwardIcon: { width: "25%", padding: 5, alignItems: "flex-end" },
});

export default styles;
