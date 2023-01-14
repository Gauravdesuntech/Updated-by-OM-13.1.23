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
import Colors from "../../../config/colors";
import { Header, Loader, ListEmpty } from "../../../component";
import { getDiagnosis } from "../../../services/MedicalAndIncidenTServices";
import AppContext from "../../../context/AppContext";
import globalStyles from "../../../config/Styles";
import { getfoods } from "../../../services/KitchenServices";
import Styles from '../Style' 

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class Foods extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      foods: [],
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
        foods: [],
      },
      () => {
        this.loadFoods();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadFoods = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getfoods()
          .then((data) => {
            this.setState({
              isLoading: false,
              foods: data.data
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  gotoAddFoods = () => {
    this.props.navigation.navigate("AddFoods");
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddFoods", {
      item: item,
    });

  renderItem = ({ item }) => (
    <TouchableOpacity
        style={[globalStyles.fieldBox, { justifyContent: "space-between" }]}
        activeOpacity={1}
        onPress={this.gotoEdit.bind(this, item)}
      >
        <View>
          <Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.p5, globalStyles.fontWeightBold ]}>
            Sl. No.  :  {item.id}
          </Text>
          <Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.p5 , globalStyles.fontWeightBold ]}>
           Factor Name :  {item.name}
          </Text>
          <Text style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}>
           Feed Type :  {item.feed_type_name}
          </Text>
        </View>
      </TouchableOpacity>
  );

  render = () => (
    <Container>
      <Header title={"Foods"} addAction={this.gotoAddFoods} />
      <View style={globalStyles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.foods}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            initialNumToRender={this.state.foods.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loadFoods}
            contentContainerStyle={
              this.state.foods.length === 0 ? globalStyles.container : null
            }
          />
        )}
      </View>
    </Container>
  );
}
