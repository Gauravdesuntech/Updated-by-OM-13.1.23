import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import {
  ListUsers,
  changeAssignedTask,
  todoList,
  subcat,
  subCategoryList,
  usersTaskListWithSubcat,
  getAllSubcatList,
} from "../../utils/api";
import Header from "../../component/tasks/Header";
import Footer from "../../component/tasks/Footer";
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import SelectBox from "react-native-multi-selectbox";
import { InputDropdown } from "../../component";
import { lowerFirst, xorBy } from "lodash";
import colors from "../../config/colors";
import { formatdate } from "../../utils/helper";
import MultiSelectDropdown from "../../component/MultiSelectDropdown";
import Configs from "../../config/Configs";
import { Colors } from "../../config";
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import AppContext from "../../context/AppContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Animatable from "react-native-animatable";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import globalStyles from "../../config/Styles";
import styles from "./Styles";

const deviceWidth = Dimensions.get("window").width;

const CatItemCard = (props) => {
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.push("ViewItem", {
          id: props.id,
          category_id: props.category_id,
        })
      }
      style={styles.containerCart}
      // onLongPress={() => { props.selectItem(props.item) }}
    >
      <View style={
        { flexDirection: "row", alignItems: "center" }}>
        {/* change icon size for major icon here */}
        <Image
          source={props.priority}
          style={{ height: 45, width: 45, resizeMode: "contain" }}
        />
        <View style={{ paddingLeft: 15 }}>
          <Text
            style={{
              paddingBottom: 2,
              fontSize: 16,
              fontWeight: "bold",
              color: "#7f7f7f",
            }}
          >
            {props.title}
          </Text>
          <Text style={{ paddingBottom: 2, fontSize: 13, opacity: 0.6 }}>
            {props.date}
          </Text>
          <Text style={{ fontStyle: "italic", fontSize: 12, opacity: 0.5 }}>
            {props.members}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: "center", paddingRight: 10 }}>
        {/* change icon size in image style */}
        <Image
          source={props.taskType}
          style={{
            marginBottom: 5,
            height: 25,
            width: 25,
            resizeMode: "contain",
          }}
        />
        <Text style={{ fontSize: 12, opacity: 0.5 }}>{props.coins}</Text>
        <Text style={{ fontSize: 11, opacity: 0.5 }}>Coins</Text>
      </View>
    </TouchableOpacity>
  );
};

