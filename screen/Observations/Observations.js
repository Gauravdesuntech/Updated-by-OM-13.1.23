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
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import {
  getIncidentReports,
  getObservation,
  searchIncidentByType,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import { debounce } from "lodash";
import { Configs } from "../../config";
import styles from "../../config/Styles";
import { capitalize } from "../../utils/Util";
import { showDate } from "../../utils/Util";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

const danger = require("../../assets/tasks/Danger.png");
const low = require("../../assets/tasks/Low.png");
const moderate = require("../../assets/tasks/Moderate.png");
const high = require("../../assets/tasks/High.png");

export default class Observations extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
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
        this.loadObservationReports(1);
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadObservationReports = (page) => {
    let cid = this.context.userDetails.cid;
    let status = this.state.selectedFilterItem;
    let closed_by_id = "";
    if (status == "P") {
      if (this.state.activeTabSubGroupKey === "PENDING_FOR_ME") {
        closed_by_id = this.context.userDetails.id;
      }
    }

    this.setState(
      {
        isLoading: true,
      },
      () => {
        // getIncidentReports(cid, status, page)
        getObservation(cid, status, page)
          .then((data) => {
            let dataArr = [];
            for (let key in data) {
              dataArr.push({ title: key, data: data[key] });
            }
            this.setState({ dataLength: dataArr.length });
            let listData = page == 1 ? [] : this.state.consumptions;
            let result = listData.concat(dataArr);
            // console.log("Incident Report****", result[0])
            // let items = data.filter(item => item.id == 259)
            // console.log("pending Incident>>>>>>>>>>",items);
            this.setState({
              isLoading: false,
              consumptions: result,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  setActiveTab = (key) => {
    this.setState(
      {
        activeTabKey: key,
        consumptions: [],
        page: 1,
      },
      () => {
        this.loadObservationReports(1);
      }
    );
  };

  setActiveTabSubGroupKey = (key) => {
    this.setState(
      {
        activeTabSubGroupKey: key,
      },
      () => {
        this.loadObservationReports(1);
      }
    );
  };

  gotoAddObservation = () => {
    this.props.navigation.navigate("AddObservation", {
      status: this.state.activeTabKey === "P" ? "P" : "A",
    });
  };

  gotoEdit = (item) => {
    this.props.navigation.navigate("AddObservation", {
      item: item,
      status: this.state.activeTabKey,
    });
  };

  gotoView = (item) => {
    this.props.navigation.navigate("ViewObservation", {
      item: item,
      status: this.state.activeTabKey,
    });
  };

  openSearchModal = () => {
    this.setState({
      isSearchModalOpen: true,
      searchValue: "",
      searchData: [],
    });

    setTimeout(() => {
      this.searchInput.current.focus();
    }, 500);
  };

  closeSearchModal = () => {
    this.setState({
      isSearchModalOpen: false,
      searchValue: "",
      searchData: [],
    });
  };

  searchInsident = () => {
    const searchTerm = this.state.searchValue;

    searchObservationByType(searchTerm)
      .then((result) => {
        if (result.data.length > 0) {
          // console.log(result.data);
          this.setState({
            searchData: result.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  searchInsidentDebounce = debounce(this.searchInsident, 1000);

  gotoDetailView = (item) => {
    this.props.navigation.navigate("ViewObservation", {
      item: item,
      status: item.status,
    });
  };

  onFilterItemChange = (type) => {
    this.setState(
      {
        isLoading: true,
        selectedFilterItem: type,
      },
      () => {
        this.loadObservationReports(1);
      }
    );
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

  renderSearchListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={() => {
        this.gotoDetailView(item);
      }}
    >
      <View style={styles.fieldBox}>
        <View style={styles.leftPart}>
          <Text style={[styles.labelName, styles.pd0]}>
            {item.description.trim()}
          </Text>
          <Text style={[styles.textfield]}>{`Priority: ${item.priority}`}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

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
        style={[styles.CardBox, styles.mh5]}
        // onLongPress={this.gotoEdit.bind(this, item)}
        onPress={this.gotoView.bind(this, item)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 5,
            marginBottom: 10,
          }}
        >
          <Text style={[styles.labelName, styles.pd0, { width: "80%" }]}>
            {/* {"Desc: "} */}
            <Text style={[styles.textfield, styles.width60]}>
              {item?.description ?? "N/A"}
            </Text>
          </Text>
          <Image
            source={priority}
            style={{ height: 15, width: 15, resizeMode: "contain" }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 5,
          }}
        >
          <Text style={[styles.labelName, styles.pd0]}>
            {"ID: "}
            <Text style={[styles.textfield, styles.width60]}>
              {"#" + item.id}{" "}
            </Text>
          </Text>
        </View>
        {/* <Text style={[styles.labelName, styles.pd0]}>
          {"Incident Type: "}
          <Text style={[styles.textfield, styles.width60]}>
            {item.type_name}
          </Text>
        </Text> */}
        {item.ref == "others" ? null : (
          <Text style={[styles.labelName, styles.pd0]}>
            {"Ref: "}
            {item.ref == "animal" ? (
              <Text style={[styles.textfield, styles.width60]}>
                {capitalize(item.english_name)} ({capitalize(item.ref_value)} )
              </Text>
            ) : (
              <Text style={[styles.textfield, styles.width60]}>
                {item.ref_value ? capitalize(item.ref_value) : ''} ({capitalize(item.ref)} )
              </Text>
            )}
          </Text>
        )}

        {item.ref == "animal" ? (
          <>
            {/* <Text style={[styles.labelName,styles.pd0]}>
							{"Common Name: "}
							<Text style={[styles.textfield,styles.width60]}>{`${item.english_name}`}</Text>
						</Text> */}
            {item.dna == null || item.dna == "" ? null : (
              <Text style={[styles.labelName, styles.pd0]}>
                {"DNA No: "}
                <Text
                  style={[styles.textfield, styles.width60]}
                >{`${item.dna}`}</Text>
              </Text>
            )}
            {item.microchip == null || item.microchip == "" ? null : (
              <Text style={[styles.labelName, styles.pd0]}>
                {"Microchip No: "}
                <Text
                  style={[styles.textfield, styles.width60]}
                >{`${item.microchip}`}</Text>
              </Text>
            )}
            <Text style={[styles.labelName, styles.pd0]}>
              {"Encl: "}
              <Text style={[styles.textfield, styles.width60]}>{`${capitalize(
                item.enclosure
              )} (${capitalize(item.section)})`}</Text>
            </Text>
          </>
        ) : null}

        {/* {!item.solution ? null :
					<Text style={[styles.labelName, styles.pd0]}>
						{"Comments: "}
						<Text style={[styles.textfield, styles.width60]}>{item?.solution ?? 'N/A'}</Text>
					</Text>
				} */}
        {!item.learning ? null : (
          <Text style={[styles.labelName, styles.pd0]}>
            {"Learning: "}
            <Text style={[styles.textfield, styles.width60]}>
              {item?.learning ?? "N/A"}
            </Text>
          </Text>
        )}
        <View></View>
        {!item.full_name ? null : (
          <Text style={[styles.labelName, styles.pd0]}>
            {"Rep By: "}
            <Text style={[styles.textfield, styles.width60]}>
              {item?.full_name ?? "N/A"}
            </Text>
          </Text>
        )}
        {/* <Text style={[styles.labelName, styles.pd0]}>
          {"Date: "}
          <Text style={[styles.textfield, styles.width60]}>
            {moment(item.created_on, "YYYY-MM-DD").format("DD/MM/YYYY")}
          </Text>
        </Text> */}
        {/* <Text
          style={[
            styles.labelName,
            styles.pd0,
            // item.status === "P" ? styles.pendingStatus : styles.approveStatus,
          ]}
        >
          {"Status: "}
          <Text style={[styles.textfield, styles.width60]}>
            {item.status === "P" ? "Pending" : ""}
          </Text> 
        </Text>*/}
      </TouchableOpacity>
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
      this.loadObservationReports(this.state.page); // method for API call
    }
  };

  onRefresh = () => {
    this.setState({ isLoading: true, consumptions: [], page: 1 }, () => {
      this.loadObservationReports(1);
    });
  };

  render = () => (
    <Container>
      <Header
        title={"Observation"}
        addAction={this.gotoAddObservation}
        searchAction={this.openSearchModal}
        menuItems={Configs.INCIDENT_RECORD_STATUS}
        onFilterItemChange={this.onFilterItemChange}
        selectedFilterItem={this.state.selectedFilterItem}
      />

      {/* <View style={styles.tabContainer}>

				<TouchableOpacity
					onPress={() => this.setActiveTab("A")}
					style={[
						styles.tab,
						this.state.activeTabKey === "A" ? styles.activeTab : null,
					]}
				>
					<Text
						style={
							this.state.activeTabKey === "A"
								? styles.activeTexttab
								: styles.inActiveText
						}
					>
						All
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => this.setActiveTab("P")}
					style={[
						styles.tab,
						this.state.activeTabKey === "P" ? styles.activeTab : null,
					]}
				>
					<Text
						style={
							this.state.activeTabKey === "P"
								? styles.activeTexttab
								: styles.inActiveText
						}
					>
						Opened
					</Text>
				</TouchableOpacity>

			</View> */}

      <View style={styles.listContainer}>
        {this.state.isLoading && this.state.page === 1 ? (
          <Loader />
        ) : (
          <SectionList
            sections={this.state.consumptions}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            contentContainerStyle={
              this.state.consumptions.length === 0 ? styles.container : null
            }
            ListEmptyComponent={() => <ListEmpty />}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section: { title } }) => {
              return (
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <Text style={{ fontSize: 26, color: Colors.white }}>
                      {moment(title, "YYYY-MM-DD").format("DD")}
                    </Text>
                  </View>
                  <View style={styles.sectionHeaderRight}>
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
          //   data={this.state.consumptions}
          //   keyExtractor={(item, index) => item.id.toString()}
          //   renderItem={this.renderItem}
          //   initialNumToRender={this.state.consumptions.length}
          //   contentContainerStyle={
          //     this.state.consumptions.length === 0 ? styles.container : null
          //   }
          //   refreshControl={
          //     <RefreshControl
          //       refreshing={this.state.isLoading && this.state.page === 1}
          //       onRefresh={this.onRefresh}
          //     />
          //   }
          //   ListFooterComponent={this.renderFooter.bind(this)}
          // onEndReachedThreshold={0.4}
          // onEndReached={this.handleLoadMore.bind(this)}
          // />
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isSearchModalOpen}
        onRequestClose={this.closeSearchModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={styles.searchModalOverlay}>
            <View style={styles.seacrhModalContainer}>
              <View style={styles.searchModalHeader}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.searchBackBtn}
                  onPress={this.closeSearchModal}
                >
                  <Ionicons name="arrow-back" size={25} color={Colors.white} />
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
                          },
                          () => {
                            this.searchInsidentDebounce();
                          }
                        )
                      }
                      autoCompleteType="off"
                      placeholder="Search"
                      placeholderTextColor={Colors.white}
                      style={styles.searchField}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.searchModalBody}>
                {this.state.searchValue.trim().length > 0 ? (
                  <FlatList
                    data={this.state.searchData}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderSearchListItem}
                    initialNumToRender={this.state.searchData.length}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={() => (
                      <Text
                        style={{
                          color: Colors.textColor,
                          textAlign: "center",
                          marginTop: 10,
                        }}
                      >
                        No Result Found
                      </Text>
                    )}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
