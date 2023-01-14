import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";


const msg = require('../../assets/tasks/msg.png')
const todo = require('../../assets/tasks/todo.png')
const tent = require('../../assets/tasks/tent.png')
const wallet = require('../../assets/tasks/wallet.png')
const ebook = require('../../assets/tasks/ebook.png')


class Footer extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.itemWrapper}>
                    <Image source={msg} style={{ height: 35, width: 35 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemWrapper}>
                    <Image source={todo} style={{ height: 35, width: 35 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemWrapper}>
                    <Image source={tent} style={{ height: 40, width: 40 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemWrapper}>
                    <Image source={wallet} style={{ height: 45, width: 45 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemWrapper}>
                    <Image source={ebook} style={{ height: 45, width: 45 }} />
                </TouchableOpacity>
            </View>
        );
    }
}
export default Footer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 2,
        borderTopColor: '#e5e5e5',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    itemWrapper: {
        height: 55,
        width: 55,
        borderWidth: 1,
        borderColor: '#7c7c7c60', //SUBHASH: 60 is the value, change it
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});