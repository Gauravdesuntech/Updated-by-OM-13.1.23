import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	Dimensions,
	FlatList,
	TouchableHighlight
} from "react-native";
import { Container } from "native-base";
import Colors from "../config/colors";
import { Header, AnimalSearchModal } from "../component";
import AppContext from "../context/AppContext";
import { Configs } from "../config";
import { OverlayLoader } from "../component";
import { getAnimalGroups, getRandomCommonName } from "../services/APIServices";
import { getUserDetails } from "../services/UserManagementServices";
import { getUserMenu, capitalize } from "../utils/Util";
import Carousel from "react-native-snap-carousel";
import { ScrollView } from "react-native-gesture-handler";
import { SliderBox } from "react-native-image-slider-box";
import globalStyles from "../config/Styles";
import styles from './Styles'



const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDE_WIDTH = Math.round((SLIDER_WIDTH * 98) / 100);
const itemHorizontalMargin = (2 * SLIDER_WIDTH) / 100;
const ITEM_WIDTH = SLIDE_WIDTH + itemHorizontalMargin * 2;
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 2) / 3);


export default class Home extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			isSearching: true,
			isSearchModalOpen: false,
			isLoading: false,
			searchBy: "common_name",
			newMenuStatus: false,
			searchValue: "",
			searchData: [],
			menu: Configs.HOME_SCREEN_MENUES,
			animalGroups: [],
			randomAnimal: [],
			loadImage: '',
		};
		this.searchModalRef = React.createRef();
	}

	setUserMenu() {
		this.setState({ isLoading: true });
		const userId = this.context.userDetails.id;
		let cid = this.context.userDetails.cid;
		Promise.all([getAnimalGroups(cid), getUserDetails(userId), getRandomCommonName(cid)]).then((response) => {
			this.setState({ isLoading: false });
			let userData = response[1];
			this.setState({
				animalGroups: response[0],
				menu: getUserMenu(userData.module_permissions),
				newMenuStatus: true,
				randomAnimal: response[2]
			});
		}).catch((err) => { console.log(err) });
	}

	componentDidMount() {
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			this.setUserMenu();
		});

		this.setUserMenu();
	}

	componentWillUnmount() {
		this.focusListeners();
	}

	toggleDrawer = () => this.props.navigation.toggleDrawer();
	// gotoRecordManagament = () => this.props.navigation.navigate("AnimalGroups");
	// gotoFeedManagament = () => this.props.navigation.navigate("FeedManagement");
	// gotoStaffManagament = () => this.props.navigation.navigate("Departments");
	gotoTaskManagament = () => this.props.navigation.navigate("Todo");

	// gotoEnclosureManagament = () =>
	// 	this.props.navigation.navigate("EnclosureMgmtHome");

	// gotoInventoryManagement = () =>
	// 	this.props.navigation.navigate("InventoryHome");

	openSearchModal = () => this.searchModalRef.current.openModal();

	checkEditActionPermissions = (item) => {
		if (this.context.userDetails.action_types.includes("Edit")) {
			this.gotoEditGroup(item)
		}
	}

	gotoCategory = (item) => {
		this.props.navigation.navigate("Category", {
			classID: item.id,
			className: item.group_name,
			enableAddButton: false,
		});
	};

	gotoEditGroup = (item) => {
		this.props.navigation.navigate("Add Group", {
			id: item.id,
			imageURI: item.image,
			groupName: item.group_name,
			groupDetails: item.group_details !== null ? item.group_details : "",
		});
	};

	_renderItem = ({ item, index }, parallaxProps) => {
		console.log(this.state.loadImage);
		return (
			<>
				<View style={[globalStyles.width100,globalStyles.justifyContentCenter,
				globalStyles.alignItemsCenter,
					{borderRadius: 20}]}>
					<View key={item.id.toString()} style={styles.slide}>
						<Image 
						style={styles.sliderImage} 
						source={{ uri: this.state.loadImage==true ? item.illustration: item.cover_image}} 
						onLoadStart={(e)=> this.setState({loadImage:true})}
						// onLoad={(e)=>this.setState({loadImage:'https://reactnative-examples.com/wp-content/uploads/2022/02/onLoadEnd.png'})}
						onLoadEnd={(e)=>this.setState({loadImage:false})}
						/>
						{/* } */}
					</View>
					<View
						style={{

							position: 'absolute',
							resizeMode: 'cover',
							bottom: 0,
							backgroundColor: 'rgba(0,0,0,0.3)',
							alignItems: 'flex-end',
							justifyContent: 'center',
							paddingHorizontal: 10,
							borderRadius: 2,
							right: 3
						}}>
						<View >
							<Text style={{ fontSize: 16, paddingVertical: 5, color: Colors.white }}>{`${item.common_name}`}</Text>
						</View>
						{/* <View>
						<Text>{item.fun_facts}</Text>
					</View> */}
					</View>
				</View>
				{/* <View style={styles.funFactsContainer}>
					<Image
						style={styles.funFactsBgImage}
						source={require("../assets/image/yellow-bg-map.png")}
						resizeMode="contain"
					/>
					<Text style={styles.funtFatcsHeading}>Fun Facts</Text>

					<View style={styles.funFactsTextContainer}>
						<Text
							numberOfLines={5}
							ellipsizeMode="tail"
							style={styles.funFactsText}
						>
							{item.fun_facts}
						</Text>
					</View>
				</View> */}
			</>
		);
	}


	renderItemMenu = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => {
				
					if (item.screen != '') {						
							this.props.navigation.navigate(item.screen);
					}
				}}
				style={[styles.btn, styles.pl12, {
					borderBottomColor: "#eee",
					borderBottomWidth: 1,
				}]}
			>
				<View style={styles.imgContainer}>
					<Image
						style={styles.image}
						source={item.icon}
						resizeMode="contain"
					/>
				</View>
				<Text style={styles.title}>{item.name}</Text>
			</TouchableOpacity>
		)
	}


	renderAnimalGroupItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={{ backgroundColor: 'white', marginLeft: 5, overflow: 'hidden', }}
				activeOpacity={0.5}
				onPress={this.gotoCategory.bind(this, item)}
			// onLongPress={this.checkEditActionPermissions.bind(this, item)}
			>
				<View style={styles.view}>
					<View style={{ justifyContent: "center", overflow: 'hidden' }}>
						<Image
							style={[styles.image, { height: 35, width: 35 }]}
							source={{ uri: item.image }}
							resizeMode="contain"
						/>
					</View>
					<View style={{ justifyContent: "center", height: 25 }}>
						<Text style={styles.name}>{capitalize(item.group_name)}</Text>
						{/* <Text style={[styles.name,{fontSize: 12}]}>{`M - ${item.total_male_animal}, F - ${item.total_female_animal}`}</Text> */}
					</View>
					{/* {this.context.userDetails.action_types.includes(Configs.USER_ACTION_TYPES_CHECKING.stats) ?
						(
							<View
								style={{
									flexDirection: "row",
									justifyContent: "flex-end",
									alignItems: "center",
								}}
							>
								<View style={styles.qtyContainer}>
									<Text style={styles.qty}>{item.total_animal}</Text>
								</View>
							</View>
						)
						: null} */}
				</View>
			</TouchableOpacity>
		)
	};
	

	render = () => {
		const carouselItems = this.state.randomAnimal.map((x)=>{
			return (
				x.cover_image
			//   {
			// 	id: x.id,
			// 	common_name: x.common_name,
			// 	cover_image:x.cover_image,
			// 	illustration: 'https://reactnative-examples.com/wp-content/uploads/2022/02/onLoadEnd.png',
			//   }
			)
		  })
	return(
		<Container>
			<Header
				title={"Home"}
				searchAction={this.openSearchModal}
			/>
			{this.state.isLoading === true ? (
				<OverlayLoader visible={this.state.isLoading} />
			) : (
				<View style={styles.container}>

					<View style={styles.carouselConatainer}>
						{/* <Carousel

							layout={'default'}
							inactiveSlideOpacity={0.6}
							inactiveSlideScale={0.65}
							firstItem={0}
							sliderWidth={SLIDER_WIDTH}
							itemWidth={ITEM_WIDTH}
							data={carouselItems}
							renderItem={this._renderItem}
							containerCustomStyle={{ overflow: 'hidden' }}
							contentContainerCustomStyle={{ overflow: 'hidden' }}
							lockScrollWhileSnapping={true}
							activeAnimationType={'timing'}
							activeSlideAlignment={'center'}
							autoplay
							loop
						/> */}
						<SliderBox
								// ImageComponent={FastImage}
								images={carouselItems}
								firstItem={0}
								sliderBoxHeight={200}
								onCurrentImagePressed={index => console.log(`image ${index} pressed`)}
								// dotColor="#FFEE58"
								// inactiveDotColor="#90A4AE"
								paginationBoxVerticalPadding={20}
								autoplay
								circleLoop
								resizeMethod={'resize'}
								resizeMode={'cover'}
								paginationBoxStyle={{
									position: "absolute",
									bottom: 0,
									padding: 0,
									alignItems: "center",
									alignSelf: "center",
									justifyContent: "center",
									paddingVertical: 10
								}}
								dotStyle={{
									width: 0,
									height: 0,
									borderRadius: 3,
									marginHorizontal: 0,
									padding: 0,
									margin: 0,
									backgroundColor: "rgba(128, 128, 128, 0.92)"
								}}
								currentImageEmitter={item=>  this.setState({loadImage:item})}
								// ImageComponentStyle={{borderRadius: 15, width: '97%', marginTop: 5}}
								// LoaderComponent={<Text>Loading</Text>}
								ImageLoader={<Text>Loading</Text>}
								imageLoadingColor={Colors.primary}
								/>
						{this.state.randomAnimal.map((item,index)=>{
							return(
						<View
							style={[globalStyles.justifyContentCenter,
								{
							position: 'absolute',
							resizeMode: 'cover',
							bottom: 0,
							backgroundColor: 'rgba(0,0,0,0.3)',
							alignItems: 'flex-end',
							paddingHorizontal: 10,
							borderRadius: 2,
							right: 3
						}]}>
						<View >
							<Text style={[globalStyles.fontSize16,
							{paddingVertical: 5, color: Colors.white }]}>
							{`${item.common_name}`}</Text>
						</View>
						{/* <View>
						<Text>{item.fun_facts}</Text>
					</View> */}
					</View>	
			)
			})
			}								
					</View>
					<View style={{ backgroundColor: '#ff00' }}>
						<FlatList
							data={this.state.animalGroups}
							keyExtractor={(item) => item.id.toString()}
							renderItem={this.renderAnimalGroupItem}
							extraData={this.state.animalGroups}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						/>
					</View>

					<FlatList
					  showsVerticalScrollIndicator ={false}
					  showsHorizontalScrollIndicator={false}
						data={this.state.menu}
						keyExtractor={(item) => item.id.toString()}
						renderItem={this.renderItemMenu}
						extraData={this.state.newMenuStatus}
						contentContainerStyle={{
							alignSelf: 'center', marginTop: 5, 
							borderTopLeftRadius: 5, borderTopRightRadius: 5, 
							borderWidth: 1, width: '98%', borderColor: '#eee', 
							borderBottomColor: 'white'
						}}
					/>

				</View>
			)}
			<AnimalSearchModal
				ref={this.searchModalRef}
				navigation={this.props.navigation}
			/>
		</Container>
	);
}
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#FFFFFF",
// 	},
// 	pl12: {
// 		paddingLeft: 12,
// 	},
// 	pr12: {
// 		paddingRight: 12,
// 	},
// 	btnContainer: {
// 		paddingTop: 12,
// 		flexDirection: "row",
// 		flexWrap: "wrap",
// 	},
// 	btn: {
// 		// width: Math.floor(windowWidth / 2),
// 		paddingVertical: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 	},
// 	imgContainer: {
// 		width: "20%",
// 	},
// 	image: {
// 		width: 40,
// 		height: 40,
// 		resizeMode: 'contain'


