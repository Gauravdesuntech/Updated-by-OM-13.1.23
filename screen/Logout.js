import React from "react";
import { Loader } from "../component";
import { clearUserData } from "../utils/Util";
import AppContext from "../context/AppContext";

export default class Logout extends React.Component {
	static contextType = AppContext;

	componentDidMount = () => {
		clearUserData();
		this.context.unsetUserData();
	};

	render = () => <Loader />;
}
