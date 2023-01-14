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
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import {
  getMedicalRecords,
  filterMedicalRecords,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import { Configs } from "../../config";
import DownloadFile from "../../component/DownloadFile";
import { AntDesign } from "@expo/vector-icons";
import globalStyles from "../../config/Styles";
import { showDayAsClientWant, showDate } from "../../utils/Util";
import styles from './Styles'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class MedicalRecords extends React.Component {
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
        this.loadMedicalRecords(1);
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadMedicalRecords = (page) => {
    let cid = this.context.userDetails.cid;
    let status = this.state.selectedFilterItem;
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getMedicalRecords(cid, status, page)
          .then((data) => {
            let dataArr = [];
            for (let key in data) {
              dataArr.push({ title: key, data: data[key] });
            }
            this.setState({ dataLength: dataArr.length });
            let listData = page == 1 ? [] : this.state.records;
            // let result = listData.concat(data);
            let result = listData.concat(dataArr);
            this.setState({
              isLoading: false,
              records: result,
            });
          })
          .catch((error) => console.log(error));
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
      this.loadMedicalRecords(this.state.page); // method for API call
    }
  };

  filterMedicalReports = () => {
    let cid = this.context.userDetails.cid;
    let status = this.state.selectedFilterItem;

    this.setState(
      {
        isLoading: true,
      },
      () => {
        filterMedicalRecords(cid, status)
          .then((data) => {
            // console.log(data)
            this.setState({
              isLoading: false,
              records: data,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  setActiveTab = (key) =>
    this.setState(
      {
        activeTabKey: key,
        records: [],
        page: 1,
      },
      () => {
        this.loadMedicalRecords(1);
      }
    );

  onFilterItemChange = (type) => {
    this.setState(
      {
        isLoading: true,
        selectedFilterItem: type,
      },
      () => {
        this.loadMedicalRecords(1);
      }
    );
  };

  onRefresh = () => {
    this.setState({ isLoading: true, records: [], page: 1 }, () => {
      this.loadMedicalRecords(1);
    });
  };

  gotoAddRecord = () => {
    this.props.navigation.navigate("AddMedicalRecord", {
      status:
        this.state.activeTabKey === "P"
          ? "P"
          : this.state.activeTabKey == "A"
          ? "A"
          : "O",
    });
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddMedicalRecord", {
      item: item,
      status: this.state.activeTabKey,
    });

  gotoView = (item) =>
    this.props.navigation.navigate("ViewMedicalRecord", {
      item: item,
      status: this.state.activeTabKey,
    });

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[globalStyles.CardBox, globalStyles.mh5]}
        onLongPress={
          item.status === "A" ? null : this.gotoEdit.bind(this, item)
        }
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
            { width: "80%", marginVertical: 10 },
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
          style={[
            globalStyles.flexDirectionRow,
            globalStyles.justifyContentBetween,
            globalStyles.pr5,
          ]}
        >
          {/* <Text style={[globalStyles.labelName,globalStyles.pd0]}>
  					{"Date: "}
  					<Text style={[globalStyles.textfield,globalStyles.width60]}>
  						{moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
  					</Text>
  				</Text> */}
          {/* <DownloadFile
  					extra={item.id}
  					url={this.state.qrCode}
  					viewStyle={globalStyles.downloadBtn}
  					textStyle={{ fontSize: 14, marginHorizontal: 2 }}
  					design={<AntDesign name="download" size={10} style={{marginTop:2}} />}
  					text={"Download"}
  				/> */}
        </View>
        {/* <Text style={[globalStyles.labelName,globalStyles.pd0]}>
  				{"Next Treatment Date: "}
  				<Text style={[globalStyles.textfield,globalStyles.width60]}>
  					{moment(item.next_treatment_date, "YYYY-MM-DD").format("DD/MM/YYYY")}
  				</Text>
  			</Text> */}
      </TouchableOpacity>
    );
  };

  render = () => (
    <Container>
      <Header
        title={"Medical Records"}
        addAction={this.gotoAddRecord}
        menuItems={Configs.MEDICAL_RECORD_STATUS}
        onFilterItemChange={this.onFilterItemChange}
        selectedFilterItem={this.state.selectedFilterItem}
      />
      {/* <View style={globalStyles.tabContainer}>

				<TouchableOpacity
					onPress={this.setActiveTab.bind(this, "O")}
					style={[
						globalStyles.tab,
						this.state.activeTabKey === "O" ? globalStyles.activeTab : null,
					]}
				>
					<Text
						style={
							this.state.activeTabKey === "O"
								? globalStyles.activeTexttab
								: globalStyles.inActiveText
						}
					>
						Pending / Ongoing
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={this.setActiveTab.bind(this, "P")}
					style={[
						globalStyles.tab,
						this.state.activeTabKey === "P" ? globalStyles.activeTab : null,
					]}
				>
					<Text
						style={
							this.state.activeTabKey === "P"
								? globalStyles.activeTexttab
								: globalStyles.inActiveText
						}
					>
						All
					</Text>
				</TouchableOpacity>



			</View> */}
      <View style={globalStyles.listContainer}>
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
                  <View style={globalStyles.sectionHeaderLeft}>
                    <Text style={[styles.sectionListHeaderDay]}>
                      {moment(title, "YYYY-MM-DD").format("DD")}
                    </Text>
                  </View>
                  <View style={globalStyles.sectionHeaderRight}>
                    <Text style={[styles.sectionListHeaderWeekDay]}>
                      {moment(title, "YYYY-MM-DD").format("dddd")}
                    </Text>
                    <Text style={[styles.sectionListHeaderMonthYear]}>
                      {showDate(title)}
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

          // <FlatList
          //   showsVerticalScrollIndicator={false}
          //   ListEmptyComponent={() => <ListEmpty />}
          //   data={this.state.records}
          //   keyExtractor={(item, index) => item.id.toString()}
          //   renderItem={this.renderItem1}
          //   initialNumToRender={this.state.records.length}
          //   contentContainerStyle={
          //     this.state.records.length === 0 ? globalStyles.container : null
          //   }
          //   refreshControl={
          //     <RefreshControl
          //       refreshing={this.state.isLoading && this.state.page === 1}
          //       onRefresh={this.onRefresh}
          //     />
          //   }
          // ListFooterComponent={this.renderFooter.bind(this)}
          //   onEndReachedThreshold={0.4}
          //   onEndReached={this.handleLoadMore.bind(this)}
          // />
        )}
      </View>
    </Container>
  );
}

// const styles = StyleSheet.create({
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
// 		fontWeight: "bold",
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
// });
