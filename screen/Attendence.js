import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    TouchableHighlight,
    TextInput,
    Alert,
    Linking,
    Platform
} from "react-native";
import Colors from "../config/colors";
import { Container } from "native-base";
import { DatePicker, Header } from "../component";
import DateAndTimePicker from "../component/DateAndTimePicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFormattedDate } from "../utils/Util";
import moment from "moment";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from "expo-image-picker";
import { result } from "lodash";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import globalStyles from "../config/Styles";
import styles from './Styles'


function Attendence({ navigation }) {
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [inTime, setInTime] = useState(moment(new Date()).format());
    const [outTime, setOutTime] = useState(moment(new Date()).add(1, 'hour').format());
    const [type, setType] = useState("");
    const [mode, setMode] = useState("");
    const [isDatepickerOpen, setisDatepickerOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [workingHour, setWorkingHour] = useState(1);


    const handlePicker = async () => {
        const galleryStatus =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.granted);
        if (galleryStatus.granted == true) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
            });

            console.log(result);

            if (!result.cancelled) {
                setImage(result.uri);
            }
            return;
        } else {
            Alert.alert("Allow access",
                "Needs storage access so u can choose your Image. To allow Tap Settings > Permissions > turn Files and media on.",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Ask me later pressed")
                    },
                    {
                        text: "Goto Settings", onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:');
                            } else {
                                Linking.openSettings();
                            }
                        }
                    }
                ]);
            return;
        }
    };

    let userImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&usqp=CAU";


    let year = "June 2, 08";

    const dateChange = (selectedDate) => {
        setDate(getFormattedDate(selectedDate));
    };

    const showDatepicker = () => setisDatepickerOpen(true);

    const inTimeChange = (selectedTime) => {
        setInTime(selectedTime);
    };

    const showDatePicker = (type, mode) => {
        setisDatepickerOpen(true)
        setType(type)
        setMode(mode)
    };

    const handleConfirm = (selectDate) => {
        console.log(selectDate);
        if (type == 'date') {
            setDate(moment(selectDate).format())
        } else if (type == 'inTime') {
            setInTime(moment(selectDate).format());
            setOutTime(moment(selectDate).add(1, 'hour').format())
        } else if (type == 'outTime') {
            let hour = moment(selectDate).format('HH') - moment(inTime).format('HH')
            if (hour > 0) {
                setWorkingHour(hour)
                setOutTime(moment(selectDate).format())
            } else {
                alert("Minimum Punch Out 1 hour")
            }


        }
        hideDatePicker();
    }

    const hideDatePicker = () => {
        setisDatepickerOpen(false)

    }




    const outTimeChange = (selectedTime) => {
        const startTime = new Date(`${year} ${inTime}`).getHours();
        const endTime = new Date(`${year} ${selectedTime}`).getHours();
        let hour = endTime - startTime;

        setWorkingHour(hour);

        if (hour > 0) {
            setOutTime(selectedTime);
            return;
        }
        alert("Minimum Punch Out 1 hour")
        setOutTime(null);
    };


    return (
        <>
            <Container>
                <Header title={"Attendance"} />
                <KeyboardAwareScrollView>
                    <View style={styles.container}>
                        <View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    navigation.navigate("Attendence2", {
                                        paramKey: [date, inTime, outTime, workingHour, image],
                                    })
                                }
                            />
                        </View>

                        <View style={styles.profile}>
                            <TouchableOpacity style={styles.avatarPlace} onPress={handlePicker}>
                                <Image source={{ uri: image ? image : userImage }} style={styles.avatar} />
                            </TouchableOpacity>
                            <Text style={styles.name}>Subhas Gounder</Text>
                        </View>
                        <View style={styles.inputBox}>
                            <Text style={[styles.input,]}>Date :</Text>
                            <View style={styles.inputDateTime}>
                                <TouchableOpacity onPress={() => { showDatePicker("date", 'date') }}>
                                    <Text style={{color:Colors.textColor}}>{moment(date).format('Do MMM YY (ddd)')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputBox}>
                            <Text
                                style={[styles.input, { alignItems: "center", color: "#808080" }]}
                            >
                                Punch In :
                            </Text>
                            <View style={styles.inputDateTime}>
                                <TouchableOpacity onPress={() => { showDatePicker("inTime", 'time') }}>
                                    <Text style={{color:Colors.textColor}}>{moment(inTime).format('LT')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputBox}>
                            <Text
                                style={[styles.input, { alignItems: "center", color: "#808080" }]}
                            >
                                Punch Out :
                            </Text>
                            <View style={styles.inputDateTime}>
                                <TouchableOpacity onPress={() => { showDatePicker("outTime", 'time') }}>
                                    <Text style={{color:Colors.textColor}}>{moment(outTime).format('LT')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputBox}>
                            <Text
                                style={[styles.input, { alignItems: "center", color: "#808080" }]}
                            >
                                Hours Worked :
                            </Text>
                            <View style={styles.inputDateTime}>
                                <Text style={{color:Colors.textColor}}>{workingHour}</Text>
                            </View>
                        </View>

                        <View style={styles.inputBox}>
                        <Text
                                style={[styles.input, { alignItems: "center", color: "#808080" }]}
                            >
                                Comments :
                            </Text>
                            <TextInput
                                style={styles.inputComment}
                                multiline
                                placeholderTextColor="#808080"
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <DateTimePickerModal
                    mode={mode}
                    display={Platform.OS == 'ios' &&  mode=="date" ? 'inline' :Platform.OS == 'ios' &&  mode=="time" ? 'spinner' : 'default'}
                    isVisible={isDatepickerOpen}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </Container>
        </>
    );
}

