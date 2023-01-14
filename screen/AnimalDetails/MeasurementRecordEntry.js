import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { Container } from "native-base";
import { Header, DatePicker } from "../../component";
import Colors from "../../config/colors";
import OverlayLoader from "../../component/OverlayLoader";
import { addAnimalMeasurementRecord } from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import styles from "../../config/Styles";

export default class MeasurementRecordEntry extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			showLoader: false,
			isDatepickerOpen: false,
			date: new Date(),
			weight: undefined,
			height: undefined,
			length: undefined,
			width: undefined,
			performer: "",
			show:false,
			isWeightValidationFailed: false,
			isHeightValidationFailed: false,
			isLengthValidationFailed: false,
			isWidthValidationFailed: false,
			isPerformerValidationFailed: false,
		};

		this.scrollViewRef = React.createRef();
	}

	onChangeDate = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		this.setState({
			isDatepickerOpen: false,
			date: currentDate,
			show: false,
		});
	};

	// showDatepicker = () => this.setState({ isDatepickerOpen: true });

	gotoBack = () => this.props.navigation.goBack();

	scrollViewScrollTop = () => {
		this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
	};
	showDatePicker = () => {
		this.setState({ show: true, })
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

	saveMeasurementRecord = () => {
		let { weight, height, length, width, performer } = this.state;
		this.setState(
			{
				isWeightValidationFailed: false,
				isHeightValidationFailed: false,
				isLengthValidationFailed: false,
				isWidthValidationFailed: false,
				isPerformerValidationFailed: false,
			},
			() => {
				if (typeof weight === "undefined" || isNaN(weight)) {
					this.setState({ isWeightValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof height === "undefined" || isNaN(height)) {
					this.setState({ isHeightValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof length === "undefined" || isNaN(length)) {
					this.setState({ isLengthValidationFailed: true });
					this.scrollViewScrollTop();
				} else if (typeof width === "undefined" || isNaN(width)) {
					this.setState({ isWidthValidationFailed: true });
				} else if (performer.trim().length === 0) {
					this.setState({ isPerformerValidationFailed: true });
				} else {
					this.setState({ showLoader: true });
					let obj = {
						animals_code: this.context.selectedAnimalID,
						date_of_inspection: getFormattedDate(this.state.date),
						weight: weight,
						height: height,
						length: length,
						width: width,
						performer: performer,
					};
					addAnimalMeasurementRecord(obj)
						.then((response) => {
							this.setState({ showLoader: false });
							this.context.setAnimalMeasurements(response.data);
							this.gotoBack();
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	render = () => (
		<Container>
			<Header
				leftIconName={"arrow-back"}
				title={"Measurement Record Entry"}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={this.gotoBack}
			/>
			<View style={styles.container}>
				<ScrollView ref={this.scrollViewRef}>
				<View
            style={styles.formBorder}
          >
					{/* <DatePicker
						onPress={this.showDatepicker}
						show={this.state.isDatepickerOpen}
						onChange={this.onChangeDate}
						date={this.state.date}
						mode={"date"}
						label={"Date of Inspection :"}
					/> */}
					  <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Date of Inspection: </Text>
                <TouchableOpacity activeOpacity={1} style={[styles.textfield,{flexDirection:'row',alignItems:'center',width:'50%'}]} onPress={() => { this.showDatePicker() }}>
                  <Text style={[styles.textfield,]}>{this.state.date.toDateString()}</Text>
                  <AntDesign name="calendar" color={Colors.primary}  size={20} />
                </TouchableOpacity>
              </View>

					<View
						style={[
							styles.fieldBox,
							this.state.isWeightValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Weight</Text>
						<TextInput
							value={this.state.weight}
							onChangeText={(weight) => this.setState({ weight })}
							style={[styles.textfield,{width:'50%'}]}
							keyboardType="numeric"
							autoCompleteType="off"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.isHeightValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Height</Text>
						<TextInput
							value={this.state.height}
							onChangeText={(height) => this.setState({ height })}
							style={[styles.textfield,{width:'50%'}]}
							keyboardType="numeric"
							autoCompleteType="off"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.isLengthValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Length</Text>
						<TextInput
							value={this.state.length}
							onChangeText={(length) => this.setState({ length })}
							style={[styles.textfield,{width:'50%'}]}
							keyboardType="numeric"
							autoCompleteType="off"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,
							this.state.isWidthValidationFailed ? styles.errorFieldBox : null,
						]}
					>
						<Text style={styles.labelName}>Width</Text>
						<TextInput
							value={this.state.width}
							onChangeText={(width) => this.setState({ width })}
							style={[styles.textfield,{width:'50%'}]}
							keyboardType="numeric"
							autoCompleteType="off"
						/>
					</View>

					<View
						style={[
							styles.fieldBox,{borderBottomWidth:0},
							this.state.isPerformerValidationFailed
								? styles.errorFieldBox
								: null,
						]}
					>
						<Text style={styles.labelName}>Performer</Text>
						<TextInput
							value={this.state.performer}
							onChangeText={(performer) => this.setState({ performer })}
							style={[styles.textfield,{width:'50%'}]}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
					</View>
					</View>

					<TouchableOpacity
						style={styles.button}
						onPress={this.saveMeasurementRecord}
					>
						<Text style={styles.textWhite}>Save Details</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
			<OverlayLoader visible={this.state.showLoader} />
			<DateTimePickerModal
        mode={'date'}
        display={Platform.OS == 'ios' ? 'inline' : 'default'}
        isVisible={this.state.show}
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
      />
		</Container>
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
// 	labelName: {
// 	    color: Colors.labelColor,
//     // lineHeight: 50,
//     fontSize: Colors.lableSize,
//     paddingLeft: 4,
//     height: "auto",
//     paddingVertical: 10,
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: "auto",
	
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
// 	},
// 	button: {
// 		alignItems: "center",
// 		backgroundColor: Colors.primary,
// 		padding: 10,
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 2,
// 		},
// 		shadowOpacity: 0.23,
// 		shadowRadius: 2.62,
// 		elevation: 4,
// 		borderRadius: 20,
// 		color: "#fff",
// 		marginVertical: 10,
// 	},
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 		fontSize:Colors.lableSize,
// 	},
// 	textInputIcon: {
// 		position: "absolute",
// 		bottom: 14,
// 		right: 10,
// 		marginLeft: 8,
// 		color: "#0482ED",
// 		zIndex: 99,
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
