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
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../config/colors";

class ListItem extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return this.props.isChecked !== nextProps.isChecked;
  };

  render = () => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.listItem}
      onPress={this.props.onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons
          name={
            this.props.isChecked ? "checkbox-marked" : "checkbox-blank-outline"
          }
          color={Colors.primary}
          size={19}
        />
        <Text style={{ marginLeft: 5, fontSize: 18, color: Colors.textColor }}>
          {this.props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default class MultiSelectDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedItems:
        this.props.selectedItems?.length !== 0 ? this.props.selectedItems : [],
      searchValue: "",
    };
  }

  componentDidMount = () => {
    // console.log({ selectedItems: this.state.selectedItems });
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

  toggleItemSelect = (item) => {
    // console.log(item);return;
    let id = item.id;
    let arr = this.state.selectedItems;
    let index = arr.findIndex((element) => element.id === id);

    if (index > -1) {
      arr = arr.filter((element) => element.id !== id);
    } else {
      arr.push(item);
    }

    this.setState({ selectedItems: arr });
  };

  isItemSelected = (id) => {
    let selectedItems = this.state.selectedItems;
    let arr = (selectedItems || []).filter((element) => element.id === id);
    return arr.length === 1 ? true : false;
  };

  listEmptyComponent = () => (
    <Text style={styles.emptyText}>No Result Found</Text>
  );

  openModal = () => {
    this.setState({
      isModalOpen: true,
      selectedItems: this.props?.selectedItems ?? [],
      searchValue: "",
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedItems: [],
      searchValue: "",
    });
  };

  saveChanges = () => {
    let { selectedItems } = this.state;
    this.setState(
      {
        isModalOpen: false,
        selectedItems: [],
      },
      () => {
        this.props.onSave(selectedItems);
      }
    );
  };

  toggleSelectAll = () => {
    let { selectedItems } = this.state;
    let items = this.props.items || [];

    if (selectedItems.length === items.length) {
      selectedItems = [];
    } else {
      selectedItems = items;
    }

    this.setState({ selectedItems: selectedItems });
  };

  renderListItem = ({ item }) => (
    <ListItem
      name={item.name ? item.name : item.item}
      isChecked={this.isItemSelected(item.id)}
      onPress={this.toggleItemSelect.bind(this, item)}
    />
  );

  render = () => (
    <>
      <TouchableWithoutFeedback
        onPress={this.props.disabled ? null : this.openModal}
      >
        <View style={[styles.fieldBox, this.props.style]}>
          <Text style={[styles.labelName, this.props.labelStyle]}>
            {this.props.label}
            {this.props.isMandatory ? (
              <Text style={{ color: Colors.tomato }}> *</Text>
            ) : null}{" "}
          </Text>
          {this.props.selectedItems && this.props.selectedItems.length > 0 ? (
            <View
              style={[
                styles.selectedItemsContainer,
                this.props.selectedItemsContainer,
                // { width: "60%" },
              ]}
            >
              {this.props.selectedItems.map((element) => (
                <View key={element.id.toString()} style={styles.capsule}>
                  <Text style={styles.capsuleText}>
                    {element.name ? element.name : element.item}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.placeHolderContainer,
                this.props.placeHolderContainer,
                { width: "60%" },
              ]}
            >
              <AntDesign name="caretdown" size={12} color={Colors.primary} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {this.state.isModalOpen ? (
        <Modal
          animationType="none"
          transparent={true}
          statusBarTranslucent={true}
          visible={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.closeBtn}
                  onPress={this.closeModal}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={26}
                    color={Colors.textColor}
                  />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={22}
                    color="#ddd"
                  />
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
                <View style={styles.rightButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.selectAllBtn}
                    onPress={this.toggleSelectAll}
                  >
                    <MaterialCommunityIcons
                      name={
                        this.state.selectedItems &&
                        this.state.selectedItems.length ===
                          (this.props.items || []).length
                          ? "checkbox-multiple-marked"
                          : "checkbox-multiple-blank-outline"
                      }
                      size={26}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.saveBtn}
                    onPress={this.saveChanges}
                  >
                    <MaterialCommunityIcons
                      name="content-save"
                      size={26}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
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
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  fieldBox: {
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    height: "auto",
    justifyContent: "space-between",
  },
  labelName: {
    color: Colors.textColor,
    fontSize: 14,
  },
  textfield: {
    height: 40,
    fontSize: 12,
    color: Colors.textColor,
    width: "100%",
    padding: 5,
  },
  modalOverlay: {
    height: windowHeight,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: Math.floor(windowHeight * 0.7),
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
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
  },
  searchField: {
    width: "80%",
    paddingVertical: 4,
    color: Colors.textColor,
    fontSize: 15,
  },
  rightButtonContainer: {
    width: "20%",
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  selectAllBtn: {
    alignSelf: "center",
    padding: 5,
  },
  saveBtn: {
    alignSelf: "center",
    padding: 5,
  },
  saveBtnText: {
    fontSize: 18,
    color: Colors.primary,
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
  selectedItemsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  capsule: {
    height: 25,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 2,
    marginHorizontal: 3,
    marginVertical: 4,
    // borderRadius: 30,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  capsuleText: {
    fontSize: 14,
    color: Colors.white,
  },
  placeHolderContainer: {
    width: "100%",
    alignItems: "flex-end",
    opacity: 0.7,
    // padding: 12,
    // borderWidth: 1,
  },
  placeholder: {
    fontSize: 16,
  },
});
