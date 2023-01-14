import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import Header from "../../component/Header";
import OverlayLoader from "../../component/OverlayLoader";
//import { Colors } from "../../config";
import { manageTagGroup } from "../../services/TagServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddTagGroup extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      tagGroupName: props.route.params?.item?.name ?? "",
      tagGroupNameError: false,
      isLoading: false,
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

  addTagGroup = () => {
    let cid = this.context.userDetails.cid;

    if (this.state.tagGroupName.trim().length === 0) {
      this.setState({
        tagGroupNameError: true,
      });

      return;
    }

    this.setState(
      {
        isLoading: true,
      },
      () => {
        manageTagGroup({
          cid,
          name: getCapitalizeTextWithoutExtraSpaces(this.state.tagGroupName),
          id: this.state.id !== 0 ? this.state.id : undefined,
        })
          .then((response) => {
            this.setState({
              isLoading: false,
              tagGroupNameError: false,
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
      <OverlayLoader visible={this.state.isLoading} />
      <Header
        leftIconName={"arrow-back"}
        title={this.state.id === 0 ? "Add Tag Group" : "Edit Tag Group"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View
        //style={[styles.container, { padding: Colors.formPaddingHorizontal }]}
      >
        <ScrollView ref={this.formScrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}> Group Name </Text>
              <TextInput
                value={this.state.tagGroupName}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(tagGroupName) => this.setState({ tagGroupName })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
              {this.state.tagGroupNameError ? (
                <Text style={globalStyles.errorText}>Enter tag group name</Text>
              ) : null}
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addTagGroup}>
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
