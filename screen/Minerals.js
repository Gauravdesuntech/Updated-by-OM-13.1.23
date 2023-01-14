import React from 'react';
import { StyleSheet, ScrollView, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { Container } from "native-base";
import { Header } from "../component";
import Colors from "../config/colors";
import globalStyles from "../config/Styles";
import styles from './Styles'

export default class Minerals extends React.Component {

    constructor(props){
        super(props);
        this.scrollViewRef = React.createRef();
    }

    gotoBack = () => this.props.navigation.goBack();

    render = () => (
        <Container>
            <Header
                leftIconName={"arrow-back"}
                title={"Minerals"}
                leftIconShow={true}
                rightIconShow={false}
                leftButtonFunc={this.gotoBack}
            />
            <ScrollView ref={this.scrollViewRef}>
                <View style={styles.container}>
                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Calcium :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Iron :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Potassium :</Text>
                        <TextInput
                            style={styles.textfield}
                            placeholder=""
                        />
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.labelName}>Sodium :</Text>
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
        </Container>
    );
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 8,
//     },
//     fieldBox: {
//       width: "100%",
//       overflow: "hidden",
//       flexDirection: "row",
//       padding: 5,
//       borderRadius: 3,
//       backgroundColor: "#fff",
//       height: 50,
//       justifyContent: "space-between",
//       marginBottom: 5,
//       marginTop: 5,
//       shadowColor: "#999",
//       shadowOffset: {
//         width: 0,
//         height: 1,
//       },
//       shadowOpacity: 0.22,
//       shadowRadius: 2.22,
//       elevation: 3,
//     },
//     textfield: {
//       backgroundColor: "#fff",
//       height: 40,
      
//       fontSize: 12,
//       color: "#444",
//       textAlign: "right",
//       width: "60%",
//       padding: 5,
//     },
//     labelName: {
//       color: "#333",
//       lineHeight: 40,
//       fontSize: 14,
//       paddingLeft: 4,
//     },
//     button: {
//       alignItems: "center",
//       backgroundColor: Colors.primary,
//       padding: 10,
//       shadowColor: "#000",
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.23,
//       shadowRadius: 2.62,
//       elevation: 4,
//       borderRadius: 20,
//       color: "#fff",
//       marginTop: 10,
//     },
//     textWhite: {
//       color: "#fff",
//       fontWeight: "bold",
//     },
//     errorFieldBox: {
//       borderWidth: 1,
//       borderColor: Colors.tomato
//     }
// });