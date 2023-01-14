import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }
  componentDidMount() {
    this.setState({
      items: this.props.items,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      items: nextProps.items == null ? [] : nextProps.items,
    });
  }

  _pickDocument = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          this.props.type === "document"
            ? ImagePicker.MediaTypeOptions.All
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        base64: true,
        max: 3,
      });
      if (!result.cancelled) {
        let items = this.state.items;

        if (this.props.singleUpload) {
          items = {
            image: result.uri,
            type: result.type,
            imagebase64: result.base64,
          };
        } else {
          items.push({
            image: result.uri,
            type: result.type,
            imagebase64: result.base64,
          });
        }

        this.setState(
          {
            image: result.uri,
            imagebase64: result.base64,
            items: items,
            type: result.type,
          },
          () => {
            this.props.onChange(this.state.items);
          }
        );
      }
    } catch (E) {
      console.log(E, "E");
    }
  };

  render() {
    return (
      <View
        style={[
          styles.wrapper,
          this.props.topBorder ? { borderTopWidth: 0 } : null,
        ]}
      >
        <ScrollView horizontal={true}>
          <ScrollView horizontal={true}>
            {this.state.items &&
            Array.isArray(this.state.items) &&
            this.state.items.length > 0
              ? this.state.items.map((value, index) => {
                  return (
                    <Image
                      key={index}
                      source={{ uri: value.image }}
                      style={styles.sampleDoc}
                    />
                  );
                })
              : this.state.items &&
                !Array.isArray(this.state.items) && (
                  <Image
                    source={{ uri: this.state.image }}
                    style={styles.sampleDoc}
                  />
                )}
          </ScrollView>
          {this.props.uploadable === true ? (
            <TouchableOpacity
              onPress={this._pickDocument}
              style={styles.uploadcontainer}
            >
              <Ionicons name="ios-add" size={45} />
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
export default Upload;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    height: 90,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  img: { resizeMode: "contain", height: 55, width: 55, marginBottom: 5 },
  uploadcontainer: {
    height: 70,
    width: 70,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sampleDoc: {
    height: 70,
    width: 70,
    resizeMode: "contain",
    marginRight: 5,
  },
});
