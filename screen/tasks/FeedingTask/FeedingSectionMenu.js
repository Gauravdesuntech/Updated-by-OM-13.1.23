import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors, Configs } from "../../../config";
import { Header, ListEmpty, Loader } from "../../../component";
import {
  createFeedConfig,
  getallFeedMenus,
  getAllocationSections,
  syncUpdateFeedWork,
  updateFeedWork,
} from "../../../services/AllocationServices";
import AppContext from "../../../context/AppContext";
import { capitalize, getFileData } from "../../../utils/Util";
import Modal2 from "react-native-modal";
import colors from "../../../config/colors";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";
import CustomCheckbox from "../../../component/tasks/AddTodo/CustomCheckBox";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import ImageView from "react-native-image-viewing";
import globalStyles from "../../../config/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class FeedingSectionMenu extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      isLoading: false,
      sections: [],
      isSearching: true,
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
      updateTask: false,
      imageID: 0,
      Images: [],
      UploadData: [],
      task_id: "",
      // switchIconStatus: false,
      isModalOpen: false,
      show: false,
      showheader: false,
      time: moment(new Date()).format("HH:mm:ss"),
      feedData: "",
      sectionData: "",
      status: false,
      today: new Date(),
      showImage: false,
      updateImages: [],
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
      imagebase64: ''
    };

    this.searchInput = React.createRef(0);
  }

  componentDidMount = () => {
    // console.log("......FeedingSectionMenu.......")
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  };

  onScreenFocus = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadSections(this.state.today);
      }
    );
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadSections(this.state.today);
      }
    );
  };

  choosePhotos = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          allowsMultipleSelection: true,
          base64: true,
        };

        ImagePicker.launchImageLibraryAsync(optins).then(async (result) => {
          if (!result.cancelled) {
            this.setState({
              Images: [
                { id: Number(this.state.imageID), uri: result.uri },
              ],
              imageID: Number(this.state.imageID),
              UploadData: [getFileData(result)],
              imagebase64: result.base64,
            });
          }
        });
      } else {
        Alert.alert("Please allow permission to choose images");
      }
    });
  };

  openCamera = () => {
    ImagePicker.requestCameraPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          base64: true,
        };

        ImagePicker.launchCameraAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              Images: [
                { id: Number(this.state.imageID), uri: result.uri },
              ],
              imageID: Number(this.state.imageID),
              UploadData: [getFileData(result)],
              imagebase64: result.base64,
            });
          }
        });
      } else {
        Alert.alert("Please allow camera permission to click images");
      }
    });
  };

  removeImage = (image) => {
    let arr = this.state.Images;
    arr = arr.filter((element) => element?.id !== image.id);
    let arr2 = this.state.UploadData;
    let uploadImage = getFileData(image);
    arr2 = arr2.filter((element) => element.name !== uploadImage.name);
    this.setState({
      Images: arr,
      UploadData: arr2,
      imagebase64 : ''
    });
  };

  loadSections = (date) => {
    let cid = this.context.userDetails.cid;
    let user_id = this.context.userDetails.id;
    // console.log(date);

    getAllocationSections(cid, moment(date).format("YYYY-MM-DD"), user_id)
      .then((response) => {
        let section_id = this.props.route.params?.sectionID
          ? this.props.route.params?.sectionID
          : "";
        let data = response.filter((item) => item.id == section_id);
        // console.log(data);
        this.setState({
          isLoading: false,
          sections: section_id == "" ? response : data,
        });
      })
      .catch((error) => console.log(error));
  };

  openSearchModal = () => {
    this.setState(
      {
        isSearching: true,
        searchValue: "",
        searchData: [],
        isSearchModalOpen: !this.state.isSearchModalOpen,
      },
      () => {
        if (this.state.isSearchModalOpen) {
          setTimeout(() => {
            this.searchInput.current.focus();
          }, 500);
        } else {
          null;
        }
      }
    );
  };

  closeSearchModal = () => {
    this.setState({
      isSearching: true,
      searchValue: "",
      searchData: [],
      isSearchModalOpen: false,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  searchData = () => {
    let { searchValue, sections } = this.state;
    if (searchValue == "") {
      this.setState({
        searchData: sections,
      });
    } else {
      this.setState({
        searchData: [],
      });
      let sectionsData = sections;
      let data = sectionsData.filter((item) => {
        let name = item.name.toLowerCase();
        let index = name.indexOf(searchValue.toLowerCase());
        return index > -1;
      });

      let userData = sectionsData.filter((item) => {
        let user = item.users.filter((user) => {
          let name = user?.full_name.toLowerCase();
          let index = name.indexOf(searchValue.toLowerCase());
          return index > -1;
        });
        let index2 = item.users.indexOf(user[0]);
        return index2 > -1;
      });

      this.setState({
        isSearching: false,
        isModalOpen: false,
        searchData: data.concat(userData),
      });
    }
  };

  gotoItems = (item, feed) => {
    this.setState({ updateTask: true, task_id: feed.task[0].id });
  };

  handleMarkasComplete = async () => {
    // if (this.state.UploadData.length < 1) {
    //   alert("Please Choose Photo proof");
    //   return;
    // } else {
    this.setState({ isFetching: true });
    let user_id = this.context.userDetails.id;
    let obj = {
      updated_by: user_id,
      id: this.state.task_id
    };
    let arr = [];
    let asyncObj = {
      id: this.state.task_id,
      imagebase64: this.state.imagebase64
    }
    let asyncStorage = await AsyncStorage.getItem('feedWork');
    arr = JSON.parse(asyncStorage) ?? [];
    arr.push(asyncObj);
    await AsyncStorage.setItem('feedWork', JSON.stringify(arr));

    updateFeedWork(obj)
      .then((res) => {
        this.setState(
          {
            isFetching: false,
            updateTask: false,
            imageID: 0,
            Images: [],
            UploadData: [],
            imagebase64 : '',
            task_id: "",
          },
          () => {
            this.loadSections(this.state.today);
            alert("Upload Successfully Done!!");
          }
        );
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert("Something went wrong, Try Again!!");
        console.log(err);
      });
    // }
  };

  getAllFeed = () => {
    let obj = {
      section_id: this.props.route.params.data.id,
    };
    // getFeedMenu().then((res) => {
    // 	// console.log(res);
    // 	this.setState({ feedMenu: res })
    // }).catch((err) => console.log(err))
    getallFeedMenus(obj)
      .then((res) => {
        // console.log(res[0]);
        let data = res.map((item) => {
          return {
            feed_time: item.feed_time,
            id: item.id,
            name: item.name,
            parent_cat: item.parent_cat,
            isStatus: false,
          };
        });
        this.setState({ feedMenu: data });
      })
      .catch((err) => console.log(err));
  };

  submitFeedSchedule = () => {
    this.setState({ isLoading: true, isModalOpen: false });
    let { feedData, sectionData } = this.state;
    let user_id = this.context.userDetails.id;
    let users_data = JSON.stringify(sectionData.users);
    let users_ids = sectionData.users.map((user) => {
      return user.id;
    });

    users_ids = users_ids.join(",");
    let obj = {
      allocated_to: users_data,
      approval: 0,
      approve_anyone: 1,
      assign_level_1: users_data,
      category_id: feedData.id,
      created_by: user_id,
      description:
        sectionData.name +
        "-" +
        feedData.name +
        "(" +
        sectionData.id +
        "_" +
        feedData.id +
        ")",
      instructions: "",
      is_photo_proof: 1,
      name: sectionData.name + "-" + feedData.name,
      notification_after_task: users_data,
      notofication: undefined,
      point: "0",
      priority: "Medium",
      reminder: "No Reminder",
      schedule_end: moment().add(1, "days").format("YYYY-MM-DD"),
      schedule_start: moment().format("YYYY-MM-DD"),
      schedule_time: moment(this.state.time, "HH:mm:ss").format("HH:mm"),
      schedule_type: "daily",
      status: "pending",
      sub_tasks: undefined,
      task_related_to: "Section",
      task_related_to_id: sectionData.id,
      task_related_to_name: sectionData.name,
      task_type: "Individual",
      users: users_ids,
      task_status: Number(this.state.status),
    };
    // console.log("............ data................", obj)
    // return;
    createFeedConfig(obj)
      .then((res) => {
        if (res.is_success) {
          this.setState({ isLoading: false });
          alert("Created Successfully !!");
          this.handelRefresh();
        } else {
          this.setState({ isLoading: false });
          alert("Something went wrong !!");
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        alert("Something went wrong, Try Again!!");
        console.log(err);
      });
  };

  gotoFeedMenu = (item) => {
    // this.closeSearchModal();
    // if (this.props.route.params.id == 86) {
    // 	this.props.navigation.navigate("CleaningTasks", {
    // 		data: item
    // 	});
    // } else {
    // 	this.props.navigation.navigate("FeedBySection", {
    // 		data: item
    // 	});
    // }
  };

  gotoEditSection = (item) => {
    this.closeSearchModal();
    this.props.navigation.navigate("AddSection", {
      id: item.id,
      name: item.name,
      imageURI: item.image,
      screen_title: "Edit Section",
    });
  };

  showDatePicker = (mode) => {
    this.setState({ show: true, mode: mode });
  };

  handleConfirm = (selectDate) => {
    moment(selectDate).format("HH:mm:ss");
    this.setState({
      time: selectDate,
    });
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({ show: false });
  };

  checkEditActionPermissions = (item) => {
    if (this.context.userDetails.action_types.includes("Edit")) {
      this.gotoEditSection(item);
    }
  };

  showImages = (feed) => {
    // console.log(feed.task[0].proof_images);
    this.setState({
      showImage: true,
      updateImages: JSON.parse(feed.task[0].proof_images),
    });
  };

  gotoAddSection = (item) => {
    this.props.navigation.navigate("AddAllocation", {
      inChargeData: item,
    });
  };

  renderListItem = ({ item }) => {
    let users = item.users.map((user) => {
      return user?.full_name;
    });
    users = users.join(" , ");
    // let update_time = '12:33:19'
    // let schedule_time = '17:35:00'
    // console.log(moment(update_time, 'HH:mm:ss').format('HH') - moment(schedule_time, 'HH:mm:ss').format('HH') > 1)
    return (
      <TouchableOpacity
        // underlayColor={"#eee"}
        activeOpacity={1}
        onPress={this.gotoFeedMenu.bind(this, item)}
      >
        <View
          style={{
            borderBottomColor: "#eee",
            borderBottomWidth: 1,
            padding: 1,
          }}
        >
          <View style={styles.view}>
            {/* <View style={[globalStyles.width20,globalStyles.justifyContentCenter]}>
							<Image
								style={styles.image}
								source={{ uri: item.image }}
								resizeMode="contain"
							/>
						</View> */}
            <View
              style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
            >
              <Text style={styles.name}>{capitalize(item.name)}</Text>
              <Text style={[styles.name, { fontSize: 12 }]}>{users}</Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {item.feed_details
                  ? item.feed_details.map((feed) => {
                    if (feed.task.length > 0) {
                      var start = moment(new Date(), "YYYY-MM-DD"); //using the correct format
                      var end = moment(
                        feed.task[0].schedule_end,
                        "YYYY-MM-DD"
                      );
                      var duration = moment.duration(start.diff(end));
                      let color = Colors.mediumGrey;
                      if (
                        feed.task[0].status == "pending" &&
                        moment(new Date()).format("HH") -
                        moment(
                          feed.task[0].schedule_time,
                          "HH:mm:ss"
                        ).format("HH") >=
                        1
                      ) {
                        color = Colors.danger;
                      } else if (
                        feed.task[0].status == "pending" &&
                        duration.asDays() >= 1
                      ) {
                        color = Colors.danger;
                      } else if (
                        feed.task[0].status == "completed" &&
                        moment(feed.task[0].update_time, "HH:mm:ss").format(
                          "HH"
                        ) -
                        moment(
                          feed.task[0].schedule_time,
                          "HH:mm:ss"
                        ).format("HH") >=
                        1
                      ) {
                        color = "#ffb300";
                      } else if (
                        feed.task[0].status == "completed" &&
                        moment(feed.task[0].update_time, "HH:mm:ss").format(
                          "HH"
                        ) -
                        moment(
                          feed.task[0].schedule_time,
                          "HH:mm:ss"
                        ).format("HH") <
                        1
                      ) {
                        color = Colors.green;
                      } else {
                        color = Colors.mediumGrey;
                      }
                      let feed_name = feed.name.split("");
                      feed_name = feed_name[0] + feed_name[5];
                      let arr = item.users;
                      arr = arr.filter(
                        (element) => element?.id == feed.task[0].updated_by
                      );
                      return (
                        <View
                          style={{
                            width: "18%",
                            alignItems: "center",
                            marginHorizontal: 2,
                            borderRadius: 3,
                          }}
                        >
                          <TouchableOpacity
                            key={feed.id}
                            activeOpacity={1}
                            onPress={
                              feed.task[0].status == "completed"
                                ? () => {
                                  this.setState({
                                    updateImages: JSON.parse(
                                      feed.task[0].proof_images
                                    ),
                                  });
                                  if (JSON.parse(
                                    feed.task[0].proof_images
                                  ).length > 0) {
                                    this.openGalleryImageViewer(0);
                                  } else {
                                    alert("No Image")
                                  }
                                }
                                : //  this.showImages.bind(this, feed)
                                duration.asDays() >= 1
                                  ? null
                                  : 
                                  this.gotoItems.bind(this, item, feed)
                            }
                            style={[
                              styles.feedButton,
                              { backgroundColor: color },
                            ]}
                          >
                            <Text
                              style={{ fontSize: 10, color: Colors.white }}
                            >
                              {feed_name}{" "}
                            </Text>
                            {feed.task[0].updated_at == null ||
                              feed.task[0].updated_at == "" ? (
                              <Text
                                style={{ fontSize: 10, color: Colors.white }}
                              >
                                {moment(
                                  feed.task[0].schedule_time,
                                  "HH:mm:ss"
                                ).format("LT")}
                              </Text>
                            ) : (
                              <Text
                                style={{ fontSize: 10, color: Colors.white }}
                              >
                                {moment(
                                  feed.task[0].update_time,
                                  "HH:mm:ss"
                                ).format("LT")}
                              </Text>
                            )}
                          </TouchableOpacity>
                          {arr.length > 0 ? (
                            <Text
                              style={{
                                fontSize: 13,
                                color: Colors.textColor,
                              }}
                            >
                              {""}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: 13,
                                color: Colors.textColor,
                              }}
                            >
                              {feed.task[0].updated_by_name}
                            </Text>
                          )}
                        </View>
                      );
                    } else {
                      null;
                      {
                        /* let color = Colors.white;
                  let feed_name = feed.name.split('')
                  feed_name = feed_name[0] + feed_name[5]
                  return (
                    <TouchableOpacity
                      key={feed.id}
                      activeOpacity={1}
                      style={[styles.feedButton, { backgroundColor: color }]}
                    >
                      <Text style={{ fontSize: 10, color: Colors.white }}>{feed_name} </Text>
                    </TouchableOpacity>
                  ) */
                      }
                    }
                  })
                  : null}
              </View>
            </View>
            {/* {this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ? (
					(
						<View style={styles.angelIconContainer}>
							<View style={styles.qtyContainer}>
								<Text style={styles.qty}>{item.total_animal}</Text>
							</View>
							<Ionicons name="chevron-forward" style={styles.iconStyle} />
						</View>
					)
				) : null} */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderAllocationListItem = ({ item }) => {
    let users = item.users.map((user) => {
      return user?.full_name;
    });
    users = users.join(" , ");
    // let update_time = '12:33:19'
    // let schedule_time = '17:35:00'
    // console.log(moment(update_time, 'HH:mm:ss').format('HH') - moment(schedule_time, 'HH:mm:ss').format('HH') > 1)
    return (
      <View
        style={{ borderBottomColor: "#eee", borderBottomWidth: 1, padding: 1 }}
      >
        <View style={styles.view}>
          {/* <View style={[globalStyles.width20,globalStyles.justifyContentCenter]}>
							<Image
								style={styles.image}
								source={{ uri: item.image }}
								resizeMode="contain"
							/>
						</View> */}
          <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
            <Text style={styles.name}>{capitalize(item.name)}</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[styles.name, { fontSize: 12 }]}>{users}</Text>
              {this.context.userDetails.action_types.includes("Add") ? (
                <TouchableOpacity
                  style={{ top: -20, right: 5 }}
                  onPress={() => this.gotoAddSection(item)}
                >
                  <MaterialIcons
                    name="person-add"
                    size={25}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View
              style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}
            >
              {item.feeds
                ? item.feeds.map((feed) => {
                  let feed_name = feed.name.split("");
                  feed_name = feed_name[0] + feed_name[5];
                  return (
                    <TouchableOpacity
                      key={feed.id}
                      activeOpacity={1}
                      onPress={() => {
                        this.setState({
                          isModalOpen: true,
                          time: feed.feed_time
                            ? feed.feed_time.time
                            : moment(new Date()).format("HH:mm:ss"),
                          feedData: feed,
                          status: feed.feed_time
                            ? feed.feed_time.task_status == "1"
                              ? true
                              : false
                            : false,
                          sectionData: {
                            id: item.id,
                            name: item.name,
                            users: item.users,
                            data: item,
                          },
                        });
                      }}
                      style={[
                        styles.allocFeedButton,
                        { backgroundColor: Colors.mediumGrey },
                      ]}
                    >
                      <Text style={{ fontSize: 10, color: Colors.white }}>
                        {feed_name}{" "}
                      </Text>
                      {feed.feed_time?.time != null ? (
                        <Text style={{ fontSize: 10, color: Colors.white }}>
                          {moment(feed.feed_time.time, "HH:mm:ss").format(
                            "LT"
                          )}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })
                : null}
            </View>
          </View>
        </View>
      </View>
    );
  };
  calculateDate = (type) => {
    let today = this.state.today;
    if (type == "add") {
      this.setState(
        { today: moment(today).add(1, "days").format(), isLoading: true },
        () => {
          this.loadSections(this.state.today);
        }
      );
    } else {
      this.setState(
        { today: moment(today).subtract(1, "days").format(), isLoading: true },
        () => {
          this.loadSections(this.state.today);
        }
      );
    }
  };

  imageSync = async () => {
    this.setState({ isLoading: true });
    let feedWork = JSON.parse(await AsyncStorage.getItem('feedWork')) ?? [];
    if (feedWork.length > 0) {
        let obj = {
          feedWork: await AsyncStorage.getItem('feedWork')
        };
        console.log(obj);
        syncUpdateFeedWork(obj)
          .then(async(res) => {
            // console.log("res>>>", res);
            try {
              await AsyncStorage.removeItem('feedWork');
            } catch (e) {
              throw new Error("failed to remove data from device");
            }
          })
          .catch((err) => {
            alert("Something went wrong!! Try again!")
            this.setState({ isLoading: false });
            console.log(err);
          });
        }else{
          alert("No image to sync!!")
        }
    this.loadSections(this.state.today);
  }

  showDatePickerheader = (a) => {
    this.setState({ showheader: true });
  };

  handleDateConfirmheader = (selectDate) => {
    this.setState(
      {
        today: moment(selectDate).format(),
        isLoading: true,
      },
      () => {
        this.loadSections(this.state.today);
      }
    );
    this.hideDatePickerheader();
  };

  hideDatePickerheader = () => {
    this.setState({ showheader: false });
  };

  // toogleSwitchCategory = () => {
  //   this.setState({ switchIconStatus: !this.state.switchIconStatus }, () => {
  //     this.state.isSearchModalOpen ? null : this.loadSections(this.state.today);
  //   });
  // };

  getGalleryImages = () => {
    let images = this.state.updateImages;
    let data = (images || []).map((item, index) => {
      return {
        id: index,
        uri: item,
      };
    });
    return data;
  };

  closeGalleryImageViewer = () =>
    this.setState({
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
    });

  openGalleryImageViewer = (id) => {
    let galleryImages = this.state.updateImages;
    let index = galleryImages.findIndex((item) => item === id);
    // console.log(index);
    this.setState({
      selectedGalleryImageIndex: index > -1 ? index : 0,
      isGalleryImageViewerOpen: true,
    });
  };

  render = () => {
    return (
      <Container>
        <Header
          navigation={this.props.navigation}
          title={this.state.switchIconStatus ? "Allocation" : this.state.today}
          searchAction={this.openSearchModal}
          // switchIcon={this.toogleSwitchCategory}
          // switchIconStatus={this.state.switchIconStatus}
          goToFeedingMaster={() =>
            this.props.navigation.navigate("FeedingMaster", {
              title: "Feeding Master",
            })
          }
          sync={this.imageSync}
          calculate={this.calculateDate}
          showDatePicker={this.showDatePickerheader}
        />

        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            {this.state.isSearchModalOpen ? (
              <>
                <View style={styles.searchBackground}>
                  <View style={styles.searchContainer}>
                    <View style={styles.searchFieldBox}>
                      <Ionicons name="search" size={24} color={Colors.white} />
                      <TextInput
                        ref={this.searchInput}
                        value={this.state.searchValue}
                        onChangeText={(searchValue) =>
                          this.setState(
                            {
                              searchValue: searchValue,
                              isSearching: true,
                            },
                            () => {
                              this.searchData();
                            }
                          )
                        }
                        autoCompleteType="off"
                        autoCapitalize="none"
                        placeholder="Type Section or User"
                        placeholderTextColor={Colors.white}
                        style={styles.searchField}
                      />
                    </View>
                  </View>
                </View>
                {/* {this.state.isSearching ? (
									<Text style={styles.searchingText}>Searching...</Text>
								) :
									null
								} */}
              </>
            ) : null}
            {/* {this.state.switchIconStatus ? (
              <FlatList
                ListEmptyComponent={() => <ListEmpty />}
                data={
                  this.state.isSearchModalOpen
                    ? this.state.searchData
                    : this.state.sections
                }
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this.renderAllocationListItem}
                initialNumToRender={
                  this.state.isSearchModalOpen
                    ? this.state.searchData.length
                    : this.state.sections.length
                }
                refreshing={this.state.isLoading}
                onRefresh={this.handelRefresh}
                contentContainerStyle={
                  this.state.sections.length === 0 ? styles.container : null
                }
              />
            ) : ( */}
            <FlatList
              ListEmptyComponent={() => <ListEmpty />}
              data={
                this.state.isSearchModalOpen
                  ? this.state.searchData
                  : this.state.sections
              }
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={this.renderListItem}
              initialNumToRender={
                this.state.isSearchModalOpen
                  ? this.state.searchData.length
                  : this.state.sections.length
              }
              refreshing={this.state.isLoading}
              onRefresh={this.handelRefresh}
              contentContainerStyle={
                this.state.sections.length === 0 ? styles.container : null
              }
            />
            {/* )} */}
            <DateTimePickerModal
              mode={"date"}
              display={Platform.OS == "ios" ? "inline" : "default"}
              isVisible={this.state.showheader}
              onConfirm={this.handleDateConfirmheader}
              onCancel={this.hideDatePickerheader}
            />
          </>
        )}

        {/*Search Modal*/}
        {/* <Modal
					animationType="fade"
					transparent={true}
					visible={false}
					onRequestClose={this.closeSearchModal}
				>
					<SafeAreaView style={globalStyles.safeAreaViewStyle}>
						<View style={styles.searchModalOverlay}>
							<View style={styles.seacrhModalContainer}>
								<View style={styles.searchModalHeader}>
									<TouchableOpacity
										activeOpacity={1}
										style={styles.backBtnContainer}
										onPress={this.closeSearchModal}
									>
										<Ionicons name="arrow-back" size={28} color={Colors.white} />
									</TouchableOpacity>
									<View style={styles.searchContainer}>
										<View style={styles.searchFieldBox}>
											<Ionicons name="search" size={24} color={Colors.white} />
											<TextInput
												ref={this.searchInput}
												value={this.state.searchValue}
												onChangeText={(searchValue) =>
													this.setState(
														{
															searchValue: searchValue,
															isSearching: true,
														},
														() => {
															this.searchData();
														}
													)
												}
												autoCompleteType="off"
												autoCapitalize="none"
												placeholder="Type Section Name"
												placeholderTextColor={Colors.white}
												style={styles.searchField}
											/>
										</View>
									</View>
								</View>
								<View style={styles.searchModalBody}>
									{this.state.searchValue.trim().length > 0 ? (
										this.state.isSearching ? (
											<Text style={styles.searchingText}>Searching...</Text>
										) : (
											<FlatList
												data={this.state.searchData}
												keyExtractor={(item, index) => item.id.toString()}
												renderItem={this.renderListItem}
												initialNumToRender={this.state.searchData.length}
												ListEmptyComponent={() => (
													<Text style={styles.searchingText}>No Result Found</Text>
												)}
											/>
										)
									) : null}
								</View>
							</View>
						</View>
					</SafeAreaView>
				</Modal> */}

        {/* Task Allocate Modal */}

        <Modal2
          isVisible={this.state.isModalOpen}
          coverScreen={false}
          onBackdropPress={() => this.setState({ isModalOpen: false })}
        >
          <View style={[styles.popupContainer]}>
            <View style={{ padding: 10 }}>
              <View style={styles.fieldBox}>
                <Text style={styles.labelName}>Select Time : </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.showDatePicker("time");
                  }}
                  style={{ width: "60%", justifyContent: "center" }}
                >
                  <Text style={[styles.textfield]}>
                    {moment(this.state.time, "HH:mm:ss").format("LT")}
                    <MaterialCommunityIcons
                      name="clock-check-outline"
                      size={24}
                      color={Colors.green}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.fieldBox, { borderWidth: 0 }]}>
                <CustomCheckbox
                  handler={() => {
                    this.setState({ status: !this.state.status });
                  }}
                  value={this.state.status}
                  label={"Task Status"}
                  leftTextStyle={styles.textfield}
                />
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.submitFeedSchedule()}
                >
                  <Text style={[styles.buttonText, styles.saveBtnText]}>
                    SAVE
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={this.closeModal}>
                  <Text style={[styles.buttonText, styles.exitBtnText]}>
                    EXIT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal2>

        {/* Task Update Modal */}
        <Modal2
          isVisible={this.state.updateTask}
          coverScreen={false}
          onBackdropPress={() => this.setState({ updateTask: false })}
        >
          <View style={styles.popupContainer}>
            <Text style={styles.popupText}>Upload Photo Proof</Text>
            <View style={[styles.pb0, styles.mb0, globalStyles.p5]}>
              <View style={styles.fieldBox}>
                <Text style={styles.labelName}>{`Upload Photos`}</Text>
                <View style={globalStyles.flexDirectionRow}>
                  <TouchableOpacity
                    activeOpacity={1}
                    // style={styles.textfield}
                    onPress={this.openCamera}
                  >
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={30}
                      color="#444"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{ marginLeft: 5 }}
                    onPress={this.choosePhotos}
                  >
                    <MaterialIcons
                      name="add-photo-alternate"
                      size={31}
                      color="#444"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.Images.length > 0 ? (
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "#444",
                    width: "80%",
                    height: 110,
                    justifyContent: "center",
                  }}
                >
                  <ScrollView
                    contentContainerStyle={globalStyles.alignItemsCenter}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.state.Images.map((item, index) => {
                      return (
                        <View key={index}>
                          <Image
                            source={{ uri: item.uri }}
                            style={{
                              height: 100,
                              width: 100,
                              marginHorizontal: 3,
                              borderWidth: 0.6,
                              borderColor: "rgba(68,68,68,0.4)",
                            }}
                          />
                          <TouchableOpacity
                            style={{ position: "absolute", right: -2, top: -3 }}
                            onPress={() => {
                              this.removeImage(item);
                            }}
                          >
                            <Entypo
                              name="circle-with-cross"
                              size={24}
                              color="rgba(68,68,68,0.9)"
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : null}
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  width: 150,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                }}
                onPress={() => {
                  this.handleMarkasComplete();
                }}
              >
                {this.state.isFetching ? (
                  <ActivityIndicator size={25} color={"white"} />
                ) : (
                  <Text style={styles.btns}>Mark as closed</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  width: 150,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                }}
                onPress={() => {
                  this.setState({
                    isFetching: false,
                    updateTask: false,
                  });
                }}
              >
                <Text style={styles.btns}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal2>

        {/* Task Image Show Modal */}
        <Modal2
          isVisible={this.state.showImage}
          coverScreen={false}
          onBackdropPress={() => this.setState({ showImage: false })}
        >
          <View style={styles.popupContainer}>
            <Text style={styles.popupText}>Uploaded Photo</Text>
            <View style={[styles.pb0, styles.mb0, globalStyles.p5]}>
              {this.state.updateImages.length > 0 ? (
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "#444",
                    width: "80%",
                    height: 110,
                    justifyContent: "center",
                  }}
                >
                  <ScrollView
                    contentContainerStyle={globalStyles.alignItemsCenter}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.state.updateImages.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={1}
                          style={globalStyles.mh4}
                          onPress={this.openGalleryImageViewer.bind(this, item)}
                        >
                          <Image
                            source={{ uri: item }}
                            style={{
                              height: 100,
                              width: 100,
                              marginHorizontal: 3,
                              borderWidth: 0.6,
                              borderColor: "rgba(68,68,68,0.4)",
                            }}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text style={{ color: Colors.danger }}>
                    {"No upload photo available !!"}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  width: 150,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                }}
                onPress={() => {
                  this.setState({ showImage: false });
                }}
              >
                {this.state.isFetching ? (
                  <ActivityIndicator size={25} color={"white"} />
                ) : (
                  <Text style={styles.btns}>Cancel</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal2>

        <ImageView
          visible={this.state.isGalleryImageViewerOpen}
          images={this.getGalleryImages()}
          imageIndex={this.state.selectedGalleryImageIndex}
          onRequestClose={this.closeGalleryImageViewer}
        />

        <DateTimePickerModal
          mode={this.state.mode}
          display={Platform.OS == "ios" ? "inline" : "default"}
          isVisible={this.state.show}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
      </Container>
    );
  };
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 1,
  },
  view: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  image: {
    width: 50,
    height: 50,
  },
  name: {
    fontSize: 18,
    color: Colors.textColor,
  },
  qtyContainer: {
    height: 35,
    width: 35,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: {
    fontSize: 14,
    color: "#FFF",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 30,
  },
  btns: {
    fontSize: 18,
    color: colors.white,
  },
  angelIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconStyle: {
    fontSize: 18,
    color: "#cecece",
  },
  searchModalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
  },
  seacrhModalContainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: Colors.white,
  },
  searchModalHeader: {
    height: 55,
    width: "100%",
    elevation: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.primary,
  },
  backBtnContainer: {
    width: "10%",
    height: 55,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  searchBackground: {
    backgroundColor: Colors.primary,
  },
  searchContainer: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    padding: 5,
    marginTop: -5,
    marginBottom: 5,
    marginHorizontal: 8,
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 3,
    paddingVertical: 5,
    marginTop: 5,
    paddingHorizontal: 15,
    marginHorizontal: 15,
  },
  searchFieldBox: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0, 0.1)",
    borderRadius: 50,
  },
  searchField: {
    padding: 5,
    width: "90%",
    color: Colors.white,
    fontSize: 15,
  },
  searchModalBody: {
    flex: 1,
    height: windowHeight - 55,
  },
  searchingText: {
    fontSize: 12,
    color: Colors.textColor,
    opacity: 0.8,
    alignSelf: "center",
    marginTop: 20,
  },

  popupContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
    width: windowWidth - 40,
  },
  popupText: {
    fontSize: 16,
    color: Colors.black,
    alignSelf: "center",
  },
  pb0: {
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  mb0: {
    marginBottom: 0,
  },
  wrapper: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    width: "100%",
    // marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fieldBox: {
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    padding: 5,
    borderRadius: 3,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    height: "auto",
    justifyContent: "space-between",
  },
  labelName: {
    color: Colors.labelColor,
    // lineHeight: 40,
    fontSize: 19,
    paddingLeft: 4,
    height: "auto",
    paddingVertical: 10,
  },
  textfield: {
    backgroundColor: "#fff",
    height: "auto",
    flexWrap: "wrap",
    fontSize: 19,
    color: Colors.textColor,
    textAlign: "right",
    padding: 5,
  },
  dateField: {
    backgroundColor: "#fff",
    height: "auto",
    flexWrap: "wrap",
    fontSize: 19,
    color: Colors.textColor,
    textAlign: "left",
    width: "22%",
    padding: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveBtnText: {
    color: Colors.primary,
  },
  exitBtnText: {
    color: Colors.activeTab,
  },
  feedButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
    paddingVertical: 5,
    borderRadius: 3,
  },
  allocFeedButton: {
    width: "18%",
    height: 35,
    alignItems: "center",
    marginHorizontal: 2,
    justifyContent: "center",
    paddingHorizontal: 1,
    paddingVertical: 5,
    borderRadius: 3,
  },
});