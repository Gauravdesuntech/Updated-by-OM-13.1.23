import React from 'react';
import { StyleSheet, ScrollView, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { Container } from "native-base";
import { Header } from "../component";
import Colors from "../config/colors";
import ModalMenu from "../component/ModalMenu";

export default class NutritionalValues extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            feedTypes: [
                {id: "1", name: "Fresh Fruits"},
                {id: "2", name: "Sprut Mix"},
                {id: "3", name: "Veggies"},
                {id: "4", name: "Nuts"},
                {id: "5", name: "Seeds"},
                {id: "6", name: "Grains / Millet"},
                {id: "7", name: "Live Worms"},
                {id: "8", name: "Animal Protein Egg / meat"},
            ],
            servings: [
                {id: "1", name: "Extra Small - XS"},
                {id: "2", name: "Small - S"},
                {id: "3", name: "Medium - M"},
                {id: "4", name: "Large - L"},
                {id: "5", name: "Extra Large XL"},
                {id: "6", name: "XXL"},
                {id: "7", name: "XXXL"},
            ],
            feedType: undefined,
            servingType: undefined,
            isFeedTypeMenuOpen: false,
            isServingMenuOpen: false,
        };
        this.scrollViewRef = React.createRef();
    }

    gotoBack = () => this.props.navigation.goBack();

    toggleFeedTypeMenu = () => this.setState({isFeedTypeMenuOpen: !this.state.isFeedTypeMenuOpen});

    toggleServingMenu = () => this.setState({isServingMenuOpen: !this.state.isServingMenuOpen});

    setFeedType = (name) => this.setState({
        feedType: name,
        isFeedTypeMenuOpen: false
    });

    setServingType = (name) => this.setState({
        servingType: name,
        isServingMenuOpen: false
    });

    render = () => (
        <Container>
            <Header
                leftIconName={"arrow-back"}
                title={"Nutritional Values"}
                leftIconShow={true}
                rightIconShow={false}
                leftButtonFunc={this.gotoBack}
            />
            <ScrollView ref={this.scrollViewRef}>
                <View style={styles.container}>
                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Feed Name :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.toggleFeedTypeMenu}
                        style={[styles.fieldBox]}
                    >
                        <Text style={styles.labelName}>Feed Type :</Text>
                        <TextInput
                            value={this.state.feedType}
                            editable={false}
                            style={styles.textfield}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.toggleServingMenu}
                        style={[styles.fieldBox]}
                    >
                        <Text style={styles.labelName}>Serving :</Text>
                        <TextInput
                            value={this.state.servingType}
                            editable={false}
                            style={styles.textfield}
                        />
                    </TouchableOpacity>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Energy :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Protein :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Fat :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Fiber :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Carbs :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Sugar :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => null}
                    >
                        <Text style={styles.textWhite}>Save Details</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ModalMenu
                visible={this.state.isFeedTypeMenuOpen}
                closeAction={this.toggleFeedTypeMenu}
            >
                {
                    this.state.feedTypes.map((v, i) =>  (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.item}
                            onPress={this.setFeedType.bind(this, v.name)}
                            key={v.id}
                        >
                            <Text style={styles.itemtitle}>{v.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ModalMenu>

            <ModalMenu
                visible={this.state.isServingMenuOpen}
                closeAction={this.toggleServingMenu}
            >
                {
                    this.state.servings.map((v, i) =>  (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.item}
                            onPress={this.setServingType.bind(this, v.name)}
                            key={v.id}
                        >
                            <Text style={styles.itemtitle}>{v.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ModalMenu>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 8,
    },
    fieldBox: {
      width: "100%",
      overflow: "hidden",
      flexDirection: "row",
      padding: 5,
      borderRadius: 3,
      backgroundColor: "#fff",
      height: 50,
      justifyContent: "space-between",
      marginBottom: 5,
      marginTop: 5,
      shadowColor: "#999",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    textfield: {
      backgroundColor: "#fff",
      height: 40,
      
      fontSize: 12,
      color: "#444",
      textAlign: "right",
      width: "60%",
      padding: 5,
    },
    labelName: {
      color: "#333",
      lineHeight: 40,
      fontSize: 14,
      paddingLeft: 4,
    },
    button: {
      alignItems: "center",
      backgroundColor: Colors.primary,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      borderRadius: 20,
      color: "#fff",
      marginTop: 10,
    },
    textWhite: {
      color: "#fff",
      fontWeight: "bold",
    },
    item:{
      height: 35,
      backgroundColor: '#00b386',
      alignItems: "center",
      justifyContent: "center"
    },
    itemtitle:{
      color: '#fff',
      textAlign: "center",
      fontSize: 18,
    },
    errorFieldBox: {
      borderWidth: 1,
      borderColor: Colors.tomato
    }
});