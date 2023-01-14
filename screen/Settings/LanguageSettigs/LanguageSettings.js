import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import AppContext from "../../../context/AppContext";
import { Header } from "../../../component";
import { Container } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../../config/colors";
import { Configs } from "../../../config";
import { translations } from "./localizations";
// import { getFromAsyncStorage, setToAsyncStorage } from "../../../utils/Util";

// const i18n = new I18n(translations);

// export const translate = async (text) => {
//   i18n.enableFallback = true;
//   // i18n.locale = useContext(AppContext).locale;
//   console.log({ lan: await getFromAsyncStorage("locale") });
//   i18n.locale = await getFromAsyncStorage("locale");
//   console.log(i18n.t(text));
//   // return i18n.t(text);
//   return i18n.t(text);
// };

// const storeLocaleToAsyncStorage = (text) => {
//   setToAsyncStorage("locale", text);
// };

export const LanguageSettings = (props) => {
  // const [selectedLanguage, setselectedLanguage] = useState();
  const { locale, setLocale } = useContext(AppContext);

  const gotoBack = () => {
    props.navigation.goBack();
  };

  const renderListItem = ({ item }) => {
    // console.log({ item, locale });
    return (
      <TouchableHighlight
        underlayColor={"#eee"}
        onPress={() => {
          setLocale(item.value);
          // storeLocaleToAsyncStorage(item.value);
        }}
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
            {locale === item.value && (
              <MaterialIcons name="language" style={styles.iconStyle} />
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        rightIconName={"add"}
        title={"Language Setting"}
        leftIconShow={true}
        rightIconShow={true}
        leftButtonFunc={gotoBack}
      />
      <FlatList
        ListEmptyComponent={() => <ListEmpty />}
        data={Configs.APP_LANGUAGES}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderListItem}
        initialNumToRender={Configs.SETTINGS_MENU?.length}
        // refreshing={this.state.isLoading}
        // onRefresh={this.handelRefresh}
        // contentContainerStyle={
        //   this.context.locations.length === 0 ? styles.container : null
        // }
      />
    </Container>
  );
};

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
    color: "black",
  },
});
