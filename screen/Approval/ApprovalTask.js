import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Alert
} from "react-native";
import Header from '../../component/Header'
// import Footer from '../../component/tasks/Footer'
import CatItemCard from '../../component/tasks/CatItemCard'
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import { formatdate } from "../../utils/helper";
import { Icon } from "react-native-elements";
import AppContext from "../../context/AppContext";
import moment from "moment";
import { animalChangeEnclosureUpdate, getApprovalTasks, getPendingEnclosure } from "../../services/APIServices";
import { updateTaskStatus } from "../../utils/api";
import { Colors } from "../../config";
import { TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { ImageBackground } from "react-native";
import { TextInput } from "react-native";
import { capitalize } from "../../utils/Util";
import globalStyles from "../../config/Styles";

const individual = require('../../assets/tasks/manager.png')
const rotate = require('../../assets/tasks/Rotate.png')
const compete = require('../../assets/tasks/Compete.png')
const collaborate = require('../../assets/tasks/Collborate.png')
const critical = require('../../assets/tasks/Critical.png')
const danger = require('../../assets/tasks/Danger.png')
const low = require('../../assets/tasks/Low.png')
const moderate = require('../../assets/tasks/Moderate.png')
const high = require('../../assets/tasks/High.png')
const greentick = require('../../assets/tasks/greentick.png')

class ApprovalTask extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isFetching: false,
            data: [],
            activeTabKey: 'task',
            enclosureData: [],
            rejectModal: false,
            reqNo: '',
            reject_reason: '',


        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.approvalTaskList();
            this.approvalEnclosureList();
        })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            this.approvalTaskList();
            this.approvalEnclosureList();
        })
    }

    approvalTaskList = () => {
        let obj = {
            user_id: this.context.userDetails.id
        }
        getApprovalTasks(obj)
            .then((response) => {
                let data = response.map((value) => {
                    let priority = moderate;
                    if (value.priority === "Critical") {
                        priority = critical;
                    } else if (value.priority === "Danger") {
                        priority = danger;
                    } else if (value.priority === "Low") {
                        priority = low;
                    } else if (value.priority === "Medium") {
                        priority = moderate;
                    } else if (value.priority === "High") {
                        priority = high;
                    }
                    let task_type = compete;
                    if (value.task_type === "Individual") {
                        task_type = individual;
                    } else if (value.task_type === "Rotate") {
                        task_type = rotate;
                    } else if (value.task_type === "Collaborate") {
                        task_type = collaborate;
                    } else if (value.task_type === "Compete") {
                        task_type = compete;
                    }
                    return {
                        id: value.id,
                        title: value.name,
                        category_id: value.category_id,
                        date: moment(value.schedule_start).format("Do MMM YY, ddd") + " (" + moment(value.schedule_time, "HH:mm:ss").format("LT") + ")",
                        closed_date: moment(value.updated_at).format("Do MMM YY, ddd") == 'Invalid date' ? '' : moment(value.updated_at).format("Do MMM YY, ddd"),
                        members: value.assign_level_1.split('-')[0],
                        priority: priority,
                        taskType: task_type,
                        coins: value.point,
                        status: value.status,
                        values: value,
                        isSelect: false,
                        selectedClass: globalStyles.list,
                        created: value.created_by_name,
                        closed: value.updated_by_name
                    }
                })
                this.setState({
                    data: data,
                    isFetching: false,
                    refreshing: false,
                    status: data.length === 0 ? 'No Task List Found' : ""
                })
            })
            .catch(error => {
                showError(error);
                this.setState({
                    data: [],
                    isFetching: false,
                    refreshing: false,
                })
            })
    }

    approvalEnclosureList = () => {
        let user_id = this.context.userDetails.id;
        getPendingEnclosure(user_id)
            .then((res) => {
                console.log("Pending Enclosure>>>>", res);
                this.setState({
                    enclosureData: res,
                    showLoader: false,
                })
            })
            .catch((err) => { console.log(err) })
    }

    setActiveTab = (key) =>
        this.setState(
            {
                activeTabKey: key,
            }, () => { this.approvalTaskList(); this.approvalEnclosureList() });

    handleApprove = (id, status) => {
        this.setState({
            isFetching: true,
        })
        let data = {
            'id': id,
            'status': status,
        }
        updateTaskStatus(id, data)
            .then((response) => {
                // console.log("Response ", response.data, response.data.type)
                if (response.data.type == "success") {
                    this.setState({
                        isFetching: false,
                    })
                    Alert.alert(
                        "Success",
                        "Task updated",
                        [
                            { text: "OK", onPress: () => this.approvalTaskList() }
                        ]
                    )
                } else {
                    this.setState({
                        isFetching: false,
                    })
                    Alert.alert(
                        "Failed",
                        "Failed to update task",
                        [
                            { text: "OK", onPress: () => this.approvalTaskList() }
                        ]
                    )
                }
            })
            .catch((error) => {
                this.setState({
                    isFetching: false,
                })
                console.log(error)
            })
    }


    changeEnclosure = (item, status) => {
        this.setState({ showLoader: true });
        let obj = {};
        obj = {
            notes: null,
            request_number: item,
            status: status,
            approved_by: this.context.userDetails.id,
            user_id: this.context.userDetails.id,
        };
        if (status == "rejected") {
            obj.rejection_reason = this.state.reject_reason;
        }
        animalChangeEnclosureUpdate(obj)
            .then((response) => {
                console.log(response);
                this.approvalEnclosureList()
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.approvalEnclosureList()
                console.log(error);
            });

    };

    rejectEnclosure = (req) => {
        this.toggleRejectModal();
        this.setState({
            reqNo: req
        })
    }

    rejectRequest = () => {
        this.setState(
            {
                rejectModal: !this.state.rejectModal,
            },
            () => {
                this.changeEnclosure(this.state.reqNo, "rejected");
            }
        );
    };

    toggleRejectModal = () => {
        this.setState({
            rejectModal: !this.state.rejectModal,
        });
    };



    renderListItem = ({ item }) => (
        <TouchableHighlight underlayColor={"#eee"} style={{ paddingHorizontal: 5 }}>
            <View style={globalStyles.row}>
                <View style={globalStyles.leftPart}>
                    <Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.no_bg_color, globalStyles.text_bold]}>{`#${item.request_number}`}</Text>
                    <Text style={[globalStyles.textfield, globalStyles.no_bg_color, globalStyles.pd0]}>{"Animals : " + item.animal_id}</Text>
                    <Text style={[globalStyles.textfield, globalStyles.no_bg_color, globalStyles.pd0]}>
                        {"Requested By: " + item.changed_by_name}
                    </Text>
                    <Text style={[globalStyles.textfield, globalStyles.no_bg_color, globalStyles.pd0]}>
                        {"Reason: " + item.change_reason}
                    </Text>
                    <Text style={[globalStyles.textfield, globalStyles.no_bg_color, globalStyles.pd0]}>
                        {"Status: " + capitalize(item.status)}
                    </Text>
                    {item.status == 'approved' || item.status == 'rejected' ? null :
                        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                            <TouchableOpacity
                                onPress={() => { this.rejectEnclosure(item.request_number) }}
                                style={{ width: '30%', alignItems: 'center', marginHorizontal: 10, justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 3, backgroundColor: Colors.danger }}
                            >
                                <Text style={{ fontSize: 10, color: Colors.white }}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this.changeEnclosure(item.request_number, 'approved') }}
                                style={{ width: '30%', alignItems: 'center', marginHorizontal: 10, justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 3, backgroundColor: Colors.green }}
                            >
                                <Text style={{ fontSize: 10, color: Colors.white }}>Approve</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </TouchableHighlight>
    );

    render() {
        if (this.state.isFetching) {
            return (
                <SafeAreaView style={globalStyles.container}>
                    <Header
                        navigation={this.props.navigation}
                        leftNavTo={'Home'}
                    />
                    <View style={globalStyles.body}>
                        <Spinner />
                    </View>
                    {/* <Footer /> */}
                </SafeAreaView>
            )
        }
        return (
            <SafeAreaView style={[globalStyles.container, { padding: 0 }]}>
                <Header
                    navigation={this.props.navigation}
                    leftNavTo={'Home'}
                    title={this.state.activeTabKey == 'task' ? "Task Approval" : "Enclosure Approval"}
                />
                <View style={globalStyles.tabContainer}>

                    <TouchableOpacity
                        onPress={this.setActiveTab.bind(this, "task")}
                        style={[
                            globalStyles.tab,
                            this.state.activeTabKey == "task" ? globalStyles.activeTab : null,
                        ]}
                    >
                        <Text
                            style={
                                this.state.activeTabKey == "task"
                                    ? globalStyles.activeTexttab
                                    : globalStyles.inActiveText
                            }
                        >
                            Tasks
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.setActiveTab.bind(this, "enclosure")}
                        style={[
                            globalStyles.tab,
                            this.state.activeTabKey == "enclosure" ? globalStyles.activeTab : null,
                        ]}
                    >
                        <Text
                            style={
                                this.state.activeTabKey == "enclosure"
                                    ? globalStyles.activeTexttab
                                    : globalStyles.inActiveText
                            }
                        >
                            Enclosure
                        </Text>
                    </TouchableOpacity>
                </View>
                <View >

                    {this.state.activeTabKey == 'task' ?
                        <View style={globalStyles.body}>
                            {
                                this.state.data.length > 0 ?
                                    <FlatList
                                        data={this.state.data}
                                        renderItem={({ item }) => <CatItemCard
                                            navigation={this.props.navigation}
                                            id={item.id}
                                            coins={item.coins}
                                            taskType={item.taskType}
                                            members={item.members}
                                            priority={item.priority}
                                            date={item.date}
                                            closed_date={''}
                                            title={item.title}
                                            status={item.status}
                                            closed={item.closed}
                                            created={item.created}
                                            item={item}
                                            selectItem={this.selectItem}
                                            extraData={this.state.data}
                                            approval={true}
                                            action={this.handleApprove}
                                        />}
                                        keyExtractor={item => item.id.toString()}
                                        onRefresh={() => this.onRefresh()}
                                        refreshing={this.state.isFetching}
                                    />
                                    :
                                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                                        <Text style={{ color: Colors.danger }}>{"No Approval task available !!"}</Text>
                                    </View>
                            }
                        </View>
                        :

                        <View style={globalStyles.body}>
                            {
                                this.state.enclosureData.length > 0 ?
                                    <FlatList
                                        data={this.state.enclosureData}
                                        keyExtractor={(item, index) => item.id.toString()}
                                        renderItem={this.renderListItem}
                                        initialNumToRender={this.state.enclosureData.length}
                                        onRefresh={() => this.onRefresh()}
                                        refreshing={this.state.isFetching}
                                    />
                                    :
                                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                                        <Text style={{ color: Colors.danger }}>{"No enclosure available !!"}</Text>
                                    </View>
                            }
                        </View>
                    }
                    {/* <Footer /> */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.rejectModal}
                        onRequestClose={() => {
                            this.toggleRejectModal(!this.state.rejectModal);
                        }}
                    >
                        <ImageBackground
                            style={globalStyles.container}
                            blurRadius={this.state.rejectModal ? 2 : 0}
                            source={require("../../assets/bg.jpg")}
                        >
                            <View style={globalStyles.centeredView}>
                                <View style={globalStyles.modalView}>
                                    <View>
                                        <Text>Reject Reason</Text>
                                    </View>
                                    <TextInput
                                        style={globalStyles.input}
                                        onChangeText={(text) => {
                                            this.setState({ reject_reason: text });
                                        }}
                                        value={this.state.reject_reason}
                                        placeholder="Enter Reject Reason"
                                        autoCompleteType="off"
                                        multiline={true}
                                        textAlignVertical="top"
                                        underlineColorAndroid="transparent"
                                    />
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                            width: "100%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.toggleRejectModal(!this.state.rejectModal);
                                            }}
                                            style={[globalStyles.btn, globalStyles.btnDanger]}
                                        >
                                            <Text style={globalStyles.btnText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={this.rejectRequest}
                                            style={[globalStyles.btn, globalStyles.btnSuccess]}
                                        >
                                            <Text style={globalStyles.btnText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
}
export default ApprovalTask;
const tabHeight = 50;
// const globalStyles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
//     body: {
//         flex: 9
//     },
//     selected: { backgroundColor: "#d3d3d3" },
//     list: {},
//     icon: {
//         position: "absolute",
//         bottom: 20,
//         width: "100%",
//         left: 290,
//         zIndex: 1
//     },
//     numberBox: {
//         position: "absolute",
//         bottom: 75,
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         left: 330,
//         zIndex: 3,
//         backgroundColor: "#e3e3e3",
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     number: { fontSize: 14, color: "#000" },
//     tabContainer: {
//         width: "100%",
//         height: tabHeight,
//         flexDirection: "row",
//         borderBottomWidth: 1,
//         borderBottomColor: "#d1d1d1",
//         borderTopWidth: 1,
//         borderTopColor: Colors.primary,
//         elevation: 1,
//     },
//     downloadBtn: {
//         flexDirection: "row",
//         paddingHorizontal: 5,
//         paddingVertical: 3,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderRadius: 3,
//         marginLeft: 20,
//     },
//     tab: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         height: tabHeight,
//     },
//     underlineStyle: {
//         backgroundColor: Colors.primary,
//         height: 3,
//     },
//     activeTab: {
//         height: tabHeight - 1,
//         borderBottomWidth: 2,
//         borderBottomColor: Colors.primary,
//     },
//     activeTexttab: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: Colors.primary,
//     },
//     inActiveText: {
//         fontSize: 14,
//         color: Colors.textColor,
//         opacity: 0.8,
//     },

//     row: {
//         flexDirection: "row",
//         borderBottomColor: "#eee",
//         borderBottomWidth: 1,
//         paddingHorizontal: 5,
//         paddingVertical: 5,
//     },
//     leftPart: {
//         width: "75%",
//         justifyContent: "center",
//     },
//     rightPart: {
//         width: "25%",
//         justifyContent: "center",
//     },
//     rightPartStock: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         flex: 1 / 2
//     },
//     rightPartButton: {
//         padding: 5,
//         alignItems: 'center',
//         backgroundColor: Colors.primary,
//         borderRadius: 3
//     },
//     rightPartButtonText: {
//         color: Colors.white
//     },
//     name: {
//         fontSize: 16,
//         color: Colors.textColor,
//         fontWeight: "bold",
//         lineHeight: 24,
//     },
//     subText: {
//         color: Colors.textColor,
//         opacity: 0.8,
//         fontSize: 14,
//         lineHeight: 22,
//     },
//     centeredView: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         marginTop: 22,
//       },
//       modalView: {
//         margin: 20,
//         backgroundColor: "white",
//         borderRadius: 20,
//         padding: 10,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOffset: {
//           width: 0,
//           height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//       },
//       input: {
//         width: 300,
//         height : 'auto',
//         margin: 12,
//         borderWidth: 1,
//         padding: 10,
//         borderColor: "#ddd",
//         alignSelf: "flex-start",
//       },
//       btn: {
//         width: 100,
//         height: 30,
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: 3,
//         marginBottom: 5,
//       },
//       btnExtra: {
//         width: 130,
//         height: 50,
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: 3,
//         marginBottom: 5,
//       },
//       btnDanger: {
//         backgroundColor: Colors.danger,
//       },
//       btnSuccess: {
//         backgroundColor: Colors.green,
//       },
//       btnText: { color: Colors.white },
// });


