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
import { Header } from "../../component";
import Colors from "../../config/colors";
import ModalMenu from "../../component/ModalMenu";
import { getMedicine } from "../../services/MedicalAndIncidenTServices";
import {
  getVaccineTypes,
  getVaccines,
  getAnimalVaccineRecord,
  saveAnimalVaccineRecord,
} from "../../services/APIServices";
import OverlayLoader from "../../component/OverlayLoader";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class VaccineRecordEntry extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      isVaccineTypeMenuOpen: false,
      isVaccineNameMenuOpen: false,
      vaccineTypesArr: [],
      vaccineNamesArr: [],
      id:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.id
          : 0,
      vaccineTypeID: undefined,
      vaccineType: undefined,
      vaccineCode: undefined,
      vaccineName: undefined,
      frequency: "",
      dosage: "",
      route: "",
      description: "",
      isVaccineTypeValidationFailed: false,
      isVaccineNameValidationFailed: false,
      isFrequencyValidationFailed: false,
      isDosageValidationFailed: false,
      isRouteValidationFailed: false,
      isDescriptionValidationFailed: false,
    };
    this.scrollViewRef = React.createRef();
  }

  componentDidMount = () => {
	getMedicine(this.context.userDetails.cid).then(data=>{
		this.setState(
			{
				vaccineNamesArr: data,
			})
	})
    getVaccineTypes()
      .then((vaccineTypesData) => {
        this.setState({
          vaccineTypesArr: vaccineTypesData,
          showLoader: parseInt(this.state.id) > 0 ? true : false,
        });

        if (parseInt(this.state.id) > 0) {
          getAnimalVaccineRecord(this.state.id)
            .then((data) => {
              this.setState({
                vaccineTypeID: data.vaccine_type_id,
                vaccineType: data.vaccine_type,
                vaccineCode: data.vaccine_code,
                vaccineName: data.vaccine_name,
                frequency: data.frequency,
                dosage: data.dosage,
                route: data.route,
                description: data.description,
                showLoader: false,
              });
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  };

  gotoBack = () => this.props.navigation.goBack();

  toggleVaccineTypeMenu = () =>
    this.setState({
      isVaccineTypeMenuOpen: !this.state.isVaccineTypeMenuOpen,
    });

  toggleVaccineNameMenu = () =>
    this.setState({
      isVaccineNameMenuOpen: !this.state.isVaccineNameMenuOpen,
    });

  setVaccineTypeData = (v) => {
    this.setState(
      {
        vaccineTypeID: v.id,
        vaccineType: v.vaccine_type,
        isVaccineTypeMenuOpen: false,
        vaccineCode: undefined,
        // vaccineName: undefined,
        showLoader: true,
      },
      () => {
        getVaccines(v.id)
          .then((vaccineData) => {
            this.setState({
            //   vaccineNamesArr: vaccineData,
              showLoader: false,
            });
          })
          .catch((error) => console.log(error));
      }
    );
  };

  setVaccineNameData = (v) => {
    this.setState({
      isVaccineNameMenuOpen: false,
      vaccineCode: v.vaccine_code,
      vaccineName: v.name,
    });
  };

  scrollViewScrollTop = () =>
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });

  saveVaccineRecord = () => {
    this.setState(
      {
        isVaccineTypeValidationFailed: false,
        isVaccineNameValidationFailed: false,
        isFrequencyValidationFailed: false,
        isDosageValidationFailed: false,
        isRouteValidationFailed: false,
        isDescriptionValidationFailed: false,
      },
      () => {
        let {
          vaccineTypeID,
          vaccineCode,
          frequency,
          dosage,
          route,
          description,
        } = this.state;

        if (typeof vaccineTypeID === "undefined") {
          this.setState({ isVaccineTypeValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (typeof vaccineCode === "undefined") {
          this.setState({ isVaccineNameValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (frequency.trim().length === 0) {
          this.setState({ isFrequencyValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (dosage.trim().length === 0) {
          this.setState({ isDosageValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (route.trim().length === 0) {
          this.setState({ isRouteValidationFailed: true });
        } else if (description.trim().length === 0) {
          this.setState({ isDescriptionValidationFailed: true });
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            animals_code: this.context.selectedAnimalID,
            vaccine_code: vaccineCode,
            vaccine_type: vaccineTypeID,
            frequency: frequency,
            dosage: dosage,
            route: route,
            description: description,
          };

          saveAnimalVaccineRecord(obj)
            .then((response) => {
              let id = response.data.id;
              let animalVaccines = this.context.animalVaccines;
              let index = animalVaccines.findIndex(
                (element) => element.id === id
              );
              let dataObj = {
                id: id,
                vaccine_type_id: vaccineTypeID,
                vaccine_type: this.state.vaccineType,
                vaccine_code: vaccineCode,
                vaccine_name: this.state.vaccineName,
              };

              if (index > -1) {
                animalVaccines[index] = dataObj;
              } else {
                animalVaccines.unshift(dataObj);
              }

              this.context.setAnimalVaccines(animalVaccines);
              this.setState({ showLoader: false });
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
        title={"Vaccine Record Entry"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={styles.container}>
        <ScrollView
          ref={this.scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
			 <View
           style={styles.formBorder}
          >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleVaccineTypeMenu}
            style={[
              styles.fieldBox,
              this.state.isVaccineTypeValidationFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Vaccine Type:</Text>
            <TextInput
              editable={false}
              value={this.state.vaccineType}
              style={[styles.textfield,{width:'60%'}]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleVaccineNameMenu}
            style={[
              styles.fieldBox,
              this.state.isVaccineNameValidationFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Vaccine Name:</Text>
            <TextInput
              editable={false}
              value={this.state.vaccineName}
              style={[styles.textfield,{width:'60%'}]}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.fieldBox,
              this.state.isFrequencyValidationFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Frequency:</Text>
            <TextInput
              value={this.state.frequency}
              onChangeText={(frequency) => this.setState({ frequency })}
              style={[styles.textfield,{width:'60%'}]}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <View
            style={[
              styles.fieldBox,
              this.state.isDosageValidationFailed ? styles.errorFieldBox : null,
            ]}
          >
            <Text style={styles.labelName}>Dosage:</Text>
            <TextInput
              value={this.state.dosage}
              onChangeText={(dosage) => this.setState({ dosage })}
              style={[styles.textfield,{width:'60%'}]}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <View
            style={[
              styles.fieldBox,
              this.state.isRouteValidationFailed ? styles.errorFieldBox : null,
            ]}
          >
            <Text style={styles.labelName}>Route:</Text>
            <TextInput
              value={this.state.route}
              onChangeText={(route) => this.setState({ route })}
              style={[styles.textfield,{width:'60%'}]}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <View
            style={[
              styles.fieldBox,{borderBottomWidth:0},
              this.state.isDescriptionValidationFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Description:</Text>
            <TextInput
              value={this.state.description}
              onChangeText={(description) => this.setState({ description })}
              style={[styles.textfield,{width:'60%'}]}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>
		  </View>
          <TouchableOpacity
            style={styles.button}
            onPress={this.saveVaccineRecord}
          >
            <Text style={styles.textWhite}>Save Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ModalMenu
        visible={this.state.isVaccineTypeMenuOpen}
        closeAction={this.toggleVaccineTypeMenu}
      >
        {this.state.vaccineTypesArr.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setVaccineTypeData.bind(this, v)}
            key={v.id.toString()}
          >
            <Text style={styles.itemtitle}>{v.vaccine_type}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>

      <ModalMenu
        visible={this.state.isVaccineNameMenuOpen}
        closeAction={this.toggleVaccineNameMenu}
      >
        {this.state.vaccineNamesArr.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setVaccineNameData.bind(this, v)}
            key={v.id.toString()}
          >
            <Text style={styles.itemtitle}>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>

      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 8,
//   },
//   fieldBox: {
// 	alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderBottomWidth: 1,
//     backgroundColor: "#fff",
//     height: "auto",
//     justifyContent: "space-between",
//   },
//   textfield: {
// 	backgroundColor: "#fff",
//     height: "auto",

//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   button: {
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     padding: 10,
//     // shadowColor: "#000",
//     // shadowOffset: {
//     //   width: 0,
//     //   height: 2,
//     // },
//     // shadowOpacity: 0.23,
//     // shadowRadius: 2.62,
//     // elevation: 4,
//     borderRadius: 20,
//     color: "#fff",
//     marginVertical: 10,
//   },
//   textWhite: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize:Colors.lableSize,
//   },
//   labelName: {
//     color: Colors.labelColor,
//     // lineHeight: 40,
//     fontSize: Colors.lableSize,
//     paddingLeft: 4,
//     height: "auto",
//     paddingVertical: 10,
//   },
//   textInputIcon: {
//     position: "absolute",
//     bottom: 14,
//     right: 10,
//     marginLeft: 8,
//     color: "#0482ED",
//     zIndex: 99,
//   },
//   item: {
//     height: 35,
//     backgroundColor: "#00b386",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   itemtitle: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: Colors.textSize,
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato,
//   },
// });
