import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SectionList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
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
  getMedicalRecords,
  filterMedicalRecords,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import { Configs } from "../../config";
import DownloadFile from "../../component/DownloadFile";
import { AntDesign } from "@expo/vector-icons";
import globalStyles from "../../config/Styles";
import { userList } from "../../services/UserManagementServices";
import { showDayAsClientWant, showDate } from "../../utils/Util";
import { getReportsforMedical } from "../../services/ReportsServices";
import { DateRangePicker } from "./DateRangePicker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class MedicalReport extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTabKey: "O",
      records: [],
      selectedFilterItem: "all",
      page: 1,
      dataLength: "",
      users: [],
      selectedUsers: [],
      fromDate: moment(new Date()).format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
    };
  }

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
        records: [],
      },
      () => {
        this.getData();
        // this.getMedicalbyUser(this.state.selectedUsers);
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
        //   this.getMedicalbyUser(item);
        // }
      );
    } else {
      alert("Select atleast one user");
    }
  };

  getMedicalbyUser = (user) => {
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
      page: this.state.page,
      from_date: this.state.fromDate,
      to_date: this.state.toDate,
    };
    getReportsforMedical(obj)
      .then((data) => {
        let dataArr = [];
        for (let key in data) {
          dataArr.push({ title: key, data: data[key] });
        }
        this.setState({ dataLength: dataArr.length });
        let listData = this.state.page == 1 ? [] : this.state.records;
        let result = listData.concat(dataArr);
        result = result.map((item) => ({
          ...item,
          data: item.data.map((element) => ({
            ...element,
            image: JSON.parse(element.image),
          })),
        }));
        this.setState({
          isLoading: false,
          records: result,
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
      this.getMedicalbyUser(this.state.selectedUsers); // method for API call
    }
  };

  onRefresh = () => {
    this.setState({ isLoading: true, records: [], page: 1 }, () => {
      this.getData();
      this.getMedicalbyUser(this.state.selectedUsers);
    });
  };

  gotoView = (item) =>
    this.props.navigation.navigate("ViewMedicalRecord", {
      item: item,
      status: this.state.activeTabKey,
    });

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[globalStyles.CardBox, globalStyles.mh5]}
        onPress={this.gotoView.bind(this, item)}
      >
        <View
          style={{
            flexDirection: "row",
            // justifyContent: "space-between",
            paddingRight: 5,
          }}
        >
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Case ID: "}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {"#" + item.id}{" "}
            </Text>
          </Text>
          <Text
            style={[
              globalStyles.labelName,
              globalStyles.pd0,
              item.status === "P"
                ? globalStyles.pendingStatus
                : globalStyles.approveStatus,
            ]}
          >
            {item.status === "P"
              ? "(Pending)"
              : item.status === "O"
              ? "(Ongoing)"
              : ""}
          </Text>
        </View>
        <Text
          style={[
            globalStyles.labelName,
            globalStyles.pd0,
            globalStyles.width80,
            globalStyles.marginVertical10,
          ]}
        >
          {/* {"Desc: "} */}
          <Text style={[globalStyles.textfield, globalStyles.width60]}>
            {item?.description ?? "N/A"}
          </Text>
        </Text>
        <Text style={[globalStyles.labelName, globalStyles.pd0]}>
          {"Diagnosis: "}
          <Text style={[globalStyles.textfield, globalStyles.width60]}>
            {item.diagnosis_name}
          </Text>
        </Text>
        <Text style={[globalStyles.labelName, globalStyles.pd0]}>
          {"Ref: "}
          {item.ref == "animal" ? (
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {item.english_name} ({item.ref_value} )
            </Text>
          ) : (
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {item.ref_value} ({item.ref} )
            </Text>
          )}
        </Text>
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
              >{`${item.enclosure} (${item.section})`}</Text>
            </Text>
          </>
        ) : null}
        <Text style={[globalStyles.labelName, globalStyles.pd0]}>
          {"Rep By: "}
          <Text style={[globalStyles.textfield, globalStyles.width60]}>
            {item?.reported_by_name ?? "N/A"}
          </Text>
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 5,
          }}
        >
          <Text style={[globalStyles.labelName, globalStyles.pd0]}>
            {"Date: "}
            <Text style={[globalStyles.textfield, globalStyles.width60]}>
              {moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
            </Text>
          </Text>
        </View>
        <View style={[globalStyles.mt10, globalStyles.flexDirectionRow]}>
          {item?.image &&
            item?.image.map((item) => {
              return (
                <Image
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

    this.state.records.forEach((item) => {
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
        <p style="line-height: 24px; color: gray; margin: 10px 0 0 0">
        Case ID: #${item.id}
        <span style="color: ${item.status === "P" ? "#ffc107" : "#1e7e34"};">${
          item.status === "P"
            ? "(Pending)"
            : item.status === "O"
            ? "(Ongoing)"
            : ""
        }</span>
         <br />
          ${item?.description ?? "N/A"} <br />
          Diagnosis: ${item.diagnosis_name} <br />
          Ref: 
          ${
            item.ref == "animal"
              ? item.english_name + " " + item.ref_value
              : item.english_name + " " + item.ref_value
          }

          ${
            item.ref == "animal"
              ? (item.dna == null || item.dna == ""
                  ? ""
                  : "DNA No: " + item.dna + "\n") +
                (item.microchip == null || item.microchip == ""
                  ? ""
                  : "Microchip No: " + item.microchip + "\n") +
                ("Encl: " + item.enclosure + " " + item.section)
              : ""
          }<br />
          Rep By: ${item?.reported_by_name ?? "N/A"}<br />
          Date: ${moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
        </p>
        <div
            style="
              display: flex;
              flex-wrap: wrap;
            "
          >`;

        item?.image?.forEach((element) => {
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
        title={"Medical Reports"}
        isShowExportIcon={this.state.records.length > 0}
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
            onPress={this.getMedicalbyUser}
          >
            <Text style={globalStyles.incidentbtns}>Submit</Text>
          </TouchableOpacity>
        </View>

        {this.state.isLoading && this.state.page === 1 ? (
          <Loader />
        ) : (
          <SectionList
            sections={this.state.records}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            contentContainerStyle={
              this.state.records.length === 0 ? globalStyles.container : null
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
