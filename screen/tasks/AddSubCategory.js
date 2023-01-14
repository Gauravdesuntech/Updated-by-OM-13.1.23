import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { addSubCategory, getPriority, todoList } from '../../utils/api';
import { Picker } from '@react-native-picker/picker';
import Header from '../../component/tasks/Header'
import Footer from "../../component/tasks/Footer";
import Theme from "../../Theme";
import ImgToBase64 from 'react-native-image-base64';
import { showError } from "../../actions/Error";
import Spinner from "../../component/tasks/Spinner";
import AppContext from "../../context/AppContext";
import { getFileData } from "../../utils/Util";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import globalStyles from "../../config/Styles";
import styles from "./Styles";


const sampleimg = 'https://www.pngarts.com/files/6/Vector-Carrot-PNG-Photo.png'

class AddSubCategory extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            image: sampleimg,
            loading: false,
            imagebase64: '',
            dafaultPriority: '',
            priorityLoading: true,
            priorities: [],
            parent_cat: this.props.route.params.parent_cat,
            categories: [],
            description: '',
            imageData:undefined
        }
    }

    componentDidMount() {
        // this.getPermissionAsync();
        this.getData()
    }

    getData = () => {
        const user_id = this.context.userDetails.id;
        Promise.all([getPriority(), todoList(user_id)]).then((response) => {

                const sources = response[0].data;
                
                let priorities = sources.data.map((a, index) => {
                    return {
                        id: a.id,
                        title: a.name,
                    }
                })
                let categories = response[1].data.data.map((a, index) => {
                    return {
                        id: a.id,
                        title: a.name,
                        priority: a.priority,
                        description: a.description,
                        image: a.image,
                        task_count: a.task_count
                    }
                })
                
                this.setState({
                    status: priorities.length === 0 ? 'No Priority Available' : '',
                    priorities: priorities,
                    categories: categories,
                    priorityLoading: false
                })
            }).catch(error => {
                this.setState({
                    priorities: [],
                    categories: [],
                    priorityLoading: false
                })
                showError(error)
            })
    }

    priorityChangeHandler = (value) => {
        this.setState({
            dafaultPriority: value
        })
    }

    catChangeHandler = (value) => {
        this.setState({
            parent_cat: value
        })
    }

    _pickImage = async () => {

        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						this.setState({
							image: result.uri,
							imageData: getFileData(result),
                            type:result.type
						});
					}
				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an icon");
			}
		});
        // try {
        //     let result = await ImagePicker.launchImageLibraryAsync({
        //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //         allowsEditing: true,
        //         base64: true,
        //         aspect: [4, 3],
        //         quality: 1,
        //     });
        //     console.log(result)
        //     if (!result.cancelled) {
        //         this.setState({
        //             image: result.uri,
        //             imagebase64: result.base64,
        //             type: result.type
        //         });
        //     }
        // } catch (E) {
        //     console.log(E, "E");
        // }
    }


    // getPermissionAsync = async () => {
    //     if (Platform.OS !== 'web') {
    //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         if (status !== 'granted') {
    //             Alert.alert(
    //                 "Media Permission Error",
    //                 "Sorry, some parts may not work properly",
    //                 [
    //                     {
    //                         text: "Cancel",
    //                         onPress: () => console.log("Ok canceled"),
    //                     }
    //                 ]
    //             )
    //         }
    //     }
    // };

    handleSubmit = () => {
        this.setState({
            loading: true
        }, () => {
            let obj = {
                name: this.state.category_name,
                priority: parseInt(this.state.dafaultPriority),
                parent_cat: parseInt(this.state.parent_cat),
                description: this.state.description,
                image: this.state.imageData
            }

            addSubCategory(obj).then((response) => {
                    // console.log("response", response)
                    const sources = response.data;
                    alert(sources.type)
                    this.setState({
                        loading: false
                    })
                    this.props.navigation.push("Todo")
                })
                .catch((error) => {
                    // console.log("errro====", error)
                    this.setState({
                        loading: false
                    })
                    showError(error)
                })
        })
    }

    render() {
        if (this.state.categories === null) {

            return (
                <SafeAreaView style={styles.container}>
                    <Header
                        navigation={this.props.navigation}
                        leftNavTo={'Todo'}
                        title={'Add Sub Category'}
                        // leftIcon={'ios-arrow-back'}
                        rightIcon={null}
                    />

                    <View style={styles.body}>
                        <Spinner />
                    </View>
                    <Footer />
                </SafeAreaView>
            )
        }

        return (
            <SafeAreaView style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    leftNavTo={'Todo'}
                    title={'Add Sub Category'}
                    // leftIcon={'ios-arrow-back'}
                    rightIcon={null}
                />

                <ScrollView contentContainerStyle={{ flexGrow: 1 ,height:"80%"}}>

                    <KeyboardAwareScrollView
                        behavior={Platform.OS === "ios" ? "padding" : ""}
                        style={{ flex: 1 }}>

                        <View style={styles.body}>
                            {/* TODO:Please add the functionality to pick the icon and store it in an array */}
                            <View style={[globalStyles.justifyContentSpaceBetween,globalStyles.alignItemsCenter,globalStyles.flexDirectionRow,
                                { paddingTop: 25}]}>
                                <Text style={globalStyles.fontSize16}>Choose Icon</Text>
                                <TouchableOpacity
                                    onPress={this._pickImage}
                                    style={styles.itemWrapper}>
                                    <Image source={{ uri: this.state.image }} style={{ height: 35, width: 35, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </View>

                            {/* Entries */}
                            <View style={[globalStyles.justifyContentSpaceEvenly,globalStyles.flex1,
                                { paddingTop: 15}]}>
                                <View>
                                    <Text>Category Name</Text>
                                    <TextInput
                                        onChangeText={text => this.setState({ category_name: text })}
                                        style={styles.input} />
                                </View>

                                <View>
                                    <Text>Choose Priority</Text>
                                    {this.state.priorityLoading == false ?
                                        <Picker
                                            selectedValue={this.state.dafaultPriority}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.priorityChangeHandler(itemValue)
                                            }>
                                            {this.state.priorities.map((item) => {
                                                return <Picker.Item key={item.id.toString()} label={item.title} value={item.id} />
                                            })}

                                        </Picker>
                                        :
                                        <Spinner />
                                    }


                                </View>

                                <View>
                                    <Text>Choose Category</Text>
                                    {this.state.priorityLoading == false ?
                                        <Picker
                                            selectedValue={this.state.parent_cat}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.catChangeHandler(itemValue)
                                            }>
                                            {this.state.categories.map((item) => {
                                                return <Picker.Item key={item.id.toString()} label={item.title} value={item.id} />
                                            })}

                                        </Picker>
                                        :
                                        <Spinner />
                                    }


                                </View>


                                <View>
                                    <Text>Description</Text>
                                    <TextInput multiline={true}
                                        onChangeText={text => this.setState({ description: text })}
                                        style={[styles.input, { height: 150, paddingVertical: 15, textAlignVertical: 'top' }]} />
                                </View>

                                <View style={[globalStyles.flexDirectionRow,globalStyles.justifyContentSpaceEvenly,globalStyles.width100,
                                    {marginTop:20}]}>

                                    {
                                        this.state.loading === true ?
                                            <TouchableOpacity>
                                                <Spinner />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={this.handleSubmit}>
                                                <Text style={styles.btns}>SAVE  </Text>
                                            </TouchableOpacity>
                                    }


                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Todo')}>
                                        <Text style={styles.btns}>EXIT  </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </KeyboardAwareScrollView>

                </ScrollView>

                {/* <Footer /> */}
            </SafeAreaView>
        );
    }
}
export default AddSubCategory;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
//     body: {
//         flex: 9,
//         paddingHorizontal: 25
//     },
//     itemWrapper: {
//         height: 55,
//         width: 55,
//         borderWidth: 1,
//         borderColor: '#7c7c7c50', //SUBHASH : choose icon border color , 50 value change it based on what you want
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     input: {
//         width: '100%',
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         borderWidth: 1,
//         borderColor: '#7c7c7c40', //SUBHASH :reduce opacity for box outline here
//         backgroundColor: '#e5e5e550',
//         marginTop: 10,
//         fontSize: 16
//     },
//     btns: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: Theme.primary
//     }
// });
