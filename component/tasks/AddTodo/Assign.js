import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Alert, ScrollView
} from "react-native";
import DialogInput from 'react-native-dialog-input';
import {getAssignLevel} from '../../../utils/api';

import {showError} from "../../../actions/Error";


class Assign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assign:[
            ],
            selected: [],
            taskType: '',
            isDialogVisible:false,
            visible:true
        }
    }

    componentDidMount() {
        if (this.props.editable){
            this.setState({
                selected: this.props.selected,
                taskType:this.props.taskType
            })
            this.getAssignLevel()
        }else {
            this.setState({
                selected: [],
                taskType:this.props.taskType
            })
            this.getAssignLevel()
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.editable){
            this.setState({
                selected: nextProps.selected,
                taskType:nextProps.taskType
            })
        }

        if (this.state.taskType!==nextProps.taskType){
            this.setState({
                selected: [],
                taskType:nextProps.taskType
            },()=>{
                this.props.onPress(this.state.selected)
            })
        }
    }

    getAssignLevel=()=>{
        getAssignLevel(this.props.type)
            .then((response)=>{
                const sources = response.data;
                let assign = sources.data.map((a)=>{
                    return {
                        color:'transparent',
                        text:a.full_name,
                        id:a.id
                    }
                })
                this.setState({
                    assign:assign
                })
            }).catch(error=>showError(error))
    }

    selectedValue=(value="empty")=>{
        let selectedType=this.state.selected;

        if (this.state.taskType==="Rotate" || this.state.taskType==="Compete" || this.state.taskType==="Collaborate"){
            selectedType.push(value)
        }else if (this.state.taskType==="Individual"){
            selectedType=[value];
        }

        return selectedType;
    }

    promptUser = () => {
        this.setState({
            isDialogVisible:!this.state.isDialogVisible
        })
    }

    onPress=(value)=>{

        let selected=[value];
        if(this.props.type===1){
            selected=this.selectedValue(value);
        }

        this.setState({
            selected: selected,
            isDialogVisible:false
        },()=>{
            this.props.onPress(this.state.selected)
        })
    }

    render() {

        return (
            <View style={styles.wrapper}>
                <ScrollView horizontal={true} >
                {
                    this.state.assign.map((value,index)=>{
                        let color=value.color;
                        let selected = this.state.selected.find(a=>a===value.text)

                        if (value.text===selected){
                            color='blue';
                        }

                        return(
                            <TouchableOpacity
                                key={index}
                                onPress={() => this.onPress(value.text)}
                                style={[styles.selectWrapper, { borderColor: color }]}>
                                <Image source={this.props.icon} style={styles.img} />
                                <Text>{value.text}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
                <TouchableOpacity
                    onPress={() => this.promptUser()}
                    style={[styles.selectWrapper, { borderColor: 'transparent' }]}>
                    <Image source={this.props.icon} style={styles.img} />
                    <TextInput
                        style={{
                                fontSize: 12,
                                borderBottomWidth: 1,
                                borderColor: '#e5e5e5'
                            }}
                       placeholder={'CUSTOM'}
                       value={this.state.selected}
                    />
                </TouchableOpacity>
                <DialogInput isDialogVisible={this.state.isDialogVisible}
                             title={"Enter Assign Name"}
                             message={"Name"}
                             hintInput ={"Enter Assign Name"}
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
export default Assign;

const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 3,
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selectWrapper: {
        borderRadius: 10,
        borderWidth: 1,
        height: 90,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5
    },
    img: { resizeMode: 'contain', height: 55, width: 55, marginBottom: 5 }
});
