import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import Header from "../../component/Header";
import ModalMenu from "../../component/ModalMenu";
import OverlayLoader from "../../component/OverlayLoader";
import { getAnimalFoods, getAnimalMealSlots, getUnits, saveAnimalFeedingAssignment, getAnimalAssignFoodDetails } from "../../services/APIServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class FeedingAssignmentRecordEntry extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            showLoader: true,
            foodsArr: [],
            slotsArr: [],
            unitsArr: [],
            id: typeof this.props.route.params !== "undefined" ? this.props.route.params.id : 0,
            foodID: undefined,
            foodName: undefined,
            slotID: undefined,
            slotName: undefined,
            quantity: undefined,
            unitID: undefined,
            unitName: undefined,
            description: '',
            isFoodMenuOpen: false,
            isMealSlotMenuOpen: false,
            isUnitMenuOpen: false,
            foodValidationFailed: false,
            mealSlotValidationFailed: false,
            quantityValidationFailed: false,
            unitValidationFailed: false,
            descriptionValidationFailed: false,
        };

        this.scrollViewRef = React.createRef();
    }

    componentDidMount = () => {
        let { id } = this.state;

        getAnimalFoods().then(foods => {
            this.setState({ foodsArr: foods });

            getAnimalMealSlots().then(slots => {
                this.setState({ slotsArr: slots });

                getUnits().then(units => {
                    this.setState({
                        unitsArr: units,
                        showLoader: parseInt(id) > 0 ? true : false
                    }, () => {
                        if (parseInt(id) > 0) {
                            getAnimalAssignFoodDetails(id).then(data => {
                                this.setState({
                                    foodID: data.food_id,
                                    foodName: data.food_name,
                                    slotID: data.slot_id,
                                    slotName: data.slot_name,
                                    quantity: data.qty,
                                    unitID: data.unit_id,
                                    unitName: data.unit_name,
                                    description: data.description,
                                    showLoader: false,
                                });
                            }).catch(error => console.log(error));
                        }
                    });
                }).catch(error => console.log(error));

            }).catch(error => console.log(error));

        }).catch(error => console.log(error));
    };

    gotoBack = () => this.props.navigation.goBack();

    toggleFoodMenu = () => {
        this.setState({isFoodMenuOpen: !this.state.isFoodMenuOpen});
    };

    toggleMealSlotMenu = () => {
        this.setState({isMealSlotMenuOpen: !this.state.isMealSlotMenuOpen});
    };

    toggleUnitMenu = () => {
        this.setState({isUnitMenuOpen: !this.state.isUnitMenuOpen});
    };

    setFoodData = (v) => {
        this.setState({
            foodID: v.id,
            foodName: v.name,
            isFoodMenuOpen: false
        });
    };

    setMealSlotData = (v) => {
        this.setState({
            slotID: v.id,
            slotName: v.slot_name,
            isMealSlotMenuOpen: false
        });
    };

    setUnitData = (v) => {
        this.setState({
            unitID: v.id,
            unitName: v.unit_name,
            isUnitMenuOpen: false
        });
    };

    scrollViewScrollTop = () => {
        this.scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
    };

    saveData = () => {
        this.setState({
            foodValidationFailed: false,
            mealSlotValidationFailed: false,
            quantityValidationFailed: false,
            unitValidationFailed: false,
            descriptionValidationFailed: false,
        }, () => {
            let { foodID, slotID, quantity, unitID, description } = this.state;

            if(typeof foodID === "undefined"){
                this.setState({foodValidationFailed: true});
                this.scrollViewScrollTop();
            }
            else if(typeof slotID === "undefined"){
                this.setState({mealSlotValidationFailed: true});
                this.scrollViewScrollTop();
            }
            else if(typeof quantity === "undefined" || isNaN(quantity)){
                this.setState({quantityValidationFailed: true});
                this.scrollViewScrollTop();
            }
            else if(typeof unitID === "undefined"){
                this.setState({unitValidationFailed: true});
            }
            else if(description.trim().length === 0){
                this.setState({descriptionValidationFailed: true});
            }
            else {
                this.setState({ showLoader: true });
                let obj = {
                    "id": this.state.id,
                    "animal_code": this.context.selectedAnimalID,
                    "food": foodID,
                    "meal_slot": slotID,
                    "qty": quantity,
                    "unit": unitID,
                    "description": description
                };

                saveAnimalFeedingAssignment(obj).then(response => {
                    let id = response.data.id;
                    let animalFeedingAssignments = this.context.animalFeedingAssignments;
					let index = animalFeedingAssignments.findIndex(
						(element) => element.id === id
                    );
                    
                    let dataObj = {
                        "id": id,
                        "food_name": this.state.foodName,
                        "slot_name": this.state.slotName,
                        "qty": quantity,
                        "unit": this.state.unitName
                    };

					if (index > -1) {
						animalFeedingAssignments[index] = dataObj;
					} else {
						animalFeedingAssignments.unshift(dataObj);
					}

					this.context.setAnimalFeedingAssignments(animalFeedingAssignments);
					this.setState({ showLoader: false });
					this.gotoBack();
                }).catch(error => console.log(error));
            }
        });
    };

    render = () => (
        <Container>
            <Header
                leftIconName={"arrow-back"}
                title={"Feeding Assignment Record Entry"}
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
                            this.state.foodValidationFailed ? styles.errorFieldBox : null
                        ]}
                    >
                        <Text style={styles.labelName}>Food :</Text>
                        <TextInput
                            editable={false}
                            value={this.state.foodName}
                            style={[styles.textfield,{width:'60%'}]}
                            // placeholder="Select Food Name"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.toggleMealSlotMenu}
                        style={[
                            styles.fieldBox,
                            this.state.mealSlotValidationFailed ? styles.errorFieldBox : null
                        ]}
                    >
                        <Text style={styles.labelName}>Meal Slot :</Text>
                        <TextInput
                            editable={false}
                            value={this.state.slotName}
                            style={[styles.textfield,{width:'60%'}]}
                            // placeholder="Select Meal Slot"
                        />
                    </TouchableOpacity>

                    <View
                        style={[
                            styles.fieldBox,
                            this.state.quantityValidationFailed ? styles.errorFieldBox : null
                        ]}
                    >
                        <Text style={styles.labelName}>Quantity :</Text>
                        <TextInput
                            value={this.state.quantity}
                            onChangeText={(quantity) => this.setState({quantity})}
                            style={[styles.textfield,{width:'60%'}]}
                            autoCompleteType="off"
                            keyboardType="numeric"
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.toggleUnitMenu}
                        style={[
                            styles.fieldBox,
                            this.state.unitValidationFailed ? styles.errorFieldBox : null
                        ]}
                    >
                        <Text style={styles.labelName}>Unit :</Text>
                        <TextInput
                            editable={false}
                            value={this.state.unitName}
                            style={[styles.textfield,{width:'60%'}]}
                            // placeholder="Select Unit"
                        />
                    </TouchableOpacity>

                    <View
                        style={[
                            styles.fieldBox,
                            {flexDirection: "row", },
                            this.state.descriptionValidationFailed ? styles.errorFieldBox : null
                        ]}
                    >
                        <Text style={styles.labelName}>Description :</Text>
                        <TextInput
                            multiline={true}
                            // numberOfLines={10}
                            value={this.state.description}
                            onChangeText={(description) => this.setState({ description })}
                            autoCompleteType="off"
                            autoCapitalize="words"
                            style={[styles.textfield,{width:'60%'}]}
                        />
                    </View>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.saveData}
                    >
                        <Text style={styles.textWhite}>Save Details</Text>
                    </TouchableOpacity>
                    </View>
            </ScrollView>
            <ModalMenu
                visible={this.state.isFoodMenuOpen}
                closeAction={this.toggleFoodMenu}
            >
                {
                    this.state.foodsArr.map((v, i) =>  (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.item}
                            onPress={this.setFoodData.bind(this, v)}
                            key={v.id.toString()}
                        >
                            <Text style={styles.itemtitle}>{v.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ModalMenu>
            <ModalMenu
                visible={this.state.isMealSlotMenuOpen}
                closeAction={this.toggleMealSlotMenu}
            >
                {
                    this.state.slotsArr.map((v, i) =>  (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.item}
                            onPress={this.setMealSlotData.bind(this, v)}
                            key={v.id.toString()}
                        >
                            <Text style={styles.itemtitle}>{v.slot_name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ModalMenu>
            <ModalMenu
                visible={this.state.isUnitMenuOpen}
                closeAction={this.toggleUnitMenu}
            >
                {
                    this.state.unitsArr.map((v, i) =>  (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.item}
                            onPress={this.setUnitData.bind(this, v)}
                            key={v.id.toString()}
                        >
                            <Text style={styles.itemtitle}>{v.unit_name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ModalMenu>
            <OverlayLoader visible={this.state.showLoader} />
        </Container>
    );
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 8,
//     },
//     fieldBox: {
//         alignItems: "center",
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderBottomWidth: 1,
//         backgroundColor: "#fff",
//         height: "auto",
//         justifyContent: "space-between",
//     },
//     textfield: {
//         backgroundColor: "#fff",
//         height: "auto",
    
//         fontSize: Colors.textSize,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
//     },
//     labelName: {
//         color: Colors.labelColor,
//         // lineHeight: 40,
//         fontSize: Colors.lableSize,
//         paddingLeft: 4,
//         height: "auto",
//         paddingVertical: 10,
//     },
//     button: {
//       alignItems: "center",
//       backgroundColor: Colors.primary,
//       padding: 10,
//     //   shadowColor: "#000",
//     //   shadowOffset: {
//     //     width: 0,
//     //     height: 2,
//     //   },
//     //   shadowOpacity: 0.23,
//     //   shadowRadius: 2.62,
//     //   elevation: 4,
//       borderRadius: 20,
//       color: "#fff",
//       marginTop: 10,
//     },
//     textWhite: {
//       color: "#fff",
//       fontWeight: "bold",
//       fontSize:Colors.lableSize,
//     },
//     item:{
//         height: 35,
//         backgroundColor: '#00b386',
//         alignItems: "center",
//         justifyContent: "center"
//     },
//     itemtitle:{
//         color: '#fff',
//         textAlign: "center",
//         fontSize: Colors.textSize,
//     },
//     errorFieldBox: {
//       borderWidth: 1,
//       borderColor: Colors.tomato
//     }
// });
