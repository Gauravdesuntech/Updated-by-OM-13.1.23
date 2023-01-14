import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { subCategoryList, todoList } from "../../../utils/api";
import Header from "../../../component/tasks/Header";
// import Footer from '../../component/tasks/Footer'
import CatItemCard from "../../../component/tasks/CatItemCard";
import { showError } from "../../../actions/Error";
import Spinner from "../../../component/tasks/Spinner";
import AppContext from "../../../context/AppContext";
import moment from "moment";
import Header2 from "../../../component/Header2";
import { getFeedWorks } from "../../../services/AllocationServices";
import { Colors } from "../../../config";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import styles from  '../Styles'
import globalStyles from '../../../config/Styles'


class CleaningTasks extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isFetching: false,
      data: [],
      status: "Loading....",
      today: new Date(),
      show: false,
    };
  }

  componentDidMount = () => {
    this.onFocus = this.props.navigation.addListener("focus", () => {
      this.getAllTasks();
    });
  };

  componentWillUnmount() {
    this.onFocus();
  }

  getAllTasks = (date) => {
    this.setState({ isFetching: true });
    const { feed_id, feed_name, section_id } = this.props.route.params;
    let obj = {};
    if (date) {
      obj = {
        section_id: section_id,
        feed_id: feed_id,
        date: moment(date).format("YYYY-MM-DD"),
      };
    } else {
      obj = {
        section_id: section_id,
        feed_id: feed_id,
      };
    }
    getFeedWorks(obj)
      .then((res) => {
        this.setState({ data: res, isFetching: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isFetching: false });
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true, today: new Date() }, () => {
      this.getAllTasks();
    });
  };

  calculateDate = (type) => {
    let today = this.state.today;
    if (type == "add") {
      this.setState({ today: moment(today).add(1, "days").format() }, () => {
        this.getAllTasks(this.state.today);
      });
    } else {
      this.setState(
        { today: moment(today).subtract(1, "days").format() },
        () => {
          this.getAllTasks(this.state.today);
        }
      );
    }
  };

  showDatePicker = (a) => {
    this.setState({ show: true });
  };

  handleDateConfirm = (selectDate) => {
    this.setState(
      {
        today: moment(selectDate).format(),
      },
      () => {
        this.getAllTasks(this.state.today);
      }
    );
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({ show: false });
  };

  gotoUpdateTask = (item) => {
    this.props.navigation.navigate("UpdateFeedingTask", {
      task_id: item.id,
      task_name: item.name,
    });
  };

  renderTasks = (item) => {
    let users = JSON.parse(item.item.assigned).map((user) => {
      return user?.full_name;
    });
    users = users.join(" , ");
    let date = moment(item.item.schedule_start).format("Do MMM YY (ddd)");
    let time = moment(item.item.schedule_time, "HH:mm:ss").format("LT");
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.cardItems]}
        onPress={() => {
          item.item.status == "completed"
            ? null
            : this.gotoUpdateTask(item.item);
        }}
      >
        <View style={[globalStyles.flexDirectionRow,globalStyles.alignItemsCenter]}>
          {/* change icon size for major icon here */}
          <View>
            <Text
              style={[globalStyles.paddingBottom2,globalStyles.fontSize16,globalStyles.fontWeightBold,{color: "#7f7f7f"}]}
            >
              Assign To: {users}
            </Text>
            <Text style={[globalStyles.paddingBottom2,styles.fontSize13,styles.opacity06]}>
              Name: {item.item.name}
            </Text>
            <Text style={[globalStyles.paddingBottom2,styles.fontSize13,styles.opacity06]}>
              Time: {date} - {time}
            </Text>
            {item.item.updated_by == null ? null : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: windowWidth - 20,
                }}
              >
                <Text style={[globalStyles.paddingBottom2,styles.fontSize13,styles.opacity06]}>
                  Close By: {item.item.full_name_updated_by}
                </Text>
                <Text
                  style={[globalStyles.fontSize,globalStyles.alignItemsFlexEnd,styles.opacity05]}
                  

                >
                  Closed At:{" "}
                  {moment(item.item.updated_at).format("Do MMM YY (ddd)")}
                </Text>
              </View>
            )}
            <Text style={[globalStyles.paddingBottom2,styles.fontSize13,styles.opacity06]}>
              Status:{" "}
              {item.item.status == "completed" ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header2
          navigation={this.props.navigation}
          calculate={this.calculateDate}
          date={this.state.today}
          showDatePicker={this.showDatePicker}
        />
        <View style={styles.body}>
          {this.state.isFetching ? (
            <View style={styles.body}>
              <Spinner />
            </View>
          ) : (
            <>
              {this.state.data.length > 0 ? (
                <FlatList
                  data={this.state.data}
                  renderItem={this.renderTasks}
                  keyExtractor={(item) => item.id.toString()}
                  onRefresh={() => this.onRefresh()}
                  refreshing={this.state.isFetching}
                />
              ) : (
                <View style={[globalStyles.alignItemsCenter,globalStyles.marginTop20]}>
                  <Text style={{ color: Colors.danger }}>
                    {"No Records Found"}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* <Footer /> */}
        <DateTimePickerModal
          mode={"date"}
          display={Platform.OS == "ios" ? "inline" : "default"}
          isVisible={this.state.show}
          onConfirm={this.handleDateConfirm}
          onCancel={this.hideDatePicker}
        />
      </SafeAreaView>
    );
  }
}
export default CleaningTasks;

const windowWidth = Dimensions.get("window").width;
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
//   cardItems: {
//     width: windowWidth,
//     paddingVertical: 12,
//     borderBottomColor: "#e5e5e5",
//     borderBottomWidth: 1,
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
// });
