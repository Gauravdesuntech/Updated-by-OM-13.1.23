import React, { Component } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TaskType from "./TaskType";
import DialogInput from "react-native-dialog-input";
import { showError } from "../../../actions/Error";
import { getAssignLevel } from "../../../utils/api";
import colors from "../../../config/colors";
import { Colors } from "../../../config";

class AssignLevel1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskType: "",
      assign: [],
      selected: [],
      selected_id: [],
    };
  }

  componentDidMount() {
    this.setState({
      taskType: this.props.taskType,
      selected: this.props.selected,
    });
    this.getAssignLevel();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      taskType: nextProps.taskType,
      selected: nextProps.selected,
    });
  }

  getAssignLevel = () => {
    getAssignLevel(1)
      .then((response) => {
        const sources = response.data;
        let assign = sources.data.map((a) => {
          return {
            color: "transparent",
            text: a.full_name,
            id: a.id,
          };
        });
        this.setState({
          assign: assign,
        });
      })
      .catch((error) => showError(error));
  };

  render() {
    return (
      <React.Fragment>
        {/* task type */}
        <TaskType
          selected={this.state.taskType}
          onPress={(text) => {
            this.props.onTaskChange(text);
          }}
        />
        {/* <Text style={styles.placeholder}>Assign</Text>
                <Assign
                    taskType={this.state.taskType}
                    assign={this.state.assign}
                    selected={this.state.selected}
                    selected_id={this.state.selected_id}
                    icon={this.props.icon}
                    onPress={(text, id) => {
                        this.props.onAssignChange(text, id)
                    }}
                /> */}
      </React.Fragment>
    );
  }
}

export const Assign = (props) => {
  const [icon] = React.useState(props.icon);
  const [customText, setCustomText] = React.useState("");
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  console.log(props);
  const onPress = (value, type) => {
    let selected = props.selected;
    let selected_id = props.selected_id;
    if (props.taskType === "Individual") {
      selected = [value.text];
      selected_id = [value.id];
    } else {
      selected.push(value.text);
      selected_id.push(value.id);
    }
    props.onPress(selected, selected_id);
    setIsDialogVisible(false);
    if (type === "custom") {
      setCustomText(value);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal={true}>
        {props.assign.map((value, index) => {
          let color = value.color;
          let selected = props.selected.find((a) => a === value.text);
          if (value.text === selected) {
            color = colors.primary;
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPress(value)}
              style={[styles.selectWrapper, { borderColor: color }]}
            >
              <Image source={icon} style={styles.img} />
              <Text style={{ fontSize: 25 }}>{value.text}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          onPress={() => setIsDialogVisible(true)}
          style={[styles.selectWrapper, { borderColor: "transparent" }]}
        >
          <Image source={icon} style={styles.img} />
          <TextInput
            style={{
              fontSize: 12,
              borderBottomWidth: 1,
              borderColor: "#e5e5e5",
            }}
            placeholder={"CUSTOM"}
            value={customText}
          />
        </TouchableOpacity>
        <DialogInput
          isDialogVisible={isDialogVisible}
          title={"Enter Assign Name"}
          message={"Name"}
          hintInput={"Enter Assign Name"}
          submitInput={(inputText) => {
            onPress(inputText, "custom");
          }}
          closeDialog={() => {
            setIsDialogVisible(false);
          }}
        ></DialogInput>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: { fontSize: 17 - 1, marginTop: 1, color: "#7f7f7f" },
  wrapper: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    width: "100%",
    // marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    height: 90,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  img: { resizeMode: "contain", height: 25, width: 25, marginBottom: 5 },
  name: {
    fontSize: 16,
    color: Colors.textColor,
    marginVertical: 5,
  },
});

export default AssignLevel1;
