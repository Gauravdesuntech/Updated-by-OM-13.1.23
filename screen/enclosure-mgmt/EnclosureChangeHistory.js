import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import Base64 from "../../config/Base64";
import { Header, ListEmpty, OverlayLoader } from "../../component";
import { getConfirmedEnclosureChangeHistory } from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";

export default class Enclosure extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      data: [],
    };
  }

  componentDidMount = () => {
    this.subscribe = this.props.navigation.addListener("focus", () => {
      this.setState({ showLoader: true }, () => {
        this.fetchData();
      });
    });
  };

  fetchData = () => {
    let cid = this.context.userDetails.cid;
    let user_id = this.context.userDetails.id;
    getConfirmedEnclosureChangeHistory(user_id)
      .then((res) => {
        this.setState({
          data: res,
          showLoader: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentWillUnmount = () => {
    this.subscribe();
  };

  gotoBack = () => this.props.navigation.goBack();

  gotoChangeEnclosure = () => this.props.navigation.navigate("ChangeEnclosure");

  goToDetails = (item) =>
    this.props.navigation.navigate("ViewChangeEnclosure", { item: item });

  renderListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={this.goToDetails.bind(this, item)}
    >
      <View style={globalStyles.row}>
        <View style={globalStyles.leftPart}>
          <Text
            style={[
              globalStyles.labelName,
              globalStyles.pd0,
              globalStyles.text_bold,
              globalStyles.p5,
            ]}
          >{`#${item.request_number}`}</Text>
          <Text
            style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}
          >
            {"Animals : " + item.animal_id}
          </Text>
          <Text
            style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}
          >
            {"Requested By: " + item.changed_by_name}
          </Text>
          <Text
            style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}
          >
            {"Reason: " + item.change_reason}
          </Text>
          <Text
            style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p55]}
          >
            {"Status: " + item.status}
          </Text>
        </View>
        <View style={globalStyles.rightPart}>
          <View style={globalStyles.rightPartStock}>
            <Ionicons name="chevron-forward" style={globalStyles.iconStyle} />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  checkAddActionPermissions = () => {
    if (this.context.userDetails.action_types.includes("Add")) {
      return this.gotoChangeEnclosure;
    } else {
      return undefined;
    }
  };

  render = () => (
    <Container>
      <Header
        title={"Changed Enclosure"}
        addAction={this.checkAddActionPermissions()}
      />
      <View style={globalStyles.container}>
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.state.data}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderListItem}
          initialNumToRender={this.state.data.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.state.data.length === 0 ? globalStyles.container : null
          }
        />
      </View>

      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 	},

// 	row: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 5,
// 	},
// 	leftPart: {
// 		width: "75%",
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		justifyContent: "center",
// 	},
// 	rightPartStock: {
// 		flexDirection: 'row',
// 		justifyContent: 'flex-end',
// 		alignItems: 'center',
// 		flex: 1 / 2
// 	},
// 	rightPartButton: {
// 		padding: 5,
// 		alignItems: 'center',
// 		backgroundColor: Colors.primary,
// 		borderRadius: 3
// 	},
// 	rightPartButtonText: {
// 		color: Colors.white
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
// });
