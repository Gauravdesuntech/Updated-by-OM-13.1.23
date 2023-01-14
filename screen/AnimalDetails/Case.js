import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import Colors from "../../config/colors";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import { AntDesign } from "@expo/vector-icons";
import { InputDropdown } from "../../component";
import styles from "../../config/Styles";
import Configs from "../../config/Configs";
import AppContext from '../../context/AppContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    getUsers
} from "../../services/UserManagementServices";
const Case = () => {
    const context = useContext(AppContext);
    const [showRequestedDate, setShowRequestedDate] = useState(false);
    const [requesteddob, setRequesteddob] = useState(new Date());
    const [requestedType, setRequestedType] = useState("");
    const [requeste, setRequestd] = useState("");
    const [isRequesetedMenuOpen, setIsRequestedMenuOpen] = useState(false);
    const [requesteGroups, setRequesteGroups] = useState([]);
    const [showCollectionDate, setShowCollectionDate] = useState(false);
    const [collectiondob, setCollectiondob] = useState(new Date());
    const [collectionType, setCollectionType] = useState("");
    const [CollectionReason, setCollectionReason] = useState("");
    const [isCollectionReasonMenuOpen, setIsCollectionReasonMenuOpen] = useState(false);
    const [restraintType, setRestraintType] = useState("");
    const [isRestraintTypeMenuOpen, setIsRestraintTypeMenuOpen] = useState(false);
    const [fasting, setFasting] = useState("");
    const [isFastingMenuOpen, setIsFastingMenuOpen] = useState(false);
    const [animalHealth, setAnimalHealth] = useState("");
    const [isAnimalHealthMenuOpen, setIsAnimalHealthMenuOpen] = useState(false);
    const [activityLevel, setActivityLevel] = useState("");
    const [isActivityLevelMenuOpen, setIsActivityLevelMenuOpen] = useState(false);
    const [sampleType, setSampleType] = useState("");
    const [isSampleTypeMenuOpen, setIsSampleTypeMenuOpen] = useState(false);
    const [sampleSite, setSampleSite] = useState("");
    const [isSampleSiteMenuOpen, setIsSampleSiteMenuOpen] = useState(false);
    const [collectionUser, setCollectionUser] = useState("");
    const [isCollectionUserMenuOpen, setIsCollectionUserMenuOpen] = useState(false);

    //====this datePicker function is Requested date ====>
    const ShowRequestedDatePicker = (requestedType) => {
        setShowRequestedDate(true)
        setRequestedType(requestedType)
    }
    const handleConfirmRequestedDate = (selectDate) => {
        const currentDate = selectDate || requesteddob;
        if (requestedType == 'requesteddob') {
            setRequesteddob(currentDate)
        }
        RequestedHideDatePicker();
    }
    const RequestedHideDatePicker = () => {
        setShowRequestedDate(false)
    }

    //====this datePicker function is Collection ====>
    const ShowCollectionDatePicker = (CollectionType) => {
        setShowCollectionDate(true)
        setCollectionType(CollectionType)
    }
    const handleConfirmCollectionDate = (selectDate) => {
        const currentDate = selectDate || collectiondob;
        if (collectionType == 'collectiondob') {
            setCollectiondob(currentDate)
        }
        CollectionHideDatePicker();
    }
    const CollectionHideDatePicker = () => {
        setShowCollectionDate(false)
    }

    //=========>this functions for Requested BY====> 
    const HandleSetRequestedType = (v) => {
        setRequestd(v.name);
        setIsRequestedMenuOpen(false);
    }
    const toggleRequestedTypeMenu = () => {
        setIsRequestedMenuOpen(!isRequesetedMenuOpen)
    };

    //==> this function for Collection Reason ==>
    const HandleSetCollectionReason = (v) => {
        setCollectionReason(v.name);
        setIsCollectionReasonMenuOpen(false);
    }
    const toggleCollectionReasonMenu = () => {
        setIsCollectionReasonMenuOpen(!isCollectionReasonMenuOpen)
    };

    //==> this function for Collection User==>
    const HandleSetCollectionUser = (v) => {
        setCollectionUser(v.name);
        setIsCollectionUserMenuOpen(false);
    }
    const toggleCollectionUserMenu = () => {
        setIsCollectionUserMenuOpen(!isCollectionUserMenuOpen)
    };


    //==> this function for Restraint Type ==>
    const HandleSetRestraintType = (v) => {
        setRestraintType(v.name);
        setIsRestraintTypeMenuOpen(false);
    }
    const toggleRestraintTypeMenu = () => {
        setIsRestraintTypeMenuOpen(!isCollectionReasonMenuOpen)
    };

    //==> this function for Fasting ==>
    const HandleSetFasting = (v) => {
        setFasting(v.name);
        setIsFastingMenuOpen(false);
    }
    const toggleFastingMenu = () => {
        setIsFastingMenuOpen(!isFastingMenuOpen)
    };

    //==> this function for Animal Health ==>
    const HandleSetAnimalHealth = (v) => {
        setAnimalHealth(v.name);
        setIsAnimalHealthMenuOpen(false);
    }
    const toggleAnimalHealthMenu = () => {
        setIsAnimalHealthMenuOpen(!isAnimalHealthMenuOpen)
    };

    //==> this function for Fasting ==>
    const HandleSetActivityLevel = (v) => {
        setActivityLevel(v.name);
        setIsActivityLevelMenuOpen(false);
    }
    const toggleActivityLevelMenu = () => {
        setIsActivityLevelMenuOpen(!isActivityLevelMenuOpen)
    };

    //==> this function for Sample Type ==>
    const HandleSetSampleType = (v) => {
        setSampleType(v.name);
        setIsSampleTypeMenuOpen(false);
    }
    const toggleSampleTypeMenu = () => {
        setIsSampleTypeMenuOpen(!isActivityLevelMenuOpen)
    };

    //==> this function for Sample Site ==>
    const HandleSetSampleSite = (v) => {
        setSampleSite(v.name);
        setIsSampleSiteMenuOpen(false);
    }
    const toggleSampleSiteMenu = () => {
        setIsSampleSiteMenuOpen(!isSampleSiteMenuOpen)
    };

    // this is useEffect hook use for API Calling ===>
    useEffect(() => {
        let cid = context.userDetails.cid;
        let methods = [
            getUsers(cid)
        ];

        Promise.all(methods).then((response) => {
            // console.log(response, "respon====>")
            let RequesteGroups = response[0].map((v) => ({ id: v.id, name: v.full_name }));
            setRequesteGroups(RequesteGroups);
        }).catch((error) => console.log(error));

    }, [])

    return (
        <>
            <KeyboardAwareScrollView extraHeight={"auto"}>
                <View>
                    <View style={style.inputContainer}>
                        <Text style={style.labels}>Entity ID  :</Text>
                        <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                    </View>
                    <View style={[styles.fieldBox]}>
                        <Text style={styles.labelName}>Requested Date : </Text>
                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }} onPress={() => { ShowRequestedDatePicker("requesteddob") }}>
                            <Text style={styles.dateField}>{requesteddob.toDateString()}</Text>
                            <AntDesign name="calendar" color={Colors.primary} size={20} />
                        </TouchableOpacity>
                    </View>
                    <InputDropdown
                        label={"Request By :"}
                        items={requesteGroups}
                        isMandatory={true}
                        value={requeste}
                        isOpen={isRequesetedMenuOpen}
                        openAction={toggleRequestedTypeMenu}
                        closeAction={toggleRequestedTypeMenu}
                        setValue={HandleSetRequestedType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, requeste ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={[
                            styles.fieldBox
                        ]}
                    />
                    <View style={style.inputContainer}>
                        <Text style={style.labels}>Case ID  :</Text>
                        <TextInput style={style.inputstyle} autoCapitalize='none'></TextInput>
                    </View>
                    <InputDropdown
                        label={"Collection User :"}
                        items={requesteGroups}
                        isMandatory={true}
                        value={collectionUser}
                        isOpen={isCollectionUserMenuOpen}
                        openAction={toggleCollectionUserMenu}
                        closeAction={toggleCollectionUserMenu}
                        setValue={HandleSetCollectionUser}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, collectionUser ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={[
                            styles.fieldBox
                        ]}
                    />
                    <View style={[styles.fieldBox]}>
                        <Text style={styles.labelName}>Collection  Date : </Text>
                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }} onPress={() => { ShowCollectionDatePicker("collectiondob") }}>
                            <Text style={styles.dateField}>{collectiondob.toDateString()}</Text>
                            <AntDesign name="calendar" color={Colors.primary} size={20} />
                        </TouchableOpacity>
                    </View>

                    <InputDropdown
                        label={"Collection Reason :"}
                        value={CollectionReason}
                        isOpen={isCollectionReasonMenuOpen}
                        items={Configs.COLLECTION_REASON}
                        openAction={toggleCollectionReasonMenu}
                        closeAction={toggleCollectionReasonMenu}
                        setValue={HandleSetCollectionReason}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, CollectionReason ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Restraint Type :"}
                        value={restraintType}
                        isOpen={isRestraintTypeMenuOpen}
                        items={Configs.RESTRAINT}
                        openAction={toggleRestraintTypeMenu}
                        closeAction={toggleRestraintTypeMenu}
                        setValue={HandleSetRestraintType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, restraintType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Activity Type :"}
                        value={activityLevel}
                        isOpen={isActivityLevelMenuOpen}
                        items={Configs.ACTIVITY_LEVEL}
                        openAction={toggleActivityLevelMenu}
                        closeAction={toggleActivityLevelMenu}
                        setValue={HandleSetActivityLevel}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, activityLevel ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Fasting :"}
                        value={fasting}
                        isOpen={isFastingMenuOpen}
                        items={Configs.FASTING}
                        openAction={toggleFastingMenu}
                        closeAction={toggleFastingMenu}
                        setValue={HandleSetFasting}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, fasting ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Animal Health :"}
                        value={animalHealth}
                        isOpen={isAnimalHealthMenuOpen}
                        items={Configs.ANIMAL_HEALTH}
                        openAction={toggleAnimalHealthMenu}
                        closeAction={toggleAnimalHealthMenu}
                        setValue={HandleSetAnimalHealth}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, animalHealth ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Sample Type:"}
                        value={sampleType}
                        isOpen={isSampleTypeMenuOpen}
                        items={Configs.SAMPLE_TYPE}
                        openAction={toggleSampleTypeMenu}
                        closeAction={toggleSampleTypeMenu}
                        setValue={HandleSetSampleType}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, sampleType ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                    <InputDropdown
                        label={"Sample Site:"}
                        value={sampleSite}
                        isOpen={isSampleSiteMenuOpen}
                        items={Configs.SAMPLE_SITE}
                        openAction={toggleSampleSiteMenu}
                        closeAction={toggleSampleSiteMenu}
                        setValue={HandleSetSampleSite}
                        labelStyle={styles.labelName}
                        textFieldStyle={[styles.textfield, sampleSite ? [styles.width50, { paddingLeft: 0 }] : null,]}
                        style={styles.fieldBox}
                    />

                </View>
                <DateTimePickerModal
                    mode={'date'}
                    display={Platform.OS == 'ios' ? 'inline' : 'default'}
                    isVisible={showCollectionDate}
                    onConfirm={handleConfirmCollectionDate}
                    onCancel={CollectionHideDatePicker}
                />
                <DateTimePickerModal
                    mode={'date'}
                    display={Platform.OS == 'ios' ? 'inline' : 'default'}
                    isVisible={showRequestedDate}
                    onConfirm={handleConfirmRequestedDate}
                    onCancel={RequestedHideDatePicker}
                />
            </KeyboardAwareScrollView>
        </>
    )

}
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

})

export default Case;