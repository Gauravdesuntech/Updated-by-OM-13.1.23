import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import Colors from "../config/colors";
import { Header } from "../component";
import { Container } from "native-base";
import Loader from "../component/Loader";
import { getAnimalInfo } from "../services/APIServices";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
import styles from './Styles'


export default class AnimalInfo extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			id: props.route.params.id,
			animalInfo: undefined,
			isLoading: true,
		};
	}

	componentDidMount() {
		getAnimalInfo(this.state.id)
			.then((data) => {
				this.setState({
					isLoading: false,
					animalInfo: data,
				});
			})
			.catch((error) => console.log(error));
	}

	gotoBack = () => this.props.navigation.goBack();

	render = () => {
		let { animalInfo } = this.state;

		return (
			<Container>
				<Header
					leftIconName={"arrow-back"}
					rightIconName={"add"}
					title={this.props.route.params.common_name}
					leftIconShow={true}
					leftButtonFunc={this.gotoBack}
					rightIconShow={false}
				/>
				{this.state.isLoading ? (
					<Loader />
				) : (
					<View style={styles.container}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<Text style={{ fontSize: 20, color: "#444" }}>
								{animalInfo.english_name}
							</Text>
							<Text
								style={{
									fontSize: 16,
									color: "#444",
									fontStyle: "italic",
									opacity: 0.9,
								}}
							>
								{animalInfo.full_name}
							</Text>

							<View style={[globalStyles.flexDirectionRow,globalStyles.width100]}
								>
								<View style={{ width: "60%", paddingVertical: 10 }}>
									<View style={styles.para}>
										<Text style={styles.label}>Farm:</Text>
										<Text style={styles.text}>{animalInfo.farm}</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Origin:</Text>
										<Text style={styles.text}>{animalInfo.origin}</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Owner:</Text>
										<Text style={styles.text}>{animalInfo.owner}</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Group:</Text>
										<Text style={styles.text}>{animalInfo.group_name}</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Category:</Text>
										<Text style={styles.text}>{animalInfo.category_name}</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Sub Category:</Text>
										<Text style={styles.text}>
											{animalInfo.sub_category_name !== null
												? animalInfo.sub_category_name
												: "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Date of Birth:</Text>
										<Text style={styles.text}>
											{animalInfo.dob !== null ? animalInfo.dob : "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Place of Birth:</Text>
										<Text style={styles.text}>
											{animalInfo.place_of_birth !== null
												? animalInfo.place_of_birth
												: "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Sex:</Text>
										<Text style={styles.text}>
											{animalInfo.sex !== null ? animalInfo.sex : "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Sex Identification Type:</Text>
										<Text style={styles.text}>
											{animalInfo.sex_identification_type !== null
												? animalInfo.sex_identification_type
												: "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Father:</Text>
										<Text style={styles.text}>
											{animalInfo.father !== null ? animalInfo.father : "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Mother:</Text>
										<Text style={styles.text}>
											{animalInfo.mother !== null ? animalInfo.mother : "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Color:</Text>
										<Text style={styles.text}>
											{animalInfo.color !== null ? animalInfo.color : "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Quantity:</Text>
										<Text style={styles.text}>
											{animalInfo.qty !== null ? animalInfo.qty : "N/A"}
										</Text>
									</View>
									<View style={styles.para}>
										<Text style={styles.label}>Description:</Text>
										<Text style={styles.text}>
											{animalInfo.description !== null
												? animalInfo.description
												: "N/A"}
										</Text>
									</View>
								</View>
								<View style={{ width: "40%", alignItems: "center" }}>
									<Image
										style={styles.image}
										source={{ uri: animalInfo.image }}
										resizeMode="contain"
									/>
								</View>
							</View>
						</ScrollView>
					</View>
				)}
			</Container>
		);
	};
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingHorizontal: 5,
// 		paddingVertical: 5,
// 	},
// 	image: {
// 		width: 100,
// 		height: 100,
// 	},
// 	para: {
// 		marginBottom: 8,
// 	},
// 	label: {
// 		fontSize: 14,
// 		fontWeight: "bold",
// 	},
// 	text: {
// 		fontSize: 14,
// 	},
// });
