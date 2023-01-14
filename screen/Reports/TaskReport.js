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
  SectionList,
} from "react-native";
import Header from "../../component/Header";
import CatItemCard from "../../component/tasks/CatItemCard";
import AppContext from "../../context/AppContext";
import moment from "moment";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Colors, Configs } from "../../config";
import { ListEmpty, Loader, MultiSelectDropdown } from "../../component";
import globalStyles from "../../config/Styles";
import { getDepartments } from "../../services/UserManagementServices";
import { getTaskReport } from "../../services/ReportsServices";
import styles from "./Style";
import { DateRangePicker } from "./DateRangePicker";
import { substractDays } from "../../utils/Util";

const individual = Configs.IMAGE_URL + 'upload/task_icon/manager.png';
const rotate = Configs.IMAGE_URL + 'upload/task_icon/Rotate.png';
const compete = Configs.IMAGE_URL + 'upload/task_icon/Compete.png';
const collaborate = Configs.IMAGE_URL + 'upload/task_icon/Collborate.png';
const critical = Configs.IMAGE_URL + 'upload/task_icon/Critical.png';
const danger = Configs.IMAGE_URL + 'upload/task_icon/Danger.png';
const low = Configs.IMAGE_URL + 'upload/task_icon/Low.png';
const moderate = Configs.IMAGE_URL + 'upload/task_icon/Moderate.png';
const high = Configs.IMAGE_URL + 'upload/task_icon/High.png';
const greentick = Configs.IMAGE_URL + 'upload/task_icon/greentick.png';

