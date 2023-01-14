import React, { Component } from 'react';
import {
    Switch,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import { getAllSubcatList, subCategoryList, usersTaskListWithSubcat } from '../../utils/api';
import AppContext from '../../context/AppContext';
import { Colors } from '../../config';
import { formatdate } from "../../utils/helper";
import { Ionicons } from '@expo/vector-icons';
import globalStyles from "../../config/Styles";
import styles from "./Styles";



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

const BACON_IPSUM =
    'Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';

const CONTENT = [
    {
        title: 'First',
        content: BACON_IPSUM,
    },
    {
        title: 'Second',
        content: BACON_IPSUM,
    },
    {
        title: 'Third',
        content: BACON_IPSUM,
    },
    {
        title: 'Fourth',
        content: BACON_IPSUM,
    },
    {
        title: 'Fifth',
        content: BACON_IPSUM,
    },
];

const SELECTORS = [
    {
        title: 'First',
        value: 0,
    },
    {
        title: 'Third',
        value: 2,
    },
    {
        title: 'None',
    },
];

export default class Tsst_Collapsible extends Component {
    static contextType = AppContext
    state = {
        activeSections: '',
        collapsed: true,
        multipleSelect: false,
        subCat: [],
        isActive: false,
        tasks: [],
        isPress:false,
        isPress_id:''
    };
    componentDidMount = () => {
        this.getSubcatList()
    }

    getSubcatList = () => {
        getAllSubcatList().then((res) => {
            // console.log("Data>>>>>>",res.data);
            this.setState({
                subCat: res.data.data
            })
        }).catch((err) => console.log(err))
    }

    getTasksBySubcat = (id) => {
        let user_id = ''
        if(this.props.assignFrom){
            user_id=this.props.assignFrom
        }else{
            user_id=this.context.userDetails.id;
        }
        usersTaskListWithSubcat(user_id,id).then((res) => {
            let items = res.data.data.filter((item) => item.task_type == "Individual")
            let data = items.map((value) => {
                let priority = compete;
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
                    name: value.name,
                    category_id: value.category_id,
                    date: formatdate(value.schedule_start, 'true'),
                    members: value.assign_level_1,
                    priority: priority,
                    taskType: task_type,
                    coins: value.point,
                    status: value.status,
                    values: value,
                }
            })

            this.setState({
                tasks: data,
                status: data.length === 0 ? 'No Task List Found' : ""
            })
        }).catch((err) => console.log(err))
    }


    setTasks = (v) =>{
       this.setState({
        isPress: !this.state.isPress,
        isPress_id:v.id
       }) 
    }
    toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    renderItem = (item) => {
        console.log(item);
        const {isPress,isPress_id} = this.state
        return (
            <>
                <View
                    style={[
                        styles.selectedItemsContainer,
                        this.props.selectedItemsContainer,
                    ]}
                >
                    {/* {this.props.selectedItems.map((element) => ( */}
                    <View style={isPress_id == item.item.id ? styles.capsulePress : styles.capsule}>
                        <TouchableOpacity onPress={()=>this.setTasks(item.item)}>
                            <Text style={isPress_id == item.item.id  ? styles.capsuleTextPress : styles.capsuleText}>{item.item.name}{" "}
                            {isPress_id !== item.item.id ?
                            <Ionicons
                                name="add-circle-outline"
                                style={isPress_id == item.item.id  ? styles.iconPress : styles.icon}
                            /> : null }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* ))} */}
                </View>


            </>

            //     <Animatable.View
            //     duration={400}
            //     animation={this.state.collapsed ? undefined : 'zoomIn'}
            // >
            //     <TouchableOpacity><Text style={styles.headerText}> {item.name}</Text></TouchableOpacity>
            // </Animatable.View>                      
        )
    }
    setSections = (sections) => {
        // console.log(sections);
        if (sections.id !== this.state.activeSections.id) {
            this.setState({
                isActive: true,
                activeSections: sections,
                collapsed: false
            }, () => { this.getTasksBySubcat(sections.id) })
        } else {
            this.setState({
                isActive: false,
                activeSections: sections,
                collapsed: true
            }, () => { this.getTasksBySubcat(sections.id) })
        }
    };

    renderHeader = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={400}
                style={[styles.header, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <Text style={styles.headerText}></Text>
            </Animatable.View>
        );
    };

    renderContent(section, _, isActive) {
        return (
            <Animatable.View
                duration={400}
                style={[styles.content, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <Text>{section.image}</Text>
            </Animatable.View>
        );
    }

    render() {
        const { multipleSelect, activeSections } = this.state;
        // console.log(this.state.tasks[0].name);
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
                    <Text style={styles.title}>Sub Categories</Text>

                    {/* <View style={styles.multipleToggle}>
            <Text style={styles.multipleToggle__title}>Multiple Select?</Text>
            <Switch
              value={multipleSelect}
              onValueChange={(a) => this.setState({ multipleSelect: a })}
            />
          </View> */}

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.selectors}>
                        {/* <Text style={styles.selectTitle}>Select:</Text> */}

                        {this.state.subCat.map((selector, index) => (
                            <TouchableOpacity
                                key={selector.id}
                                onPress={() => this.setSections(selector)}
                            >
                                <View style={styles.selector}>
                                    <Text
                                        style={
                                            activeSections.id == selector.id &&
                                            styles.activeSelector
                                        }
                                    >
                                        {selector.name} +
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* <TouchableOpacity onPress={this.toggleExpanded}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Single Collapsible</Text>
            </View>
          </TouchableOpacity> */}
                    <Collapsible collapsed={this.state.collapsed}>
                        <View style={styles.content}>
                            {this.state.tasks && this.state.tasks.length > 0 ?
                                <FlatList
                                    horizontal={true}
                                    data={this.state.tasks}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id.toString()}
                                // contentContainerStyle={{flex:1, backgroundColor:"tomato"}}
                                />
                                : <View
                                    style={globalStyles.justifyContentCente}
                                >
                                    <View style={[globalStyles.justifyContentCenter,globalStyles.textAlignCenter]}>
                                       
                                        <Text style={{ color: Colors.primary, textAlign: "center" }}>No Tasks Found 
                                        {/* <Ionicons
                                            name="sad-outline"
                                            style={{ fontSize: 20, color: Colors.danger }}
                                        /> */}
                                        </Text>
                                    </View>
                                    {/* ))} */}
                                </View>
                            }
                        </View>
                    </Collapsible>
                </ScrollView>
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5FCFF',
//         paddingTop: Constants.statusBarHeight,
//     },
//     title: {
//         textAlign: 'center',
//         fontSize: 22,
//         fontWeight: '300',
//         marginBottom: 20,
//     },
//     header: {
//         backgroundColor: '#F5FCFF',
//         padding: 10,
//         // flexDirection:"row"
//     },
//     headerText: {
//         textAlign: 'center',
//         fontSize: 16,
//         fontWeight: '500',
//     },
//     content: {
//         padding: 20,
//         height: 100,
//         backgroundColor: '#fff',
//     },
//     active: {
//         backgroundColor: 'rgba(255,255,255,1)',
//     },
//     inactive: {
//         backgroundColor: 'rgba(245,252,255,1)',
//     },
//     selectors: {
//         marginBottom: 10,
//         flexDirection: 'row',
//         // justifyContent: 'center',
//     },
//     selector: {
//         backgroundColor: '#F5FCFF',
//         padding: 10,
//     },
//     activeSelector: {
//         fontWeight: 'bold',
//     },
//     selectTitle: {
//         fontSize: 14,
//         fontWeight: '500',
//         padding: 10,
//     },
//     multipleToggle: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginVertical: 30,
//         alignItems: 'center',
//     },
//     multipleToggle__title: {
//         fontSize: 16,
//         marginRight: 8,
//     },
//     // selectedItemsContainer: {
//     // 	width: "100%",
//     // 	height: "auto",
//     // 	borderColor: "#ccc",
//     // 	borderWidth: 1,
//     // 	backgroundColor: "#f9f6f6",
//     // 	paddingVertical: 8,
//     // 	flexDirection: "row",
//     // 	flexWrap: "wrap",
//     // 	alignItems: "flex-start",
//     // },
//     // selectedItemsContainer: {
//     // 	width: "100%",
//     // 	flexDirection: "row",
//     // 	flexWrap: "wrap",
//     // 	padding:5,
//     // },
//     capsule: {
//         height: 30,
//         justifyContent: "center",
//         paddingHorizontal: 3,
//         paddingVertical: 5,
//         marginHorizontal: 5,
//         marginVertical: 5,
//         borderRadius: 20,
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         backgroundColor: Colors.white,
//     },
//     capsulePress: {
//         height: 30,
//         justifyContent: "center",
//         paddingHorizontal: 3,
//         paddingVertical: 5,
//         marginHorizontal: 5,
//         marginVertical: 5,
//         borderRadius: 20,
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         backgroundColor: Colors.primary,
//     },
//     capsuleText: {
//         fontSize: 14,
//         color: Colors.primary,
//         marginHorizontal: 3,
//         marginBottom: 2,
//     },
//     capsuleTextPress: {
//         fontSize: 14,
//         color: Colors.white,
//         marginHorizontal: 3,
//         marginBottom: 2,
//     },
//     icon:{
//         color: Colors.primary ,
//         fontSize: 20,
//         marginLeft: 10
//     },
//     iconPress:{
//         color: Colors.white ,
//         fontSize: 20,
//     },
//     placeHolderContainer: {
//         height: 50,
//         borderColor: "#ccc",
//         borderWidth: 1,
//         borderRadius: 3,
//         fontSize: 18,
//         backgroundColor: "#f9f6f6",
//         paddingHorizontal: 10,
//         color: Colors.textColor,
//     },
//     placeholder: {
//         fontSize: 16,
//     },
// });