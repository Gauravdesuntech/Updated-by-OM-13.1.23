import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Image,
  Alert
} from "react-native";
import { Header } from "../component";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import globalStyles from "../config/Styles";
import styles from './Styles'

export default class FeedingReport extends React.Component {

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render = () => (
        <Container>
            <Header
                leftIconName={"menu"}
                title={"Feeding Report"}
                leftIconShow={true}
                leftButtonFunc={this.toggleDrawer}
                rightIconShow={false}
            />

            <View style={styles.container}>
                <View style={styles.feedBoxfull}>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Date</Text>
                    </View>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Schedule Time</Text>
                    </View>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Actual Time</Text>
                    </View>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Delay</Text>
                    </View>
                </View>

                <View style={styles.feedBoxfull}>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Meal 1</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>8:00 am</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>9.00 am</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>-1:00</Text>
                    </View>
                </View>

                <View style={styles.feedBoxfull}>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Meal 2</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>1:00 pm</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>3.00 pm</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.textRed}>-2:00</Text>
                    </View>
                </View>

                <View style={styles.feedBoxfull}>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Meal 3</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>5:00 pm</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>6.00 pm</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>-1:00</Text>
                    </View>
                </View>

                <View style={styles.feedBoxfull}>
                    <View style={styles.feedBox}>
                        <Text style={styles.feedfield}>Meal 3</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>9:00 pm</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>9.00 pm</Text>
                    </View>
                    <View style={styles.feedBoxTime}>
                        <Text style={styles.feedfield}>0:00</Text>
                    </View>
                </View>
            </View>
        </Container>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         padding: 8
//     },
//     feedBoxfull:{
//         flexDirection:"row",
//     },
//     feedBox:{
//         justifyContent:"center",
//         alignItems: 'center',
//         height: 50,
//         width:"22%",
//         padding:5,
//         borderRadius:6,
//         borderColor:"#ddd",
//         borderWidth:1,
//         backgroundColor:"#EFF0E8",
//         lineHeight:50,
//         marginBottom:5,
//         textAlign:"center",
//         marginTop:5,
//         marginLeft:5,
//         marginRight:5,
//         shadowColor: "#999",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.22,
//         shadowRadius: 2.22,
//         elevation: 3,
//     },
//     feedBoxTime:{
//         justifyContent:"center",
//         alignItems: 'center',
//         height: 50,
//         width:"22%",
//         padding:5,
//         borderRadius:6,
//         borderColor:"#ddd",
//         borderWidth:1,
//         backgroundColor:"#fff",
//         lineHeight:50,
//         marginBottom:5,
//         textAlign:"center",
//         marginTop:5,
//         marginLeft:5,
//         marginRight:5,
//         shadowColor: "#999",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.22,
//         shadowRadius: 2.22,
//         elevation: 3,
//     },
//     feedfield: {
//         textAlign: "center",
//         color: "#555"
//     },
//     textRed:{
//         textAlign: "center",
//         color: Colors.tomato,
//     },
// });