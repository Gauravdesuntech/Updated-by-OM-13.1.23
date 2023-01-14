import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";


import { AntDesign } from "@expo/vector-icons"
import  Colors  from '../../config/colors';
import colors from "../../config/colors";


class UserItem extends React.Component {
    render() {
        return (
            // <TouchableOpacity
            //     onPress={() => this.props.clickUser(this.props.id , this.props.title)}
            //     style={styles.container}>
            //     <View style={styles.wrapper}>
            //         <Text style={styles.title}>{`${this.props.title} (${this.props.designation} of ${this.props.department})`}</Text>
            //     </View>
            // </TouchableOpacity>
            <TouchableOpacity
				style={[styles.container]}
				activeOpacity={1}
                onPress={() => this.props.clickUser(this.props.id , this.props.title)}
			>
				<View >
					<Text style={[styles.title, styles.pd0, { padding: 5 }]}>
                   {this.props.title} ({this.props.designation})
					</Text>
				</View>
			</TouchableOpacity>
        );
    }
}
export default UserItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
		paddingHorizontal: 3,
		paddingVertical: 5,
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
    },
    title: {
        fontSize: 14,
		color: Colors.labelColor,
    },
    wrapper: {
        flexDirection: 'row',
        height:30,
        alignItems: 'center'
        
    }
});
