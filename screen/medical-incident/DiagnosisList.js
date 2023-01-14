import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getDiagnosis } from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class DiagnosisList extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      diagnosis: [],
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
        diagnosis: [],
      },
      () => {
        this.loadDiagnosis();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadDiagnosis = () => {
    let cid = this.context.userDetails.cid;

    this.setState(
      {
        isLoading: true,
      },
      () => {
        getDiagnosis(cid)
          .then((data) => {
            this.setState({
              isLoading: false,
              diagnosis: data,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  gotoAddDiagnosis = () => {
    this.props.navigation.navigate("AddDiagnosis");
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddDiagnosis", {
      item: item,
    });

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={this.gotoEdit.bind(this, item)}
      style={styles.fieldBox}
    >
      <Text style={styles.labelName}>{item.diagnosis}</Text>
    </TouchableOpacity>
  );

  render = () => (
    <Container>
      <Header title={"Diagnosis"} addAction={this.gotoAddDiagnosis} />
      <View style={styles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.diagnosis}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            initialNumToRender={this.state.diagnosis.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loaddiagnosis}
            contentContainerStyle={
              this.state.diagnosis.length === 0 ? styles.container : null
            }
          />
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
// 	pl12: {
// 		paddingLeft: 12,
// 	},
// 	btn: {
// 		// width: Math.floor(windowWidth / 2),
// 		paddingVertical: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
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
//     title: {
// 		width: "72%",
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},

// });
