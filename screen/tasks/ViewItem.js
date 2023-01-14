import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import moment from "moment";

import Header from "../../component/tasks/Header";
// import Footer from '../../component/tasks/Footer'
import Priority from "../../component/tasks/AddTodo/Priority";
import Sublist from "../../component/tasks/AddTodo/Sublist";
import Upload from "../../component/tasks/AddTodo/Upload";
import DocumentUpload from "../../component/tasks/DocumentUpload";
import Theme from "../../Theme";
import { showError } from "../../actions/Error";
import {
  getAssignLevel,
  editTask,
  updateTaskStatus,
  updateTask,
} from "../../utils/api";
import Config from "../../config/Configs";
import AppContext from "../../context/AppContext";
import Spinner from "../../component/tasks/Spinner";
import colors from "../../config/colors";
import { Colors, Configs } from "../../config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
const coins = require("../../assets/tasks/coin_1.png");
const assign = require("../../assets/tasks/management.png");
const tick = require("../../assets/tasks/greentick.png");
const wrong = require("../../assets/tasks/wrong.png");
const time = require("../../assets/tasks/Time.png");
const level1 = require("../../assets/tasks/level1.png");

let documents = [];
let images = [];
const preview = [
  {
    id: "1",
    title: "Critical",
    ico: critical,
  },
  {
    id: "2",
    title: "50",
    ico: coins,
  },
  {
    id: "1",
    title: "Collaborate",
    ico: collaborate,
  },
  {
    id: "1",
    title: "Level 2",
    ico: assign,
  },
];

const assignees = [
  {
    id: "1",
    title: "Ramesh",
    ico: assign,
  },
  {
    id: "2",
    title: "Suresh",
    ico: assign,
  },
  {
    id: "1",
    title: "Sherchand",
    ico: assign,
  },
  {
    id: "1",
    title: "Roshan 2",
    ico: assign,
  },
];

