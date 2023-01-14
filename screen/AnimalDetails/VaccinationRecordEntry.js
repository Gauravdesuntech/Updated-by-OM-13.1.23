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
import {
  getAnimalVaccineDetails,
  getAnimalVaccinationRecord,
  saveAnimalVaccinationsRecord,
} from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import ModalMenu from "../../component/ModalMenu";
import OverlayLoader from "../../component/OverlayLoader";
import AppContext from "../../context/AppContext";
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import { getMedicine } from "../../services/MedicalAndIncidenTServices";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import styles from "../../config/Styles";

export default class VaccinationRecordEntry extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      showLoader: true,
      isVaccineMenuOpen: false,
      showAdministrationDatepicker: false,
      showVaccinationsDatepicker: false,
      showNextDateDatepicker: false,
      showExpiryDateDatepicker: false,
      vaccineData: [],
      id:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.id
          : 0,
      vaccineTypeID: undefined,
      vaccineCode: undefined,
      vaccineName: undefined,
      dateOfAdministration: new Date(),
      vaccinationsDate: new Date(),
      nextDate: new Date(),
      dosage: "",
      dosageUnit: "",
      route: "",
      qty: "",
      lot: "",
      expiryDate: new Date(),
      batchNumber: "",
      note: "",
      administratedBy: "",
      isVaccineNameValidationFailed: false,
      isDosageValidationFailed: false,
      isDosageUnitValidationFailed: false,
      isRouteValidationFailed: false,
      isQuantityValidationFailed: false,
      isLotValidationFailed: false,
      isBacthNumberValidationFailed: false,
      isNoteValidationFailed: false,
      isAdministartedByValidationFailed: false,
	  type: '',
    };

    this.scrollViewRef = React.createRef();
  }

  componentDidMount = () => {
	getMedicine(this.context.userDetails.cid).then(data=>{
		console.log(".0.0.0.0.00.0.00.",data)
		this.setState(
			{
		vaccineData: data,
			})
	})
    getAnimalVaccineDetails(this.context.selectedAnimalID)
      .then((data) => {
        this.setState(
          {
            // vaccineData: data,
            showLoader: parseInt(this.state.id) > 0 ? true : false,
          },
          () => {
            getAnimalVaccinationRecord(this.state.id)
              .then((data) => {
                this.setState({
                  vaccineTypeID: data.vaccine_type,
                  vaccineCode: data.vaccine_code,
                  vaccineName: data.vaccine_name,
                  dateOfAdministration: new Date(data.date_of_administration),
                  vaccinationsDate: new Date(data.vacinations_date),
                  nextDate: new Date(data.next_date),
                  dosage: data.dosage,
                  dosageUnit: data.unit,
                  route: data.route,
                  qty: data.qty,
                  lot: data.lot,
                  expiryDate: new Date(data.exp_date),
                  batchNumber: data.batch_number,
                  note: data.note,
                  administratedBy: data.created_by,
                  showLoader: false,
                });
              })
              .catch((error) => console.log(error));
          }
        );
      })
      .catch((error) => console.log(error));
  };
  showDatePicker = (type) => {
    this.setState({ show: true, type: type })
  };

  handleConfirm = (selectDate) => {
    if (this.state.type == 'Administration') {
		const currentDate = selectDate || this.state.dateOfAdministration;
      this.setState({
        dateOfAdministration: currentDate,
      });
    } else if (this.state.type == 'Vaccinations') {
		const currentDate = selectDate || this.state.vaccinationsDate;
      this.setState({
        vaccinationsDate: currentDate,
      });
    } else if (this.state.type == 'next') {
		const currentDate = selectDate || this.state.nextDate;
      this.setState({
        nextDate: currentDate,
      });
    }else if (this.state.type == 'expiry'){
		const currentDate = selectDate || this.state.expiryDate;
      this.setState({
        expiryDate: currentDate,
      });
    }
    this.hideDatePicker();
  }

  hideDatePicker = () => {
    this.setState({ show: false })
  }
//   onChangeDate = (event, selectedDate) => {
//     const currentDate = selectedDate || this.state.dateOfAdministration;
//     this.setState({
//       showAdministrationDatepicker: false,
//       dateOfAdministration: currentDate,
//     });
//   };

//   onVaccinationsDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || this.state.vaccinationsDate;
//     this.setState({
//       showVaccinationsDatepicker: false,
//       vaccinationsDate: currentDate,
//     });
//   };

//   onNextDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || this.state.nextDate;
//     this.setState({
//       showNextDateDatepicker: false,
//       nextDate: currentDate,
//     });
//   };

