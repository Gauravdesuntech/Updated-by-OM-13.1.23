import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Home from "../screen/Home";
// import Animals from "../screen/Animals";
import Task from "../screen/Task";
// import IncidentReporting from "../screen/IncidentReporting";
import FeedingReport from "../screen/FeedingReport";
import Colors from "../config/colors";

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let type;

					if (route.name === "Home") {
						type = "Ionicons";
						iconName = focused ? "home" : "home-outline";
					}
					// else if (route.name === "Enclosures") {
					//   type = "Ionicons";
					//   iconName = focused ? "git-branch" : "git-branch";
					// }
					// else if (route.name === "Animals") {
					//   type = "MaterialCommunity";
					//   iconName = focused ? "earlybirds" : "kiwi-birds";
					// }
					else if (route.name === "Feeding Report") {
						type = "Ionicons";
						iconName = focused ? "fast-food" : "fast-food-outline";
					}
					// else if (route.name === "Incident Reporting") {
					//   type = "Ionicons";
					//   iconName = focused ? "bulb" : "bulb-outline";
					// }
					else if (route.name === "Todo") {
						type = "Fontawsome";
						iconName = focused ? "tasks" : "tasks";
					}

					if (type === "Ionicons") {
						return <Ionicons name={iconName} size={size} color={color} />;
					} else if (type === "MaterialCommunity") {
						return (
							<MaterialCommunityIcons name="cow" size={24} color={color} />
						);
					} else {
						return <FontAwesome5 name="tasks" size={24} color={color} />;
					}
				},
			})}
			tabBarOptions={{
				activeTintColor: "#00B386",
				inactiveTintColor: "#cecece",
				tabStyle: { backgroundColor: "#fff" },
			}}
		>
			<Tab.Screen name="Home" component={Home} />
			{/* <Tab.Screen name="Animals" component={Animals} /> */}
			{/* <Tab.Screen name="Enclosures" component={Enclosures} /> */}
			{/* <Tab.Screen name="Incident Reporting" component={IncidentReporting} /> */}
			<Tab.Screen name="Feeding Report" component={FeedingReport} />
			<Tab.Screen name="Task" component={Task} />
		</Tab.Navigator>
	);
};

export default BottomNavigator;
//export  App;
