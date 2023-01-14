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
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getTagGroups } from "../../services/TagServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class TagGroupList extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      tagGroups: [],
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
        tags: [],
      },
      () => {
        this.loadTagGroups();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadTagGroups = () => {
    let cid = this.context.userDetails.cid;

    this.setState(
      {
        isLoading: true,
      },
      () => {
        getTagGroups(cid)
          .then((response) => {
            this.setState({
              isLoading: false,
              tagGroups: response.data,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  gotoAddTagGroup = () => {
    this.props.navigation.navigate("AddTagGroup");
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddTagGroup", {
      item: item,
    });

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={this.gotoEdit.bind(this, item)}
      style={globalStyles.fieldBox}
    >
      <Text style={globalStyles.labelName}>{item.name}</Text>
    </TouchableOpacity>
  );

  render = () => (
    <Container>
      <Header title={"Tag Groups"} addAction={this.gotoAddTagGroup} />
      <View style={globalStyles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.tagGroups}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            initialNumToRender={this.state.tagGroups.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loadTagGroups}
            contentContainerStyle={
              this.state.tagGroups.length === 0 ? globalStyles.container : null
            }
          />
        )}
      </View>
    </Container>
  );
}
