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
import { manageFeedFactor } from "../../../services/KitchenServices";

export default class AddFeedingFactors extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      types: [],
      status_list :[
        {id: "yes" , item: "Yes"},
        {id: "no" , item: "No"},
      ],
      showLoader: false,
      factor_name : props.route.params?.item?.factor_name ?? "",
      details : props.route.params?.item?.details ?? "",
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {};

  gotoBack = () => this.props.navigation.goBack();

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  addFeedFactor = () => {
    this.setState({showLoader:true})
    let obj={
      id : this.state.id,
      factor_name : this.state.factor_name,
      details : this.state.details,
    }
    manageFeedFactor(obj).then((res)=>{
      this.setState({showLoader:false},()=>{
        alert("Successfully Done");
        this.gotoBack();
      })
    }).catch((err)=>{console.log(err);this.setState({showLoader:false})})
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={parseInt(this.state.id) > 0 ? "Edit FeedingFactor" : "Add FeedingFactor"}
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
              <Text style={globalStyles.labelName}>
              Factor Name
              </Text>
              <TextInput
                value={this.state.factor_name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(factor_name) => this.setState({ factor_name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
          <View style={[globalStyles.fieldBox,globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>Details</Text>
              <TextInput
                value={this.state.details}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(details) => this.setState({ details })}
                autoCompleteType="off"
                autoCapitalize="words"
                multiline={true}
              />
            </View>
            
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addFeedFactor}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}