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
import { getfeedmealslot } from "../../../services/KitchenServices";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class MealSlots extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      mealSlots: [],
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
        mealSlots: [],
      },
      () => {
        this.loadMealSlots();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadMealSlots = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getfeedmealslot()
          .then((data) => {
            this.setState({
              isLoading: false,
              mealSlots: data.data
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  gotoAddMealSlots = () => {
    this.props.navigation.navigate("AddMealSlots");
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddMealSlots", {
      item: item,
    });

  renderItem = ({ item }) => (
    <TouchableOpacity
        style={[globalStyles.fieldBox, { justifyContent: "space-between" }]}
        activeOpacity={1}
        onPress={this.gotoEdit.bind(this, item)}
      >
        <View>
          <Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.p5,globalStyles.fontWeightBold]}>
            Sl. No.  :  {item.id}
          </Text>

          <Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.p5,globalStyles.fontWeightBold]}>
           Slot Name :  {item.slot_name}
          </Text>

          <Text style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}>
           Start Time :  {moment(item.start_time,"HH:mm:ss").format("LT")}
          </Text>
          
          <Text style={[globalStyles.textfield, globalStyles.pd0, globalStyles.p5]}>
           End Time :  {moment(item.end_time,"HH:mm:ss").format("LT")}
          </Text>
        </View>
      </TouchableOpacity>
  );

  render = () => (
    <Container>
      <Header title={"MealSlots"} addAction={this.gotoAddMealSlots} />
      <View style={globalStyles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.mealSlots}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            initialNumToRender={this.state.mealSlots.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loadMealSlots}
            contentContainerStyle={
              this.state.mealSlots.length === 0 ? globalStyles.container : null
            }
          />
        )}
      </View>
    </Container>
  );
}
