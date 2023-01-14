import React from "react";
import {
	createStackNavigator,
	CardStyleInterpolators,
} from "@react-navigation/stack";
import Login from "../screen/Login";

const Stack = createStackNavigator();
const LoginStack = () => (
	<Stack.Navigator
		initialRouteName="Login"
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		<Stack.Screen name="Login" component={Login} />
	</Stack.Navigator>
);

export default LoginStack;
