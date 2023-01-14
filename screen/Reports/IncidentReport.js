import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableHighlight,
  Image,
  RefreshControl,
  ActivityIndicator,
  SectionList,
  ScrollView,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "../../config/colors";
import {
  Header,
  Loader,
  ListEmpty,
  MultiSelectDropdown,
} from "../../component";
import {
  getIncidentReports,
  searchIncidentByType,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import { debounce } from "lodash";
import { Configs } from "../../config";
import globalStyles from "../../config/Styles";
import { capitalize } from "./../../utils/Util";
import { showDate } from "./../../utils/Util";
import { getDepartments, userList } from "../../services/UserManagementServices";
import { getReportsforIncident } from "../../services/ReportsServices";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

import { default as danger } from "../../assets/tasks/Danger.png";
import { default as low } from "../../assets/tasks/Low.png";
import { default as moderate } from "../../assets/tasks/Moderate.png";
import { default as high } from "../../assets/tasks/High.png";
import { DateRangePicker } from "./DateRangePicker";

// const danger = require("../../assets/tasks/Danger.png");
// const low = require("../../assets/tasks/Low.png");
// const moderate = require("../../assets/tasks/Moderate.png");
// const high = require("../../assets/tasks/High.png");

export default class IncidentReport extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTabKey: "A",
      consumptions: [],
      activeTabSubGroupKey: "PENDING_FOR_ME",
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
      loading: false,
      page: 1,
      dataLength: "",
      departments: [],
      selectedDepartments: [],
      fromDate: moment(new Date()).format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
    };

    this.searchInput = React.createRef();
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  }

  onScreenFocus = () => {
    // console.log(this.context.userDetails)
    this.setState(
      {
        isLoading: true,
        activeTabKey: "A",
        consumptions: [],
      },
      () => {
        this.getData();
        // this.getIncidentbyUser(this.state.selectedDepartments);
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
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
          isLoading :false
        });
      })
      .catch((err) => console.log(err));
  };

  setselectedDepartments = (item) => {
    if (item.length > 0) {
      this.setState(
        {
          selectedDepartments: item,
        }
        // ,
        // () => {
        //   this.getIncidentbyUser(item);
        // }
      );
    } else {
      alert("Select atleast one user");
    }
  };

  getIncidentbyUser = (user) => {
    if (!this.state.selectedDepartments.length) {
      alert("Select atleast one user");
      return;
    }

    this.setState({
      isLoading: true,
    });
    let departments = this.state.selectedDepartments?.map((v, i) => v.value).join(",");
    let obj = {
      cid: this.context.userDetails.cid,
      departments: departments,
      page: this.state.page,
      from_date: this.state.fromDate,
      to_date: this.state.toDate,
    };

    getReportsforIncident(obj)
      .then((res) => {
        const sources = res.data;
        let dataArr = [];
        for (let key in sources) {
          dataArr.push({ title: key, data: sources[key] });
        }
        this.setState({ dataLength: dataArr.length });
        // let listData = this.state.page == 1 ? [] : this.state.consumptions;
        // let result = listData.concat(dataArr);
        // result = result.map((item) => ({
        //   ...item,
        //   data: item.data.map((element) => ({
        //     ...element,
        //     attachment: element.attachment.length > 0 ? JSON.parse(element.attachment) : [],
        //   })),
        // }));
        // let items = data.filter(item => item.id == 259)
        // console.log("pending Incident>>>>>>>>>>",result);
        this.setState({
          isLoading: false,
          consumptions: dataArr,
        });
      })
      .catch((error) => console.log(error));
  };

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.isLoading) return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  handleLoadMore = () => {
    if (!this.state.isLoading && this.state.dataLength > 0) {
      this.state.page = this.state.page + 1; // increase page by 1
      this.getIncidentbyUser(this.state.selectedDepartments); // method for API call
    }
  };

  onRefresh = () => {
    this.setState({ isLoading: true, consumptions: [], page: 1 }, () => {
      this.getData();
      this.getIncidentbyUser(this.state.selectedDepartments);
    });
  };

  gotoView = (item) => {
    this.props.navigation.navigate("ViewIncident", {
      item: item,
      status: this.state.activeTabKey,
    });
  };

  renderItem = ({ item }) => {
    let priority = low;
    if (item.priority == "High") {
      priority = high;
    } else if (item.priority == "Medium") {
      priority = moderate;
    } else if (item.priority == "Top") {
      priority = danger;
    }

    return (
      <TouchableOpacity
        style={[globalStyles.CardBox, globalStyles.mh5]}
        // onLongPress={this.gotoEdit.bind(this, item)}
        onPress={this.gotoView.bind(this, item)}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 5,
          }}
        >
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"ID: "}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {"#" + item.id}{" "}
            </Text>
          </Text>
          <Image
            source={priority}
            style={{ height: 15, width: 15, resizeMode: "contain" }}
          />
        </View>
        <View
          style={[
            globalStyles.flexDirectionRow,
            globalStyles.justifyContentSpaceBetween,
            globalStyles.paddingRight5,
          ]}
        >
          <Text
            style={[
              globalStyles.labelName,
              globalStyles.pd0,
              globalStyles.marginVertical10,
              globalStyles.width80,
            ]}
          >
            {/* {"Desc: "} */}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {item?.description ?? "N/A"}
            </Text>
          </Text>
        </View>
        <Text style={[globalStyles.labelName, globalStyles.pd0]}>
          {"Incident Type: "}
          <Text style={[globalStyles.textfield, globalStyles.width60]}>
            {item.type_name}
          </Text>
        </Text>
        {item.ref == "others" ? null : (
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Ref: "}
            {item.ref == "animal" ? (
              <Text style={[globalStyles.textfield, globalStyles.width60]}>
                {capitalize(item.english_name)} ({capitalize(item.ref_value)} )
              </Text>
            ) : (
              <Text style={[globalStyles.textfield, globalStyles.width60]}>
                {capitalize(item.ref_value)} ({capitalize(item.ref)} )
              </Text>
            )}
          </Text>
        )}

        {item.ref == "animal" ? (
          <>
            {/* <Text style={[globalStyles.labelName,globalStyles.pd0]}>
							{"Common Name: "}
							<Text style={[globalStyles.textfield,globalStyles.width60]}>{`${item.english_name}`}</Text>
						</Text> */}
            {item.dna == null || item.dna == "" ? null : (
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                {"DNA No: "}
                <Text
                  style={[globalStyles.textfield, globalStyles.width60]}
                >{`${item.dna}`}</Text>
              </Text>
            )}
            {item.microchip == null || item.microchip == "" ? null : (
              <Text style={[globalStyles.labelName, globalStyles.pd0]}>
                {"Microchip No: "}
                <Text
                  style={[globalStyles.textfield, globalStyles.width60]}
                >{`${item.microchip}`}</Text>
              </Text>
            )}
            <Text style={[globalStyles.labelName, globalStyles.pd0]}>
              {"Encl: "}
              <Text
                style={[globalStyles.textfield, globalStyles.width60]}
              >{`${capitalize(item.enclosure)} (${capitalize(
                item.section
              )})`}</Text>
            </Text>
            {}
          </>
        ) : null}

        {/* {!item.solution ? null :
					<Text style={[globalStyles.labelName, globalStyles.pd0]}>
						{"Comments: "}
						<Text style={[globalStyles.textfield, globalStyles.width60]}>{item?.solution ?? 'N/A'}</Text>
					</Text>
				} */}
        {!item.learning ? null : (
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Learning: "}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {item?.learning ?? "N/A"}
            </Text>
          </Text>
        )}
        <View></View>
        {!item.full_name ? null : (
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Rep By: "}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {item?.full_name ?? "N/A"}
            </Text>
          </Text>
        )}
        <Text style={[globalStyles.labelName, globalStyles.pd0]}>
          {"Date: "}
          <Text style={[globalStyles.textfield, globalStyles.width60]}>
            {moment(item.created_on, "YYYY-MM-DD").format("Do MMM YY (ddd)")}
          </Text>
        </Text>
        <Text
          style={[
            globalStyles.labelName,
            globalStyles.pd0,
            // item.status === "P" ? globalStyles.pendingStatus : globalStyles.approveStatus,
          ]}
        >
          {"Status: "}
          <Text style={[globalStyles.textfield, globalStyles.width60]}>
            {item.status === "P" ? "Pending" : ""}
          </Text>
        </Text>
        <View style={[globalStyles.mt10, globalStyles.flexDirectionRow]}>
          {item?.attachment.length > 0 ?
            item?.attachment.map((item, index) => {
              return (
                <Image
                  key={index}
                  source={{ uri: item }}
                  resizeMode="contain"
                  style={{ height: 50, width: 50, margin: 10 }}
                />
              );
            })
          : null
          }
        </View>
      </TouchableOpacity>
    );
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

    this.state.consumptions.forEach((item) => {
      html += `
      <div
        style="
          text-align: left;
          background: #65c3a8;
          color: white;
          padding: 1px 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        "
      >
        <h3 style="line-height: 10px">${item.title}</h3>
      </div>
      `;

      item?.data?.forEach((item) => {
        let priority = low;
        if (item.priority == "High") {
          priority = high;
        } else if (item.priority == "Medium") {
          priority = moderate;
        } else if (item.priority == "Top") {
          priority = danger;
        }

        html += `
        <div
        style="
          box-shadow: 0 0 10px 1px gray;
          padding: 10px;
          background: white;
          border-radius: 5px;
          margin-bottom: 18px;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="line-height: 0; padding: 0; margin: 0; color: black">
          ID: #${item.id}
          </div>
          <div>
            <img src=${priority} width="15" height="15" />
          </div>
        </div>
        <p style="line-height: 24px; color: gray; margin: 10px 0 0 0">
          
          ${item?.description ?? "N/A"} <br />
          Incident Type: ${item.type_name} <br />
          ${
            item.ref == "others"
              ? ""
              : "Ref: " +
                `${
                  item.ref == "animal"
                    ? capitalize(item.english_name) +
                      " " +
                      capitalize(item.ref_value)
                    : capitalize(item.ref_value) + " " + capitalize(item.ref)
                }`
          }
          ${
            item.ref == "animal"
              ? (item.dna == null || item.dna == ""
                  ? ""
                  : "DNA No: " + item.dna + "\n") +
                (item.microchip == null || item.microchip == ""
                  ? ""
                  : "Microchip No: " + item.microchip + "\n") +
                ("Encl: " +
                  capitalize(item.enclosure) +
                  " " +
                  capitalize(item.section))
              : ""
          }
          ${!item.learning ? "" : "Learning: " + item?.learning ?? "N/A"}<br />
          ${!item.full_name ? "" : "Rep By: " + item?.full_name ?? "N/A"}<br />
          Date: ${moment(item.created_on, "YYYY-MM-DD").format(
            "Do MMM YY (ddd)"
          )}<br />
          Status: ${item.status === "P" ? "Pending" : ""}
        </p>
        <div
            style="
              display: flex;
              flex-wrap: wrap;
            "
          >`;

        item?.attachment?.forEach((element) => {
          html += `<img src="${element}" style="width: 70px; height: 70px; margin-right: 15px" />`;
        });

        html += `
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

  exportReport = async () => {
    let html = this.htmlForExportReport();

    this.setState({ isLoading: true });

    // this.setShowLoader(true);
    const { uri } = await Print.printToFileAsync({
      html,
    });
    this.setState({ isLoading: false });
    this.exportPdf(uri);
  };

  exportPdf = async (uri) => {
    await shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  };

  render = () => (
    <Container>
      <Header
        title={"Incident Reports"}
        searchAction={this.openSearchModal}
        isShowExportIcon={this.state.consumptions.length > 0}
        onPressExport={this.exportReport}
      />

      <View style={globalStyles.listContainer}>
        <MultiSelectDropdown
          label={"Select Department"}
          items={this.state.departments}
          selectedItems={this.state.selectedDepartments}
          onSave={this.setselectedDepartments}
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

        <DateRangePicker
          getSelectedDates={({ fromDate, toDate }) => {
            this.setState({ fromDate, toDate });
          }}
        />

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
            onPress={this.getIncidentbyUser}
          >
            <Text style={globalStyles.incidentbtns}>Submit</Text>
          </TouchableOpacity>
        </View>

        {this.state.isLoading && this.state.page === 1 ? (
          <Loader />
        ) : (
          <SectionList
            sections={this.state.consumptions}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            contentContainerStyle={
              this.state.consumptions.length === 0
                ? globalStyles.container
                : null
            }
            ListEmptyComponent={() => <ListEmpty />}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section: { title } }) => {
              return (
                <View style={globalStyles.sectionHeader}>
                  <View style={globalStyles.sectionHeaderRight}>
                    <Text
                      style={[
                        globalStyles.fontSize16,
                        globalStyles.fontWeightBold,
                        { color: Colors.white },
                      ]}
                    >
                      {title}
                    </Text>
                  </View>
                </View>
              );
            }}
            // ListFooterComponent={this.renderFooter.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading && this.state.page === 1}
                onRefresh={this.onRefresh}
              />
            }
            // onEndReachedThreshold={0.4}
            // onEndReached={this.handleLoadMore.bind(this)}
          />
        )}
      </View>
    </Container>
  );
}

// const globalStyles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
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
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	inActiveText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	listContainer: {
// 		flex: 1,
// 		padding: 8,
// 		height: windowHeight - tabHeight,
// 	},
// 	CardBox: {
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 3,
// 	},
// 	labelName: {
// 		fontSize: 16,
// 		paddingLeft: 4,

// 		color: Colors.textColor,
// 		opacity: 0.9,
// 		textAlign: "left",
// 		fontWeight: "500",
// 		flex: 1,
// 		width: "100%",
// 	},
// 	mc: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		marginLeft: 5,
// 		fontSize: 16,
// 		fontWeight: "500",
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
// 	searchModalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	seacrhModalContainer: {
// 		flex: 1,
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 		elevation: 5,
// 	},
// 	searchModalHeader: {
// 		height: 55,
// 		width: "100%",
// 		elevation: 5,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 		backgroundColor: Colors.primary,
// 	},
// 	searchBackBtn: {
// 		width: "10%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchContainer: {
// 		width: "90%",
// 		flexDirection: "row",
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchFieldBox: {
// 		width: "100%",
// 		height: 40,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		backgroundColor: "rgba(0,0,0, 0.1)",
// 		borderRadius: 50,
// 	},
// 	searchField: {
// 		width: "90%",
// 		padding: 5,
// 		color: Colors.white,
// 		fontSize: 15,
// 	},
// 	searchModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 	},
// 	leftPart: {
// 		width: "75%",
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	name: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 14,
// 		lineHeight: 22,
// 	},
// 	row: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 15,
// 	}
// });