class TaskReport extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      data: [],
      status: "loading....",
      selectUserId: "",
      page: 1,
      dataLength: "",
      departments: [],
      selectedDepertments: [],
      fromDate: moment(new Date()).format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
      showDate: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      // this.subCategoryList(1);
      this.getData();
      // this.getTasksbyDept(this.state.selectedDepertments);
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

  getData = () => {
    getDepartments(this.context.userDetails.cid)
      .then((res) => {
        this.setState({
          departments: res.map((item) => {
            return {
              id: item.id,
              name: item.dept_name,
              value: item.dept_code,
            };
          }),
        });
      })
      .catch((err) => console.log(err));
  };

  setDeptData = (item) => {
    if (item.length > 0) {
      this.setState(
        {
          selectedDepertments: item,
        }
        // ,
        // () => {
        //   this.getTasksbyDept(item);
        // }
      );
    } else {
      alert("Select atleast one department");
    }
  };

  getTasksbyDept = (depts) => {
    if (!this.state.selectedDepertments.length) {
      alert("Select atleast one department");
      return;
    }

    console.log(this.state.selectedDepertments.length);

    this.setState({
      isFetching: true,
    });
    let departments = this.state.selectedDepertments
      ?.map((v, i) => v.value)
      .join(",");
    let obj = {
      cid: this.context.userDetails.cid,
      departments: departments,
      from_date: this.state.fromDate,
      to_date: this.state.toDate,
    };

    // console.log("Posting Object---", obj)
    getTaskReport(obj)
      .then((res) => {
        const sources = res.data;
        // console.log("Sources-->", sources)
        let dataArr = [];
        for (let key in sources) {
          dataArr.push({ title: key, data: sources[key] });
        }
        // this.setState({ dataLength: sources.data.length });
        let data = dataArr.map((value1) => {
          let data2 = value1.data.map((value) => {
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
            console.log("Priority---", priority)
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
              description: value.description,
              category_id: value.category_id,
              date: value.schedule_start,
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
              photos: JSON.parse(value.photos),
            };
          });
          return { title: value1.title, data: data2 };
        });
        this.setState({
          data: data,
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

  onRefresh = () => {
    this.setState({ isFetching: true, data: [], page: 1 }, () => {
      this.getData();
      this.getTasksbyDept(this.state.selectedDepertments);
    });
  };

  htmlForExportReport = () => {
    let html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Funtoo App Html</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
    </style>
  </head>

  <body style="background: white">
    <main style="font-family: 'Roboto', sans-serif">
    `;

    this.state.data.forEach((item) => {
      html += `
      <div
        style="
          text-align: left;
          background: #65c3a8;
          color: white;
          padding: 1px 10px;
          border-radius: 5px;
          margin-top: 5px;
        "
      >
        <h3 style="line-height: 10px">${item.title}</h3>
      </div>
      `;

      item.data?.forEach((item) => {
        html += `
        <div
        style="
          border-bottom: 1px solid lightgray;
          padding-bottom: 1px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div>
          ${item.title
            ? `<h4
            style="line-height: 0; padding: 0; margin: 35px 0 0 0; color: gray"
          >
            ${item.title}
          </h4>`
            : ""
          }
          <p style="line-height: 24px; color: gray">
          ${`Description: ${item.description ? item.description : 'N/A'}`
          }<br />
          ${item.incident_type && item.category_id == "64"
            ? `Incident Type: ${item.incident_type}`
            : ""
          }
          ${item.category_name ? `Category Name: ${item.category_name}` : ""}
            ${item.created} to ${item.members}<br />
            Status:
            ${Configs.TASK_STATUS[item.status] == "Completed"
            ? `<span style="color: green">${Configs.TASK_STATUS[item.status]
            }</span>`
            : `<span style="color: #7f7f7f">${Configs.TASK_STATUS[item.status]
            }</span>`
          }<br />
            Due By: ${item.due_by} ${item.due_time} <br />
            ${Configs.TASK_STATUS[item.status] == "Pending"
            ? ""
            : `Completed Date: ${item.closed_date} <br /> Completed by: ${item.closed}`
          }
          </p>
          <div
              style="
                display: flex;
                flex-wrap: wrap;
              "
            >`;

        item?.photos?.forEach((element) => {
          html += `<img src="${Configs.IMAGE_URL + element
            }" style="width: 70px; height: 70px; margin-right: 15px" />`;
        });

        html += `
          </div>
        </div>
        <div>
          <div>
            <img src=${item.priority} width="35" height="35" />
          </div>
        </div>
      </div>
        `;
      });
    });

    html += `
    </main>
  </body>
</html>
    `;

    return html;
  };

  exportReport = async (data) => {
    let html = this.htmlForExportReport();

    this.setState({ isFetching: true });

    // this.setShowLoader(true);
    const { uri } = await Print.printToFileAsync({
      html,
    });
    this.setState({ isFetching: false });
    this.exportPdf(uri);
  };

  exportPdf = async (uri) => {
    await shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  };

  filterQuery = (value) => {
    let date = moment(new Date()).format("YYYY-MM-DD");
    if (value == 'custom') {
      this.setState({ showDate: true, fromDate: date })
    } else {
      value == 'last_7_day' ? date = substractDays(7) : value == 'yesterday' ? date = substractDays(1) : date ;
      this.setState({ showDate: false , fromDate: date })
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={"Task Reports"}
          isShowExportIcon={this.state.data.length > 0}
          onPressExport={this.exportReport}
          taskReportFilterQuery={this.filterQuery}
        />
        <View style={styles.body}>
          <MultiSelectDropdown
            label={"Department"}
            selectedItems={this.state.selectedDepertments}
            items={this.state.departments}
            onSave={this.setDeptData}
            placeHolderContainer={globalStyles.textfield}
            placeholderStyle={globalStyles.placeholderStyle}
            labelStyle={globalStyles.labelName}
            textFieldStyle={globalStyles.textfield}
            selectedItemsContainer={[
              globalStyles.selectedItemsContainer,
              globalStyles.width60,
              { height: 100 },
            ]}
            style={globalStyles.fieldBox}
            listView={true}
          />
          {this.state.showDate ? (
            <DateRangePicker
              getSelectedDates={({ fromDate, toDate }) => {
                this.setState({ fromDate, toDate });
              }}
            />
          ) : null}


          <View
            style={[
              globalStyles.width100,
              globalStyles.justifyContentCenter,
              globalStyles.alignItemsCenter,
              globalStyles.pv5,
            ]}
          >
            <TouchableOpacity
              style={globalStyles.incidentbtnCover}
              onPress={this.getTasksbyDept}
            >
              <Text style={globalStyles.incidentbtns}>Submit</Text>
            </TouchableOpacity>
          </View>

          {this.state.isFetching ? (
            <Loader />
          ) : (
            <>
              <SectionList
                sections={this.state.data}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({ item }) => (
                  <CatItemCard
                    navigation={this.props.navigation}
                    category_id={item.category_id}
                    id={item.id}
                    coins={item.coins}
                    taskType={item.taskType}
                    incident_type={item.incident_type}
                    members={item.members}
                    priority={item.priority}
                    due_by={item.due_by}
                    due_time={item.due_time}
                    closed_date={item.closed_date}
                    title={item.title}
                    status={item.status}
                    closed={item.closed}
                    created={item.created}
                    item={item}
                    selectItem={this.selectItem}
                    extraData={this.state.data}
                    on_click={true}
                    photos={item.photos}
                  />
                )}
                contentContainerStyle={
                  this.state.data.length === 0 ? globalStyles.container : null
                }
                ListEmptyComponent={() => <ListEmpty />}
                stickySectionHeadersEnabled
                renderSectionHeader={({ section: { title } }) => {
                  return (
                    <View style={globalStyles.sectionHeader}>
                      <View style={globalStyles.sectionHeaderRight}>
                        <Text
                          style={[
                            globalStyles.fontWeightBold,
                            globalStyles.fontSize16,
                            { color: Colors.white },
                          ]}
                        >
                          {title}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isFetching}
                    onRefresh={this.onRefresh}
                  />
                }
              />
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
export default TaskReport;

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
