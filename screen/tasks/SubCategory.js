import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList
} from "react-native";
import { todoList, subcat } from '../../utils/api';
import Config from "../../config/Configs";
// import Footer from "../../component/tasks/Footer";
import Header from "../../component/tasks/Header";
import TodoItem from '../../component/tasks/TodoItem'
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import styles from "./Styles";


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


class SubCategory extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            status: 'loading....',
            categories: null,
            isFetching: false,
            title: this.props.route.params.title,
            catId: this.props.route.params.id,
            selectUserId: this.props.route.params.selectUserId ? this.props.route.params.selectUserId : ''
        }
    }

    componentDidMount() {
        console.log("Params Sub CAt>>>>>>>>>>>>>",this.props.route.params);
        this.getCategoryList()
    }

    onRefresh = () => {
        this.setState({ isFetching: true, }, () => { this.getCategoryList(); });
    }


    getCategoryList = () => {
        const {selectUserId,filter,extra}=this.props.route.params
        const user_id = selectUserId ? selectUserId: this.context.userDetails.id;
        const query= filter ? filter : '';
        const adv=extra;
        subcat(this.state.catId, user_id,query,adv)
            .then((response) => {
                const sources = response.data;
                let categories = sources.data.map((a, index) => {
                    return {
                        id: a.id,
                        title: a.name,
                        priority: a.priority,
                        description: a.description,
                        image: a.image,
                        all_task_count: a.all_task_count,
                        completed_task_count: a.completed_task_count,
                    }
                })
                this.setState({
                    status: categories.length === 0 ? 'No Task List Available' : '',
                    categories: categories,
                    isFetching: false
                })
            }).catch(error => {
                this.setState({
                    categories: [],
                    isFetching: false
                })
                showError(error)
            })
    }

    sort = (sortvalue) => {
        console.log(sortvalue)
    }

    render() {
        if (this.state.categories === null) {

            return (
                <SafeAreaView style={styles.container}>
                    <Header navigation={this.props.navigation}
                        leftNavTo={'AddSubCategory'}
                        title={this.state.title}
                        leftIcon={'ios-add'}
                        rightIcon={'filter'}
                        sort={this.sort}
                    />
                    <View style={styles.body}>
                        <Spinner />
                    </View>
                    {/* <Footer /> */}
                </SafeAreaView>
            )
        }
        return (
            <SafeAreaView style={styles.container}>

                <Header navigation={this.props.navigation}
                    leftNavTo={'AddSubCategory'}
                    title={this.state.title}
                    leftIcon={'ios-add'}
                    rightIcon={'filter'}
                    sort={this.sort}
                    title2={true}
                    filterBy={"this.props.route.params.filter"}
                    params={{"parent_cat": this.state.catId}}
                />

                <View style={styles.body}>
                    {
                        this.state.categories.length > 0 ?
                            <FlatList
                                data={this.state.categories}
                                renderItem={({ item }) => {

                                    return (
                                        <React.Fragment key={parseInt(item.id)}>
                                            <TodoItem navigation={this.props.navigation} 
                                            route={'CategoryItems'} catId={this.state.catId} id={item.id} all_task_count={item.all_task_count} completed_task_count={item.completed_task_count} img={Config.IMAGE_URL + item.image} title={item.title} selectUserId={this.state.selectUserId} filter={this.props.route.params.filter} extra={this.props.route.params.extra} />
                                        </React.Fragment>
                                    )
                                }}
                                keyExtractor={item => item.id.toString()}
                                onRefresh={() => this.onRefresh()}
                                refreshing={this.state.isFetching}
                            />
                            :
                            <Text
                              style={[globalStyles.paddingBottom2,globalStyles.fontSize16,
                            globalStyles.fontWeightBold,
                                {color: '#7f7f7f' }]}>
                            {this.state.status}</Text>
                    }
                </View>

                {/* <Footer /> */}



            </SafeAreaView>
        );
    }
}
export default SubCategory;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
//     body: {
//         flex: 9
//     }
// });
