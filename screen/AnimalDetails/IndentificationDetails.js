// Created By gaurav shukla
// Created on 4/01/2023


import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import styles from "../../config/Styles";
import Configs from "../../config/Configs";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DatePicker, InputDropdown } from "../../component";
import {
    getAnimalGroups,
    getAllCategory,
    getAllSubCategory,
    getCommonNames,
} from "../../services/APIServices";
import AppContext from '../../context/AppContext';
import { DataTable } from 'react-native-paper';

const IdentificationDetail = () => {
    const [show, setShow] = useState(false);
    const [dob, setDob] = useState(new Date());
    const [type, setType] = useState("");
    const context = useContext(AppContext);
    const [animalGroupsType, setAnimalGroupsType] = useState("");
    const [isAnimalsGroupsTypeMenuOpen, setIsAnimalGroupsTypeMenuOpen] = useState(false);
    const [animalGroups, setAnimalGroups] = useState([])
    const [categoryType, setCategoryType] = useState("");
    const [iscategoryTypeMenuOpen, setIsCategoryTypeMenuOpen] = useState(false);
    const [category, setCategory] = useState([])
    const [subCategoryType, setSubCategoryType] = useState("");//   value={categoryType}
    const [isSubCategoryTypeMenuOpen, setIsSubCategoryTypeMenuOpen] = useState(false);
    const [subCategory, setSubCategory] = useState([])////   items={category}
    const [commonNameType, setCommonNameType] = useState("");
    const [isCommonNameTypeMenuOpen, setIsCommonNameTypeMenuOpen] = useState(false);
    const [commonName, setCommonName] = useState([]);
    const [ScientificNameType, setScientificNameType] = useState("");
    const [entityType, setEntityType] = useState("");
    const [isEntityTypeMenuOpen, setIsEntityTypeMenuOpen] = useState(false);
    const [sexType, setSexType] = useState("");
    const [isSexTypeMenuOpen, setIsSexTypeMenuOpen] = useState(false);
    const [collectionType, SetCollectionType] = useState("Exhibition");
    const [isCollectionTypeMenuOpen, setIsCollectionTypeMenuOpen] = useState(false);
    const [hybridType, setHybridType] = useState("Not a hybrid");
    const [isHybridTypeMenuOpen, setIsHybridTypeMenuOpen] = useState(false);
    const [isIdentificationModalOpen, setIsIdentificationModalOpen] = useState("");
    const [selectSectionType, setSelectSectionType] = useState("");
    const [isSelectSectionTypeMenuOpen, setIsSelectSectionTypeMenuOpen] = useState(false);
    const [showInputFiled, setShowInputFiled] = useState(false);
    const [searchValue, setSearchValue] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [showIdentification, setShowIdentification] = useState([])

    //===> this function for DatePicker ==>
    const ShowDatePicker = (type) => {
        setShow(true)
        setType(type)
    }
    const handleConfirm = (selectDate) => {
        const currentDate = selectDate || dob;
        if (type == 'dob') {
            setDob(currentDate)
        }
        hideDatePicker();
    }
    const hideDatePicker = () => {
        setShow(false)
    }

    //=========>this functions for category ====> 
    const HandleSetAnimalGroupsType = (v) => {
        let cid = context.userDetails.cid;
        setAnimalGroupsType(v.name);
        setIsAnimalGroupsTypeMenuOpen(false);
        setCategoryType("");
        setSubCategoryType("");
        setCommonNameType("");
        setScientificNameType("");

        getAllCategory(cid, v.id).then((response) => {
            console.log(response,"categroy==>")

            let Category = response.map((v) => ({ id: v.id, name: v.cat_name }));
            setCategory(Category);
        }).catch((error) => console.log(error));
    }
    const toggleAnimalGroupsTypeMenu = () => {
        setIsAnimalGroupsTypeMenuOpen(!isAnimalsGroupsTypeMenuOpen)
    };

    //===>this Function for Subcategory==>
    const HandleSetCategoryType = (v) => {
        let cid = context.userDetails.cid;
        setCategoryType(v.name);
        setIsCategoryTypeMenuOpen(false);
        setSubCategoryType("");
        getAllSubCategory(cid, v.id).then((response) => {
            console.log(response,"SubCategroy==>")
            let SubCategory = response.map((v) => ({ id: v.id, name: v.cat_name }));
            setSubCategory(SubCategory);
        }).catch((error) => console.log(error));
    }
    const toggleCategoryTypeMenu = () => {
        setIsCategoryTypeMenuOpen(!iscategoryTypeMenuOpen)
    };
    //===>this Function for Subcategory Name==>
    const HandleSetSubCategoryType = (v) => {
        let cid = context.userDetails.cid;
        setSubCategoryType(v.name);
        setIsSubCategoryTypeMenuOpen(false);
        getCommonNames({cid : cid, sub_category : v.id}).then((response) => {
            let CommonName = response.map((v) => ({ id: v.id, name: v.common_name, scientific_name: v.scientific_name }));
            setCommonName(CommonName);
        }).catch((error) => console.log(error));
    }
    const toggleSubCategoryTypeMenu = () => {
        setIsSubCategoryTypeMenuOpen(!isSubCategoryTypeMenuOpen)
    };

    //===> this Function for Common name==>
    const HandleSetCommonType = (v) => {
        setCommonNameType(v.name);
        setScientificNameType(v.scientific_name);
        setIsCommonNameTypeMenuOpen(false);
    }
    const toggleCommonNameTypeMenu = () => {
        setIsCommonNameTypeMenuOpen(!isCommonNameTypeMenuOpen)
    };

    //==> this function for Entity Type==>
    const HandleSetEntityType = (v) => {
        setEntityType(v.name);
        setIsEntityTypeMenuOpen(false);
    }
    const toggleEntityTypeMenu = () => {
        setIsEntityTypeMenuOpen(!isEntityTypeMenuOpen)
    };

    //==> this function for Sex Type==>
    const HandleSetSexType = (v) => {
        setSexType(v.name);
        setIsSexTypeMenuOpen(false);
    }
    const toggelSexTypeMenu = () => {
        setIsSexTypeMenuOpen(!isSexTypeMenuOpen);
    }

    //==>this function for CollectionType==>
    const HandleSetCollectionType = (v) => {
        SetCollectionType(v.name);
        setIsCollectionTypeMenuOpen(false);
    }
    const toggelCollectionTypeMenu = () => {
        setIsCollectionTypeMenuOpen(!isCollectionTypeMenuOpen)
    }

    //==>this function for Hybrid Type==>
    const HandleSetHybridType = (v) => {
        setHybridType(v.name)
        setIsHybridTypeMenuOpen(false);
    }
    const toggelHybridTypeMenu = () => {
        setIsHybridTypeMenuOpen(!isHybridTypeMenuOpen)
    }

    //==>this functin for Select Section==>
    const HandleSetSelectSectionType = (v) => {
        setSelectSectionType(v.name)
        setIsSelectSectionTypeMenuOpen(false);
        setShowInputFiled(true);
    }
    const toggelSelectSectionTypeMenu = () => {
        setIsSelectSectionTypeMenuOpen(!isSelectSectionTypeMenuOpen)
    }

    //===> this function for Indetification Type==>
    const openSearchModal = () => {
        setIsIdentificationModalOpen(true)
        setSearchValue("")
    };
    const closeSearchModal = () => {
        setIsIdentificationModalOpen(false)
        setSearchValue("")
    };

    //===> this function for the Cancel and Save Button==>
    const HandleSave = () => {
        setIsIdentificationModalOpen(false)
        let value = { showSection: selectSectionType, searchValue: searchValue }
        let arr = showIdentification;
        arr.push(value);
        setShowIdentification(arr);
        setShowTable(true);
    };

    const HandleCancel = () => {
        setIsIdentificationModalOpen(false);
    }

    useEffect(() => {
        let cid = context.userDetails.cid;
        let methods = [
            getAnimalGroups(cid),
        ];

        Promise.all(methods).then((response) => {
            let animalGroups = response[0].map((v) => ({ id: v.id, name: v.group_name }));
            setAnimalGroups(animalGroups);
        }).catch((error) => console.log(error));

    }, [])

    return (
        <>
            <KeyboardAwareScrollView extraHeight={"auto"}>
                <View style={style.mainContainer}>
                    <View style={[styles.fieldBox]}>
                        <Text style={styles.labelName}>Date Of Birth: </Text>
                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }} onPress={() => { ShowDatePicker("dob") }}>
                            <Text style={styles.dateField}>{dob.toDateString()}</Text>
                            <AntDesign name="calendar" color={Colors.primary} size={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={style.inputContainer}>
                        <Text style={style.labels}>Entity ID :</Text>
                        <TextInput style={style.EntityInupt} autoCapitalize='none'></TextInput>
                    </View>

                    <InputDropdown
                        label={"Class :"}
                        items={animalGroups}
                        isMandatory={true}
                        value={animalGroupsType}
                        isOpen={isAnimalsGroupsTypeMenuOpen}
                        openAction={toggleAnimalGroupsTypeMenu}
                        closeAction={toggleAnimalGroupsTypeMenu}
                        setValue={HandleSetAnimalGroupsType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, animalGroupsType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={[
                            styles.fieldBox
                        ]}
                    />


                    <InputDropdown
                        label={"Category :"}
                        items={category}
                        isMandatory={true}
                        value={categoryType}
                        isOpen={iscategoryTypeMenuOpen}
                        openAction={toggleCategoryTypeMenu}
                        closeAction={toggleCategoryTypeMenu}
                        setValue={HandleSetCategoryType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, categoryType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={" SubCategory :"}
                        items={subCategory}
                        isMandatory={true}
                        value={subCategoryType}
                        isOpen={isSubCategoryTypeMenuOpen}
                        openAction={toggleSubCategoryTypeMenu}
                        closeAction={toggleSubCategoryTypeMenu}
                        setValue={HandleSetSubCategoryType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, subCategoryType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={" Common Name:"}
                        items={commonName}
                        isMandatory={true}
                        value={commonNameType}
                        isOpen={isCommonNameTypeMenuOpen}
                        openAction={toggleCommonNameTypeMenu}
                        closeAction={toggleCommonNameTypeMenu}
                        setValue={HandleSetCommonType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, commonNameType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}

                    />


                    <View style={style.inputContainer}>
                        <Text style={style.labels}>Scientific Name :</Text>
                        <TextInput style={style.ScientificInputstyle} autoCapitalize='none' value={ScientificNameType}></TextInput>
                    </View>

                    <InputDropdown
                        label={"Entity Type :"}
                        value={entityType}
                        isOpen={isEntityTypeMenuOpen}
                        items={Configs.ENTITY_TYPE_TAB_MENU}
                        openAction={toggleEntityTypeMenu}
                        closeAction={toggleEntityTypeMenu}
                        setValue={HandleSetEntityType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, entityType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Collection Type :"}
                        value={collectionType}
                        isOpen={isCollectionTypeMenuOpen}
                        items={Configs.COLLECTION_TYPE_TAB_MENU}
                        openAction={toggelCollectionTypeMenu}
                        closeAction={toggelCollectionTypeMenu}
                        setValue={HandleSetCollectionType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, collectionType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Sex :"}
                        value={sexType}
                        isOpen={isSexTypeMenuOpen}
                        items={Configs.SEX}
                        openAction={toggelSexTypeMenu}
                        closeAction={toggelSexTypeMenu}
                        setValue={HandleSetSexType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, sexType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Hybrid :"}
                        value={hybridType}
                        isOpen={isHybridTypeMenuOpen}
                        items={Configs.HYBRID_TYPE_TAB_MENU}
                        openAction={toggelHybridTypeMenu}
                        closeAction={toggelHybridTypeMenu}
                        setValue={HandleSetHybridType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, hybridType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <View style={style.inputContainer}>
                        <Text style={style.labels}>Given Name :</Text>
                        <TextInput style={style.GivenInputstyle} autoCapitalize='none'></TextInput>
                    </View>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.fieldBox}
                        onPress={openSearchModal}
                    >
                        <Text style={styles.labelName}>Identification :</Text>
                        <TextInput
                            editable={false}
                            //value={showSection}
                            // onChangeText={() => setIdentification({ indetification })}
                            style={[styles.textfield, { width: '50%' }]}
                            autoCompleteType="off"
                        />
                        <Ionicons name="add" size={26} color="black" style={style.ionicons} />
                    </TouchableOpacity>
                    {showTable == true ? (
                        <DataTable style={style.Table_container}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title> Section name</DataTable.Title>
                                <DataTable.Title>Code</DataTable.Title>
                            </DataTable.Header>
                            {showIdentification?.map((data, index) => {
                                return (
                                    <DataTable.Row key={index}>
                                        <DataTable.Cell>{data.showSection}</DataTable.Cell>
                                        <DataTable.Cell>{data.searchValue}</DataTable.Cell>
                                    </DataTable.Row>
                                );
                            })}
                        </DataTable>
                    ) : null}

                    <View style={style.inputContainer}>
                        <Text style={style.labels}>Govt Reg # :</Text>
                        <TextInput style={style.GovtInputstyle} autoCapitalize='none'></TextInput>
                    </View>
                </View>
                <TouchableOpacity
                    style={[style.SaveBtn, { width: "40%" }]}
                >
                    <Text style={{ color: Colors.white, fontSize: Colors.lableSize, }} onPress={HandleSave}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[style.CancelBtn, { width: "40%" }]}
                >
                    <Text style={{ color: Colors.white, fontSize: Colors.lableSize, }} onPress={HandleCancel}>Cancel</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    mode={'date'}
                    display={Platform.OS == 'ios' ? 'inline' : 'default'}
                    isVisible={show}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isIdentificationModalOpen}
                >
                    <View style={styles.searchModalOverlay}>
                        <View style={styles.seacrhModalContainer}>
                            <View style={styles.searchModalHeader}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.headerBackBtnContainer}
                                    onPress={closeSearchModal}
                                >
                                    <Ionicons name="arrow-back" size={25} color={Colors.white} />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text
                                        style={{
                                            fontSize: Colors.headerSize,
                                            color: Colors.white,
                                        }}
                                    >
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.searchModalBody}>
                                <View
                                    style={styles.formBorder}
                                >
                                    <InputDropdown
                                        label={"Select Section:"}
                                        value={selectSectionType}
                                        isOpen={isSelectSectionTypeMenuOpen}
                                        items={Configs.Select_Section}
                                        openAction={toggelSelectSectionTypeMenu}
                                        closeAction={toggelSelectSectionTypeMenu}
                                        setValue={HandleSetSelectSectionType}
                                        labelStyle={styles.labelName}
                                        textFieldStyle={[styles.textfield, selectSectionType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                                        style={[styles.fieldBox]}
                                    />
                                    {showInputFiled == true ? (
                                        <View style={[styles.fieldBox, {
                                            borderRadius: 3,
                                            borderColor: "#ddd",
                                            borderTopWidth: 1, borderBottomWidth: 0
                                        }]}>
                                            <TextInput
                                                autoCompleteType="off"
                                                autoCapitalize="none"
                                                placeholder={"Type Code"}
                                                value={searchValue}
                                                style={[
                                                    styles.textfield,]}
                                                onChangeText={(text) =>
                                                    setSearchValue(text)
                                                }
                                            />
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                }}
                            >
                                <TouchableOpacity activeOpacity={1} onPress={HandleSave}>
                                    <Text style={[styles.buttonText, styles.saveBtnText]}>
                                        SAVE
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} onPress={HandleCancel}>
                                    <Text style={[styles.buttonText, styles.exitBtnText]}>
                                        CANCEL
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAwareScrollView>
        </>
    )
};

const style = StyleSheet.create({

    mainContainer: {
        width: "auto",
        marginVertical: 1,
        borderColor: "black",
        alignItems: "baseline",
    },


    inputContainer: {
        width: "100%",
    },

    labels: {
        position: "absolute",
        top: 9,
        left: 10,
        fontSize: Colors.lableSize,
    },

    GivenInputstyle: {
        position: "relative",
        top: -1,
        left: 0,
        padding: 7,
        paddingLeft: 180,
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
    ionicons: {
        position: "relative",
        top: 2,
        right: 140,
    },
    EntityInupt: {
        position: "relative",
        top: -1,
        left: 0,
        padding: 7,
        paddingLeft: 180,
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
    ScientificInputstyle: {
        position: "relative",
        top: -1,
        left: 0,
        padding: 7,
        paddingLeft: 180,
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
    GovtInputstyle: {
        position: "relative",
        top: -1,
        left: 0,
        padding: 7,
        paddingLeft: 180,
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
    SaveBtn: {
        position: "relative",
        top: 28,
        left: 15,
        alignItems: "center",
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 20,
        color: "#fff",
        marginTop: 15,
    },
    CancelBtn: {
        position: "relative",
        bottom: 28,
        left: 180,
        alignItems: "center",
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 20,
        color: "#fff",
        marginTop: 15,
    },

})

export default IdentificationDetail;

