import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
} from "react-native";
import { Header } from "../component";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../config";
import ListEmpty from "../component/ListEmpty";
import Loader from "../component/Loader";
import AppContext from "../context/AppContext";
import { getSectionRelations } from "../services/APIServices";
import globalStyles from "../config/Styles";
import styles from './Styles'
export default class SectionRelations extends React.Component {
  static contextType = AppContext;

  state = {
    isLoading: true,
    sectionRelations: [],
  };

  componentDidMount = () => {
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
        this.loadSectionRelations();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadSectionRelations = () => {
    let cid = this.context.userDetails.cid;
    getSectionRelations(cid)
      .then((data) => {
        this.setState({
          isLoading: false,
          sectionRelations: data,
        });
      })
      .catch((error) => console.log(error));
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadSectionRelations();
      }
    );
  };

  gotoAddSectionRelation = () => {
    this.props.navigation.navigate("AddSectionRelation");
  };

  gotoEditSectionRelation = (id) => {
    this.props.navigation.navigate("AddSectionRelation", {
      id: id,
    });
  };

  renderListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={this.gotoEditSectionRelation.bind(this, item.id)}
    >
      <View style={styles.view_SectionRelations}>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
          <Text style={styles.titleText_SectionRelations}>
            Enclosure ID:{" "}
            <Text style={styles.subText_SectionRelations}>{item.enclosure_id}</Text>
          </Text>
          <Text style={styles.titleText_SectionRelations}>
            Enclosure Type:{" "}
            <Text style={styles.subText_SectionRelations}>{item.enclosure_type}</Text>
          </Text>
          <Text style={styles.titleText_SectionRelations}>
            Section: <Text style={styles.subText_SectionRelations}>{item.section_name}</Text>
          </Text>
        </View>
        <View style={styles.iconBox_SectionRelations}>
          <Ionicons name="chevron-forward" style={styles.iconStyle_SectionRelations} />
        </View>
      </View>
    </TouchableHighlight>
  );

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        rightIconName={"add"}
        title={"Section Relations"}
        leftIconShow={true}
        rightIconShow={true}
        leftButtonFunc={this.gotoBack}
        rightButtonFunc={this.gotoAddSectionRelation}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.state.sectionRelations}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderListItem}
          initialNumToRender={this.state.sectionRelations.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.state.sectionRelations.length === 0 ? styles.container_SectionRelations : null
          }
        />
      )}
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container_SectionRelations: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 5,
//   },
//   image_SectionRelations: {
//     width: 40,
//     height: 40,
//     marginLeft: 5,
//   },
//   view_SectionRelations: {
//     flexDirection: "row",
//     // height: 50,
//     borderBottomColor: "#eee",
//     borderBottomWidth: 1,
//     padding: 5,
//   },
//   titleText_SectionRelations: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#444",
//   },
//   subText_SectionRelations: {
//     fontSize: 15,
//     color: "#444",
//     opacity: 0.8,
//     fontWeight: "normal",
//   },
//   iconBox_SectionRelations: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   iconStyle_SectionRelations: {
//     fontSize: 18,
//     color: "#cecece",
//   },
// });
