import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    TouchableHighlight,
    TextInput
} from "react-native";
import Colors from "../config/colors";
import { Container } from "native-base";
import { Header } from "../component";
import moment from 'moment';
import globalStyles from "../config/Styles";
import styles from './Styles'

function Attendence2({route,navigation}) {

    let userImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&usqp=CAU"

    const [image, setImage] = useState(null)

    useEffect(() => {
        setImage(route.params.paramKey[4])
    },[])

    return (
        
        <>
            <Container>
                <Header title={"Attendance"} />
                <View>
                    <TouchableOpacity style={styles.button} onPress={()=>{navigation.goBack()}}>

                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                <TouchableHighlight onPress={() => {() => setUrli(userImage)}}>
                    <Image
                        style={styles.image}
                        source={{ uri: image? image : userImage }}
                    />
                </TouchableHighlight>
                    <Text style={styles.name}>Subhas Gounder</Text>
                </View>

                <View style={styles.inputBox}>
                    <Text
                        style={[styles.input, { color: "#808080" }]}
                    >Date :</Text>
                    <Text
                        style={[styles.input, { color: "#808080" }]}
                    >In :</Text>

                    <Text
                        style={[styles.input, { color: "#808080" }]}
                    >Out :</Text>

                    <Text
                        style={[styles.input, { color: "#808080" }]}
                    >Hours :</Text>
                </View>

                <View style={styles.inputBox}>
                    <Text
                        style={styles.input}
                    >{moment(route.params.paramKey[0]).format('DD-MM-YY')}</Text>
                    <Text
                        style={styles.input}
                    >{moment(route.params.paramKey[1]).format('LT')}</Text>

                    <Text
                        style={styles.input}
                    >{moment(route.params.paramKey[2]).format('LT')}</Text>

                    <Text
                        style={styles.input}
                    >{
                    
                    
                        route.params.paramKey[3]<=0?
                            <Text
                            style={styles.inputHours}
                            />:
                            <Text
                            style={styles.inputHours}
                        >{route.params.paramKey[3]} Hours</Text>
                    
                    }
                    
                    </Text>
                </View>

            </Container>
        </>
    )
}

export default Attendence2


const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;

// const styles = StyleSheet.create({
//     container: {
//         // flex: 1,
//         backgroundColor: "#fff",
//         textAlign: "center",
//         alignItems: "center",
//         marginTop: 40,
//         marginBottom: 40
//     },

//     button: {
//         backgroundColor: Colors.blueBg,
//         borderColor:Colors.blueBg,
//         borderWidth: 2,
//         height: 20,
//         width: 20,
//         left: windowwidth - 65,
//         top: 20,
//         borderRadius: 3,
//         marginBottom: 50
//     },

//     image: {
//         height: 100,
//         width: 100,
//         borderWidth: 1,
//         borderColor: "#D3D3D3"
//     },
//     name: {
//         marginTop: 20,
//         color: "#808080",
//         marginBottom: 20,
//         textAlign:"center",
//     },

//     inputBox: {
//         flexDirection: 'row',
//         marginRight: 50,
//         marginLeft: 10,
//     },

//     input: {
//         borderWidth: 1,
//         borderColor: "#D3D3D3",
//         height: 45,
//         width: "25%",

//         margin: 5,
//         borderWidth: 1,
//         borderRadius: 3,
//         padding: 5,
//         paddingTop: 12,
//     },
// });
