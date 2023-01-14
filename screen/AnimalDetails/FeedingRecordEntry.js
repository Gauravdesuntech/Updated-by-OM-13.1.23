import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import Header from "../../component/Header";
import ModalMenu from "../../component/ModalMenu";
import OverlayLoader from "../../component/OverlayLoader";
import {
  getAnimalFoodsForFeeding,
  saveAnimalFeedingRecord,
  getAnimalFeedingDetails,
} from "../../services/APIServices";
import { getCurrentTime, getDelay } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class FeedingRecordEntry extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      showLoader: true,
      foodsArr: [],
      id:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.id
          : 0,
      feedingAssignmentID: undefined,
      foodName: undefined,
      slotID: undefined,
      slotName: undefined,
      mealSlotName: undefined,
      startTime: undefined,
      endTime: undefined,
      actualTime: getCurrentTime(),
      delay: undefined,
      isFoodMenuOpen: false,
      foodValidationFailed: false,
    };

    this.scrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    let { id } = this.state;
    getAnimalFoodsForFeeding(this.context.selectedAnimalID)
      .then((foods) => {
        this.setState(
          {
            foodsArr: foods,
            showLoader: parseInt(id) > 0 ? true : false,
          },
          () => {
            if (parseInt(id) > 0) {
              getAnimalFeedingDetails(id)
                .then((data) => {
                  this.setState({
                    feedingAssignmentID: data.animals_feeding_assignment_id,
                    foodName: data.food_name,
                    slotID: data.slot_id,
                    slotName: data.slot_name,
                    mealSlotName:
                      data.slot_name +
                      "(" +
                      data.start_time +
                      " - " +
                      data.end_time +
                      ")",
                    startTime: data.start_time,
                    endTime: data.end_time,
                    actualTime: data.actule_time,
                    delay: data.delay,
                    showLoader: false,
                  });
                })
                .catch((error) => console.log(error));
            }
          }
        );
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => this.props.navigation.goBack();

  toggleFoodMenu = () => {
    this.setState({ isFoodMenuOpen: !this.state.isFoodMenuOpen });
  };

  setFoodData = (v) => {
    this.setState({
      foodName: v.food_name,
      feedingAssignmentID: v.id,
      slotID: v.slot_id,
      slotName: v.slot_name,
      mealSlotName: v.slot_name + "(" + v.start_time + " - " + v.end_time + ")",
      startTime: v.start_time,
      endTime: v.end_time,
      actualTime: getCurrentTime(),
      delay: getDelay(v.end_time, this.state.actualTime),
      isFoodMenuOpen: false,
    });
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveData = () => {
    this.setState(
      {
        foodValidationFailed: false,
      },
      () => {
        let { feedingAssignmentID } = this.state;
        if (typeof feedingAssignmentID === "undefined") {
          this.setState({ foodValidationFailed: true });
          this.scrollViewScrollTop();
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            animal_code: this.context.selectedAnimalID,
            animals_feeding_assignment_id: feedingAssignmentID,
            feeding_meal_slot_id: this.state.slotID,
            actule_time: this.state.actualTime,
            delay: this.state.delay,
          };

          saveAnimalFeedingRecord(obj)
            .then((response) => {
              let id = response.data.id;
              let animalFeedings = this.context.animalFeedings;
              let index = animalFeedings.findIndex(
                (element) => element.id === id
              );

              obj.id = id;
              obj.food_name = this.state.foodName;
              obj.slot_name = this.state.slotName;
              obj.start_time = this.state.startTime;
              obj.end_time = this.state.endTime;

              delete obj.animal_code;
              delete obj.animals_feeding_assignment_id;
              delete obj.feeding_meal_slot_id;

              if (index > -1) {
                animalFeedings[index] = obj;
              } else {
                animalFeedings.unshift(obj);
              }

              this.context.setAnimalFeedingsData(animalFeedings);
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((error) => console.log(error));
        }
      }
    );
  };

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        title={"Feeding Record Entry"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <ScrollView ref={this.scrollViewRef}>
        <View style={styles.container}>
		<View
            style={styles.formBorder}
          >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleFoodMenu}
            style={[
              styles.fieldBox,
              this.state.foodValidationFailed ? styles.errorFieldBox : null,
            ]}
          >
            <Text style={styles.labelName}>Food:</Text>
            <TextInput
              editable={false}
              value={this.state.foodName}
			  style={[styles.textfield,{width:'60%'}]}
              // // placeholder="Select Food Name"
            />
          </TouchableOpacity>

          <View style={styles.fieldBox}>
            <Text style={styles.labelName}>Meal Slot:</Text>
            <TextInput
              editable={false}
              value={this.state.mealSlotName}
			  style={[styles.textfield,{width:'60%'}]}
            />
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.labelName}>Actual Time:</Text>
            <TextInput
              editable={false}
              value={this.state.actualTime}
			  style={[styles.textfield,{width:'60%'}]}
            />
          </View>

          <View style={[styles.fieldBox,{borderBottomWidth:0}]}>
            <Text style={styles.labelName}>Delay:</Text>
            <TextInput
              editable={false}
              value={this.state.delay}
              style={[styles.textfield,{width:'60%'}]}
            />
          </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.saveData}>
            <Text style={styles.textWhite}>Save Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ModalMenu
        visible={this.state.isFoodMenuOpen}
        closeAction={this.toggleFoodMenu}
      >
        {this.state.foodsArr.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setFoodData.bind(this, v)}
            key={v.id.toString()}
          >
            <Text style={styles.itemtitle}>{v.food_name}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 8,
//   },
//   fieldBox: {
// 	alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderBottomWidth: 1,
//     backgroundColor: "#fff",
//     height: "auto",
//     justifyContent: "space-between",
//   },
//   textfield: {
//     backgroundColor: "#fff",
//     height: "auto",

//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   labelName: {
//     color: Colors.labelColor,
//     // lineHeight: 40,
//     fontSize: Colors.lableSize,
//     paddingLeft: 4,
//     height: "auto",
//     paddingVertical: 10,
//   },
//   button: {
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     padding: 10,
//     // shadowColor: "#000",
//     // shadowOffset: {
//     //   width: 0,
//     //   height: 2,
//     // },
//     // shadowOpacity: 0.23,
//     // shadowRadius: 2.62,
//     // elevation: 4,
//     borderRadius: 20,
//     color: "#fff",
//     marginTop: 10,
//   },
//   textWhite: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize:Colors.lableSize,
//   },
//   item: {
//     height: 35,
//     backgroundColor: "#00b386",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   itemtitle: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: Colors.textSize,
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
// });
