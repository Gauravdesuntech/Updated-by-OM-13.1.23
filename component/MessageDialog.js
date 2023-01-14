import React from "react";
import Dialog from "react-native-dialog";

export default class MessageDialog extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			title: undefined,
			description: undefined,
		};
	}

	openDialog = (title, description) =>
		this.setState({
			visible: true,
			title: title,
			description: description,
		});

	closeDialog = () =>
		this.setState({
			visible: false,
			title: undefined,
			description: undefined,
		});

	render = () => (
		<Dialog.Container visible={this.state.visible} statusBarTranslucent={true}>
			<Dialog.Title>{this.state.title}</Dialog.Title>
			<Dialog.Description>{this.state.description}</Dialog.Description>
			<Dialog.Button label="OK" onPress={this.closeDialog} />
		</Dialog.Container>
	);
}
