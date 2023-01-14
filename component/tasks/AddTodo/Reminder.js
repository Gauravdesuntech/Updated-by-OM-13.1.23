import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Colors } from "../../../config";
import colors from "../../../config/colors";

const time = require("../../../assets/tasks/Time.png");

class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: [
        { text: "-24 hours" },
        { text: "-2 hours" },
        { text: "+1 hours" },
        { text: "No Reminder" },
      ],
      selected: "",
    };
  }

  componentDidMount() {
    this.setState({
      selected: this.props.reminder,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      selected: nextProps.reminder,
    });
  }

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
      <View style={[styles.wrapper, { marginTop: 1 }]}>
        <ScrollView horizontal={true}>
          {this.state.schedule.map((value, index) => {
            let color = colors.white;
            if (value.text === this.state.selected) {
              color = colors.primary;
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => this.onPress(value.text)}
                style={[styles.selectWrapper, { borderColor: color }]}
              >
                <Image source={time} style={styles.img} />
                <Text
                  style={[
                    { color: Colors.textColor, textAlign: "center" },
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
export default Reminder;

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    // paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 3,
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  selectWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    height: 70,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  img: {
    resizeMode: "contain",
    height: Platform.OS === "ios" ? 30 : 25,
    width: Platform.OS === "ios" ? 30 : 25,
    marginBottom: 5,
  },
});
