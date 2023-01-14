import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  View,
} from "react-native";
import { Colors } from "../config";
import { Ionicons } from "@expo/vector-icons";

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  modalbox: {
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
    height: "100%",
    justifyContent: "flex-end",
  },
  modalbody: {
    backgroundColor: Colors.primary,
    height: "auto",
    maxHeight: parseInt(windowHeight / 3),
    bottom: 0,
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeButton: {
    position: "absolute",
    zIndex: 11,
    top: 3,
    right: 3,
    backgroundColor: "#007968",
    width: 30,
    height: 30,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 26,
  },
});

export default function ModalMenu(props) {
  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={props.modalBoxStyle || styles.modalbox}>
        <View style={props.modalBodyStyle || styles.modalbody}>
          <ScrollView contentContainerStyle={props.scrollViewStyle || {}}>
            {props.children}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={props.closeAction}
          >
            <Ionicons name="close-outline" style={styles.closeButtonText} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
