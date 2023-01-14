import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    FlatList
} from "react-native";
import Theme from "../../../Theme";

import { Ionicons } from "@expo/vector-icons"

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];



class Sublist extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            name:"",
            data:[

            ]
        }
    }

    componentDidMount() {
        if (this.props.sub_tasks){
            this.setState({
                data:this.props.sub_tasks
            })
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.sub_tasks){
            this.setState({
                data:nextProps.sub_tasks
            })
        }
    }

    onPress=()=>{
        let list=this.state.data;
        list.push({
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            name:this.state.name,
        })
        this.setState({
            data:list,
            name:''
        },()=>{
            let filter = this.state.data.map(a=>{ return {name:a.name} })
            this.props.onPress(filter)
        })
    }

    render() {
        return (
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 0.5, borderColor: '#e5e5e5' }}>
                <View style={{ alignItems: 'center', paddingBottom: 0 }}>
                    <View style={styles.wrapper}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>SUB TASKS</Text>
                        {this.props.editable == true ? <TouchableOpacity onPress={this.onPress}>
                            <Ionicons name="ios-add" size={24} color={'#fff'} />
                        </TouchableOpacity> :
                            null}
                    </View>

                    <View style={{ width: '100%' }}>
                        <View style={{ width: '100%', borderBottomWidth: 1, borderColor: '#e5e5e5', padding: 10 }}>
                            <TextInput
                                value={this.state.name}
                                placeholder="Enter Name"
                                onChangeText={text=>this.setState({name:text})}
                                style={{ fontSize: 17, paddingHorizontal: 5 }}
                            />
                        </View>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item }) => <Item name={item.name} />}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
export default Sublist;

const Item = (props) => {
    return (
        <View style={{ width: '100%', borderBottomWidth: 1, borderColor: '#e5e5e5', padding: 10 }}>
            <Text>{props.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Theme.primary,
        borderTopRightRadius:10,
        borderTopLeftRadius:10
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
