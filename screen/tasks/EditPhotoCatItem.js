import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { addTask, editTask, updateTask, userList } from "../../utils/api";

import Header from "../../component/tasks/Header";
import Footer from "../../component/tasks/Footer";
import Coins from "../../component/tasks/AddTodo/Coins";
import Priority from "../../component/tasks/AddTodo/Priority";
import TaskType from "../../component/tasks/AddTodo/TaskType";
import Assign from "../../component/tasks/AddTodo/Assign";
import Schedule from "../../component/tasks/AddTodo/Schedule";
import Reminder from "../../component/tasks/AddTodo/Reminder";
import PhotoProof from "../../component/tasks/AddTodo/PhotoProof";
import Manage from "../../component/tasks/AddTodo/Manage";
import Sublist from "../../component/tasks/AddTodo/Sublist";
import Upload from "../../component/tasks/AddTodo/Upload";
import DocumentUpload from "../../component/tasks/DocumentUpload";
import Theme from "../../Theme";
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import AssignLevel1 from "../../component/tasks/AddTodo/AssignLevel1";
import moment from "moment";
import Config from "../../config/Configs";
import AppContext from "../../context/AppContext";
import { InputDropdown } from "../../component";
import Colors from "../../config/colors";
//import globalStyles from "../../config/Styles";
import globalStyles from "../../config/Styles";
import styles from "./Styles";


const level1 = require("../../assets/tasks/level1.png");
const level2 = require("../../assets/tasks/level2.png");

