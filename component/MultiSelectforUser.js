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

export default class MultiSelectforUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalOpen: false,
            selectedItems: props.selectedItems ? props.selectedItems : [],
            searchValue: "",
        };

    }

    getData = () => {
        let { searchValue } = this.state;
        let items = this.props.items || [];

        let data = items.filter((element) => {
            let name = element.name.toLowerCase();
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

        this.setState({ selectedItems: arr }, () => this.props.onSave(arr));
    };

    isItemSelected = (id) => {
        let selectedItems = this.state.selectedItems.length == 0 ? this.props.selectedItems : this.state.selectedItems;
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

        this.setState({ selectedItems: selectedItems },
            () => {
                this.props.onSave(selectedItems);
            });
    };

    renderListItem = ({ item }) => (
        <ListItem
            name={item.name}
            isChecked={this.isItemSelected(item.id)}
            onPress={this.toggleItemSelect.bind(this, item)}
        />
    );

    render = () => (
        <>
            <View style={[styles.fieldBox, this.props.style]}>
                <TouchableWithoutFeedback style={{ width: '100%'}} onPress={() => this.setState({ isModalOpen: !this.state.isModalOpen })}>
                <View style={{flexDirection:'row' , justifyContent : 'space-between' , alignItems:'center'}}>   
                    <Text style={[styles.labelName, this.props.labelStyle]}>
                        {this.props.label}
                    </Text>
                    <AntDesign name="caretdown" size={12} color={Colors.primary} />
                    </View> 
                </TouchableWithoutFeedback>
                {/* {this.props.selectedItems && this.props.selectedItems.length > 0 ? ( */}
                {this.state.isModalOpen ? (
                    <View style={styles.modalBody}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.selectAllBtn}
                            onPress={this.toggleSelectAll}
                        >
                            <MaterialCommunityIcons
                                name={
                                    this.state.selectedItems && this.state.selectedItems.length ===
                                        (this.props.items || []).length
                                        ? "checkbox-multiple-marked"
                                        : "checkbox-multiple-blank-outline"
                                }
                                size={20}
                                color={Colors.primary}
                            />
                        </TouchableOpacity>
                        <FlatList
                            data={this.getData()}
                            renderItem={this.renderListItem}
                            keyExtractor={(item, index) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={this.getData().length}
                            ListEmptyComponent={this.listEmptyComponent.bind(this)}
                        // keyboardShouldPersistTaps="handled"
                        />
                    </View>
                ) : null}
                {/* ) : (
						<View
							style={[
								styles.placeHolderContainer,
								this.props.placeHolderContainer,
							]}
						>
							<Text style={[styles.placeholder, this.props.placeholderStyle]}>
								{typeof this.props.placeholder !== "undefined"
									? this.props.placeholder
									: "Select an option"}
							</Text>
						</View>
					)}
                        */}
            </View>
            {false ? (
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
                                                this.state.selectedItems && this.state.selectedItems.length ===
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
        alignSelf: "flex-end",
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
    listViewContainer: {

    },

    listViewCapsule: {
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
    },
    listViewText: {
        width: "72%",
        fontSize: 16,
        color: Colors.textColor,
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
        marginVertical: 5,
        borderRadius: 30,
        backgroundColor: Colors.primary,
    },
    capsuleText: {
        fontSize: 14,
        color: Colors.white,
    },
    placeHolderContainer: {
        width: "100%",
        padding: 12,
        // borderWidth: 1,
    },
    placeholder: {
        fontSize: 16,
    },
});
