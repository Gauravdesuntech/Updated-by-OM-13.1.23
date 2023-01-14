import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DialogInput from "react-native-dialog-input";
import { Colors } from '../../config';

import colors from '../../config/colors';

const Assign = (props) => {

    const [icon] = React.useState(props.icon);
    const [customText, setCustomText] = React.useState('');
    const [isDialogVisible, setIsDialogVisible] = React.useState(false);

    const onPress = (value, type) => {
        let selected = props.selected;
        let selected_id = props.selected_id;
        if (props.taskType === "Individual") {
            selected = [value.text];
            selected_id = [value.id];
        } else {
            selected.push(value.text)
            selected_id.push(value.id)
        }
        props.onPress(selected, selected_id)
        setIsDialogVisible(false)
        if (type === "custom") {
            setCustomText(value)
        }
    }


    return (
        <View style={styles.wrapper}>
                {props.assigned_persons.length > 0 ?
                    props.assigned_persons.map((value, index) => {
                        let color = Colors.primary;
                        

                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                // onPress={() => onPress(value)}
                                style={[styles.selectWrapper, { borderColor: color }]}>
                                <Image source={icon} style={styles.img} />
                                <Text style={{fontSize: 12}}>{value.item}</Text>
                            </TouchableOpacity>
                        )
                    }) : null
                }
                {/* <TouchableOpacity
                    onPress={() => setIsDialogVisible(true)}
                    style={[styles.selectWrapper, { borderColor: 'transparent' }]}>
                    <Image source={icon} style={styles.img} />
                    <TextInput
                        style={{
                            fontSize: 12,
                            borderBottomWidth: 1,
                            borderColor: '#e5e5e5'
                        }}
                        placeholder={'CUSTOM'}
                        value={customText}
                    />
                </TouchableOpacity> */}
                <DialogInput isDialogVisible={isDialogVisible}
                    title={"Enter Assign Name"}
                    message={"Name"}
                    hintInput={"Enter Assign Name"}
                    submitInput={(inputText) => { onPress(inputText, 'custom') }}
                    closeDialog={() => {
                        setIsDialogVisible(false)
                    }}>
                </DialogInput>
        </View>
    )
}

const styles = StyleSheet.create({
    placeholder: { fontSize: 17 - 1, marginTop: 15, color: '#7f7f7f' },
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
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    selectWrapper: {
        borderRadius: 10,
        borderWidth: 1,
        height: 90,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        marginTop: 5
    },
    img: { resizeMode: 'contain', height: 25, width: 25, marginBottom: 5 }
})

export default Assign
