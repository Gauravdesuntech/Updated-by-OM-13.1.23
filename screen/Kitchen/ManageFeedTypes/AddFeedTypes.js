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
import { Ionicons ,MaterialIcons } from "@expo/vector-icons";
import Header from "../../../component/Header";
import OverlayLoader from "../../../component/OverlayLoader";
import { Colors } from "../../../config";
import * as ImagePicker from "expo-image-picker";
import { addTagName } from "../../../services/MedicalAndIncidenTServices";
import AppContext from "../../../context/AppContext";
import globalStyles from "../../../config/Styles";
import { MultiSelectDropdown } from "../../../component";
import {TriangleColorPicker, toHsv } from 'react-native-color-picker'
import Upload from "../../../component/tasks/AddTodo/Upload";
import colors from "../../../config/colors";
import { getFileData } from "../../../utils/Util";
import { managefeedtype } from "../../../services/KitchenServices";
import Styles from '../Style'

export default class AddFeedTypes extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      types: [],
      status_list: [
        { id: "yes", item: "Yes" },
        { id: "no", item: "No" },
      ],
      showLoader: false,
      feed_type_name: props.route.params?.item?.feed_type_name ?? "",
      iconURI : props.route.params?.item?.feed_icon ?? undefined,
      color: props.route.params?.item?.color ? props.route.params?.item?.color : colors.primary,
      rgb : props.route.params?.item?.color ?? null,
      isColorPickeropen : false,
      iconData: undefined,
    };
    this.onColorChange = this.onColorChange.bind(this)
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

    setSelectedIcon = (item) => {
      this.setState({ selectedIcon: item });
    };

    onColorChange(color) {
      let hex = this.hsv2rgb(color.h,color.s,color.v)
      // console.log("ghjgkjhg?>>>>>>>>>",rgb);
      this.setState({color : hex})
    }

    mix(a, b, v)
{
    return (1-v)*a + v*b;
}

componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

  hsv2rgb(H, S, V)
  {
      var V2 = V * (1 - S);
      var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? this.mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? this.mix(V2,V,(H-240)/60) : 0)));
      var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? this.mix(V2,V,H/60) : ((H>=180 && H<=240) ? this.mix(V,V2,(H-180)/60) : 0)));
      var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? this.mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? this.mix(V,V2,(H-300)/60) : 0)));
  
      // return {
      //     r : Math.round(r * 255),
      //     g : Math.round(g * 255),
      //     b : Math.round(b * 255)
      // };
      return "#" + this.componentToHex(Math.round(r * 255)) + this.componentToHex(Math.round(g * 255)) + this.componentToHex(Math.round(b * 255));
  }

  chooseTagIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          // aspect: [17, 4],
          // quality: 0.8,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              iconURI: result.uri,
              iconData: getFileData(result),
            });
          }
        });
      } else {
        alert("Please allow permission to choose cover image");
      }
    });
  };

  toogleColorPicker=()=>{
    this.setState({isColorPickeropen : !this.state.isColorPickeropen})
  }
  

  addFeedType = () => {
    this.setState(
      {
        showLoader: true,
      },
      () => {
        let obj = {
          feed_type_name: this.state.feed_type_name,
          color: this.state.color,
          id: this.state.id,
        };
        if (typeof this.state.iconData !== "undefined") {
          obj.feed_icon = this.state.iconData;
        }

        managefeedtype(obj)
          .then((response) => {
            console.log(response);
            this.setState({
              showLoader: false,
            });
            Alert.alert(
              this.state.id === 0
                ? "Successfully created"
                : "Successfully updated"
            );
            this.gotoBack();
          })
          .catch((error) => console.log(error));
      }
    );
   };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={parseInt(this.state.id) > 0 ? "Edit FeedTypes" : "Add FeedTypes"}
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
              Feed Type
              </Text>
              <TextInput
                value={this.state.feed_type_name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(feed_type_name) => this.setState({ feed_type_name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>Color</Text>
              <TouchableOpacity style=
              { [ globalStyles.justifyContentCenter, Styles.borderColor,globalStyles.borderWidth1,
              { 
                backgroundColor:this.state.color == null ? colors.primary : this.state.color ,
               height:50,
               width:50 ,  
               }]} 
               onPress={this.toogleColorPicker}>
              <MaterialIcons name="colorize" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={[globalStyles.fieldBox,globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>
              Icon
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                // style={globalStyles.imageContainer}
                onPress={this.chooseTagIcon}
              >
                {typeof this.state.iconURI !== "undefined" ? (
                  <Image
                    style={Styles.uploadedImage}
                    source={{ uri: this.state.iconURI }}
                  />
                ) : (
                  <Ionicons name="image" size={35} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addFeedType}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {this.state.isColorPickeropen ? 
      <View style={[globalStyles.flex1,{ padding: 45}]}>
        <View style={[globalStyles.flexDirectionRow,globalStyles.justifyContentCenter,globalStyles.alignItemsCenter]}>
        <Text style={globalStyles.labelName}>Pick any Color</Text>
        <TouchableOpacity
              style={globalStyles.closeButton}
              onPress={this.toogleColorPicker}
            >
              <Ionicons name="close-outline" style={globalStyles.closeButtonText} />
        </TouchableOpacity>
        </View>
        <TriangleColorPicker
          oldColor={this.props.route.params?.item?.color ? this.props.route.params?.item?.color : colors.primary}
          color={this.state.color}
          onColorChange={this.onColorChange}
          onColorSelected={color => alert(`Color selected: ${color}`)}
          onOldColorSelected={color => alert(`Old color selected: ${color}`)}
          style={globalStyles.flex1}
        />
      </View>
      : null}
    </Container>
  );
}