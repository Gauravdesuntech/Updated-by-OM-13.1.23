


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

const greentick = require("../../../assets/tasks/greentick.png")
const wrong = require("../../../assets/tasks/wrong.png")


class PhotoProof extends React.Component {


    state = {
        selected1: 'transparent',
        selected2: 'transparent',
    }

    componentDidMount() {
        if (this.props.is_photo_proof){
            this.setState({
                selected1:this.props.is_photo_proof.toString()==="1"?'blue':'transparent',
                selected2:this.props.is_photo_proof.toString()==="0"?'blue':'transparent'
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.is_photo_proof){
            this.setState({
                selected1:nextProps.is_photo_proof.toString()==="1"?'blue':'transparent',
                selected2:nextProps.is_photo_proof.toString()==="0"?'blue':'transparent'
            })
        }
    }

    selectFunc1 = () => {
        this.setState({ selected1: 'blue' })
        this.setState({ selected2: 'transparent' })
        this.props.onPress('1')
    }

    selectFunc2 = () => {
        this.setState({ selected2: 'blue' })
        this.setState({ selected1: 'transparent' })
        this.props.onPress('0')
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => this.selectFunc1()} style={[styles.selectWrapper, { borderColor: this.state.selected1 }]}>
                    <Image source={greentick} style={styles.img} />
                    <Text>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.selectFunc2()} style={[styles.selectWrapper, { borderColor: this.state.selected2 }]}>
                    <Image source={wrong} style={[styles.img, { height: 45, width: 45 }]} />
                    <Text>No</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default PhotoProof;

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
        justifyContent: 'space-evenly'
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
    img: { resizeMode: 'contain', height: 45, width: 45 }
});
