import React, { Component } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    StatusBar,
    Modal,
    Dimensions,
    Alert,
    SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Menu, { MenuItem } from "react-native-material-menu";
import { BarCodeScanner } from "expo-barcode-scanner";
import Colors from "../config/colors";
import { searchCommonName } from "../services/APIServices";
import { Camera } from 'expo-camera';
import AppContext from '../context/AppContext';
import moment from "moment";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';


export default class Header2 extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            show: false,

        }
    }
    // const navigation = useNavigation();
    // const route = useRoute();
    // const routeName = route.name;

    // const gotoHome = () => navigation.navigate("Home");
    // const gotoVideo = () => props.onVideoPress();
    // const toggleDrawer = () => navigation.toggleDrawer();
    gotoBack = () => this.props.navigation.goBack();

    // calculateDate = (type) => {
    //     let today= this.state.date;
    //     if(type=='add'){
    //         this.setState({date:moment(today).add(1,'days').format()})
    //     }else{
    //         this.setState({date:moment(today).subtract(1,'days').format()})
    //     }
    // }

    showDatePicker = () => {
        this.setState({ show: true })
    };

    // handleConfirm = (selectDate) => {
    //     this.props.date=selectDate;
    //     this.hideDatePicker()
    // }

    hideDatePicker = () => {
        this.setState({ show: false })
    }

    render() {
        return (
            <>
                <StatusBar
                    animated={true}
                    barStyle={'dark-content'}
                    showHideTransition={'fade'}
                    backgroundColor={Colors.primary}
                />
                <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={26} color={Colors.white} />
                    </TouchableOpacity>
                    </View>

                    <View style={[styles.headerCommonNameList]}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.calculate('minus')}
                        // style={styles.headerMiddle}
                        >
                            <Ionicons name="caret-back-outline" size={26} color={Colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.showDatePicker('date')}} >
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ fontSize: 20, color: Colors.white }}
                            >{moment(this.props.date).format('DD-MM-YYYY (ddd)')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.calculate('add')}
                        // style={styles.headerRight}
                        >
                            <Ionicons name="caret-forward-outline" size={26} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerRight}>

                    </View>
                </View>
            </>
        );
    }
};

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    headerContainer: {
        height: 50,
        paddingHorizontal: 5,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        width: "10%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerMiddle: {
        width: "58%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
    },
    headerCommonNameList: {
        flexDirection: 'row',
        width: "80%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
        // marginHorizontal: 40

    },
    headerRight: {
        minWidth: "15%",
        maxWidth: "32%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    scanModalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        width: windowWidth,
        height: windowHeight,
    },
    qrCodeSacnBox: {
        width: Math.floor((windowWidth * 70) / 100),
        height: Math.floor((windowWidth * 70) / 100),
    },
    scanResultBox: {
        flex: 1,
        backgroundColor: Colors.white,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        position: "absolute",
        zIndex: 11,
        top: 30,
        left: 10,
        backgroundColor: Colors.lightGrey,
        width: 30,
        height: 30,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    cancelButtonText: {
        color: "#000",
        fontSize: 24,
    },
});
