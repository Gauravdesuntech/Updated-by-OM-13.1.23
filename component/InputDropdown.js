import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  Dimensions,
  Keyboard,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";

export default class InputDropdown extends React.Component {
  state = {
    searchValue: "",
  };

  getData = () => {
    let { searchValue } = this.state;
    let items = this.props.items || [];

    let data = items.filter((element) => {
      let name = element.name
        ? element.name.toLowerCase()
        : element?.item?.toLowerCase();
      let index = name.indexOf(searchValue.toLowerCase());
      return index > -1;
    });

    return data;
  };

  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  setValue = (item) => {
    this.setState(
      {
        searchValue: "",
      },
      () => {
        this.props.setValue(item);
      }
    );
  };

  renderListItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.listItem}
      onPress={this.setValue.bind(this, item)}
    >
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
        {item.name ? item.name : item.item}
      </Text>
    </TouchableOpacity>
  );

  listEmptyComponent = () => (
    <Text style={styles.emptyText}>No Result Found</Text>
  );

  render = () => (
    <>
      <TouchableOpacity activeOpacity={1} onPress={this.props.openAction}>
        <View style={[styles.fieldBox, this.props.style]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.labelName, this.props.labelStyle]}>
              {this.props.label}
              {this.props.isMandatory ? (
                <Text style={{ color: Colors.tomato }}> *</Text>
              ) : null}
            </Text>
          </View>
          <Text
            style={
              this.props.value
                ? [
                    styles.textfield,
                    { width: "60%" },
                    this.props.textFieldStyle,
                  ]
                : [
                    styles.textfield,
                    this.props.textFieldStyle,
                    { opacity: 0.7 },
                  ]
            }
          >
            {this.props.value ? (
              this.props.value
            ) : (
              <AntDesign name="caretdown" size={12} color={Colors.primary} />
            )}
          </Text>
        </View>
      </TouchableOpacity>
      {this.props.isOpen ? (
        <Modal
          animationType="none"
          transparent={true}
          statusBarTranslucent={true}
          visible={true}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={this.hideKeyboard}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.closeBtn}
                    onPress={this.props.closeAction}
                  >
                    <Ionicons name="close" size={26} color={Colors.textColor} />
                  </TouchableOpacity>
                  <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color="#ddd" />
                    <TextInput
                      value={this.state.searchValue}
                      onChangeText={(searchValue) =>
                        this.setState({ searchValue })
                      }
                      autoCompleteType="off"
                      placeholder="Type something..."
                      style={styles.searchField}
                    />
                  </View>
                </View>

                <View style={styles.modalBody}>
                  <FlatList
                    data={this.getData()}
                    renderItem={this.renderListItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={this.getData().length}
                    ListEmptyComponent={this.listEmptyComponent.bind(this)}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  fieldBox: {
    width: "100%",
  },
  labelName: {
    color: Colors.textColor,
    fontSize: 14,
  },
  textfield: {
    height: 40,
    fontSize: 12,
    color: Colors.textColor,
    // width: "100%",
    padding: 5,
  },
  modalOverlay: {
    height: windowHeight,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: Math.floor(windowHeight * 0.5),
    elevation: 20,
  },
  modalHeader: {
    height: 50,
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    elevation: 0.4,
    alignItems: "center",
  },
  closeBtn: {
    width: "10%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  searchField: {
    width: "80%",
    paddingVertical: 4,
    color: Colors.textColor,
    fontSize: 15,
  },
  modalBody: {
    flex: 1,
    paddingVertical: 8,
  },
  listItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    color: Colors.textColor,
    opacity: 0.9,
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 40,
    fontSize: 14,
    color: "#555",
    opacity: 0.8,
  },
});
