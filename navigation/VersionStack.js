import React from "react";
import {
	createStackNavigator,
	CardStyleInterpolators,
} from "@react-navigation/stack";
import VersionCheck from "../screen/VersionControl/VersionCheck";

const Stack = createStackNavigator();
const VersionStack = () => (
	<Stack.Navigator
		initialRouteName="VersionCheck"
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		<Stack.Screen name="VersionCheck" component={VersionCheck} />
	</Stack.Navigator>
);

export default VersionStack;
