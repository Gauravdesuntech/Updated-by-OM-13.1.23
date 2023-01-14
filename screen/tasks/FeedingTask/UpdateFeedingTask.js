import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity, FlatList, Image,
    Alert,
    ActivityIndicator
} from "react-native";
import moment from "moment";

import { Header } from '../../../component'
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getFormattedDate, getFileData } from "../../../utils/Util";
import AppContext from "../../../context/AppContext";
import Spinner from "../../../component/tasks/Spinner";
import colors from "../../../config/colors";
import { updateFeedWork } from './../../../services/AllocationServices';
import styles from "../Styles";
import globalStyles from '../../../config/Styles'


class UpdateFeedingTask extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            imageID: 0,
            Images: [],
            UploadData: []
        }
    }


    handleMarkasComplete = () => {
        this.setState({isFetching:true})
        let user_id = this.context.userDetails.id;
        let obj={
            updated_by: user_id,
            id:this.props.route.params.task_id
        }
        updateFeedWork(obj , this.state.UploadData).then((res)=>{
            this.setState({isFetching:false})
            alert("Upload Successfully Done!!")
            this.props.navigation.goBack()
        }).catch((err)=>{
            this.setState({isFetching:false})
            alert("Something went wrong!!")
            console.log(err);
        })
    }

    choosePhotos = () => {
        this.setState({isFetching:true})
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                let optins = {
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // allowsEditing: false,
                    quality: 1,
                    // presentationStyle: 0,
                    allowsMultipleSelection: true
                };

                ImagePicker.launchImageLibraryAsync(optins).then((result) => {

                    if (!result.cancelled) {
                        this.setState({
                            Images: [...this.state.Images, { id: Number(this.state.imageID) + 1, uri: result.uri }],
                            imageID: Number(this.state.imageID) + 1,
                            UploadData: [...this.state.UploadData, getFileData(result)],
                            isFetching: false                
                        });
                    }
                });
            } else {
                this.setState({isFetching:false})
                Alert.alert("Please allow permission to choose images");
            }
        });
    };


    removeImage = (image) => {
        let arr = this.state.Images;
    arr = arr.filter((element) => element.id !== image.id);
    let arr2 = this.state.UploadData;
    let uploadImage = getFileData(image);
    arr2 = arr2.filter((element) => element.name !== uploadImage.name);
    this.setState({
      Images: arr,
      UploadData: arr2 
    })
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    title={this.props.route.params.task_name}
                />
                <View style={styles.body}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ margin: 20, marginBottom: 20 }}>
                        <View style={{ marginBottom: 30 }}>
                            <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
                                <View style={styles.fieldBox}>
                                    <Text style={styles.labelName}>{`Upload Photos`}</Text>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.dateField}
                                        onPress={this.choosePhotos}
                                    >
                                        <MaterialIcons name="add-photo-alternate" size={30} color="#444" />
                                    </TouchableOpacity>
                                </View>
                                {this.state.Images.length > 0 ? (
                                    <View style={{ borderWidth: 0.5, borderColor: "#444", width: "100%", height: 110, justifyContent: 'center' }}>
                                        <ScrollView contentContainerStyle={globalStyles.alignItemsCenter} horizontal={true} showsHorizontalScrollIndicator={false}>
                                            {this.state.Images.map((item, index) => {
                                                return (
                                                    <View key={index}>
                                                        <Image source={{ uri: item.uri }} style={{ height: 100, width: 100, marginHorizontal: 3, borderWidth: 0.6, borderColor: 'rgba(68,68,68,0.4)' }} />
                                                        <TouchableOpacity
                                                            style={{ position: 'absolute', right: -2, top: -3 }}
                                                            onPress={() => { this.removeImage(item) }}
                                                        >
                                                            <Entypo name="circle-with-cross" size={24} color="rgba(68,68,68,0.9)" />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })}
                                        </ScrollView>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                        <View style={[globalStyles.alignItemsCenter,globalStyles.justifyContentCenter]}
                           >
                            <TouchableOpacity
                                style={[globalStyles.justifyContentCenter,globalStyles.alignItemsCenter,
                                    {
                                    paddingVertical: 10,
                                    width: 150,
                                    backgroundColor: colors.primary,
                                    borderRadius: 3
                                }]}
                            onPress={() => {
                                this.handleMarkasComplete()
                            }}
                            >
                            {this.state.isFetching ?  <ActivityIndicator size={25} color={"white"}/>  : <Text style={styles.btns}>Upload Photo</Text> }
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>


                {/* <Footer /> */}
            </SafeAreaView>
        );
    }
}
export default UpdateFeedingTask;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
//     body: {
//         flex: 9,
//     },
//     placeholder: { fontSize: 17 - 1, marginTop: 15, color: '#7f7f7f' },//SUBHASH: Change title color here
//     wrapper: {
//         borderWidth: 1,
//         borderColor: '#e5e5e5',
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//         borderRadius: 3,
//         width: '100%',
//         marginTop: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between'
//     },
//     btns: {
//         fontSize: 18,
//         color: colors.white
//     },
//     fieldBox: {
//         alignItems: 'center',
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderWidth: 1,
//         backgroundColor: "#fff",
//         height: 'auto',
//         justifyContent: "space-between",
//         marginBottom: 5,
//         marginTop: 5,
//         // shadowColor: "#999",
//         // shadowOffset: {
//         // 	width: 0,
//         // 	height: 1,
//         // },
//         // shadowOpacity: 0.22,
//         // shadowRadius: 2.22,
//         // elevation: 3,
//     },
//     labelName: {
//         color: colors.textColor,
//         lineHeight: 40,
//         fontSize: 14,
//         paddingLeft: 4,
//         height: 'auto',
//     },
//     textfield: {
//         backgroundColor: "#fff",
//         height: 'auto',
        
//         fontSize: 12,
//         color: colors.textColor,
//         textAlign: "right",
//         padding: 5,
//         width: '50%'
//     },
// });




// : assign_lvl_1_user_id.indexOf(this.context.userDetails.id) > - 1 ? (
//     <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>

//         {this.state.task_data.status == 'pending' || this.state.task_data.status == 'waiting' ? (
//             <>
//                 {is_photo_proof == 1 ? (
//                     <TouchableOpacity
//                         style={{
//                             paddingVertical: 10,
//                             width: 150,
//                             backgroundColor: colors.primary,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             borderRadius: 3
//                         }}
//                         onPress={() => {
//                             this.props.navigation.push('EditPhotoCatItem', { task_id: id })
//                         }}>
//                         <Text style={styles.btns}>  Upload Photo </Text>
//                     </TouchableOpacity>
//                 ) : null}

//                 <TouchableOpacity
//                     style={{
//                         paddingVertical: 10,
//                         width: 150,
//                         backgroundColor: colors.primary,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         borderRadius: 3
//                     }}
//                     onPress={this.handleSubmit}
//                 >
//                     <Text style={styles.btns}>Mark as Complete </Text>
//                 </TouchableOpacity>
//             </>
//         ) : null}

//     </View>
// )
