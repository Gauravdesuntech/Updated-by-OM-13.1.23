import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	FlatList,
	TextInput,
	TouchableOpacity,
	Dimensions,
	Modal,
	SafeAreaView,
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getItemTypes, getProducts } from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import { getFeedMenu, createCleaningConfig, getallFeedMenus, createFeedConfig } from "../../services/AllocationServices";
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import CustomCheckbox from '../../component/tasks/AddTodo/CustomCheckBox';
import Modal2 from "react-native-modal";
import styles from './Styles'
import globalStyles from '../../config/Styles'

export default class FeedMenu extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			feedMenu: [],
			activeTabKey: 'feed',
			inChargeData: this.props.route.params.data,
			time: new Date(),
			today: new Date(),
			show: false,
			mode: '',
			isModalOpen: false,
			feed_detail: "",
			item:'',
		};
	}

	componentDidMount = () => {
		this.onFocus = this.props.navigation.addListener('focus', () => {
			this.getAllFeed()
		})
	}

	componentWillUnmount() {
		this.onFocus()
	}


	getAllFeed = () => {
		let obj = {
			section_id: this.props.route.params.data.id
		}
		// getFeedMenu().then((res) => {
		// 	// console.log(res);
		// 	this.setState({ feedMenu: res })
		// }).catch((err) => console.log(err))
		getallFeedMenus(obj).then((res) => {
			console.log(res[0]);
			let data = res.map((item)=>{
				return {
					feed_time: item.feed_time,
					  id: item.id,
					  name: item.name,
					  parent_cat: item.parent_cat,
					  isStatus : false,
				}
			})
			this.setState({ feedMenu: data })
		}).catch((err) => console.log(err))
	}

	handelRefresh = () => {
		this.getAllFeed()
	}

	showDatePicker = (mode , item) => {
		this.setState({ show: true, mode: mode , item : item })
	};

	handleConfirm = (selectDate) => {
		let item1 = this.state.item
		selectDate = moment(selectDate).format('HH:mm:ss')
		item1.feed_time.time = selectDate
        const index2 = this.state.feedMenu.findIndex(
            item => item1.id === item.id
        )
        this.state.feedMenu[index2] = item1

        this.setState({ feedMenu: this.state.feedMenu });
		// this.setState({
		// 	time: selectDate
		// })
		this.hideDatePicker();
	}

	hideDatePicker = () => {
		this.setState({ show: false })
	}


	closeModal = () => {
		this.setState({
			isModalOpen: false
		})
	}

	// Submit data for cleaning

	handleSubmit = () => {
		let { inChargeData } = this.state;
		let user_id = this.context.userDetails.id
		let users_data = JSON.stringify(inChargeData.users)
		let users_ids = inChargeData.users.map((user) => {
			return user.id
		})
		users_ids = users_ids.join(',')
		let obj = {
			allocated_to: users_data,
			approval: 0,
			approve_anyone: 1,
			assign_level_1: users_data,
			created_by: user_id,
			description: inChargeData.name + '-' + 'Cleaning (' + inChargeData.id + '_00' + Math.floor((Math.random() * 100)) + ')',
			instructions: "",
			is_photo_proof: 1,
			name: inChargeData.name + '-' + 'Cleaning_00' + Math.floor((Math.random() * 100)),
			notification_after_task: users_data,
			notofication: undefined,
			point: "0",
			priority: "Medium",
			reminder: "No Reminder",
			schedule_end: moment(this.state.today).add(1, 'days').format('YYYY-MM-DD'),
			schedule_start: moment(this.state.today).format('YYYY-MM-DD'),
			schedule_time: moment(this.state.time).format('HH:mm'),
			schedule_type: "daily",
			status: "pending",
			sub_tasks: undefined,
			task_related_to: "Section",
			task_related_to_id: inChargeData.id,
			task_related_to_name: inChargeData.name,
			task_type: "Individual",
			users: users_ids,
		}
		createCleaningConfig(obj).then((res) => {
			if (res.is_success) {
				alert("Created Successfully !!")
			} else {
				alert("Something went wrong !!")
			}
		}).catch((err) => {
			console.log(err)
		})
	}

	gotoItems = (item) => {
		// this.props.navigation.navigate("FeedDetails", {
		// 	feed_id: item.id,
		// 	feed_name: item.name,
		// 	subCat_id: item.parent_cat,
		// 	inChargeData: this.state.inChargeData
		// });

		const timeString = item.feed_time?.time
		this.setState({
			isModalOpen: true,
			feed_detail: item,
			time: item.feed_time != null ? moment(item.feed_time.time, 'HH:mm:ss').format() : new Date()
		})
	};

	submitFeedSchedule = (item) => {
		this.setState({isLoading:true})
		let { inChargeData} = this.state;
		let user_id = this.context.userDetails.id
		let users_data = JSON.stringify(inChargeData.users)
		let users_ids = inChargeData.users.map((user) => {
			return user.id
		})

		users_ids = users_ids.join(',')
		let obj = {
			allocated_to: users_data,
			approval: 0,
			approve_anyone: 1,
			assign_level_1: users_data,
			category_id: item.id,
			created_by: user_id,
			description: inChargeData.name + '-' + item.name + '(' + inChargeData.id + '_' + item.id + ')',
			instructions: "",
			is_photo_proof: 1,
			name: inChargeData.name + '-' + item.name,
			notification_after_task: users_data,
			notofication: undefined,
			point: "0",
			priority: "Medium",
			reminder: "No Reminder",
			schedule_end: moment(this.state.today).add(1, 'days').format('YYYY-MM-DD'),
			schedule_start: moment(this.state.today).format('YYYY-MM-DD'),
			schedule_time: moment(item.feed_time.time,'HH:mm:ss').format('HH:mm'),
			schedule_type: "daily",
			status: "pending",
			sub_tasks: undefined,
			task_related_to: "Section",
			task_related_to_id: inChargeData.id,
			task_related_to_name: inChargeData.name,
			task_type: "Individual",
			users: users_ids,
			task_status: Number(item.isStatus)
		}
		// console.log("............ data................", obj)
		// return;
		createFeedConfig(obj).then((res) => {
			if (res.is_success) {
				this.setState({ isLoading: false, isModalOpen: false, })
				alert("Created Successfully !!")
				this.getAllFeed()
			} else {
				this.setState({ isLoading: false, isModalOpen: false, })
				alert("Something went wrong !!")
			}
		}).catch((err) => {
			this.setState({ isLoading: false, isModalOpen: false, })
			console.log(err)
		})
	}


	checkAddActionPermissions = () => {
		if (this.state.isLoading == false) {
			if (this.context.userDetails.action_types.includes("Add")) {
				return this.gotoAddSection;
			} else {
				return undefined
			}
		} else {
			return undefined
		}
	}

	gotoAddSection = () => {
		this.props.navigation.navigate("AddAllocation", {
			inChargeData: this.state.inChargeData
		});
	};

	gotoBack = () => {
		this.props.navigation.goBack();
	};

	taskStatus = (v) => {
        v.isStatus = !v.isStatus;
        const index2 = this.state.feedMenu.findIndex(
            item => v.id === item.id
        )
        this.state.feedMenu[index2] = v

        this.setState({ feedMenu: this.state.feedMenu });
	}

	setActiveTab = (key) =>
		this.setState(
			{
				activeTabKey: key,
			});

	renderListItem = ({ item }) => {
		// return
		return (
			<View style={[styles.fieldBox,]}>
				<View style={styles.leftPart}>
					<Text style={styles.name}>{item.name}</Text>
				</View>
				{/* <View style={styles.rightPart}>
					<Ionicons name="chevron-forward" style={styles.iconStyle} />
				</View> */}
				<View style={[styles.dateField]}>
					{item.feed_time?.time != null ?
						<TouchableOpacity onPress={() => { this.showDatePicker("time" , item) }}>
							<Text>{moment(item.feed_time.time, 'HH:mm:ss').format("LT")}</Text>
						</TouchableOpacity>
						: null}

				</View>
				<View style={[styles.dateField]}>
					<CustomCheckbox
						handler={()=>this.taskStatus(item)}
						value={item.isStatus}
					/>

				</View>
				<View style={[styles.dateField]}>
					<TouchableOpacity activeOpacity={1} onPress={() => this.submitFeedSchedule(item)}>
						<Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
					</TouchableOpacity>
				</View>

				{/* <Modal2
					isVisible={this.state.isModalOpen}
					onBackdropPress={this.closeModal}
					backdropOpacity={0.1}
				>
					<View style={{
						backgroundColor: Colors.white,
						padding: 20,
						width: windowWidth - 40,
						height: windowHeight - 500,
						backdropColor: Colors.white,
					}}>
						<ScrollView
							showsVerticalScrollIndicator={false}
							style={{ height: '80%' }}
						>
							<View style={[styles.fieldBox]}>
								<Text style={styles.labelName}>Select Time : </Text>
								<TouchableOpacity onPress={() => { this.showDatePicker("time") }} style={[styles.textfield]}>
									<Text style={[styles.dateField]}>{moment(this.state.time).format("LT")}</Text>
								</TouchableOpacity>
							</View>
							<View>
								<CustomCheckbox
									handler={() => { this.setState({ status: !this.state.status }) }}
									value={this.state.status}
									label={"Task Status"}
									leftTextStyle={styles.dateField}
								/>
							</View>

							<View style={styles.buttonsContainer}>
								<TouchableOpacity activeOpacity={1} onPress={() => this.submitFeedSchedule(item)}>
									<Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
								</TouchableOpacity>

								<TouchableOpacity activeOpacity={1} onPress={this.closeModal}>
									<Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>

				</Modal2> */}

			</View>
		)
	};


	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<Header
					title={this.state.inChargeData ? this.state.inChargeData.name : this.state.activeTabKey == "feed" ? "Feed Menu" : "Cleaning Menu"}
					addAction={this.checkAddActionPermissions()}
				/>
				{this.state.inChargeData.users.length <= 0 ?
					<View style={[globalStyles.alignItemsCenter,
						{marginTop: 20 }]}>
						<Text style={{ color: Colors.danger }}>{"No Section In Charge, Please add first !!"}</Text>
					</View>
					:
					<>
						<View style={styles.tabContainer}>

							<TouchableOpacity
								onPress={this.setActiveTab.bind(this, "feed")}
								style={[
									styles.tab,
									this.state.activeTabKey == "feed" ? styles.activeTab : null,
								]}
							>
								<Text
									style={
										this.state.activeTabKey == "feed"
											? styles.activeText
											: styles.inActiveText
									}
								>
									Feeding Schedule
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={this.setActiveTab.bind(this, "clean")}
								style={[
									styles.tab,
									this.state.activeTabKey == "clean" ? styles.activeTab : null,
								]}
							>
								<Text
									style={
										this.state.activeTabKey == "clean"
											? styles.activeText
											: styles.inActiveText
									}
								>
									Cleaning Schedule
								</Text>
							</TouchableOpacity>
						</View>
						{this.state.isLoading ? (
							<Loader />
						) : (<>
							{this.state.activeTabKey == 'feed' ?
								<View style={styles.body}>
									<FlatList
										ListEmptyComponent={() => <ListEmpty />}
										data={this.state.feedMenu}
										keyExtractor={(item, index) => item.id.toString()}
										renderItem={this.renderListItem}
										initialNumToRender={this.state.feedMenu.length}
										refreshing={this.state.isLoading}
										onRefresh={this.handelRefresh}
										contentContainerStyle={
											this.state.feedMenu.length === 0 ? styles.container : null
										}
									/>
								</View>
								:
								<View style={styles.body}>
									<ScrollView
										showsVerticalScrollIndicator={false}
										style={globalStyles.width80}
									>
										<View style={[styles.fieldBox]}>
											<Text style={styles.labelName}>Select Time : </Text>
											<TouchableOpacity onPress={() => { this.showDatePicker("time") }} 
											style={[styles.textfield]}>
												<Text style={[styles.dateField]}>{moment(this.state.time).format("LT")}</Text>
											</TouchableOpacity>
										</View>
										<View>
											{/* <CustomCheckbox
                            handler={() => { this.setState({ status: !this.state.status }) }}
                            value={this.state.status}
                            label={"Task Status"}
                            leftTextStyle={styles.dateField}
                        /> */}
										</View>

										<View style={styles.buttonsContainer}>
											<TouchableOpacity activeOpacity={1} onPress={this.handleSubmit}>
												<Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
											</TouchableOpacity>

											<TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
												<Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
											</TouchableOpacity>
										</View>
									</ScrollView>
								</View>
							}

						</>)}
						<DateTimePickerModal
							mode={this.state.mode}
							display={Platform.OS == 'ios' ? 'inline' : 'default'}
							isVisible={this.state.show}
							onConfirm={this.handleConfirm}
							onCancel={this.hideDatePicker}
						/>
					</>
				}

			</SafeAreaView>
		);
	}
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const tabHeight = 50;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 	},
// 	body: {
// 		flex: 9,
// 		padding: 5
// 	},
// 	row: {
// 		flexDirection: "row",
// 		paddingHorizontal: 5,
// 		paddingVertical: 10,
// 	},
// 	leftPart: {
// 		width: '22%',
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	name: {
// 		color: Colors.labelColor,
// 		// lineHeight: 40,
// 		fontSize: 19,
// 		paddingLeft: 4,
// 		height: 'auto',
// 		paddingVertical: 5
// 	},
// 	tabContainer: {
// 		width: "100%",
// 		height: tabHeight,
// 		flexDirection: "row",
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#d1d1d1",
// 		borderTopWidth: 1,
// 		borderTopColor: Colors.primary,
// 		elevation: 1,
// 	},
// 	downloadBtn: {
// 		flexDirection: "row",
// 		paddingHorizontal: 5,
// 		paddingVertical: 3,
// 		borderWidth: StyleSheet.hairlineWidth,
// 		borderRadius: 3,
// 		marginLeft: 20,
// 	},
// 	tab: {
// 		flex: 1,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		height: tabHeight,
// 	},
// 	underlineStyle: {
// 		backgroundColor: Colors.primary,
// 		height: 3,
// 	},
// 	activeTab: {
// 		height: tabHeight - 1,
// 		borderBottomWidth: 2,
// 		borderBottomColor: Colors.primary,
// 	},
// 	activeText: {
// 		fontSize: 14,
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	inActiveText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	fieldBox: {
// 		alignItems: 'center',
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		paddingHorizontal: 10,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		height: 'auto',
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 		// shadowColor: "#999",
// 		// shadowOffset: {
// 		// 	width: 0,
// 		// 	height: 1,
// 		// },
// 		// shadowOpacity: 0.22,
// 		// shadowRadius: 2.22,
// 		// elevation: 3,
// 	},

// 	labelName: {
// 		color: Colors.labelColor,
// 		// lineHeight: 40,
// 		fontSize: 19,
// 		paddingLeft: 4,
// 		height: 'auto',
// 		paddingVertical: 10
// 	},
// 	dateField: {
// 		backgroundColor: "#fff",
// 		height: 'auto',
// 		flexWrap: 'wrap',
// 		fontSize: 19,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		width: '22%',
// 		padding: 5,
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 30,
// 	},
// 	buttonText: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 	},
// 	saveBtnText: {
// 		color: Colors.primary,
// 	},
// 	exitBtnText: {
// 		color: Colors.activeTab,
// 	},
// });
