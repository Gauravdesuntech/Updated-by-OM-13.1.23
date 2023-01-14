import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList, 
    TextInput,
    InteractionManager,
} from "react-native";
import { getSearchTasks, userList } from '../../utils/api';
import Config from "../../config/Configs";
// import Footer from "../../component/tasks/Footer";
import Header from "../../component/tasks/Header";
import UserItem from '../../component/tasks/UserItem'
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import AppContext from "../../context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../config";
import { debounce } from "lodash";
import { searchTasks } from "../../services/APIServices";
import { formatdate } from "../../utils/helper";
import CatItemCard from "../../component/tasks/CatItemCard";
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


//import images for task icon here
const carrot = require("../../assets/tasks/carrot.png")

// sample data for todo
const Todos = [
    {
        id: '1',
        title: 'Groceries',
        qty: '5',
        img: carrot
    },
    {
        id: '2',
        title: 'At Home',
        qty: '2',
        img: carrot
    }
];


class SearchByUser extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            status: 'loading....',
            users: null,
            isFetching: false,
            searchValue: '',
            fetchData:[],
        }
        this.inputRef = React.createRef();
    }
    componentDidMount() {
        // this.getUserList()
        setTimeout(() => {
			this.inputRef.current.focus();
		}, 500);
    }

    onRefresh = () => {
        // this.setState({ isFetching: true}); 
    }

    searchDataDebounce = debounce(()=>{this.searchData()},900)

    searchData = () => {
        // console.log("Hello",this.state.searchValue);
        const user_id = this.context.userDetails.id; 
        searchTasks(user_id,this.state.searchValue).then((res)=>{
            const sources = res;
            console.log(sources);
            let data = sources.map((value)=>{
                let priority=moderate;
                if (value.priority==="Critical"){
                    priority=critical;
                }else if (value.priority==="Danger"){
                    priority=danger;
                }else if (value.priority==="Low"){
                    priority=low;
                }else if (value.priority==="Medium"){
                    priority=moderate;
                }else if (value.priority==="High"){
                    priority=high;
                }
                let task_type=compete;
                if (value.task_type==="Individual"){
                    task_type=individual;
                }else if (value.task_type==="Rotate"){
                    task_type=rotate;
                }else if (value.task_type==="Collaborate"){
                    task_type=collaborate;
                }else if (value.task_type==="Compete"){
                    task_type=compete;
                }
    
                return{
                    id: value.id,
                    title: value.name,
                    category_id: value.category_id,
                    category_name: value.cat_name,
                    date: formatdate(value.schedule_start, 'true'),
                    members: value.assign_level_1,
                    priority: priority,
                    taskType: task_type,
                    coins: value.point,
                    status: value.status,
                    values:value,
                    isSelect : false,
                    selectedClass : styles.list,
                }
            })
            this.setState({
                fetchData:data,
                isFetching:false
            })
        }).catch((err)=>{
            console.log(err);
        })
    }

    // getUserList = () => {
    //     const user_id = this.context.userDetails.id;
    //     setTimeout(() => {
    //         this.inputRef.current.focus(false);
    //     }, 500);
    //     userList(user_id)
    //         .then((response) => {
    //             const sources = response.data;
    //             let users = sources.data.map((a, index) => {
    //                 return {
    //                     id: a.id,
    //                     title: a.full_name,
    //                     priority: a.user_code,
    //                     department: a.dept_name,
    //                     designation: a.desg_name,
    //                 }
    //             })
    //             this.setState({
    //                 status: users.length === 0 ? 'No Task List Available' : '',
    //                 users: users,
    //                 isFetching: false
    //             })
    //         }).catch(error => {
    //             this.setState({
    //                 users: [],
    //                 isFetching: false
    //             })
    //             showError(error)
    //         })
    // }

    sort = (sortvalue) => {
        console.log(sortvalue)
    }


    // getData = () => {
    //     let { searchValue } = this.state;
    //     let items = this.state.users || [];

    //     let data = items.filter((element) => {
    //         let name = element.title.toLowerCase();
    //         let index = name.indexOf(searchValue.toLowerCase());
    //         return index > -1;
    //     });
    //     return data;
    // };

    render() {
        // if (this.state.users === null) {

        //     return (
        //         <SafeAreaView style={styles.container}>
        //             <Header navigation={this.props.navigation}
        //                 leftNavTo={'Todo'}
        //                 title={'Search Tasks'}
        //                 leftIcon={'arrow-back-sharp'}
        //                 rightIcon={'filter'}
        //                 sort={this.sort}
        //             />
        //             <View style={styles.body}>
        //                 <Spinner />
        //             </View>
        //             {/* <Footer /> */}
        //         </SafeAreaView>
        //     )
        // }
        return (
            <SafeAreaView style={styles.container}>

                <Header navigation={this.props.navigation} 
                leftNavTo={'Todo'} 
                title={'Search Tasks'} 
                // leftIcon={'arrow-back-outline'} 
                // rightIcon={'filter'} 
                />
                <View style={styles.searchBackground}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#ddd" />
                        <TextInput
                            ref={this.inputRef}
                            value={this.state.searchValue}
                            onChangeText={(searchValue) =>
                                this.setState({ searchValue , isFetching:true},()=>{
                                    this.searchDataDebounce();
                                })
                            }
                            // autoCompleteType="off"
                            placeholder=" Search here..."
                            style={styles.searchField}
                        />
                    </View>
                </View>
                <View style={styles.body}>
                    {
                        this.state.fetchData.length > 0 ?
                        <FlatList
                                data={this.state.fetchData}
                                renderItem={({ item }) => <CatItemCard
                                    navigation={this.props.navigation}
                                    category_id={item.category_id}
                                    category_name={item.category_name}
                                    id={item.id}
                                    coins={item.coins}
                                    taskType={item.taskType}
                                    members={item.members}
                                    priority={item.priority}
                                    date={item.date}
                                    title={item.title}
                                    status={item.status}
                                    item={item}
                                    selectItem={this.selectItem}
                                    extraData={this.state.data}
                                />}
                                keyExtractor={item => item.id.toString()}
                                onRefresh={() => this.onRefresh()}
                                refreshing={this.state.isFetching}
                            />
                            :
                            <View
                                                    style={globalStyles.justifyContentCenter}
                                                >
                                                    <View style={[globalStyles.justifyContentCenter,globalStyles.textAlignCenter]}>
                                                        <Text style={[globalStyles.textAlignCenter,
                                                            { color: Colors.primary}]}>No Tasks Found 
                                                        {/* <Ionicons
                                                            name="sad-outline"
                                                            style={{ fontSize: 20, color: Colors.danger }}
                                                        /> */}
                                                        </Text>
                                                    </View>
                                                </View>
                    }
                </View>

                {/* <Footer /> */}



            </SafeAreaView>
        );
    }
}
export default SearchByUser;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
//     body: {
//         flex: 9,
//         marginTop: 20,
//     },
//     searchBackground:{
//         backgroundColor: Colors.primary,
//     },
//     searchContainer: {
//         backgroundColor: Colors.white,
//         flexDirection: 'row',
//         alignItems: 'center',
//         elevation: 5,
//         borderRadius: 3,
//         padding: 5,
//         marginTop: -5,
//         marginBottom :5,
//         marginHorizontal: 10,
        
//     },
//     searchField: {
//         width:"90%",
//         marginLeft: 5,
//         color: Colors.textColor,
//         fontSize: 18,
//     },
// });
