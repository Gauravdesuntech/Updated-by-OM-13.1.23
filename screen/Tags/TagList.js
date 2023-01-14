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
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getAllTags } from "../../services/TagServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";

export default class TagList extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      tags: [],
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
        this.loadTags();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  loadTags = () => {
    let cid = this.context.userDetails.cid;

    this.setState(
      {
        isLoading: true,
      },
      () => {
        getAllTags(cid)
          .then((response) => {
            this.setState({
              isLoading: false,
              tags: response.data,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  gotoAddTag = () => {
    this.props.navigation.navigate("AddTag");
  };

  gotoEdit = (item) =>
    this.props.navigation.navigate("AddTag", {
      item: item,
    });

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={this.gotoEdit.bind(this, item)}
      style={[
        globalStyles.fieldBox,
        {
          display: "flex",
          justifyContent: "flex-start",
        },
      ]}
    >
      <Image
        resizeMode="contain"
        source={{ uri: item.tag_icon }}
        style={{ height: 35, width: 35, marginRight: 10 }}
      />
      <Text style={globalStyles.labelName}>{item.name}</Text>
    </TouchableOpacity>
  );

  render = () => (
    <Container>
      <Header title={"Tags"} addAction={this.gotoAddTag} />
      <View style={globalStyles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={this.state.tags}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderItem}
            initialNumToRender={this.state.tags.length}
            refreshing={this.state.isLoading}
            onRefresh={this.loadTags}
            contentContainerStyle={
              this.state.tags.length === 0 ? globalStyles.container : null
            }
          />
        )}
      </View>
    </Container>
  );
}
