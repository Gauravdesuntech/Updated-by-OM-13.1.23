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
import {getTypes} from '../../../utils/api';
import {showError} from "../../../actions/Error";
import colors from "../../../config/colors"; 
import { Colors } from "../../../config";

const gg = "https://cdn.onlinewebfonts.com/svg/img_453102.png"

const individual = require('../../../assets/tasks/manager.png')
const rotate = require('../../../assets/tasks/Rotate.png')
const compete = require('../../../assets/tasks/Compete.png')
const collaborate = require('../../../assets/tasks/Collborate.png')


class TaskType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskType:[],
            selected: '',
        }
    }

    componentDidMount() {
        this.setState({
            selected:this.props.selected?this.props.selected:''
        })
        this.getTypes()
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            selected:nextProps.selected?nextProps.selected:''
        })
    }

    getTypes=()=>{
        getTypes()
            .then((response)=>{
                const sources = response.data;
                let taskType = sources.data.map((a)=>{
                    return {
                        color:'transparent',
                        text:a.name,
                        id:a.id
                    }
                })
                this.setState({
                    taskType:taskType
                })
            }).catch(error=>showError(error))
    }

    onPress=(value)=>{
        this.setState({
            selected: value
        },()=>{
            this.props.onPress(this.state.selected)
        })
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <ScrollView horizontal={true} >
                {
                    this.state.taskType.map((value, index)=>{
                        let color=value.color;
                        if (value.text===this.state.selected){
                            color= colors.primary;
                        }
                        return(
                            <TouchableOpacity key={value.id} onPress={() => this.onPress(value.text)} style={[styles.selectWrapper, { borderColor: color }]}>
                                <Image source={individual} style={styles.img} />
                                <Text style={{color:Colors.textColor}}>{value.text}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
                </ScrollView>
            </View>
        );
    }
}
export default TaskType;

const styles = StyleSheet.create({
    wrapper: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        // paddingHorizontal: 30,
        paddingVertical: 5,
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
        width: 85,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5
    },
    img: { resizeMode: 'contain', height: 35, width: 35, marginBottom: 5 }
});
