import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { DatePicker } from "../../component";
import Colors from "../../config/colors";
import OverlayLoader from "../../component/OverlayLoader";
import AppContext from "../../context/AppContext";
import { AntDesign } from "@expo/vector-icons";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import styles from "../../config/Styles";

export default class SalesTransfer extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			show: false,
			date: new Date(),
			transferTo: "",
			destinationValidationFailed: false,
			showLoader: false,
		};
		this.scrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let animalID = this.context.selectedAnimalID;
	};

	// onChangeDate = (event, selectedDate) => {
	// 	const currentDate = selectedDate || this.state.date;
	// 	this.setState({
	// 		show: false,
	// 		date: currentDate,
	// 	});
	// };

	showDatePicker = (type) => {
		this.setState({ show: true, type: type })
	  };
	
	  handleConfirm = (selectDate) => {
		const currentDate = selectDate || this.state.date;
		  this.setState({
			date: currentDate,
		  });
		this.hideDatePicker();
	  }
	
	  hideDatePicker = () => {
		this.setState({ show: false })
	  }

	scrollViewScrollTop = () =>
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });

	saveData = () => {
		let { transferTo } = this.state;

		this.setState(
			{
				destinationValidationFailed: false,
			},
			() => {
				if (transferTo.trim().length === 0) {
					this.setState({ destinationValidationFailed: true });
					this.scrollViewScrollTop();
				} else {
					// this.setState({ showLoader: true });
					alert("OK");
				}
			}
		);
	};

	render = () => (
		<>
			<ScrollView ref={this.scrollViewRef} showsVerticalScrollIndicator={false}>
				<View style={styles.container}>
				<View
            style={styles.formBorder}
          >
					<View
						style={[
							styles.fieldBox,
							this.state.destinationValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Sales/Transfer To : </Text>
						<TextInput
							value={this.state.transferTo}
							onChangeText={(transferTo) => this.setState({ transferTo })}
							style={styles.textfield}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>
					<View style={[styles.fieldBox,{borderBottomWidth:0}]}>
					<Text style={styles.labelName}>Date: </Text>
					<TouchableOpacity activeOpacity={1} style={{flexDirection:'row',alignItems:'center',width:'50%',}} onPress={() => { this.showDatePicker("date") }}>
					  <Text style={styles.dateField}>{this.state.date.toDateString()}</Text>
					  <AntDesign name="calendar" color={Colors.primary}  size={20} />
					</TouchableOpacity>
				  </View>
				  </View>


					<TouchableOpacity style={styles.button} onPress={this.saveData}>
						<Text style={styles.textWhite}>Save Details</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<OverlayLoader visible={this.state.showLoader} />
			<DateTimePickerModal
        mode={'date'}
        display={Platform.OS == 'ios' ? 'inline' : 'default'}
        isVisible={this.state.show}
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
      />
		</>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 	},
// 	fieldBox: {
// 		alignItems: "center",
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderBottomWidth: 1,
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		justifyContent: "space-between",
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		width:'50%',
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	},
// 	labelName: {
// 		color: Colors.labelColor,
// 		// lineHeight: 40,
// 		fontSize: Colors.lableSize,
// 		paddingLeft: 4,
// 		height: "auto",
// 		paddingVertical: 10,
// 	},
// 	dateField: {
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	  },

// 	button: {
// 		alignItems: "center",
// 		backgroundColor: Colors.primary,
// 		padding: 10,
// 		// shadowColor: "#000",
// 		// shadowOffset: {
// 		// 	width: 0,
// 		// 	height: 2,
// 		// },
// 		// shadowOpacity: 0.23,
// 		// shadowRadius: 2.62,
// 		// elevation: 4,
// 		borderRadius: 20,
// 		color: "#fff",
// 		marginTop: 10,
// 	},
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 		fontSize: Colors.lableSize,
// 	},
// 	item: {
// 		height: 35,
// 		backgroundColor: "#00b386",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	itemtitle: {
// 		color: "#fff",
// 		textAlign: "center",
// 		fontSize: Colors.textSize,
// 	},
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// });