class EditPhotoCatItem extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    let date = new Date();
    date.setDate(date.getDate() + 730);
    this.state = {
      editable: false,
      assign_level_1: [],
      assign_level_1_id: [],
      assign_level_2: [],
      document: [],
      schedule_start: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
      schedule_end: moment(new Date()).add(2, "days").format("YYYY-MM-DD"),
      schedule_time: moment(new Date()).format("HH:mm"),
      schedule_weekly: "",
      schedule_monthly: "",
      images: [],
      instructions: "",
      approval: "",
      allocationTypes: [
        { id: "1", value: "class", name: "Class" },
        { id: "2", value: "category", name: "Category" },
        { id: "3", value: "sub_category", name: "Sub Category" },
        { id: "4", value: "common_name", name: "Common Name" },
        { id: "5", value: "animal", name: "Animal" },
      ],
      allocatedTo: undefined,
      isAlloctaedToMenuOpen: false,
    };
  }

  componentDidMount() {
    const { task_id } = this.props.route.params;

    if (task_id) {
      editTask(task_id)
        .then((response) => {
          const data = response.data.data;
          let schedule_start = moment(new Date())
            .add(1, "days")
            .format("YYYY-MM-DD");
          let schedule_time = moment(new Date()).format("HH:mm");
          let schedule_end = moment(new Date())
            .add(2, "days")
            .format("YYYY-MM-DD");
          let schedule_weekly = "";
          let schedule_monthly = "";

          if (data.schedule_type === "one") {
            schedule_start = moment(data.schedule_start).format("YYYY-MM-DD");
            schedule_time = moment(data.schedule_time, "HH:mm a").format(
              "HH:mm"
            );
          } else if (data.schedule_type === "daily") {
            schedule_start = moment(data.schedule_start).format("YYYY-MM-DD");
            schedule_time = moment(data.schedule_time, "HH:mm a").format(
              "HH:mm"
            );
            schedule_end = moment(data.schedule_end).format("YYYY-MM-DD");
          } else if (data.schedule_type === "weekly") {
            schedule_start = moment(data.schedule_start).format("YYYY-MM-DD");
            schedule_time = moment(data.schedule_time, "HH:mm a").format(
              "HH:mm"
            );
            schedule_end = moment(data.schedule_end).format("YYYY-MM-DD");
            schedule_weekly = data.schedule_weekly;
          } else if (data.schedule_type === "monthly") {
            schedule_start = moment(data.schedule_start).format("YYYY-MM-DD");
            schedule_time = moment(data.schedule_time, "HH:mm a").format(
              "HH:mm"
            );
            schedule_end = moment(data.schedule_end).format("YYYY-MM-DD");
            schedule_monthly = data.schedule_monthly;
          }

          let documents =
            data.documents && data.documents.length > 0
              ? data.documents.map((a) => {
                  return {
                    file: Config.DOCUMENT_URL + a,
                    name: a,
                    update: true,
                  };
                })
              : null;
          let images =
            data.photos && data.photos.length > 0
              ? data.photos.map((a) => {
                  return { image: Config.IMAGE_URL + a, update: true };
                })
              : null;
          this.setState({
            editable: true,
            name: data.name,
            category_id: data.category_id,
            description: data.description,
            priority: data.priority,
            taskType: data.task_type,
            sub_tasks: data.sub_tasks,
            instructions: data.instructions,
            assign_level_1: data.assign_level_1.split(","),
            assign_level_2: data.assign_level_2.split(","),
            approval: data.approval,
            is_photo_proof: data.is_photo_proof,
            reminder: data.reminder,
            notofication: data.notofication,
            allocatedTo: data.allocated_to,
            schedule_type: data.schedule_type,
            schedule_start: schedule_start,
            schedule_end: schedule_end,
            schedule_time: schedule_time,
            schedule_weekly: schedule_weekly,
            schedule_monthly: schedule_monthly,
            coins: data.point,
            document: documents,
            images: images,
          });
        })
        .catch((error) => {
          console.log(error);
          showError(error);
        });
    }
    this.getUserList();
  }

  getUserList = () => {
    userList()
      .then((response) => {
        const sources = response.data;
        let users = sources.data.map((a, index) => {
          return {
            id: a.id,
            name: `${a.full_name} - ${a.dept_name}`,
            value: a.id,
          };
        });
        this.setState({
          status: users.length === 0 ? "No Task List Available" : "",
          allocationTypes: users,
          isFetching: false,
        });
      })
      .catch((error) => {
        this.setState({
          isFetching: false,
        });
        showError(error);
      });
  };

  toggleAllocatedToMenu = () =>
    this.setState({
      isAlloctaedToMenuOpen: !this.state.isAlloctaedToMenuOpen,
    });

  setAllocatedTo = (v) => {
    let allocatedTo = v.name;
    this.setState({
      allocatedTo: allocatedTo,
      isAlloctaedToMenuOpen: false,
      showLoader: true,
      notofication: v.id,
    });
  };

  handleSubmit = () => {
    if (this.state.is_photo_proof.toString() === "1") {
      if (this.state.images.length <= 0) {
        alert("Please select image");
        return;
      }
    }

    this.setState(
      {
        loading: true,
      },
      () => {
        const user_id = this.context.userDetails.id;
        const { category_id, task_id } = this.props.route.params;
        let obj = {
          category_id: category_id ? category_id : this.state.category_id,
          name: this.state.name,
          description: this.state.description,
          priority: this.state.priority,
          point: this.state.coins,
          task_type: this.state.taskType,
          assign_level_1: this.state.assign_level_1.toString(),
          assign_lvl_1_user_id: this.state.assign_level_1_id.toString(),
          assign_level_2: this.state.assign_level_2.toString(),
          schedule_type: this.state.schedule_type,
          reminder: this.state.reminder,
          is_photo_proof: this.state.is_photo_proof,
          approval: this.state.approval,
          notofication: this.state.notofication,
          allocated_to: this.state.allocatedTo,
          instructions: this.state.instructions,
          sub_tasks: this.state.sub_tasks,
          status: "pending",
          created_by: user_id,
        };
        if (obj.schedule_type === "one") {
          obj.schedule_start = this.state.schedule_start;
          obj.schedule_time = this.state.schedule_time;
        } else if (obj.schedule_type === "daily") {
          obj.schedule_start = this.state.schedule_start;
          obj.schedule_time = this.state.schedule_time;
          obj.schedule_end = this.state.schedule_end;
        } else if (obj.schedule_type === "weekly") {
          obj.schedule_start = this.state.schedule_start;
          obj.schedule_time = this.state.schedule_time;
          obj.schedule_end = this.state.schedule_end;
          obj.schedule_weekly = this.state.schedule_weekly;
        } else if (obj.schedule_type === "monthly") {
          obj.schedule_start = this.state.schedule_start;
          obj.schedule_time = this.state.schedule_time;
          obj.schedule_end = this.state.schedule_end;
          obj.schedule_monthly = this.state.schedule_monthly;
        }
        let images =
          this.state.images && this.state.images.length > 0
            ? this.state.images.filter((a) => {
                if (!a.update) {
                  return a;
                }
              })
            : [];
        let document =
          this.state.document && this.state.document.length > 0
            ? this.state.document.filter((a) => {
                if (!a.update) {
                  return a;
                }
              })
            : [];
        if (images.length > 0) {
          obj.images = images;
        }
        if (document.length > 0) {
          obj.document = document;
        }
        let task = "";
        if (this.state.editable) {
          task = updateTask(task_id, obj);
        } else {
          task = addTask(obj);
        }
        task
          .then((response) => {
            const sources = response.data;
            alert(sources.type);
            this.setState({
              loading: false,
            });
            this.props.navigation.push("CategoryItems", {
              id: category_id ? category_id : this.state.category_id,
            });
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            showError(error);
          });
      }
    );
  };

  render() {
    const { category_id } = this.props.route.params;
    return (
      <SafeAreaView style={styles.container}>
        <Header
          navigation={this.props.navigation}
          leftNavTo={"CategoryItems"}
          params={{ id: category_id }}
          title={this.state.name ? this.state.name : "Add New Todo List"}
          // leftIcon={'ios-arrow-back'}
          rightIcon={null}
        />
        <View style={styles.body}>
          <ScrollView style={{ padding: 20, marginBottom: 20 }}>
            {/* title here */}
            <Text style={styles.placeholder}>Task Title</Text>
            <View style={styles.wrapper}>
              <TextInput
                value={this.state.name}
                editable={false}
                onChangeText={(text) => this.setState({ name: text })}
                style={{ fontSize: 17, paddingHorizontal: 5, flex: 1 }}
              />
            </View>

            {/* desc here */}
            <Text style={styles.placeholder}>Task Description</Text>
            <View style={styles.wrapper}>
              <TextInput
                multiline={true}
                editable={false}
                value={this.state.description}
                onChangeText={(text) => this.setState({ description: text })}
                style={{ fontSize: 17, paddingHorizontal: 5, flex: 1 }}
              />
            </View>

            {/* priority */}
            <Text style={styles.placeholder}>Priority</Text>
            <Priority
              priority={this.state.priority}
              onPress={(text) => console.log(text)}
            />

            {/* coins */}
            <Text style={styles.placeholder}>Reward Points</Text>
            <Coins
              selected={this.state.coins}
              onPress={(text) => console.log(text)}
            />

            <AssignLevel1
              editable={false}
              icon={level1}
              taskType={this.state.taskType}
              selected={this.state.assign_level_1}
              onAssignChange={(assign1, assign1_id) => {
                console.log("J");
              }}
              onTaskChange={(taskType) => {
                console.log("J");
              }}
            />

            {/* assign level 2  */}
            <Text style={styles.placeholder}>Assign Level -2</Text>
            <Assign
              icon={level2}
              editable={this.state.editable}
              selected={this.state.assign_level_2}
              type={2}
              onPress={(text) => console.log("J")}
            />

            {/* schedule */}
            <Text style={styles.placeholder}>Schedule</Text>
            <Schedule
              selected_schedule_start={this.state.schedule_start}
              selected_schedule_end={this.state.schedule_end}
              selected_schedule_time={this.state.schedule_time}
              selected_schedule_weekly={this.state.schedule_weekly}
              selected_schedule_monthly={this.state.schedule_monthly}
              selected_schedule_type={this.state.schedule_type}
              onPressStartDate={(schedule_start) => {
                console.log("J");
              }}
              onPressEndDate={(schedule_end) => {
                console.log("J");
              }}
              onPressTime={(schedule_time) => {
                console.log("J");
              }}
              onScheduleWeek={(schedule_weekly) => {
                console.log("J");
              }}
              onScheduleMonthly={(schedule_monthly) => {
                console.log(schedule_monthly);
              }}
              onPress={(text) => {
                console.log("J");
              }}
            />

            {/* reminder */}
            <Text style={styles.placeholder}>Reminder</Text>
            <Reminder
              reminder={this.state.reminder}
              onPress={(text) => {
                console.log("J");
              }}
            />

            {/* photo prof */}
            <Text style={styles.placeholder}>Add Photo Proof</Text>
            <PhotoProof
              is_photo_proof={this.state.is_photo_proof}
              onPress={(text) => {
                console.log("J");
              }}
            />

            {/* approval */}
            <Text style={styles.placeholder}>Approval on Completion</Text>
            <PhotoProof
              is_photo_proof={this.state.approval}
              onPress={(text) => {
                console.log("J");
              }}
            />

            {/* notific */}
            <Text style={styles.placeholder}>Notificaiton after Task</Text>
            {/* <Manage
                            selected={this.state.notofication}
                            onPress={(text)=>{
                                this.setState({
                                    notofication:text
                                })
                            }}
                        /> */}
            <View style={styles.wrapper}>
              <TextInput
                value={this.state.allocatedTo}
                editable={false}
                onChangeText={(text) => this.setState({ name: text })}
                style={[globalStyles.flex1,
                      { fontSize: 17, paddingHorizontal: 5}]}
              />
            </View>

            {/* sublist */}

            {/* <Sublist
                            editable={true}
                            sub_tasks={this.state.sub_tasks}
                            onPress={(sub_tasks)=>{
                                this.setState({
                                    sub_tasks:sub_tasks
                                })
                            }}
                        /> */}
            {/* instructions */}
            {/* <Text style={styles.placeholder}>Instructions</Text>
                        <View style={styles.wrapper}>
                            <TextInput multiline={true}
                                       value={this.state.instructions}
                                       onChangeText={text=>this.setState({instructions:text})}
                                       textAlignVertical={'top'}
                                       style={{ fontSize: 17,
                                           paddingHorizontal: 5,
                                           paddingVertical: 5, flex:1 }}
                                placeholder={'Type here'} />
                        </View> */}
            {/* Upload */}
            <Text style={styles.placeholder}>Documents</Text>
            <DocumentUpload
              uploadable={true}
              type={"document"}
              items={this.state.document}
              onChange={(value) => {
                this.setState({
                  document: value,
                });
              }}
            />

            {/* Upload */}
            <Text style={styles.placeholder}>Photos</Text>
            <Upload
              uploadable={true}
              type={"image"}
              items={this.state.images}
              onChange={(value) => {
                this.setState({
                  images: value,
                });
              }}
            />
            <View style={globalStyles.h50} />
            <View
              style={[globalStyles.flexDirectionRow,globalStyles.justifyContentSpaceEvenly,globalStyles.width100]}
                
            >
              {this.state.loading === true ? (
                <TouchableOpacity>
                  <Spinner />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={this.handleSubmit}>
                  <Text style={styles.btns}>
                    {this.state.editable ? "UPDATE" : "SAVE"}{" "}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Todo")}
              >
                <Text style={styles.btns}>EXIT </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 25 }} />
          </ScrollView>
        </View>

        <Footer />
      </SafeAreaView>
    );
  }
}
export default EditPhotoCatItem;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   body: {
//     flex: 9,
//   },
//   placeholder: { fontSize: 17 - 1, marginTop: 15, color: "#7f7f7f" },
//   wrapper: {
//     borderWidth: 1,
//     borderColor: "#e5e5e5",
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     borderRadius: 3,
//     width: "100%",
//     marginTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   btns: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: Theme.primary,
//   },
//   fieldBox: {
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     height: 50,
//     justifyContent: "space-between",
//     marginBottom: 5,
//     marginTop: 5,
//     shadowColor: "#999",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   labelName: {
//     color: Colors.textColor,
//     lineHeight: 40,
//     fontSize: 14,
//     paddingLeft: 4,
//   },
//   textfield: {
//     backgroundColor: "#fff",
//     height: 40,

//     fontSize: 12,
//     color: Colors.textColor,
//     textAlign: "right",
//     width: "60%",
//     padding: 5,
//   },
// });
