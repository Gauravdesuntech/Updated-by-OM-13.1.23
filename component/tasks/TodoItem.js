import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";
import colors from "../../config/colors";

import { AntDesign } from "@expo/vector-icons"



class TodoItem extends React.Component {

    

    render() {
        let percent = (this.props.completed_task_count / this.props.all_task_count) * 100;
        // console.log(percent.toFixed(0));
        percent = isNaN(percent) ? 0 : percent.toFixed();
        return ( 
            
                <TouchableOpacity
                    onPress={() =>{this.props.catId==80 || this.props.catId==86? this.props.navigation.navigate('FeedingSectionMenu',{ title: this.props.title,id: this.props.catId,}) : this.props.navigation.navigate(this.props.route, {
                        title: this.props.title,
                        id: this.props.id,
                        catId: this.props.catId,
                        selectUserId :this.props.selectUserId,
                        filter:this.props.filter,
                        extra:this.props.extra
                    })}}
                    style={styles.container}>
                    <View style={styles.wrapper}>
                        <Image source={{ uri: this.props.img }}
                            style={{ height: 40, width: 40, resizeMode: 'contain' }} />
                        <Text style={styles.title}>{this.props.title}</Text>
                    </View>
                   
                    <TouchableOpacity style={[styles.wrapper, { flexDirection: 'column' }]}>
                        <Text style={[styles.title, { fontSize: 14 }]}>{`${this.props.pending_task_count}`}</Text>
                        {/* <Text style={[styles.title, { fontSize: 12, color: colors.tomato }]}>{percent}%</Text> */}
                    </TouchableOpacity>
                  
                </TouchableOpacity>
           
        );
    }
}
export default TodoItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 17,
        paddingLeft: 15,
        color: '#7f7f7f',
        paddingRight: 5 //SUBHASH : adjust space here for the arrow
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
