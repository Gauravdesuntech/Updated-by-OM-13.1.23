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
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../config/colors";
import { Header, Loader, ListEmpty } from "../../../component";
import AppContext from "../../../context/AppContext";
import { getFeedBasedOnConfig } from "../../../services/AllocationServices";
import styles from "../Styles";
import globalStyles from '../../../config/Styles'

export default class FeedBySection extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			feedMenu: [],
		};
	}

	componentDidMount = () => {
		console.log("......FeedBySection.......")
        this.onFocus = this.props.navigation.addListener('focus',()=>{
            this.getAllFeed()
        })
    }

    componentWillUnmount(){
        this.onFocus()
    }


	getAllFeed = () => {
		let obj={
			section_id : this.props.route.params.data.id
		}
		getFeedBasedOnConfig(obj).then((res)=>{
			this.setState({feedMenu:res})
		}).catch((err)=> console.log(err))
		
	}

	gotoTasks = (item) => {
		this.props.navigation.navigate("FeedingTask", {
			feed_id:item.feed_id,
			feed_name:item.name,
			section_id: item.section_id
		});
	};

	renderListItem = ({ item }) => (
		<TouchableHighlight
			underlayColor={"#eee"}
			onPress={this.gotoTasks.bind(this, item)}
		>
			<View style={styles.row}>
				<View style={styles.leftPart}>
					<Text style={styles.name}>{item.name}</Text>
				</View>
				<View style={styles.rightPart}>
					<Ionicons name="chevron-forward" style={styles.iconStyle} />
				</View>
			</View>
		</TouchableHighlight>
	);


	render = () => (
		<Container>
			<Header
			navigation={this.props.navigation}
				title={this.props.route.params.data.name}
			/>
			{this.state.isLoading ? (
				<Loader />
			) : (
            <FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.feedMenu}
					keyExtractor={(item, index) => item.feed_id.toString()}
					renderItem={this.renderListItem}
					initialNumToRender={this.state.feedMenu.length}
					refreshing={this.state.isLoading}
					onRefresh={this.onFocus}
					contentContainerStyle={
						this.state.feedMenu.length === 0 ? styles.container : null
					}
				/> 
				
			)}			
		</Container>
	);
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const tabHeight = 50;
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 	},
// 	row: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 10,
// 	},
// 	leftPart: {
// 		width: "75%",
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	name: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
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
// });
