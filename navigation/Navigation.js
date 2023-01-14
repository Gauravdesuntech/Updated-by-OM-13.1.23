import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginStack from "./LoginStack";
import DrawerNavigation from "./DrawerNavigation";
import AppContext from "../context/AppContext";
import Constants from "expo-constants";
import { getVersion } from "../services/VersionServices";
import VersionStack from "./VersionStack";

export default class Navigation extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			isUpdated: true
		}
	}


	componentDidMount() {
		getVersion().then((res) => {
			const currentVersion = Constants.manifest.version.replace('.', '').replace('.', '');
			const newVersion = res.version.replace('.', '').replace('.', '');
			let isUpdated = Number(currentVersion) < Number(newVersion) ? false : true;
			console.log(isUpdated);
			this.setState({
				isUpdated
			})
		}).catch((err) => console.log(err))
	}

	render = () => (
		<NavigationContainer>
			{this.state.isUpdated ?
				this.context.userDetails === null ? (
					<LoginStack />
				) : (
					<DrawerNavigation />
				)
				: <VersionStack />}
		</NavigationContainer>
	);
}
