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
import { getAnimalFarms } from "../services/APIServices";
import globalStyles from "../config/Styles";
import styles from './Styles'


export default class Location extends React.Component {
  static contextType = AppContext;

  state = {
    isLoading: true,
  };

  componentDidMount = () => {
    this.loadLocations();
  };

  loadLocations = () => {
    let cid = this.context.userDetails.cid;
    getAnimalFarms(cid)
      .then((data) => {
        this.setState({ isLoading: false });
        this.context.setLocations(data);
      })
      .catch((error) => console.log(error));
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadLocations();
      }
    );
  };

  gotoAddLocation = () => {
    this.props.navigation.navigate("AddLocation");
  };

  gotoEditLocation = (item) => {
    this.props.navigation.navigate("AddLocation", {
      id: item.id.toString(),
      branch_code: item.branch_code,
      name: item.name,
      screen_title: "Update Location",
    });
  };

  renderListItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={this.gotoEditLocation.bind(this, item)}
    >
      <View style={styles.view}>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-forward" style={styles.iconStyle} />
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
        title={"Locations"}
        leftIconShow={true}
        rightIconShow={true}
        leftButtonFunc={this.gotoBack}
        rightButtonFunc={this.gotoAddLocation}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.context.locations}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderListItem}
          initialNumToRender={this.context.locations.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
            this.context.locations.length === 0 ? styles.container : null
          }
        />
      )}
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 5,
//   },
//   view: {
//     flexDirection: "row",
//     height: 50,
//     borderBottomColor: "#eee",
//     borderBottomWidth: 1,
//     paddingHorizontal: 5,
//   },
//   name: {
//     fontSize: 18,
//     color: Colors.textColor,
//   },
//   iconStyle: {
//     fontSize: 18,
//     color: "#cecece",
//   },
// });
