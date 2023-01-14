import React from "react";
import { StyleSheet, Image } from "react-native";
import CheckBox from 'react-native-check-box'

export default class CustomCheckbox extends React.Component {
    constructor(props){
        super(props)

    }

    render(){
        return (
            <CheckBox
                style={{ flex: 1, padding: 10 }}
                onClick={this.props.handler}
                isChecked={this.props.value}
                leftText={this.props.label}
                leftTextStyle={this.props.leftTextStyle}
                checkedImage={<Image source={require('../../../assets/image/ic_check_box.png')} style={styles.unchecked}/>}
                unCheckedImage={<Image source={require('../../../assets/image/ic_check_box_outline_blank.png')} style={styles.checked}/>}
                uncheckedCheckBoxColor={this.props?.uncheckedCheckBoxColor}
            />
        )
    }

}

const styles = StyleSheet.create({
    unchecked: {
        
    },
    checked: {
        
    }
})
