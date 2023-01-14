import React from "react";
import {
<<<<<<< HEAD
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	Alert,
=======
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
} from "react-native";
import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../component/Header";
import ModalMenu from "../component/ModalMenu";
import OverlayLoader from "../component/OverlayLoader";
import { Colors } from "../config";
import { getFileData } from "../utils/Util";
import {
<<<<<<< HEAD
	getAnimalGroups,
	getAllCategory,
	getAllSpecies,
	getAllSpeciesByClass,
	addSubSpecies,
} from "../services/APIServices";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";
import styles from './Styles'


export default class AddSpecies extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			isAnimalClassMenuOpen: false,
			animalClass: [],
			isSpeciesMenuOpen: false,
			modalVisible: false,
			species: [],
			permissionGranted: false,
			classID: undefined,
			className: undefined,
			speciesID: undefined,
			speciesName: undefined,
			imageURI: undefined,
			imageData: undefined,
			subSpeciesName: "",
			prority: undefined,
			description: "",
			hasImageURIValidationError: false,
			hasClassNameValidationError: false,
			hasSpeciesNameValidationError: false,
			hasSubSpeciesNameValidationError: false,
			hasPriorityValidationError: false,
			hasDescriptionValidationError: false,
			showLoader: true,
		};

		this.formScrollViewRef = React.createRef();
	}

	componentDidMount = () => {
		let cid = this.context.userDetails.cid;
		getAnimalGroups(cid)
			.then((data) => {
				this.setState({
					animalClass: data,
					showLoader: false,
				});
			})
			.catch((error) => console.log(error));
	};

	toggleAnimalClassMenu = () =>
		this.setState({ isAnimalClassMenuOpen: !this.state.isAnimalClassMenuOpen });

	toggleSpeciesMenu = () =>
		this.setState({ isSpeciesMenuOpen: !this.state.isSpeciesMenuOpen });

	toggleModalVisible = () =>
		this.setState({ modalVisible: !this.state.modalVisible });

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					imageURI: undefined,
					imageData: undefined,
				});

				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: false,
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						this.setState({
							imageURI: result.uri,
							imageData: getFileData(result),
							hasImageURIValidationError: false,
						});
					}
				});
			} else {
				Alert.alert("Please allow permission to choose an icon");
			}
		});
	};

	setClassData = (v) =>
		this.setState(
			{
				classID: v.id,
				className: v.group_name,
				isAnimalClassMenuOpen: false,
				showLoader: true,
			},
			() => {
				let cid = this.context.userDetails.cid;
				getAllSpeciesByClass(cid, v.id).then((arr) => {
					this.setState({
						species: arr,
						showLoader: false,
					});
				});
			}
		);

	setSpeciesData = (v) =>
		this.setState({
			speciesID: v.id,
			speciesName: v.species_name,
			isSpeciesMenuOpen: false,
		});

	setPriority = (v) => this.setState({ prority: v, modalVisible: false });

	scrollToScrollViewTop = () =>
		this.formScrollViewRef.current.scrollTo({
			x: 0,
			y: 0,
			animated: true,
		});

	addSubSpecies = () => {
		let { imageURI, classID, speciesID, subSpeciesName, prority, description } =
			this.state;
		this.setState(
			{
				hasImageURIValidationError: false,
				hasClassNameValidationError: false,
				hasSpeciesNameValidationError: false,
				hasSubSpeciesNameValidationError: false,
				hasPriorityValidationError: false,
				hasDescriptionValidationError: false,
			},
			() => {
				if (typeof imageURI === "undefined") {
					this.setState({ hasImageURIValidationError: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (typeof classID === "undefined") {
					this.setState({ hasClassNameValidationError: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (typeof speciesID === "undefined") {
					this.setState({ hasSpeciesNameValidationError: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (subSpeciesName.trim().length === 0) {
					this.setState({ hasSubSpeciesNameValidationError: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (typeof prority === "undefined") {
					this.setState({ hasPriorityValidationError: true });
					this.scrollToScrollViewTop();
					return false;
				} else if (description.trim().length === 0) {
					this.setState({ hasDescriptionValidationError: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let obj = {
						cid: this.context.userDetails.cid,
						class_id: classID,
						sub_species_icon: this.state.imageData,
						sub_species_name: subSpeciesName,
						prority: prority,
						description: description,
						species_id: speciesID,
					};

					addSubSpecies(obj)
						.then((response) => {
							let subSpecies = this.context.subSpecies;
							subSpecies.unshift(response.data);
							this.context.setSubSpecies(subSpecies);

							this.setState({ showLoader: false });
							this.gotoBack();
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	gotoBack = () => this.props.navigation.goBack();

	render = () => (
		<Container>
			<OverlayLoader visible={this.state.showLoader} />
			<Header
				leftIconName={"arrow-back"}
				title={"Add Sub Species"}
				leftIconShow={true}
				rightIconShow={false}
				leftButtonFunc={this.gotoBack}
			/>
			<View style={styles.container}>
				<ScrollView ref={this.formScrollViewRef}>
					<View style={styles.chooseCatContainer}>
						<Text style={styles.name}>Choose Icon</Text>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.imageContainer}
							onPress={this.chooseIcon}
						>
							{typeof this.state.imageURI !== "undefined" ? (
								<Image
									style={styles.image}
									source={{ uri: this.state.imageURI }}
								/>
							) : (
								<Ionicons name="image" style={styles.defaultImgIcon} />
							)}
						</TouchableOpacity>
					</View>
					{this.state.hasImageURIValidationError ? (
						<View style={{ marginRight: 10 }}>
							<Text style={styles.errorText}>Choose an icon</Text>
						</View>
					) : null}

					<View style={styles.inputContainer}>
						<Text style={styles.name}>Choose Class</Text>
						<TouchableOpacity
							activeOpacity={1}
							onPress={this.toggleAnimalClassMenu}
							style={[styles.inputText, globalStyles.justifyContentCenter]}
						>
							<Text style={{ fontSize: Colors.textSize, }}>{this.state.className}</Text>
						</TouchableOpacity>
						{this.state.hasClassNameValidationError ? (
							<Text style={styles.errorText}>Choose animal class</Text>
						) : null}
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.name}>Species Name</Text>
						<TouchableOpacity
							activeOpacity={1}
							onPress={this.toggleSpeciesMenu}
							style={[styles.inputText, globalStyles.justifyContentCenter]}
						>
							<Text style={{ fontSize: Colors.textSize, }}>{this.state.speciesName}</Text>
						</TouchableOpacity>
						{this.state.hasSpeciesNameValidationError ? (
							<Text style={styles.errorText}>Choose species name</Text>
						) : null}
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.name}>Sub Species Name</Text>
						<TextInput
							value={this.state.subSpeciesName}
							style={styles.inputText}
							onChangeText={(subSpeciesName) =>
								this.setState({ subSpeciesName })
							}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
						{this.state.hasSubSpeciesNameValidationError ? (
							<Text style={styles.errorText}>Enter sub species name</Text>
						) : null}
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.name}>Choose Priority</Text>
						<TouchableOpacity
							activeOpacity={1}
							onPress={this.toggleModalVisible}
							style={[styles.inputText, globalStyles.justifyContentCenter]}
						>
							<Text style={{ fontSize: Colors.textSize, }}>{this.state.prority}</Text>
						</TouchableOpacity>
						{this.state.hasPriorityValidationError ? (
							<Text style={styles.errorText}>Choose priority</Text>
						) : null}
					</View>

					<View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
						<Text style={styles.name}>Description</Text>
						<TextInput
							multiline={true}
							numberOfLines={10}
							style={styles.inputTextArea}
							value={this.state.description}
							onChangeText={(description) => this.setState({ description })}
							autoCompleteType="off"
							autoCapitalize="words"
						/>
						{this.state.hasDescriptionValidationError ? (
							<Text style={styles.errorText}>Enter description</Text>
						) : null}
					</View>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity activeOpacity={1} onPress={this.addSubSpecies}>
							<Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
						</TouchableOpacity>

						<TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
							<Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>

			<ModalMenu
				visible={this.state.isAnimalClassMenuOpen}
				closeAction={this.toggleAnimalClassMenu}
			>
				{this.state.animalClass.map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setClassData.bind(this, v)}
						key={v.id.toString()}
					>
						<Text style={styles.itemtitle}>{v.group_name}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>

			<ModalMenu
				visible={this.state.isSpeciesMenuOpen}
				closeAction={this.toggleSpeciesMenu}
			>
				{this.state.species.map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setSpeciesData.bind(this, v)}
						key={v.id.toString()}
					>
						<Text style={styles.itemtitle}>{v.species_name}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>

			<ModalMenu
				visible={this.state.modalVisible}
				closeAction={this.toggleModalVisible}
			>
				{[1, 2, 3, 4, 5].map((v, i) => (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.item}
						onPress={this.setPriority.bind(this, v)}
						key={i}
					>
						<Text style={styles.itemtitle}>{v}</Text>
					</TouchableOpacity>
				))}
			</ModalMenu>
		</Container>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 	},
// 	chooseCatContainer: {
// 		flexDirection: "row",
// 		marginVertical: 10,
// 		paddingHorizontal: 10,
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 	},
// 	imageContainer: {
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		padding: 3,
// 		backgroundColor: "#fff",
// 		borderRadius: 3,
// 	},
// 	image: {
// 		height: 50,
// 		width: 50,
// 	},
// 	defaultImgIcon: {
// 		fontSize: 50,
// 		color: "#adadad",
// 	},
// 	name: {
// 		fontSize: Colors.lableSize,
// 		fontWeight: "800",
// 		marginBottom: 10,
// 	},
// 	buttonsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 		marginVertical: 30,
// 	},
// 	inputText: {
// 		height: 50,
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		fontSize: Colors.textSize,
// 		backgroundColor: "#f9f6f6",
// 		paddingHorizontal: 10,
// 	},
// 	inputTextArea: {
// 		height: 150,
// 		borderWidth: 1,
// 		borderColor: "#ccc",
// 		backgroundColor: "#f9f6f6",
// 		textAlignVertical: "top",
// 		padding: 10,
// 	},
// 	inputContainer: {
// 		marginVertical: 10,
// 		padding: 10,
// 	},
// 	pb0: {
// 		paddingBottom: 0,
// 	},
// 	mb0: {
// 		marginBottom: 0,
// 	},
// 	buttonText: {
// 		fontSize: Colors.textSize,
// 		fontWeight: "bold",
// 	},
// 	saveBtnText: {
// 		color: Colors.primary,
// 	},
// 	exitBtnText: {
// 		color: Colors.activeTab,
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
// 	errorText: {
// 		textAlign: "right",
// 		color: Colors.tomato,
// 		fontWeight: "bold",
// 		fontStyle: "italic",
// 	},
// });
=======
  getAnimalGroups,
  getAllCategory,
  getAllSpecies,
  getAllSpeciesByClass,
  addSubSpecies,
} from "../services/APIServices";
import AppContext from "../context/AppContext";
import globalStyles from "../config/Styles";

export default class AddSpecies extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isAnimalClassMenuOpen: false,
      animalClass: [],
      isSpeciesMenuOpen: false,
      modalVisible: false,
      species: [],
      permissionGranted: false,
      classID: undefined,
      className: undefined,
      speciesID: undefined,
      speciesName: undefined,
      imageURI: undefined,
      imageData: undefined,
      subSpeciesName: "",
      prority: undefined,
      description: "",
      hasImageURIValidationError: false,
      hasClassNameValidationError: false,
      hasSpeciesNameValidationError: false,
      hasSubSpeciesNameValidationError: false,
      hasPriorityValidationError: false,
      hasDescriptionValidationError: false,
      showLoader: true,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    let cid = this.context.userDetails.cid;
    getAnimalGroups(cid)
      .then((data) => {
        this.setState({
          animalClass: data,
          showLoader: false,
        });
      })
      .catch((error) => console.log(error));
  };

  toggleAnimalClassMenu = () =>
    this.setState({ isAnimalClassMenuOpen: !this.state.isAnimalClassMenuOpen });

  toggleSpeciesMenu = () =>
    this.setState({ isSpeciesMenuOpen: !this.state.isSpeciesMenuOpen });

  toggleModalVisible = () =>
    this.setState({ modalVisible: !this.state.modalVisible });

  chooseIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        this.setState({
          imageURI: undefined,
          imageData: undefined,
        });

        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              imageURI: result.uri,
              imageData: getFileData(result),
              hasImageURIValidationError: false,
            });
          }
        });
      } else {
        Alert.alert("Please allow permission to choose an icon");
      }
    });
  };

  setClassData = (v) =>
    this.setState(
      {
        classID: v.id,
        className: v.group_name,
        isAnimalClassMenuOpen: false,
        showLoader: true,
      },
      () => {
        let cid = this.context.userDetails.cid;
        getAllSpeciesByClass(cid, v.id).then((arr) => {
          this.setState({
            species: arr,
            showLoader: false,
          });
        });
      }
    );

  setSpeciesData = (v) =>
    this.setState({
      speciesID: v.id,
      speciesName: v.species_name,
      isSpeciesMenuOpen: false,
    });

  setPriority = (v) => this.setState({ prority: v, modalVisible: false });

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  addSubSpecies = () => {
    let { imageURI, classID, speciesID, subSpeciesName, prority, description } =
      this.state;
    this.setState(
      {
        hasImageURIValidationError: false,
        hasClassNameValidationError: false,
        hasSpeciesNameValidationError: false,
        hasSubSpeciesNameValidationError: false,
        hasPriorityValidationError: false,
        hasDescriptionValidationError: false,
      },
      () => {
        if (typeof imageURI === "undefined") {
          this.setState({ hasImageURIValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof classID === "undefined") {
          this.setState({ hasClassNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof speciesID === "undefined") {
          this.setState({ hasSpeciesNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (subSpeciesName.trim().length === 0) {
          this.setState({ hasSubSpeciesNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (typeof prority === "undefined") {
          this.setState({ hasPriorityValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else if (description.trim().length === 0) {
          this.setState({ hasDescriptionValidationError: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            cid: this.context.userDetails.cid,
            class_id: classID,
            sub_species_icon: this.state.imageData,
            sub_species_name: subSpeciesName,
            prority: prority,
            description: description,
            species_id: speciesID,
          };

          addSubSpecies(obj)
            .then((response) => {
              let subSpecies = this.context.subSpecies;
              subSpecies.unshift(response.data);
              this.context.setSubSpecies(subSpecies);

              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((error) => console.log(error));
        }
      }
    );
  };

  gotoBack = () => this.props.navigation.goBack();

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={"Add Sub Species"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={styles.container}>
        <ScrollView ref={this.formScrollViewRef}>
          <View style={styles.chooseCatContainer}>
            <Text style={styles.name}>Choose Icon</Text>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.imageContainer}
              onPress={this.chooseIcon}
            >
              {typeof this.state.imageURI !== "undefined" ? (
                <Image
                  style={styles.image}
                  source={{ uri: this.state.imageURI }}
                />
              ) : (
                <Ionicons name="image" style={styles.defaultImgIcon} />
              )}
            </TouchableOpacity>
          </View>
          {this.state.hasImageURIValidationError ? (
            <View style={globalStyles.mr10}>
              <Text style={styles.errorText}>Choose an icon</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.name}>Choose Class</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.toggleAnimalClassMenu}
              style={[styles.inputText, { justifyContent: "center" }]}
            >
              <Text style={{ fontSize: Colors.textSize }}>
                {this.state.className}
              </Text>
            </TouchableOpacity>
            {this.state.hasClassNameValidationError ? (
              <Text style={styles.errorText}>Choose animal class</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.name}>Species Name</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.toggleSpeciesMenu}
              style={[styles.inputText, { justifyContent: "center" }]}
            >
              <Text style={{ fontSize: Colors.textSize }}>
                {this.state.speciesName}
              </Text>
            </TouchableOpacity>
            {this.state.hasSpeciesNameValidationError ? (
              <Text style={styles.errorText}>Choose species name</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.name}>Sub Species Name</Text>
            <TextInput
              value={this.state.subSpeciesName}
              style={styles.inputText}
              onChangeText={(subSpeciesName) =>
                this.setState({ subSpeciesName })
              }
              autoCompleteType="off"
              autoCapitalize="words"
            />
            {this.state.hasSubSpeciesNameValidationError ? (
              <Text style={styles.errorText}>Enter sub species name</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.name}>Choose Priority</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.toggleModalVisible}
              style={[styles.inputText, { justifyContent: "center" }]}
            >
              <Text style={{ fontSize: Colors.textSize }}>
                {this.state.prority}
              </Text>
            </TouchableOpacity>
            {this.state.hasPriorityValidationError ? (
              <Text style={styles.errorText}>Choose priority</Text>
            ) : null}
          </View>

          <View style={[styles.inputContainer, styles.pb0, styles.mb0]}>
            <Text style={styles.name}>Description</Text>
            <TextInput
              multiline={true}
              numberOfLines={10}
              style={styles.inputTextArea}
              value={this.state.description}
              onChangeText={(description) => this.setState({ description })}
              autoCompleteType="off"
              autoCapitalize="words"
            />
            {this.state.hasDescriptionValidationError ? (
              <Text style={styles.errorText}>Enter description</Text>
            ) : null}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addSubSpecies}>
              <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ModalMenu
        visible={this.state.isAnimalClassMenuOpen}
        closeAction={this.toggleAnimalClassMenu}
      >
        {this.state.animalClass.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setClassData.bind(this, v)}
            key={v.id.toString()}
          >
            <Text style={styles.itemtitle}>{v.group_name}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>

      <ModalMenu
        visible={this.state.isSpeciesMenuOpen}
        closeAction={this.toggleSpeciesMenu}
      >
        {this.state.species.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setSpeciesData.bind(this, v)}
            key={v.id.toString()}
          >
            <Text style={styles.itemtitle}>{v.species_name}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>

      <ModalMenu
        visible={this.state.modalVisible}
        closeAction={this.toggleModalVisible}
      >
        {[1, 2, 3, 4, 5].map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setPriority.bind(this, v)}
            key={i}
          >
            <Text style={styles.itemtitle}>{v}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chooseCatContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  image: {
    height: 50,
    width: 50,
  },
  defaultImgIcon: {
    fontSize: 50,
    color: "#adadad",
  },
  name: {
    fontSize: Colors.lableSize,
    fontWeight: "800",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 30,
  },
  inputText: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: Colors.textSize,
    backgroundColor: "#f9f6f6",
    paddingHorizontal: 10,
  },
  inputTextArea: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f6f6",
    textAlignVertical: "top",
    padding: 10,
  },
  inputContainer: {
    marginVertical: 10,
    padding: 10,
  },
  pb0: {
    paddingBottom: 0,
  },
  mb0: {
    marginBottom: 0,
  },
  buttonText: {
    fontSize: Colors.textSize,
    fontWeight: "bold",
  },
  saveBtnText: {
    color: Colors.primary,
  },
  exitBtnText: {
    color: Colors.activeTab,
  },
  item: {
    height: 35,
    backgroundColor: "#00b386",
    alignItems: "center",
    justifyContent: "center",
  },
  itemtitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: Colors.textSize,
  },
  errorText: {
    textAlign: "right",
    color: Colors.tomato,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
>>>>>>> de4a6c22111ede957b711942ef56237399a4582e
