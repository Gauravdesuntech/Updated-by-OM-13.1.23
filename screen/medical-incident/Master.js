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
import ModalMenu from "../../component/ModalMenu";
import globalStyles from "../../config/Styles";

export default class Master extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [
        {
          id: 1,
          name: "Medical",
          onclick: () =>
            this.props.navigation.navigate("MedicalMaster", {
              title: "Medical Master",
            }),
          icon: (
            <FontAwesome name="sitemap" size={35} color={Colors.textColor} />
          ),
        },
        {
          id: 2,
          name: "Incident",
          onclick: () =>
            this.props.navigation.navigate("IncidentMaster", {
              title: "Incident Master",
            }),
          icon: (
            <FontAwesome
              name="address-card"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 3,
          name: "Enclosure Master",
          onclick: () =>
            this.props.navigation.navigate("Enclosure_Master", {
              title: "Enclosure Master",
            }),
          icon: <Ionicons name="card" size={35} color={Colors.textColor} />,
        },
        // {
        // 	id: 3,
        // 	name: "Enclosure Master",
        // 	onclick: () => this.props.navigation.navigate("EnclosureSection"),
        // 	icon: <Ionicons name="card" size={35} color={Colors.textColor} />
        // },
        // {
        // 	id: 4,
        // 	name: "Enclosure Types",
        // 	onclick: () => this.props.navigation.navigate("EnclosureTypes"),
        // 	icon: <Ionicons name="cube" size={35} color={Colors.textColor} />
        // },
        {
          id: 4,
          name: "Task Master",
          onclick: () =>
            this.props.navigation.navigate("Task_mngt", {
              title: "Task Master",
            }),
          icon: <Ionicons name="cube" size={35} color={Colors.textColor} />,
        },
        {
          id: 5,
          name: "Feeding",
          onclick: () =>
            this.props.navigation.navigate("FeedingMaster", {
              title: "Feeding Master",
            }),
          icon: (
            <MaterialCommunityIcons
              name="food-variant"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 6,
          name: "Get Print Label",
          onclick: () =>
            this.props.navigation.navigate("GetPrintLabelMaster", {
              title: "Get Print Label Master",
            }),
          icon: (
            <MaterialCommunityIcons
              name="printer"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 7,
          name: "Location",
          onclick: () =>
            this.props.navigation.navigate("LocationMaster", {
              title: "Location Master",
            }),
          icon: (
            <Ionicons
              name="md-location-sharp"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 8,
          name: "Tag",
          onclick: () =>
            this.props.navigation.navigate("TagMaster", {
              title: "Tag Master",
            }),
          icon: <AntDesign name="tags" size={35} color={Colors.textColor} />,
        },
        {
          id: 9,
          name: "Kitchen",
          onclick: () =>
            this.props.navigation.navigate("KitchenMaster", {
              title: "Kitchen Master",
            }),
          icon: (
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
      ],
    };
  }

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  gotoDesignations = () => this.props.navigation.navigate("Designations");

  gotoRecipes = () => this.props.navigation.navigate("Departments");

  gotoParties = () => this.props.navigation.navigate("Parties");

  gotoPurchase = () => this.props.navigation.navigate("Purchase");

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={item.onclick}
        style={[globalStyles.icon_btn, globalStyles.pl12]}
      >
        <View style={globalStyles.imgContainer}>{item.icon}</View>
        <Text style={[globalStyles.title, globalStyles.fontWeightNormal]}>
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
        title={"Master"}
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

// const styles = StyleSheet.create({
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
