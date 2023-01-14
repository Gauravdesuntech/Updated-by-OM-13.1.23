import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { getPriority } from "../../../utils/api";
import { showError } from "../../../actions/Error";
import { FlatList } from "react-native-web";
import colors from "../../../config/colors";
import { Colors } from "../../../config";
import CachedImage from "expo-cached-image";

const critical = require("../../../assets/tasks/Critical.png");
const danger = require("../../../assets/tasks/Danger.png");
const low = require("../../../assets/tasks/Low.png");
const moderate = require("../../../assets/tasks/Moderate.png");
const high = require("../../../assets/tasks/High.png");

class Priority extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priority: [],
      selected: "",
    };
  }

  componentDidMount() {
    if (this.props.priority) {
      this.setState({
        selected: this.props.priority,
      });
    }
    this.getPriority();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.priority) {
      this.setState({
        selected: nextProps.priority,
      });
    }
  }

  getPriority = () => {
    getPriority()
      .then((response) => {
        const sources = response.data;
        let priority = sources.data.map((a) => {
          let image = critical;
          if (a.name === "Critical") {
            image = critical;
          } else if (a.name === "Danger") {
            image = danger;
          } else if (a.name === "Low") {
            image = low;
          } else if (a.name === "Moderate") {
            image = moderate;
          } else if (a.name === "High") {
            image = high;
          }
          return {
            color: "transparent",
            text: a.name,
            image: image,
            id: a.id,
          };
        });
        this.setState({
          priority: priority,
        });
      })
      .catch((error) => {
        console.log(error);
        showError(error);
      });
  };

  onPress = (value) => {
    this.setState(
      {
        selected: value,
      },
      () => {
        this.props.onPress(this.state.selected);
      }
    );
  };

  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView horizontal={true}>
          {this.state.priority.map((value, key) => {
            let color = value.color;
            if (value.text === this.state.selected) {
              color = colors.primary;
            }
            return (
              <TouchableOpacity
                key={value.id}
                onPress={() => this.onPress(value.text)}
                style={[styles.selectWrapper, { borderColor: color }]}
              >
                <Image source={value.image} style={styles.img} />
                {/* <Image source={value.image} style={styles.img} /> */}
                <Text
                  style={[
                    { color: Colors.textColor },
                    Platform.OS === "ios" && { fontSize: 15 },
                  ]}
                >
                  {value.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
export default Priority;

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    // paddingHorizontal: 30,
    paddingVertical: 2,
    borderRadius: 3,
    width: "100%",
    marginTop: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  selectWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  img: {
    resizeMode: "contain",
    height: Platform.OS === "ios" ? 30 : 25,
    width: Platform.OS === "ios" ? 30 : 25,
    marginBottom: 5,
  },
});
