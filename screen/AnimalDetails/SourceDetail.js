// Created By gaurav shukla
// Created on 12/01/2023

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Colors from "../../config/colors";
import styles from "../../config/Styles";
import { InputDropdown } from "../../component";
import { Configs } from '../../config';
const SourceDetail = () => {
    const [sourceDetail, setSourceDetail] = useState("");
    const [isSourceDetailTypeMenuOpen, setIsSourceDetailTypeMenuOpen] = useState(false);
    const HandleSetSourceDetailType = (v) => {
        setSourceDetail(v.name);
        setIsSourceDetailTypeMenuOpen(false);
    }
    const toggleSourceDetailTypeMenu = () => {
        setIsSourceDetailTypeMenuOpen(!isSourceDetailTypeMenuOpen)
    };

    return (
        <>
            <View>
                <InputDropdown
                    label={"Source  :"}
                    value={sourceDetail}
                    isOpen={isSourceDetailTypeMenuOpen}
                    items={Configs.DATA}
                    openAction={toggleSourceDetailTypeMenu}
                    closeAction={toggleSourceDetailTypeMenu}
                    setValue={HandleSetSourceDetailType}
                    labelStyle={styles.labelName}
                    textFieldStyle={[styles.textfield, sourceDetail ? [styles.width50, { paddingLeft: 0 }] : null,]}
                    style={[styles.fieldBox]}
                />


                {(sourceDetail === 'Wild') ?
                    <>
                        <View style={style.inputContainer}>
                            <Text style={style.labels}>Location  :</Text>
                            <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                        </View>
                        <View style={style.inputContainer}>
                            <Text style={style.labels}>Condition  while it was Found  :</Text>
                            <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                        </View>
                    </>
                    :
                    <>
                        <View style={style.inputContainer}>
                            <Text style={style.labels}>Institution  :</Text>
                            <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                        </View>
                        <View style={style.inputContainer}>
                            <Text style={style.labels}>Former Entity ID  :</Text>
                            <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                        </View>
                    </>
                }

                <View style={style.inputContainer}>
                    <Text style={style.labels}>Purchase Bill # :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.labels}>Purchase Price  :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.labels}>From Location   :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.labels}>Remarks  :</Text>
                    <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                </View>
            </View>

        </>

    )
};
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

    inputstyle: {
        position: "relative",
        top: -1,
        left: 0,
        padding: 7,
        paddingLeft: 130,
        fontWeight: "bold",
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
    // ionicons: {
    //     position: "relative",
    //     top: 2,
    //     right: 180,
    // },
    // Table_container: {
    //     height: "auto",
    //     width:"100%",
    //     textAlign:"center",
    //     position: "relative",
    //     bottom: 0,
    //     left: 2,
    // },
    // tableHeader: {
    //     backgroundColor: '#DCDCDC',
    // },
})

export default SourceDetail;