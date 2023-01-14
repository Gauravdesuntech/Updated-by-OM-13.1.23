import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import Header from "../../../component/Header";
import OverlayLoader from "../../../component/OverlayLoader";
import { Colors } from "../../../config";
import { addTagName } from "../../../services/MedicalAndIncidenTServices";
import AppContext from "../../../context/AppContext";
import globalStyles from "../../../config/Styles";
import { MultiSelectDropdown } from "../../../component";
import moment from "moment";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { managefeedmealslot } from "../../../services/KitchenServices";

export default class AddMealSlots extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      tag: props.route.params?.item?.tag ?? "",
      types: [],
      status_list: [
        { id: "yes", item: "Yes" },
        { id: "no", item: "No" },
      ],
      showLoader: false,
      slot_name: props.route.params?.item?.slot_name ?? "",
      show: false,
      showheader: false,
      type:'',
      start_time: props.route.params?.item?.start_time ? props.route.params?.item?.start_time  :moment(new Date()).format("HH:mm:ss"),
      end_time: props.route.params?.item?.end_time ? props.route.params?.item?.end_time : moment(new Date()).format("HH:mm:ss"),
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => { };

  gotoBack = () => this.props.navigation.goBack();

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  addMealSlot = () => {
    this.setState({showLoader:true})
  let obj={
    id : this.state.id,
    slot_name : this.state.slot_name,
    start_time : this.state.start_time,
    end_time : this.state.end_time,
  }
  managefeedmealslot(obj).then((res)=>{
    this.setState({showLoader:false},()=>{
      alert("Successfully Done");
      this.gotoBack();
    })
  }).catch((err)=>{console.log(err);this.setState({showLoader:false})}) 
};

  showDatePicker = (type) => {
    this.setState({ show: true, type});
  };

  handleConfirm = (selectDate) => {
    let time = moment(selectDate).format("HH:mm:ss");
    this.setState({
      start_time: this.state.type == "start" ? time : this.state.start_time,
      end_time: this.state.type == "end" ? time : this.state.end_time,
    });
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({ show: false });
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={parseInt(this.state.id) > 0 ? "Edit MealSlots" : "Add MealSlots"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View
        style={[globalStyles.container, { padding: Colors.formPaddingHorizontal }]}
      >
        <ScrollView ref={this.formScrollViewRef} showsVerticalScrollIndicator={false}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Name</Text>
              <TextInput
                value={this.state.slot_name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(slot_name) => this.setState({ slot_name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>Start Time </Text>
              <TouchableOpacity
                onPress={() => {
                  this.showDatePicker("start");
                }}
                style={[globalStyles.justifyContentCenter,globalStyles.width60]}
              >
                <Text style={[globalStyles.textfield]}>
                  {moment(this.state.start_time, "HH:mm:ss").format("LT")}{" "}
                  <MaterialCommunityIcons
                    slot_name="clock-check-outline"
                    size={20}
                    color={Colors.green}
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={globalStyles.fieldBox}>
              <Text style={globalStyles.labelName}>End Time </Text>
              <TouchableOpacity
                onPress={() => {
                  this.showDatePicker("end");
                }}
                style={[globalStyles.justifyContentCenter,globalStyles.width60]}
              >
                <Text style={[globalStyles.textfield]}>
                  {moment(this.state.end_time, "HH:mm:ss").format("LT")}{" "}
                  <MaterialCommunityIcons
                    slot_name="clock-check-outline"
                    size={20}
                    color={Colors.green}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addMealSlot}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <DateTimePickerModal
          mode="time"
          display={Platform.OS == "ios" ? "inline" : "default"}
          isVisible={this.state.show}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
    </Container>
  );
}