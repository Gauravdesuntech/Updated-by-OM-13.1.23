import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Image,
} from "react-native";
import { Container, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../component";
import { Colors } from "../config";
import ListEmpty from "../component/ListEmpty";
import Loader from "../component/Loader";
import { getAllSubSpecies } from "../services/APIServices";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
<<<<<<< HEAD
//import globalStyles from "../config/Styles";
import styles from './Styles'
=======

>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
export default class SubSpecies extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      speciesID:
        typeof props.route.params !== "undefined"
          ? props.route.params.speciesID
          : undefined,
      enableAddButton:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.enableAddButton
          : true,
    };
  }

  componentDidMount = () => {
    this.loadSubSpecies();
  };

  loadSubSpecies = () => {
    let cid = this.context.userDetails.cid;
    let { speciesID, enableAddButton } = this.state;

    getAllSubSpecies(cid, speciesID)
      .then((data) => {
        this.setState({ isLoading: false });
        if (data.length === 0 && !enableAddButton) {
          this.gotoAnimalsList({ species: speciesID });
        } else {
          this.context.setSubSpecies(data);
        }
      })
      .catch((error) => console.log(error));
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadSubSpecies();
      }
    );
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  gotoAddSubSpecies = () => {
    this.props.navigation.navigate("AddSubSpecies");
  };

  gotoAnimalsList = (paramObj) => {
    this.props.navigation.navigate("AnimalsList", paramObj);
  };

  renderSpeciesItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={
        this.state.enableAddButton
          ? undefined
          : this.gotoAnimalsList.bind(this, { sub_species: item.id })
      }
    >
<<<<<<< HEAD
      <View style={styles.view_SubSpecies}>
        <View style={[globalStyles.width20, globalStyles.justifyContentCenter]}>
          <Image style={styles.image_SubSpecies} source={{ uri: item.sub_species_icon }} />
        </View>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
          <Text style={styles.name_SubSpecies}>{item.sub_species_name}</Text>
=======
      <View style={styles.view}>
        <View style={[globalStyles.width20, globalStyles.justifyContentCenter]}>
          <Image style={styles.image} source={{ uri: item.sub_species_icon }} />
        </View>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
          <Text style={styles.name}>{item.sub_species_name}</Text>
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <View style={styles.qtyContainer}>
                        <Text style={styles.qty}>{item.total_animals}</Text>
                    </View> */}
<<<<<<< HEAD
          <Ionicons name="chevron-forward" style={styles.rightAngelIcon_SubSpecies} />
=======
          <Ionicons name="chevron-forward" style={styles.rightAngelIcon} />
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
        </View>
      </View>
    </TouchableHighlight>
  );

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        title={"Sub Species"}
        leftIconShow={true}
        leftButtonFunc={this.gotoBack}
        rightIconShow={this.state.enableAddButton}
        rightIconName={this.state.enableAddButton ? "add" : undefined}
        rightButtonFunc={
          this.state.enableAddButton ? this.gotoAddSubSpecies : undefined
        }
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.context.subSpecies}
          renderItem={this.renderSpeciesItem}
          keyExtractor={(item, index) => item.id.toString()}
          initialNumToRender={this.context.subSpecies.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
<<<<<<< HEAD
            this.context.subSpecies.length === 0 ? styles.listContainer_SubSpecies : null
=======
            this.context.subSpecies.length === 0 ? styles.listContainer : null
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
          }
        />
      )}
    </Container>
  );
}

<<<<<<< HEAD
// const styles = StyleSheet.create({
//    listContainer_SubSpecies: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 5,
//   },
//   image_SubSpecies: {
//     width: 40,
//     height: 40,
//     marginLeft: 5,
//   },
//   view_SubSpecies: {
//     flexDirection: "row",
//     height: 50,
//     borderBottomColor: "#eee",
//     borderBottomWidth: 1,
//   },
//   name_SubSpecies: {
//     fontSize: 20,
//   },
//   qtyContainer: {
//     height: 25,
//     width: 25,
//     borderRadius: 100,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   qty: {
//     fontSize: 16,
//     color: "#FFF",
//   },
//   rightAngelIcon_SubSpecies: {
//     fontSize: 18,
//     color: "#cecece",
//   },
// });
=======
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  view: {
    flexDirection: "row",
    height: 50,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 20,
  },
  qtyContainer: {
    height: 25,
    width: 25,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: {
    fontSize: 16,
    color: "#FFF",
  },
  rightAngelIcon: {
    fontSize: 18,
    color: "#cecece",
  },
});
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
