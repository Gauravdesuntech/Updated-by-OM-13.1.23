import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { subCategoryList, todoList } from "../../utils/api";
import Header from "../../component/tasks/Header";
// import Footer from '../../component/tasks/Footer'
import CatItemCard from "../../component/tasks/CatItemCard";
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import { formatdate } from "../../utils/helper";
import { Icon } from "react-native-elements";
import AppContext from "../../context/AppContext";
import moment from "moment";
import { Colors } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "../../component";
import globalStyles from "../../config/Styles";
import styles from "./Styles";

const individual = require("../../assets/tasks/manager.png");
const rotate = require("../../assets/tasks/Rotate.png");
const compete = require("../../assets/tasks/Compete.png");
const collaborate = require("../../assets/tasks/Collborate.png");
const critical = require("../../assets/tasks/Critical.png");
const danger = require("../../assets/tasks/Danger.png");
const low = require("../../assets/tasks/Low.png");
const moderate = require("../../assets/tasks/Moderate.png");
const high = require("../../assets/tasks/High.png");
const greentick = require("../../assets/tasks/greentick.png");

class CategoryItems extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      isFetching: false,
      data: [],
      status: "loading....",
      selectUserId: this.props.route.params.selectUserId
        ? this.props.route.params.selectUserId
        : "",
      filter: this.props.route.params.filter,
      extra: this.props.route.params.extra,
      catId: this.props.route.params.catId,
      id: this.props.route.params.id,
      page: 1,
      dataLength: "",
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.subCategoryList(1);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.isFetching) return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  handleLoadMore = () => {
    if (!this.state.isFetching && this.state.dataLength > 0) {
      this.state.page = this.state.page + 1; // increase page by 1
      this.subCategoryList(this.state.page); // method for API call
    }
  };

  subCategoryList = (page) => {
    this.setState({ isFetching: true });
    const { selectUserId, filter, extra, catId, id } = this.state;
    const user_id = selectUserId ? selectUserId : this.context.userDetails.id;
    const query = filter ? filter : "";
    const adv = extra;
    subCategoryList(catId, user_id, query, adv, page)
      .then((response) => {
        const sources = response.data;
        console.log("task response data", sources.data.length);
        this.setState({ dataLength: sources.data.length });
        let data = sources.data.map((value) => {
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
          // let members = value.assign_level_1.split(',')[0]
          return {
            id: value.id,
            title: value.name,
            category_id: value.category_id,
            date: value.schedule_start,
            // time: moment(value.schedule_time, "HH:mm:ss").format("LT"),
            time: value.schedule_time,
            // moment(value.schedule_start).format("Do MMM YY, ddd") +
            // " (" +
            // moment(value.schedule_time, "HH:mm:ss").format("LT") +
            // ")",
            due_by: moment(value.schedule_start).format("Do MMM YY"),
            due_time:
              moment(value.schedule_start).format("ddd") +
              ", " +
              moment(value.schedule_time, "HH:mm:ss").format("LT"),
            closed_date:
              moment(value.updated_at).format("Do MMM YY, ddd") ==
              "Invalid date"
                ? ""
                : moment(value.updated_at).format("Do MMM YY, ddd"),
            members: value.assign_level_1,
            priority: priority,
            incident_type: value.incident_type,
            taskType: task_type,
            coins: value.point,
            status: value.status,
            values: value,
            isSelect: false,
            selectedClass: styles.list,
            created: value.created_by_name,
            closed: value.updated_by_name,
          };
        });
        let listData = page == 1 ? [] : this.state.data;
        let result = listData.concat(data);
        this.setState({
          data: result,
          isFetching: false,
          status: data.length === 0 ? "No Task List Found" : "",
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          data: [],
          isFetching: false,
        });
      });
  };

  filterQuery = (value) => {
    if (value == "clear") {
      this.setState({ filter: "", extra: "" }, () => {
        this.subCategoryList(1);
      });
    } else if (value == "extra") {
      this.setState({ filter: "", extra: "extra=advance" }, () => {
        this.subCategoryList(1);
      });
    } else {
      this.setState({ filter: value, extra: "" }, () => {
        this.subCategoryList(1);
      });
    }
  };

  onRefresh = () => {
    this.setState({ isFetching: true, data: [], page: 1 }, () => {
      this.subCategoryList(1);
    });
  };

  selectItem = (data) => {
    let priority = compete;
    if (data.values.priority === "Critical") {
      priority = critical;
    } else if (data.values.priority === "Danger") {
      priority = danger;
    } else if (data.values.priority === "Low") {
      priority = low;
    } else if (data.values.priority === "Medium") {
      priority = moderate;
    } else if (data.values.priority === "High") {
      priority = high;
    }

    data.isSelect = !data.isSelect;
    data.selectedClass = data.isSelect ? styles.selected : styles.list;
    data.priority = data.isSelect ? greentick : priority;

    const index = this.state.data.findIndex((item) => data.id === item.id);

    this.state.data[index] = data;

    this.setState({
      data: this.state.data,
    });
  };

  goToAssign = () => {
    const { title, id } = this.props.route.params;
    const items = this.state.data.filter((item) => item.isSelect);
    // console.log("Taskssssssssss",items);
    if (items.length === 0) {
      alert("Select at least one task");
      return;
    }
    this.props.navigation.push("NewAssignScreen", { items, title, id });
  };

  render() {
    const { title, catId } = this.props.route.params;

    if (this.state.data === null) {
      return (
        <SafeAreaView style={styles.container}>
          <Header
            navigation={this.props.navigation}
            leftNavTo={"AddCategoryItem"}
            params={{ category_id: catId, task_id: "" }}
            title={title}
            leftIcon={catId == 64 ? "" : "ios-add"}
            rightIcon={"filter"}
          />
          <View style={styles.body}>
            <Spinner />
          </View>
          {/* <Footer /> */}
        </SafeAreaView>
      );
    }

    const itemNumber = this.state.data.filter((item) => item.isSelect).length;
    return (
      <SafeAreaView style={styles.container}>
        <Header
          navigation={this.props.navigation}
          leftNavTo={"AddCategoryItem"}
          params={{ category_id: catId, title: title }}
          title={title}
          title2={true}
          leftIcon={catId == 64 ? "" : "ios-add"}
          rightIcon={"filter"}
          filterQuery={this.filterQuery}
        />
        <View style={styles.body}>
          {this.state.isFetching && this.state.page === 1 ? (
            <Loader />
          ) : (
            <>
              {this.state.data.length > 0 ? (
                <FlatList
                  data={this.state.data}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <CatItemCard
                      navigation={this.props.navigation}
                      category_id={item.category_id}
                      id={item.id}
                      coins={item.coins}
                      taskType={item.taskType}
                      incident_type={item.incident_type}
                      // members={item.members}
                      priority={item.priority}
                      due_by={item.due_by}
                      due_time={item.due_time}
                      closed_date={item.closed_date}
                      title={item.title}
                      status={item.status}
                      closed={item.closed}
                      // created={item.created}
                      item={item}
                      selectItem={this.selectItem}
                      extraData={this.state.data}
                      additional={this.props.route.params.extra}
                    />
                  )}
                  initialNumToRender={this.state.data.length}
                  keyExtractor={(item) => item.id.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isFetching}
                      onRefresh={this.onRefresh}
                    />
                  }
                  ListFooterComponent={this.renderFooter.bind(this)}
                  onEndReachedThreshold={0.4}
                  onEndReached={this.handleLoadMore.bind(this)}
                />
              ) : (
                <View
                  style={[
                    globalStyles.justifyContentCenter,
                    globalStyles.alignItemsCenter,
                  ]}
                >
                  <Text style={{ color: Colors.primary }}>
                    No Records !!
                    {/* <Ionicons
                                                name="sad-outline"
                                                style={{ fontSize: 20, color: Colors.danger }}
                                            /> */}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* <View style={styles.numberBox}>
                                <Text style={styles.number}>{itemNumber}</Text>
                            </View>
                            
                            <TouchableOpacity style={styles.icon}>
                                <View>
                                <Icon
                                    raised
                                    name="assignment-ind"
                                    type="material-icons"
                                    color="#e3e3e3" 
                                    size={30} 
                                    onPress={() => this.goToAssign()}
                                    containerStyle={{ backgroundColor: "#FA7B5F" }}
                                />
                                </View>
                            </TouchableOpacity> */}
        </View>

        {/* <Footer /> */}
      </SafeAreaView>
    );
  }
}
export default CategoryItems;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   body: {
//     flex: 9,
//   },
//   selected: { backgroundColor: "#d3d3d3" },
//   list: {},
//   icon: {
//     position: "absolute",
//     bottom: 20,
//     width: "100%",
//     left: 290,
//     zIndex: 1,
//   },
//   numberBox: {
//     position: "absolute",
//     bottom: 75,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     left: 330,
//     zIndex: 3,
//     backgroundColor: "#e3e3e3",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   number: { fontSize: 14, color: "#000" },
// });
