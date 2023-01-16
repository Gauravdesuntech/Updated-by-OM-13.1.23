// Created By gaurav shukla
// Created on 12/01/2023

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput ,TouchableOpacity} from 'react-native';
import Colors from "../../config/colors";
import styles from "../../config/Styles";
import { InputDropdown } from "../../component";
import { Configs } from '../../config';
const SourceDetail = () => {
    const [sourceDetail, setSourceDetail] = useState("");
    const [isSourceDetailTypeMenuOpen, setIsSourceDetailTypeMenuOpen] = useState(false);
    const[remarks,setRemarks]=useState('');


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
                            <TextInput style={style.inputstyles} autoCapitalize='none'></TextInput>
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
                    <TextInput style={style.inputstyle} autoCapitalize='none' value={remarks} onChangeText={(Text)=>setRemarks(Text)}></TextInput>
                </View>
            </View>
            <TouchableOpacity
                    style={[style.SaveBtn, { width: "40%" }]}
                >
                    <Text style={{ color: Colors.white, fontSize: Colors.lableSize, }} >Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[style.CancelBtn, { width: "40%" }]}
                >
                    <Text style={{ color: Colors.white, fontSize: Colors.lableSize, }} >Cancel</Text>
                </TouchableOpacity>

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
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
    inputstyles:{
        position: "relative",
        top: -1,
        left: 0,
        padding: 7,
        paddingLeft: 220,
        width: "100%",
        borderWidth: 0.8,
        borderColor: "#ddd",
    },
    SaveBtn: {
        position:"relative",
        top:145,
        left:15,
        alignItems: "center",
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 20,
        color: "#fff",
        marginTop: 15,
      },
      CancelBtn: {
        position:"relative",
        top:90,
        left:180,
        alignItems: "center",
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 20,
        color: "#fff",
        marginTop: 15,
      },
})

export default SourceDetail;