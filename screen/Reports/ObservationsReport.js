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
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import Colors from "../../config/colors";
import {
  Header,
  Loader,
  ListEmpty,
  MultiSelectDropdown,
} from "../../component";
import {
  getObservationReports,
  getObservation,
  searchObservationByType,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import { debounce } from "lodash";
import { Configs } from "../../config";
import globalStyles from "../../config/Styles";
import { capitalize } from "../../utils/Util";
import { showDate } from "../../utils/Util";
import { userList } from "../../services/UserManagementServices";
import { getReportsforObservation } from "../../services/ReportsServices";
import styles from "./Style";
import { DateRangePicker } from "./DateRangePicker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

const danger = require("../../assets/tasks/Danger.png");
const low = require("../../assets/tasks/Low.png");
const moderate = require("../../assets/tasks/Moderate.png");
const high = require("../../assets/tasks/High.png");

export default class ObservationsReport extends React.Component {
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
      selectedFilterItem: "all",
      users: [],
      selectedUsers: [],
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
        // this.getObservationbyUser(this.state.selectedUsers);
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  getData = () => {
    userList()
      .then((res) => {
        this.setState({
          users: res.data.map((v, i) => ({
            id: v.id,
            name: `${v.full_name} - ${v.dept_name}`,
          })),
          isLoading: false,
          page: 1,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setSelectedUsers = (item) => {
    if (item.length > 0) {
      this.setState(
        {
          selectedUsers: item,
        }
        // ,
        // () => {
        //   this.getObservationbyUser(item);
        // }
      );
    } else {
      alert("Select atleast one user");
    }
  };

  getObservationbyUser = (page) => {
    if (!this.state.selectedUsers.length) {
      alert("Select atleast one user");
      return;
    }

    this.setState({
      isLoading: true,
    });
    let users = this.state.selectedUsers?.map((v, i) => v.id).join(",");
    let obj = {
      cid: this.context.userDetails.cid,
      users: users,
      page: page,
      from_date: this.state.fromDate,
      to_date: this.state.toDate,
    };
    getReportsforObservation(obj)
      .then((data) => {
        console.log("Observation Report****", data);
        let dataArr = [];
        for (let key in data) {
          dataArr.push({ title: key, data: data[key] });
        }
        this.setState({ dataLength: dataArr.length });
        let listData = this.state.page == 1 ? [] : this.state.consumptions;
        let result = listData.concat(dataArr);
        result = result.map((item) => ({
          ...item,
          data: item.data.map((element) => ({
            ...element,
            attachment: JSON.parse(element.attachment),
          })),
        }));
        console.log(result);
        // let items = data.filter(item => item.id == 259)
        // console.log("pending Observation>>>>>>>>>>",items);
        this.setState({
          isLoading: false,
          consumptions: result,
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
      this.getObservationbyUser(this.state.page); // method for API call
    }
  };

  onRefresh = () => {
    this.setState({ isLoading: true, consumptions: [], page: 1 }, () => {
      this.getData();
      this.getObservationbyUser(1);
    });
  };

  gotoView = (item) => {
    this.props.navigation.navigate("ViewObservation", {
      item: item,
      status: this.state.activeTabKey,
    });
  };

  renderItem = ({ item }) => {
    // console.log(item);
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
        onPress={this.gotoView.bind(this, item)}
      >
        <View
          style={[
            globalStyles.flexDirectionRow,
            globalStyles.justifyContentSpaceBetween,
            globalStyles.paddingRight5,
            globalStyles.marginBottom,
          ]}
        >
          <Text
            style={[
              globalStyles.labelName,
              globalStyles.pd0,
              globalStyles.width80,
            ]}
          >
            {/* {"Desc: "} */}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {item?.description ?? "N/A"}
            </Text>
          </Text>
          <Image source={priority} style={styles.images} />
        </View>
        <View
          style={[
            globalStyles.flexDirectionRow,
            globalStyles.justifyContentSpaceBetween,
            globalStyles.paddingRight5,
            globalStyles.displayFlex,
          ]}
        >
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"ID: "}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {"#" + item.id}{" "}
            </Text>
          </Text>
        </View>
        {/* <Text style={[globalStyles.labelName, globalStyles.pd0]}>
          {"Observation Type: "}
          <Text style={[globalStyles.textfield, globalStyles.width60]}>
            {item.type_name}
          </Text>
        </Text> */}
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
        {/* <Text
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
        </Text>*/}
        <View style={[globalStyles.mt10, globalStyles.flexDirectionRow]}>
          {item?.attachment &&
            item?.attachment.map((item, index) => {
              return (
                <Image
                  key={index}
                  source={{ uri: item }}
                  resizeMode="contain"
                  style={{ height: 50, width: 50, margin: 10 }}
                />
              );
            })}
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
          <h4 style="line-height: 0; padding: 0; margin: 0; color: black">
          ${item?.description ?? "N/A"}
          </h4>
          <div>
            <img src=${priority} width="15" height="15" />
          </div>
        </div>

        <p style="line-height: 24px; color: gray; margin: 10px 0 0 0">
          
          ID: #${item.id} <br />
          ${
            item.ref == "others"
              ? ""
              : "Ref: " +
                `${
                  item.ref == "animal"
                    ? capitalize(item.english_name) +
                      capitalize(item.ref_value) +
                      " "
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
        title={"Observation Reports"}
        isShowExportIcon={this.state.consumptions.length > 0}
        onPressExport={this.exportReport}
      />

      <View style={globalStyles.listContainer}>
        <MultiSelectDropdown
          label={"Select User"}
          items={this.state.users}
          selectedItems={this.state.selectedUsers}
          onSave={this.setSelectedUsers}
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
            onPress={()=>this.getObservationbyUser(1)}
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
            ListFooterComponent={this.renderFooter.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading && this.state.page === 1}
                onRefresh={this.onRefresh}
              />
            }
            onEndReachedThreshold={0.4}
            onEndReached={this.handleLoadMore.bind(this)}
          />
        )}
      </View>
    </Container>
  );
}
