import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Container } from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../component";
import styles1 from "./Styles";

export default class EnclosureMgmtHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [
        // {
        // 	id: 1,
        // 	name: "Enclosures",
        // 	onclick: () => this.props.navigation.navigate("EnclosureSection"),
        // 	icon: <Ionicons name="card" size={35} color={Colors.textColor} />
        // },
        // {
        // 	id: 2,
        // 	name: "Sections",
        // 	onclick: () => this.props.navigation.navigate("Sections"),
        // 	icon: <Ionicons name="layers" size={35} color={Colors.textColor} />
        // },
        {
          id: 3,
          name: "Change Enclosure",
          onclick: () => this.props.navigation.navigate("Enclosure"),
          icon: <FontAwesome name="edit" size={35} color={Colors.textColor} />,
        },
        // {
        // 	id: 4,
        // 	name: "Enclosure Change History",
        // 	onclick: () => this.props.navigation.navigate("EnclosureChangeHistory"),
        // 	icon: <FontAwesome name="edit" size={35} color={Colors.textColor} />
        // },
        // {
        // 	id: 5,
        // 	name: "Enclosure Types",
        // 	onclick: () => this.props.navigation.navigate("EnclosureTypes"),
        // 	icon: <Ionicons name="cube" size={35} color={Colors.textColor} />
        // },
        {
          id: 6,
          name: "Enclosure Mgmt",
          onclick: () => this.props.navigation.navigate("Sections"),
          icon: <FontAwesome name="edit" size={35} color={Colors.textColor} />,
        },
      ],
    };
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={item.onclick}
        style={[styles.btn, styles.pl12, styles1.borderBottomStyle]}
      >
        <View style={styles.imgContainer}>{item.icon}</View>
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render = () => (
    <Container>
      <Header title={"Enclosure Mgmt"} />
      <View style={styles.container}>
        <FlatList
          data={this.state.menus}
          keyExtractor={(item) => item.id.toString()}
          renderItem={this.renderItem}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  card: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 3,
    backgroundColor: Colors.white,
    marginVertical: 10,
    shadowColor: "#999",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
  },
  cardIconBox: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: Colors.textColor,
  },
  cardTitleBox: {
    width: "80%",
    paddingLeft: 20,
  },
  cardTitle: {
    fontSize: 25,
    color: Colors.textColor,
  },
  pl12: {
    paddingLeft: 12,
  },
  btn: {
    // width: Math.floor(windowWidth / 2),
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  imgContainer: {
    width: "20%",
  },

  title: {
    width: "72%",
    fontSize: 16,
    color: Colors.textColor,
    // fontWeight: "bold",
  },
});
