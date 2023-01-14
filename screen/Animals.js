import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Container, Tab, Tabs, ScrollableTab } from "native-base";
import {
	IdDetails,
	Pedigree,
	ProfileNew,
	VaccineDetails,
	VaccinationDetails,
	Measurement,
	MedicalRecord,
	IncidentReporting,
	Enclosures,
	FeedingAssignments,
	Feedings,
	SalesTransfer,
	BriefView
} from "./AnimalDetails/index";
import Colors from "../config/colors";
import { Header } from "../component";
import AppContext from "../context/AppContext";
import Profile_Pedigree from "./AnimalDetails/Profile_Pedigree";
import globalStyles from "../config/Styles";
import styles from './Styles'
import BirthDetails from "./AnimalDetails/BirthDetails";
import Mortality from "./AnimalDetails/Mortality";
import IdentificationDetail from "./AnimalDetails/IndentificationDetails";
import SourceDetail from "./AnimalDetails/SourceDetail";
import Necropsy from "./AnimalDetails/Necropsy";
import Case from "./AnimalDetails/Case";

export default class AnimalsData extends React.Component {
	static contextType = AppContext;

	errorMessage = () => (
		<View style={[globalStyles.flex1,globalStyles.alignItemsCenter,globalStyles.justifyContentCenter]}
			>
			<Text>Please create profile at first.</Text>
		</View>
	);

	renderTabBar = (props) => {
		props.tabStyle = Object.create(props.tabStyle);
		return <ScrollableTab {...props} style={styles.scrollableTab} />;
	};

	render = () => (
		<Container>
			<Header
				leftIconName={"arrow-back"}
				title={"Animal Record"}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={() => {
					this.props.navigation.goBack();
				}}
			/>
			<Tabs
				renderTabBar={this.renderTabBar}
				tabBarUnderlineStyle={styles.underlineStyle}
				locked
			>
				<Tab
					heading="Brief View"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<BriefView {...this.props} />
					{/* <ProfileNew {...this.props} /> */}
				</Tab>
				<Tab
					heading="Profile and Pedigree"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<Profile_Pedigree {...this.props} />
					{/* <ProfileNew {...this.props} /> */}
				</Tab>

				<Tab
					heading="Birth Details"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<BirthDetails {...this.props} />
					
				</Tab>

				<Tab
					heading="Mortality"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<Mortality {...this.props} />
					
				</Tab>

				<Tab
					heading="Identification Details"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<IdentificationDetail {...this.props} />
				</Tab>

				<Tab
					heading="Source Detail"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<SourceDetail {...this.props} />
				</Tab>
				<Tab
					heading="Necropsy"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<Necropsy {...this.props} />
				</Tab>

				<Tab
					heading="Case"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<Case {...this.props} />
				</Tab>


				{/* <Tab
					heading="Profile"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<Pedigree {...this.props} /> */}
					{/* <ProfileNew {...this.props} /> */}
				{/* </Tab> */}
				{/* <Tab
					heading="Pedigree"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
					disabled
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<IdDetails {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab> */}
				<Tab
					heading="Enclosure History"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<Enclosures {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Vaccine"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
					disabled
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<VaccineDetails {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Vaccinations"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<VaccinationDetails {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Medical"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<MedicalRecord {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Incident"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<IncidentReporting {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Measurement"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<Measurement {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Feeding Assignment"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<FeedingAssignments {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Feeding"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<Feedings {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
				<Tab
					heading="Sales/Transfer"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<SalesTransfer {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab>
			</Tabs>
		</Container>
	);
}

// const styles = StyleSheet.create({
// 	activeTab: {
// 		backgroundColor: Colors.activeTab,
// 		height: 40,
// 		marginVertical: 5,
// 		borderRadius: 2,
// 		marginHorizontal: 5,
// 	},
// 	activeText: {
// 		color: Colors.white,
// 	},
// 	inActiveTab: {
// 		backgroundColor: Colors.inactiveTab,
// 		height: 40,
// 		marginVertical: 5,
// 		borderRadius: 2,
// 		marginHorizontal: 5,
// 	},
// 	inActiveText: {
// 		color: Colors.white,
// 	},
// 	underlineStyle: { backgroundColor: "transparent" },
// 	scrollableTab: {
// 		backgroundColor: Colors.white,
// 		// borderWidth: 0,
// 		borderColor: "#FFF",
// 	},
	
// });