// 	},
// 	title: {
// 		width: "72%",
// 		fontSize: 16,
// 		color: Colors.textColor,
// 	},
// 	view: {
// 		height: 70,
// 		width: 70,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	},
// 	shadwEffect: {
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 0.5,
// 		},
// 		shadowOpacity: 0.18,
// 		shadowRadius: 1.00,
// 	},
// 	slide: {
// 		width: SLIDE_WIDTH,
// 		height: ITEM_HEIGHT,
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		resizeMode: 'cover',

// 	},
// 	sliderImage: {
// 		height: ITEM_HEIGHT,
// 		width: ITEM_WIDTH,

// 	},
// 	carouselConatainer: {
// 		marginBottom: 0,
// 		position: 'relative',
// 		height: ITEM_HEIGHT,



// 	},
// 	funFactsContainer: {
// 		width: windowWidth,
// 		height: 120,
// 		paddingHorizontal: 8,
// 		marginTop: 2,
// 	},
// 	funFactsBgImage: {
// 		width: windowWidth - 16,
// 		height: 120,
// 	},
// 	funtFatcsHeading: {
// 		fontSize: 14,
// 		fontWeight: "bold",
// 		color: Colors.lightBrown,
// 		position: "absolute",
// 		top: 0,
// 		left: 20,
// 	},
// 	funFactsTextContainer: {
// 		position: "absolute",
// 		top: 25,
// 		left: 40,
// 		width: Math.floor(windowWidth * 0.6),
// 		height: 70,
// 	},
// 	funFactsText: {
// 		fontSize: 12,
// 		color: Colors.black,
// 	},
// 	name: {
// 		fontSize: 12,
// 		color: Colors.textColor,
// 	},
// });
