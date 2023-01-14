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
const gg = "https://www.iconpacks.net/icons/1/free-coin-icon-794-thumb.png"

const notreq = require("../../../assets/tasks/notrequired.png")
const manager = require("../../../assets/tasks/manager.png")
const finance = require("../../../assets/tasks/finance.png")
const management = require("../../../assets/tasks/management.png")

class Manage extends React.Component {


    state = {
        selected1: 'transparent',
        selected2: 'transparent',
        selected3: 'transparent',
        selected4: 'transparent',
        selected5: 'transparent',
    }

    componentDidMount() {
        this.onChange(this.props.selected)
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.onChange(nextProps.selected)
    }

    onChange=(type)=>{
        if (type==="Not Req"){
            this.setState({
                selected1: 'blue',
                selected2: 'transparent',
                selected3: 'transparent',
                selected4: 'transparent',
                selected5: 'transparent'
            })
        }else if (type==="Finance"){
            this.setState({
                selected1: 'transparent',
                selected2: 'transparent',
                selected3: 'blue',
                selected4: 'transparent',
                selected5: 'transparent'
            })
        }else if (type==="Mgmnt"){
            this.setState({
                selected1: 'transparent',
                selected2: 'transparent',
                selected3: 'transparent',
                selected4: 'blue',
                selected5: 'transparent'
            })
        }else if (type==="Manager"){
            this.setState({
                selected1: 'transparent',
                selected2: 'blue',
                selected3: 'transparent',
                selected4: 'transparent',
                selected5: 'transparent'
            })
        }
    }

    selectFunc1 = () => {
        this.setState({ selected1: 'blue' })
        this.setState({ selected2: 'transparent' })
        this.setState({ selected3: 'transparent' })
        this.setState({ selected4: 'transparent' })
        this.setState({ selected5: 'transparent' })
        this.props.onPress('Not Req');
    }

    selectFunc2 = () => {
        this.setState({ selected2: 'blue' })
        this.setState({ selected1: 'transparent' })
        this.setState({ selected3: 'transparent' })
        this.setState({ selected4: 'transparent' })
        this.setState({ selected5: 'transparent' })
        this.props.onPress('Manager');
    }


    selectFunc3 = () => {
        this.setState({ selected3: 'blue' })
        this.setState({ selected2: 'transparent' })
        this.setState({ selected1: 'transparent' })
        this.setState({ selected4: 'transparent' })
        this.setState({ selected5: 'transparent' })
        this.props.onPress('Finance');
    }


    selectFunc4 = () => {
        this.setState({ selected4: 'blue' })
        this.setState({ selected2: 'transparent' })
        this.setState({ selected3: 'transparent' })
        this.setState({ selected1: 'transparent' })
        this.setState({ selected5: 'transparent' })
        this.props.onPress('Mgmnt');
    }

    render() {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={styles.wrapper}>
                    <ScrollView horizontal={true} >
                        <TouchableOpacity onPress={() => this.selectFunc1()} style={[styles.selectWrapper, { borderColor: this.state.selected1 }]}>
                            <Image source={notreq} style={styles.img} />
                            <Text style={{ fontSize: 14 }}>Not Req</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.selectFunc2()} style={[styles.selectWrapper, { borderColor: this.state.selected2 }]}>
                            <Image source={manager} style={styles.img} />
                            <Text style={{ fontSize: 14 }}>Manager</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.selectFunc3()} style={[styles.selectWrapper, { borderColor: this.state.selected3 }]}>
                            <Image source={finance} style={styles.img} />
                            <Text style={{ fontSize: 14 }}>Finance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.selectFunc4()} style={[styles.selectWrapper, { borderColor: this.state.selected4 }]}>
                            <Image source={management} style={styles.img} />
                            <Text style={{ fontSize: 14 }}>Mgmnt.</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <Text style={{ marginTop: 5, opacity: 0.5, fontStyle: 'italic', fontSize: 12 }}>*{this.props.desc}</Text>
            </View>
        );
    }
}
export default Manage;

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
