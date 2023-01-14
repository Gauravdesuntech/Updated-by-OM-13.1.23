import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Image,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../component";
import { Colors } from "../config";
import ListEmpty from "../component/ListEmpty";
import Loader from "../component/Loader";
import AppContext from "../context/AppContext";
import { getAllSpecies } from "../services/APIServices";
import globalStyles from "../config/Styles";
<<<<<<< HEAD
import styles from './Styles'
=======

>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
export default class Species extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoryID:
        typeof props.route.params !== "undefined"
          ? props.route.params.category_id
          : undefined,
      enableAddButton:
        typeof props.route.params !== "undefined"
          ? props.route.params.enableAddButton
          : true,
    };
  }

  componentDidMount = () => {
    this.loadSpecies();
  };

  loadSpecies = () => {
    let cid = this.context.userDetails.cid;
    let { categoryID } = this.state;
    getAllSpecies(cid, categoryID).then((data) => {
      this.setState({ isLoading: false });
      this.context.setSpecies(data);
    });
  };

  handelRefresh = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadSpecies();
      }
    );
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  gotoAddSpecies = () => {
    this.props.navigation.navigate("AddSpecies");
  };

  gotoSubSpecies = (id, name) => {
    this.props.navigation.navigate("SubSpecies", {
      speciesID: id,
      enableAddButton: false,
    });
  };

  renderSpeciesItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={"#eee"}
      onPress={
        this.state.enableAddButton
          ? undefined
          : this.gotoSubSpecies.bind(this, item.id)
      }
    >
<<<<<<< HEAD
      <View style={styles.viewr_Species}>
=======
      <View style={styles.view}>
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
        <View style={[globalStyles.width20, globalStyles.justifyContentCenter]}>
          <Image style={styles.image} source={{ uri: item.species_icon }} />
        </View>
        <View style={[globalStyles.justifyContentCenter, globalStyles.flex1]}>
<<<<<<< HEAD
          <Text style={styles.name_Species}>{item.species_name}</Text>
=======
          <Text style={styles.name}>{item.species_name}</Text>
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
<<<<<<< HEAD
						<Text style={styles._Species}>{item.total_sub_species}</Text>
					</View> */}
          <Ionicons name="chevron-forward" style={styles.rightAngelIcon_Species} />
=======
						<Text style={styles.qty}>{item.total_sub_species}</Text>
					</View> */}
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
        title={"Species"}
        leftIconShow={true}
        leftButtonFunc={this.gotoBack}
        rightIconShow={this.state.enableAddButton}
        rightIconName={this.state.enableAddButton ? "add" : undefined}
        rightButtonFunc={
          this.state.enableAddButton ? this.gotoAddSpecies : undefined
        }
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListEmptyComponent={() => <ListEmpty />}
          data={this.context.species}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderSpeciesItem}
          initialNumToRender={this.context.species.length}
          refreshing={this.state.isLoading}
          onRefresh={this.handelRefresh}
          contentContainerStyle={
<<<<<<< HEAD
            this.context.species.length === 0 ? styles.listContainer_Species : null
=======
            this.context.species.length === 0 ? styles.listContainer : null
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
          }
        />
      )}
    </Container>
  );
}

<<<<<<< HEAD
// const styles = StyleSheet.create({
//   listContainer_Species: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 5,
//   },
//   image: {
//     width: 40,
//     height: 40,
//     marginLeft: 5,
//   },
//   viewr_Species: {
//     flexDirection: "row",
//     height: 50,
//     borderBottomColor: "#eee",
//     borderBottomWidth: 1,
//   },
//   name_Species: {
//     fontSize: 20,
//   },
//   qtyContainer_Species: {
//     height: 25,
//     width: 25,
//     borderRadius: 100,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   qty_Species: {
//     fontSize: 16,
//     color: "#FFF",
//   },
//   arrow_Species: {
//     fontSize: 18,
//   },
//   rightAngelIcon_Species: {
//     fontSize: 18,
//     color: "#cecece",
//   },
//});
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
  arrow: {
    fontSize: 18,
  },
  rightAngelIcon: {
    fontSize: 18,
    color: "#cecece",
  },
});
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
