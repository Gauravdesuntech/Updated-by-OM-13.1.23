import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Theme from "../../Theme";
import Configs from "../../config/Configs";
import { Colors } from "../../config";
import globalStyles from "../../config/Styles";
const coin1 = require("../../assets/tasks/coin_1.png");

class CatItemCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.approval || this.props.on_click
            ? null
            : this.props.navigation.push("ViewItem", {
                id: this.props.id,
                category_id: this.props.category_id,
              });
        }}
        style={[styles.container, this.props.item.selectedClass]}
        // onLongPress={()=>{this.props.selectItem(this.props.item)}}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* change icon size for major icon here */}

          <View style={{ width: "85%" }}>
            {this.props.incident_type && this.props.category_id == "64" ? (
              <Text style={{ fontSize: 12, opacity: 0.5 }}>
                Incident Type: {this.props.incident_type}
              </Text>
            ) : null}
            <Text
              style={{
                paddingBottom: 2,
                fontSize: 16,
                fontWeight: "bold",
                color: "#7f7f7f",
              }}
            >
              {this.props.title}
            </Text>
            {this.props.category_name ? (
              <Text
                style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}
              >
                Category Name: {this.props.category_name}
              </Text>
            ) : null}
            <Text style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}>
              Due By: {this.props.due_by}
            </Text>
            <Text style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}>
              {this.props.due_time}
            </Text>
            {/* <Text style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}>
              By: {this.props.created}
            </Text>
            <Text style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}>
              To: {this.props.members}
            </Text> */}
            {this.props.created && this.props.members ? (
              <Text
                style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}
              >
                {this.props.created} to {this.props.members}
              </Text>
            ) : null}

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}
              >
                Status:
              </Text>
              {Configs.TASK_STATUS[this.props.status] == "Completed" ? (
                <Text style={{ fontSize: 16, color: Colors.green }}>
                  {Configs.TASK_STATUS[this.props.status]}
                </Text>
              ) : (
                <Text
                  style={{ paddingBottom: 2, fontSize: 16, color: "#7f7f7f" }}
                >
                  {Configs.TASK_STATUS[this.props.status]}
                </Text>
              )}
            </View>
            {Configs.TASK_STATUS[this.props.status] == "Pending" ? null : (
              <>
                {this.props.closed_date == "" ? null : (
                  <>
                    <Text
                      style={{
                        paddingBottom: 2,
                        fontSize: 16,
                        color: "#7f7f7f",
                      }}
                    >
                      Completed Date: {this.props.closed_date}
                    </Text>
                    <Text
                      style={{
                        paddingBottom: 2,
                        fontSize: 16,
                        color: "#7f7f7f",
                      }}
                    >
                      Completed by: {this.props.closed}
                    </Text>
                  </>
                )}
              </>
            )}
            {/* <View style={[globalStyles.mt10, globalStyles.flexDirectionRow]}>
              {this.props?.photos &&
                this.props?.photos.map((item) => {
                  return (
                    <Image
                      source={{ uri: item }}
                      resizeMode="contain"
                      style={{ height: 50, width: 50, margin: 10 }}
                    />
                  );
                })}
            </View> */}

            {this.props?.photos ? (
              <View style={[globalStyles.mt10, globalStyles.flexDirectionRow]}>
                {this.props?.photos.map((item) => {
                  return (
                    <Image
                      source={{ uri: Configs.IMAGE_URL + item }}
                      resizeMode="contain"
                      style={{ height: 50, width: 50, margin: 10 }}
                    />
                  );
                })}
              </View>
            ) : null}

            {this.props.approval ? (
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.action(this.props.id, "rejected");
                  }}
                  style={{
                    width: "30%",
                    alignItems: "center",
                    marginHorizontal: 10,
                    justifyContent: "center",
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    borderRadius: 3,
                    backgroundColor: Colors.danger,
                  }}
                >
                  <Text style={{ fontSize: 10, color: Colors.white }}>
                    Reject
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.action(this.props.id, "approved");
                  }}
                  style={{
                    width: "30%",
                    alignItems: "center",
                    marginHorizontal: 10,
                    justifyContent: "center",
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    borderRadius: 3,
                    backgroundColor: Colors.primary,
                  }}
                >
                  <Text style={{ fontSize: 10, color: Colors.white }}>
                    Approve
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

        <View>
          <Image
            source={this.props.priority}
            style={{ height: 35, width: 35, resizeMode: "contain" }}
          />
          {/* <View
            style={{ alignItems: "center", paddingRight: 10, paddingTop: 5 }}
          >
            /* change icon size in image style 
            <Image
              source={coin1}
              style={{
                marginBottom: 5,
                height: 35,
                width: 35,
                resizeMode: "contain",
              }}
            />
            <Text style={{ fontSize: 12, opacity: 0.5 }}>
              {this.props.coins}
            </Text>
            <Text style={{ fontSize: 11, opacity: 0.5 }}>Coins</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  }
}
export default CatItemCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
    borderBottomColor: "#e5e5e5",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