class ViewItem extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      document: [],
      assign_level_1: [],
      assign_lvl_1_user_id: [],
      images: [],
      requirements: [],
      name: "Task Name",
      instructions: "",
      task_data: [],
      showFields: false,
      learning: "",
    };
  }

  componentDidMount() {
    const { id } = this.props.route.params;
    editTask(id)
      .then((response) => {
        const data = response.data.data;
        console.log("data*******", data);
        if (data) {
          let datetime = moment(
            data.schedule_start + " " + data.schedule_time
          ).format("ddd hh:mm A");
          let schedule_end = "";
          let schedule_type = "";
          if (data.schedule_end) {
            schedule_end = moment(data.schedule_end).format("ddd MMM");
          }
          if (data.schedule_weekly) {
            schedule_type = data.schedule_weekly;
          } else if (data.schedule_monthly) {
            schedule_type = data.schedule_monthly;
          }

          let is_photo_proof = "Photo Proof not requested";
          if (data.is_photo_proof === "1") {
            is_photo_proof = "Photo Proof requested";
          }

          data.documents && data.documents.length > 0
            ? (documents = data.documents.map((a, i) => {
              return { file: Config.DOCUMENT_URL + a, name: a };
            }))
            : (documents = data.documents);
          data.photos && data.photos.length > 0
            ? (images = data.photos.map((a, i) => {
              return { image: Config.IMAGE_URL + a, update: true };
            }))
            : [];

          this.setState({
            task_data: data,
            name: data.name,
            description: data.description,
            priority: data.priority,
            taskType: data.task_type,
            sub_tasks: data.sub_tasks,
            instructions: data.instructions,
            assign_level_1: data.assign_level_1.split(","),
            assign_lvl_1_user_id: data.assign_lvl_1_user_id.split(","),
            // assign_level_2: data.assign_level_2.split(','),
            approval: data.approval,
            document: documents,
            images: images,
            learning: data?.learning ?? "",
            task_related_to: data.task_related_to,
            task_related_to_id: data.task_related_to_id,
            task_related_to_name: data.task_related_to_name,
            requirements: [
              {
                id: "2",
                title: is_photo_proof,
                ico: data.is_photo_proof === "1" ? tick : wrong,
              },
            ],
          });
        }
      })
      .catch((error) => showError(error));
  }

  handleMarkasComplete = () => {
    const { is_photo_proof, id, learning } = this.state.task_data;
    // console.log(images);
    let newStatus = "pending";
    if (is_photo_proof == "1") {
      // console.log(this.state.images.length, typeof is_photo_proof);
      // return
      if (this.state.images.length <= 0) {
        alert("You need to add photo proof");
        return;
      } else {
        let data = {
          id: id,
          status: newStatus,
          learning: this.state.learning,
          images:
            this.state.images && this.state.images.length > 0
              ? this.state.images.filter((a) => {
                if (!a.update) {
                  return a;
                }
              })
              : [],
        };
        updateTaskStatus(id, data)
          .then((response) => {
            // console.log("Response ", response.data, response.data.type)
            if (response.data.type == "success") {
              Alert.alert("Success", "Photo Upload Successfully Done!!", [
                { text: "OK" },
              ]);
              this.setState({ showFields: true });
            } else {
              Alert.alert("Failed", "Failed to upload photo", [{ text: "OK" }]);
            }
          })
          .catch((error) => {
            console.log("Error----", error.response.data);
          });
      }
    }
  };

  handleSubmit = () => {
    let currentUser = this.context.userDetails.id;
    let newStatus;
    const { is_photo_proof, id, status, created_by, approval, learning } =
      this.state.task_data;
    approval == "1" ? (newStatus = "waiting") : (newStatus = "completed");
    let data = {
      id: id,
      status: newStatus,
      learning: this.state.learning,
      images:
        this.state.images && this.state.images.length > 0
          ? this.state.images.filter((a) => {
            if (!a.update) {
              return a;
            }
          })
          : [],
    };
    updateTaskStatus(id, data)
      .then((response) => {
        console.log("Response ", response.data, response.data.type);
        if (response.data.type == "success") {
          Alert.alert("Success", "Task updated", [
            { text: "OK", onPress: () => this.props.navigation.goBack() },
          ]);
        } else {
          Alert.alert("Failed", "Failed to update task", [
            { text: "OK", onPress: () => this.props.navigation.goBack() },
          ]);
        }
      })
      .catch((error) => {
        console.log("Error----", error.response.data);
      });
  };

  handleSubmit2 = () => {
    let newStatus = "waiting";
    const { id, learning } = this.state.task_data;
    let data = {
      id: id,
      status: newStatus,
      learning: this.state.learning,
      images:
        this.state.images && this.state.images.length > 0
          ? this.state.images.filter((a) => {
            if (!a.update) {
              return a;
            }
          })
          : [],
    };
    updateTaskStatus(id, data)
      .then((response) => {
        console.log("Response ", response.data, response.data.type);
        if (response.data.type == "success") {
          Alert.alert("Success", "Task updated", [
            { text: "OK", onPress: () => this.props.navigation.goBack() },
          ]);
        } else {
          Alert.alert("Failed", "Failed to update task", [
            { text: "OK", onPress: () => this.props.navigation.goBack() },
          ]);
        }
      })
      .catch((error) => {
        console.log("Error----", error.response.data);
      });
  };

  handleApprove = (status) => {
    const { id } = this.state.task_data;
    let data = {
      id: id,
      status: status,
    };
    updateTaskStatus(id, data)
      .then((response) => {
        console.log("Response ", response.data, response.data.type);
        if (response.data.type == "success") {
          Alert.alert("Success", "Task updated", [
            { text: "OK", onPress: () => this.props.navigation.goBack() },
          ]);
        } else {
          Alert.alert("Failed", "Failed to update task", [
            { text: "OK", onPress: () => this.props.navigation.goBack() },
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.task_data.length <= 0) {
      return (
        <SafeAreaView style={styles.container}>
          <Header
            navigation={this.props.navigation}
            // leftNavTo={'CategoryItems'}
            params={{ id: category_id }}
            title={this.state.name ? this.state.name : "VIEW TASK"}
            // leftIcon={'ios-arrow-back'}
            rightIcon={null}
          />
          <View style={styles.body}>
            <Spinner />
          </View>
          {/* <Footer /> */}
        </SafeAreaView>
      );
    }
    const { id, category_id } = this.props.route.params;
    const { created_by, is_photo_proof } = this.state.task_data;
    const { assign_lvl_1_user_id } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Header
          navigation={this.props.navigation}
          leftNavTo={"CategoryItems"}
          //   params={{ id: category_id }}
          title={this.state.name ? this.state.name : "VIEW TASK"}
          // leftIcon={'ios-arrow-back'}
          route={this.props.route.name}
          task_id={id}
          assign={assign_lvl_1_user_id}
          created_by={created_by}
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView style={{ marginBottom: 0 }}>
            <View style={{ marginBottom: 20 }}>
              {/* title here */}
              <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Task Name:</Text>
                <TextInput
                  value={this.state.name}
                  style={[styles.textfield, globalStyles.width60]}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              {/* Description here */}
              <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Task Description:</Text>
                <TextInput
                  multiline={true}
                  value={this.state.description}
                  style={[styles.textfield, globalStyles.width60]}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              {/* Schedule date here */}
              <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Schedule :</Text>
                <TextInput
                  value={
                    moment(this.state.task_data.schedule_start).format(
                      "Do MMM YY, ddd"
                    ) +
                    " (" +
                    moment(
                      this.state.task_data.schedule_time,
                      "HH:mm:ss"
                    ).format("LT") +
                    ")"
                  }
                  style={[styles.textfield, globalStyles.width60]}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              {/* Assigned by here */}
              {this.state.task_data.created_by_name == null ||
                this.state.task_data.created_by_name == "" ? null : (
                <View style={[styles.fieldBox]}>
                  <Text style={styles.labelName}>Assigned By:</Text>
                  <TextInput
                    value={this.state.task_data.created_by_name}
                    style={[styles.textfield, globalStyles.width60]}
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
              )}

              {/* Assigned To here */}
              <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Assigned To:</Text>
                <TextInput
                  value={this.state.task_data.assign_level_1.split("-")[0]}
                  style={[styles.textfield, globalStyles.width60]}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              {/* Status here */}
              <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Status:</Text>
                <TextInput
                  value={Configs.TASK_STATUS[this.state.task_data.status]}
                  style={[styles.textfield, globalStyles.width60]}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              {this.state.task_data.updated_by_name == null ||
                this.state.task_data.updated_by_name == "" ? null : (
                <>
                  {/* Close here */}
                  <View style={[styles.fieldBox]}>
                    <Text style={styles.labelName}>Closed :</Text>
                    <TextInput
                      value={moment(this.state.task_data.updated_at).format(
                        "Do MMM YY, ddd"
                      )}
                      style={[styles.textfield, globalStyles.width60]}
                      editable={false}
                      selectTextOnFocus={false}
                    />
                  </View>

                  {/* Closed By here */}
                  <View style={[styles.fieldBox]}>
                    <Text style={styles.labelName}>Closed By:</Text>
                    <TextInput
                      value={this.state.task_data.updated_by_name}
                      style={[styles.textfield, globalStyles.width60]}
                      editable={false}
                      selectTextOnFocus={false}
                    />
                  </View>
                </>
              )}
              {/**Images */}
              {is_photo_proof != 1 && this.state.images.length > 0 ? 
              <Upload
                uploadable={false}
                type={"image"}
                items={this.state.images}
                onChange={(value) => {
                  this.setState({
                    images: value,
                  });
                }}
              /> : null}


              {/* Upload */}
              {is_photo_proof == 1 ? (
                <>
                  <Text style={styles.placeholder}>Photo Proof</Text>
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
                </>
              ) : null}

              {this.state.document?.length > 0 ? (
                <>
                  <Text style={styles.placeholder}>Attachment</Text>
                  <DocumentUpload
                    uploadable={false}
                    type={"document"}
                    items={this.state.document}
                    onChange={(value) => {
                      this.setState({
                        document: value,
                      });
                    }}
                  />
                </>
              ) : null}

              {/* Comments here */}
              <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Comments:</Text>
                <TextInput
                  value={this.state.learning}
                  style={[styles.textfield, globalStyles.width60]}
                  multiline={true}
                  onChangeText={(text) => this.setState({ learning: text })}
                  placeholder={"Type here"}
                />
              </View>

              <Text style={styles.placeholder}>Assigned</Text>
              <View style={styles.wrapper}>
                <FlatList
                  horizontal={true}
                  data={this.state.assign_level_1}
                  renderItem={({ item }) => {
                    return (
                      <View style={[globalStyles.alignItemsCenter, { marginLeft: 25 }]}>
                        <Image
                          source={level1}
                          style={{
                            marginBottom: 5,
                            height: 50,
                            width: 50,
                            resizeMode: "contain",
                          }}
                        />
                        <Text>{item.split("-")[0]}</Text>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id}
                />
              </View>

              <View style={{ height: 30 }} />

              {this.context.userDetails.id == created_by ||
                assign_lvl_1_user_id.indexOf(this.context.userDetails.id) > -1 ||
                this.context.filterDetails?.id == "extra" ? (
                <View
                  style={[globalStyles.flexDirectionRow, globalStyles.justifyContentSpaceEvenly, globalStyles.width100]}
                >
                  {this.state.task_data.status == "pending" ||
                    this.state.task_data.status == "rejected" ? (
                    <>
                      {/* {this.state.showFields == true ? (
                                                <> */}
                      {is_photo_proof == 1 && !this.state.showFields ? (
                        <>
                          <TouchableOpacity
                            style={[styles.paddingVertical10, styles.width150,
                            globalStyles.justifyContentCenter, globalStyles.alignItemsCenter, styles.borderRadius3,
                            {
                              backgroundColor: colors.primary,
                            }]}
                            onPress={() => {
                              this.handleMarkasComplete();
                            }}
                          >
                            <Text style={styles.btns}>Upload Photo</Text>
                          </TouchableOpacity>

                          {this.state.showFields ? (
                            this.state.task_data.approval == 1 ? (
                              <TouchableOpacity
                                style={[styles.paddingVertical10, styles.width150,
                                globalStyles.justifyContentCenter, globalStyles.alignItemsCenter, styles.borderRadius3,
                                {
                                  backgroundColor: colors.primary,
                                }]}
                                onPress={this.handleSubmit2}
                              >
                                <Text style={styles.btns}>
                                  Request for Approval{" "}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={[styles.paddingVertical10, styles.width150,
                                globalStyles.justifyContentCenter, globalStyles.alignItemsCenter, styles.borderRadius3,
                                {
                                  backgroundColor: colors.primary,
                                }]}
                                onPress={this.handleSubmit}
                              >
                                <Text style={styles.btns}>Mark as Closed </Text>
                              </TouchableOpacity>
                            )
                          ) : null}
                        </>
                      ) : this.state.task_data.approval == 1 ? (
                        <TouchableOpacity
                          style={[styles.paddingVertical10, styles.width150,
                          globalStyles.justifyContentCenter, globalStyles.alignItemsCenter, styles.borderRadius3,
                          {
                            backgroundColor: colors.primary,
                          }]}
                          onPress={this.handleSubmit2}
                        >
                          <Text style={styles.btns}>Request for Approval </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.paddingVertical10, styles.width150,
                          globalStyles.justifyContentCenter, globalStyles.alignItemsCenter, styles.borderRadius3,
                          {
                            backgroundColor: colors.primary,
                          }]}
                          onPress={this.handleSubmit}
                        >
                          <Text style={styles.btns}>Mark as Closed </Text>
                        </TouchableOpacity>
                      )}
                      {/* </>
                                            ) : (
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: 10,
                                                        width: 150,
                                                        backgroundColor: colors.primary,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 3
                                                    }}
                                                    onPress={this.handleMarkasComplete}
                                                >
                                                    <Text style={styles.btns}> Submit </Text>
                                                </TouchableOpacity>
                                            )} */}

                      {/* <TouchableOpacity>
                                            <Text style={styles.btns}>DELETE </Text>
                                        </TouchableOpacity> */}
                    </>
                  ) : null}
                  {/*} this.state.task_data.status == 'waiting' ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    width: 150,
                                                    backgroundColor: colors.primary,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 3
                                                }}
                                                onPress={this.handleApprove.bind(this, 'rejected')}>
                                                <Text style={[styles.btns, { color: colors.danger }]}> REJECT </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    width: 150,
                                                    backgroundColor: colors.primary,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 3
                                                }}
                                                onPress={this.handleApprove.bind(this, 'approved')}
                                            >
                                                <Text style={[styles.btns, { color: colors.white }]}>APPROVE </Text>
                                            </TouchableOpacity>

                                        </View>
                                    ) : */}
                </View>
              ) : null}

              <View style={{ height: 30 }} />

              {/* preview of selections */}

              <View>
                {/* <Priority priority={this.state.priority}
                                onPress={(text) => this.setState({ priority: text })}
                            /> */}
              </View>

              <View style={{ height: 20 }} />

              {/* sublist */}
              {/* <Sublist
                            editable={false}
                            sub_tasks={this.state.sub_tasks}
                            onPress={(sub_tasks)=>{
                                this.setState({
                                    sub_tasks:sub_tasks
                                })
                            }}
                        /> */}
              {/* <View style={{ height: 25 }} />
                        <FlatList
                            data={this.state.requirements}
                            renderItem={({ item }) =>
                                <View style={{ marginBottom: 20, flex: 1, marginTop: 15, alignItems: 'center', marginLeft: 5, flexDirection: 'row' }}>
                                    <Image source={item.ico} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
                                    <View>
                                        <Text style={{ paddingHorizontal: 10 }}>{item.title}</Text>
                                    </View>

                                </View>}
                            keyExtractor={item => item.id}
                        />

                        <View style={{ height: 15 }} /> */}

              {/* instructions */}
              {/* <Text style={styles.placeholder}>Instructions</Text>
                        <View style={styles.wrapper}>
                            <Text>{this.state.instructions}</Text>
                        </View> */}

              {/* Upload */}
            </View>
          </KeyboardAwareScrollView>
        </View>

        {/* <Footer /> */}
      </SafeAreaView>
    );
  }
}
export default ViewItem;

//

// : assign_lvl_1_user_id.indexOf(this.context.userDetails.id) > - 1 ? (
//     <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>

//         {this.state.task_data.status == 'pending' || this.state.task_data.status == 'waiting' ? (
//             <>
//                 {is_photo_proof == 1 ? (
//                     <TouchableOpacity
//                         style={{
//                             paddingVertical: 10,
//                             width: 150,
//                             backgroundColor: colors.primary,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             borderRadius: 3
//                         }}
//                         onPress={() => {
//                             this.props.navigation.push('EditPhotoCatItem', { task_id: id })
//                         }}>
//                         <Text style={styles.btns}>  Upload Photo </Text>
//                     </TouchableOpacity>
//                 ) : null}

//                 <TouchableOpacity
//                     style={{
//                         paddingVertical: 10,
//                         width: 150,
//                         backgroundColor: colors.primary,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         borderRadius: 3
//                     }}
//                     onPress={this.handleSubmit}
//                 >
//                     <Text style={styles.btns}>Mark as Complete </Text>
//                 </TouchableOpacity>
//             </>
//         ) : null}

//     </View>
// )
