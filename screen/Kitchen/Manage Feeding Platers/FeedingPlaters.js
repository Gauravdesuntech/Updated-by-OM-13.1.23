import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import Colors from "../../../config/colors";
import { Header, Loader, ListEmpty } from "../../../component";
import { getDiagnosis } from "../../../services/MedicalAndIncidenTServices";
import AppContext from "../../../context/AppContext";
import globalStyles from "../../../config/Styles";
import { getfeedplaters } from "../../../services/KitchenServices";
import Styles from '../Style'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class FeedingPlaters extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      platers: [],
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
        platers: [],
      },
      () => {
        this.loadFeedingPlaters();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadFeedingPlaters = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getfeedplaters()
          .then((data) => {
            this.setState({
              isLoading: false,
              platers: data.data
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  gotoAddFeedingPlaters = () => {
    this.props.navigation.navigate("AddFeedingPlaters");
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddFeedingPlaters", {
      item: item,
    });

  renderItem = ({ item }) => (
    <TouchableOpacity
        style={[globalStyles.fieldBox, globalStyles.justifyContentSpaceBetween]}
        activeOpacity={1}
        onPress={this.gotoEdit.bind(this, item)}
      >
        <View>
          <Text style={[globalStyles.labelName, globalStyles.pd0, ]}>
            Sl. No.  :  {item.id}
          </Text>

          <Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.p5, globalStyles.fontWeightBold]}>
           Platers Name :  {item.platers_name}
          </Text>
        </View>
        <Image source={{ uri: item.icon }} style={{height:50,width:50}}/>
      </TouchableOpacity>
  );

  render = () => (
    <Container>
      <Header title={"FeedingPlaters"} addAction={this.gotoAddFeedingPlaters} />
      <View style={globalStyles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.platers}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            initialNumToRender={this.state.platers.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loadFeedingPlaters}
            contentContainerStyle={
              this.state.platers.length === 0 ? globalStyles.container : null
            }
          />
        )}
      </View>
    </Container>
  );
}
