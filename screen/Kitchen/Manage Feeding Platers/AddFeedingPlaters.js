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
import AppContext from "../../../context/AppContext";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../../../config/Styles";
import { MultiSelectDropdown } from "../../../component";
import Upload from "../../../component/tasks/AddTodo/Upload";
import { getFileData } from "../../../utils/Util";
import { managefeedplaters } from "../../../services/KitchenServices";

export default class AddFeedingPlaters extends React.Component {
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
      platers_name : props.route.params?.item?.platers_name ?? "",
      iconURI : props.route.params?.item?.icon ?? undefined,
      iconData: undefined,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    console.log(this.props.route.params?.item?.icon);
  };

  gotoBack = () => this.props.navigation.goBack();

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

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

    setSelectedIcon = (item) => {
      this.setState({ selectedIcon: item });
    };

    addPlaters = () => {
      this.setState(
        {
          showLoader: true,
        },
        () => {
          let obj = {
            platers_name: this.state.platers_name,
            id: this.state.id,
          };
          if (typeof this.state.iconData !== "undefined") {
            obj.icon = this.state.iconData;
          }
  
          managefeedplaters(obj)
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
        title={parseInt(this.state.id) > 0 ? "Edit FeedingPlaters" : "Add FeedingPlaters"}
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
              <Text style={globalStyles.labelName}>Platers Name</Text>
              <TextInput
                value={this.state.platers_name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(platers_name) => this.setState({ platers_name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
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
                   // style={{ width: 35, height: 35 }}
                    source={{ uri: this.state.iconURI }}
                  />
                ) : (
                  <Ionicons name="image" size={35} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addPlaters}>
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