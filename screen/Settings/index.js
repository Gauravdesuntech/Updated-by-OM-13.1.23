// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: { welcome: "Hello", name: "Charlie" },
  es: { welcome: "hola" },
};

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
} from "react-native";
import { Header } from "../../component";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../config";
import ListEmpty from "../../component/ListEmpty";
import Loader from "../../component/Loader";
import AppContext from "../../context/AppContext";
import { Configs } from "../../config";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class Settings extends React.Component {
  static contextType = AppContext;

  state = {
    isLoading: false,
  };

  componentDidMount = () => {};

  gotoLocationSettings = () => {
    this.props.navigation.navigate("LanguageSettings");
  };

  renderListItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor={"#eee"}
        onPress={this.gotoLocationSettings.bind(this, item)}
      >
        <View style={styles.view}>
          <View style={{ justifyContent: "center", flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-forward" style={styles.iconStyle} />
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  render = () => {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;

    return (
      <Container>
        <Header
          leftIconName={"arrow-back"}
          rightIconName={"add"}
          title={"Settings"}
          leftIconShow={true}
          rightIconShow={true}
          leftButtonFunc={this.gotoBack}
        />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ListEmptyComponent={() => <ListEmpty />}
            data={Configs.SETTINGS_MENU}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderListItem}
            initialNumToRender={Configs.SETTINGS_MENU?.length}
            // refreshing={this.state.isLoading}
            // onRefresh={this.handelRefresh}
            contentContainerStyle={
              this.context.locations.length === 0 ? styles.container : null
            }
          />
        )}
        <Text style={styles.title}>{i18n.t("welcome")}</Text>
        <Text style={styles.title}>{this.context.locale}</Text>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
  view: {
    flexDirection: "row",
    height: 50,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  name: {
    fontSize: 18,
    color: Colors.textColor,
  },
  iconStyle: {
    fontSize: 18,
    color: "#cecece",
  },
});
