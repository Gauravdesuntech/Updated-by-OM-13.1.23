/*Example of Expandable ListView in React Native*/
import React, { Component } from "react";
//import react in our project
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  SafeAreaView 
} from "react-native";
//import basic react native components
import { Icon } from "native-base";
import { Bullets } from "react-native-easy-content-loader";
import { Colors } from "../../config";

class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor(props) {
    super();
    this.state = {
      layoutHeight: 0,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={[
            styles.header,
            { width: "100%", borderBottomWidth: 1, borderColor: "#ccc" },
          ]}
        >
          <Text style={styles.headerText}>{this.props.item.title}</Text>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: "hidden",
          }}
        ></View>
      </View>
    );
  }
}

export default class Category extends Component {
  //Main View defined under this Class
  constructor(props) {
    super(props);
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      newCat: null,
      listDataSource: props.categoryData,
      catPresed: props.onCatPress,
      heading: props.heading,
      userType: props.userType,
      navigation: props.navigation,
      permission: props.permission,
      screen: props.screen
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if(props.categoryData.length != state.listDataSource.length){
      return {
        newCat: null,
        listDataSource: props.categoryData,
        catPresed: props.onCatPress,
        heading: props.heading,
        userType: props.userType,
        navigation: props.navigation,
        permission: props.permission,
        screen: props.screen
      }
    }
    return null
  }

  filterSubCat = (i) => {
    //console.log("I================>", i)
    const arrayy = [...this.state.listDataSource];
    arrayy.map((value, placeindex) =>
      placeindex === i
        ? this.setState({ newCat: value })
        : console.log("None=========>")
    );
  };

  updateLayout = (index) => {
    this.filterSubCat(index);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
        : (array[placeindex]["isExpanded"] = false)
    );

    //For Multiple Expand at a time
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    this.setState(() => {
      return {
        listDataSource: array,
      };
    });
  };

  render() {
    const { listDataSource, newCat, catPresed, heading, navigation, screen  } = this.state;

    return (
      <>
        {listDataSource != "" ? (
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Colors.primary,
              }}
            >
              <Text style={styles.topHeading}>{this.state.heading}</Text>
              {this.state.permission == "Yes" ? (
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingRight: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.state.navigation.navigate(screen);
                  }}
                >
                  <Icon
                    active
                    name="edit"
                    type="AntDesign"
                    style={{
                      color: "#fff",
                      fontSize: 20,
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <SafeAreaView  style={{ flexDirection: "row", flex: 1 }}>
              <View
                style={{
                  width: "50%",
                  borderColor: "#ccc",
                  borderRightWidth: 1,
                }}
              >
                <FlatList
                  data={listDataSource}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={listDataSource}
                  renderItem={({ item, index }) => (
                    <ExpandableItemComponent
                      key={item.category_name}
                      onClickFunction={this.updateLayout.bind(this, index)}
                      onCatPressed={catPresed}
                      item={item}
                    />
                  )}
                />
              </View>
              <View style={{ width: "50%" }}>
                {newCat != null ? (
                  <View>
                    {newCat.data.map((item, key) => (
                      <>
                        <TouchableOpacity
                          key={key}
                          style={styles.content}
                          onPress={catPresed.bind(this, item)}
                        >
                          <Image
                            style={{ width: 25, height: 25 }}
                            source={{
                              uri: item.tag_icon,
                            }}
                          />
                          <Text style={styles.text}>{item.name}</Text>
                        </TouchableOpacity>
                      </>
                    ))}
                  </View>
                ) : null}
              </View>
            </SafeAreaView >
          </View>
        ) : (
          <View style={styles.container}>
            <View
              style={{
                justifyContent: "space-between",
                backgroundColor: Colors.primary,
              }}
            >
              <Text style={styles.topHeading}>{this.state.heading}</Text>
            </View>
            <View style={{marginTop: 10}}>
              <Bullets active listSize={10} />
            </View>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHeading: {
    paddingLeft: 10,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    height: 40,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "500",
    paddingLeft: 15,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#808080",
    width: "95%",
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 15,
    color: "#606070",
    padding: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
