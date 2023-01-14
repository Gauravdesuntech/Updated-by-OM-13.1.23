import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	TextInput,
	TouchableOpacity,
	Dimensions,
	Modal,
    Alert
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader } from "../../component";
import { getUserProfile } from "../../services/UserManagementServices";

export default class UserProfileDetailsview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            userData: props.route.params?.userData,
            userInfo: null
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
        getUserProfile(this.state.userData.id).then( (response) => {
            this.setState({
                isLoading: false,
                userInfo: response
            }, () => { console.log(this.state.userInfo) })
        }).catch( (err) => {
            Alert.alert("Server error", "Please try again later");
        })
    }

    getUserProfileData() {

    }

    gotoEditUser = (item) => {
		this.props.navigation.navigate("EditUserProfile", {
			id: item.id,
			deptCode: item.dept_code,
			deptName: item.dept_name,
			desgCode: item.desg_code,
			desgName: item.desg_name,
		});
	};

    render() {
        return (
            <Container>
                <Header 
                title={"User Details"}
                />
                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <>
                        
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Date Of Birth</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.dob}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Sex</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.sex}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Height</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.height}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Weight</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.weight}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Blood Group</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.blood_group}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Martial Status</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.martial_status}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Aadhaar Card Number</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.aadhaar_card}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Pan Number</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.pan_number}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Address</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.address}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>State</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.state}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>City</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.city}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Pincode</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.pincode}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Personal email id</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.personal_email_id}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Mobile Number</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.mobile_number}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Family Number</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.family_number}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.leftPart}>
                                <Text style={styles.name}>Family Member Name</Text>
                            </View>
                            <View style={styles.rightPart}>
                                <Text style={styles.subText}>{this.state.userInfo?.family_number}</Text>
                            </View>
                        </View>
                    </>
                )}
            </Container>
        );
    }
}


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 5,
	},
	row: {
		flexDirection: "row",
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
		paddingVertical: 5,
	},
	leftPart: {
		width: "75%",
		justifyContent: "center",
	},
	rightPart: {
		width: "25%",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	name: {
		fontSize: 16,
		color: Colors.textColor,
		fontWeight: "bold",
		lineHeight: 24,
	},
	subText: {
		color: Colors.textColor,
		opacity: 0.8,
		fontSize: 14,
		lineHeight: 22,
	},
	iconStyle: {
		fontSize: 18,
		color: "#cecece",
	}
});
