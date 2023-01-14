import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView
} from "react-native";
import DialogInput from 'react-native-dialog-input';
import {getPoints} from '../../../utils/api';
import {showError} from "../../../actions/Error";
import colors from "../../../config/colors";
import { Colors } from "../../../config";

const gg = "https://www.iconpacks.net/icons/1/free-coin-icon-794-thumb.png"



const coin1 = require('../../../assets/tasks/coin_1.png')
const coin2 = require('../../../assets/tasks/coin_2.png')
const coin3 = require('../../../assets/tasks/coin_3.png')
const coin4 = require('../../../assets/tasks/coin_4.png')


class Coins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points:[],
            isDialogVisible:false,
            selected: "",
        }
    }

    componentDidMount() {
        this.setState({
            selected: this.props.selected?this.props.selected:""
        })
        this.getPoints()
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            selected: nextProps.selected?nextProps.selected:""
        })
    }

    getPoints=()=>{
        getPoints()
            .then((response)=>{
                const sources = response.data;
                let points = sources.data.map((a)=>{
                    return {
                        color:'transparent',
                        text:a.point.toString(),
                        id:a.id
                    }
                })
                this.setState({
                    points:points
                })
            }).catch(error=>showError(error))
    }

    onPress=(value)=>{
        this.setState({
            selected: value.toString(),
            isDialogVisible:false
        },()=>{
            this.props.onPress(this.state.selected)
        })
    }

    promptUser = () => {
        this.setState({
            isDialogVisible:!this.state.isDialogVisible
        })
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <ScrollView horizontal={true} >
                    {
                        this.state.points.map((value, index)=>{
                            let color=value.color;
                            if (value.text===this.state.selected){
                                color= colors.primary;
                            }
                            return(
                                <TouchableOpacity
                                    key={value.id}
                                    onPress={() => this.onPress(value.text)}
                                    style={[styles.selectWrapper, { borderColor: color }]}>
                                    <Image source={coin1} style={[styles.img, { height: 35, width: 35 }]} />
                                    <TextInput editable={false}
                                            style={{alignSelf:'center'}}
                                               placeholderTextColor={Colors.textColor}
                                               placeholder={value.text} />
                                </TouchableOpacity>
                            )
                        })
                    }
                    <TouchableOpacity
                        onPress={() => this.promptUser()}
                        style={[styles.selectWrapper, { borderColor: 'transparent' }]}>
                        <Image source={coin1} style={[styles.img, { height: 35, width: 35 }]} />
                        <TextInput
                            style={{
                                fontSize: 12,
                                borderBottomWidth: 1,
                                borderColor: '#e5e5e5',
                                textAlign:'center'
                            }}
                            placeholderTextColor={Colors.textColor}
                            placeholder={'CUSTOM'}
                            value={this.state.selected}
                        />
                    </TouchableOpacity>
                    <DialogInput isDialogVisible={this.state.isDialogVisible}
                                 title={"Coin"}
                                 message={"Coin Number"}
                                 hintInput ={"Enter Coin Number"}
                                 textInputProps={{keyboardType:"numeric"}}
                                 submitInput={ (inputText) => {this.onPress(inputText)} }
                                 closeDialog={ () => {
                                     this.setState({isDialogVisible: false})
                                 }}>
                    </DialogInput>
                </ScrollView>
            </View>
        );
    }
}
export default Coins;

const styles = StyleSheet.create({
    wrapper: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        // paddingHorizontal: 30,
        paddingVertical: 2,
        borderRadius: 3,
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        alignItems : 'flex-start',
        justifyContent : 'space-evenly'
    },
    selectWrapper: {
        borderRadius: 10,
        borderWidth: 1,
        height: 70,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 3
    },
    img: { resizeMode: 'contain', height: 25, width: 25, marginBottom: 5 }
});