export default Attendence;

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;

// const styles = StyleSheet.create({
//     container: {
//         // flex: 1,
//         backgroundColor: "#fff",
//         textAlign: "center",
//         alignItems: "center",
//         width: "100%",
//         padding : 8
//     },

//     button: {
//         // backgroundColor: Colors.blueBg,
//         borderColor: Colors.blueBg,
//         borderWidth: 2,
//         height: 20,
//         width: 20,
//         left: windowwidth - 250,
//         top: 20,
//         borderRadius: 3,
//         marginBottom: 50
//     },

//     image: {
//         height: 100,
//         width: 100,
//         borderWidth: 1,
//         borderColor: "#D3D3D3",
//     },
//     name: {
//         marginTop: 20,
//         color: "#808080",
//         marginBottom: 20,
//         textAlign: "center",
//     },

//     inputBox: {
//         alignItems: 'center',
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     height: 'auto',
//     justifyContent: "space-between",
//     marginBottom: 5,
//     marginTop: 5,
//     },

//     input: {
//         color: Colors.textColor,
//         lineHeight: 40,
//         fontSize: 14,
//         paddingLeft: 4,
//     },
    

//     inputDateTime: {
//         backgroundColor: "#fff",
//     height: 'auto',

//     fontSize: 12,
//     color: Colors.textColor,
//     textAlign: "right",
//     padding: 5,
//     },

//     inputHours: {
//         backgroundColor: "#fff",
//     height: 'auto',

//     fontSize: 12,
//     color: Colors.textColor,
//     textAlign: "right",
//     padding: 5,
//     },

//     inputBoxComment: {
//         flexDirection: "row",
//         marginRight: 15,
//         marginLeft: 15,
//     },

//     inputComment: {
//         backgroundColor: "#fff",
//         height: 'auto',
    
//         fontSize: 12,
//         color: Colors.textColor,
//         textAlign: "right",
//         width: "55%",
//         padding: 5,
//     },

//     avatarPlace: {
//         width: 120,
//         height: 100,
//         backgroundColor: Colors.lightGrey,
//         marginTop: 5,
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     avatar: {
//         position: "absolute",
//         width: 120,
//         height: 120,
//         borderWidth: 1,
//         borderColor: "#D3D3D3",
//     },
//     profile: {

//     }

// });
