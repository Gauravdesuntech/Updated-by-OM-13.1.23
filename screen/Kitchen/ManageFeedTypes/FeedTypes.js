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
import colors from "../../../config/colors";
import { getfeedtype } from "../../../services/KitchenServices";
import Styles from '../Style'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class FeedTypes extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      feedTypes: [],
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
        feedTypes: [],
      },
      () => {
        this.loadFeedTypes();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadFeedTypes = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getfeedtype()
          .then((data) => {
            this.setState({
              isLoading: false,
              feedTypes: data.data
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  gotoAddFeedTypes = () => {
    this.props.navigation.navigate("AddFeedTypes");
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddFeedTypes", {
      item: item,
    });

  renderItem = ({ item }) => (
    <TouchableOpacity
        style={[globalStyles.fieldBox, globalStyles.justifyContentSpaceBetween]}
        activeOpacity={1}
        onPress={this.gotoEdit.bind(this, item)}
      >
        <View>
          <Text style={[globalStyles.labelName, globalStyles.pd0,globalStyles.p5,globalStyles.fontWeightBold]}>
            Sl. No.  :  {item.id}
          </Text>

          <Text style={[globalStyles.labelName, globalStyles.pd0, globalStyles.p5,globalStyles.fontWeightBold]}>
           Feed Type :  {item.feed_type_name}
          </Text>
        </View>
        <Image source={{ uri: item.feed_icon }} style={Styles.uploadedImage}/>
        <View style={{
          backgroundColor : item.color == null ? colors.primary : item.color , 
          height:50,
          width:50 , 
          borderColor : "#ddd" , 
          borderWidth : 1 , 
          alignItems:"center" , 
          justifyContent:'center'}}>
          </View>
      </TouchableOpacity>
  );

  render = () => (
    <Container>
      <Header title={"FeedTypes"} addAction={this.gotoAddFeedTypes} />
      <View style={globalStyles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.feedTypes}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            initialNumToRender={this.state.feedTypes.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loadFeedTypes}
            contentContainerStyle={
              this.state.feedTypes.length === 0 ? globalStyles.container : null
            }
          />
        )}
      </View>
    </Container>
  );
}
