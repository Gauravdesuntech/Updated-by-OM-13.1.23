import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Container } from "native-base";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../component";
import globalStyles from "../../config/Styles";

export default class KitchenMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date(),
      menus: [
          {
            id: 1,
            name: "Feeding Factors",
            onclick: () =>
              this.props.navigation.navigate("FeedingFactors", {
                type: "enclosure",
              }),
            icon: <MaterialCommunityIcons name="food-fork-drink" size={35} color={Colors.textColor} />,
          },
          {
            id: 2,
            name: "Meal Slots",
            onclick: () =>
              this.props.navigation.navigate("MealSlots", {
                type: "enclosure",
              }),
            icon: <MaterialCommunityIcons name="food-fork-drink" size={35} color={Colors.textColor} />,
          },
          {
            id: 3,
            name: "Feeding Platers",
            onclick: () =>
              this.props.navigation.navigate("FeedingPlaters", {
                type: "enclosure",
              }),
            icon: <MaterialCommunityIcons name="food-fork-drink" size={35} color={Colors.textColor} />,
          },
          {
            id: 4,
            name: "Feed Types",
            onclick: () =>
              this.props.navigation.navigate("FeedTypes", {
                type: "enclosure",
              }),
            icon: <MaterialCommunityIcons name="food-fork-drink" size={35} color={Colors.textColor} />,
          },
        {
          id: 5,
          name: "Foods",
          onclick: () => this.props.navigation.navigate("Foods"),
          icon: <MaterialCommunityIcons name="food-fork-drink" size={35} color={Colors.textColor} />,
        },
      ],
    };
  }

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={item.onclick}
        style={[globalStyles.icon_btn, globalStyles.pl12]}
      >
        <View style={globalStyles.imgContainer}>
        {item.icon}
        </View>
        <Text style={[globalStyles.title,globalStyles.fontWeightNormal]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        rightIconName={"add"}
        title={this.props.route.params.title}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={globalStyles.container}>
        <FlatList
          data={this.state.menus}
          keyExtractor={(item) => item.id.toString()}
          renderItem={this.renderItem}
        />
      </View>
    </Container>
  );
}

// const globalStyles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		padding: 10,
// 	},
// 	card: {
// 		width: "100%",
// 		height: 80,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 8,
// 		paddingVertical: 8,
// 		borderRadius: 3,
// 		backgroundColor: Colors.white,
// 		marginVertical: 10,
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 5,
// 	},
// 	cardIconBox: {
// 		width: "20%",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		borderRightWidth: 1,
// 		borderColor: Colors.textColor,
// 	},
// 	cardTitleBox: {
// 		width: "80%",
// 		paddingLeft: 20,
// 	},
// 	cardTitle: {
// 		fontSize: 25,
// 		color: Colors.textColor,
// 	},pl12: {
// 		paddingLeft: 12,
// 	},
// 	btn: {
// 		// width: Math.floor(windowWidth / 2),
// 		paddingVertical: 20,
// 		flexDirection: "row",
// 		alignItems: "center",
// 	},
// 	imgContainer: {
// 		width: "20%",
// 	},

// 	title: {
// 		width: "72%",
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},
// });
