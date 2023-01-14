import React from 'react';
import { StyleSheet, Text,View, TouchableOpacity} from 'react-native';
import { Container } from "native-base";
import { Header } from "../component";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../config/Styles";
import styles from './Styles'

export default class Task extends React.Component {

  toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  };

  render = () => (
    <Container>
      <Header
        leftIconName={"menu"}
        rightIconName={"add"}
        title={"Task"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.toggleDrawer}
      />

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.row_Task}
          onPress={() => this.props.navigation.navigate('NutritionalValues')}
        >
          <View style={{flex: 1}}>
            <Text style={styles.name_Task}>Nutritional Values</Text>
          </View>
          <View style={styles.iconContainer_Task}>
            <Ionicons
              name="chevron-forward"
              style={styles.iconStyle_Task}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row_Task}
          onPress={() => this.props.navigation.navigate('Vitamin')}
        >
          <View style={{flex: 1}}>
            <Text style={styles.name_Task}>Vitamin</Text>
          </View>
          <View style={styles.iconContainer_Task}>
            <Ionicons
              name="chevron-forward"
              style={styles.iconStyle_Task}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row_Task}
          onPress={() => this.props.navigation.navigate('Minerals')}
        >
          <View style={{flex: 1}}>
            <Text style={styles.name_Task}>Minerals</Text>
          </View>
          <View style={styles.iconContainer_Task}>
            <Ionicons
              name="chevron-forward"
              style={styles.iconStyle_Task}
            />
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container_Task: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 8
//   },
//   row_Task: {
//     flexDirection: "row",
//     width: "100%",
//     height: 50,
//     borderBottomColor: "#eee",
//     borderBottomWidth: 1,
//     alignItems: "center"
//   },
//   name_Task: {
//     fontSize: 18,
//     color: "#555",
//   },
//   iconContainer_Task: {
//     flex: 1,
//     alignItems: "flex-end"
//   },
//   iconStyle_Task: {
//     fontSize: 18,
//     color: '#cecece'
//   }
// });
