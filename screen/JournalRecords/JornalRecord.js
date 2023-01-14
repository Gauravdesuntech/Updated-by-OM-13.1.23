import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  Button,
  ScrollView,
  SectionList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import {
  getMedicalRecords,
  filterMedicalRecords,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import { Configs } from "../../config";
import DownloadFile from "../../component/DownloadFile";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  downloadJournal,
  filterJournalRecord,
  get_journal_record_for_pdf,
  journalRecords,
} from "./../../services/JournalService";
import { capitalize, showDate } from "../../utils/Util";
import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;
import * as Sharing from "expo-sharing";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import colors from "../../config/colors";
import * as WebBrowser from "expo-web-browser";
import globalStyles from "../../config/Styles";
import { userList } from "../../utils/api";
import UserItem from "../../component/tasks/UserItem";
import OverlayLoader from "./../../component/OverlayLoader";
import styles from "./Styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class JornalRecord extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      activeTabKey: "O",
      records: [],
      selectedFilterItem: null,
      downloadProgress: "",
      clickFilter: false,
      isDateTimePickerVisible: false,
      toDate: moment(new Date()).format("YYYY-MM-DD"),
      fromDate: moment(new Date()).subtract(1, "days").format("YYYY-MM-DD"),
      type: "",
      checkFilter: false,
      today: new Date(),
      showheader: false,
      switchStatus: false,
      users: [],
      searchValue: "",
      selectUserId: "",
      selectUserName: "",
      clickUser: false,
      activeTab: Configs.JOURNAL_TAB_MENU[0], //{ id: "" },
      pdf_records: [],
      page: 1,
      dataLength: "",
    };
    this.inputRef = React.createRef();
  }

  // downloadPath =
  //   FileSystem.documentDirectory +
  //   (Platform.OS == "android" ? "Download/" : "");
  // ensureDirAsync = async (dir, intermediates = true) => {
  //   const props = await FileSystem.getInfoAsync(dir);
  //   if (props.exist && props.isDirectory) {
  //     return props;
  //   }
  //   let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates });
  //   return await this.ensureDirAsync(dir, intermediates);
  // };

  // downloadCallback = (downloadProgress) => {
  //   const progress =
  //     downloadProgress.totalBytesWritten /
  //     downloadProgress.totalBytesExpectedToWrite;
  //   this.setState({
  //     downloadProgress: progress,
  //   });
  // };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  }

  onScreenFocus = () => {
    this.setState(
      {
        isLoading: true,
        activeTabKey: "O",
        clickUser: this.state.selectUserId ? true : false,
        records: [],
        page: 1,
      },
      () => {
        this.getJournalRecords(1);
        this.getUserList();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  // For user filters

  getUserList = () => {
    const user_id = this.context.userDetails.id;
    userList(user_id)
      .then((response) => {
        // console.log("Users>>>>>>>",response.data.data);
        const sources = response.data;
        let users = sources.data.map((a, index) => {
          return {
            id: a.id,
            title: a.full_name,
            priority: a.user_code,
            department: a.dept_name,
            designation: a.desg_name,
          };
        });

        this.setState({
          users: users,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          users: [],
          isLoading: false,
        });
        showError(error);
      });
  };

  getData = () => {
    let { searchValue } = this.state;
    let items = this.state.users || [];

    let data = items.filter((element) => {
      let name = element.title.toLowerCase();
      let index = name.indexOf(searchValue.toLowerCase());
      return index > -1;
    });
    return data;
  };

  toggleSwitch = () => {
    this.setState(
      {
        switchStatus: !this.state.switchStatus,
        clickUser: this.state.selectUserId ? true : false,
      },
      () => {
        this.getUserList();
        if (this.state.switchStatus) {
          setTimeout(() => {
            this.inputRef.current.focus();
          }, 500);
        } else {
          null;
        }
      }
    );
  };

  clickUser = (id, name) => {
    this.setState(
      {
        switchStatus: !this.state.switchStatus,
        selectUserId: this.context.userDetails.id === id ? "" : id,
        clickUser: this.state.selectUserId ? true : false,
        selectUserName:
          this.context.userDetails.id === id ? "" : name.split(" ")[0],
      },
      () => {
        this.getJournalRecords(1);
      }
    );
  };

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.isLoading) return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  handleLoadMore = () => {
    if (!this.state.isLoading && this.state.dataLength > 0) {
      this.state.page = this.state.page + 1; // increase page by 1
      this.getJournalRecords(this.state.page); // method for API call
    }
  };

  onRefresh = () => {
    this.setState(
      {
        isLoading: true,
        selectUserId: "",
        clickUser: this.state.selectUserId ? true : false,
        selectUserName: "",
        records: [],
        tag: "all_task",
      },
      () => {
        this.getJournalRecords(1);
      }
    );
  };

  // end of user filters

  getJournalRecords = (page) => {
    this.setState(
      {
        isLoading: true,
        clickUser: this.state.selectUserId ? true : false,
        checkFilter: false,
      },
      () => {
        let obj = {
          cid: this.context.userDetails.cid,
          user_id: this.state.selectUserId
            ? this.state.selectUserId
            : this.context.userDetails.id,
          type: this.state.activeTab.value,
          page: page,
        };
        journalRecords(obj)
          .then((res) => {
            let dataArr = [];
            for (let key in res) {
              dataArr.push({ title: key, data: res[key] });
            }
            // console.log(dataArr.length);
            this.setState({ dataLength: dataArr.length });
            let listData = page == 1 ? [] : this.state.records;
            let result = listData.concat(dataArr);
            this.setState({
              clickUser: this.state.selectUserId ? true : false,
              records: result,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        get_journal_record_for_pdf(obj)
          .then((res) => {
            this.setState({
              isLoading: false,
              pdf_records: res.data,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  };

  dateFilterSubmit = (date, type) => {
    this.setState({
      isLoading: true,
    });
    let obj = {
      cid: this.context.userDetails.cid,
      user_id: this.state.selectUserId
        ? this.state.selectUserId
        : this.context.userDetails.id,
      from_date: moment(date).format("YYYY-MM-DD"),
      to_date: moment(date).format("YYYY-MM-DD"),
      // type: this.state.activeTab.value,
      type,
    };
    filterJournalRecord(obj)
      .then((res) => {
        // console.log("Journal Records>>>>>>>>", res.data[1], "Length", res.data.length);
        this.setState({
          isLoading: false,
          clickUser: this.state.selectUserId ? true : false,
          switchStatus: false,
          records: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        console.log(err);
      });
  };

  // download_data = () => {
  //   this.setState({
  //     isLoading: true,
  //   });
  //   let obj = {
  //     cid: this.context.userDetails.cid,
  //     user_id: this.context.userDetails.id,
  //     from_date: moment(this.state.today).format("YYYY-MM-DD"),
  //     to_date: moment(this.state.today).format("YYYY-MM-DD"),
  //   };
  //   downloadJournal(obj)
  //     .then((res) => {
  //       console.log(res.url);
  //       if (Platform.OS == "ios") {
  //         this.downloadIosFile(res.url);
  //       } else {
  //         this.downloadFile(res.url);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       this.setState({ isLoading: false });
  //     });
  // };

  // downloadIosFile = async (url) => {
  //   console.log(url);
  //   let result = await WebBrowser.openBrowserAsync(url);
  //   console.log(result);
  //   this.setState({ isLoading: false });
  //   return;
  // };

  // filterData = () => {
  //   this.setState({
  //     clickUser: this.state.selectUserId ? true : false,
  //     clickFilter: !this.state.clickFilter,
  //   });
  // };

  // downloadFile = async (link) => {
  //   let fileUrl = link;
  //   let name = Configs.SEGMENT
  //     ? `${fileUrl.split("/")[7]}`
  //     : `${fileUrl.split("/")[6]}`;

  //   if (Platform.OS == "android") {
  //     const dir = this.ensureDirAsync(this.downloadPath);
  //   }
  //   const downloadResumable = FileSystem.createDownloadResumable(
  //     fileUrl,
  //     this.downloadPath + name,
  //     {},
  //     this.downloadCallback
  //   );

  //   try {
  //     const { uri } = await downloadResumable.downloadAsync();

  //     if (Platform.OS == "android") this.saveAndroidFile(uri, name);
  //   } catch (e) {
  //     this.setState({ isLoading: false });
  //     console.error("download error:", e);
  //   }
  // };

  // saveAndroidFile = async (fileUri, fileName) => {
  //   try {
  //     const fileString = await FileSystem.readAsStringAsync(fileUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const permissions =
  //       await StorageAccessFramework.requestDirectoryPermissionsAsync();
  //     if (!permissions.granted) {
  //       this.setState({ isLoading: false });
  //       return;
  //     }

  //     try {
  //       let ext = fileName.split(".")[1];
  //       await StorageAccessFramework.createFileAsync(
  //         permissions.directoryUri,
  //         fileName,
  //         `application/${ext}`
  //       )
  //         .then(async (uri) => {
  //           await FileSystem.writeAsStringAsync(uri, fileString, {
  //             encoding: FileSystem.EncodingType.Base64,
  //           });
  //           alert("Downloaded Successfully");
  //           this.setState({ isLoading: false });
  //           Sharing.shareAsync(fileUri);
  //         })
  //         .catch((e) => {
  //           this.setState({ isLoading: false });
  //           throw new Error(e);
  //         });
  //     } catch (e) {
  //       this.setState({ isLoading: false });
  //       console.error("download error:", e);
  //       throw new Error(e);
  //     }
  //   } catch (err) {
  //     this.setState({ isLoading: false });
  //     console.error("download error:", err);
  //   }
  // };

  createHtml = () => {
    let html = `<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta http-equiv="x-ua-compatible" content="ie=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>App Html Table</title>
				<style>
					@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
				</style>
			</head>
		
			<body style="background: white">
				<main style="font-family: 'Roboto', sans-serif">
					<div style="text-align: center">
						<h3>${
              this.state.selectUserName
                ? this.state.selectUserName
                : this.context.userDetails.full_name
            }</h3>
					</div>`;

    this.state.pdf_records?.forEach(
      (item) =>
        (html += `
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
            <h4 style="line-height: 0; padding: 0; margin: 35px 0 0 0; color: gray">
            ${this.getName(item)}
            </h4>
            <p style="line-height: 24px; color: gray">${item.description}</p>
          </div>
          <div>
            <p>${this.getDateWithCustomFormat(item)}</p>
          </div>
        </div>
        `)
    );

    html += `</main>
			</body>
		</html>
		`;

    return html;
  };

  exportPdf = async () => {
    const { uri } = await Print.printToFileAsync({
      html: this.createHtml(),
    });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  gotoView = (item) =>
    this.props.navigation.navigate("ViewMedicalRecord", {
      item: item,
      status: this.state.activeTabKey,
    });

  getType = (item) => {
    const extra = JSON.parse(item.data_ref);
    let type = "";
    if (item.type === "task" || item.type == "feed") {
      if (item.type == "feed") {
        let name = item.name.split("-")[1];
        type = name + " Completed";
      } else if (extra?.status == "waiting") {
        type = "Task Completed and Approval Requested";
      } else if (extra?.status == "rejected") {
        type = "Task Rejected";
      } else if (extra?.status == "approved") {
        type = "Task Approved";
      } else if (item.status == "Created") {
        type = "New Task Created";
      } else {
        type = capitalize(item.purpose);
      }
    } else if (item.type == "enclosure") {
      if (item.type == "feed") {
        type = "Feeding Completed";
      } else if (item.extra == "Created") {
        type = "Enclosure change Requested";
      } else if (item.extra == "changed") {
        type = "Enclosure change Confirmed";
      } else if (item.extra == "approved") {
        type = "Enclosure change Approved";
      } else if (item.extra == "rejected") {
        type = "Enclosure change Rejected";
      }
    } else if (item.purpose == "incident created") {
      let name = JSON.parse(item.data_ref).short_desc;
      type = name;
    } else if (item.purpose == "medical record created") {
      type = "Medical Record Entry";
    } else {
      type = capitalize(item.purpose);
    }

    return type;
  };

  getName = (item) =>
    item.type == "feed"
      ? item.name.split("-")[0]
      : item.type == "incident"
      ? item.name + " (Incident)"
      : item.name;

  getDateWithCustomFormat = (item) => moment(item.created_at).format("LT");

  getDateTimeWithCustomFormat = (item) =>
    moment(item.created_at).format("DD-MM-YYYY dddd");

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[globalStyles.fieldBox, globalStyles.justifyContentSpaceBetween]}
        activeOpacity={1}
      >
        <View>
          <Text
            style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}
          >
            {this.getName(item)}
          </Text>

          <Text
            style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}
          >
            {/* {this.getType(item)} */}
            {item.description}
          </Text>
        </View>
        <View>
          <Text
            style={[
              globalStyles.textfield,
              globalStyles.p5,
              globalStyles.fontSize20,
            ]}
          >
            {this.getDateWithCustomFormat(item)}
          </Text>
        </View>
      </TouchableOpacity>
      // <TouchableOpacity style={[globalStyles.fieldBox]} activeOpacity={1}>
      //   <View>
      //     {/* <Text style={globalStyles.labelName}>
      // 		{"Sl No.: "}
      // 		<Text style={globalStyles.textfield}>{`${index + 1}`}</Text>
      // 	</Text> */}
      //     {/* <Text style={globalStyles.labelName}>
      // 			{"ref: "}
      // 			<Text style={globalStyles.textfield}>{index}</Text>
      // 		</Text> */}

      //     <Text style={[globalStyles.textfield, globalStyles.pd0, { padding: 5 }]}>
      //       {/* {item.type == "feed"
      //         ? item.name.split("-")[0]
      //         : item.type == "incident"
      //         ? item.name + " (Incident)"
      //         : item.name} */}
      //       {this.getName(item)}
      //     </Text>

      //     <Text style={[globalStyles.textfield, globalStyles.pd0, { padding: 5 }]}>
      //       {this.getType(item)}
      //     </Text>
      //     {/* <Text style={globalStyles.labelName}>
      // 			{"Status: "}
      // 			<Text style={globalStyles.textfield}>
      // 				{item.status}
      // 			</Text>
      // 		</Text> */}
      //   </View>
      //   <View>
      //     <Text style={[globalStyles.textfield, { padding: 5 }, { fontSize: 20 }]}>
      //       {/* {moment(item.created_at).format("LT")} */}
      //       {this.getDateWithCustomFormat(item)}
      //     </Text>
      //     {/* <Text style={[globalStyles.textfield, { fontSize: 12, fontWeight: 'bold' }]}>
      // 			{moment(item.created_at).format("Do MMM YY")}
      // 		</Text> */}
      //   </View>
      // </TouchableOpacity>
    );
  };

  calculateDate = (type) => {
    let today = this.state.today;
    if (type == "add") {
      this.setState({ today: moment(today).add(1, "days").format() }, () => {
        this.getJournalRecords(this.state.page);
      });
    } else {
      this.setState(
        { today: moment(today).subtract(1, "days").format() },
        () => {
          this.getJournalRecords(this.state.page);
        }
      );
    }
  };

  showDatePickerheader = (a) => {
    this.setState({ showheader: true });
  };

  handleDateConfirmheader = (selectDate) => {
    this.setState(
      {
        clickUser: this.state.selectUserId ? true : false,
        today: moment(selectDate).format(),
      },
      () => {
        this.getJournalRecords(this.state.today, this.state.activeTab.value);
      }
    );
    this.hideDatePickerheader();
  };

  hideDatePickerheader = () => {
    this.setState({ showheader: false });
  };

  toggleTab = (item) => {
    this.setState({ activeTab: { ...item }, isLoading: true, page: 1 }, () => {
      this.getJournalRecords(1);
    });
  };

  render = () => (
    <Container>
      <Header
        title={"Journal Records"}
        switchUserIcon={this.toggleSwitch}
        switchUserStatus={this.state.clickUser}
        selectUserName={this.state.selectUserName}
        exportCommonName={
          this.context.userDetails?.journal_action_types.includes("Report")
            ? // ? this.download_data
              this.exportPdf
            : undefined
        }
        // filter={this.context.userDetails?.journal_action_types.includes("Filter") ? this.filterData : undefined}
        // clickFilter={this.state.clickFilter}
        // calculate={this.calculateDate}
        // showDatePicker={this.showDatePickerheader}
      />
      <View style={globalStyles.scroll}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexWrap: "wrap",
            backgroundColor: Colors.white,
            paddingVertical: 5,
            paddingHorizontal: 5,
          }}
        >
          {/* <Ionicons style={globalStyles.icon} name="chevron-back-outline" size={26} color={Colors.white} /> */}
          {Configs.JOURNAL_TAB_MENU.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={this.toggleTab.bind(this, item)}
              >
                <View
                  style={[
                    styles.listItem,
                    {
                      backgroundColor:
                        this.state.activeTab?.id === item.id
                          ? Colors.primary
                          : Colors.white,
                    },
                  ]}
                  key={item.id}
                >
                  <Text
                    style={[
                      styles.name,
                      {
                        color:
                          this.state.activeTab.id === item.id
                            ? Colors.white
                            : Colors.primary,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* <Ionicons style={globalStyles.icon} name="chevron-forward-outline" size={26} color={Colors.white} /> */}
        </ScrollView>
      </View>
      {/* {this.state.clickFilter ?
				<View style={globalStyles.searchBackground}>
					<View style={globalStyles.searchContainer}>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ opacity: 0.5 }}>From Date</Text>
							<TouchableOpacity onPress={() => { this.showDatePicker('fromDate') }} style={globalStyles.dateContainer}>
								<Text style={{ color: colors.primary }}>{moment(this.state.fromDate).format("DD-MM-YYYY")}</Text>
							</TouchableOpacity>
						</View>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ opacity: 0.5 }}>To Date</Text>
							<TouchableOpacity onPress={() => { this.showDatePicker('toDate') }} style={globalStyles.dateContainer}>
								<Text style={{ color: colors.primary }}>{moment(this.state.toDate).format("DD-MM-YYYY")}</Text>
							</TouchableOpacity>
						</View>
						<View style={{ marginTop: 10 }}>
							<TouchableOpacity
								style={{
									paddingHorizontal: 5,
									// width: 80,
									height: 26,
									backgroundColor: colors.primary,
									justifyContent: 'center',
									alignItems: 'center',
									borderRadius: 3,
									marginTop: 9,
									marginHorizontal: 15,
								}}
								onPress={this.dateFilterSubmit}
							>
								<Text style={{ fontSize: 16, color: colors.white }}>Submit</Text>
							</TouchableOpacity>
						</View>
						<DateTimePickerModal
							mode={"date"}
							display={Platform.OS == 'ios' ? 'inline' : 'default'}
							isVisible={this.state.isDateTimePickerVisible}
							onConfirm={this.handleConfirm}
							onCancel={this.hideDatePicker}
						/>
					</View>
				</View> : null} */}
      <>
        {this.state.isLoading && this.state.page === 1 ? (
          <OverlayLoader />
        ) : (
          <>
            {this.state.switchStatus ? (
              <>
                <View style={globalStyles.searchBackground}>
                  <View style={globalStyles.headerSearchContainer}>
                    <View style={globalStyles.searchFieldBox}>
                      <Ionicons name="search" size={24} color={Colors.white} />
                      <TextInput
                        ref={this.inputRef}
                        value={this.state.searchValue}
                        onChangeText={(searchValue) =>
                          this.setState({ searchValue })
                        }
                        // autoCompleteType="off"
                        placeholder=" Search here..."
                        placeholderTextColor={Colors.white}
                        style={globalStyles.searchField}
                      />
                    </View>
                  </View>
                </View>
                <View style={globalStyles.listContainer}>
                  {this.state.users.length > 0 ? (
                    <FlatList
                      data={this.getData()}
                      renderItem={({ item }) => {
                        return (
                          <UserItem
                            clickUser={this.clickUser}
                            navigation={this.props.navigation}
                            id={item.id}
                            designation={item.designation}
                            department={item.department}
                            title={item.title}
                          />
                        );
                      }}
                      contentContainerStyle={
                        this.getData().length === 0
                          ? [
                              globalStyles.container,
                              { height: windowHeight - tabHeight },
                            ]
                          : null
                      }
                      keyExtractor={(item) => item.id.toString()}
                      // onRefresh={() => this.onRefresh()}
                      // refreshing={this.state.isLoading}
                    />
                  ) : (
                    <Text
                      style={[
                        globalStyles.fontWeightBold,
                        globalStyles.paddingBottom2,
                        {
                          fontSize: 16,
                          color: "#7f7f7f",
                        },
                      ]}
                    >
                      No Data
                    </Text>
                  )}
                </View>

                {/* <Footer /> */}
              </>
            ) : (
              <View style={[globalStyles.listContainer, { marginBottom: 20 }]}>
                {this.context.userDetails?.journal_action_types.includes(
                  "View"
                ) ? (
                  <SectionList
                    sections={this.state.records}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderItem}
                    contentContainerStyle={
                      this.state.records.length === 0
                        ? globalStyles.container
                        : null
                    }
                    ListEmptyComponent={() => <ListEmpty />}
                    stickySectionHeadersEnabled
                    renderSectionHeader={({ section: { title } }) => {
                      return (
                        <View style={globalStyles.sectionHeader}>
                          <View style={globalStyles.sectionHeaderLeft}>
                            <Text style={{ fontSize: 26, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("DD")}
                            </Text>
                          </View>
                          <View style={globalStyles.sectionHeaderRight}>
                            <Text style={{ fontSize: 16, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("dddd")}
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.white }}>
                              {showDate(title)}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    refreshControl={
                      <RefreshControl
                        refreshing={
                          this.state.isLoading && this.state.page === 1
                        }
                        onRefresh={this.onRefresh}
                      />
                    }
                    onEndReachedThreshold={0.4}
                    onEndReached={this.handleLoadMore.bind(this)}
                  />
                ) : (
                  // <FlatList
                  //   showsVerticalScrollIndicator={false}
                  //   ListEmptyComponent={() => <ListEmpty />}
                  //   data={this.state.records}
                  //   keyExtractor={(item, index) => item.id.toString()}
                  //   renderItem={this.renderItem}
                  //   initialNumToRender={this.state.records.length}
                  //   refreshing={this.state.isLoading}
                  //   onRefresh={() => this.getJournalRecords(this.state.today)}
                  //   contentContainerStyle={
                  //     this.state.records.length === 0 ? globalStyles.container : null
                  //   }
                  // />
                  <View
                    style={[
                      globalStyles.justifyContentCenter,
                      globalStyles.alignItemsCenter,
                    ]}
                  >
                    <Text style={{ color: Colors.primary }}>
                      You don't have permission to view
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </>
      <DateTimePickerModal
        mode={"date"}
        display={Platform.OS == "ios" ? "inline" : "default"}
        isVisible={this.state.showheader}
        onConfirm={this.handleDateConfirmheader}
        onCancel={this.hideDatePickerheader}
      />
    </Container>
  );
}

const Styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: Colors.white,
  // },
  // icon: {
  //   top: 10,
  // },
  // listItem: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   paddingVertical: 5,
  //   paddingHorizontal: 8,
  //   borderWidth: 0.6,
  //   borderRadius: 2,
  //   borderColor: Colors.primary,
  //   marginRight: 5,
  // },
  // left: {
  //   width: "20%",
  //   justifyContent: "center",
  // },
  // middle: {
  //   justifyContent: "center",
  //   flex: 1,
  //   paddingLeft: 10,
  // },
  // right: {
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   alignItems: "center",
  // },
  // image: {
  //   width: "100%",
  //   height: 40,
  // },
  // name: {
  //   fontSize: 14,
  //   color: Colors.white,
  // },
  // scroll: {
  //   // backgroundColor: Colors.grey,
  //   // color: Colors.white,
  //   marginTop: 0,
  // },
  // galleryContainer: {
  //   flexDirection: "row",
  //   alignItems: "flex-start",
  //   flexWrap: "wrap",
  //   backgroundColor: "red",
  // },
  // galleryGrid: {
  //   width: Math.floor((windowwidth - 10) / 3),
  //   height: Math.floor((windowwidth - 10) / 3),
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // galleryImg: {
  //   width: Math.floor((windowwidth - 10) / 3),
  //   height: Math.floor((windowwidth - 10) / 3),
  //   borderWidth: 2,
  //   borderColor: Colors.white,
  // },
  // menu: {
  //   fontSize: 20,
  // },
});

// const globalStyles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 3
// 	},
// 	tabContainer: {
// 		width: "100%",
// 		height: tabHeight,
// 		flexDirection: "row",
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#d1d1d1",
// 		borderTopWidth: 1,
// 		borderTopColor: Colors.primary,
// 		elevation: 1,
// 	},
// 	downloadBtn: {
// 		flexDirection: "row",
// 		paddingHorizontal: 5,
// 		paddingVertical: 3,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
// 		marginLeft: 20,
// 	},
// 	tab: {
// 		flex: 1,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		height: tabHeight,
// 	},
// 	underlineStyle: {
// 		backgroundColor: Colors.primary,
// 		height: 3,
// 	},
// 	activeTab: {
// 		height: tabHeight - 1,
// 		borderBottomWidth: 2,
// 		borderBottomColor: Colors.primary,
// 	},
// 	activeText: {
// 		fontSize: 14,
// 		// fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	inActiveText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	listContainer: {
// 		flex: 1,
// 		height: windowHeight - tabHeight,
// 	},
// 	CardBox: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		padding: 5,
// 		borderRadius: 3,
// 		backgroundColor: "#fff",
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 	},
// 	labelName: {
// 		fontSize: 12,
// 		paddingLeft: 4,

// 		color: Colors.textColor,
// 		opacity: 0.9,
// 		textAlign: "left",
// 		// fontWeight: "bold",
// 		flex: 1,
// 		width: "100%",
// 	},
// 	mc: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		marginLeft: 5,
// 		fontSize: 15,
// 		// fontWeight: "500",
// 	},
// 	pendingStatus: {
// 		textAlign: "right",
// 		color: Colors.warning,
// 		fontStyle: "italic",
// 	},
// 	approveStatus: {
// 		textAlign: "right",
// 		color: Colors.success,
// 		fontStyle: "italic",
// 	},
// 	rejectStatus: {
// 		textAlign: "right",
// 		color: Colors.danger,
// 		fontStyle: "italic",
// 	},
// 	searchBackground: {
// 		backgroundColor: Colors.primary,
// 	},
// 	searchContainer: {
// 		backgroundColor: Colors.white,
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		elevation: 5,
// 		borderRadius: 3,
// 		padding: 5,
// 		marginTop: -5,
// 		marginBottom: 5,
// 		marginHorizontal: 8,

// 	},

// 	dateContainer: {
// 		borderWidth: 1,
// 		borderColor: Colors.primary,
// 		borderRadius: 3,
// 		paddingVertical: 5,
// 		marginTop: 5,
// 		paddingHorizontal: 15,
// 		marginHorizontal: 15,
// 	},
// });