class NewAssignScreen extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      status: "loading....",
      selectedUsers: [],
      users: [],
      isFetching: true,
      assignTypeName: "",
      assignTypeID: "",
      assignType: Configs.ASSIGN_TYPE,
      isAssignTypeMenuOpen: false,
      startDate: null,
      endDate: null,
      displayedDate: moment(),
      minDate: moment().set(
        "date",
        String(new Date().getDate()).padStart(2, "0")
      ),
      status: "",
      categories: [],
      sub_categories: [],
      category_name: "",
      subCategory_name: "",
      category_id: "",
      subCategory_id: "",
      tasks_name: "",
      tasks_id: "",
      tasks: [],
      isCategoryOpen: false,
      isSubCategoryOpen: false,
      isAssignOpen: false,
      isTasksOpen: false,
      assign_name: "",
      assign_id: "",
      assignFrom_name: "",
      assignFrom_id: "",
      selectedItems: [],
      isAssignFromOpen: false,
      isAssignTypeOpen: false,
      setDatePickerVisibility: false,
      end_date: "",
      chooseTask: Configs.TASK_TYPE,
      chooseTask_id: "",
      activeSections: "",
      collapsed: true,
      multipleSelect: false,
      subCat: [],
      isActive: false,
      isPress: false,
      isPress_id: "",
      initial: "",
      isDateTimePickerVisible: false,
      type: "startDate",
      mode: "date",
      date: moment(new Date()).add(1, "days").format("YYYY/MM/DD"),
      enddate: moment(new Date()).add(2, "days").format("YYYY/MM/DD"),
      time: "",
    };
  }

  componentDidMount() {
    this.getUserList();
  }

  selectItem = (data) => {
    let priority = critical;
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

  getUserList = () => {
    ListUsers()
      .then((response) => {
        const sources = response.data;
        // console.log(sources)
        let users = sources.data.map((a, index) => {
          return {
            id: a.id,
            name: a.full_name,
          };
        });
        this.setState({
          status: users.length === 0 ? "No Task List Available" : "",
          users: users,
          isFetching: false,
        });
      })
      .catch((error) => {
        this.setState({
          users: [],
          isFetching: false,
        });
        showError(error);
      });
  };

  assign = () => {
    const { assignTypeID, date, enddate, selectedUsers, data, assignFrom_id } =
      this.state;
    if (selectedUsers.length <= 0) {
      alert("Please select user");
      return;
    }
    if (selectedUsers.id == assignFrom_id) {
      alert("Can't Select Same person");
      return;
    }
    if (data.length <= 0) {
      alert("Please select Task");
      return;
    }
    if (date > enddate) {
      alert("End Date Should be Greater than Start Date");
      return;
    }

    let assign_to_date = "";
    if (assignTypeID == "delicate") {
      assign_to_date = enddate;
    } else if (assignTypeID == "permanent") {
      assign_to_date = null;
    } else {
      assign_to_date = null;
    }

    let obj = {
      users: selectedUsers,
      tasks: data,
      assigned_type: assignTypeID,
      assign_from_date: date,
      assign_to_date: assign_to_date,
    };
    this.setState(
      {
        isFetching: true,
      },
      () => {
        changeAssignedTask(obj)
          .then((response) => {
            // console.log("Response>>>>>>>>>>>>", response);
            this.setState({
              isFetching: false,
              selectedUsers: [],
            });
            alert("Task Assign is successfull");
          })
          .catch((err) => {
            this.setState({
              isFetching: false,
            });
            console.log(err);
          });
      }
    );
  };
  showDatePicker = (mode, type) => {
    this.setState({ Mode: mode, type: type, isDateTimePickerVisible: true });
  };

  hideDatePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleConfirm = (selectedDate) => {
    if (this.state.mode === "date") {
      if (this.state.type === "startDate") {
        let startDate = moment(new Date()).format("YYYY/MM/DD");
        let endDate = moment(selectedDate).format("YYYY/MM/DD");
        if (startDate < endDate) {
          this.setState({ date: moment(selectedDate).format("YYYY/MM/DD") });
        } else {
          alert("Start Date Should be Tomorrow or Day After");
        }
      } else if (this.state.type === "endDate") {
        var startDate = moment(this.state.date, "YYYY/MM/DD");
        var endDate = moment(selectedDate, "YYYY/MM/DD");
        var result = endDate.diff(startDate, "days");
        if (result <= 730) {
          this.setState({ enddate: moment(selectedDate).format("YYYY/MM/DD") });
        } else {
          alert("Please Select End Date Start Date To 730 between Day");
        }
      }
    }
    this.hideDatePicker();
  };

  // handleConfirm = (v) => {
  //     // console.log(v);
  //     this.setState({
  //         end_date: v
  //     })
  // }

  toggleTasksOption = () =>
    this.setState({ isTasksOpen: !this.state.isTasksOpen });
  toggleAssignOption = () =>
    this.setState({ isAssignOpen: !this.state.isAssignOpen });
  toggleAssignFromOption = () =>
    this.setState({ isAssignFromOpen: !this.state.isAssignFromOpen });
  toggleAssignTypeOption = () =>
    this.setState({ isAssignTypeOpen: !this.state.isAssignTypeOpen });

  getTaskByUser_Subcat = () => {
    usersTaskListWithSubcat(this.state.assignFrom_id, this.state.subCategory_id)
      .then((res) => {
        let items = res.data.data.filter(
          (item) => item.task_type == "Individual"
        );
        let data = items.map((value) => {
          let priority = critical;
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
            date: formatdate(value.schedule_start, "true"),
            members: value.assign_level_1,
            priority: priority,
            taskType: task_type,
            coins: value.point,
            status: value.status,
            values: value,
          };
        });

        this.setState({
          data: data,
          status: data.length === 0 ? "No Task List Found" : "",
        });
      })
      .catch((err) => console.log(err));
  };

  getTasksBySubcat = (id) => {
    let user_id = this.state.assignFrom_id;
    usersTaskListWithSubcat(user_id, id)
      .then((res) => {
        let items = res.data.data.filter(
          (item) => item.task_type == "Individual"
        );
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
            date: formatdate(value.schedule_start, "true"),
            members: value.assign_level_1,
            priority: priority,
            taskType: task_type,
            coins: value.point,
            status: value.status,
            values: value,
            isSelect: false,
          };
        });

        this.setState({
          tasks: data,
          status: data.length === 0 ? "No Task List Found" : "",
        });
      })
      .catch((err) => console.log(err));
  };

  setAssignType = (v) => {
    this.setState({
      assignTypeID: v,
      isAssignTypeOpen: false,
    });
  };
  setChooseTask = (v) => {
    if (this.state.assignFrom_id == "") {
      this.setState({ chooseTask_id: "", initial: -1 }, () => {
        alert("Please select From Person..");
      });
    } else {
      if (v == "selected" && v == this.state.chooseTask_id) {
        this.setState({
          chooseTask_id: v,
        });
        this.getSubcatList();
        this.RBSheet.open();
      } else if (v == "selected" && v != this.state.chooseTask_id) {
        this.setState({ data: [], chooseTask_id: v });
        this.getSubcatList();
        this.RBSheet.open();
      } else if (v == "all" && v == this.state.chooseTask_id) {
        this.getTaskByUser_Subcat();
      } else if (v == "all" && v != this.state.chooseTask_id) {
        this.setState({
          chooseTask_id: v,
          data: [],
        });
        this.getTaskByUser_Subcat();
      }
      // this.setState({
      //     chooseTask_id: v,
      // }, () => {
      //     if (v == "selected") {
      //         this.setState({ data: [] })
      //         this.getSubcatList();
      //         this.RBSheet.open();
      //     } else {
      //         this.getTaskByUser_Subcat()
      //     }

      // })
    }
  };
  setAssignFrom = (v) => {
    this.setState(
      {
        assignFrom_name: v.name,
        assignFrom_id: v.id,
        data: [],
        tasks: [],
        activeSections: "",
        isAssignFromOpen: false,
      },
      () => {
        if (this.state.chooseTask_id == "all") {
          this.getTaskByUser_Subcat();
        }
      }
    );
    // console.log("Cat>>>>>", v);
  };
  setAssign = (v) => {
    // console.log(v);
    this.setState({
      selectedUsers: v,
      assign_name: v.name,
      assign_id: v.id,
      isAssignOpen: false,
    });
    // console.log("Cat>>>>>", v);
  };

  getSubcatList = () => {
    getAllSubcatList()
      .then((res) => {
        // console.log("Data>>>>>>",res.data);
        let data = res.data.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            user_id: item.user_id,
            image: item.image,
            isCatSelect: false,
          };
        });
        this.setState({
          subCat: data,
        });
      })
      .catch((err) => console.log(err));
  };

  setTasks = (v) => {
    let id = v.id;
    let arr = this.state.data;
    let index = arr.findIndex((element) => element.id === id);

    if (index > -1) {
      arr = arr.filter((element) => element.id !== id);
    } else {
      arr.push(v);
    }
    v.isSelect = !v.isSelect;

    const index2 = this.state.tasks.findIndex((item) => v.id === item.id);
    this.state.tasks[index2] = v;

    this.setState({ data: arr, tasks: this.state.tasks });

    // this.setState({
    //     isPress: !this.state.isPress,
    //     isPress_id: v.id
    // })
  };

  deleteTask = (val) => {
    // console.log(id);
    let arr = this.state.data;
    arr = arr.filter((element) => element.id !== val.id);
    val.isSelect = false;
    const index2 = this.state.tasks.findIndex((item) => val.id === item.id);
    this.state.tasks[index2] = val;
    // console.log("aArrr>>>>>",arr);

    this.setState({ data: arr, tasks: this.state.tasks });
  };

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSections = (v) => {
    let id = v.id;
    let arr = this.state.subCat;
    let index = arr.findIndex((element) => element.id === id);

    if (index > -1) {
      arr = arr.filter((element) => element.id !== id);
    } else {
      arr.push(v);
    }
    v.isCatSelect = !v.isCatSelect;

    const index2 = this.state.subCat.findIndex((item) => v.id === item.id);
    this.state.subCat[index2] = v;

    this.setState({ subCat: this.state.subCat }, () => {
      this.getTasksBySubcat(v.id);
    });
    // this.setState({
    //     activeSections: sections,
    // }, () => { this.getTasksBySubcat(sections.id); })
  };

  setDates = (dates) => {
    this.setState({
      ...dates,
    });
  };

  renderTasksItem = (item) => {
    // console.log(item);
    const { isPress, isPress_id } = this.state;
    return (
      <>
        <ScrollView
          style={[
            styles.selectedItemsContainer,
            this.props.selectedItemsContainer,
          ]}
        >
          <TouchableOpacity onPress={() => this.setTasks(item.item)}>
            <View
              style={item.item.isSelect ? styles.capsulePress : styles.capsule}
            >
              <View style={globalStyles.flexDirectionRow}>
                <Image
                  source={item.item.priority}
                  style={{ height: 30, width: 30, resizeMode: "contain" }}
                />
                <Text
                  style={
                    item.item.isSelect ? styles.taskTextPress : styles.taskText
                  }
                >
                  {item.item.name}{" "}
                </Text>
              </View>
              <Text
                style={[
                    item.item.isSelect ? styles.taskTextPress : styles.taskText,
                  { fontSize: 12, opacity: 0.6, textAlign: "right" },

                ]}
              >
                {item.item.date}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  };

  renderItem = ({ item }) => (
    <View style={styles.containerCart}>
      <View style={[globalStyles.flexDirectionRow,globalStyles.alignItemsCenter]}>
        {/* change icon size for major icon here */}
        <Image
          source={item.priority}
          style={{ height: 45, width: 45, resizeMode: "contain" }}
        />
        <View style={{ paddingLeft: 15 }}>
          <Text
            style={{
              paddingBottom: 2,
              fontSize: 16,
              fontWeight: "bold",
              color: "#7f7f7f",
            }}
          >
            {item.name}
          </Text>
          <Text style={[globalStyles.paddingBottom2,styles.opacity06,
            {fontSize: 13}]}>
            {item.date}
          </Text>
          <Text style={[globalStyles.fontSize,styles.opacity05,
            { fontStyle: "italic"}]}>
            {item.members}
          </Text>
        </View>
      </View>
      <View style={[globalStyles.flexDirectionRow,globalStyles.alignItemsCenter]}>
        <View style={[globalStyles.alignItemsCenter,
          {paddingRight: 10 }]}>
          {/* change icon size in image style */}
          <Image
            source={item.taskType}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 12, opacity: 0.5 }}>{item.coins} Coins</Text>
        </View>
        <TouchableOpacity onPress={() => this.deleteTask(item)}>
          <View>
            <Ionicons
              name="trash-outline"
              style={{ fontSize: 25, color: Colors.danger }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    // console.log(this.state.collapsed);
    const { title, id } = this.props.route.params;
    const { date, enddate, mode, isDateTimePickerVisible, minDate } =
      this.state;
    const { multipleSelect, activeSections } = this.state;
    if (this.state.isFetching) {
      return (
        <SafeAreaView style={styles.container}>
          <Header
            navigation={this.props.navigation}
            leftNavTo={"CategoryItems"}
            params={"assign_user"}
            title={"Assign New User"}
            // leftIcon={'ios-arrow-back'}
          />
          <View style={styles.body}>
            <Spinner />
          </View>
          {/* <Footer /> */}
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <Header
          navigation={this.props.navigation}
          leftNavTo={"CategoryItems"}
          params={"assign_user"}
          title={"Assign New User"}
          // leftIcon={'ios-arrow-back'}
        />

        <View style={styles.body}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <InputDropdown
                label={"From Person"}
                value={this.state.assignFrom_name}
                isOpen={this.state.isAssignFromOpen}
                items={this.state.users}
                openAction={this.toggleAssignFromOption}
                closeAction={this.toggleAssignFromOption}
                setValue={this.setAssignFrom}
                placeholder="Select From Person"
                labelStyle={styles.labelName}
                textFieldStyle={styles.textfield}
                style={[
                  styles.fieldBox,
                  this.state.hasIncidentTypesValidationError
                    ? styles.errorFieldBox
                    : null,
                ]}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputDropdown
                label={"To Person"}
                value={this.state.assign_name}
                isOpen={this.state.isAssignOpen}
                items={this.state.users}
                openAction={this.toggleAssignOption}
                closeAction={this.toggleAssignOption}
                setValue={this.setAssign}
                placeholder="Select To Person"
                labelStyle={styles.labelName}
                textFieldStyle={styles.textfield}
                style={[
                  styles.fieldBox,
                  this.state.hasIncidentTypesValidationError
                    ? styles.errorFieldBox
                    : null,
                ]}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.fieldBox}>
                <Text style={styles.labelName}>Assign Type : </Text>
                <RadioForm
                  radio_props={this.state.assignType}
                  initial={-1}
                  animation={false}
                  onPress={this.setAssignType}
                  buttonColor={"#63c3a5"}
                  selectedButtonColor={"#63c3a5"}
                  selectedLabelColor={Colors.textColor}
                  labelColor={Colors.textColor}
                  formHorizontal={true}
                  labelHorizontal={true}
                  labelStyle={{ marginRight: 15 }}
                  style={[styles.textfield]}
                  buttonSize={15}
                />
              </View>
            </View>
            {this.state.assignTypeID == "delicate" ? (
              <View style={styles.wrapper}>
                <View
                  style={[globalStyles.flexDirectionRow,globalStyles.justifyContentSpaceEvenly,globalStyles.width100
                  ]}
                >
                  <View style={globalStyles.alignItemsCenter}>
                    <Text style={{ opacity: 0.5 }}>STARTS ON</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.showDatePicker("date", "startDate");
                      }}
                      style={styles.dateContainer}
                    >
                      <Text style={{ color: "green" }}>
                        {moment(date).format("DD-MM-YYYY")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={globalStyles.alignItemsCenter}>
                    <Text style={{ opacity: 0.5 }}>ENDS ON</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.showDatePicker("date", "endDate");
                      }}
                      style={styles.dateContainer}
                    >
                      <Text style={{ color: "red" }}>
                        {moment(enddate).format("DD-MM-YYYY")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* <View style={{ alignItems: 'center' }}>
                                    <Text style={{ opacity: 0.5 }}>DUE BY</Text>
                                    <TouchableOpacity onPress={() => { showDatePicker('time', 'time') }} style={styles.dateContainer}>
                                        <Text>{time}</Text>
                                    </TouchableOpacity>
                                </View> */}
                </View>
                <DateTimePickerModal
                  mode={mode}
                  display={Platform.OS == "ios" ? "inline" : "default"}
                  isVisible={isDateTimePickerVisible}
                  onConfirm={this.handleConfirm}
                  onCancel={this.hideDatePicker}
                />
              </View>
            ) : null}
            <View style={styles.inputContainer}>
              <View style={styles.fieldBox}>
                <Text style={styles.labelName}>Select Option : </Text>
                <RadioForm
                  radio_props={this.state.chooseTask}
                  initial={-1}
                  animation={false}
                  onPress={this.setChooseTask}
                  buttonColor={"#63c3a5"}
                  selectedButtonColor={"#63c3a5"}
                  selectedLabelColor={Colors.textColor}
                  labelColor={Colors.textColor}
                  formHorizontal={true}
                  labelHorizontal={true}
                  labelStyle={globalStyles.mr10}
                  style={styles.textfield}
                  buttonSize={15}
                />
              </View>
            </View>
            {/* {this.state.chooseTask_id == 'selected' ?
                            <View style={styles.inputContainer}>
                                <InputDropdown
                                    label={"Categories"}
                                    value={this.state.category_name}
                                    isOpen={this.state.isCategoryOpen}
                                    items={this.state.categories}
                                    openAction={this.toggleCategoryOption}
                                    closeAction={this.toggleCategoryOption}
                                    setValue={this.setCategory}
                                    labelStyle={styles.name}
                                    textFieldStyle={styles.inputText}
                                />
                            </View>
                            : null

                        } 
                        
                        {this.state.category_id == '' ? null :
                            <View style={styles.inputContainer}>
                                <InputDropdown
                                    label={"Sub Categories"}
                                    value={this.state.subCategory_name}
                                    isOpen={this.state.isSubCategoryOpen}
                                    items={this.state.sub_categories}
                                    openAction={this.toggleSubCategoryOption}
                                    closeAction={this.toggleSubCategoryOption}
                                    setValue={this.setSubCategory}
                                    labelStyle={styles.name}
                                    textFieldStyle={styles.inputText}
                                />
                            </View>
                        }*/}

            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              height={500}
              openDuration={50}
              // customStyles={{
              //     container: {
              //         justifyContent: "center",
              //         alignItems: "center"
              //     }
              // }}
            >
              {/* <Tsst_Collapsible
                        assignFrom={this.state.assignFrom_id}
                    /> */}
              <View style={styles.modalContainer}>
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  {/* <Text style={styles.title}>Sub Categories</Text> */}
                  <View
                    style={[
                      styles.selectors,globalStyles.flexDirectionRow,
                      {flexWrap: "wrap" },
                    ]}
                  >
                    {this.state.subCat.map((selector, index) => (
                      <TouchableOpacity
                        key={selector.id}
                        onPress={() => this.setSections(selector)}
                      >
                        <View
                          style={
                            selector.isCatSelect
                              ? styles.capsulePress
                              : styles.capsule
                          }
                        >
                          <Text
                            style={
                              selector.isCatSelect
                                ? styles.capsuleTextPress
                                : styles.capsuleText
                            }
                          >
                            {selector.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Collapsible collapsed={false}>
                    <View style={styles.content}>
                      {this.state.tasks && this.state.tasks.length > 0 ? (
                        <FlatList
                          // horizontal={true}
                          // showsHorizontalScrollIndicator={false}
                          data={this.state.tasks}
                          renderItem={this.renderTasksItem}
                          keyExtractor={(item) => item.id.toString()}
                        />
                      ) : (
                        <View style={globalStyles.justifyContentCenter}>
                          <View
                            style={[globalStyles.justifyContentCenter,globalStyles.textAlignCenter]}
                          >
                            <Text
                              style={[globalStyles.textAlignCenter,
                                {
                                color: Colors.primary,
                              }]}
                            >
                              No Tasks Found
                              {/* <Ionicons
                                                            name="sad-outline"
                                                            style={{ fontSize: 20, color: Colors.danger }}
                                                        /> */}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </Collapsible>
                </ScrollView>
              </View>
            </RBSheet>
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.assign();
                }}
                style={[styles.btn, styles.btnSuccess]}
              >
                <Text style={styles.btnText}>Assign</Text>
              </TouchableOpacity>
            </View>
            <View style={globalStyles.h10} />
            {this.state.data.length > 0 ? (
              <View>
                <Text style={globalStyles.alignSelfCenter}>Selected Tasks</Text>
                <View style={globalStyles.h10} />
                <FlatList
                  data={this.state.data}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            ) : (
              <Text style={[globalStyles.alignSelfCenter,
                {color: "tomato" }]}>
                No Tasks found
              </Text>
            )}
          </ScrollView>
        </View>

        {/* <Footer /> */}
      </SafeAreaView>
    );
  }
}
export default NewAssignScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   body: {
//     flex: 9,
//     // paddingHorizontal: 5,
//     // marginVertical:10
//   },
//   containerCart: {
//     width: "100%",
//     paddingVertical: 12,
//     borderBottomColor: "#e5e5e5",
//     borderBottomWidth: 1,
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   btn: {
//     width: 150,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 3,
//     marginBottom: 5,
//     alignSelf: "center",
//     marginTop: 20,
//   },
//   btnSuccess: {
//     backgroundColor: colors.primary,
//   },
//   btnText: { color: colors.white, fontSize: 16 },
//   fieldBox: {
//     alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     height: "auto",
//     justifyContent: "space-between",
//     marginBottom: 5,
//     marginTop: 5,
//     // shadowColor: "#999",
//     // shadowOffset: {
//     // 	width: 0,
//     // 	height: 1,
//     // },
//     // shadowOpacity: 0.22,
//     // shadowRadius: 2.22,
//     // elevation: 3,
//   },
//   labelName: {
//     color: Colors.textColor,
//     lineHeight: 40,
//     fontSize: 14,
//     paddingLeft: 4,
//     height: "auto",
//   },
//   textfield: {
//     backgroundColor: "#fff",
//     height: "auto",

//     fontSize: 12,
//     color: Colors.textColor,
//     textAlign: "right",
//     padding: 5,
//   },
//   inputContainer: {
//     padding: 10,
//   },
//   name: {
//     fontSize: 18,
//     color: Colors.textColor,
//     marginBottom: 5,
//   },
//   RadioinputContainer: {
//     padding: 10,
//     flexDirection: "row",
//   },
//   Radioname: {
//     fontSize: 18,
//     color: Colors.textColor,
//     top: 8,
//   },
//   inputRadio: {
//     marginLeft: 20,
//     marginTop: 5,
//   },
//   inputText: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 3,
//     fontSize: 18,
//     backgroundColor: "#f9f6f6",
//     paddingHorizontal: 10,
//     color: Colors.textColor,
//   },
//   title: {
//     textAlign: "center",
//     fontSize: 22,
//     fontWeight: "300",
//     marginBottom: 20,
//   },
//   content: {
//     padding: 10,
//     height: 200,
//     backgroundColor: "#fff",
//   },
//   active: {
//     backgroundColor: "rgba(255,255,255,1)",
//   },
//   inactive: {
//     backgroundColor: "rgba(245,252,255,1)",
//   },
//   selectors: {
//     marginTop: 8,
//     marginBottom: 10,
//     flexDirection: "row",
//     paddingHorizontal: 10,
//     // justifyContent: 'center',
//   },
//   selector: {
//     // backgroundColor: '#F5FCFF',
//     padding: 10,
//   },
//   activeSelector: {
//     fontWeight: "bold",
//   },
//   selectTitle: {
//     fontSize: 14,
//     fontWeight: "500",
//     padding: 10,
//   },
//   multipleToggle: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 30,
//     alignItems: "center",
//   },
//   multipleToggle__title: {
//     fontSize: 16,
//     marginRight: 8,
//   },
//   capsule: {
//     // height: 30,
//     // justifyContent: "center",
//     justifyContent: "space-between",
//     flexDirection: "row",
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//     marginHorizontal: 5,
//     marginVertical: 5,
//     borderRadius: 3,
//     borderWidth: 0.6,
//     borderColor: Colors.primary,
//     backgroundColor: Colors.white,
//   },
//   capsulePress: {
//     // height: 30,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     // justifyContent: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//     marginHorizontal: 5,
//     marginVertical: 5,
//     borderRadius: 3,
//     borderWidth: 0.6,
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primary,
//   },
//   taskText: {
//     fontSize: 14,
//     flexDirection: "row",
//     color: Colors.primary,
//     marginHorizontal: 8,
//     marginTop: 5,
//   },
//   taskTextPress: {
//     fontSize: 14,
//     flexDirection: "row",
//     color: Colors.white,
//     marginHorizontal: 8,
//     marginTop: 5,
//   },
//   capsuleText: {
//     fontSize: 14,
//     flexDirection: "row",
//     color: Colors.primary,
//     marginHorizontal: 3,
//     marginBottom: 2,
//   },
//   capsuleTextPress: {
//     fontSize: 14,
//     flexDirection: "row",
//     color: Colors.white,
//     marginHorizontal: 3,
//     marginBottom: 2,
//   },
//   icon: {
//     color: Colors.primary,
//     fontSize: 20,
//     marginLeft: 10,
//   },
//   iconPress: {
//     color: Colors.white,
//     fontSize: 20,
//   },
//   placeHolderContainer: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 3,
//     fontSize: 18,
//     backgroundColor: "#f9f6f6",
//     paddingHorizontal: 10,
//     color: Colors.textColor,
//   },
//   placeholder: {
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#F5FCFF",
//     paddingTop: 3,
//   },
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
//   selectWrapper: {
//     borderRadius: 10,
//     borderWidth: 1,
//     height: 90,
//     width: 75,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 5,
//     marginLeft: 5,
//   },
//   img: { resizeMode: "contain", height: 35, width: 35, marginBottom: 5 },
//   dateContainer: {
//     borderWidth: 1,
//     borderRadius: 3,
//     paddingVertical: 5,
//     marginTop: 5,
//     paddingHorizontal: 15,
//   },
//   daybtn: {
//     padding: 5,
//     borderRadius: 3,
//     height: 45,
//     width: 45,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
