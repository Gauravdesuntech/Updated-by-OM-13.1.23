import React from 'react';
import { StyleSheet, Text, TouchableHighlight, TouchableWithoutFeedback, View} from 'react-native';
import Dashboard from "../screen/Dashboard";
import AddCategory from "../screen/AddCategory";
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign,Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const StackNavigation = ()=> {
  return (
   
      <Stack.Navigator initialRouteName="Dashboard"
        screenOptions={{
            headerStyle: {
            backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        }}
      >
        <Stack.Screen 
        name="Dashboard" 
        options={({ navigation,route })=>({ 
          headerTitle: () => {
              return (
                  <View style={styles.headerContainer}>
                  <View style={styles.headerStyle}> 
                    <TouchableWithoutFeedback
                    underlayColor={'#ccc'}
                    onPress={()=>navigation.toggleDrawer()}>
                    <Ionicons name="menu-outline" size={24} color="#fff" />
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={styles.headerTextContainer}>
                  <Text style={styles.headerText}>{route.name}</Text>
                  </View>
                   
                   </View>
              )
          },
          
          
          headerRight: (props) => {
            // console.log("route",navigation)
            
            return (
                <TouchableHighlight
                underlayColor={'#ccc'}
                style={{ marginRight: 10}}
                onPress={()=>navigation.navigate('Add Category')}>
                  <Ionicons name="add" size={24} color={props.tintC} />
                </TouchableHighlight>
              )
          }
        })
        } 
        component={Dashboard} />
        <Stack.Screen name="Add Category" component={AddCategory} />
      </Stack.Navigator>
    
  );
}

const styles = StyleSheet.create({
    headerStyle: {
       width: 50
    },
    headerText: {
        fontSize: 24,
        alignSelf: 'center'
    },
    headerTextContainer: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1
    }
})

export default StackNavigation;

