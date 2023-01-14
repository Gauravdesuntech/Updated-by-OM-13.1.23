
// Created By Om Tripathi
// Created on 13/01/2023
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native';
import Colors from "../../config/colors";
import styles from "../../config/Styles";
import { Configs } from '../../config';
import { AntDesign, } from "@expo/vector-icons";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import InputDropdown from "../../component/InputDropdown";


const Mortality = () => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date())
    const [deathType, setDeathType] = useState("");
    const [isdeathTypeMenuOpen, setIsDeathTypeMenuOpen] = useState(false);
    const [carcassCondition, setCarcassCondition] = useState("");
    const [isCarcassConditionMenuOpen, setIsCarcassConditionMenuOpen] = useState(false);
    const [Necropsy, setNecropsy] = useState("");
    const [isNecropsyMenuOpen, setIsNecropsyMenuOpen] = useState(false);


    const ShowDatePicker = () => {
        setShow(true)
    }

    const handleConfirmDate = (selectStatusDate) => {
        setDate(selectStatusDate)
        hideDatePicker();
    }

    const hideDatePicker = () => {
        setShow(false)
        setStatusShow(false)
    }
    const HandleDeathType = (v) => {
        setDeathType(v.value);
        setIsDeathTypeMenuOpen(false);
    }

    const toggleDeathTypeMenuOpen = () => {
        setIsDeathTypeMenuOpen(!isdeathTypeMenuOpen)
    };

    const HandleCarcassConditionType = (v) => {
        setCarcassCondition(v.value);
        setIsCarcassConditionMenuOpen(false);
    }

    const toggleCarcassConditionTypeMenuOpen = () => {
        setIsCarcassConditionMenuOpen(!isCarcassConditionMenuOpen)
    };

     const HandleNecropsyType = (v) => {
        setNecropsy(v.value);
        setIsNecropsyMenuOpen(false);
    }

    const toggleNecropsyTypeMenuOpen = () => {
        setIsNecropsyMenuOpen(!isNecropsyMenuOpen)
    };
    return (
        <>
            <View>

                <View style={style.inputContainer}>
                    <Text style={style.labels}> Entity ID   :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.labels}>Mortality ID :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>


                <View style={style.inputContainer}>
                    <Text style={style.labels}>Entity Details  :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>
                <View style={[styles.fieldBox]}>
                    <Text style={styles.labelName}>Mortality Date : </Text>
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }} onPress={() => { ShowDatePicker("dob") }}>
                        <Text style={styles.dateField}>{date.toDateString()}</Text>
                        <AntDesign name="calendar" color={Colors.primary} size={20} />
                    </TouchableOpacity>
                </View>
                <InputDropdown
                    label={"Death Type:"}
                    isMandatory={true}
                    value={deathType}
                    isOpen={isdeathTypeMenuOpen}
                    items={Configs.DEATH_TYPE}
                    openAction={toggleDeathTypeMenuOpen}
                    closeAction={toggleDeathTypeMenuOpen}
                    setValue={HandleDeathType}
                    labelStyle={styles.labelName}
                    textFieldStyle={[styles.textfield, deathType ? styles.width50 : null,]}
                    style={[
                        styles.fieldBox,
                    ]} />

                <InputDropdown
                    label={"Carcass Condition:"}
                    isMandatory={true}
                    value={carcassCondition}
                    isOpen={isCarcassConditionMenuOpen }
                    items={Configs.CARCASS_CONDITION}
                    openAction={toggleCarcassConditionTypeMenuOpen}
                    closeAction={toggleCarcassConditionTypeMenuOpen}
                    setValue={HandleCarcassConditionType}
                    labelStyle={styles.labelName}
                    textFieldStyle={[styles.textfield, carcassCondition ? styles.width50 : null,]}
                    style={[
                        styles.fieldBox,
                    ]} />

                <View style={style.inputContainer}>
                    <Text style={style.labels}>Age / Estimated Age   :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>


                <InputDropdown
                    label={"Necropsy Request :"}
                    isMandatory={true}
                    value={Necropsy}
                    isOpen={isNecropsyMenuOpen }
                    items={Configs.NECROPSY_REQUEST 
                    }
                    openAction={toggleNecropsyTypeMenuOpen}
                    closeAction={toggleNecropsyTypeMenuOpen}
                    setValue={HandleNecropsyType}
                    labelStyle={styles.labelName}
                    textFieldStyle={[styles.textfield, Necropsy ? styles.width50 : null,]}
                    style={[
                        styles.fieldBox,
                    ]} />

                <View style={style.inputContainer}>
                    <Text style={style.label}>Carcass Disposition  :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>
            </View>

            <DateTimePickerModal
                mode={'date'}
                display={Platform.OS == 'ios' ? 'inline' : 'default'}
                isVisible={show}
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
            />
        </>
    )
};

export default Mortality;

const style = StyleSheet.create({
    mainContainer: {
        position: "relative",
        bottom: 9,
        left: 0,
        width: "auto",
        marginVertical: 10,
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
    label: {
        position: "absolute",
        top: 9,
        left: 10,
        fontWeight: "Bold",
    },
    inputstyle: {
        position: "relative",
        top: -1,
        left: 0,
        padding: 7,
        paddingLeft: 180,
        fontSize: Colors.lableSize,
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
})