//   onExpiryDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || this.state.expiryDate;
//     this.setState({
//       showExpiryDateDatepicker: false,
//       expiryDate: currentDate,
//     });
//   };

  showAdministrationDatepicker = () =>
    this.setState({ showAdministrationDatepicker: true });

  openVaccinationsDatepicker = () =>
    this.setState({ showVaccinationsDatepicker: true });

  openNextDateDatepicker = () =>
    this.setState({ showNextDateDatepicker: true });

  openExpiryDateDatepicker = () =>
    this.setState({ showExpiryDateDatepicker: true });

  gotoBack = () => this.props.navigation.goBack();

  toggVaccineMenu = () =>
    this.setState({ isVaccineMenuOpen: !this.state.isVaccineMenuOpen });

  setVaccineData = (v) => {
    this.setState({
      vaccineTypeID: v.id,
      vaccineCode: v.vaccine_code,
      vaccineName: v.name,
      isVaccineMenuOpen: false,
    });
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveVaccineRecord = () => {
    this.setState(
      {
        isVaccineNameValidationFailed: false,
        isDosageValidationFailed: false,
        isDosageUnitValidationFailed: false,
        isRouteValidationFailed: false,
        isQuantityValidationFailed: false,
        isLotValidationFailed: false,
        isBacthNumberValidationFailed: false,
        isNoteValidationFailed: false,
        isAdministartedByValidationFailed: false,
      },
      () => {
        let {
          vaccineName,
          dosage,
          dosageUnit,
          route,
          qty,
          lot,
          batchNumber,
          note,
          administratedBy,
        } = this.state;

        if (typeof vaccineName === "undefined") {
          this.setState({ isVaccineNameValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (dosage.trim().length === 0) {
          this.setState({ isDosageValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (dosageUnit.trim().length === 0) {
          this.setState({ isDosageUnitValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (route.trim().length === 0) {
          this.setState({ isRouteValidationFailed: true });
          this.scrollViewScrollTop();
        } else if (qty.trim().length === 0) {
          this.setState({ isQuantityValidationFailed: true });
        } else if (lot.trim().length === 0) {
          this.setState({ isLotValidationFailed: true });
        } else if (batchNumber.trim().length === 0) {
          this.setState({ isBacthNumberValidationFailed: true });
        } else if (note.trim().length === 0) {
          this.setState({ isNoteValidationFailed: true });
        } else if (administratedBy.trim().length === 0) {
          this.setState({ isAdministartedByValidationFailed: true });
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            animal_code: this.context.selectedAnimalID,
            vaccine_code: this.state.vaccineCode,
            vaccine_type: this.state.vaccineTypeID,
            date_of_administration: getFormattedDate(
              this.state.dateOfAdministration
            ),
            vacinations_date: getFormattedDate(this.state.vaccinationsDate),
            next_date: getFormattedDate(this.state.nextDate),
            dosage: dosage,
            unit: dosageUnit,
            route: route,
            qty: qty,
            lot: lot,
            exp_date: getFormattedDate(this.state.expiryDate),
            batch_number: batchNumber,
            note: note,
            created_by: administratedBy,
          };

          saveAnimalVaccinationsRecord(obj)
            .then((response) => {
              let id = response.data.id;
              let animalVaccinationDetails =
                this.context.animalVaccinationDetails;
              let index = animalVaccinationDetails.findIndex(
                (element) => element.id === id
              );

              let dataObj = {
                id: id,
                vaccine_name: this.state.vaccineName,
                next_date: this.state.nextDate,
              };

              if (index > -1) {
                animalVaccinationDetails[index] = dataObj;
              } else {
                animalVaccinationDetails.unshift(dataObj);
              }

              this.context.setAnimalVaccinationDetails(
                animalVaccinationDetails
              );
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
        title={"Vaccinations Record Entry"}
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
              onPress={this.toggVaccineMenu}
              style={[
                styles.fieldBox,
                this.state.isVaccineNameValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Vaccine Name:</Text>
              <TextInput
                value={this.state.vaccineName}
                editable={false}
                style={[styles.textfield,{width:'50%'}]}
              />
            </TouchableOpacity>

            {/* <DatePicker
              onPress={this.showAdministrationDatepicker}
              show={this.state.showAdministrationDatepicker}
              onChange={this.onChangeDate}
              date={this.state.dateOfAdministration}
              mode={"date"}
              label={"Administration Date:"}
            /> */}
			  <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Administration Date:</Text>
                <TouchableOpacity activeOpacity={1} style={[{flexDirection:'row',alignItems:'center',width:'50%'}]} onPress={() => { this.showDatePicker("Administration") }}>
                  <Text style={[styles.dateField]}>{this.state.dateOfAdministration.toDateString()}</Text>
                  <AntDesign name="calendar" color={Colors.primary}  size={20} />
                </TouchableOpacity>
              </View>

            {/* <DatePicker
              onPress={this.openVaccinationsDatepicker}
              show={this.state.showVaccinationsDatepicker}
              onChange={this.onVaccinationsDateChange}
              date={this.state.vaccinationsDate}
              mode={"date"}
              label={"Vaccinations Date:"}
            /> */}
			  <View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Vaccinations Date:</Text>
                <TouchableOpacity activeOpacity={1} style={[{flexDirection:'row',alignItems:'center',width:'50%'}]} onPress={() => { this.showDatePicker("Vaccinations") }}>
                  <Text style={[styles.dateField]}>{this.state.vaccinationsDate.toDateString()}</Text>
                  <AntDesign name="calendar" color={Colors.primary}  size={20} />
                </TouchableOpacity>
              </View>
            {/* <DatePicker
              onPress={this.openNextDateDatepicker}
              show={this.state.showNextDateDatepicker}
              onChange={this.onNextDateChange}
              date={this.state.nextDate}
              mode={"date"}
              label={"Next Date:"}
            /> */}

<View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Next Date:</Text>
                <TouchableOpacity activeOpacity={1} style={[{flexDirection:'row',alignItems:'center',width:'50%'}]} onPress={() => { this.showDatePicker("next") }}>
                  <Text style={[styles.dateField]}>{this.state.nextDate.toDateString()}</Text>
                  <AntDesign name="calendar" color={Colors.primary}  size={20} />
                </TouchableOpacity>
              </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isDosageValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Dosage:</Text>
              <TextInput
                value={this.state.dosage}
                onChangeText={(dosage) => this.setState({ dosage })}
                style={[styles.textfield,{width:'50%'}]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isDosageUnitValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Dosage Unit:</Text>
              <TextInput
                value={this.state.dosageUnit}
                onChangeText={(dosageUnit) => this.setState({ dosageUnit })}
                style={[styles.textfield,{width:'50%'}]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isRouteValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Route:</Text>
              <TextInput
                value={this.state.route}
                onChangeText={(route) => this.setState({ route })}
                style={[styles.textfield,{width:'50%'}]}
                autoCapitalize="words"
                autoCompleteType="off"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isQuantityValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Quantity:</Text>
              <TextInput
                value={this.state.qty}
                onChangeText={(qty) => this.setState({ qty })}
                style={[styles.textfield,{width:'50%'}]}
                keyboardType="numeric"
                autoCompleteType="off"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isLotValidationFailed ? styles.errorFieldBox : null,
              ]}
            >
              <Text style={styles.labelName}>Lot #:</Text>
              <TextInput
                value={this.state.lot}
                onChangeText={(lot) => this.setState({ lot })}
                style={[styles.textfield,{width:'50%'}]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            {/* <DatePicker
              onPress={this.openExpiryDateDatepicker}
              show={this.state.showExpiryDateDatepicker}
              onChange={this.onExpiryDateChange}
              date={this.state.expiryDate}
              mode={"date"}
              label={"Expiry Date:"}
            /> */}
			<View style={[styles.fieldBox]}>
                <Text style={styles.labelName}>Expiry Date:</Text>
                <TouchableOpacity activeOpacity={1} style={[{flexDirection:'row',alignItems:'center',width:'50%'}]} onPress={() => { this.showDatePicker("expiry") }}>
                  <Text style={[styles.dateField]}>{this.state.expiryDate.toDateString()}</Text>
                  <AntDesign name="calendar" color={Colors.primary}  size={20} />
                </TouchableOpacity>
              </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isBacthNumberValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Batch Number:</Text>
              <TextInput
                value={this.state.batchNumber}
                onChangeText={(batchNumber) => this.setState({ batchNumber })}
                style={[styles.textfield,{width:'50%'}]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isNoteValidationFailed ? styles.errorFieldBox : null,
              ]}
            >
              <Text style={styles.labelName}>Note:</Text>
              <TextInput
                value={this.state.note}
                onChangeText={(note) => this.setState({ note })}
                style={[styles.textfield,{width:'50%'}]}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>

            <View
              style={[
                styles.fieldBox,
                this.state.isAdministartedByValidationFailed
                  ? styles.errorFieldBox
                  : null,
              ]}
            >
              <Text style={styles.labelName}>Administrated by:</Text>
              <TextInput
                value={this.state.administratedBy}
                onChangeText={(administratedBy) =>
                  this.setState({ administratedBy })
                }
                style={[styles.textfield, { width: "50%" }]}
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
        visible={this.state.isVaccineMenuOpen}
        closeAction={this.toggVaccineMenu}
      >
        {this.state.vaccineData.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setVaccineData.bind(this, v)}
            key={v.id.toString()}
          >
            <Text style={styles.itemtitle}>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>
	  <DateTimePickerModal
        mode={'date'}
        display={Platform.OS == 'ios' ? 'inline' : 'default'}
        isVisible={this.state.show}
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
      />
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
//     alignItems: "center",
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
//     backgroundColor: "#fff",
//     height: "auto",

//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   dateField: {
//     backgroundColor: "#fff",
//     height: "auto",

//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     padding: 5,
//   },
//   textfielddate: {
//     backgroundColor: "#fff",
//     height: 40,
//     lineHeight: 30,
//     fontSize: Colors.textSize,
//     color: Colors.textColor,
//     textAlign: "left",
//     width: "50%",
//     padding: 5,
//     fontWeight: "bold",
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
//     fontSize: Colors.lableSize,
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
